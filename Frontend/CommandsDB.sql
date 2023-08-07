CREATE DATABASE todo;

USE todo;

CREATE TABLE users(
	i_id_user INT PRIMARY KEY AUTO_INCREMENT,
    s_login_users VARCHAR(255) NOT NULL,
    s_password_users VARCHAR(255) NOT NULL
);

CREATE TABLE todo(
	i_id_todo INT PRIMARY KEY AUTO_INCREMENT,
	s_id_user_todo INT NOT NULL,
    s_todo_todo VARCHAR(255),
    v_done_todo CHAR
);