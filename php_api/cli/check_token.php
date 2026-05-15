<?php
// CLI: check token against DB
require_once __DIR__ . '/../lib/hash.php';
require_once __DIR__ . '/../lib/db.php';

$token = $argv[1] ?? null;
if (!$token) { echo "Usage: php check_token.php <token>\n"; exit(2); }
$h = hash_token($token);
$r = find_relic_by_token_hash($h);
echo "token: {$token}\nsha256: {$h}\n";
if ($r) {
    echo "FOUND: id={$r['id']} status={$r['status']} owner_name={$r['owner_name']} owner_date={$r['owner_date']}\n";
} else {
    echo "No matching relic for that token hash\n";
}

?>