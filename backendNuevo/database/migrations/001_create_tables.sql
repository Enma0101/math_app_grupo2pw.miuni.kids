-- SQL inicial para las tablas usadas por la aplicación
-- Ajusta tipos y longitudes según tus necesidades y ejecuta en tu base de datos MySQL.

CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  age INT NOT NULL,
  gender ENUM('mujer','hombre') NOT NULL,
  date_birthday DATE NOT NULL,
  date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS levels_config (
  id_level INT AUTO_INCREMENT PRIMARY KEY,
  level_name VARCHAR(50) NOT NULL,
  Stars_for_exercises INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_exercises (
  id_exercise INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  level_id INT NOT NULL,
  operation_type ENUM('Sumas','Restas') NOT NULL,
  number1 INT NOT NULL,
  number2 INT NOT NULL,
  correct_result INT NOT NULL,
  user_answer INT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  solved_at DATETIME NULL,
  is_blocked TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_ex_user FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE,
  CONSTRAINT fk_ex_level FOREIGN KEY (level_id) REFERENCES levels_config(id_level) ON DELETE CASCADE,
  INDEX idx_user_level (user_id, level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_progress (
  id_progress INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  level INT NOT NULL DEFAULT 1,
  total_stars INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  last_update DATETIME NULL,
  CONSTRAINT fk_prog_user FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos base de niveles (ejemplo)
INSERT INTO levels_config (level_name, Stars_for_exercises) VALUES
 ('facil', 1), ('medio', 2), ('dificil', 3)
ON DUPLICATE KEY UPDATE level_name=VALUES(level_name);
