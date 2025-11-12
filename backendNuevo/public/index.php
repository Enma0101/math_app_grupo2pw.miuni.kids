<?php
use Slim\Factory\AppFactory;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Slim\Middleware\ErrorMiddleware;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();

require __DIR__ . '/../src/config/database.php';

$app = AppFactory::create();

// Logger (opcional: solo si está monolog instalado)
$logger = null;
if (class_exists('Monolog\\Logger')) {
	$logPath = __DIR__ . '/../logs/app.log';
	if (!is_dir(dirname($logPath))) {
		@mkdir(dirname($logPath), 0777, true);
	}
	try {
		$logger = new \Monolog\Logger('app');
		$logger->pushHandler(new \Monolog\Handler\StreamHandler($logPath, \Monolog\Logger::DEBUG));
	} catch (\Throwable $e) {
		$logger = null; // continúa sin logger
	}
}

// Error Middleware con respuesta JSON
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(function(
	\Psr\Http\Message\ServerRequestInterface $request,
	\Throwable $exception,
	bool $displayErrorDetails,
	bool $logErrors,
	bool $logErrorDetails
) use ($logger) {
	if ($logErrors && $logger) {
		$logger->error('Unhandled Exception', [
			'message' => $exception->getMessage(),
			'trace' => $displayErrorDetails ? $exception->getTraceAsString() : null
		]);
	}
	$responseFactory = AppFactory::determineResponseFactory();
	$res = $responseFactory->createResponse();
	$payload = [
		'ok' => false,
		'message' => 'Error interno del servidor',
		'detail' => $displayErrorDetails ? $exception->getMessage() : null
	];
	$res->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
	return $res->withHeader('Content-Type','application/json')->withStatus(500);
});
$app->addBodyParsingMiddleware();

// Manejar OPTIONS globalmente (por si el router no captura)
$app->add(function ($req, $handler) {
	if ($req->getMethod() === 'OPTIONS') {
		$res = new \Nyholm\Psr7\Response();
		return $res
			->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ORIGIN'] ?? '*')
			->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
			->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	}
	return $handler->handle($req);
});

// CORS
$app->add(new App\Middlewares\CorsMiddleware($_ENV['CORS_ORIGIN'] ?? '*'));

require __DIR__ . '/../src/routes/api.php';

$app->run();
