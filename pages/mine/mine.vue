<template>
	<view>
		<scroll-view :class="{show: isAvatarEdit}" class="DrawerPage" scroll-y>
			<view class="header">
				<view class="header-mask"></view>
				<image :src="backgroundImage" class="header-background"></image>
				<view class="cu-avatar round user-avatar" @click="handleEdit">
					<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					<view class="cu-tag badge" :class="[gender.class]"></view>
				</view>
				<view class="cu-btn round nickname text-white" @click="handleEdit">
					{{nickname}}
				</view>
				<view class="user-info">
					<block v-for="(item,index) in userInfo" :key="index">
						<view class="cu-capsule radius" @click="toFriendList">
							<view class="cu-tag tag-title" :class="item.color">
								{{item.title}}
							</view>
							<view class="cu-tag line-white">{{item.value}}</view>
						</view>
					</block>
				</view>
			</view>
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" v-for="(item,index) in tabList"
						:class="index==tabCur?'text-blue current':''" :key="index" @click="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
			<contribute-list v-if="tabCur === 0" :userId="userId" style="margin-bottom: 140rpx;"></contribute-list>
			<like-list v-else :userId="userId" style="margin-bottom: 140rpx;"></like-list>
			<!-- 用来撑开被 tabbar 遮挡的地方 -->
			<view style="height: 120rpx;"></view>
		</scroll-view>
		<view :class="{show: isAvatarEdit}" class="DrawerClose" @click="handleEdit">
			<text class="cuIcon-pullright"></text>
		</view>
		<drawer-left :isAvatarEdit="isAvatarEdit" :isMe="true" @handleEdit="handleEdit" @changeGender="changeGender"
			@changeNickName="changeNickName" @changeAvatar="changeAvatar"
			@changeBackgroundImage="changeBackgroundImage"></drawer-left>
	</view>
</template>

<script>
	import contributeList from '../../components/videoList/contributeList.vue'
	import likeList from '../../components/videoList/likeList.vue'
	import drawerLeft from '../../components/drawer/drawerLeft.vue'
	export default {
		components: {
			contributeList,
			likeList,
			drawerLeft
		},
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				tabCur: 0,
				// 用户默认属性
				avatarUrl: '/static/images/avatar.jpg',
				backgroundImage: '',
				nickname: '',
				userData: {},
				userId: '',
				gender: {
					type: '保密',
					class: 'cuIcon-github bg-green'
				},
				userInfo: [{
						title: '粉丝',
						color: 'text-pink',
						value: 0
					},
					{
						title: '关注',
						color: 'text-yellow',
						value: 0
					},
					{
						title: '点赞',
						color: 'text-blue',
						value: 0
					}
				],
				tabList: ['投稿', '喜欢'],
				// 状态控制
				isAvatarEdit: false,
			}
		},
		onLoad() {
			let user = getApp().globalData.getGlobalUserInfo()
			this.userId = user.id
			this.isUserToken(user)
			this.getUserData()
		},
		onShow() {
			this.isAvatarEdit = false
			this.setTabBarIndex(4)
		},
		methods: {
			// 判断token是否过期
			isUserToken() {
				const token = getApp().globalData.getGlobalToken()
				if (token === undefined || token === "") {
					getApp().globalData.setGlobalToken("")
					uni.reLaunch({
						url: '../login/login'
					})
					return
				}

				const payload = JSON.parse(atob(token.split('.')[1]));
				const expDate = new Date(new Date(0).setUTCSeconds(payload.exp)); // 得到正常的js日期時間
				const timestamp = Math.floor(new Date() / 1000);
				if (expDate < timestamp) {
					getApp().globalData.setGlobalToken("")
					uni.reLaunch({
						url: '../login/login'
					})
					return
				}
				// token过期时间少于6小时替换token
				if (expDate < timestamp + 6 * 60 * 60) {
					// 替换token
					uni.request({
						url: getApp().globalData.baseUrl + '/user/query',
						method: "POST",
						header: {
							'content-type': 'application/json',
							'x-token': getApp().globalData.getGlobalToken()
						},
						data: {
							'token': getApp().globalData.getGlobalToken()
						},
						success: (res) => {
							if (res.data.code === 200) {
								getApp().globalData.setGlobalToken(res.data.data.token)
							}
						},
					})
				}
			},
			// 获取用户信息
			getUserData(user) {
				uni.request({
					url: getApp().globalData.baseUrl + '/user/query',
					method: "POST",
					header: {
						'content-type': 'application/json',
						'x-token': getApp().globalData.getGlobalToken()
					},
					success: (res) => {
						if (res.data.code === 200) {
							let data = res.data.data
							getApp().globalData.setGlobalUserInfo(data)
							if (data.avatar != null && data.avatar != '' && data.avatar != undefined) {
								// this.avatarUrl = getApp().globalData.fileUrl + data.avatar
								this.avatarUrl = data.avatar
							}
							if (data.backgroundImage != null && data.backgroundImage != '' && data
								.backgroundImage != undefined) {
								// this.backgroundImage = getApp().globalData.fileUrl + data.backgroundImage
								this.backgroundImage = data.backgroundImage
							}
							this.nickname = data.nickname
							this.userInfo[0].value = data.fansCounts
							this.userInfo[1].value = data.followCounts
							this.userInfo[2].value = data.receiveLikeCounts
							if (data.gender === 1) {
								this.gender = {
									type: '男',
									class: 'cuIcon-male bg-blue'
								}
							} else if (data.gender === 2) {
								this.gender = {
									type: '女',
									class: 'cuIcon-female bg-pink'
								}
							}
						} else if (res.data.data.reload == true) {
							getApp().globalData.setGlobalToken(null)
							let time = 3
							let interval = setInterval(() => {
								uni.showToast({
									title: res.data.msg + "\r\n" + time + "秒后将跳转到登录页面",
									icon: "none",
									duration: 1000
								})
								time--
							}, 1000)

							setTimeout(() => {
								clearInterval(interval)
								uni.reLaunch({
									url: '../login/login'
								})
							}, 3500)
						}
					}
				})
			},
			// 切换 Tab
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			// 跳转好友列表
			toFriendList() {
				uni.navigateTo({
					url: '../friend/friend?userId=' + this.userId
				})
			},
			// 切换 Drawer
			handleEdit() {
				this.isAvatarEdit = !this.isAvatarEdit
			},
			// 更改性别
			changeGender(gender) {
				this.gender = gender
				this.getUserData()
			},
			// 更改头像
			changeAvatar(avatarUrl) {
				this.avatarUrl = avatarUrl
				this.getUserData()
			},
			// 更改背景
			changeBackgroundImage(backgroundImage) {
				this.backgroundImage = backgroundImage
				this.getUserData()
			},
			// 更改昵称
			changeNickName(nickname) {
				this.nickname = nickname
				this.getUserData()
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/styles/drawer.css";
	@import '../../static/styles/gradientColor.css';
	@import '../../static/styles/mine.scss';
</style>
