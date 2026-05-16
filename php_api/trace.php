<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$resp = ['ok' => false, 'time' => date(DATE_ISO8601)];

try {
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        if (!@mkdir($dataDir, 0755, true)) {
            throw new Exception('Could not create data directory: ' . $dataDir);
        }
    }
    $file = $dataDir . '/trace.txt';
    $txt = "trace: " . date(DATE_ISO8601) . "\n";
    $w = @file_put_contents($file, $txt, FILE_APPEND | LOCK_EX);
    if ($w === false) throw new Exception('Failed to write to ' . $file);
    $resp['ok'] = true;
    $resp['file'] = 'php_api/data/trace.txt';
    $resp['written_bytes'] = $w;
    $resp['tail'] = trim( @file_get_contents($file) );
} catch (Exception $e) {
    http_response_code(500);
    $resp['error'] = $e->getMessage();
}

echo json_encode($resp, JSON_PRETTY_PRINT);

?>
