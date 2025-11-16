<?php
namespace App\Database;

use PDO;

class DatabaseChecker
{
    public static function verifyOrInstall(string $host, string $username, string $password, string $dbName)
    {
        try {
            // 1️⃣ Conectarse al servidor MySQL sin base de datos
            $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            // 2️⃣ Crear base de datos si no existe
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            // 3️⃣ Conectarse a la base de datos recién creada
            $pdo = new PDO("mysql:host=$host;dbname=$dbName;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);

            // 4️⃣ Ejecutar script de instalación de tablas si es necesario
            $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
            $exists = $stmt->rowCount() > 0;

            if (!$exists) {
                require __DIR__ . '/setup_database.php';
            }

            return $pdo; // Devuelve PDO listo para usar

        } catch (\Exception $e) {
          
            exit(1);
        }
    }
}
