const globalWatch = {};
const componentsList = {};
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

export const MixinInjector = {
    extendGlobalState: (namespace) => ({
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
    }),
    getLoadedCompontents: (namespace) => ({
        data() {
            componentsList[namespace] = this;
            this.componentsList = componentsList;
        },
    }),
    handleSave: (fieldsToLoad, prefix = '') => {
        const watch = {};
        fieldsToLoad.forEach(key => {
            watch[key] = (newObj) => {
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
    },
    addAlert: () => {
        return {
            methods: {
                showToastMessage(message, isSuccess) {
                    if (!message) return;
                    this.$toast.open({
                        duration: 5000,
                        message: message,
                        position: "is-bottom",
                        type: !isSuccess ? "is-danger" : "is-success"
                    });
                },
            },
        }
    },
    addWebSocket: () => {
        console.log('socket added');
        return {
            mounted(){
                const token = (Date.now()).toString(36).substr(2)+Math.random().toString(36).substr(2);
                const host = location.origin.replace(/^http/, 'ws')
                const ws = new WebSocket(`${host}/?token=${token}`);
                this.socket = ws;
                this.socketToken = token;
            },
            async beforeRouteLeave(to, from, next) {
                console.log(this.socke);
                if(this.socket){
                    this.socket.close();
                    delete this.socket;
                }
                next();
            },
        };
    }
}
