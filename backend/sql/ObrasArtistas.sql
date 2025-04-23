-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ObrasArtistas;

USE ObrasArtistas;

-- Crear la tabla Artistas
CREATE TABLE artistas (
    idartista INT AUTO_INCREMENT PRIMARY KEY,   -- idartista autoincrementable
    nombre VARCHAR(100) NOT NULL UNIQUE,         -- Nombre del artista, clave única
    apellidos VARCHAR(100),                     -- Apellidos del artista
    fechaNacimiento DATE NOT NULL,              -- Fecha de nacimiento del artista
    tipoArte ENUM('abstracto', 'creativo', 'realista', 'surrealista', 'contemporaneo') NOT NULL, -- Tipo de arte del artista
    paisDeNacimiento VARCHAR(100)               -- País de nacimiento del artista
);

-- Crear la tabla Obras con ON DELETE SET NULL
CREATE TABLE obras (
    idobra INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,         -- Nombre de la obra, clave única
    descripcion TEXT,
    fecha DATE NOT NULL,                       -- Tipo de fecha cambiado a DATE
    precio DECIMAL(10, 2),
    idartista INT NULL,                        -- Permitir valores NULL
    FOREIGN KEY (idartista) REFERENCES artistas(idartista) 
    ON DELETE SET NULL ON UPDATE CASCADE       -- Si se borra un artista, sus obras quedan con idartista = NULL
);

-- Insertar datos en la tabla Artistas
INSERT INTO artistas (nombre, apellidos, fechaNacimiento, tipoArte, paisDeNacimiento) VALUES
('Pablo', 'Picasso', '1881-10-25', 'abstracto', 'España'),
('Vincent', 'van Gogh', '1853-03-30', 'realista', 'Países Bajos'),
('Claude', 'Monet', '1840-11-14', 'realista', 'Francia'),
('Salvador', 'Dalí', '1904-05-11', 'surrealista', 'España'),
('Frida', 'Kahlo', '1907-07-06', 'surrealista', 'México'),
('Leonardo', 'da Vinci', '1452-04-15', 'realista', 'Italia'),
('Henri', 'Matisse', '1869-12-31', 'abstracto', 'Francia'),
('Andy', 'Warhol', '1928-08-06', 'contemporáneo', 'Estados Unidos'),
('Jackson', 'Pollock', '1912-01-28', 'abstracto', 'Estados Unidos'),
('Georgia', 'OKeeffe', '1887-11-15', 'contemporáneo', 'Estados Unidos'),
('Diego', 'Rivera', '1886-12-08', 'realista', 'México'),
('Marina', 'Abramović', '1946-11-30', 'contemporáneo', 'Yugoslavia'),
('René', 'Magritte', '1898-11-21', 'surrealista', 'Bélgica'),
('Edvard', 'Munch', '1863-12-12', 'realista', 'Noruega'),
('Joan', 'Miró', '1893-04-20', 'surrealista', 'España'),
('Mark', 'Rothko', '1903-09-25', 'abstracto', 'Letonia'),
('David', 'Hockney', '1937-07-09', 'contemporáneo', 'Reino Unido'),
('Gustav', 'Klimt', '1862-07-14', 'creativo', 'Austria'),
('Marc', 'Chagall', '1887-07-07', 'surrealista', 'Bielorrusia'),
('Pierre', 'Auguste Renoir', '1841-02-25', 'realista', 'Francia');


