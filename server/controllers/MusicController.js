import torrentStream from 'torrent-stream';
import RutrackerAPI from 'rutracker-api-2';
import pRequest from 'request-promise';
import cheerio from 'cheerio';
import JSZip from 'jszip';

import BasicController from '../libs/BasicController';
import { SoundCloudAPI } from '../libs/SoundCloudAPI';
import { ResultToKinds, getTrackerMP3List } from "../libs/Helpers";
import { USERROLES } from "../enums/Enums";
import LOCALES from '../libs/Localization';

const rutracker = new RutrackerAPI();



class MusicController extends BasicController {
    constructor(fastify) {
        super();

        this.fastify = fastify;
        this.allowedMethods = {
            "MusicController.Search": {
                min: 0,
                // allowed: [USERROLES.ADMIN]
            },
            "MusicController.TrackInfo": false,
            "MusicController.TrackerFiles": true,
            "MusicController.TrackerStream": true,
            "MusicController.TrackerBatchDownload": true,
        };
        fastify.post(`${this.apiPrefix}/trackinfo`, this.TrackInfo);
        fastify.post(`${this.apiPrefix}/search`, this.Search);
        fastify.post(`${this.apiPrefix}/trackerFiles`, this.TrackerFiles);
        fastify.post(`${this.apiPrefix}/trackerBatchDownload`, this.TrackerBatchDownload);
        fastify.get(`${this.apiPrefix}/trackerStream`, this.TrackerStream);

        rutracker
            .login(process.env.RUTRACKER_LOGIN, process.env.RUTRACKER_PASSWORD)
            .then(cookie => this.trackerCookie = cookie);
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

        if (!data.type) data.type = "soundcloud";

        const result = await this.runCachingWrapper(`${data.q}_${data.type}`, data.socketToken, async () => {
            let result;
            console.log(data.type);
            switch (data.type) {
                case "soundcloud":
                    result = await SoundCloudAPI.searchAudio(data.q);
                    result = ResultToKinds(JSON.parse(result).collection);
                    break;
                case "tracker":
                    result = await rutracker.search(data.q, 'size', false);

                    result = {
                        playlist: result
                            .filter(x => x.title.toLowerCase().indexOf('mp3') > -1)
                            .map(x => ({
                                permalink_url: x.url,
                                title: x.title || "NO_TITLE",
                                id: x.id,
                                type: 'tracker',
                            })),
                        user: [],
                        track: []
                    };

                    console.log('rutrackerResult', result);
                    break;
            }

            return result;
        });
        return { result };
    }

    async TrackerBatchDownload(request, response) {
        const { fileList, magnet } = request.body;
        const engine = torrentStream(magnet);
        const tracks = await new Promise((resolve) => {
            engine.on('ready', () => {
                resolve(fileList.map(x => ({
                    name: x.name,
                    track: engine.files.find(y =>
                        y.path === x.path.split(' || ').join('\\')
                        ||y.path === x.path.split(' || ').join('/'))
                })));
            });
            engine.on('error', (err) => console.log(err));
        });
        if (!tracks) {
            console.log('Tracks not found');
            throw LOCALES.MISSED_DATA;
        }

        const zip = new JSZip();
        tracks.forEach(x => {
            const stream = x.track.createReadStream();
            zip.file(x.name, stream);
        });

        response.send(zip
            .generateNodeStream()
            .on('end', () => engine.destroy()));
    }

    async TrackerStream(request, response) {
        const { filePath, magnet } = request.query;
        const filePathTorr = filePath.split(' || ').join('\\');
        const filePathTorrLinux = filePath.split(' || ').join('/');
        console.log(filePathTorr);
        const engine = torrentStream(magnet);
        const track = await new Promise((resolve) => {
            engine.on('ready', () => {
                resolve(engine.files.find(x => {
                    return x.path === filePathTorr
                        || x.path === filePathTorrLinux;
                }));
            });
            engine.on('error', (err) => console.log(err));
        });
        if (!track) {
            console.log('Track not found');
            throw LOCALES.MISSED_DATA;
        }

        const total = track.length;
        const range = request.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const partialstart = parts[0];
            const partialend = parts[1];

            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total - 1;
            const chunksize = (end - start) + 1;

            response
                .code(206)
                .header('Content-Range', 'bytes ' + start + '-' + end + '/' + total)
                .header('Accept-Ranges', 'bytes')
                .header('Content-Length', chunksize)
                .header('Content-Type', 'audio/mpeg')
                .send(track
                    .createReadStream({ start, end })
                    .on('end', () => {
                        console.log('Downloaded');
                        engine.destroy();
                    }));
        } else {
            response
                .header('Content-Type', 'audio/mpeg')
                .send(track.createReadStream());
        }
    }

    async TrackerFiles(request) {
        const data = request.body;
        if (!data.id) throw LOCALES.MISSED_DATA;

        console.log(this.trackerCookie);

        const magnetHTML = await pRequest(`https://rutracker.org/forum/viewtopic.php?t=${data.id}`, {
            headers: {
                cookie: this.trackerCookie,
            },
        });
        const $m = cheerio.load(magnetHTML);

        const html = await pRequest('https://rutracker.org/forum/viewtorrent.php', {
            method: "POST",
            headers: {
                cookie: this.trackerCookie,
            },
            form: {
                t: data.id
            }
        });
        const $ = cheerio.load(html);
        const result = getTrackerMP3List($, $('.ftree'), $m('.magnet-link').attr('href'));
        return { result };
    }
}
module.exports = MusicController;