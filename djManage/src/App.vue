<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'

	export default {
		name: 'App',
		computed: {
			...mapState(['userInfo'])
		},
	}
</script>

<style scoped lang="scss">
	html,
	body {
		width: 100%;
		height: 100%;
	}
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		width: 100%;
		height: 100%;
		.el-aside {
			width: 200px;
			background: #222d32;
		}
	}
	
	.s {
		color: #fff;
		width: 100%;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #DDDDDD;
		background: #e53a1e;
	}
	
	.st {
		margin-left: 3%;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	
	.el-container {
		width: 100%;
		height: calc(100% - 60px);
	}
	
	.el-aside {
		height: 100%;
	}
	
	.shang {
		/*display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;*/
		font-size: 24px;
		background: #e53a1e;
		color: #fff;
		height: 60px;
		line-height: 60px;
		.title {
			text-align: left;
			padding-left: 32px;
		}
		.version {
			font-size: 12px;
		}
	}
	
	.shang p {
		width: 100%;
		margin: 5px 0;
	}
	
	.xia {
		padding-left: 15%;
		padding-right: 15%;
		font-size: 14px;
		color: #fff;
		
	}
	
	.xia .xiaa {
		width: 100%;
		margin-top: 20px;
		line-height: 33px;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		cursor: pointer;
	}
	
	.xia .xiaa span {
		font-size: 16px;
		margin-right: 10px;
		font-weight: bold;
	}
	
	.active {
		color: #EB5E28;
		background: #fff;
		border-radius: 20px;
		.el-icon-dj-yonghu,
		.el-icon-dj-xinxi,
		.el-icon-dj-web-icon-,
		.el-icon-dj-huodong,
		.el-icon-dj-tongzhi,
		.el-icon-dj-gongzi,
		.el-icon-dj-zhuanhuan,
		.el-icon-dj-datiqia,
		.el-icon-dj-yonghu {
			color: #EB5E28
		}
	}
	
	.el-main {
		margin: 0;
		padding: 0;
		background: #f5f5f5;
	}
</style>