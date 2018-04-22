//filesystem
/*
var fs = require('fs')
var setting = fs.readFile('setting.conf')
*/

//database
import { createConnection } from "mysql";

var connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'face'
})

connection.connect()

function getUser(name) {
    var sql = 'SELECT * FROM User'
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err.message)
            return;
        }
        console.log(result)
    })
}

getUser('陈文彬')

// connection.
