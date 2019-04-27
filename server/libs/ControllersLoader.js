import fs from 'fs';
export const ControllersLoader = async (fastify, options) => {
    const controllersList = {};
    fs.readdirSync('server/controllers').forEach(fileName => {
        const importedClass = require(`../controllers/${fileName}`);
        fastify.register(async (fastify, options) => {
            let obj = new importedClass(fastify, options);
            controllersList[fileName.replace('.js', '')] = obj;
        });
    });


    //{"UserController.Login": {body: {test: 123}}, "UserController.LoginTest": {body: {test2: 321}}}
    fastify.post('/api/aggregate', async (request, response) => {
        let callsSequence = request.body;
        let promises = Object.keys(callsSequence).map(async (itemPath) => {
            try {
                const item = callsSequence[itemPath];
                const parts = itemPath.split('.');
                const controllerName = parts[0], controllerMethod = parts[1];
                const calledController = controllersList[controllerName][controllerMethod];
                if (!calledController) {
                    return {
                        error: true
                    };
                }
                return await calledController({
                    ...request,
                    body: item.body || {}
                }, response);
            }
            catch (ex) {
                console.log(ex);
                return {
                    error: true
                }
            }
        });
        let result = await Promise.all(promises);
        console.log(result);
        return result;
    });
    return true;
}