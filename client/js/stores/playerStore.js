const fields = ["currentIndex", "audioInfo"];
const states = {};
const mutations = {};
const actions = {};
fields.forEach(key => {
    states[key] = null;
    mutations[`mutation_${key}`] = (state, value) => state[key] = value;
    actions[`action_${key}`] = (context, value) => context.commit(`mutation_${key}`, value);
});


export default {
    state: states,
    getters: {},
    mutations: {
        initialiseStore(state) {
            if (localStorage.getItem('playerStore')) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('playerStore')))
                );
            }
        },
        ...mutations
    },
    actions
};