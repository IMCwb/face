exports.init_sql = `
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS clue_photo;
DROP TABLE IF EXISTS lost_photo;
DROP TABLE IF EXISTS lost;
DROP TABLE IF EXISTS clue;
DROP TABLE IF EXISTS possible_match;
CREATE TABLE user(
    user_id         CHAR(30) NOT NULL,
    PRIMARY KEY(user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE clue_photo(
    image_id        INT(30) UNSIGNED AUTO_INCREMENT,
    info_id         INT(30) UNSIGNED NOT NULL,
    photo           TEXT NOT NULL,
    eigen_vector    JSON NOT NULL,
    PRIMARY KEY(image_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE lost_photo(
    image_id        INT(30) UNSIGNED AUTO_INCREMENT,
    info_id         INT(30) UNSIGNED NOT NULL,
    photo           TEXT NOT NULL,
    eigen_vector    JSON NOT NULL,
    PRIMARY KEY(image_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE clue(
    clue_id         INT(30) UNSIGNED AUTO_INCREMENT,
    provider_id     CHAR(30) NOT NULL,
    location        CHAR(100),
    description     TEXT,
    PRIMARY KEY(clue_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE lost(
    lost_id         INT(30) UNSIGNED AUTO_INCREMENT,
    provider_id     CHAR(30) NOT NULL,
    name            CHAR(20) NOT NULL,
    gender          INT(1) NOT NULL,
    birthday        DATE,
    person_location CHAR(100),
    contact         BIGINT NOT NULL,
    contact_name    CHAR(20) NOT NULL,
    description     TEXT,
    last_location   CHAR(100),
    since           DATE,
    PRIMARY KEY(lost_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE possible_match(
    match_id        INT UNSIGNED AUTO_INCREMENT,
    lost_id         BIGINT NOT NULL,
    clue_id BIGINT NOT NULL,
    possibility FLOAT(5),
    PRIMARY KEY(match_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
`
exports.host = 'localhost'
exports.user = 'root'
exports.password = '0000'
exports.port = '3306'
exports.database = 'face'
