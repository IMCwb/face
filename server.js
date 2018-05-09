//hapiJS
const hapi = require('hapi');

//调用数据库模块
const db = require('./db')

//服务器
const server = hapi.server({
    port: 3000,
    host: 'localhost'
})

function check(data, type = 'lost') {
    return true;
}

server.route([{
    path: '/upload_lost',
    method: 'POST',
    handler: (request, reply) => {
        lost_id = db.new_lost(request.payload)

        if (check(data, 'lost')) {
            return reply.response('data format error').code(500)
        }
        return reply.response('successful').code(200)
    }
}, {
    path: '/upload_clue',
    method: 'POST',
    handler: (request, reply) => {
        db.__new_info(request.payload)
        if (check(data, 'clue')) {
            return reply.response('data format error').code(500)
        }
        return reply.response('successful').code(200)
    }
}, {
    path: '/modify_lost',
    method: 'POST',
    handler: (request, reply) => {
        lost_id = db.edit_lost(request.payload)
        if (check(data, 'lost')) {
            return reply.response('data format error').code(500)
        }
        return reply.response('successful').code(200)
    }
}, {
    path: '/modify_clue',
    method: 'POST',
    handler: (request, reply) => {
        lost_id = db.edit_clue(request.payload)
        if (check(data, 'clue')) {
            return reply.response('data format error').code(500)
        }
        return reply.response('successful').code(200)
    }
}, {
    path: '/get_massage',
    method: 'GET',
    handler: (request, reply) => {
        return reply.response('successful').code(200)
    }
}, {
    //每次用户进入的时候要进行自检，检查用户的id是否插入到user表中，如果没有不能发送任何信息
    path: '/login',
    method: 'POST',
    handler: (request, reply) => {
        return reply.response('successful').code(200)
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