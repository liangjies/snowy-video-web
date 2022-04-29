<template>
	<view class="content">
		<video-progress></video-progress>
	</view>
</template>

<script>
	import videoProgress from "../../components/video/videoProgress.vue"
	export default {
		components: {
			videoProgress,
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