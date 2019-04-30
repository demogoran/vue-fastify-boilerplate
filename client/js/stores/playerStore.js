export default {
    state: {
        currentTrack: '',
    },
    getters: {},
    mutations: {
        setCurrentTrack(state, url) {
            console.log('url mutation', url);
            state.currentTrack = url;
        }
    },
    actions: {
        callCurrentTrack(context, url) {
            console.log('url action', url);
            context.commit('setCurrentTrack', url);
        }
    }
};