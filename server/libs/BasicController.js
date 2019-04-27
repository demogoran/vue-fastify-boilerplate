import LOCALES from './Localization';
import {Console} from './Console';

class BasicController {
    constructor() {
        const ERROR = { error: true };
        const SUCCESS = { error: false};
        const currentProxy = new Proxy(this, {
            get: (obj, prop) => {
                if (typeof obj[prop] !== 'function')
                    return obj[prop];

                return async (request, response, next) => {
                    if (!request || !response) {
                        return {
                            error: true
                        }
                    }
                    try {
                        if (!this.allowedPathes[`${obj.constructor.name}.${prop}`])
                            await request.jwtVerify();
                    } catch (err) {
                        response.code(500);
                        return {
                            error: true,
                            resetJWTToken: true,
                            errorMessage: LOCALES.UNAUTHORIZED
                        };
                    }
                    try{
                        const result = await obj[prop].apply(obj, [request, response, next]);
                        return {
                            error: false,
                            ...result
                        }
                    }
                    catch(ex){
                        const errorMessage = typeof ex==="string"?ex:ex.message;
                        const errorResponse = {
                            error: true
                        };
                        if(process.env.DEBUG_ENABLED){
                            Console.log("Method error: ", ex);
                            errorResponse.errorMessage = errorMessage; 
                        }
                        response.code(500);
                        return errorResponse;
                    }
                }
            }
        });
        currentProxy.apiPrefix = `/api/${this.constructor.name.toLowerCase().replace('controller', '')}`;
        currentProxy.ERROR = ERROR;
        currentProxy.SUCCESS = SUCCESS;
        return currentProxy;
    }
}
module.exports = BasicController;