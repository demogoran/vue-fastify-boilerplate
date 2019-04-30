export default {
    state: {
        currentTrack: '',
    },
    getters: {},
    mutations: {
        initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('playerStore')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('playerStore')))
				);
			}
		},
        setCurrentTrack(state, url) {
            state.currentTrack = url;
        }
    },
    actions: {
        callCurrentTrack(context, url) {
            context.commit('setCurrentTrack', url);
        }
    }
};