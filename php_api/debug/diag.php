<?php
// Lightweight diagnostics page to help debug 500 errors.
header('Content-Type: text/plain; charset=utf-8');
echo "PHP diagnostics\n";
echo str_repeat('=',40) . "\n";
echo "phpversion: " . phpversion() . "\n";
echo "SAPI: " . php_sapi_name() . "\n";
echo "Loaded extensions: \n";
$exts = get_loaded_extensions();
sort($exts);
foreach ($exts as $e) echo " - $e\n";
echo "\n";

echo "Checking important PDO extensions...\n";
echo "pdo: " . (extension_loaded('pdo') ? 'yes' : 'no') . "\n";
echo "pdo_sqlite: " . (extension_loaded('pdo_sqlite') ? 'yes' : 'no') . "\n";
echo "pdo_mysql: " . (extension_loaded('pdo_mysql') ? 'yes' : 'no') . "\n";
echo "sqlite3: " . (extension_loaded('sqlite3') ? 'yes' : 'no') . "\n";
echo "\n";

$dataDir = __DIR__ . '/../data';
echo "Data dir: $dataDir\n";
echo "is_dir: " . (is_dir($dataDir) ? 'yes' : 'no') . "\n";
echo "is_readable: " . (is_readable($dataDir) ? 'yes' : 'no') . "\n";
echo "is_writable: " . (is_writable($dataDir) ? 'yes' : 'no') . "\n";
if (is_dir($dataDir)) {
    $perms = fileperms($dataDir);
    $oct = sprintf('%o', $perms & 0777);
    echo "dir perms (octal): $oct\n";
}
echo "\n";

$csv = $dataDir . '/relics.csv';
echo "CSV file: $csv\n";
echo "exists: " . (file_exists($csv) ? 'yes' : 'no') . "\n";
echo "readable: " . (is_readable($csv) ? 'yes' : 'no') . "\n";
if (is_readable($csv)) {
    $size = filesize($csv);
    echo "size: $size bytes\n";
}
echo "\n";

$sqlite = __DIR__ . '/../data/relics.sqlite';
echo "SQLite file: $sqlite\n";
echo "exists: " . (file_exists($sqlite) ? 'yes' : 'no') . "\n";
echo "readable: " . (is_readable($sqlite) ? 'yes' : 'no') . "\n";
echo "writable: " . (is_writable(dirname($sqlite)) ? 'yes' : 'no') . "\n";
echo "\n";

// Try opening a SQLite connection
echo "Attempting SQLite PDO connect...\n";
try {
    $pdo = new PDO('sqlite:' . $sqlite);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $row = $pdo->query('SELECT name FROM sqlite_master WHERE type="table"')->fetchAll(PDO::FETCH_ASSOC);
    echo "SQLite connected — tables:\n";
    foreach ($row as $r) echo " - " . ($r['name'] ?? json_encode($r)) . "\n";
    // Try a quick count if relics exists
    $tables = array_column($row, 'name');
    if (in_array('relics', $tables)) {
        $cnt = $pdo->query('SELECT COUNT(*) AS cnt FROM relics')->fetchColumn();
        echo "relics count: $cnt\n";
    }
} catch (Throwable $e) {
    echo "SQLite connect failed: " . $e->getMessage() . "\n";
}

// Try using MySQL credentials if config_local exists
echo "\nChecking config_local.php if present...\n";
$cfg = __DIR__ . '/../config_local.php';
if (file_exists($cfg)) {
    echo "config_local.php exists\n";
    $c = file_get_contents($cfg);
    // Reveal DB_* constants without printing passwords: show whether defined
    foreach (['DB_HOST','DB_NAME','DB_USER','DB_PASS','DB_PORT','ADMIN_KEY'] as $k) {
        $defined = preg_match('/define\(\s*' . preg_quote("'$k'", '/') . '/', $c) ? 'maybe' : 'no';
        echo "$k defined in file: $defined\n";
    }
} else {
    echo "config_local.php not found\n";
}

echo "\nDiagnostics complete.\n";

?>
