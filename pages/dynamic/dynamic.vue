<template>
	<view style="height: 100%; background: #F5F5F5;">
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">动态</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 关注列表
			</view>
		</view>
		<view class="follow-list" v-if="!isFollowEmpty">
			<view class="cu-avatar-group">
				<view class="cu-avatar round lg" v-for="(item,index) in followList" :key="index">
					<image :src="item.avatar ? item.avatar : avatarUrl" mode="" class="avatar"></image>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue "></text> 综合动态
			</view>
		</view>
		<dynamic-list :videoList="videoList" :isEmpty="isVideoEmpty"></dynamic-list>
		<view style="height: 120rpx;"></view>
	</view>
</template>

<script>
	import dynamicList from '../../components/videoList/dynamicList.vue'
	export default {
		components:{
			dynamicList
		},
		data() {
			return {
				avatarUrl: '/static/images/avatar.jpg',
				followList: [],
				videoList: [],
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				isEmpty: false,
				isVideoEmpty: false,
				isFollowEmpty: false,
			}
		},
		onShow() {
			this.setTabBarIndex(1)
			let user = getApp().globalData.getGlobalUserInfo()
			this.showFollows(user)
			this.getVideoList(user)
		},
		methods:{
			showFollows(user) {
				uni.request({
					url: this.baseUrl + '/user/queryFollows?userId=' + user.id,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.followList = res.data.data.list
							if (res.data.data.total === 0) {
								this.isEmpty = true
							}
						}
					}
				})
			},
			getVideoList(user) {
				uni.request({
					url: this.baseUrl + '/video/showMyFollowVideos?userId=' + user.id,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.videoList = res.data.data.list
							this.isVideoEmpty = res.data.data.length === 0 ? true : false
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.follow-list {
		height: 120rpx;
		background-color: #F5F5F5;
		padding-left: 30rpx;
	}
	.avatar {
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}
</style>