-- Insertar datos en la tabla Obras
INSERT INTO obras (nombre, descripcion, fecha, precio, idartista) VALUES
('Guernica', 'Una de las obras más emblemáticas de Picasso que muestra la devastación de la guerra.', '1937-04-27', '2000000.00', 1),
('La Noche Estrellada', 'Una famosa pintura de Van Gogh que representa un cielo nocturno lleno de estrellas.', '1889-06-01', '1500000.00', 4),
('Impresión, Sol Naciente', 'Una obra fundamental en el movimiento impresionista, creada por Monet.', '1872-11-13', '1000000.00', 3),
('La Persistencia de la Memoria', 'Una de las pinturas más conocidas de Dalí, famosa por sus relojes derretidos.', '1931-04-01', '1800000.00', 6),
('Las Dos Fridas', 'Obra famosa de Frida Kahlo que representa su dualidad como persona y artista.', '1939-07-08', '1200000.00', 1),
('La Última Cena', 'Una de las pinturas más reconocidas de Leonardo da Vinci, que representa el momento de la última cena de Jesús con sus apóstoles.', '1495-12-31', '5000000.00', 6),
('La Danza', 'Una de las obras más importantes de Matisse que representa figuras humanas en movimiento.', '1910-01-01', '2200000.00', 7),
('Campbell\s Soup Cans', 'Una serie de latas de sopa que representa la idea de la producción en masa en el arte pop de Warhol.', '1962-01-01', '1500000.00', 8),
('Convergence', 'Obra de Pollock que representa el estilo de pintura conocido como “drip painting”.', '1952-01-01', '1900000.00', 9),
('Jimson Weed', 'Una pintura que captura la belleza de la flor Jimson Weed, famosa de O\Keeffe.', '1936-01-01', '2000000.00', 1),
('Man at the Crossroads', 'Un mural famoso de Rivera que representa los avances tecnológicos y científicos.', '1934-01-01', '2500000.00', 13),
('The Artist is Present', 'Una performance de Marina Abramović donde ella se sentaba en silencio frente a los espectadores.', '2010-03-14', '300000.00', 12),
('El Hijo del Hombre', 'Obra conocida de Magritte, que representa a un hombre con un sombrero, cuyo rostro está cubierto por una manzana flotante.', '1964-09-01', '1300000.00', 11),
('El Grito', 'Una pintura famosa de Munch que expresa angustia y desesperación.', '1893-12-01', '3500000.00', 14),
('El Carnaval de Arlequín', 'Una obra de Miró que muestra su estilo surrealista único.', '1924-01-01', '2700000.00', 1),
('No. 61 (Rust and Blue)', 'Una pintura de Rothko que muestra colores vibrantes y formas abstractas.', '1953-01-01', '1400000.00', 16),
('A Bigger Splash', 'Una pintura pop-art de Hockney que muestra una figura saltando al agua en una piscina.', '1967-01-01', '2200000.00', 13),
('El Beso', 'Una de las obras más famosas de Klimt que representa el amor romántico entre dos personas.', '1907-01-01', '5000000.00', 18),
('La Casa con Tejado Rojo', 'Una pintura que muestra la vida rural, famosa de Chagall.', '1917-01-01', '1500000.00', 4),
('Le Moulin de la Galette', 'Una pintura de Renoir que representa una escena alegre de la vida parisina.', '1876-01-01', '2500000.00', 12);
-- Modificar la tabla `obras` para agregar la columna `imagen_url`
ALTER TABLE obras ADD COLUMN imagen_url VARCHAR(255);

-- Crear índices en las columnas más utilizadas para búsquedas
CREATE INDEX idx_artista_nombre ON artistas (nombre);
CREATE INDEX idx_artista_apellidos ON artistas (apellidos);
CREATE INDEX idx_artista_fecha ON artistas (fechaNacimiento);
CREATE INDEX idx_artista_tipo ON artistas (tipoArte);

CREATE INDEX idx_obra_nombre ON obras (nombre);
CREATE INDEX idx_obra_fecha ON obras (fecha);
CREATE INDEX idx_obra_precio ON obras (precio);

