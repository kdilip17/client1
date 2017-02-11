/**
 * Created by dilip on 7/2/17.
 */
"use strict";

const Hapi = require('hapi');

const server = new Hapi.Server();
// server.connection({ labels: 'public' });
// server.connection({ labels: 'private' });
server.connection({
    port: 3000,
    host: 'localhost',
    plugins: {
        attache: {
            id: 'myservice'
        }
    }
});


server.register({
    register: require('attache'),
    options: {
        service: {
            name: 'myservice',
            check:{
                interval:"5s"
            }
        },
        consul : {
            host : "192.168.1.29",
            port : "8500",
            secure: true
        }
    }
}, (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

            return reply('Hello World!');
        }
    });
/*
    server.select('private').route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

            return reply('Secret Hello!');
        }
    });*/

    server.route({
        method: 'GET',
        path: '/_health',
        handler: (request, reply) => {

            return reply('OK');
        }
    });



    /*setInterval(() => {

        server.consul.checkin(true);
    }*/
    /*server.consul.checkin(true,function (err,res) {
        console.log(err,res)
    });*/

    server.start((err) => {

        for (let i = 0; i < server.connections.length; ++i) {
            const connection = server.connections[i];
            console.log('Server ' + connection.settings.labels + ' started at', connection.info.uri);
        }
    });
});