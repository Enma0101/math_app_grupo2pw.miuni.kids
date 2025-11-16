-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-11-2025 a las 04:49:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `math_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels_config`
--

CREATE TABLE `levels_config` (
  `id_level` int(11) NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `Stars_for_exercises` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `levels_config`
--

INSERT INTO `levels_config` (`id_level`, `level_name`, `Stars_for_exercises`) VALUES
(1, 'Fácil', 1),
(2, 'Medio', 2),
(3, 'Difícil', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('mujer','hombre') NOT NULL,
  `date_birthday` date NOT NULL,
  `date_registered` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_exercises`
--

CREATE TABLE `user_exercises` (
  `id_exercise` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `operation_type` enum('Sumas','Restas') NOT NULL,
  `number1` int(11) NOT NULL,
  `number2` int(11) NOT NULL,
  `correct_result` int(11) NOT NULL,
  `user_answer` int(11) DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `solved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_exercises`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_progress`
--

CREATE TABLE `user_progress` (
  `id_progress` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_stars` int(11) NOT NULL DEFAULT 0,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `last_update` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_progress`
--



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_streaks`
--

CREATE TABLE `user_streaks` (
  `id_streak` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `operation_type` enum('Sumas','Restas') NOT NULL,
  `total_streak` int(11) NOT NULL DEFAULT 0,
  `facil_count` int(11) NOT NULL DEFAULT 0,
  `medio_count` int(11) NOT NULL DEFAULT 0,
  `dificil_count` int(11) NOT NULL DEFAULT 0,
  `last_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_streaks`
--



--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `levels_config`
--
ALTER TABLE `levels_config`
  ADD PRIMARY KEY (`id_level`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `user_exercises`
--
ALTER TABLE `user_exercises`
  ADD PRIMARY KEY (`id_exercise`),
  ADD KEY `fk_ex_level` (`level_id`),
  ADD KEY `idx_user_level` (`user_id`,`level_id`);

--
-- Indices de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id_progress`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `user_streaks`
--
ALTER TABLE `user_streaks`
  ADD PRIMARY KEY (`id_streak`),
  ADD UNIQUE KEY `unique_user_operation` (`user_id`,`operation_type`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `levels_config`
--
ALTER TABLE `levels_config`
  MODIFY `id_level` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user_exercises`
--
ALTER TABLE `user_exercises`
  MODIFY `id_exercise` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=705;

--
-- AUTO_INCREMENT de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id_progress` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `user_streaks`
--
ALTER TABLE `user_streaks`
  MODIFY `id_streak` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `user_exercises`
--
ALTER TABLE `user_exercises`
  ADD CONSTRAINT `fk_ex_level` FOREIGN KEY (`level_id`) REFERENCES `levels_config` (`id_level`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ex_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `fk_prog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_streaks`
--
ALTER TABLE `user_streaks`
  ADD CONSTRAINT `fk_streak_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
