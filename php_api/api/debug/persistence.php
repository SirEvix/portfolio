<?php
require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();

try {
    $status = get_persistence_status();
    $tail = null;
    $log = __DIR__ . '/../../data/persist.log';
    if (file_exists($log)) {
        $raw = file_get_contents($log);
        $lines = array_filter(preg_split('/\r?\n/', $raw));
        $tail = array_slice($lines, -50);
    }
    send_json(['status' => $status, 'persist_log_tail' => $tail]);
} catch (Exception $e) {
    send_json(['error' => 'debug_failed', 'detail' => (string)$e->getMessage()], 500);
}

?>