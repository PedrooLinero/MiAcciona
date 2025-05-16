-- phpMygestor SQL Dump
-- version 5.2.2
-- https://www.phpmygestor.net/
--
-- Servidor: db
-- Tiempo de generación: 15-05-2025 a las 11:32:50
-- Versión del servidor: 8.0.41
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `MiAcciona`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestor`
--

CREATE TABLE `gestor` (
  `Idgestor` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `nif` char(9) NOT NULL,
  `fechanacimiento` date NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `actividad` tinyint(1) NOT NULL DEFAULT '1',
  `rol` varchar(50) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `token_huella` text,
  `activo_biometria` tinyint(1) NOT NULL DEFAULT '0',
  `subdivision_personal` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `gestor`
--

INSERT INTO `gestor` (`Idgestor`, `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `fechanacimiento`, `estado`, `actividad`, `rol`, `telefono`, `email`, `token_huella`, `activo_biometria`, `subdivision_personal`) VALUES
(1, 'Pedro', 'Linero', 'Arias', '11122233A', '1980-03-12', 1, 1, 'Gestor', '654321987', 'plinero@acciona.com', NULL, 0, 'Dirección'),
(2, 'Virginia', 'Muñoz', 'Castro', '11133355F', '2025-05-14', 1, 1, 'Gestor', '654321123', 'virginia@gmail.com', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` int NOT NULL,
  `usuario_id` int NOT NULL,
  `gestor_id` int NOT NULL,
  `tipo_ausencia_id` tinyint NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id_solicitud`, `usuario_id`, `gestor_id`, `tipo_ausencia_id`, `titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`, `created_at`) VALUES
(1, 1, 1, 1, 'Vacaciones de verano', 'Solicito vacaciones para descansar en verano', '2025-07-01', '2025-07-15', 'pendiente', '2025-05-15 07:58:26'),
(2, 1, 1, 1, 'Vacaciones Verano', 'Solicitud de vacaciones', '2025-05-19', '2025-06-02', 'pendiente', '2025-05-15 09:34:30'),
(3, 2, 2, 3, 'Asunto personal', 'Enfermedad', '2025-05-15', '2025-05-16', 'pendiente', '2025-05-15 10:24:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_ausencia`
--

CREATE TABLE `tipo_ausencia` (
  `id_tipo` tinyint NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_ausencia`
--

INSERT INTO `tipo_ausencia` (`id_tipo`, `nombre`) VALUES
(3, 'Asuntos propios'),
(2, 'Permisos retribuidos'),
(1, 'Vacaciones');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Idusuario` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `nif` char(9) NOT NULL,
  `fechanacimiento` date NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `actividad` tinyint(1) NOT NULL DEFAULT '1',
  `rol` varchar(50) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `token_huella` text,
  `activo_biometria` tinyint(1) NOT NULL DEFAULT '0',
  `subdivision_personal` varchar(100) DEFAULT NULL,
  `id_gestor` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Idusuario`, `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `fechanacimiento`, `estado`, `actividad`, `rol`, `telefono`, `email`, `token_huella`, `activo_biometria`, `subdivision_personal`, `id_gestor`) VALUES
(1, 'Juan', 'García', 'López', '12345678Z', '1990-05-15', 1, 1, 'Usuario', '612345678', 'juan.garcia@email.com', NULL, 0, 'Recursos Humanos', 1),
(2, 'María', 'Pérez', 'Sánchez', '87654321X', '1985-11-30', 1, 0, 'Usuario', '623456789', 'maria.perez@email.com', NULL, 0, 'Contabilidad', 2),
(3, 'Carlos', 'Rodríguez', NULL, '45678912Y', '1995-02-20', 0, 1, 'Usuario', '634567890', 'carlos.rodriguez@email.com', NULL, 0, 'Informática', 1),
(4, 'Ana', 'Martínez', 'Gómez', '98765432W', '1988-09-10', 1, 1, 'Usuario', '645678901', 'ana.martinez@email.com', NULL, 0, 'Producción', 2),
(5, 'Luis', 'Fernández', 'Díaz', '32165487V', '1992-07-25', 1, 0, 'Usuario', NULL, 'luis.fernandez@email.com', NULL, 0, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_ausencia`
--

CREATE TABLE `usuario_ausencia` (
  `id_usuario` int NOT NULL,
  `id_tipo` tinyint NOT NULL,
  `dias_permitidos` tinyint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario_ausencia`
--

INSERT INTO `usuario_ausencia` (`id_usuario`, `id_tipo`, `dias_permitidos`) VALUES
(1, 1, 30),
(1, 2, 3),
(1, 3, 10),
(2, 1, 25),
(2, 2, 13),
(2, 3, 5),
(3, 1, 20),
(3, 2, 5),
(3, 3, 5),
(4, 1, 20),
(4, 2, 5),
(4, 3, 5),
(5, 1, 20),
(5, 2, 5),
(5, 3, 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `gestor`
--
ALTER TABLE `gestor`
  ADD PRIMARY KEY (`Idgestor`),
  ADD UNIQUE KEY `nif` (`nif`),
  ADD KEY `idx_email` (`email`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `idx_usuario_id` (`usuario_id`),
  ADD KEY `idx_gestor_id` (`gestor_id`),
  ADD KEY `idx_tipo_ausencia_id` (`tipo_ausencia_id`);

--
-- Indices de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  ADD PRIMARY KEY (`id_tipo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Idusuario`),
  ADD UNIQUE KEY `nif` (`nif`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_gestor` (`id_gestor`);

--
-- Indices de la tabla `usuario_ausencia`
--
ALTER TABLE `usuario_ausencia`
  ADD PRIMARY KEY (`id_usuario`,`id_tipo`),
  ADD KEY `fk_usuario_ausencia_tipo` (`id_tipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `gestor`
--
ALTER TABLE `gestor`
  MODIFY `Idgestor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  MODIFY `id_tipo` tinyint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Idusuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`Idusuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`gestor_id`) REFERENCES `gestor` (`Idgestor`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_3` FOREIGN KEY (`tipo_ausencia_id`) REFERENCES `tipo_ausencia` (`id_tipo`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_gestor`) REFERENCES `gestor` (`Idgestor`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuario_ausencia`
--
ALTER TABLE `usuario_ausencia`
  ADD CONSTRAINT `usuario_ausencia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`Idusuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_ausencia_ibfk_2` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_ausencia` (`id_tipo`) ON DELETE RESTRICT;
COMMIT;

--
-- Añadir motivo a la tabla de solicitudes
--

ALTER TABLE `solicitudes` ADD COLUMN `motivo` VARCHAR(255) NULL DEFAULT NULL AFTER `estado`;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
