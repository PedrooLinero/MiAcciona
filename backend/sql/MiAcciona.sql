-- Crear la tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    Idusuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50),
    nif VARCHAR(9) UNIQUE NOT NULL,
    fechanacimiento DATE NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    actividad BOOLEAN NOT NULL DEFAULT TRUE,
    rol VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100) NOT NULL,
    subdivision_personal VARCHAR(100)
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, primer_apellido, segundo_apellido, nif, fechanacimiento, estado, actividad, rol, telefono, email, subdivision_personal) VALUES
('Juan', 'García', 'López', '12345678Z', '1990-05-15', TRUE, TRUE, 'Administrador', '612345678', 'juan.garcia@email.com', 'Recursos Humanos'),
('María', 'Pérez', 'Sánchez', '87654321X', '1985-11-30', TRUE, FALSE, 'Usuario', '623456789', 'maria.perez@email.com', 'Contabilidad'),
('Carlos', 'Rodríguez', NULL, '45678912Y', '1995-02-20', FALSE, TRUE, 'Técnico', '634567890', 'carlos.rodriguez@email.com', 'Informática'),
('Ana', 'Martínez', 'Gómez', '98765432W', '1988-09-10', TRUE, TRUE, 'Supervisor', '645678901', 'ana.martinez@email.com', 'Producción'),
('Luis', 'Fernández', 'Díaz', '32165487V', '1992-07-25', TRUE, FALSE, 'Usuario', NULL, 'luis.fernandez@email.com', NULL);