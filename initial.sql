/* USE face; */
drop database face;
create database face;
use face;

CREATE TABLE User(
    `user_id` CHAR(30) NOT NULL,
    `name` CHAR(20),
    `location` CHAR(100),
    `contact` BIGINT,
    PRIMARY KEY(user_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Photo(
    `clue_or_lost_id` INT(30) UNSIGNED NOT NULL,
    `photo_id` INT,
    `from_clue` INT(1),
    `photo` MEDIUMBLOB NOT NULL,
    `eigen_vector` MEDIUMBLOB NOT NULL,
    PRIMARY KEY(photo_id, clue_or_lost_id, from_clue)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Clue(
    `clue_id` INT(30) UNSIGNED AUTO_INCREMENT,
    `provider_id` CHAR(30) NOT NULL,
    `clue_location` CHAR(100),
    -- clue_time DATETIME,
    `clue_description` TEXT,
    PRIMARY KEY(clue_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Lost(
    `lost_id` INT(30) UNSIGNED AUTO_INCREMENT,
    `provider_id` CHAR(30) NOT NULL,
    /* person_id CHAR(20) NOT NULL, */
    `person_location` CHAR(100),
    `name` CHAR(20) NOT NULL,
    `gender` INT(1) NOT NULL,
    `contact` BIGINT NOT NULL,
    `contact_name` CHAR(20) NOT NULL,
    `lost_description` TEXT,
    `last_location` CHAR(100),
    `birth_date` DATE,
    `lost_date` DATE,
    PRIMARY KEY(lost_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Possible_match(
    `match_id` INT UNSIGNED AUTO_INCREMENT,
    `lost_id` BIGINT NOT NULL,
    `clue_id` BIGINT NOT NULL,
    `possibility` FLOAT(5),
    PRIMARY KEY(match_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO Possible_match(lost_id, clue_id, possibility) VALUES (
    1,
    1,
    96.68
);

#clue 加上联系人姓名和电话