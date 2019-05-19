import BasicController from '../libs/BasicController';
import { SoundCloudAPI } from '../libs/SoundCloudAPI';
import { ResultToKinds } from "../libs/Helpers";
import LOCALES from '../libs/Localization';

class MusicController extends BasicController {
    constructor(fastify) {
        super();

        this.fastify = fastify;
        this.allowedMethods = {
            "MusicController.TrackInfo": false,
        };
        fastify.post(`${this.apiPrefix}/trackinfo`, this.TrackInfo);
        fastify.post(`${this.apiPrefix}/search`, this.Search);
    }

    async TrackInfo(request) {
        const data = request.body;
        if (!data.ids) throw LOCALES.MISSED_DATA;
        const result = await SoundCloudAPI.getTracksCompact(data.ids);
        return { result };
    }

    async Search(request) {
        const data = request.body;
        if (!data.q) throw LOCALES.MISSED_DATA;

        const result = await this.runCachingWrapper(data.q, data.socketToken, async () => {
            const result = await SoundCloudAPI.searchAudio(data.q);
            const composedData = ResultToKinds(JSON.parse(result).collection);
            return composedData;
        });
        return { result };
    }
}
module.exports = MusicController;