-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 12-05-2025 a las 09:49:43
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
  `id_tipo` int NOT NULL,
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
  `nif` varchar(9) NOT NULL,
  `fechanacimiento` date NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `actividad` tinyint(1) NOT NULL DEFAULT '1',
  `rol` varchar(50) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `token_huella` text,
  `activo_biometria` tinyint(1) NOT NULL,
  `subdivision_personal` varchar(100) DEFAULT NULL,
  `diasPermitidos` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Idusuario`, `nombre`, `primer_apellido`, `segundo_apellido`, `nif`, `fechanacimiento`, `estado`, `actividad`, `rol`, `telefono`, `email`, `token_huella`, `activo_biometria`, `subdivision_personal`, `diasPermitidos`) VALUES
(1, 'Juan', 'García', 'López', '12345678Z', '1990-05-15', 1, 1, 'Administrador', '612345678', 'juan.garcia@email.com', NULL, 0, 'Recursos Humanos', 30),
(2, 'María', 'Pérez', 'Sánchez', '87654321X', '1985-11-30', 1, 0, 'Usuario', '623456789', 'maria.perez@email.com', NULL, 0, 'Contabilidad', 20),
(3, 'Carlos', 'Rodríguez', NULL, '45678912Y', '1995-02-20', 0, 1, 'Técnico', '634567890', 'carlos.rodriguez@email.com', NULL, 0, 'Informática', 30),
(4, 'Ana', 'Martínez', 'Gómez', '98765432W', '1988-09-10', 1, 1, 'Supervisor', '645678901', 'ana.martinez@email.com', NULL, 0, 'Producción', 45),
(5, 'Luis', 'Fernández', 'Díaz', '32165487V', '1992-07-25', 1, 0, 'Usuario', NULL, 'luis.fernandez@email.com', NULL, 0, NULL, 15);

--
-- Índices para tablas volcadas
--

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
  ADD UNIQUE KEY `nif` (`nif`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tipo_ausencia`
--
ALTER TABLE `tipo_ausencia`
  MODIFY `id_tipo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Idusuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
