const mysql = require('mysql')
const http = require('http')
const querystring = require('querystring')

const config = require('./config')

const pool = mysql.createPool({
  host: config.db_host,
  user: config.db_user,
  password: config.db_password,
  port: config.db_port,
  database: config.db_default_database,
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
exports.new_image = (data) => {
  let eigen_vector = null
  // eigen_vector = await exports.upload_image(data)
  //TODO 如果直接用base64这边要修改
  const sql = `INSERT INTO ${data['which'] + '_photo'}(info_id, photo, eigen_vector)
            VALUES(${data['info_id']},"${data['image'].toString('base64')}",'${JSON.stringify(eigen_vector)}')`
  console.log("[NEW_IMAGE]")
  return exports.do_sql(sql)
}
exports.upload_image = (data) => {
  let pic = data['image'].toString('base64')
  const data_to_send = querystring.stringify({
    image: pic,
    img_name: data['info_id'],
    access_token: config.TOKEN
  })
  const opt = {
    host: config.HOST,
    path: config.PATH,
    method: config.METHOD,
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
  let sql = "SELECT * FROM clue WHERE "
  let str_attr = ["description", "location"]
  let num_attr = ["clue_id", "provider_id"]
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]} AND `
  })
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}" AND `
  })
  sql = sql.substring(0, sql.length - 4)
  console.log("[GET_CLUE")
  return exports.do_sql(sql)
}
exports.get_lost = (data) => {
  let sql = "SELECT * FROM lost WHERE "
  let str_attr = ["name", "person_location", "contact_name", "description", "last_location", "birthday", "since"]
  let num_attr = ["lost_id", "provider_id", "gender", "contact"]
  num_attr.forEach(element => {
    if (data[element]) sql += `${element} = ${data[element]} AND `
  })
  str_attr.forEach(element => {
    if (data[element]) sql += `${element} LIKE "${data[element]}" AND `
  })
  sql = sql.substring(0, sql.length - 4)
  console.log("[GET_LOST]")
  return exports.do_sql(sql)
}
exports.get_image = (data) => {
  sql = `SELECT * FROM ${data['which'] + "_photo"} WHERE info_id = ${data['info_id']}`
  console.log("[GET_IMAGE]")
  return exports.do_sql(sql)
}
exports.edit_lost = (lost) => {
  let sql = "UPDATE lost SET "
  let str_attr = ["name", "person_location", "contact_name", "description", "last_location", "birthday", "since"]
  let num_attr = ["gender", "contact"]
  num_attr.forEach(element => {
    if (lost[element]) sql += `${element} = ${lost[element]},  `
  })
  str_attr.forEach(element => {
    if (lost[element]) sql += `${element} = "${lost[element]}", `
  })
  sql = sql.substring(0, sql.length - 2)
  sql += ` WHERE lost_id=${lost['lost_id']}`
  return exports.do_sql(sql)
}
exports.edit_clue = (clue) => {
  let sql = "UPDATE clue SET "
  let str_attr = ["description", "location"]
  str_attr.forEach(element => {
    if (clue[element]) sql += `${element} = "${clue[element]}", `
  })
  sql = sql.substring(0, sql.length - 2)
  sql += ` WHERE clue_id=${clue['clue_id']}`
  return exports.do_sql(sql)
}
exports.edit_image = (image) => {
  let sql
  if (image['image'] == undefined) {
    sql = `DELETE FROM ${image['which'] + "_photo"} WHERE info_id=${image['image_id']}`
  } else {
    let eigen_vector = null
    sql = `UPDATE ${image['which'] + "_photo"}
    SET photo="${image['image'].toString('base64')}", eigen_vector='${JSON.stringify(eigen_vector)}'
    WHERE info_id=${image['image_id']}`
  }
  console.log(sql)
  return exports.do_sql(sql)
}
exports.__match = () => {
  //TODO 进行匹配的函数在每次进行插入图片的时候
  //最后进行优化的时候将匹配放在显示进行
}