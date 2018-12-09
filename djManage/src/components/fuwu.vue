<template>
	<div class="threea">
		<div class="fan" @click="del">x</div>
		<div class="threeboxa">
			<p class="threep">题目</p>
			<el-input v-model="title"></el-input>
			<p class="threep">创建人</p>
			<el-input v-model="crtUser"></el-input>
			<p class="threep">内容</p>
			<el-input v-model="content"></el-input>
			<el-button type="warning" class="btn" @click="tianjia">修改信息</el-button>
		</div>
	</div>
</template>
<script>
	import URL from '../urlConfig'
	export default {
		props: ["cdz"],//子组件接收的数据
		data() {
			return {
				title: this.cdz.title,//题目
				crtUser: this.cdz.crtUser,//创建人
				content: this.cdz.content,//内容
				picUrl:this.cdz.picUrl,//图片路径
				id:this.cdz.id,
			}
		},
		methods: {
			/*
			 * params:无
			 * return: 无
			 * function:修改信息
			 * */
			tianjia() {
				var obj = {
					id:this.id,
					title: this.title,//题目
					crtUser: this.crtUser,//创建人
					content: this.content,//内容
					picUrl: this.picUrl,//图片路径
				};
				this.$axios.post(URL.xfuwu, obj).then(function(res) {
					//console.log(res)
					this.$layer.alert("修改成功啦")
				}).catch(function(err) {
					console.log(err)
				})

				// 子传父
				this.$emit("tianjia", false)
			},
			/*
			 * params:无
			 * return: 无
			 * function:关闭弹框
			 * */
			del(){
				this.$emit("tianjia", false)
			},
		},
		created() {
			//console.log(this.cdz)
		}
	}
</script>

<style>
	.fan{
		margin-left:110%;
		font-size: 20px;
		height: 20px;
		line-height: 40px;
		cursor: pointer;
	}
	.threea {
		background: rgb(199, 202, 204)
	}
	
	.threebox {
		padding: 0.5rem
	}
	
	.threep {
		font-size: 0.8rem;
		color: gray;
		padding: 0.5rem 0;
	}
	
	.threeboxa {
		width: 500px;
		margin: 0 auto;
	}
	
	.inpa {
		background: rgb(245, 230, 232);
	}
	
	.btn {
		margin: 40px 200px;
	}
</style>