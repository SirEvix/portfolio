<?php
header('Content-Type: application/json');
try {
    echo json_encode([
        'ok' => true,
        'msg' => 'relics test endpoint reachable',
        'time' => time(),
        'php' => phpversion(),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'err' => $e->getMessage()]);
}
