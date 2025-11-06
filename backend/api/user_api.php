<?php
// CORS
$allowed_origins = [
    'http://localhost:5173',
    'https://math-app-grupo2pw-miuni-kids-kbaf.vercel.app',
    'http://grupo2pw.miuni.kids:8090'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Dependencias
require_once '../config/db.php';
require_once '../controllers/UserController.php';

// Solo permitir POST para registro
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Obtener datos del cuerpo JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar campos esperados
$required_fields = ['username', 'full_name', 'password', 'birth_date', 'gender'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

// Registrar usuario
$controller = new UserController($connection);
$response = $controller->register($input);

echo json_encode($response);