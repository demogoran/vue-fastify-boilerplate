import BasicController from '../libs/BasicController';
import { SeasonvarAPI } from '../libs/SeasonvarAPI';
import LOCALES from '../libs/Localization';

class SerialsController extends BasicController {
    constructor(fastify) {
        super();

        this.fastify = fastify;
        fastify.post(`${this.apiPrefix}/search`, this.Search);
        fastify.get(`${this.apiPrefix}/seasons/:url`, this.GetSeasons);
        fastify.get(`${this.apiPrefix}/series/:id/:url`, this.GetSeries);
    }

    async Search(request) {
        const data = request.body;
        if (!data.q) throw LOCALES.MISSED_DATA;
        const result = await SeasonvarAPI.fuseSearch(data.q);
        return { result };
    }

    async GetSeasons(request) {
        const data = request.params;
        if (!data.url) throw LOCALES.MISSED_DATA;
        const result = await SeasonvarAPI.getSerialSeasons(data.url);
        return { result };
    }

    async GetSeries(request) {
        const data = request.params;
        if (!data.url || !data.id) throw LOCALES.MISSED_DATA;
        const result = await SeasonvarAPI.getSerialSeries(data.url, data.id);
        return { result };
    }
}
module.exports = SerialsController;