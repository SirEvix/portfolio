<?php
header('Content-Type: application/json');

// Minimal health check to prove PHP execution and basic environment
try {
    $payload = [
        'ok' => true,
        'time' => time(),
        'php' => phpversion(),
        'sapi' => php_sapi_name(),
    ];
    echo json_encode($payload);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'err' => $e->getMessage()]);
}
