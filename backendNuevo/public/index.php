<?php
// ✅ HEADERS CORS ANTES DE CUALQUIER COSA
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use Slim\Factory\AppFactory;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Slim\Middleware\ErrorMiddleware;
use Illuminate\Database\Capsule\Manager as Capsule;
use App\Database\DatabaseChecker;

require __DIR__ . '/../vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();

// -------------------------------
// 🔧 Configuración de base de datos
// -------------------------------
$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$username = $_ENV['DB_USERNAME'] ?? 'root';
$password = $_ENV['DB_PASSWORD'] ?? '';
$dbName = $_ENV['DB_DATABASE'] ?? 'math_app';

// ⚡ Verificar y crear base de datos si no existe
$pdo = DatabaseChecker::verifyOrInstall($host, $username, $password, $dbName);

// -------------------------------
// Inicializar Eloquent / Capsule
// -------------------------------
require __DIR__ . '/../src/config/database.php'; 

// Sobreescribir el PDO de Capsule para que use el PDO ya creado
Capsule::connection()->getPdo()->exec("USE `$dbName`");

// -------------------------------
// Crear aplicación Slim
// -------------------------------
$app = AppFactory::create();

// Logger (opcional)
$logger = null;
if (class_exists('Monolog\\Logger')) {
    $logPath = __DIR__ . '/../logs/app.log';
    if (!is_dir(dirname($logPath))) {
        @mkdir(dirname($logPath), 0777, true);
    }
    try {
        $logger = new Logger('app');
        $logger->pushHandler(new StreamHandler($logPath, Logger::DEBUG));
    } catch (\Throwable $e) {
        $logger = null;
    }
}

// Middleware de errores
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

// -------------------------------
// Cargar rutas
// -------------------------------
require __DIR__ . '/../src/routes/api.php';

// -------------------------------
// Ejecutar la app
// -------------------------------
$app->run();
