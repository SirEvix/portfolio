<?php
// CLI: fill missing token_hash and internal_code_hash values, write plaintext creds to data/relics_credentials.json
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/hash.php';

function random_token($len = 64) {
    return bin2hex(random_bytes((int)ceil($len/2)));
}

function random_code($len = 8) {
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $s = '';
    for ($i = 0; $i < $len; $i++) $s .= $alphabet[random_int(0, strlen($alphabet)-1)];
    return $s;
}

$all = fetch_all_relics();
$creds = [];
$updated = 0;
foreach ($all as $r) {
    $id = (int)$r['id'];
    $needToken = empty($r['token_hash']);
    $needInternal = empty($r['internal_code_hash']);
    $entry = ['id' => $id];
    if ($needToken) {
        $token = random_token(64);
        $entry['token'] = $token;
        $entry['token_hash'] = hash_token($token);
    }
    if ($needInternal) {
        $internal = random_code(8);
        $entry['internal_code'] = $internal;
        $entry['internal_code_hash'] = hash_internal_code($internal);
    }
    if (count($entry) > 1) {
        // merge into DB via upsert preserving existing fields
        upsert_relic([
            'id' => $id,
            'token_hash' => $entry['token_hash'] ?? $r['token_hash'] ?? null,
            'internal_code_hash' => $entry['internal_code_hash'] ?? $r['internal_code_hash'] ?? null,
            'status' => $r['status'] ?? null,
            'owner_name' => $r['owner_name'] ?? null,
            'owner_date' => $r['owner_date'] ?? null,
        ]);
        if (isset($entry['token'])) $creds[] = ['id' => $id, 'token' => $entry['token']];
        if (isset($entry['internal_code'])) {
            $found = null;
            foreach ($creds as &$c) if ($c['id'] === $id) { $c['internal_code'] = $entry['internal_code']; $found = true; break; }
            if (!$found) $creds[] = ['id' => $id, 'internal_code' => $entry['internal_code']];
        }
        $updated++;
    }
}

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) @mkdir($dataDir, 0755, true);
file_put_contents($dataDir . '/relics_credentials.json', json_encode($creds, JSON_PRETTY_PRINT));
echo "Filled hashes for {$updated} relics and wrote plaintext creds to {$dataDir}/relics_credentials.json\n";

?>