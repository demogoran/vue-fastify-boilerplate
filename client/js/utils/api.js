export const fetchJSON = async (url, method = "GET", body, o = {}) => {
    const options = Object.assign({}, o);
    const jwt = localStorage.getItem('jwtToken');
    if (!options.headers) {
        options.headers = {};
    }

    options['method'] = method;
    options.headers['Content-Type'] = 'application/json';
    if (body) {
        options['body'] = body;
    }
    if (jwt) {
        options.headers['Authorization'] = `Bearer ${jwt}`;
    }
    if (typeof options.body !== "string") {
        options.body = JSON.stringify(options.body);
    }


    return await fetch(url, options)
        .then(x => x.json())
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
    musicGetInfo: async (arg) => fetchJSON("/api/music/trackinfo", "post", arg),
    musicSearch: async (arg) => fetchJSON("/api/music/search", "post", arg),

    userLogin: async (arg) => fetchJSON("/api/user/login", "post", arg),
    userCreate: async (arg) => fetchJSON("/api/user/create", "post", arg),
}