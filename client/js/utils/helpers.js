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

export const handleSave = (fieldsToLoad, prefix = '') => {
    const watch = {};
    fieldsToLoad.forEach(key => {
        watch[key] = (newObj) => {
            console.log(key, newObj);
            return localStorage.setItem(`${prefix}_${key}`, JSON.stringify(newObj));
        }
    });
    return {
        watch,
        mounted() {
            fieldsToLoad.forEach(key => {
                try {
                    const storageField = localStorage.getItem(`${prefix}_${key}`);
                    if (storageField) this[key] = JSON.parse(storageField);
                } catch (ex) {
                    console.log("Extracting error", ex);
                }
            });
        }
    };
};


const globalWatch = {};
const globalState = new Proxy({
    currentIndex: 0,
    audioInfo: {},
}, {
    get: (obj, prop) => {
        if (typeof obj[prop] === "undefined") {
            console.log("Wrong property", prop);
            return null;
        }
        return obj[prop];
    },
    set: (obj, prop, value) => {
        obj[prop] = value;
        return true;
    }
});

export const extendGlobalState = (namespace) => ({
    data() {
        this.globalStateWatch = {};
        globalWatch[namespace] = this.globalStateWatch;

        this.globalState = new Proxy(globalState, {
            get: (obj, prop) => obj[prop],
            set: (obj, prop, value) => {
                Object.keys(globalWatch).filter(x => x !== namespace).forEach(key => {
                    if (globalWatch[key][prop])
                        globalWatch[key][prop](value);
                });
                obj[prop] = value;
                return true;
            }
        });
    },
});