import fs from 'fs';
import request from 'request-promise';
import cheerio from 'cheerio';

import Fuse from 'fuse.js';

export class SeasonvarAPI {
    static serialsList = [];
    static async fetchSerialList() {
        let r = await request({
            url: 'http://seasonvar.ru/index.php',
            method: 'POST',
            form: {
                'filter[sortTo][]': 'name',
                'filter[engName]': '',
                'filter[only]': '',
                'filter[rait]': 'kp',
                'filter[hd]': '',
                'filter[sub]': '',
                'filter[block]': 'yes',
                'filter[history]': '',
                'filter[mark]': '',
                'filter[nw]': '',
                'filter[exp]': '',
            },
            headers: {
                host: 'seasonvar.ru',
                origin: 'https://seasonvar.ru',
                referer: 'http://seasonvar.ru/',
                'x-requested-with': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
            }
        });
        let $ = cheerio.load(r);
        const result = $('a').map((i, x) => {
            return {
                id: $(x).attr('data-id'),
                url: $(x).attr('href'),
                name: $(x).text().trim().toLowerCase()
            }
        }).get();
        SeasonvarAPI.serialsList = result;

        fs.writeFileSync('allserials.json', JSON.stringify(result));
    }

    static async fuseSearch(str) {
        if (!SeasonvarAPI.serialsList ?.length) {
            console.log('Serials list not initialized');
            return [];
        }

        const options = {
            shouldSort: true,
            threshold: 0.7,
            location: 0,
            distance: 1000000,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name"
            ]
        };
        const fuse = new Fuse(SeasonvarAPI.serialsList, options); // "list" is the item array
        const result = fuse.search(str);

        return result;
    }

    static async getSerialSeasons(url) {
        const body = await request(`http://seasonvar.ru/${url}`);
        const $ = cheerio.load(body);
        const r = $('.pgs-seaslist .act a').map((i, x) => ({
            id: $(x).attr('href').split('-')[1],
            url: $(x).attr('href'),
            name: $(x).text()
        })).get();

        return r;
    }

    static async getSerialSeries(url, id) {
        const body = await request(`http://seasonvar.ru/${url}`);

        const $ = cheerio.load(body);
        const scr = $($('script').filter((i, x) => $(x).html().indexOf('data4play') > -1).get()[0]).html();


        var data4play;
        if (scr)
            eval(scr);

        const secure = (typeof data4play !== 'undefined') ? data4play.secureMark : '2c404863a8dda7545104a043aa0d49ce';
        console.log(secure);


        const listBody = await request(`http://seasonvar.ru/playls2/${secure}/trans/${id}/plist.txt?time=${Date.now()}`);
        const result = JSON.parse(listBody).map(x => {
            x.file = x.file.substr(2, x.file.length);
            let finalURL = new Buffer(x.file.replace('//b2xvbG8=', ''), 'base64').toString('utf8');

            if (finalURL.indexOf(' or ') > -1) {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                finalURL = finalURL.split(urlRegex).find(x => x.endsWith('.mp4'));
            }
            return {
                url: finalURL,
                name: x.title.replace(/<br>/g, ' ')
            }
        });
        return result;
    }
}

setInterval(() => SeasonvarAPI.fetchSerialList(), 30 * 1000);

(async () => {
    await SeasonvarAPI.fetchSerialList();
    //SeasonvarAPI.fuseSearch("друзья");
})();