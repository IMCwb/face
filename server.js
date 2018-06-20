const hapi = require('hapi');
const db = require('./db')

const server = hapi.server({
    port: 3000,
    host: 'localhost'
})

server.route([{
    path: '/upload_lost',
    method: 'POST',
    handler: async (request, h) => {
        const data = request.payload
        const res = await db.Losts.create({
            provider: data['provider_id'],
            lost_info: {
                name: data['name'],
                gender: data['gender'],
                birthday: data['birthday'],
                last_location: data['last_location'],
                since: data['since'],
                description: data['description']
            },
            contact: {
                contact: data['contact'],
                contact_name: data['contact_name']
            }
        })
        return h.response(res).code(200)
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
    handler: async (request, reply) => {
        const data = request.payload
        const res = await db.Users.create({
            user_id: data['user_id']
        })

        return reply.response(res).code(200)
    }
}
]);

db.init()
server.start()

console.log('server is running on port 3000.')

