'use strict'

// var fs = require('fs')
// var path = require('path')
var http = require('http')
var querystring = require('querystring')


// var f1 = path.resolve('./test_doc/data/M2.jpg')
// var f2 = path.resolve('./test_doc/data/F2.jpg')

// var image1 = '123'
// var image2


// fs.readFile(f1, function (err, data) {
//     if (!err) {
//         image1 = data.toString('base64')
//     }

//     var data = {
//         image: image1,
//         img_name: 'M2.jpg',
//         access_token: 'b106f6181fa90872fda3bd25539a1c4d'
//     }


//     data = querystring.stringify(data)

//     var opt = {
//         host: '120.79.57.154',
//         path: '/face_recog/',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Content-Length': data.length
//         }
//     }

//     var req = http.request(opt, feedback => {
//         // res.on('data' function(data))
//         feedback.on('data', function (result) {
//             console.log(feedback.statusMessage)
//             console.log(JSON.parse(result))
//         })
//             .on('end', function () {
//                 console.log(feedback.statusMessage)
//             })
//     })
//     // req.write(data + '\n')
//     // req.end()
// })

//连接设置
var opt = {
    host: '120.79.57.154',
    path: '/face_recog/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
    }
}

//连接回掉函数
var req = http.request(opt, feedback => {
    feedback
        .on('data', function (result) {
            console.log(feedback.statusMessage)
            console.log(JSON.parse(result))
        })
        .on('end', function () {
            console.log(feedback.statusMessage)
        })
})

/* 供前端使用的接口
 * 输入：
 * img - 图片对象
 * name - 图片名称
 * 输出：
 * true
 */
function send_pic(img, name = 'demo_name') {
    var base64_img = img.toString('base64')
    var data = {
        image: base64_img,
        img_name: name,
        access_token: 'b106f6181fa90872fda3bd25539a1c4d'
    }
    opt.headers['Content-Length'] = data.length
    data = querystring(image)
    req.write(data + 'n')
    req.end()
    return true;
}

// fs.readFile(f2, function (err, data) {
//     if (!err) {
//         image2 = data.toString('base64')
//     }
// })


