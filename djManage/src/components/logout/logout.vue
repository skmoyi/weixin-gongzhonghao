<!--author:王超楠
	created:2018-07-13
	effect:新闻记录-->
<template>
	<div id="four">
		<!--<div class="s">
			<div class="st">
				<p>注册用户审核</p>
			</div>
		</div>-->

		<div class="table-wrapper">
			<div class="table-name">办事指南</div>
			<quill-editor v-model="content" ref="myQuillEditor">
			</quill-editor>
			<el-button type="primary" class="release" @click="release">发布</el-button>
		</div>

		
	</div>
</template>

<script>
	import myLog from '../log'
	import URL from '../../urlConfig'
	export default {
		components: {
			myLog
		},
		data() {
			return {
				pagesize: 3, //默认每页数据量               
				currentPage: 1, //当前页码              
				totalCount: 0, //默认数据总数
				labelPosition: 'top', //表格定位
				list: {
					title: '', //题目
					content: '', //内容
					crtUser: '', //创建人
					programa: '', //栏目
					programaName: '', //栏目名称
				},
				tableData: [], //表格默认数据
				flag: false,
				tableFlag: false,
				totalPage: 1,
				content: '',
				
			}
		},
		methods: {
			/*
			 * params:currentPage
			 * return: 无
			 * function:页面数量
			 * */
			release() {
				this.$axios.post(URL.updGuidance,{content:this.content}).then((res)=>{
					if(res.data.flag){
						this.$layer.msg('发布成功')
					}
				})
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页面数量
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
			},
			/*
			 * params:val
			 * return: 无
			 * function: 添加的事件
			 * 
			 * */
			tianjia(val) {
				this.flag = val;
				this.$axios.post(URL.newlist, {
						page: 1,
						pageSize: 5,
					}).then(res => {
						this.arr = res.data.map.list
					})
					.catch(err => {
						console.log(err)
					})
			},
			/*
			 * params:无
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			submit() {
				var all = false;
				for(var item in this.list) {
					if(this.list[item].length == 0) {
						all = true;
					}
				}
				if(all) {
					this.$layer.alert("请填写完整信息")
				} else {
					this.$axios.post(URL.addnew, {
							title: this.list.title,
							content: this.list.content,
							crtUser: this.list.crtUser,
							programa: this.list.programa,
							programaName: this.list.programaName,
						}).then(res => {
							this.newlist()
							//console.log(res.data)
							this.$layer.alert("提交成功")
						})
						.catch(err => {
							console.log(err)
						})
				}
			},
			/*
			 * params:无
			 * return: 无
			 * function: 重置按钮
			 * */
			reset() {
				this.list.id = '',
					this.list.title = "",
					this.list.content = '',
					this.list.crtUser = '',
					this.list.programa = '',
					this.list.programaName = ''
			},
			/*
			 * params:无
			 * return: 无
			 * function:删除事件
			 * */
			del(index, row) {
				this.$axios.post(URL.delnewlist, {
						ids: this.arr[index].id,
					}).then(res => {
						//console.log(res.data)
						//							this.dongtai();
						this.arr.splice(index, 1)
						this.$layer.alert("删除成功")
					})
					.catch(err => {
						console.log(err)
					})
			},
			/**
			 * params null
			 * return null
			 * function 审核会员
			 */
			async edit(x, y, val) {

				try {
					let ths = this;
					ths.$layer.confirm('审核通过？', {
						btn: ['确定', '取消']
					}, async function() {
						let data = (await ths.$axios.post(URL.updToAudit, {
							ids: y.id,
							registerState: val
						})).data;
						if(data.code == 200) {

							ths.$layer.closeAll();
							ths.$layer.msg('通过审核');
							ths.newlist();
						}
					}, function() {

						ths.$layer.closeAll();
					})

				} catch(err) {
					console.log(err)
				}

			},
			/*
			 * params:无
			 * return: 无
			 * function: 请求list数据
			 * */
			async getData() {
				this.tableFlag = true;

				this.content = (await this.$axios.post(URL.allGuidance)).data.flag.content;
				

			}
		},

		created() {
			this.getData();

		}

	}
</script>

<style scoped lang="scss">
	.table-wrapper {
		padding: 20px;
		width: calc(100% - 40px);
		.table-name {
			font-size: 16px;
			border-bottom: 1px solid #ccc;
			margin-bottom: 20px;
			padding-bottom: 20px;
		}
		.quill-editor {
			height: 300px;
		}
		.release {
			margin-top: 90px;
		}
	}
	
	.s {
		color: #9A9A9A;
		width: 100%;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #DDDDDD;
		background: #3c8dbc;
	}
	
	.st {
		margin-left: 3%;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	
	.tab {
		width: 100%;
		background: white;
		height: 700px;
	}
	
	.tabb {
		width: 50%;
		margin: 0 auto;
		padding-bottom: 20px;
	}
	
	.tabb p {
		padding: 20px 0 5px;
		color: #9B9AA8;
	}
	
	.xg {
		height: 580px;
		width: 1100px;
		position: fixed;
		top: 0;
		left: 250px;
		background: rgb(199, 202, 204)
	}
	
	.xga {
		width: 500px;
		margin: 0 auto;
	}
</style>