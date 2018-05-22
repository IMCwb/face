const mysql = require('mysql')
const http = require('http')
const querystring = require('querystring')

const HOST = '120.79.57.154'
const PATH = '/face_recog/'
const METHOD = 'POST'
const TOKEN = '1b9a5c4d73b2e45ff8477e554581f1ea'

const CLUE = true
const LOST = false

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  port: '3306',
  database: 'face'
})

const sql = `
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Photo;
DROP TABLE IF EXISTS Lost;
DROP TABLE IF EXISTS Clue;
DROP TABLE IF EXISTS Possible_match;

CREATE TABLE User(
    user_id CHAR(30) NOT NULL,
    name CHAR(20),
    location CHAR(100),
    contact BIGINT,
    PRIMARY KEY(user_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Photo(
    clue_or_lost_id INT(30) UNSIGNED NOT NULL,
    photo_id INT,
    from_clue INT(1),
    photo MEDIUMBLOB NOT NULL,
    eigen_vector MEDIUMBLOB NOT NULL,
    PRIMARY KEY(photo_id, clue_or_lost_id, from_clue)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Clue(
    clue_id INT(30) UNSIGNED AUTO_INCREMENT,
  provider_id CHAR(30) NOT NULL,
    clue_location CHAR(100),
  clue_description TEXT,
    PRIMARY KEY(clue_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Lost(
    lost_id INT(30) UNSIGNED AUTO_INCREMENT,
    provider_id CHAR(30) NOT NULL,
    name CHAR(20) NOT NULL,
    gender INT(1) NOT NULL,
    birth_date DATE,
    person_location CHAR(100),
    contact BIGINT NOT NULL,
    contact_name CHAR(20) NOT NULL,
    lost_description TEXT,
    last_location CHAR(100),
    lost_date DATE,
    PRIMARY KEY(lost_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Possible_match(
    match_id INT UNSIGNED AUTO_INCREMENT,
    lost_id BIGINT NOT NULL,
    clue_id BIGINT NOT NULL,
    possibility FLOAT(5),
    PRIMARY KEY(match_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;`

exports.init = () => {
  let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    port: '3306',
    database: 'face',
    multipleStatements: true
  })
  con.query(sql, (e, res) => {
    if (e) throw e
  })
  con.end();
}

exports.new_user = (data) => {
  pool.getConnection((e, con) => {
    con.query(`INSERT INTO USER(user_id) VALUES(${data['OPENID']})`, (err, res) => {
      if (err) throw err
    })
  })
}

exports.new_lost = (data) => {
  const sql = `INSERT INTO Lost( provider_id,
            name, gender, birth_date, person_location,
            contact, contact_name, lost_description, last_location,lost_date)
            VALUES( ${data['provider_id']},
            "${data['name']}", ${data['gender']},"${data['birth_date']}","${data['person_location']}",
            ${data['contact']}, "${data['contact_name']}", "${data['lost_description']}", "${data['last_location']}", "${data['lost_date']}")`
  const images = data['image']
  exports.__new_info(sql, images, LOST)
}
exports.new_clue = (data) => {
  const sql = `INSERT INTO Clue(provider_id, clue_location, clue_description)
               VALUES(${data['provider_id']},"${data['clue_location']}","${data['clue_description']}")`
  console.log(sql)
  const images = data['image']
  exports.__new_info(sql, images, CLUE)
}
exports.__new_info = (sql, images, which) => {
  pool.getConnection((e, con) => {
    if (e) throw e
    con.query(sql, (e, res) => {
      if (e) throw e
      const clue_id = res['insertId']
      //多张
      // for (var index = 0; index < images.length; index++) {
      //   exports.new_pic(index.toString(), clue_id, to_clue, images[index])
      // }
      //exports.new_pic('0', clue_id, which, images)
    })
    con.release()
  })
}
exports.new_pic = (photo_id, info_id, which, photo_to_detect) => {
  photo_to_detect = photo_to_detect.toString('base64')
  //上传图片
  const data_to_send = querystring.stringify({
    image: photo_to_detect,
    img_name: photo_id,
    access_token: TOKEN
  })
  //上传选项
  const opt = {
    host: HOST,
    path: PATH,
    method: METHOD,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data_to_send.length
    }
  }
  //连接
  const req = http.request(opt, feedback => {
    var chunks = []
    var res = {}
    feedback.on('data', result => {
      chunks.push(result)
    }).on('end', () => {
      let res = Buffer.concat(chunks)
      res = JSON.parse(res)
      console.log(res)
      exports.__insert_pic(info_id, 0, which, photo_to_detect, res['face_list'])
    })
  })
  req.write(data_to_send, + '\n')
  req.end()
}

