<script>
	import Vue from 'vue'
	export default {
		globalData: {
			baseUrl: 'http://video.icewx.com/apis',
			fileUrl: 'http://video.icewx.com/videosPath',
			// baseUrl: 'http://192.168.10.168:8000',
			// fileUrl: 'http://192.168.10.168:8000/videosPath',
			searchInfo: {},
			videoList: [],
			currentPage: 0,
			totalPage: 1,
			page: 1,
			isSearch: false,
			setGlobalUserInfo(user) {
				uni.setStorageSync("userInfo", user)
			},
			getGlobalUserInfo() {
				return uni.getStorageSync("userInfo")
			},
			setGlobalToken(token) {
				uni.setStorageSync("token", token)
			},
			getGlobalToken() {
				return uni.getStorageSync("token")
			},
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
	@import "static/colorui/main.css";
	@import "static/colorui/icon.css";

	html,
	body {
		height: 100%;
		width: 100%;
	}
</style>
