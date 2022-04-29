<template>
	<view class="video-progress" style="background-color: #555555;height:100vh;width: 100%;">
		<p>hello</p>
		<!-- 1.注意：进度条这类拖拽的东西不能放进block\cell这些循环体中的，要不然touchmove方法会捕捉有误 -->
		<view v-if="isShowProgressBarTime == true"
			class="time-bar"
			:style="'position: absolute; bottom: '+ (ProgressBarBottom + 70) +'upx;'">
			<text style="font-size: 18px; color: #F1F1F1;">{{changeTime}} / {{videoTimes}}</text>
		</view>
		<!-- 这里就是进度条了：纯手工进度条，调整位置的话就把他们的 bottom 改成一下就行了 -->
		<view @touchmove="touchmove" @touchend="touchend" @touchstart="touchstart"
			:style="'position: absolute; bottom: '+ (ProgressBarBottom - 20) +'upx; left: 0;'">
			<!-- 1.这一步必须加，为了适配低端机型 -->
			<text :style="'width: '+ windowWidth +'px; opacity: 0;'">.</text>
			<!-- 2.这是未加载的时的右边的灰色部分 -->
			<view
				:style="'width: '+ windowWidth +'px; height: 4upx; background-color: #C8C7CC; position: absolute; bottom: '+ ProgressBarBottom +'upx; opacity: '+ ProgressBarOpacity +';'">
			</view>
			<!-- 3.这里我采用的分离式办法：就是让滑动样式和不滑动的样式分开，这样相互不干扰，可以避免进度条闪动的问题 -->
			<!-- 4.注意：isShowProgressBarTime 加入了返回数据中 -->
			<view v-if="isShowProgressBarTime == false"
				:style="'width: '+ (currentPosition) +'px; height: 4upx; background-color: #FFFFFF; position: absolute; bottom: '+ ProgressBarBottom +'upx; left: 0; opacity: '+ (ProgressBarOpacity - 0.1) +';'">
			</view>
			<view v-if="isShowProgressBarTime == true"
				:style="'width: '+ (currentPositions) +'px; height: 8upx; background-color: #FFFFFF; position: absolute; bottom: '+ ProgressBarBottom +'upx; left: 0; opacity: '+ (ProgressBarOpacity + 0.05) +';'">
			</view>
			<view v-if="isShowProgressBarTime == false"
				:style="'width: 4px; height: 4px; background-color: #FFFFFF; border-radius: 10px; position: absolute; bottom: '+ (ProgressBarBottom - 2) +'upx; left: '+ (currentPosition) +'px; opacity: '+ ProgressBarOpacity +';'">
			</view>
			<view v-if="isShowProgressBarTime == true"
				:style="'width: '+ dotWidth +'px; height: '+ dotWidth +'px; background-color: #FFFFFF; border-radius: 10px; position: absolute; bottom: '+ (ProgressBarBottom - 5) +'upx; left: '+ (currentPositions - 5) +'px; opacity: '+ ProgressBarOpacity +';'">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowProgressBarTime: true,
				dataList: [], //用于数据循环的列表🌟💗
				videoTime: '100', //视频总时长，这个主要用来截取时间数值💗
				videoTimes: '100', //视频时长，用这个来获取时间值，例如：00:30这个时间值💗
				changeTime: '20', //显示滑动进度条时变化的时间💗
				currenttimes: 0, //当前时间💗
				ProgressBarBottom: 20, //进度条离底部的距离💗
				windowWidth: 0, //获取屏幕宽度🌟💗
				windowHeight: 0,
				isDragging: false, //false代表停止滑动🌟💗
				ProgressBarOpacity: 0.7, //进度条不拖动时的默认值，就是透明的💗
				currentPosition: 50, //滑块当前位置💗//2.0已弃用，现已用于后端参数
				currentPositions: 50, //滑块当前位置的副本💗//2.0已弃用，现已用于后端参数
				dotWidth: 0, //播放的小圆点，默认没有💗
			}
		},
		created() {
			this.windowWidth = uni.getSystemInfoSync().screenWidth //获取屏幕宽度
		},
		methods: {
			touchstart(event) {
				this.dataList[this.k].isShowimage = true //刚触摸的时候就要显示预览视频图片了
				this.dataList[this.k].isShowProgressBarTime = true //显示时间线
				this.ProgressBarOpacity = 1 //让滑块显示起来更明显一点
				this.dotWidth = 10 //让点显示起来更明显一点
			},
			touchend() { //当手松开后，跳到最新时间
				uni.createVideoContext(this.dataList[this.k]._id, this).seek(this.newTime)
				if (this.dataList[this.k].state == 'pause') {
					this.dataList[this.k].state = 'play'
					uni.createVideoContext(this.dataList[this.k]._id, this).play()
				}
				this.dataList[this.k].isShowProgressBarTime = false //触摸结束后，隐藏时间线
				this.dataList[this.k].isShowimage = false //触摸结束后，隐藏时间预览
				this.ProgressBarOpacity = 0.5 //隐藏起来进度条，不那么明显了
				this.dotWidth = 0 //隐藏起来进度条，不那么明显了
			},
			touchmove(event) { //当手移动滑块时，计算位置、百分小数、新的时间
				var msg = []
				if (this.videoTime !== '') {
					msg = this.videoTime.split(':')
				}
				var timeNumber = Number(msg[0]) * 60 + Number(msg[1])
				this.currentPositions = event.changedTouches[0].screenX
				this.percent = this.currentPositions / this.windowWidth
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
			timeupdate(event, index) { //计算滑块当前位置，计算当前百分小数
				// console.log(index)
				if (index == this.k) {
					// console.log(event)
					var currenttime = event.detail.currentTime
					this.timeNumber = Math.round(event.detail.duration)
					this.getTime()
					this.percent = currenttime / this.timeNumber
					this.currentPosition = this.windowWidth * this.percent
					let theTime = currenttime
					let middle = 0; // 分
					if (theTime > 60) {
						middle = parseInt(theTime / 60);
						theTime = parseInt(theTime % 60);
					}
					this.changeTime =
						`${Math.round(middle)>9?Math.round(middle):'0'+Math.round(middle)}:${Math.round(theTime)>9?Math.round(theTime):'0'+Math.round(theTime)}`
					//自动切换视频
					if (this.isAutoplay) { //true,代表自动播放
						if (Math.round(currenttime) == this.timeNumber - 1) {
							const dom = uni.requireNativePlugin('dom')
							let doms = 'item' + (this.k + 1)
							setTimeout(() => {
								let el = this.$refs[doms][0]
								dom.scrollToElement(el, {
									offset: 0,
									animated: true
								})
							}, 500)
						}
					}
				}
			},
			getTime() { //得到时间函数
				this.videoTime = this.formatSeconds(this.timeNumber);
				// console.log(that.videoTime)
				var msg = []
				if (this.videoTime !== '') {
					msg = this.videoTime.split(':')
				}
				this.videoTimes = `${msg[0]>9?msg[0]:'0'+msg[0]}:${msg[1]>9?msg[1]:'0'+msg[1]}`;
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
		}
	}
</script>

<style>
	.time-bar {
		left: 50%;
		justify-content: center
	}
</style>
