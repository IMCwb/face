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
        method: 'POST',
        path: '/upload_lost',
        handler: (request, reply) => {
            //新建失踪人口信息,获取数据库id
            var lost_id = db.new_lost()
            algo.upload_pic(request.payload['image'], lost_id)
            return 'successful'
        }
    }, {
        method: 'POST',
        path: 'upload_clue',
        handler: (request, reply) => {
            //新建线索信息，获取数据库id
            var clue_id = db.new_clue()
            algo.upload_pic(request.payload['image'], clue_id)
        }
    }, {
        method: 'GET',
        path: '/get_massage',
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