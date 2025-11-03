-- SQL Schema

-- =============================================
-- DATABASE: math_APP
-- Description: Sistema educativo con sumas y restas de 4 cifras
-- 
-- =============================================

-- 🧍 USERS TABLE
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 🏆 LEVELS CONFIGURATION
CREATE TABLE levels_config (
    id_level INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL,
    required_stars INT NOT NULL,
    color_theme VARCHAR(20) NOT NULL
);

-- 📊 USER PROGRESS
CREATE TABLE user_progress (
    id_progress INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    total_stars INT DEFAULT 0 NOT NULL,
    current_streak INT DEFAULT 0 NOT NULL,
    best_streak INT DEFAULT 0 NOT NULL,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ➕➖ USER EXERCISES
CREATE TABLE user_exercises (
    id_exercise INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    operation_type ENUM('sum', 'subtract') NOT NULL,
    number1 INT NOT NULL CHECK (number1 BETWEEN 1000 AND 9999),
    number2 INT NOT NULL CHECK (number2 BETWEEN 1000 AND 9999),
    correct_result INT NOT NULL,
    user_answer INT,
    is_correct BOOLEAN DEFAULT FALSE,
    solved_at DATETIME DEFAULT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels_config(id_level)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- 🎮 Insert default levels for gamification
-- =============================================
INSERT INTO levels_config (level_name, required_stars, color_theme)
VALUES
('Beginner', 10, '#6EC1E4'),
('Intermediate', 25, '#FFD166'),
('Advanced', 50, '#EF476F');
