import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		videoTimeList: [], //播放进度
		videoProgress: 0, // 缓存进度
	},
	mutations: {
		setVideoTimeList(state, videoTimeList) {
			state.videoTimeList = videoTimeList
		},
		setVideoProgress(state, videoProgress) {
			state.videoProgress = videoProgress
		},
	},
	getters: {
		videoTimeList(state) {
			return state.videoTimeList
		},
		videoProgress(state) {
			return state.videoProgress
		},
	},
})
