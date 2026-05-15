<?php
// CLI: migrate data/relics.json into MySQL via upsert_relic
require_once __DIR__ . '/../lib/db.php';

$path = __DIR__ . '/../data/relics.json';
if (!file_exists($path)) { echo "File not found: {$path}\n"; exit(1); }
$raw = file_get_contents($path);
$arr = json_decode($raw, true);
if (!is_array($arr)) { echo "Invalid JSON file\n"; exit(2); }

$count = 0;
foreach ($arr as $r) {
    if (!isset($r['id'])) continue;
    upsert_relic([
        'id' => (int)$r['id'],
        'token_hash' => $r['token_hash'] ?? null,
        'internal_code_hash' => $r['internal_code_hash'] ?? null,
        'status' => $r['status'] ?? null,
        'owner_name' => $r['owner_name'] ?? null,
        'owner_date' => $r['owner_date'] ?? null,
    ]);
    $count++;
}
echo "Imported {$count} relics into MySQL\n";

?>