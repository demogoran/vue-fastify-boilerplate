export const ResultToKinds = (result) => {
    let kinds = {
        playlist: [],
        user: [],
        track: []
    }

    result.forEach(x => {
        if (x.playlist)
            x = x.playlist;
        if (x.track)
            x = x.track;

        if (x.type && !x.kind)
            x.kind = x.type;

        let item = {
            permalink_url: x.permalink_url,
            artwork_url: x.artwork_url ||
                (x.tracks ?
                    (x.tracks[0] || {}) :
                    {})
                    .artwork_url,
            title: x.title || "NO_TITLE",
            id: x.id
        };
        if (x.user) {
            item.user = {
                id: x.user.id,
                username: x.user.username || "NO_NAME"
            }
        }
        if (x.tracks) {
            item.tracks = x.tracks.map(trackInfo => ({
                permalink_url: trackInfo.permalink_url,
                artwork_url: trackInfo.artwork_url ||
                    (trackInfo.tracks ?
                        (trackInfo.tracks[0] || {}) :
                        {})
                        .artwork_url,
                title: trackInfo.title || "NO_TITLE",
                id: trackInfo.id
            }));
        }

        if (x.kind === "user") {
            item.artwork_url = x.avatar_url;
            item.title = x.username;
        }
        if (!kinds[x.kind])
            return;

        kinds[x.kind].push(item);
    });

    return kinds;
}

export const getTrackerMP3List = ($, $elem, magnet) => {
    const result = Array.from($elem.find('b:contains(.mp3)')).map((x,i)=>{
        const title = $(x).text();
        let $dir = $(x).parents('.dir');
        const pathParts = Array.from($dir).map(x=>$(x).find('>div b').text().replace('./', '')).reverse();
        pathParts.push(title);

        const resultPath = pathParts.join(' || ');
        return {
            id: `${Date.now()}${i}`,
            permalink_url: `/api/music/trackerStream?filePath=${resultPath}&magnet=${encodeURIComponent(magnet)}`,
            shortname: title,
            title: resultPath,
            isTracker: true,
            magnet,
        };
    });

    return result;
}