import fs from 'fs';
import path from 'path';
import { createRenderer } from 'vue-server-renderer';

import BasicController from '../libs/BasicController';

//const renderer = createBundleRenderer(path.join(__dirname, '../../client/dist/main.js'), { /* options */ })



class VueController extends BasicController {
    constructor(fastify) {
        super();
        this.fastify = fastify;

        [
            {path: 'main', filename: 'MainPage', allowedMethod: true},
            {path: 'serials', filename: 'SerialsPage', allowedMethod: true},
            {path: 'test', filename: 'TestPage', allowedMethod: true},
        ].forEach(x=>{
            this.allowedMethods[`VueController.${x.filename}`] = x.allowedMethod;
            this[x.filename] = async (request, response)=>{
                /* const stream = fs.createReadStream(`client/templates/pages/${x.filename}.vue`);
                response.type('text/html').send(stream); */
                return {
                    result: createRenderer(require(`client/templates/pages/${x.filename}.vue`)).renderToString(),
                }
            };
            fastify.get(`${this.apiPrefix}/${x.path}.vue`, this[x.filename]);
        })
    }
}
module.exports = VueController;