<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();

require __DIR__ . '/../src/config/database.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

// CORS
$app->add(new App\Middlewares\CorsMiddleware($_ENV['CORS_ORIGIN'] ?? '*'));

require __DIR__ . '/../src/routes/api.php';

$app->run();
