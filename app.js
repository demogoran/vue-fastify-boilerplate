import url from 'url';
import Fastify from 'fastify';
import { staticServe } from 'fastify-auto-push';

import fastifyJWT from 'fastify-jwt';
import dotenv from 'dotenv';
dotenv.config({ path: '.env-serv' });

import path from 'path';
import fs from 'fs';

import { ControllersLoader } from './server/libs/ControllersLoader';


const fastify = Fastify({
    http2: true,
    https: {
        allowHTTP1: true,
        key: fs.readFileSync('https/privkey.pem'),
        cert: fs.readFileSync('https/cert.pem'),
        ca: fs.readFileSync('https/chain.pem')
    }
});

fastify.register(require('fastify-ws'));
fastify.register(require('fastify-compress'), { global: false })
fastify.register(staticServe, {
    root: path.join(__dirname, 'client'),
    prefix: '/client/',
});
fastify.register(fastifyJWT, {
    sign: {
        expiresIn: "12h",
    },
    verify: {
        maxAge: "12h",
    },
    secret: process.env.SECRET
});
fastify.register(ControllersLoader);

fastify.decorate('socketList', {});


// history support
fastify.get('*', (request, reply) => {
    reply.sendFile('index.html');
});

fastify.listen(process.env.PORT || 3001, '0.0.0.0', (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`)
});

fastify.ready(err => {
    if (err) throw err

    console.log('Server started.')

    fastify.ws
        .on('connection', (socket, ws) => {
            console.log('Client connected.', ws.url);

            const { query: { token } } = url.parse(ws.url, true);
            if(!token){
                return;
            }
            console.log(token, fastify.socketList);
            fastify.socketList[token] = socket;
            socket.on('close', () => delete fastify.socketList[token]);
        })
})

/*
set GIT_SSH=
git push deploy dev

https://medium.com/@francoisromain/vps-deploy-with-git-fea605f1303b
git remote set-url deploy ssh://user@109.74.199.163/srv/git/vue-fastify-boilerplate.git/

usermod -s /bin/bash gitdeploy
adduser gitdeploy
mkdir -p /srv/tmp/
chgrp -R gitdeploy /srv/tmp/
chmod g+w /srv/tmp/
mkdir -p /srv/www/
chgrp -R gitdeploy /srv/www/
chmod g+w /srv/www/
*/