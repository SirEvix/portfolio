<?php
// Basic config loader. Place an optional `config_local.php` next to this file
// to define DB credentials and ADMIN_KEY on the server (this file is ignored
// by the repo and won't overwrite your secrets). If no local config is found
// the API uses a file-based SQLite DB stored in `php_api/data/` so the API
// works immediately after upload without any server-side configuration.

// Attempt to load server-local overrides. Create `php_api/config_local.php`
// on the host with `define('DB_HOST', ...); define('DB_NAME', ...);` etc.
if (file_exists(__DIR__ . '/config_local.php')) {
    include_once __DIR__ . '/config_local.php';
}

// Define safe defaults (SQLite fallback). If you want MySQL, define the
// DB_* constants in `config_local.php` on the server.
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', '');
if (!defined('DB_USER')) define('DB_USER', '');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_PORT')) define('DB_PORT', '3306');
if (!defined('ADMIN_KEY')) define('ADMIN_KEY', 'REPLACE_WITH_ADMIN_KEY');

// Driver in use: will be set to 'mysql' or 'sqlite' by get_pdo()

function get_pdo() {
    static $pdo = null;
    if ($pdo) return $pdo;
    // Try MySQL only when DB_USER/DB_NAME are provided. Otherwise go straight
    // to the SQLite fallback (this avoids noisy errors on hosts without MySQL
    // credentials configured).
    $mysqlDsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
    $opts = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    // If credentials are provided, attempt MySQL first; otherwise skip straight to SQLite.
    if (DB_USER !== '' && DB_NAME !== '') {
        try {
            $pdo = new PDO($mysqlDsn, DB_USER, DB_PASS, $opts);
            define('DB_DRIVER', 'mysql');
            return $pdo;
        } catch (Exception $e) {
            error_log('[php_api] MySQL connection failed: ' . $e->getMessage());
            // continue to SQLite fallback
        }
    }

    // Fall back to SQLite inside data/ directory
    $sqlitePath = __DIR__ . '/data/relics.sqlite';
    $sqliteDsn = 'sqlite:' . $sqlitePath;
    // Ensure data directory exists
    $dataDir = dirname($sqlitePath);
    if (!is_dir($dataDir)) @mkdir($dataDir, 0755, true);
    $pdo = new PDO($sqliteDsn, null, null, $opts);
    define('DB_DRIVER', 'sqlite');
    // Initialize schema if needed
    $pdo->exec("CREATE TABLE IF NOT EXISTS relics (
                id INTEGER PRIMARY KEY,
                token_hash TEXT,
                internal_code_hash TEXT,
                status TEXT,
                owner_name TEXT,
                owner_date TEXT
            );");
    // If table has fewer rows than the CSV, import CSV to ensure authoritative dataset
    $stmt = $pdo->query('SELECT COUNT(*) AS cnt FROM relics');
    $cnt = $stmt ? (int)$stmt->fetchColumn() : 0;
    $csvFile = __DIR__ . '/data/relics.csv';
    $jsonFile = __DIR__ . '/data/relics.json';
    $csvCount = 0;
    if (is_readable($csvFile)) {
        if (($h = fopen($csvFile, 'r')) !== false) {
            // count lines excluding header
            $hdr = fgetcsv($h);
            while (fgetcsv($h) !== false) $csvCount++;
            fclose($h);
        }
    }
    if ($cnt === 0 || ($csvCount > 0 && $csvCount > $cnt)) {
        // Prefer CSV import if present (authoritative dump), otherwise fall back to JSON seed
        if ($csvCount > 0 && is_readable($csvFile)) {
            try {
                $f = fopen($csvFile, 'r');
                if ($f !== false) {
                    $header = fgetcsv($f);
                    if ($header !== false) {
                        $map = array_map('trim', $header);
                        $pdo->beginTransaction();
                        $ins = $pdo->prepare('INSERT OR IGNORE INTO relics (id, token_hash, internal_code_hash, status, owner_name, owner_date) VALUES (:id,:token_hash,:internal_code_hash,:status,:owner_name,:owner_date)');
                        while (($row = fgetcsv($f)) !== false) {
                            $rec = [];
                            foreach ($map as $i => $col) {
                                $val = $row[$i] ?? null;
                                if ($val === '') $val = null;
                                $rec[$col] = $val;
                            }
                            $ins->execute([
                                ':id' => isset($rec['id']) ? (int)$rec['id'] : null,
                                ':token_hash' => $rec['token_hash'] ?? null,
                                ':internal_code_hash' => $rec['internal_code_hash'] ?? null,
                                ':status' => $rec['status'] ?? null,
                                ':owner_name' => $rec['owner_name'] ?? null,
                                ':owner_date' => $rec['owner_date'] ?? null,
                            ]);
                        }
                        $pdo->commit();
                    }
                    fclose($f);
                }
            } catch (Exception $e) {
                error_log('[php_api] CSV import failed: ' . $e->getMessage());
                if ($pdo->inTransaction()) $pdo->rollBack();
            }
        } elseif (is_readable($jsonFile)) {
            $txt = file_get_contents($jsonFile);
            $arr = json_decode($txt, true);
            if (is_array($arr)) {
                $ins = $pdo->prepare('INSERT OR IGNORE INTO relics (id, token_hash, internal_code_hash, status, owner_name, owner_date) VALUES (:id,:token_hash,:internal_code_hash,:status,:owner_name,:owner_date)');
                foreach ($arr as $r) {
                    $ins->execute([
                        ':id' => $r['id'] ?? null,
                        ':token_hash' => $r['token_hash'] ?? null,
                        ':internal_code_hash' => $r['internal_code_hash'] ?? null,
                        ':status' => $r['status'] ?? null,
                        ':owner_name' => $r['owner_name'] ?? null,
                        ':owner_date' => $r['owner_date'] ?? null,
                    ]);
                }
            }
        }
    }
    return $pdo;
}

?>