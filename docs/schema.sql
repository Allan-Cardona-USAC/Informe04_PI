
-- Base de datos para la práctica de Desarrollo Web 
DROP DATABASE IF EXISTS usac_reviews;
CREATE DATABASE usac_reviews CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE usac_reviews;

-- Usuarios creacion de tabla para almacenar usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro_academico VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cursos creacion de tabla para almacenar cursos
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL
);

-- Catedráticos/Auxiliares creacion de tabla para almacenar catedraticos
CREATE TABLE instructors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL
);

-- Publicaciones creacion de tabla para almacenar publicaciones
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo ENUM('CURSO', 'CATEDRATICO') NOT NULL,
  curso_id INT NULL,
  instructor_id INT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (curso_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL
);

-- Comentarios creacion de tabla para almacenar comentarios en publicaciones
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cursos aprobados por usuario (para evitar múltiples aprobaciones del mismo curso)
CREATE TABLE approved_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_course (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tokens para restablecer contraseña (modo básico) esto no esta funcional asique no es necesario
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(100) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
