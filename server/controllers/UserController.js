import bcrypt from 'bcrypt';

import BasicController from '../libs/BasicController';
import { User } from '../libs/ModelsLoader';
import { USERROLES } from '../enums/Enums';
import LOCALES from '../libs/Localization';


class UserController extends BasicController {
    constructor(fastify) {
        super();
        this.allowedMethods = {
            "UserController.Login": true,
            "UserController.Create": true
        };
        this.fastify = fastify;

        fastify.post(`${this.apiPrefix}/login`, this.Login);
        fastify.post(`${this.apiPrefix}/create`, this.Create);
    }

    async Login(request) {
        const data = request.body;
        if (!data.login || !data.password) {
            throw LOCALES.USER_MISSED_DATA;
        }

        const currentUser = await User.findOne({
            login: data.login
        });
        if (!currentUser) {
            throw LOCALES.USER_NOT_EXISTS;
        }

        const isValid = await bcrypt.compare(data.password, currentUser.hash);
        if (!isValid) throw LOCALES.USER_INVALID_PASSWORD;
        return {
            setJWTToken: this.fastify.jwt.sign({
                id: currentUser._id
            })
        };
    }

    async Create(request) {
        const data = request.body;
        if (!data.login || !data.password) throw LOCALES.USER_MISSED_DATA;
        const existingUser = await User.findOne({
            login: data.login
        });
        if (existingUser) throw LOCALES.USER_ALREADY_EXISTS;

        const hash = await bcrypt.hash(data.password, 10);
        await User.create({
            login: data.login,
            role: USERROLES.DEFAULT,
            hash
        });
        return {};
    }
}
module.exports = UserController;