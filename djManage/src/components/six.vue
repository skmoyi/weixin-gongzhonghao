<!--author:王超楠
	created:2018-07-13
	effect:信用动态记录-->
<template>
	<div id="fuwu">
		<!--<div class="s">
			<div class="st">
				<p>系统通知列表管理</p>
			</div>
		</div>-->

		<div class="table-wrapper">
			<div class="table-name">系统通知列表管理</div>
			<el-button class="addBtn" type="danger" @click="addContent">添加</el-button>
			<el-button class="addBtn" type="info" @click="deleteAll">批量删除</el-button>
			<el-table v-loading="tableFlag" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="informContent" label="通知内容">
				</el-table-column>
				<el-table-column prop="informTime" label="创建时间">
				</el-table-column>

				<el-table-column prop="" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="bj(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div align="center">
			<el-pagination @current-change="current_change" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="totalCount">
			</el-pagination>
		</div>
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="flag" :before-close="clearList">
			<el-form :label-position="labelPosition" label-width="80px" :model="list" class="tabb">

				<el-form-item label="通知">
					<el-input v-model="list.informContent" placeholder="内容"></el-input>
				</el-form-item>
				<el-button type="primary" @click="update">修改通知</el-button>
				<!--<el-button type="danger" @click="reset">重置</el-button>-->
			</el-form>
		</el-dialog>
		<el-dialog :visible.sync="addFlag">
			<div class="tab">
				<el-form :label-position="labelPosition" label-width="80px" :model="list" class="tabb">

					<el-form-item label="通知">
						<el-input v-model="list.informContent" placeholder="内容"></el-input>
					</el-form-item>
					<el-button type="primary" @click="submit">添加</el-button>
					<!--<el-button type="danger" @click="reset">重置</el-button>-->
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import xinyong from './xinyong'
	import URL from '../urlConfig'
	import axios from '../ajax'
	import $http from 'axios'
	import * as Cookies from 'tiny-cookie'
	export default {
		components: {
			xinyong
		},
		data() {
			return {
				labelPosition: 'top', //表格定位
				flag: false,
				addFlag: false,
				tableFlag: false,
				tableData: [], //表格当前页数据                
				pagesize: 3, //默认每页数据量               
				currentPage: 1, //当前页码              
				totalCount: 1, //默认数据总数
				list: {
					informContent: '', //内容
				},
				id: '',
				checkData: [],
			}
		},
		methods: {
			/*
			 * params: val选中的数据，数组
			 * return: 无
			 * function: 多选框选中
			 * */
			deleteAll() {
				let ths = this;
				this.$layer.confirm('确认删除', {
					btn: ['确定', '取消']
				}, function() {
					if(ths.checkData.length == 0) {
						ths.$message('请选择要删除的数据');
						ths.$layer.closeAll();
						return;
					}
					var idArr = [];
					ths.checkData.forEach(function(item, i) {
						idArr.push(item.id);
					});
					var ids = idArr.join(',');

					axios.post(URL.delInform, {
							ids: ids,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$layer.msg("删除成功");
								ths.dongtai();
							}
						})
						.catch(err => {
							console.log(err)
						})

				}, function() {
					ths.$layer.closeAll();
				})

			},
			/*
			 * params: val选中的数据，数组
			 * return: 无
			 * function: 多选框选中
			 * */
			handleSelectionChange(val) {
				this.checkData = val;

			},

			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			addContent() {
				this.addFlag = true;
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			clearList() {
				this.list['informContent'] = '';
				this.flag = false;
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			update() {
				axios.post(URL.updInform, {
						id: this.id,
						informContent: this.list.informContent
					}).then(res => {
						if(res.data.code == 200) {
							this.$layer.msg("修改成功");
							this.flag = false;
							this.dongtai();
							this.list['informContent'] = '';
						}
					})
					.catch(err => {
						console.log(err)
					})

			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
				this.dongtai();
			},
			/*
			 * params: val
			 * return: 无
			 * function: 添加的事件
			 * */
			tianjia(val) {
				this.flag = val;
				//				this.$axios.post(URL.dongtai, {
				//						page: 1,
				//						pageSize: 20,
				//				}).then(res => {
				//						console.log(res.data)
				//						this.tabdata= res.data.map.list
				//					})
				//					.catch(err => {
				//						console.log(err)
				//					})
			},
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			del(index, row) {
				let ths = this;
				this.$layer.confirm('确认删除', {
					btn: ['确定', '取消']
				}, function() {
					axios.post(URL.delInform, {
							ids: row.id,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$layer.msg("删除成功");
								ths.dongtai();
							}
						})
						.catch(err => {
							console.log(err);
						})
				}, function() {
					ths.$layer.closeAll();
				})
			},
			/*
			 * params: x,y
			 * return: 无
			 * function: 显示编辑弹框
			 * */
			bj(x, y) {

				this.data = y;
				this.flag = !this.flag;
				axios.post(URL.getSingleInform, {
						id: y.id
					})
					.then(res => {
						if(res.data.code == 200) {
							this.list['informContent'] = res.data.flag.informContent;
							this.id = res.data.flag.id;
						}
					})
					.catch(err => {
						console.log(err);

					})
				//				this.dongtai()
			},
			/*
			 * params:无
			 * return: 无
			 * function:提交按钮事件
			 * */
			submit() {
				//				var all = false;
				//				for(var item in this.list) {
				//					if(this.list[item].length == 0) {
				//						all = true;
				//					}
				//				}
				//				if(all) {
				//					this.$layer.alert("请填写完整信息")
				//				} else {
				//				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				axios.post(URL.addInfo, this.list).then(res => {
						if(res.data.code == 200) {
							this.$layer.msg("添加成功");
							this.dongtai();
							this.list['informContent'] = '';
							this.addFlag = false;
						}
					})
					.catch(err => {
						console.log(err)
					})

			},
			/*
			 * params:无
			 * return: 无
			 * function:重置按钮事件
			 * */
			reset() {
				this.list.title = "",
					this.list.content = '',
					this.list.crtUser = ''
			},
			/*
			 * params:page:  pageSize:
			 * return: 无
			 * function:获取动态新闻的列表
			 * */
			dongtai() {
				this.tableFlag = true;
				axios.post(URL.lookData, {
						currentPage: this.currentPage,
						pageSize: this.pagesize,
					}).then(res => {
						//console.log(res.data)
						this.tableFlag = false;
						if(typeof res.data.flag == 'object') {
							this.tableData = res.data.flag
						}else{
							this.tableData = [];
						}

					})
					.catch(err => {
						this.tableFlag = false;
						console.log(err)
					})
			},
		},
		created() {
			this.dongtai();
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
	}
	
	.addBtn {
		margin-bottom: 20px;
	}
	
	.s {
		color: #9A9A9A;
		width: 100%;
		height: 60px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #DDDDDD;
		background: #3c8dbc;
	}
	
	.xg {
		height: 580px;
		width: 1000px;
		position: fixed;
		top: 0;
		left: 250px;
		background: rgb(199, 202, 204);
	}
	
	.xga {
		width: 500px;
		margin: 0 auto;
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
	}
	
	.tabb {
		width: 50%;
		margin: 0 auto;
		padding-bottom: 20px;
	}
</style>