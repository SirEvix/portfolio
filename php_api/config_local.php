<?php
// This file enables MySQL as the primary DB for the API.
// Wrap defines in guards to avoid "Constant ... already defined" errors
// when the host or other includes predefine values.

if (!defined('DB_DRIVER')) {
	define('DB_DRIVER', 'mysql');
}
if (!defined('DB_HOST')) {
	define('DB_HOST', 'localhost');
}
if (!defined('DB_NAME')) {
	define('DB_NAME', 'of4uzyum_portfolio_db');
}
if (!defined('DB_USER')) {
	define('DB_USER', 'of4uzyum_portfolio_db');
}
if (!defined('DB_PASS')) {
	define('DB_PASS', '¡4JWa9riEA5Re¡!8(#0');
}
if (!defined('DB_PORT')) {
	define('DB_PORT', '3306');
}

// Admin key protects migration endpoints. Keep this secret.
if (!defined('ADMIN_KEY')) {
	define('ADMIN_KEY', 'aR7k9xQb4Tz2LpV9sWm6HzY3Rb1QeN4f');
}

// Security note:
// - Do NOT commit real credentials to a public repo. This file is stored in your local workspace now.
// - After uploading to the host and verifying the import, consider removing or restricting the migration endpoints.

?>
