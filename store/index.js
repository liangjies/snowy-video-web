import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		videoStatus: true, //播放状态
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
		setVideoStatus(state, videoStatus) {
			state.videoStatus = videoStatus
		},
	},
	getters: {
		videoTimeList(state) {
			return state.videoTimeList
		},
		videoProgress(state) {
			return state.videoProgress
		},
		videoStatus(state) {
			return state.videoStatus
		},
	},
})
