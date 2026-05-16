<?php
header('Content-Type: application/json; charset=utf-8');
// Temporary DB connectivity tester. Remove after use.
ini_set('display_errors', 1);
error_reporting(E_ALL);
require __DIR__ . '/config.php';
try {
    $pdo = get_pdo();
    $stmt = $pdo->query('SELECT 1 AS ok');
    $row = $stmt->fetch();
    echo json_encode([ 'ok' => true, 'db_test' => (int)($row['ok'] ?? 0) ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([ 'ok' => false, 'error' => $e->getMessage() ]);
}

?>
