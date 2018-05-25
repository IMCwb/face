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

server.route([
    {
        path: '/upload_lost',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.new_lost(data)
            return h.response(res['insertId']).code(200)
        }
    }, {
        path: '/upload_clue',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.new_clue(data)
            return h.response(res['insertId']).code(200)
        }
    }, {
        path: '/upload_image',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.new_image(data)
            return h.response(res).code(200)
        }
    }, {
        path: '/get_lost',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.get_lost(data)
            return h.response(res).code(200)
        }
    }, {
        path: '/get_clue',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.get_clue(data)
            return h.response(res).code(200)
        }
    }, {
        path: '/get_image',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.get_image(data)
            res.forEach(element => {
                element['photo'] = element['photo'].toString()
            });
            return h.response(res).code(200)
        }
    }, {
        path: '/modify_lost',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.edit_lost(data)
            return h.response(res).code(200)
        }
    }, {
        path: '/modify_clue',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.edit_clue(data)
            return h.response(res).code(200)
        }
    }, {
        path: '/modify_image',
        method: 'POST',
        handler: async (request, h) => {
            const data = request.payload
            const res = await db.edit_image(data)
            return h.response(res).code(200)
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