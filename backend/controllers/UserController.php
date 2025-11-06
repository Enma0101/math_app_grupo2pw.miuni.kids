<?php
require_once __DIR__ . '/../models/User.php';

class UserController {
    private $model;

    public function __construct($connection) {
        $this->model = new User($connection);
    }

    public function register($data) {
        $errors = [];

        // Validaciones básicas
        if (!isset($data['username']) || trim($data['username']) === '') {
            $errors['username'] = "Username is required";
        }

        if (!isset($data['password']) || strlen($data['password']) < 6) {
            $errors['password'] = "Password must be at least 6 characters";
        }

        if (!isset($data['full_name']) || trim($data['full_name']) === '') {
            $errors['full_name'] = "Full name is required";
        }
        if (strlen(trim($data['full_name'])) < 3) {
            $errors['full_name'] = "Full name must be at least 3 characters";
        }

        if (strlen(trim($data['username'])) < 3) {
            $errors['username'] = "Username must be at least 3 characters";
        }

        if (!isset($data['gender']) || !in_array($data['gender'], ['male', 'female'])) {
            $errors['gender'] = "Gender must be 'male' or 'female'";
        }

        if (!isset($data['birth_date']) || $data['birth_date'] === '') {
            $errors['birth_date'] = "Birth date is required";
        }

        // Si hay errores, los devolvemos
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        // Validación de existencia de usuario
        if ($this->model->exists($data['username'])) {
            return ['success' => false, 'message' => 'Username already exists'];
        }

        // Hash de contraseña
        $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // Registro
        $success = $this->model->register($data);

        return $success
            ? ['success' => true, 'message' => 'User registered successfully']
            : ['success' => false, 'message' => 'Registration failed'];
    }
}