<!--author:王超楠
	created:2018-07-13
	effect:政策法规弹框-->
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
			<p class="threep">文章来源</p>
			<el-input v-model="articleSource"></el-input>
			<p class="threep">发布时间</p>
			<el-input v-model="releaseTime"></el-input>
			<p class="threep">作者</p>
			<el-input v-model="author"></el-input>
			<el-button type="warning" class="btn" @click="tianjia">修改信息</el-button>
		</div>
	</div>
</template>
<script>
	import URL from '../urlConfig'
	export default {
		props: ["cdz"],
		data() {
			return {
				title: this.cdz.title, //题目
				crtUser: this.cdz.crtUser, //创建人
				content: this.cdz.content, //内容	
				author: this.cdz.author, //作者
				articleSource: this.cdz.articleSource, //文章来源
				releaseTime: this.cdz.releaseTime, //发布时间
				id: this.cdz.id,
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
					id: this.id,
					title: this.title,
					crtUser: this.crtUser,
					content: this.content,
					crtTime: this.crtTime,
					programa: this.programa,
					programaName: this.programaName,
				};
				this.$axios.post(URL.xfagui, obj).then(function(res) {
					this.$layer.alert("修改成功啦")
					this.fagui()
				}).catch(function(err) {
					console.log(err)
				})
				// 子传父
				this.$emit("tianjia", false)
			},
			/*
			 * params:无
			 * return: 无
			 * function: 请求法规列表
			 * */
			fagui() {
				this.$axios.post(URL.fagui, {
						page: 1,
						pageSize: 5,
					}).then(res => {
						//console.log(res.data)
						//this.arr = res.data.map.list
					})
					.catch(err => {
						console.log(err)
					})
			},
			/*
			 * params:无
			 * return: 无
			 * function:关闭弹框
			 * */
			del() {
				this.$emit("tianjia", false)
			},

		},
		created() {
			//			this.fagui()
		}
	}
</script>

<style scoped>
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
	
	.fan {
		margin-left: 110%;
		font-size: 20px;
		height: 20px;
		line-height: 40px;
		cursor: pointer;
	}
</style>