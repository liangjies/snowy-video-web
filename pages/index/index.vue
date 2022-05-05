<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">Snowy 短视频</block>
		</cu-custom>
		<!--轮播图-->
		<!--<intro-swiper></intro-swiper>-->
		<index-list ref="videoList"></index-list>
	</view>
</template>

<script>
	import indexList from '../../components/indexList/indexList.vue'
	// import introSwiper from '../../components/introSwiper/introSwiper.vue'
	export default {
		components: {
			indexList,
		},
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				// 屏幕宽度
				screenWidth: 350,
			}
		},
		onShow() {
			this.setTabBarIndex(0)
			for (let i = 1; i <= getApp().globalData.page; i++) {
				if (i === 1) {
					//this.$refs.videoList.getAllVideoList(1)
					setTimeout(() => {
						this.$refs.videoList.getAllVideoList(i)
					},500)
				} else {
					setTimeout(() => {
						this.$refs.videoList.getAllVideoList(i)
					},500)
				}
			}
			// 设置搜索全局属性
			getApp().globalData.isSearch = false
		},
		// 上拉刷新
		onReachBottom() {
			// 判断当前页数和总页数是否相等
			if (getApp().globalData.page === getApp().globalData.totalPage) {
				this.$refs.videoList.isNoMore = true
				return
			}
			let nextPage = getApp().globalData.page + 1
			this.$refs.videoList.getAllVideoList(nextPage)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.$refs.videoList.getAllVideoList(1)
			getApp().globalData.page = 1
		},
		// 仅第一次进入会触发onLoad
		onLoad() {
			this.screenWidth = uni.getSystemInfo().screenWidth
			let user = getApp().globalData.getGlobalUserInfo()
			this.isUserToken()
		},
		methods:{
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
		},
	}
</script>

<style lang="scss">

</style>
