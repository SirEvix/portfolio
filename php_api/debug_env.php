<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Use the app config so the MySQL test uses the same credentials as the app.
require_once __DIR__ . '/config.php';

$report = [
    'ok' => false,
    'time' => date(DATE_ISO8601),
    'php_version' => PHP_VERSION,
    'php_ini_loaded_file' => php_ini_loaded_file(),
    'extensions' => get_loaded_extensions(),
];

$report['has_pdo'] = extension_loaded('pdo');
$report['has_pdo_mysql'] = extension_loaded('pdo_mysql');
$report['has_pdo_sqlite'] = extension_loaded('pdo_sqlite');

// Test write permissions into php_api/data
$dataDir = __DIR__ . '/data';
$writeTest = ['dir' => $dataDir];
try {
    if (!is_dir($dataDir)) {
        $writeTest['mkdir'] = @mkdir($dataDir, 0755, true) ? 'ok' : 'fail';
    } else {
        $writeTest['mkdir'] = 'exists';
    }
    $touchFile = $dataDir . '/debug_touch.txt';
    $w = @file_put_contents($touchFile, "debug: " . date(DATE_ISO8601));
    $writeTest['write'] = $w ? 'ok' : error_get_last();
} catch (Exception $ex) {
    $writeTest['write'] = $ex->getMessage();
}
$report['write_test'] = $writeTest;

// PDO tests
$pdoTests = [];
// Only attempt PDO connections if PDO is available; otherwise record informative messages.
if (empty($report['has_pdo'])) {
    $pdoTests['sqlite'] = 'pdo extension not available';
    $pdoTests['mysql'] = 'pdo extension not available';
} else {
    // SQLite
    if (empty($report['has_pdo_sqlite'])) {
        $pdoTests['sqlite'] = 'pdo_sqlite extension not available';
    } else {
        try {
            $sqlitePath = __DIR__ . '/data/relics.sqlite';
            $p = new PDO('sqlite:' . $sqlitePath);
            $p->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdoTests['sqlite'] = 'ok';
        } catch (Exception $e) {
            $pdoTests['sqlite'] = $e->getMessage();
        }
    }

    // MySQL — use the same constants as the application config.
    if (empty($report['has_pdo_mysql'])) {
        $pdoTests['mysql'] = 'pdo_mysql extension not available';
    } else {
        try {
            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
            $p2 = new PDO($dsn, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $pdoTests['mysql'] = 'ok';
        } catch (Exception $e) {
            $pdoTests['mysql'] = $e->getMessage();
        }
    }
}

$report['pdo_tests'] = $pdoTests;

$report['ok'] = true;
$out = json_encode($report, JSON_PRETTY_PRINT);
@file_put_contents(__DIR__ . '/debug_report.json', $out);
echo $out;

?>
