<?php
// Cleanup script: safely move non-whitelisted files/dirs into a timestamped backup
// Usage (browser): https://your-site/php_api/cleanup_for_upload.php?key=YOUR_ADMIN_KEY
// WARNING: This moves files on the server. Run only if you understand and have backups.

header('Content-Type: application/json');

// Try to load config_local to get ADMIN_KEY if present
if (file_exists(__DIR__ . '/config_local.php')) include_once __DIR__ . '/config_local.php';

$provided = $_GET['key'] ?? null;
if (!defined('ADMIN_KEY') || !ADMIN_KEY) {
    echo json_encode(['ok'=>false,'error'=>'no_admin_key_configured','message'=>'ADMIN_KEY not set in config_local.php']);
    exit;
}
if (!$provided || $provided !== ADMIN_KEY) {
    http_response_code(403);
    echo json_encode(['ok'=>false,'error'=>'invalid_key']);
    exit;
}

$dir = __DIR__;
$timestamp = date('Ymd_His');
$backup = $dir . '/cleanup_backup_' . $timestamp;
// basename of the backup folder to avoid moving it during the scan
$backupBasename = basename($backup);
@mkdir($backup, 0755, true);

// Whitelist: files and directories to KEEP in php_api/
$whitelist = [
    '.', '..',
    'api', 'lib', 'data',
    'config.php', 'config_local.php', 'config_local.php.example', 'config_local.example.php',
    'README.md', 'README_MYSQL.md',
    'health.php', 'hello.php', 'run_migration_csv.php', 'test_db.php', 'trace.php',
    'debug', 'debug_env.php', '.htaccess', 'schema.sql',
    basename(__FILE__), // this script
];

$moved = [];
$skipped = [];

foreach (scandir($dir) as $name) {
    // skip the backup folder we just created
    if ($name === $backupBasename) { $skipped[] = $name; continue; }
    if (in_array($name, $whitelist, true)) { $skipped[] = $name; continue; }
    // never move the data directory if it contains relics.csv and relics.json (safety)
    if ($name === 'data') {
        $skipped[] = $name; continue;
    }
    $src = $dir . DIRECTORY_SEPARATOR . $name;
    $dst = $backup . DIRECTORY_SEPARATOR . $name;
    // attempt rename (move)
    try {
        if (@rename($src, $dst)) {
            $moved[] = $name;
        } else {
            // fallback to recursive copy+remove
            $copyOk = false;
            if (is_dir($src)) {
                $copyOk = recurse_copy($src, $dst);
                if ($copyOk) rrmdir($src);
            } else {
                $copyOk = @copy($src, $dst);
                if ($copyOk) @unlink($src);
            }
            if ($copyOk) $moved[] = $name; else $skipped[] = $name;
        }
    } catch (Exception $e) {
        $skipped[] = $name;
    }
}

echo json_encode(['ok'=>true,'backup'=>basename($backup),'moved'=>$moved,'skipped'=>$skipped]);

// Helpers
function recurse_copy($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            $srcPath = $src . DIRECTORY_SEPARATOR . $file;
            $dstPath = $dst . DIRECTORY_SEPARATOR . $file;
            if (is_dir($srcPath)) recurse_copy($srcPath, $dstPath);
            else copy($srcPath, $dstPath);
        }
    }
    closedir($dir);
    return true;
}

function rrmdir($dir) {
    if (!is_dir($dir)) return;
    $objects = scandir($dir);
    foreach ($objects as $object) {
        if ($object === '.' || $object === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $object;
        if (is_dir($path)) rrmdir($path); else @unlink($path);
    }
    @rmdir($dir);
}

?>
