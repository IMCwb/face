
const  http = require('http')
const querystring = require('querystring')

const db = require('./db')

/* 获得特征向量并且存入数据
 * 输入：
 * img - 图片对象
 * name - 图片名称
 */
exports.upload_pic = (img, img_id = 'demo_id') => {
    var img = querystring.stringify({
        image: img.toString('base64'),
        img_name: img_id,
        access_token: '1b9a5c4d73b2e45ff8477e554581f1ea'
    })

    var opt = {
        host: '120.79.57.154',
        path: '/face_recog/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': img.length
        }
    }
    var req = http.request(opt, feedback => {
        var chunks = []
        var res = {}
        feedback.on('data', function (result) {
            chunks.push(result)
        })
            .on('end', function () {
                let data = Buffer.concat(chunks)
                res = JSON.parse(data)
                //插入图片信息
                db.new_pic()
                console.log(res)
            })
    })
    req.write(img + '\n')
    req.end()
}