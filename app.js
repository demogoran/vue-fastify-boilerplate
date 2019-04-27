import Fastify from 'fastify';
import { staticServe } from 'fastify-auto-push';

import fastifyJWT from 'fastify-jwt';
import dotenv from 'dotenv';
dotenv.config({path: '.env-serv'});

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
    secret: ';lkjunH(*&GY@UHU@J#HIKJBH(&&!FVG#OBNIOMI!@KJLH#LY!@*)H#)NOI@HL#H!@L#GB!OII@HG#G'
});
fastify.register(ControllersLoader);



fastify.listen(process.env.PORT || 3001, '0.0.0.0', (err, address) => {
    if (err) throw err;
    fastify.log.info(`server listening on ${address}`)
});


/*
set GIT_SSH=
git push deploy dev



https://medium.com/@francoisromain/vps-deploy-with-git-fea605f1303b
git remote set-url deploy ssh://root@109.74.199.163/srv/git/vue-fastify-boilerplate.git/

usermod -s /bin/bash gitdeploy
adduser gitdeploy
mkdir -p /srv/tmp/
chgrp -R gitdeploy /srv/tmp/
chmod g+w /srv/tmp/
mkdir -p /srv/www/
chgrp -R gitdeploy /srv/www/
chmod g+w /srv/www/
*/