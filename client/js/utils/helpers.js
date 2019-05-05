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

export const handleSave = (fieldsToLoad, prefix='') => {
    const watch = {};
    fieldsToLoad.forEach(key => {
        watch[key] = (newObj) =>
            localStorage.setItem(`${prefix}_${key}`, JSON.stringify(newObj));
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

export const extendGlobalState = ({
    data(){
        const $store = this.$store;
        const globalWatch = {}
        this.globalWatch = globalWatch;
        this.globalState = new Proxy(this.$store.state, {
            get: (obj, prop) => {
                if(typeof obj[prop]==="undefined"){
                    console.log("Wrong property", prop);
                    return null;
                }
                return obj[prop];
            },
            set: (obj, prop, value) => {
                console.log(obj, obj[prop], prop, value);
                let skipWatching = false;
                if(value.skipWatching){
                    value = value.v;
                    skipWatching = true;
                }


                if(typeof obj[prop]==="undefined"){
                    return false;
                }
                $store.dispatch(`action_${prop}`, value);
                if(globalWatch[prop]&&!skipWatching) globalWatch[prop](value);
                return true;
            }
        });

        this.$store.subscribe((mutation, state) => {
            console.log(mutation, state);
            /* switch(mutation.type) {
              case 'updateStatus':
                const status = state.status;

                console.log(`Updating to ${status}`);

                // Do whatever makes sense now
                if (status === 'success') {
                  this.complex = {
                    deep: 'some deep object',
                  };
                }
                break;
            } */
        });
    },
});