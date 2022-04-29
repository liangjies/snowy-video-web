import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		videoTimeList: [],
	},
	mutations: {
		setVideoTimeList(state, videoTimeList) {
			state.videoTimeList = videoTimeList
		},
	},
	getters: {
		videoTimeList(state) {
			return state.videoTimeList
		},
	},
})
