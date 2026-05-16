<?php
// One-time migration endpoint.
// Usage: GET /php_api/run_migration_csv.php?key=ADMIN_KEY
// Upload your full `relics.csv` to `php_api/data/relics.csv` (or `relics.json`) then call this.

// Temporary debug: enable errors and convert to exceptions so we can see server-side issues
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
set_exception_handler(function ($e) {
    http_response_code(500);
    error_log('[php_api] uncaught exception: ' . $e->getMessage() . " in " . $e->getFile() . ':' . $e->getLine());
    echo json_encode(['ok' => false, 'error' => 'exception', 'message' => $e->getMessage()]);
    exit;
});
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/db.php';

header('Content-Type: application/json');

try {
    $key = $_GET['key'] ?? '';
    if (!defined('ADMIN_KEY') || ADMIN_KEY === '' || $key !== ADMIN_KEY) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'invalid_key']);
        exit;
    }

    set_time_limit(0);

    $csvPath = __DIR__ . '/data/relics.csv';
    $jsonPath = __DIR__ . '/data/relics.json';
    $imported = 0;
    $errors = [];

    if (file_exists($csvPath)) {
        $f = fopen($csvPath, 'r');
        if ($f === false) {
            echo json_encode(['ok' => false, 'error' => 'cannot_open_csv']);
            exit;
        }
        $header = fgetcsv($f);
        if ($header === false) {
            echo json_encode(['ok' => false, 'error' => 'empty_csv']);
            exit;
        }
        // Normalize header
        $map = array_map('trim', $header);
        while (($row = fgetcsv($f)) !== false) {
            $rec = [];
            foreach ($map as $i => $col) {
                $val = isset($row[$i]) ? $row[$i] : null;
                if ($val === '') $val = null;
                $rec[$col] = $val;
            }
            // coerce fields
            $r = [
                'id' => isset($rec['id']) ? (int)$rec['id'] : null,
                'token_hash' => $rec['token_hash'] ?? null,
                'internal_code_hash' => $rec['internal_code_hash'] ?? null,
                'status' => $rec['status'] ?? null,
                'owner_name' => $rec['owner_name'] ?? null,
                'owner_date' => $rec['owner_date'] ?? null,
            ];
            if ($r['id'] === null) continue;
            $ok = upsert_relic($r);
            if ($ok) $imported++; else $errors[] = $r['id'];
        }
        fclose($f);
        echo json_encode(['ok' => true, 'imported' => $imported, 'errors' => $errors]);
        exit;
    }

    // fallback to json
    if (file_exists($jsonPath)) {
        $data = json_decode(file_get_contents($jsonPath), true);
        if (!is_array($data)) {
            echo json_encode(['ok' => false, 'error' => 'invalid_json']);
            exit;
        }
        foreach ($data as $item) {
            $r = [
                'id' => isset($item['id']) ? (int)$item['id'] : null,
                'token_hash' => $item['token_hash'] ?? null,
                'internal_code_hash' => $item['internal_code_hash'] ?? null,
                'status' => $item['status'] ?? null,
                'owner_name' => $item['owner_name'] ?? null,
                'owner_date' => isset($item['owner_date']) ? $item['owner_date'] : null,
            ];
            if ($r['id'] === null) continue;
            $ok = upsert_relic($r);
            if ($ok) $imported++; else $errors[] = $r['id'];
        }
        echo json_encode(['ok' => true, 'imported' => $imported, 'errors' => $errors]);
        exit;
    }

    echo json_encode(['ok' => false, 'error' => 'no_source_found', 'checked' => [$csvPath, $jsonPath]]);
} catch (Throwable $e) {
    http_response_code(500);
    error_log('[php_api] error in run_migration_csv.php: ' . $e->getMessage());
    echo json_encode(['ok' => false, 'error' => 'exception', 'message' => $e->getMessage()]);
}

?>
