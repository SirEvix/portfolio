<?php
// Basic config: reads from environment or fallback values
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'relics_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: '3306');

// Admin key for admin endpoints
define('ADMIN_KEY', getenv('ADMIN_KEY') ?: '');

// Driver in use: will be set to 'mysql' or 'sqlite' by get_pdo()

function get_pdo() {
    static $pdo = null;
    if ($pdo) return $pdo;

    // Try MySQL first (common case when user configured host). If connection fails,
    // fall back to a file-based SQLite DB inside `data/` so the API works without
    // manual DB provisioning.
    $mysqlDsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
    $opts = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    try {
        // If DB_USER/DB_PASS are not set to real values, this may throw
        $pdo = new PDO($mysqlDsn, DB_USER, DB_PASS, $opts);
        define('DB_DRIVER', 'mysql');
        return $pdo;
    } catch (Exception $e) {
        // Fall back to SQLite inside data/ directory
        // Keep the SQLite file inside the php_api/data directory
        $sqlitePath = __DIR__ . '/data/relics.sqlite';
        $sqliteDsn = 'sqlite:' . $sqlitePath;
        try {
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
            // If table empty, try importing from `data/relics.json` if present
            $stmt = $pdo->query('SELECT COUNT(*) AS cnt FROM relics');
            $cnt = $stmt ? (int)$stmt->fetchColumn() : 0;
            if ($cnt === 0) {
                // Import from php_api/data/relics.json if present
                $jsonFile = __DIR__ . '/data/relics.json';
                if (is_readable($jsonFile)) {
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
        } catch (Exception $e2) {
            // rethrow original MySQL error if SQLite also fails
            throw $e;
        }
    }
}

?>