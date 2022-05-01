<template>
	<view class="video-player" @click="doClick">
		<video class="video" :id="'myVideo'+index" :src="videoPath" :controls="false" :objectFit="cover"
			:show-center-play-btn="false" :loop="isLoop" @timeupdate="timeupdate($event)" @progress="progress($event)"
			@loadedmetadata="loadedmetadata($event)" v-if="Math.abs(currentPage-index)<=1">
		</video>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	let timer = null;
	export default {
		data() {
			return {
				fileUrl: getApp().globalData.fileUrl,
				isPlay: false,
				clickPlay: false,
				clickCount: 0,
				cover: "contain", //contain：包含，fill：填充，cover：覆盖
				videoPath: "",
				videoContext: '',
				isControls: true,
				videoStatus: false,
				muted: true,
			}
		},
		props: ["currentPage", "index", "video", "isLoop"],
		created() {
			this.videoContext = uni.createVideoContext("myVideo"+this.index, this);
		},
		mounted() {
			let video = this.video
			if (video.isLocal) {
				this.videoPath = this.fileUrl + video.videoPath
			} else {
				this.videoPath = video.videoPath
			}

			// 横向视频进行自适应
			if (video.videoWidth >= video.videoHeight) {
				this.cover = ""
			}
			// 进入页面后开启自动播放

			// if (this.index === this.currentPage) {
			// 	setTimeout(() => {
			// 		this.play();
			// 	}, 100)
			// }
		},
		computed: {
			...mapState({
				videoIndex: state => state.videoIndex,
			}),
			monitor() {
				return this.$store.state.videoStatus
			},
			seekMonitor() {
				return this.$store.state.videoSeek
			}
		},
		methods: {
			// 播放
			play() {
				console.log("play",this.index)
				this.videoContext.play();
				this.isPlay = true;
				// this.$emit('playAnimate', this.currentPage)
			},
			// 暂停
			pause() {
				console.log("pause index",this.index)
				console.log("pause currentPage",this.currentPage)
				this.videoContext.pause();
				this.isPlay = false;
				// this.$emit('pauseAnimate', this.currentPage)
			},
			// 从头播放
			playFromHead(index) {
				console.log("playFromHead",index)
				if (this.videoIndex == this.index) {
					this.videoContext.seek(0);
					this.videoContext.play();
					this.isPlay = true;
				}
				// this.$emit('playAnimate', index)
			},
			// 点击播放或暂停视频，双击点赞
			doClick() {
				// center-box
				// 点击屏幕一次

				if (timer) {
					clearTimeout(timer);
				}
				this.clickCount++;
				timer = setTimeout(() => {
					if (this.clickCount >= 2) {
						this.$emit("follow", this.currentPage);
					} else {
						this.$emit("clickVideo", true);
					}
					this.clickCount = 0;
				}, 300);
			},
			// 播放进度
			timeupdate(event) {
				if (this.videoIndex == this.index) {
					this.$store.commit('setVideoTimeList', event.detail)
				}
			},
			// 缓冲进度
			progress(event) {
				if (this.videoIndex == this.index) {
					this.$store.commit('setVideoProgress', parseInt(event.detail.buffered))
				}
			},
			// 视频元数据
			loadedmetadata(event) {
				let data = {
					currentTime: 0,
					duration: event.detail.duration
				}
				if (this.videoIndex == this.index) {
					this.$store.commit('setVideoTimeList', data)
				}
			}
		},
		watch: {
			monitor(val) {
				// console.log("val",val)
				// console.log("videoIndex",this.videoIndex == this.index)
				if (this.videoIndex == this.index) {
					if (val) {
						this.play()
					} else {
						this.pause()
					}
				}
			},
			seekMonitor(val) {
				if (this.videoIndex == this.index) {
					this.videoContext.seek(val);
				}
			},
		}
	}
</script>

<style>
	.video-player {
		width: 100%;
		height: 100%;
	}

	.video {
		width: 100% !important;
		height: 100% !important;
		position: absolute !important;
		z-index: 100;
	}
</style>
