#create database face;
DROP DATABASE IF EXISTS face;
CREATE DATABASE face;
USE face;

CREATE TABLE User(
    user_id CHAR(30) NOT NULL,
    name CHAR(20) NOT NULL,
    password CHAR(20),
    location CHAR(100),
    contact BIGINT,
    PRIMARY KEY(user_id))ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INSERT INTO User(name, password, location, contact) VALUES (
--     '陈文彬',
--     '0000',
--     '广东省广州市番禺区华南理工大学大学城校区C10',
--     13416349304);

CREATE TABLE Photo(
    clue_or_lost_id BIGINT NOT NULL,
    photo_id INT UNSIGNED,
    from_clue INT(1),
    photo MEDIUMBLOB NOT NULL,
    eigen_vector MEDIUMBLOB NOT NULL,
    PRIMARY KEY(photo_id, clue_or_lost_id, from_clue)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INSERT INTO Photo(photo_id, clue_or_lost_id, from_clue, photo, eigen_vector) VALUES (
--     0,
--     0,
--     1,
--     'asdasdasdasd',
--     '[12,12,12,12,12]');

CREATE TABLE Clue(
    clue_id BIGINT UNSIGNED AUTO_INCREMENT,
    provider_id CHAR(30) NOT NULL,
    clue_location CHAR(100),
    -- clue_time DATETIME,
    clue_description TEXT,
    PRIMARY KEY(clue_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INSERT INTO Clue(provider_id, clue_location, clue_time, clue_description) VALUES (
--     '1',
--     '广东省广州市番禺区华南理工大学大学城校区C10',
--     '2018-04-15 14:09:26',
--     '这个是描述信息');

CREATE TABLE Lost(
    lost_id BIGINT UNSIGNED AUTO_INCREMENT,
    provider_id CHAR(30) NOT NULL,
    /* person_id CHAR(20) NOT NULL, */
    person_location CHAR(100),
    name CHAR(20) NOT NULL,
    gender INT(1) NOT NULL,
    contact BIGINT NOT NULL,
    contact_name CHAR(20) NOT NULL,
    lost_description TEXT,
    last_location CHAR(100),
    birth_date DATE,
    lost_date DATE,
    PRIMARY KEY(lost_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INSERT INTO Lost(person_id, person_location, name, gender, contact, contact_name, lost_description, last_location, birth_date) VALUES (
--     '440223199801140010',
--     '广东省韶关市'，
--     '陈文彬',
--     1,
--     13416349304,
--     '陈文彬',
--     '描述信息'
--     '广东省广州市番禺区华南理工大学大学城校区C10',
--     '1998-01-14');

CREATE TABLE Possible_match(
    match_id INT UNSIGNED AUTO_INCREMENT,
    lost_id BIGINT NOT NULL,
    clue_id BIGINT NOT NULL,
    possibility FLOAT(5),
    PRIMARY KEY(match_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO Possible_match(lost_id, clue_id, possibility) VALUES (
    1,
    1,
    96.68
);


#clue 加上联系人姓名和电话