const mysql = require('mysql')
const http = require('http')
const querystring = require('querystring')

const config = require('./config')

const HOST = '120.79.57.154'
const PATH = '/face_recog/'
const METHOD = 'POST'
const TOKEN = '1b9a5c4d73b2e45ff8477e554581f1ea'

const CLUE = 1
const LOST = 0

let pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database,
  multipleStatements: true,
})
exports.do_sql = (sql) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (e, res) => {
      if (e) throw e
      resolve(res)
    })
  })
}
exports.init = () => {
  console.log("[INITIALSING]")
  exports.do_sql(config.init_sql)
}
exports.new_user = (data) => {
  let sql = `INSERT INTO user(user_id) VALUES(${data['OPENID']})`
  console.log("[NEW_USER]\n" + sql)
  exports.do_sql(sql)
}
exports.new_lost = (data) => {
  const sql = `INSERT INTO lost(provider_id,
            name, gender, birthday, person_location,
            contact, contact_name, description, last_location,since)
            VALUES( ${data['provider_id']},
            "${data['name']}", ${data['gender']},"${data['birthday']}","${data['person_location']}",
            ${data['contact']}, "${data['contact_name']}", "${data['description']}", "${data['last_location']}", "${data['since']}")`
  console.log("[NEW_LOST]")
  return exports.do_sql(sql)
}
exports.new_clue = (data) => {
  const sql = `INSERT INTO clue(provider_id, location, description)
               VALUES(${data['provider_id']},"${data['location']}","${data['description']}")`
  console.log("[NEW_CLUE]")
  return exports.do_sql(sql)
}
exports.new_image = async (info_id, which, image) => {
  eigen_vectors = JSON.stringify(eigen_vectors)
  const table = "clue_photo"
  if (which == LOST) table = "lost_photo"
  let eigen_vector = null
  // eigen_vector = await exports.upload_image(image)
  const sql = `INSERT INTO ${table}(info_id,photo, eigen_vector)
            VALUES(${info_id},"${image}",'${JSON.stringify(eigen_vector)}')`
  await exports.do_sql(sql)
}
exports.upload_image = async (image) => {
  let image = image.toString('base64')
  const data_to_send = querystring.stringify({
    image: image,
    img_name: photo_id,
    access_token: TOKEN
  })
  const opt = {
    host: HOST,
    path: PATH,
    method: METHOD,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data_to_send.length
    }
  }
  return new Promise((resolve, reject) => {
    const req = http.request(opt, feedback => {
      let chunks = []
      let res = {}
      feedback.on('data', result => {
        chunks.push(result)
      }).on('end', () => {
        let res = Buffer.concat(chunks)
        resolve(res = JSON.parse(res))
      })
    })
    req.write(data_to_send, + '\n')
    req.end()
  })
}

exports.get_clue = (data) => {
  let sql = "SELECT * FROM Clue WHERE "
  let str_attr = ["description", "location"]
  let num_attr = ["clue_id", "provider_id"]
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}" AND `
  })
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]} AND `
  })
  sql = sql.substring(0, sql.length - 4)
  return exports.do_sql(sql)
}

exports.get_lost = async (data) => {
  let sql = "SELECT * FROM Lost WHERE "
  let str_attr = ["name", "person_location", "contact_name", "description", "last_location", "birthday", "since"]
  let num_attr = ["lost_id", "provider_id", "gender", "contact"]
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}" AND `
  })
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]} AND `
  })
  sql = sql.substring(0, sql.length - 4)
  return exports.do_sql(sql)
}

exports.get_pic = (info_id, which) => {
  which += "_photo"
  sql = `SELECT * FROM ${which} WHERE info_id = ${info_id}`
  return exports.do_sql(sql)
}

exports.edit_lost = (edit) => {
  var sql = `
  UPDATE Lost 
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
  let sql = `
  UPDATE clue 
    SET location="${clue['location']}", description="${clue['description']}"}
    WHERE clue_id = ${clue['clue_id']}`
  return exports.do_sql(sql)
}

exports.edit_pic = (image) => {
  let which = image['which'] + "_photo"
  let pic = image['image']
  let eigen_vector = exports.upload_image(pic)
  let sql = `UPDATE ${which}
    SET image=${pic}, eigen_vector=${JSON.stringify(eigen_vector)}
    WHERE info_id=${image['info_id']}`
    return exports.do_sql(sql)
}