exports.__insert_pic = (info_id, index = 0, which, pic, eigen_vectors) => {
  const sql = `INSERT INTO Photo( photo_id, clue_or_lost_id, from_clue, photo, eigen_vector)
            VALUES(${index},${info_id},${which},${pic},${eigen_vectors})`
  pool.getConnection((e, con) => {
    con.query(sql, (e, res) => {
      if (e) throw e
    })
    con.release()
  })
}

exports.get_clue = async (data) => {
  let sql = "SELECT * FROM Clue WHERE "
  let str_attr = ["clue_description", "clue_location"]
  let num_attr = ["clue_id", "provider_id"]
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}"`
  })
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]}`
  })
  let fetch_data = () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((conn_err, connection) => {
        if (conn_err) throw conn_err
        connection.query(sql, (err, res) => {
          if (err) throw err
          resolve(res)
        })
      })
    })
  }
  let res = await fetch_data()
  return res
}

exports.get_lost = async (data) => {
  let sql = "SELECT * FROM Lost WHERE "
  let str_attr = ["person_location", "name", "contact_name", "lost_description", "last_location", "birth_date", "lost_date"]
  let num_attr = ["lost_id", "provider_id", "gender", "contact"]
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}"`
  })
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]}`
  })
  let fetch_data = () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((conn_err, connection) => {
        if (conn_err) throw conn_err
        connection.query(sql, (err, res) => {
          if (err) throw err
          resolve(res)
        })
      })
    })
  }
  let res = await fetch_data()
  return res
}

exports.edit_lost = (edit) => {
  var sql = `UPDATE Lost 
                SET name=${edit['name']} , gender=${edit['gender']}, birth_date=${edit['birth_date']}, person_location=${edit['person_location']}, 
                    contact=${edit['contact']}, contact_name=${edit['contact_name']}, lost_description=${edit['lost_description']}, 
                    last_location=${edit['last_location']}, lost_date=${edit['lost_date']} 
                WHERE lost_id = ${edit['lost_id']}`

  pool.getConnection((e, connection) => {
    if (e) console.log('[CONNECT] - ', e.message)
    connection.query(sql, function (e, result) {
      if (e) {
        console.log('[UPDATE] - ', e.message);
      }
    })
    connection.release()
  })
}
exports.edit_clue = (clue) => {
  var sql = `UPDATE Clue 
                SET clue_location=${clue['clue_location']}, clue_description=${clue['clue_description']}
                WHERE clue_id = ${clue['clue_id']}`

  pool.getConnection((e, con) => {
    if (e) console.log('[CONNECT] - ', e.message)
    con.query(sql, function (e, result) {
      if (e) {
        console.log('[UPDATE] - ', e.message);
      }
    })
    con.release()
  })
}
//增加新图片
exports.edit_pic = () => {
  connection.connect();
  var modSql = 'UPDATE Photo SET photo =csdasdasdasd, eigen_vector=[14,12,12,12,12] WHERE photo_id = 5';//更新数据的请求 是photo_id=5的图片进行修改
  var modSqlParams = ['5', '0', '1', 'csdasdasdasd', '[13,12,12,12,12]'];//修改数据

  //改
  connection.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
    console.log('--------------------------UPDATE----------------------------');
    console.log('UPDATE affectedRows', result.affectedRows);
    console.log('-----------------------------------------------------------------\n\n');
  });

  //断开数据库连接
  connection.end();
}