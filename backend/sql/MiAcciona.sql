
-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 15-05-2025 a las 09:42:00
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
-- Estructura de tabla para la tabla `tipo_ausencia`
--

CREATE TABLE `tipo_ausencia` (
  `id_tipo` TINYINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_ausencia`
--

INSERT INTO `tipo_ausencia` (`id_tipo`, `nombre`) VALUES
(1, 'Vacaciones'),
(2, 'Permisos retribuidos'),
(3, 'Asuntos propios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `Idadministrador` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `primer_apellido` VARCHAR(50) NOT NULL,
  `segundo_apellido` VARCHAR(50) DEFAULT NULL,
  `nif` CHAR(9) NOT NULL,
  `fechanacimiento` DATE NOT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1,
  `actividad` TINYINT(1) NOT NULL DEFAULT 1,
  `rol` VARCHAR(50) NOT NULL,
  `telefono` VARCHAR(15) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `token_huella` TEXT DEFAULT NULL,
  `activo_biometria` TINYINT(1) NOT NULL DEFAULT 0,
  `subdivision_personal` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`Idadministrador`),
  UNIQUE KEY `nif` (`nif`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`Idadministrador`, `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `fechanacimiento`, `estado`, `actividad`, `rol`, `telefono`, `email`, `token_huella`, `activo_biometria`, `subdivision_personal`) VALUES
(1, 'Pedro', 'Linero', 'Arias', '11122233A', '1980-03-12', 1, 1, 'Administrador', '654321987', 'plinero@acciona.com', NULL, 0, 'Dirección');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `primer_apellido` VARCHAR(50) NOT NULL,
  `segundo_apellido` VARCHAR(50) DEFAULT NULL,
  `nif` CHAR(9) NOT NULL,
  `fechanacimiento` DATE NOT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1,
  `actividad` TINYINT(1) NOT NULL DEFAULT 1,
  `rol` VARCHAR(50) NOT NULL,
  `telefono` VARCHAR(15) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `token_huella` TEXT DEFAULT NULL,
  `activo_biometria` TINYINT(1) NOT NULL DEFAULT 0,
  `subdivision_personal` VARCHAR(100) DEFAULT NULL,
  `id_administrador` INT DEFAULT NULL,
  PRIMARY KEY (`Idusuario`),
  UNIQUE KEY `nif` (`nif`),
  INDEX `idx_email` (`email`),
  INDEX `idx_administrador` (`id_administrador`),
  FOREIGN KEY `fk_usuarios_administrador` (`id_administrador`) REFERENCES `administrador` (`Idadministrador`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Idusuario`, `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `fechanacimiento`, `estado`, `actividad`, `rol`, `telefono`, `email`, `token_huella`, `activo_biometria`, `subdivision_personal`, `id_administrador`) VALUES
(1, 'Juan', 'García', 'López', '12345678Z', '1990-05-15', 1, 1, 'Administrador', '612345678', 'juan.garcia@email.com', NULL, 0, 'Recursos Humanos', 1),
(2, 'María', 'Pérez', 'Sánchez', '87654321X', '1985-11-30', 1, 0, 'Usuario', '623456789', 'maria.perez@email.com', NULL, 0, 'Contabilidad', 1),
(3, 'Carlos', 'Rodríguez', NULL, '45678912Y', '1995-02-20', 0, 1, 'Técnico', '634567890', 'carlos.rodriguez@email.com', NULL, 0, 'Informática', 1),
(4, 'Ana', 'Martínez', 'Gómez', '98765432W', '1988-09-10', 1, 1, 'Supervisor', '645678901', 'ana.martinez@email.com', NULL, 0, 'Producción', 1),
(5, 'Luis', 'Fernández', 'Díaz', '32165487V', '1992-07-25', 1, 0, 'Usuario', NULL, 'luis.fernandez@email.com', NULL, 0, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_ausencia`
--

CREATE TABLE `usuario_ausencia` (
  `id_usuario` INT NOT NULL,
  `id_tipo` TINYINT NOT NULL,
  `dias_permitidos` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_usuario`, `id_tipo`),
  FOREIGN KEY `fk_usuario_ausencia_usuario` (`id_usuario`) REFERENCES `usuarios` (`Idusuario`) ON DELETE CASCADE,
  FOREIGN KEY `fk_usuario_ausencia_tipo` (`id_tipo`) REFERENCES `tipo_ausencia` (`id_tipo`) ON DELETE RESTRICT
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `administrador_id` INT NOT NULL,
  `tipo_ausencia_id` TINYINT NOT NULL,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_solicitud`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_administrador_id` (`administrador_id`),
  INDEX `idx_tipo_ausencia_id` (`tipo_ausencia_id`),
  FOREIGN KEY `fk_solicitudes_usuario` (`usuario_id`) REFERENCES `usuarios` (`Idusuario`) ON DELETE CASCADE,
  FOREIGN KEY `fk_solicitudes_administrador` (`administrador_id`) REFERENCES `administrador` (`Idadministrador`) ON DELETE CASCADE,
  FOREIGN KEY `fk_solicitudes_tipo_ausencia` (`tipo_ausencia_id`) REFERENCES `tipo_ausencia` (`id_tipo`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `Idadministrador` INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  MODIFY `id_tipo` TINYINT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Idusuario` INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;