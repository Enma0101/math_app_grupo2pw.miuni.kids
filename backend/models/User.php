<?php
class User {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    // Verifica si el username ya existe
    public function exists($username) {
        $sql = "SELECT COUNT(*) FROM users WHERE username = :username";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([':username' => $username]);
        return $stmt->fetchColumn() > 0;
    }

    // Registra un nuevo usuario
    public function register($data) {
        $sql = "INSERT INTO users (username, password_hash, full_name, gender, birth_date)
                VALUES (:username, :password_hash, :full_name, :gender, :birth_date)";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([
            ':username' => $data['username'],
            ':password_hash' => $data['password_hash'],
            ':full_name' => $data['full_name'],
            ':gender' => $data['gender'],
            ':birth_date' => $data['birth_date']
        ]);
        return $stmt->rowCount() > 0;
    }
}
?>