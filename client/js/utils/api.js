export const fetchJSON = async (url, method = "GET", body, o = {}) => {
    const data = Object.assign({}, o);
    const jwt = localStorage.getItem('jwtToken');
    if (!data.headers) {
        data.headers = {};
    }

    data['method'] = method;
    data.headers['Content-Type'] = 'application/json';
    if (body) {
        data['body'] = body;
    }
    if (jwt) {
        data.headers['Authorization'] = `Bearer ${jwt}`;
    }
    if (typeof data.body !== "string") {
        data.body = JSON.stringify(data.body);
    }


    return await fetch(url, data)
        .then(x => !data.binary
            ? x.json()
            : x.blob())
        .then(x => {
            if (x.setJWTToken) {
                localStorage.setItem('jwtToken', x.setJWTToken);
            }
            if (x.resetJWTToken) {
                localStorage.removeItem('jwtToken');
                window.location.reload();
            }
            return x;
        });
}

export const API = {
    userLogin: async (data) => fetchJSON("/api/user/login", "post", data),
    userCreate: async (data) => fetchJSON("/api/user/create", "post", data),

    musicGetInfo: async (data) => fetchJSON("/api/music/trackinfo", "post", data),
    musicSearch: async (data) => fetchJSON("/api/music/search", "post", data),
    musicTrackerTracks: async (data) => fetchJSON("/api/music/trackerFiles", "post", data),
    musicTrackerDownload: async (data) => fetchJSON("/api/music/trackerBatchDownload", "post", data, { binary: true }),

    serialsSearch: async (data) => fetchJSON("/api/serials/search", "post", data),
    serialsGetSeasons: async (data) => fetchJSON(`/api/serials/seasons${data.url}`, "get"),
    serialsGetSeries: async (data) => fetchJSON(`/api/serials/series/${data.id}${data.url}`, "get"),
}