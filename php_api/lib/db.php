<?php
require_once __DIR__ . '/../config.php';

function find_relic_by_token_hash(string $token_hash) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id, token_hash, internal_code_hash, status, owner_name, owner_date FROM relics WHERE token_hash = :h LIMIT 1');
    $stmt->execute([':h' => $token_hash]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function find_relic_by_id(int $id) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id, token_hash, internal_code_hash, status, owner_name, owner_date FROM relics WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function update_relic_fields(int $id, array $fields) {
    if (empty($fields)) return false;
    $pdo = get_pdo();
    $sets = [];
    $params = [':id' => $id];
    foreach ($fields as $k => $v) {
        $sets[] = "`$k` = :$k";
        $params[":$k"] = $v;
    }
    $sql = 'UPDATE relics SET ' . implode(', ', $sets) . ' WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    return $stmt->execute($params);
}

function list_relics() {
    $pdo = get_pdo();
    $stmt = $pdo->query('SELECT id, status, owner_name, owner_date FROM relics ORDER BY id');
    return $stmt->fetchAll();
}

function persist_log_append(string $msg) {
    $p = __DIR__ . '/../data/persist.log';
    @file_put_contents($p, $msg . "\n", FILE_APPEND);
}

function get_persistence_status() {
    $pdo = get_pdo();
    try {
        $stmt = $pdo->query('SELECT COUNT(*) AS cnt, MAX(owner_date) AS latest FROM relics');
        $row = $stmt->fetch();
        return ['exists' => true, 'backend' => 'mysql', 'count' => (int)$row['cnt'], 'latest_owner_date' => $row['latest'] ?: null];
    } catch (Exception $e) {
        return ['exists' => false, 'error' => (string)$e->getMessage()];
    }
}

function upsert_relic(array $r) {
    $pdo = get_pdo();
    // Use MySQL syntax when available, otherwise use SQLite upsert
    if (defined('DB_DRIVER') && DB_DRIVER === 'mysql') {
        $sql = 'INSERT INTO relics (id, token_hash, internal_code_hash, status, owner_name, owner_date)
            VALUES (:id, :token_hash, :internal_code_hash, :status, :owner_name, :owner_date)
            ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), internal_code_hash = VALUES(internal_code_hash), status = VALUES(status), owner_name = VALUES(owner_name), owner_date = VALUES(owner_date)';
    } else {
        // SQLite syntax: INSERT INTO ... ON CONFLICT(id) DO UPDATE SET ...
        $sql = 'INSERT INTO relics (id, token_hash, internal_code_hash, status, owner_name, owner_date)
            VALUES (:id, :token_hash, :internal_code_hash, :status, :owner_name, :owner_date)
            ON CONFLICT(id) DO UPDATE SET token_hash=excluded.token_hash, internal_code_hash=excluded.internal_code_hash, status=excluded.status, owner_name=excluded.owner_name, owner_date=excluded.owner_date';
    }
    $stmt = $pdo->prepare($sql);
    $params = [
        ':id' => $r['id'],
        ':token_hash' => $r['token_hash'] ?? null,
        ':internal_code_hash' => $r['internal_code_hash'] ?? null,
        ':status' => $r['status'] ?? null,
        ':owner_name' => $r['owner_name'] ?? null,
        ':owner_date' => $r['owner_date'] ?? null,
    ];
    return $stmt->execute($params);
}

function fetch_all_relics() {
    $pdo = get_pdo();
    $stmt = $pdo->query('SELECT id, token_hash, internal_code_hash, status, owner_name, owner_date FROM relics ORDER BY id');
    return $stmt->fetchAll();
}

?>