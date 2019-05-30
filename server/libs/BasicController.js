import fs from 'fs';
import LOCALES from './Localization';
import { User } from '../libs/ModelsLoader';

class BasicController {
    constructor() {
        const ERROR = { error: true };
        const SUCCESS = { error: false };

        const sendErrorBack = (response, errorMessage = '', options = {}) => {
            response.code(500);
            return {
                error: true,
                errorMessage,
                ...options,
            }
        }

        const currentProxy = new Proxy(this, {
            get: (obj, prop) => {
                if (typeof obj[prop] !== 'function')
                    return obj[prop];

                return async (request, response, next) => {
                    if (!request || !response) {
                        return sendErrorBack(response);
                    }
                    try {
                        const token = request.headers ?.authorization ?.replace("Bearer ", "");
                        if (token) {
                            const decodedToken = this.fastify.jwt.decode(token);
                            const user = await User.findOne({ _id: decodedToken.id }, 'login role _id');
                            console.log(user, this.allowedMethods[`${obj.constructor.name}.${prop}`]);
                            if (!user) {
                                return sendErrorBack(response, LOCALES.UNAUTHORIZED, {
                                    resetJWTToken: true,
                                });
                            }

                            if (Object.keys(this.allowedMethods[`${obj.constructor.name}.${prop}`] || false).length) {
                                const methodLimits = this.allowedMethods[`${obj.constructor.name}.${prop}`];
                                if (methodLimits ?.disallowed) {
                                    if (methodLimits ?.disallowed.indexOf(user.role) > -1) {
                                        console.log('Disallowed limits');
                                        return sendErrorBack(response);
                                    }
                                }
                                else if (methodLimits ?.allowed) {
                                    if (methodLimits ?.allowed.indexOf(user.role) === -1) {
                                        console.log('Allowed limits');
                                        return sendErrorBack(response);
                                    }
                                }
                                else {
                                    console.log(user.role, methodLimits ?.min, methodLimits ?.max);
                                    if (methodLimits ?.min && user.role < methodLimits ?.min) {
                                        console.log('Min limits');
                                        return sendErrorBack(response);
                                    }
                                    if (methodLimits ?.max && user.role > methodLimits ?.max) {
                                        console.log('Max limits');
                                        return sendErrorBack(response);
                                    }
                                }
                            }
                        }

                        console.log(this.allowedMethods, `${obj.constructor.name}.${prop}`, this.allowedMethods[`${obj.constructor.name}.${prop}`]);
                        if (!this.allowedMethods[`${obj.constructor.name}.${prop}`])
                            await request.jwtVerify();
                    } catch (err) {
                        console.log('Verification error', err);
                        return sendErrorBack(response, LOCALES.UNAUTHORIZED, {
                            resetJWTToken: true,
                        });
                    }
                    try {
                        const result = await obj[prop].apply(obj, [request, response, next]);
                        return {
                            error: false,
                            ...result
                        }
                    }
                    catch (ex) {
                        const errorMessage = typeof ex === "string" ? ex : ex.message;
                        const errorResponse = {
                            error: true
                        };
                        if (process.env.DEBUG_ENABLED) {
                            console.log("Method error: ", ex);
                            errorResponse.errorMessage = errorMessage;
                        }
                        response.code(500);
                        return errorResponse;
                    }
                }
            }
        });
        currentProxy.allowedMethods = [];
        currentProxy.classPrefix = this.constructor.name.toLowerCase().replace('controller', '');
        currentProxy.apiPrefix = `/api/${currentProxy.classPrefix}`;
        currentProxy.ERROR = ERROR;
        currentProxy.SUCCESS = SUCCESS;


        const _cached = {};
        currentProxy.cacheObj = new Proxy(_cached, {
            get(obj, prop) {
                let result = obj[prop];
                try {
                    if (!result) {
                        result = JSON.parse(fs.readFileSync(`cache/${prop}.json`, 'utf8'));
                    }
                }
                catch (ex) {
                    result = {};
                }
                return result;
            },
            set(obj, prop, value) {
                obj[prop] = value;
                fs.writeFileSync(`cache/${prop}.json`, JSON.stringify(value));
                return true;
            }
        });
        return currentProxy;
    }

    async runCachingWrapper(key, socketToken, funcToExecute) {
        const currentCache = this.cacheObj[this.classPrefix];
        if (currentCache[key]) {
            setTimeout(async () => {
                const result = await funcToExecute();
                const socket = this.fastify.socketList[socketToken];
                if (!socket) return;
                socket.send(JSON.stringify({
                    type: key,
                    data: result
                }));
            }, 0);
            this.cacheObj[this.classPrefix] = currentCache;
            return currentCache[key];
        }
        currentCache[key] = await funcToExecute();
        this.cacheObj[this.classPrefix] = currentCache;
        return currentCache[key];
    }
}
module.exports = BasicController;