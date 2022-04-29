<template>
	<view class="video-player" @click="doClick">
		<video class="video" id="myVideo" :src="videoPath" :controls="false" :objectFit="cover" @ended="toNextVideo"
			:show-center-play-btn="true" :loop="isLoop" @timeupdate="timeupdate($event)">
		</video>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				fileUrl: getApp().globalData.fileUrl,
				isPlay: false,
				clickCount: 0,
				cover: "contain", //contain：包含，fill：填充，cover：覆盖
				videoPath: "",
				videoContext: '',
				isControls: true,
			}
		},
		props: ["currentPage", "index", "video", "isLoop"],
		created() {
			this.videoContext = uni.createVideoContext("myVideo", this);
			
		},
		mounted() {
			let video = this.video
			this.videoPath = this.fileUrl + video.videoPath
			// 横向视频进行自适应
			if (video.videoWidth >= video.videoHeight) {
				this.cover = ""
			}
			// 进入页面后开启自动播放

			if (this.index === this.currentPage) {
				setTimeout(() => {
					this.play();
				}, 100)
			}
		},
		methods: {
			// 播放完成后滑动到下一页
			toNextVideo() {
				this.$emit('toNextVideo', this.currentPage)
			},
			// 播放
			play() {
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', this.currentPage)
			},
			// 暂停
			pause() {
				this.videoContext.pause();
				this.isPlay = false;
				this.$emit('pauseAnimate', this.currentPage)
			},
			// 从头播放
			playFromHead(index) {
				this.videoContext.seek(0);
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', index)
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
						if (this.isPlay) {
							this.pause();
						} else {
							this.play();
						}
					}
					this.clickCount = 0;
				}, 300);
			},
			// 播放进度
			timeupdate(event) {
				this.$store.commit('setVideoTimeList', event)
				//console.log(event)
				// console.log(index)
			}
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
