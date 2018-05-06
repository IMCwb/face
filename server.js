//hapiJS
const hapi = require('hapi');

//调用算法的模块
const algo = require('./algorithm')

//调用数据库模块
const db = require('./db')

//服务器
const server = hapi.server({
    port: 3000,
    host: 'localhost'
})

server.route([
    //上传失踪信息
    {
        path: '/upload_lost',
        method: 'POST',
        handler: (request, reply) => {
            //新建失踪人口信息,获取数据库id
            var data = request.payload
            lost_id = db.new_lost(data)
            return 'successful'
        }
    },
    //上传线索信息
    {
        path: '/upload_clue',
        method: 'POST',
        handler: (request, reply) => {
            //新建线索信息,将线索信息存入Clue，将图片存入Photo
            db.new_clue(request.payload)
            return 'successful'
        }
    },




    //修改失踪信息
    {
        path: '/modify_lost',
        method: 'POST',
        handler: (request, reply) => {
            //修改时仅包含修改信息
            var data = request.payload
            // var clue_id = db.new_clue(data)
            algo.upload_pic(data['image'], clue_id)
            return 'successful'
        }
    },
    //修改失踪信息
    {
        path: '/modify_clue',
        method: 'POST',
        handler: (request, reply) => {
            //仅修改信息
            var data = request.payload
            var clue_id = db.new_clue(data)
            algo.upload_pic(data['image'], clue_id)
            return 'successful'
        }

    },
    //推送
    {
        path: '/get_massage',
        method: 'GET',
        handler: (request, reply) => {
            //根据用户信息获取推送消息
        }
    }
]);

server.start()
console.log('server is running on port 3000.')

// const init = async () => {

//     await server.register({
//         // plugin: require('hapi-pino'),
//         options: {
//             prettyPrint: false,
//             logEvents: ['response']
//         }
//     });

//     await server.start();
//     console.log(`Server running at: ${server.info.uri}`);
// };

// process.on('unhandledRejection', (err) => {

//     console.log(err);
//     process.exit(1);
// });

// init();