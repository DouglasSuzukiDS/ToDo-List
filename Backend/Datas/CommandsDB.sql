CREATE DATABASE todo;

USE todo;

CREATE TABLE users(
	iIdUsers INT PRIMARY KEY AUTO_INCREMENT,
    sLoginUsers VARCHAR(255) NOT NULL,
    sPasswordUsers VARCHAR(255) NOT NULL
);

CREATE TABLE todos(
	iIdTodos INT PRIMARY KEY AUTO_INCREMENT,
	iIdUsers INT NOT NULL,
    sTodoTodos VARCHAR(255) NOT NULL,
    bDoneTodos BOOLEAN DEFAULT false
);

INSERT INTO users (sLoginUsers, sPasswordUsers) VALUES ('root', 'root');

SELECT * FROM users WHERE sLoginUsers = 'root';
SELECT * FROM users;
DELETE FROM users;
DELETE FROM users WHERE iIdUsers = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE users RENAME COLUMN iIdUsers TO iIdUsers;

SELECT * FROM todos;
INSERT INTO todos (iIdUser, sTodoTodos) VALUES (2, 'Fazer espada');
ALTER TABLE todos AUTO_INCREMENT = 1;