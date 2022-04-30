<template>
	<div class="uni-video-bar uni-video-bar-full video-progress-box" style="">
		<div class="uni-video-controls">
			<div class="uni-video-control-button uni-video-control-button-pause" @click="doClick()" v-if="isPlay"></div>
			<div class="uni-video-control-button uni-video-control-button-play" @click="doClick()" v-if="!isPlay"></div>
			<div ref="timeRef" class="uni-video-current-time"> {{changeTime}} </div>
			<div class="uni-video-progress-container">
				<div ref="progressRef" class="uni-video-progress" @touchmove="touchmove" @touchend="touchend"
					@touchstart="touchstart">
					<div class="uni-video-progress-buffered" :style="'width: '+(videoProgress)+'%;'"></div>
					<div class="uni-video-ball" :style="'left: '+(ballPercent)+'%;'">
						<div class="uni-video-inner"></div>
					</div>
				</div>
				<!-- <progress :percent="100" :stroke-width="6" border-radius="60" activeColor="#09BB07" backgroundColor="#EBEBEB"/> -->
			</div>
			<div class="uni-video-duration"> {{videoTimes}} </div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		ref
	} from 'vue'
	export default {
		data() {
			return {
				isShowProgressBarTime: true,
				dataList: [], //用于数据循环的列表🌟💗
				videoTime: '', //视频总时长，这个主要用来截取时间数值💗
				videoTimes: '', //视频时长，用这个来获取时间值，例如：00:30这个时间值💗
				changeTime: '', //显示滑动进度条时变化的时间💗
				currenttimes: 0, //当前时间💗
				ProgressBarBottom: 20, //进度条离底部的距离💗
				windowWidth: 0, //获取屏幕宽度🌟💗
				windowHeight: 0,
				isDragging: false, //false代表停止滑动🌟💗
				currentPositions: 0, //滑块当前位置的副本💗//2.0已弃用，现已用于后端参数
				newTime: 0, //跟手滑动后的最新时间💗
				percent: 0, //百分小数💗
				ballPercent: 0, //百分数
				durationTimeNumber: 0,
				currentTimeNumber: 0,
				isPlay: true,
			}
		},
		created() {
			this.windowWidth = uni.getSystemInfoSync().windowWidth //获取屏幕宽度
		},
		computed: {
			...mapState({
				videoTimeList: state => state.videoTimeList,
				videoProgress: state => state.videoProgress,
			}),

		},
		mounted() {
			setTimeout(() => {
				this.timeupdate(this.videoTimeList)
			}, 500)
		},
		methods: {
			doClick() {
				this.isPlay = !this.isPlay
				this.$store.commit('setVideoStatus', this.isPlay)
			},
			touchstart(event) {
				// 开始滑动
				this.isDragging == true

				var msg = []
				if (this.videoTime !== '') {
					msg = this.videoTime.split(':')
				}
				var timeNumber = Number(msg[0]) * 60 + Number(msg[1])

				this.currentPositions = event.changedTouches[0].clientX
				this.currentPositions = this.currentPositions - 8.5 - 38 - this.$refs.timeRef.offsetWidth - 12 - 10
				var withCut = 2 * 8.5 + 38 + 2 * this.$refs.timeRef.offsetWidth + 2 * 12 + 2 * 10
				var currentWidth = this.windowWidth - withCut

				this.percent = this.currentPositions / currentWidth
				if (this.percent > 1) {
					this.ballPercent = 100
				} else if (this.percent < 0) {
					this.ballPercent = 0
				} else {
					this.ballPercent = this.percent * 100
				}
				this.newTime = this.percent * timeNumber

				this.currenttimes = parseInt(this.newTime)
				let theTime = this.newTime
				let middle = 0; // 分
				if (theTime > 60) {
					middle = parseInt(theTime / 60);
					theTime = parseInt(theTime % 60);
				}
				this.changeTime =
					`${Math.round(middle)>9?Math.round(middle):'0'+Math.round(middle)}:${Math.round(theTime)>9?Math.round(theTime):'0'+Math.round(theTime)}`
			},
			touchend() { //当手松开后，跳到最新时间
				this.$store.commit('setVideoSeek', this.newTime)
				
				// 播放
				this.isPlay = true
				this.$store.commit('setVideoStatus', this.isPlay)
				// 结束滑动
				this.isDragging == false

			},
			touchmove(event) { //当手移动滑块时，计算位置、百分小数、新的时间
				var msg = []
				if (this.videoTime !== '') {
					msg = this.videoTime.split(':')
				}
				var timeNumber = Number(msg[0]) * 60 + Number(msg[1])
				this.currentPositions = event.changedTouches[0].clientX
				this.currentPositions = this.currentPositions - 8.5 - 38 - this.$refs.timeRef.offsetWidth - 12 - 10
				var withCut = 2 * 8.5 + 38 + 2 * this.$refs.timeRef.offsetWidth + 2 * 12 + 2 * 10
				var currentWidth = this.windowWidth - withCut

				this.percent = this.currentPositions / currentWidth
				if (this.percent > 1) {
					this.ballPercent = 100
				} else if (this.percent < 0) {
					this.ballPercent = 0
				} else {
					this.ballPercent = this.percent * 100
				}
				this.newTime = this.percent * timeNumber
				this.currenttimes = parseInt(this.newTime)
				let theTime = this.newTime
				let middle = 0; // 分
				if (theTime > 60) {
					middle = parseInt(theTime / 60);
					theTime = parseInt(theTime % 60);
				}
				this.changeTime =
					`${Math.round(middle)>9?Math.round(middle):'0'+Math.round(middle)}:${Math.round(theTime)>9?Math.round(theTime):'0'+Math.round(theTime)}`
			},
			timeupdate(videoTimeList) { //计算滑块当前位置，计算当前百分小数
				this.durationTimeNumber = Math.round(videoTimeList.duration)
				this.currentTimeNumber = Math.round(videoTimeList.currentTime)
				this.getTime()
			},
			getTime() { //得到时间函数
				this.videoTime = this.formatSeconds(this.durationTimeNumber);
				var msg = []
				if (this.videoTime !== '') {
					msg = this.videoTime.split(':')
				}
				this.videoTimes = `${msg[0]>9?msg[0]:'0'+msg[0]}:${msg[1]>9?msg[1]:'0'+msg[1]}`;

				let currentTime = this.formatSeconds(this.currentTimeNumber);
				if (currentTime !== '') {
					msg = currentTime.split(':')
				}
				this.changeTime = `${msg[0]>9?msg[0]:'0'+msg[0]}:${msg[1]>9?msg[1]:'0'+msg[1]}`;
				this.ballPercent = this.currentTimeNumber * 100 / this.durationTimeNumber
			},
			formatSeconds(value) { //获取时间函数
				let theTime = parseInt(value); // 秒
				let middle = 0; // 分
				if (theTime > 60) {
					middle = parseInt(theTime / 60);
					theTime = parseInt(theTime % 60);
				}
				return `${middle>9?middle:middle}:${theTime>9?theTime:theTime}`;
			},
		},
		watch: {
			videoTimeList(val) {
				if(!this.isDragging){
					this.timeupdate(val)
				}
			}
		},
	}
</script>

<style>
	.video-progress-box {
		bottom: 100rpx;
	}
</style>
