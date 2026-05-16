<?php
// Temporary debug helpers: enable error display and convert errors to exceptions
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
set_exception_handler(function ($e) {
	http_response_code(500);
	$errorMsg = '[php_api] uncaught exception: ' . $e->getMessage() . " in " . $e->getFile() . ':' . $e->getLine();
	// log to Apache/php error log
	error_log($errorMsg);
	// also write a copy to data/php_error_log.txt for hosts where error_log isn't visible
	$dump = [
		'time' => date(DATE_ATOM),
		'message' => $e->getMessage(),
		'file' => $e->getFile(),
		'line' => $e->getLine(),
		'trace' => $e->getTraceAsString(),
	];
	@file_put_contents(__DIR__ . '/../../data/php_error_log.txt', json_encode($dump, JSON_PRETTY_PRINT) . "\n", FILE_APPEND);
	echo json_encode(['ok' => false, 'error' => 'exception', 'message' => $e->getMessage()]);
	exit;
});
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
	throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Quick health check endpoint to verify PHP is executing and reveal basic env
if (isset($_GET['__health']) && $_GET['__health'] === '1') {
	header('Content-Type: application/json');
	echo json_encode([
		'ok' => true,
		'php' => phpversion(),
		'sapi' => php_sapi_name(),
		'cwd' => getcwd(),
		'data_dir_exists' => is_dir(__DIR__ . '/../../data'),
		'data_dir_readable' => is_readable(__DIR__ . '/../../data'),
	]);
	exit;
}

require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();

try {
	$rows = list_relics();
	send_json($rows);
} catch (Throwable $e) {
	// Fallback catch in case set_exception_handler isn't triggered
	http_response_code(500);
	error_log('[php_api] error in list.php: ' . $e->getMessage());
	echo json_encode(['ok' => false, 'error' => 'exception', 'message' => $e->getMessage()]);
}

?>