import BasicController from '../libs/BasicController';
import { SoundCloudAPI } from '../libs/SoundCloudAPI';
import { ResultToKinds } from "../libs/Helpers";
import LOCALES from '../libs/Localization';


class MusicController extends BasicController {
    constructor(fastify) {
        super();

        this.allowedMethods = {
            "MusicController.TrackInfo": false,
        };
        fastify.post(`${this.apiPrefix}/trackinfo`, this.TrackInfo);
        fastify.post(`${this.apiPrefix}/search`, this.Search);
    }

    async TrackInfo(request) {
        const data = request.body;
        if (!data.ids) throw LOCALES.AUDIO_MISSED_DATA;
        const result = await SoundCloudAPI.getTracksCompact(data.ids);
        return { result };
    }

    async Search(request) {
        const data = request.body;
        if (!data.q) throw LOCALES.AUDIO_MISSED_DATA;

        const result = await SoundCloudAPI.searchAudio(data.q);
        return { result: ResultToKinds(JSON.parse(result).collection) };
    }
}
module.exports = MusicController;