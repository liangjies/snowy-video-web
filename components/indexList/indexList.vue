<template>
	<view class="video-container">
		<block v-for="(item,index) in videoList" :key="item.id">
			<view class="cu-card case" @click="toVideoPage(item.id,index)">
				<view class="cu-item shadow">
					<view class="image"
						style="height: 450rpx; width: 100%;background-repeat: no-repeat; background-size: cover;"
						:style="{'background-image':'url(' + (item.isLocal ? fileUrl + item.coverPath : item.coverPath) + ')'}">
						<!-- 使用 image 可能造成手机闪屏 -->
						<!-- <image :src="fileUrl + item.coverPath" mode="aspectFill" style="height: 100%; width: 100%;">
						</image> -->
						<!-- <view class="cu-tag bg-red">hot</view> -->
						<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.videoDesc}}</text></view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg">
								<image :src="item.avatar" mode="widthFix"
									style="height: 100%; width: 100%; border-radius: 50%;"></image>
							</view>
							<view class="content flex-sub">
								<view class="text-grey">{{item.nickname}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.createTime.slice(5,10)}}
									<view class="text-gray text-sm">
										<!-- <text class="cuIcon-attentionfill margin-lr-xs"></text> 10 -->
										<text class="cuIcon-messagefill margin-lr-xs "></text>{{item.comments}}
										<text class="cuIcon-likefill text-red margin-lr-xs"></text> {{item.likeCounts}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="cu-load" :class="!isNoMore?'loading':'over'" style="background: rgba(0,0,0,0);"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				videoList: [],
				isNoMore: false,

			}
		},
		methods: {
			getAllVideoList(page, isSaveRecord, searchContent) {
				if (!isSaveRecord) {
					isSaveRecord = 0
				}
				if (!searchContent) {
					searchContent = ''
				}
				uni.request({
					url: this.baseUrl + '/video/showVideos?isSaveRecord=' + isSaveRecord,
					method: "POST",
					data: {
						'videoDesc': searchContent,
						'page': page,
					},
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					success: (res) => {
						if (res.data.code === 200) {
							// 判断当前页是否为第一页，若是，则设置videoList为空
							uni.stopPullDownRefresh()
							if (page === 1) {
								this.videoList = []
							}
							let data = res.data.data
							this.videoList = this.videoList.concat(data.list)
							// 获取评论数量
							this.setComments()
							getApp().globalData.videoList = this.videoList
							if (data.page > getApp().globalData.page) {
								getApp().globalData.page = data.page
							}
							getApp().globalData.totalPage = Math.ceil(data.total/data.pageSize)
							if (data.list.length === 0 || data.list.length<data.pageSize) {
								this.isNoMore = true
							}
						} else if (res.data.data.reload == true) {
							getApp().globalData.setGlobalToken("")
							uni.reLaunch({
								url: '../login/login'
							})
						}
					}
				})
			},
			setComments() {
				let user = getApp().globalData.getGlobalUserInfo()
				this.videoList.forEach(item => {
					this.getComments(item, user)
				})
			},
			getComments(video, user) {
				uni.request({
					url: this.baseUrl + '/video/getVideoComments?videoId=' + video.id,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					success: (res) => {
						if (res.data.status === 200) {
							// 给对象额外添加一个数据字段时，视图没有立即渲染
							// 此时可以使用 $set
							this.$set(video, "comments", res.data.data.length)
						}
					}
				})
			},
			toVideoPage(videoId, index) {
				getApp().globalData.currentPage = 0
				console.log(uni.getSystemInfoSync().uniPlatform)
				if (getApp().globalData.isSearch) {
					// 如果是查询状态，则关闭其他页面
					// #ifdef APP-PLUS
					uni.reLaunch({
						url: '../../pages/nvueSwiper/nvueSwiper?videoId=' + videoId,
					})
					//#endif
					// #ifdef H5
					uni.reLaunch({
						url: '../../pages/video/video?videoId=' + videoId,
					})
					//#endif
				} else {
					// #ifdef APP-PLUS
					uni.navigateTo({
						url: '../../pages/nvueSwiper/nvueSwiper?videoId=' + videoId,
					})
					//#endif
					// #ifdef H5
					uni.navigateTo({
						url: '../../pages/video/video?videoId=' + videoId,
					})
					//#endif
				}
			}
		}
	}
</script>

<style>
	.video-container {
		margin-bottom: 110rpx;
	}
</style>
