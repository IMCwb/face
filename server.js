//hapiJS
const Hapi = require('hapi');

//调用算法的模块
const Algo = require('./algorithm')

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
})


server.route([
    //测试接口
    {
        method: 'GET',
        path: '/test/{name}',
        handler: (request, h) => {
            return request.params['name'];
        }
    }, {
        method: 'POST',
        path: '/upload_lost',
        handler: function (request, reply) {
            // var image = request.payload['image']
            console.log(request.payload['lostName'])
            // var base64_img = request.payload['image'].toString('base64')
            // console.log(request.payload['image'])
            // console.log(base64_img)        
            Algo.send_pic(request.payload['image'], 'demo_name')
            // Algo.send_pic( base64_img, 'demo_name')

            // console.log(request.payload['image'])
            // reply('successful');
            return 'successful'
        }
    }]);

server.start();

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