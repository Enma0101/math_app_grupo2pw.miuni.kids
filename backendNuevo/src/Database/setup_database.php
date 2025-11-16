<?php


try {
    echo "📄 Creando tablas...\n";

    // levels_config
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS levels_config (
            id_level INT AUTO_INCREMENT PRIMARY KEY,
            level_name VARCHAR(50) NOT NULL,
            Stars_for_exercises INT NOT NULL DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "  ✓ Tabla levels_config\n";

    // users
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(150) NOT NULL,
            age INT NOT NULL,
            gender ENUM('mujer', 'hombre') NOT NULL,
            date_birthday DATE NOT NULL,
            date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "  ✓ Tabla users\n";

    // user_exercises
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_exercises (
            id_exercise INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            level_id INT NOT NULL,
            operation_type ENUM('Sumas','Restas') NOT NULL,
            number1 INT NOT NULL,
            number2 INT NOT NULL,
            correct_result INT NOT NULL,
            user_answer INT DEFAULT NULL,
            is_correct TINYINT(1) DEFAULT 0,
            solved_at DATETIME DEFAULT NULL,
            INDEX idx_user_level (user_id, level_id),
            FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
            FOREIGN KEY (level_id) REFERENCES levels_config(id_level) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "  ✓ Tabla user_exercises\n";

    // user_progress
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_progress (
            id_progress INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            total_stars INT NOT NULL DEFAULT 0,
            current_streak INT NOT NULL DEFAULT 0,
            last_update DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "  ✓ Tabla user_progress\n";

    // user_streaks
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_streaks (
            id_streak INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            operation_type ENUM('Sumas','Restas') NOT NULL,
            total_streak INT NOT NULL DEFAULT 0,
            facil_count INT NOT NULL DEFAULT 0,
            medio_count INT NOT NULL DEFAULT 0,
            dificil_count INT NOT NULL DEFAULT 0,
            last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_operation (user_id, operation_type),
            FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "  ✓ Tabla user_streaks\n";

    // Insertar niveles iniciales si no existen
    $count = $pdo->query("SELECT COUNT(*) FROM levels_config")->fetchColumn();
    if ($count == 0) {
        $pdo->exec("
            INSERT INTO levels_config (level_name, Stars_for_exercises)
            VALUES ('Fácil', 1), ('Medio', 2), ('Difícil', 3)
        ");
        echo "  ✓ Niveles insertados\n";
    }

    echo "\n🎉 ¡Base de datos y tablas configuradas exitosamente!\n";

} catch (\PDOException $e) {
    echo "❌ ERROR al crear tablas: " . $e->getMessage() . "\n";
    exit(1);
}
