CREATE TABLE users(
    id int primary KEY   , --auto_increment
    name varchar(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50),
    PASSWORD VARCHAR(50),
    STATUS VARCHAR(20),
    role VARCHAR(20),
    UNIQUE(email)
);

insert INTO users(name,contactNumber,email,PASSWORD,STATUS,role) VALUES('admin','000000','admin@gmail.com','admin','true','admin');


CREATE TABLE category(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
)

CREATE TABLE products(
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    description VARCHAR(255),
    price INTEGER,
    status VARCHAR(20),
    PRIMARY KEY(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
)


