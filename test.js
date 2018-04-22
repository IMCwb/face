const fs = require('fs')
const path = require('path')
const algo = require('./algorithm')

var f1 = path.resolve('./test_doc/data/M1.jpg')

fs.readFile(f1, function (err, data) {
    if (!err) {
        algo.send_pic(data, 'demo.jpg')
    }
})
