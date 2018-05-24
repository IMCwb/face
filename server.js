//hapiJS
const hapi = require('hapi');

//调用数据库模块
const db = require('./db')

//服务器
const server = hapi.server({
    port: 3000,
    host: 'localhost'
})

//do format check according to the type
function check(data, type = 'lost') {
    return true;
}

server.route([{
    path: '/upload_lost',
    method: 'POST',
    handler: async (request, h) => {
        var data = request.payload
        if (check(data, 'lost')) {
            let res = await db.new_lost(data, h)
            return h.response(res['insertId']).code(200)
        }
        else {
            return reply.response('data format error').code(500)
        }
    }
}, {
    path: '/upload_clue',
    method: 'POST',
    handler: async (request, reply) => {
        var data = request.payload
        if (check(data, 'clue')) {
            let res = await db.new_clue(data, reply)
            return h.response(res['insertId']).code(200)
        }
        else {
            return reply.response('data format error').code(500)
        }
    }
}, {
    path: '/upload_image',
    method: 'POST',
    handler: (request, reply) => {
        var data = request.payload
        if (check(data, 'clue')) {
            db.upload_image(data)
            return reply.response('successful').code(200)
        }
        return reply.response('data format error').code(500)
    }
}, {
    path: '/modify_lost',
    method: 'POST',
    handler: (request, h) => {
        lost_id = db.edit_lost(request.payload)
        if (check(data, 'lost')) {
            return h.response('successful').code(200)
        }
        return h.response('data format error').code(500)
    }
}, {
    path: '/get_lost',
    method: 'POST',
    handler: (request, reply) => {
        const data = request.payload
        return db.get_lost(data)
    }
}, {
    path: '/get_clue',
    method: 'POST',
    handler: (request, reply) => {
        const data = request.payload
        return db.get_clue(data)
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
    path: '/login',
    method: 'POST',
    handler: (request, reply) => {
        const data = request.payload
        db.new_user(data)
        return reply.response('successful').code(200)
    }
}
]);

db.init()
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