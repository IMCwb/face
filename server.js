const hapi = require('hapi');
const db = require('./db')

const server = hapi.server({
    port: 3000,
    host: 'localhost'
})

let new_lost = async (request, h) => {
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
    }).catch(err => console.error("Create Lost Err", err))
    return h.response(res).code(200)
}
let get_lost = async (request, h) => {
    const data = request.payload
    let searchRow = {
        provider: data['provider_id'],
        lost_info: {}, contact: {}
    }
    ['name', 'gender', 'birthday', 'last_location', 'since', 'description'].forEach((ele) => {
        if (data[ele] != null) {
            searchRow.lost_info[ele] = data[ele]
        }
    })
    ['contact', 'contact_name'].forEach((ele) => {
        if (data[ele] != null) {
            searchRow.contact[ele] = data[ele]
        }
    })
    const res = await db.Losts.findAll({
        where: searchRow
    }).catch(err => console.error("Search Lost Err", err))
    return h.response(res).code(200)
}
let new_clue = async (request, h) => {
    const data = request.payload
    const res = await db.Clues.create({
        provider: data['provider_id'],
        clue_info: {
            gender: data['gender'],
            location: data['location'],
            date: data['date'],
            description: data['description']
        },
        contact: {
            contact: data['contact'],
            contact_name: data['contact_name']
        }
    }).catch(err => console.error("Create Clue Err", err))
    return h.response(res).code(200)
}
let get_clue = async (request, h) => {
    const data = request.payload
    let searchRow = {
        provider: data['provider_id'],
        clue_info: {}, contact: {}
    }
    ['gender', 'location', 'date', 'description'].forEach((ele) => {
        if (data[ele] != null) {
            searchRow.lost_info[ele] = data[ele]
        }
    })
    ['contact', 'contact_name'].forEach((ele) => {
        if (data[ele] != null) {
            searchRow.contact[ele] = data[ele]
        }
    })
    const res = await db.Losts.findAll({
        where: searchRow
    }).catch(err => console.error("Search Lost Err", err))
    return h.response(res).code(200)
}
let new_image = async (request, h) => {
    const data = request.payload
    if (data['which'] == 'clue') {
        db.sequlize.transaction((t) => {
            return db.Clues.find({
                where: { lost_id: data['info_id'] }
            }, { transaction: t })
                .then((clue) => {
                    console.log(clue)
                    let photos = clue.dataValues['clue_photos']
                    return clue.update({
                        clue_photos: photos.concat(data['image'])
                    }, { transaction: t })
                })
        })
    } else if (data['which'] == 'lost') {
        db.sequlize.transaction((t) => {
            return db.Losts.find({
                where: { lost_id: data['info_id'] }
            }, { transaction: t })
                .then((lost) => {
                    console.log(lost)
                    let photos = lost.dataValues['lost_photos']
                    return lost.update({
                        lost_photos: photos.concat(data['image'])
                    }, { transaction: t })
                })
        })
    }
}
server.route([{
    path: '/upload_lost',
    method: 'POST',
    handler: new_lost
}, {
    path: '/upload_clue',
    method: 'POST',
    handler: new_clue
}, {
    path: '/upload_image',
    method: 'POST',
    handler: new_image
}, {
    path: '/get_lost',
    method: 'POST',
    handler: get_lost
}, {
    path: '/get_clue',
    method: 'POST',
    handler: get_clue
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
    handler: async (request, h) => {
        const data = request.payload
        const res = await db.Users.create({
            user_id: data['user_id']
        })
        return h.response(res).code(200)
    }
}
]);

db.init()
server.start()

console.log('server is running on port 3000.')

