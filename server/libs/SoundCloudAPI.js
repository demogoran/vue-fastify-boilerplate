import querystring from 'querystring';
import request from 'request-promise';
import cheerio from 'cheerio';

export class SoundCloudAPI {
    static async searchAudio(str, limit = 200) {
        let url = `https://api-v2.soundcloud.com/search?q=${encodeURIComponent(str)}&client_id=1gZT1mMPZn4vbs2p7aDdnTTEC8r3wNWa&limit=${limit}`;
        return await request(url);
    }
    static async getUserData(id) {
        let url = `https://api-v2.soundcloud.com/stream/users/${id}?client_id=HXLrwyY3IVYZkoGA4H7swdg738bxKUin&limit=20&offset=0&linked_partitioning=1&app_version=1543832230&app_locale=en`;
        return await request(url);
    }
    static async getTracksCompact(ids) {
        const json = await request(`https://api-v2.soundcloud.com/tracks?ids=${ids}&client_id=1gZT1mMPZn4vbs2p7aDdnTTEC8r3wNWa&app_version=1543583184&app_locale=en`);
        const data = JSON.parse(json);

        const promises = data.map(async x => {
            try {
                let itemURL = x.media ?.transcodings ?.find(y => y ?.format ?.protocol === 'progressive') ?.url;
                itemURL = `${itemURL}?client_id=1gZT1mMPZn4vbs2p7aDdnTTEC8r3wNWa&app_version=1543583184&app_locale=en`

                const newJson = await request(itemURL);
                return {
                    url: JSON.parse(newJson).url,
                    name: x.title
                };
            }
            catch (ex) {
                console.log(ex);
                return null;
            }
        });
        return await Promise.all(promises);
    }
    static async getTracks(ids) {
        const json = await request(`https://api-v2.soundcloud.com/tracks?ids=${ids}&client_id=1gZT1mMPZn4vbs2p7aDdnTTEC8r3wNWa&app_version=1543583184&app_locale=en`);
        const data = JSON.parse(json);
        const awaits = data.map(async x => {
            try {
                const newUrl = await request(x.url);
                return {
                    name: x.name,
                    url: JSON.parse(newUrl).url
                }
            }
            catch (ex) {
                return null;
            }
        });
        return await Promise.all(awaits);
    }
    static async getPlaylist(str) {
        //https://soundcloud.com/user-614716602
        let body = await request(str, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Host': 'soundcloud.com',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
            },
            gzip: true
        });
        let $ = cheerio.load(body);
        let $script = $('script').filter((i, x) => $(x).html().indexOf('webpackJsonp') > -1);

        let finalData = $script.html()
            .replace('webpackJsonp([],{0:function(e,t,n){function r(e){return i.every(function(t){return t in e.prototype})}function a(e){var t=r(e);return t?function(t){var n,r=o;t.lastFetchTime&&(r=t.lastFetchTime,delete t.lastFetchTime),n=new e(t,{parse:!0}),n.lastFetchTime=r,n.release()}:e}var c=', '')
            .replace(',o=Date.now(),i=["resource_type","get","set","addSubmodel","release"];c.forEach(function(e){try{var t=a(n(e.id));e.data.forEach(function(e){t(e)})}catch(r){}})}});', '');
        finalData = JSON.parse(finalData);
        finalData = finalData.map(x => x.data.map(x => x.tracks).filter(x => x)).filter(x => x && x.length);


        finalData = finalData[0][0];
        let upIDs = finalData.map(x => x.id);


        let query = querystring.stringify({
            ids: upIDs.join(','),
            client_id: 'R05HJlT1Pq49aYbJl7VfKJ587r2blpL1',
            app_version: '1539875955',
            app_locale: 'en'
        });
        let url = `https://api-v2.soundcloud.com/tracks?${query}`;
        let result = await request(url);
        result = JSON.parse(result);
        let urls = result.map(x => x.permalink_url);
        return urls;
    }
    static async searchAndDownload(str) {
        let result = await SoundCloudAPI.searchAudio(str);
        try {
            let promises = JSON.parse(result).collection.filter(x => x.kind === 'track').map(async x => {
                let data = await request(`https://api-v2.soundcloud.com/media/soundcloud:tracks:${x.id}/legacy-mp3/stream/hls?client_id=1gZT1mMPZn4vbs2p7aDdnTTEC8r3wNWa`);
                let json = JSON.parse(data);
                console.log(json);
                return {
                    url: json.url,
                    name: x.title
                }
            })
            let results = await Promise.all(promises);

            results.forEach(x => {
                let command = `ffmpeg -i "${x.url}" -c copy "downloads/${x.name.replace(/[^0-9a-z]/gi, ' ')}.mp3"`;

                const child = require('child_process').exec(command);
                child.stdout.pipe(process.stdout);
                child.on('exit', function () {
                    console.log('Done:', x.name);
                });
            });
        }
        catch (ex) {
            console.log("Got error:", ex);
            return [];
        }
    }
}