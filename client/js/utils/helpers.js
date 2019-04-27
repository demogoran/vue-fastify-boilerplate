import {Console} from './console';

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
            }
            return x;
        });
}

export const handleSave = fieldsToLoad => {
    const watch = {};
    fieldsToLoad.forEach(key => {
        watch[key] = (newObj, oldObj) => {
            Console.log(`${key} changed`, oldObj, newObj);
            localStorage.setItem(key, JSON.stringify(newObj));
        };
    });
    Console.log(watch);
    return {
        watch,
        mounted() {
            Console.log("App mounted for localStorage!");
            fieldsToLoad.forEach(key => {
                try {
                    const storageField = localStorage.getItem(key);
                    if (storageField) this[key] = JSON.parse(storageField);
                } catch (ex) {
                    Console.log("Extracting error", ex);
                }
            });
        }
    };
};
