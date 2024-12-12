

CREATE DATABASE IF NOT EXISTS red_social_nueva;
USE red_social_nueva;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'disponible',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE, 
    fecha_nacimiento DATE,
    genero VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS seguidores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seguidor_id INT NOT NULL,  
    seguido_id INT NOT NULL,  
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(seguidor_id, seguido_id), 
    CHECK (seguidor_id <> seguido_id) 
);



CREATE TABLE IF NOT EXISTS grupos_interes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    creador_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imagen_grupo VARCHAR(255), 
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS miembros_grupo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grupo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grupo_id) REFERENCES grupos_interes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_publicacion ENUM('general', 'reto', 'grupo', 'perfil') NOT NULL DEFAULT 'general',
    grupo_id INT NULL, 
    contenido TEXT NOT NULL,
    archivo VARCHAR(255), 
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES grupos_interes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS respuestas_retos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    contenido TEXT NOT NULL,
    archivo VARCHAR(255),
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reto_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_reaccion ENUM('me gusta', 'me encanta', 'me sorprende', 'me enoja', 'me entristece') NOT NULL,
    fecha_reaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
ALTER TABLE reacciones ADD UNIQUE KEY unique_reaccion (publicacion_id, usuario_id);

CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reacciones_comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_reaccion ENUM('me gusta', 'me encanta', 'me sorprende', 'me enoja', 'me entristece') NOT NULL,
    fecha_reaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_emisor_id INT NOT NULL,
    usuario_receptor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    archivo VARCHAR(255), 
    fecha_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reacciones_mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_reaccion ENUM('me gusta', 'me encanta', 'me sorprende', 'me enoja', 'me entristece') NOT NULL,
    fecha_reaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_grupal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(255) NOT NULL,
    creador_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mensajes_chat_grupal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_grupo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    archivo VARCHAR(255),
    fecha_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_grupo_id) REFERENCES chat_grupal(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reacciones_mensajes_grupal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje_grupal_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_reaccion ENUM('me gusta', 'me encanta', 'me sorprende', 'me enoja', 'me entristece') NOT NULL,
    fecha_reaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mensaje_grupal_id) REFERENCES mensajes_chat_grupal(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS llamadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_llamada ENUM('voz', 'video') NOT NULL,
    usuario_iniciador_id INT NOT NULL,
    usuario_receptor_id INT NOT NULL,
    fecha_llamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracion INT, 
    FOREIGN KEY (usuario_iniciador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    contenido TEXT,
    archivo VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira TIMESTAMP, -- La fecha y hora en que la historia expira
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);



