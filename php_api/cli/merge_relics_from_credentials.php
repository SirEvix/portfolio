<?php
// CLI: merge entries from data/relics_credentials.json into DB if missing
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/hash.php';

$dataPath = __DIR__ . '/../data/relics_credentials.json';
if (!file_exists($dataPath)) { echo "No credentials file at {$dataPath}\n"; exit(1); }
$raw = file_get_contents($dataPath);
$creds = json_decode($raw, true);
if (!is_array($creds)) { echo "Invalid creds file\n"; exit(2); }

$relics = fetch_all_relics();
$map = [];
foreach ($relics as $r) $map[(int)$r['id']] = $r;

$added = 0;
foreach ($creds as $c) {
    $id = (int)$c['id'];
    if (isset($map[$id])) continue;
    $token_hash = isset($c['token']) ? hash_token($c['token']) : null;
    $internal_hash = isset($c['internal_code']) ? hash_internal_code($c['internal_code']) : null;
    upsert_relic(['id' => $id, 'token_hash' => $token_hash, 'internal_code_hash' => $internal_hash, 'status' => 'dormant', 'owner_name' => null, 'owner_date' => null]);
    $added++;
}
// regenerate CSV
require_once __DIR__ . '/json_to_csv.php';
echo "Added {$added} missing relics\n";

?>