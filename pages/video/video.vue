<template>
	<view class="content">
		<video-header></video-header>
		<video-list></video-list>
		<video-progress></video-progress>
		<video-footer></video-footer>
	</view>
</template>

<script>
	import videoHeader from "../../components/video/videoHeader.vue"
	import videoFooter from "../../components/video/videoFooter.vue"
	import videoList from "../../components/video/videoList.vue"
	import videoProgress from "../../components/video/videoProgress.vue"
	export default {
		components: {
			videoList,
			videoHeader,
			videoFooter,
			videoProgress
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		color: #3F536E;
		.title {
			margin: 0 20rpx;
		}
	}
</style>