-- Actualizar la tabla obras con URLs de imágenes
UPDATE obras SET imagen_url = 'https://static5.museoreinasofia.es/sites/default/files/obras/DE00050.jpg' WHERE nombre = 'Guernica';
UPDATE obras SET imagen_url = 'https://gatopinto.com/arteyucatan/wp-content/uploads/2024/04/43884-2.webp' WHERE nombre = 'La Noche Estrellada';
UPDATE obras SET imagen_url = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-aDhgMORjc6T4u7zxZGd0D7lTYf4vksYvZ0gBHH9-vplEuYEQ_COlpqEyoDU04CsY69pLjq7ikc_JbJARU_hhAPOu3gZMTKRIT1MaY1__gS9TUFbZMOCVGWhT_ntj0-0i8R6moog-I86q/w1200-h630-p-k-no-nu/Puzzle_de_madera_Sol_Naciente_de_Monet_1024x1024.jpg' WHERE nombre = 'Impresión, Sol Naciente';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvbnljLTItMjY4LmpwZyIsInJlc2l6ZSwyMDAwLDIwMDAiXX0.kyLjy8saXwwv-oGbJBh7X0tgXbgo4aN-d5IcAxw7A2w.jpg' WHERE nombre = 'La Persistencia de la Memoria';
UPDATE obras SET imagen_url = 'https://lacamaradelarte.com/wp-content/uploads/2024/09/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvNWQ3YjdjOGI3NzczOS5qcGVnIiwicmVzaXplLDE1MDB8Zm9ybWF0LHdlYnAiXX0.RgLrcnkUSJgdaO52RxFldCAP7YalfAScsb9Fhd3OPQQ-1016x1024.webp' WHERE nombre = 'Las Dos Fridas';
UPDATE obras SET imagen_url = 'https://wp.es.aleteia.org/wp-content/uploads/sites/7/2018/03/web3-the-last-supper-public-domain.jpg' WHERE nombre = 'La Última Cena';
UPDATE obras SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/La_Danse_II%2C_par_Henri_Matisse.jpg/1200px-La_Danse_II%2C_par_Henri_Matisse.jpg' WHERE nombre = 'La Danza';
UPDATE obras SET imagen_url = 'https://uploads1.wikiart.org/00160/images/andy-warhol/cri-000000318242.jpg!Large.jpg' WHERE nombre = 'Campbell\s Soup Cans';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvcG9sbG9ja19jb252ZXJnZW5jZS5qcGciLCJyZXNpemUsODAwIl19.mhSvgwqABkhSZnfHN2ojH6tuhtIJ_sTcN4JI2cY1CqY.jpg' WHERE nombre = 'Convergence';
UPDATE obras SET imagen_url = 'https://www.singulart.com/blog/wp-content/uploads/2024/03/jimson-weed.jpg' WHERE nombre = 'Jimson Weed';
UPDATE obras SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Libro_Los_Viejos_Abuelos_Foto_68.png/1200px-Libro_Los_Viejos_Abuelos_Foto_68.png' WHERE nombre = 'Man at the Crossroads';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvNWM5YTNjMjk4MTkzMy5qcGciLCJyZXNpemUsMjAwMCwyMDAwIl19.RI1fplWqH1zjWBQKMHuAUXBBrOJqjmaWIdZefkugI-Y.jpg' WHERE nombre = 'The Artist is Present';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvZjU5Zjk5YWI0Nzg0OWZjMDQ2MzNiOGYzZmJlZjVlM2MuanBnIiwicmVzaXplLDIwMDAsMjAwMCJdfQ.ZpWCkKqiJfssXdALPkNLpmJkl5Tpgjuui7OmaDZB5VI.jpg' WHERE nombre = 'El Hijo del Hombre';
UPDATE obras SET imagen_url = 'https://hips.hearstapps.com/hmg-prod/images/the-scream-tempera-and-pastel-on-wood-1893-one-of-four-news-photo-1721646340.jpg?resize=980:*' WHERE nombre = 'El Grito';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvbWlyYzNiM19jYXJuYXZhbC5qcGciLCJyZXNpemUsODAwIl19.Haxj8-9ZQWpf7JhwMdCsPB6OSxOvK_KmuXeOejoJjFc.jpg' WHERE nombre = 'El Carnaval de Arlequín';
UPDATE obras SET imagen_url = 'https://upload.wikimedia.org/wikipedia/en/5/5f/No_61_Mark_Rothko.jpg' WHERE nombre = 'No. 61 (Rust and Blue)';
UPDATE obras SET imagen_url = 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvMTAwODMwOTQ0XzQxOWQwNjdjZTVfby5wbmciLCJyZXNpemUsODAwIl19.Qm3MZVUCjtr4WiTYBRIor7zQLvHqFpUzXayuFsh22u0.png' WHERE nombre = 'A Bigger Splash';
UPDATE obras SET imagen_url = 'https://www.infobae.com/resizer/v2/KNQWG546Y5EOZDI5IQ3BNFAKEY.jpg?auth=976b7192d1e10d5e0698d4ca80e0ae9d1728facb9fa156e5356d115df9d13d71&smart=true&width=350&height=525&quality=85' WHERE nombre = 'El Beso';
UPDATE obras SET imagen_url = 'https://images.joseartgallery.com/9322/conversions/landscape-painting-house-with-red-roof-thumb900.jpg' WHERE nombre = 'La Casa con Tejado Rojo';
UPDATE obras SET imagen_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg/300px-Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg' WHERE nombre = 'Le Moulin de la Galette';