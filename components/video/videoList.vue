<template>
	<view class="video-list">
		<view class="swiper-box">
			<swiper class="swiper" :vertical="true" @change="slider" :current="currentPage">
				<swiper-item v-for="(item,index) in videoList" :key="index">
					<view class="swiper-item">
						<video-player :video="item" :currentPage="currentPage" :index="index" ref="players"
							@follow="follow" :isLoop="true" @clickVideo="clickVideo">
						</video-player>
						<view class="left-box" v-if="Math.abs(currentPage-index)<=1">
							<list-left :video="item"></list-left>
						</view>
						<view class="right-box" v-if="Math.abs(currentPage-index)<=1">
							<list-right ref="listRight" :video="item"></list-right>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="container">
						<image src="../../static/images/avatar2.jpg" class="image" mode=""></image>
						<view class="content">
							木有视频了哟|д･)...
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="center-box" v-show="isShowPause && !isPause" @click="clickPause"><text class="cuIcon-stop"></text>
		</view>
		<view class="center-box" v-show="isPause" @click="clickPlay"><text class="cuIcon-playfill"></text></view>
	</view>
</template>

<script>
	import videoPlayer from "./videoPlayer.vue";
	import listLeft from "./listLeft.vue";
	import listRight from "./listRight.vue";
	export default {
		components: {
			videoPlayer,
			listLeft,
			listRight
		},
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				videoList: [],
				currentPage: getApp().globalData.currentPage,
				isPause: false,
				isComment: false,
				isShowPause: false,
			}
		},
		created() {
			let curPage = getCurrentPages();
			let params = curPage[curPage.length - 1].options; //获取当前页面参数，如果有则返回参数的对象，没有参数返回空对象{}
			console.log("videoId",params.videoId)
		},
		mounted() {
			let curPage = getCurrentPages();
			let params = curPage[curPage.length - 1].options; //获取当前页面参数，如果有则返回参数的对象，没有参数返回空对象{}
			if (!getApp().globalData.isSearch) {
				uni.request({
					url: this.baseUrl + '/video/showAllVideos',
					method: "POST",
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					data: {
						page: 1,
						videoId: params.videoId,
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.videoList = res.data.data.list
							// console.log(this.currentPage)
							setTimeout(() => {
								// let doms = "players" + (this.currentPage)
								this.$refs.players[this.currentPage].playFromHead(this.currentPage)
							}, 500)
						}
					}
				})
			}
			if(params.videoId!=undefined){
				// 继续加载视频
				uni.request({
					url: this.baseUrl + '/video/showAllVideos?page=2',
					method: "POST",
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					data: {
						page: 1,
						pageSize: 2,
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.videoList.push(...res.data.data.list)
							console.log(this.videoList)
						}
					}
				})
			}
		},
		methods: {
			// 双击点赞
			follow(index) {
				this.$refs.listRight[index].handleFollow();
			},
			clickPause() {
				this.isPause = true
				this.$store.commit('setVideoStatus', !this.isPause)
			},
			clickPlay() {
				this.isPause = false
				this.$store.commit('setVideoStatus', !this.isPause)
			},
			// 上滑与下滑功能实现
			slider(e) {
				const targetPage = e.detail.current;
				console.log("targetPage", targetPage)
				//
				let data = {
					currentTime: 0,
					duration: 0
				}
				this.$store.commit('setVideoTimeList', data)
				this.$store.commit('setVideoStatus', true)
				this.$store.commit('setVideoProgress', 0)
				this.$store.commit('setVideoSeek', 0)
				//
				//滑动隐藏控制栏
				this.isShowPause = false
				this.isPause = false
				// 滑动切换视频
				if (targetPage === this.currentPage + 1) {
					// console.log("切换到下一个视频");
					this.$store.commit('setVideoIndex', targetPage) // 切换
					console.log("pause before", this.currentPage)
					this.$refs.players[this.currentPage].pause();
					if (targetPage != this.$refs.players.length) {
						this.$refs.players[targetPage].playFromHead(targetPage);
					} else {
						// 继续加载视频
						uni.request({
							url: this.baseUrl + '/video/showAllVideos?page=2',
							method: "POST",
							header: {
								'content-type': 'application/json',
								'x-token': getApp().globalData.getGlobalToken()
							},
							data: {
								page: 2,
							},
							success: (res) => {
								if (res.data.code === 200) {
									this.videoList.push(...res.data.data.list)
									console.log(this.videoList)
								}
							}
						})
						this.$store.commit('setVideoIndex', targetPage) // 切换
						this.$refs.players[this.currentPage].pause();
						setTimeout(() => {
							this.$refs.players[targetPage].playFromHead(targetPage);
						}, 500)
					}
				} else if (targetPage === this.currentPage - 1) {
					// console.log("切换到上一个视频");
					this.$store.commit('setVideoIndex', targetPage) // 切换
					// this.$store.commit('setVideoIndex', 1) // 切换
					if (this.currentPage != this.$refs.players.length) {
						console.log("pause before", this.currentPage)
						// console.log(this.$refs.players)
						this.$refs.players[this.currentPage].pause();
					}
					this.$refs.players[targetPage].playFromHead(targetPage);
				}
				this.currentPage = targetPage;
			},
			clickVideo(val) {
				this.isShowPause = !this.isShowPause
				setTimeout(() => {
					this.isShowPause = !this.isShowPause
				}, 3500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.right-box {
		position: absolute;
		bottom: 100rpx;
		right: 20rpx;
		z-index: 200;
	}

	.center-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 70rpx;
		text-align: center;
		line-height: 100rpx;
		color: #FFF;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .15);
		z-index: 900;
	}

	.left-box {
		position: absolute;
		bottom: 100rpx;
		left: 30rpx;
		z-index: 200;
	}

	.video-list {
		width: 100%;
		height: 100%;
	}

	.swiper-box {
		height: 100%;
		width: 100%;
	}

	.swiper {
		height: calc(100vh - 100rpx);
		// height: 750rpx;
		width: 100%;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.container {
		height: 100vh;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: row;
		padding-top: 500rpx;
		background-color: #FFF;

		.image {
			width: 300rpx;
			height: 300rpx;
		}

		.content {
			display: inline-block;
			height: 300rpx;
			padding-top: 100rpx;
			font-size: 44rpx;
			flex: 1;
		}
	}
</style>
