USE usac_reviews;

-- Cursos
INSERT INTO courses (codigo, nombre) VALUES
('SIS101', 'Introducción a Sistemas'),
('SIS201', 'Estructuras de Datos'),
('SIS301', 'Bases de Datos'),
('SIS401', 'Ingeniería de Software'),
('MAT101', 'Cálculo I'),
('MAT201', 'Cálculo II')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Catedráticos
INSERT INTO instructors (nombre) VALUES
('Ing. Ana Gómez'),
('MSc. Luis Pérez'),
('Aux. Carlos López'),
('Ing. Marta Hernández')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Usuarios demo (contraseña: 123456 para todos)
INSERT INTO users (registro_academico, nombres, apellidos, email, password_hash) VALUES
('20210001','Juan','Perez','juan@example.com','$2b$10$EEJ/AU0QrrGj13zSFH8AW.yh6eVb3TuZ9tNj6FK8UQW.soP3mn9Oy'),
('20210002','María','Lopez','maria@example.com','$2b$10$EEJ/AU0QrrGj13zSFH8AW.yh6eVb3TuZ9tNj6FK8UQW.soP3mn9Oy'),
('20210003','Carlos','Garcia','carlos@example.com','$2b$10$EEJ/AU0QrrGj13zSFH8AW.yh6eVb3TuZ9tNj6FK8UQW.soP3mn9Oy'),
('20210004','Ana','Martinez','ana@example.com','$2b$10$EEJ/AU0QrrGj13zSFH8AW.yh6eVb3TuZ9tNj6FK8UQW.soP3mn9Oy')
ON DUPLICATE KEY UPDATE email=VALUES(email), password_hash=VALUES(password_hash);

-- Publicaciones
INSERT INTO posts (user_id, tipo, curso_id, instructor_id, mensaje, created_at) VALUES
(1,'CURSO', (SELECT id FROM courses WHERE codigo='SIS201'), NULL, 'Recomiendo ver estructuras básicas antes de este curso. Buen ritmo del catedrático.', NOW() - INTERVAL 3 DAY),
(2,'CURSO', (SELECT id FROM courses WHERE codigo='SIS301'), NULL, 'Proyecto final con MySQL y modelado relacional. Muy práctico.', NOW() - INTERVAL 2 DAY),
(3,'CATEDRATICO', NULL, (SELECT id FROM instructors WHERE nombre='Ing. Ana Gómez'), 'Explica muy claro y da buenos ejemplos.', NOW() - INTERVAL 1 DAY);

-- Comentarios
INSERT INTO comments (post_id, user_id, mensaje, created_at) VALUES
(1,2,'Totalmente de acuerdo, la primera semana es clave.', NOW() - INTERVAL 2 DAY),
(1,3,'¿Usaron listas de repaso? ¿Algún material recomendado?', NOW() - INTERVAL 2 DAY),
(2,1,'El DER se evalúa bastante, poner atención a normalización.', NOW() - INTERVAL 1 DAY),
(3,4,'Entrega rúbricas y retro rápida. Excelente.', NOW() - INTERVAL 20 HOUR);

-- Cursos aprobados
INSERT IGNORE INTO approved_courses (user_id, course_id) VALUES
(1,(SELECT id FROM courses WHERE codigo='SIS101')),
(1,(SELECT id FROM courses WHERE codigo='MAT101')),
(2,(SELECT id FROM courses WHERE codigo='SIS201')),
(3,(SELECT id FROM courses WHERE codigo='SIS301')),
(4,(SELECT id FROM courses WHERE codigo='SIS401'));
