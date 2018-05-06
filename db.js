const mysql = require('mysql');
// const algo = require('./algorithm')

const http = require('http')
const querystring = require('querystring')
const connection_setting = {
  host: 'localhost',
  user: 'root',
  password: '0000',
  port: '3306',
  database: 'face'
}

const HOST = '120.79.57.154'
const PATH = '/face_recog/'
const METHOD = 'POST'
const TOKEN = '1b9a5c4d73b2e45ff8477e554581f1ea'

const to_clue = true
const to_lost = false

exports.new_lost = (data) => {
  var connection = mysql.createConnection(connection_setting)
  connection.connect()

  var sql = 'INSERT INTO Lost(\
            provider_id,\
            // person_id,\
            name, gender, birth_date, person_location,\
            contact, contact_name, lost_description, last_location,lost_date)\
            VALUES(?,?,?,?,?,?,?,?,?,?)'

  var params = [
    data['provider_id'],

    // data['person_id'],
    data['name'],
    data['gender'],
    data['birth_date'],
    data['person_location'],

    data['contact'],
    data['contact_name'],
    data['lost_description'],
    data['last_location'],
    data['lost_date'],
  ]

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message)
      connection.end()
    } else {
      connection.query('SELECT @@IDENTITY', (err, result) => {
        if (err) {
          console.log('[FETCH ID ERROR] - ', err.message)
          connection.end()
        }
        var lost_id = result[0]['@@IDENTITY']
        connection.end()
        var images = data['image']
        for (var index = 0; index < images.length; index++) {
          exports.new_pic(index.toString(), lost_id, to_lost, images[index])
        }
      })
    }
  })
}

//插入线索信息，，返回线索的id
exports.new_clue = (data) => {
  // connection.connect()
  var connection = mysql.createConnection(connection_setting)

  var sql = 'INSERT INTO Clue(\
            provider_id,\
            clue_location,clue_time,clue_description)\
            VALUES(?,?,?,?)'

  var params = [
    data['provider_id'],

    data['clue_location'],
    data['clue_time'],
    data['clue_description']
  ]

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message)
      connection.end()
    } else {
      connection.query('SELECT @@IDENTITY', (err, result) => {
        if (err) {
          console.log('[FETCH ID ERROR] - ', err.message)
          connection.end()
        }
        var clue_id = result[0]['@@IDENTITY']
        connection.end()
        var images = data['image']
        for (var index = 0; index < images.length; index++) {
          exports.new_pic(index.toString(), clue_id, to_clue, images[index])
        }
      })
    }
  })
}

exports.new_pic = (photo_id, clue_id, if_clue, photo_to_detect) => {
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

      //数据库操作
      var connection = mysql.createConnection(connection_setting)
      connection.connect()

      var sql = 'INSERT INTO Photo(\
                  photo_id,\
                  clue_or_lost_id, from_clue,\
                  photo, eigen_vector)\
                  VALUES(?,?,?,?,?)'

      var params = [
        photo_id,
        clue_id, if_clue,

        photo_to_detect, res['face_list']
      ]
      console.log(res)
      connection.query(sql, params, (err, result) => {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message)
        }
        connection.end()
      })
    })
  })
  req.write(data_to_send, + '\n')
  req.end()
}

//修改线索信息，暂不包含图片的修改
exports.edit_clue = () => {

  connection.connect();

  var modSql = 'UPDATE Clue SET clue_time =2018-04-15 14:09:26, clue_description=这个是描述信息] WHERE clue_id = 2';
  var modSqlParams = ['2', '1', '广东省广州市番禺区华南理工大学大学城校区C10', '2018-04-15 14:10:26', '这个是描述信息2'];
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
