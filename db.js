const mysql = require('mysql')
const http = require('http')
const querystring = require('querystring')

const HOST = '120.79.57.154'
const PATH = '/face_recog/'
const METHOD = 'POST'
const TOKEN = '1b9a5c4d73b2e45ff8477e554581f1ea'

const CLUE = true
const LOST = false

const db_pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0000',
  port: '3306',
  database: 'face'
})

exports.new_user = (data) => {
  db_pool.getConnection((err, connection) => {
    connection.query(`INSERT INTO USER(user_id) VALUES(${data['OPENID']})`, (err, res) => {
      if (err) throw err
    })
  })
}

exports.new_lost = (data) => {
  const sql = `INSERT INTO Lost(\
            provider_id,\
            name, gender, birth_date, person_location,\
            contact, contact_name, lost_description, last_location,lost_date)\
            VALUES(
            ${data['provider_id']},\
            ${data['name']}, ${data['gender']},${data['birth_date']},${data['person_location']},\
            ${data['contact']}, ${data['contact_name']}, ${data['lost_description']}, ${data['last_location']}, ${data['lost_date']})`

  const images = data['image']
  exports.__new_info(sql, images, LOST)
}
exports.new_clue = (data) => {

  const sql = `INSERT INTO Clue(provider_id, clue_location, clue_description)\
               VALUES(${data['provider_id']},${data['clue_location']},${data['clue_description']})`
  const images = data['image']

  exports.__new_info(sql, param, images, CLUE)
}
exports.__new_info = (sql, images, which) => {
  db_pool.getConnection((con_err, connection) => {
    connection.query(sql, (err, res) => {
      if (err) throw err
      const clue_id = res['insertId']
      //多张
      // for (var index = 0; index < images.length; index++) {
      //   exports.new_pic(index.toString(), clue_id, to_clue, images[index])
      // }
      exports.new_pic('0', clue_id, which, images)
    })
    connection.release()
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
  const sql = `INSERT INTO Photo( photo_id, clue_or_lost_id, from_clue, photo, eigen_vector)\
            VALUES(${index},${info_id},${which},${pic},${eigen_vectors})`

  db_pool.getConnection((con_err, connection) => {
    connection.query(sql, (err, res) => {
      if (err) throw err
    })
    connection.release()
  })
}

exports.get_info = async (data, which) => {
  let sql = "SELECT * FROM "


  if (which == true) sql += "Clue "
  else sql += "Lost "

  sql += "WHERE "
  if (data['provider_id'] != undefined) {
    sql += "provider_id = " + data['provider_id']
  } else if (which) sql += "clue_id = " + data['clue_id']
  else sql += "lost_id" + data['lost_id']

  let fetch_data = () => {
    return new Promise((resolve, reject) => {
      db_pool.getConnection((conn_err, connection) => {
        if (conn_err) throw conn_err
        connection.query(sql, null, (err, res) => {
          if (err) throw err
          resolve(res)
        })
      })
    })
  }
  let data = await fetch_data()
  return data
}

exports.edit_lost = (lost_to_edit) => {
  var sql = `UPDATE Lost \
                SET name=${lost_to_edit['name']} , gender=${lost_to_edit['gender']}, birth_date=${lost_to_edit['birth_date']}, person_location=${lost_to_edit['person_location']}, \
                    contact=${lost_to_edit['contact']}, contact_name=${lost_to_edit['contact_name']}, lost_description=${lost_to_edit['lost_description']}, \
                    last_location=${lost_to_edit['last_location']}, lost_date=${lost_to_edit['lost_date']} \
                WHERE lost_id = ${lost_to_edit['lost_id']}`

  db_pool.getConnection((err, connection) => {
    if (err) console.log('[CONNECT] - ', err.message)
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[UPDATE] - ', err.message);
      }
    })
    connection.release()
  })
}
exports.edit_clue = (clue_to_edit) => {
  var sql = `UPDATE Clue \
                SET clue_location=${clue_to_edit['clue_location']}, clue_description=${clue_to_edit['clue_description']} \
                WHERE clue_id = ${clue_to_edit['clue_id']}`

  db_pool.getConnection((err, connection) => {
    if (err) console.log('[CONNECT] - ', err.message)
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[UPDATE] - ', err.message);
      }
    })
    connection.release()
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