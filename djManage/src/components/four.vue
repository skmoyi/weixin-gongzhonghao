<!--author:王超楠
	created:2018-07-13
	effect:新闻记录-->
<template>
	<div id="four">

		<div class="table-wrapper">
			<div class="table-name">党费支付信息管理</div>

			<div class="addBtn">
				<el-button type="danger" @click="userTable">添加缴费记录</el-button>
				<el-button type="info" @click="deleteAll">批量删除</el-button>
				<el-date-picker v-model="startTime" type="date" placeholder="选择日期">
				</el-date-picker>
				<el-date-picker v-model="endTime" type="date" placeholder="选择日期">
				</el-date-picker>
				<el-button type="danger" @click="exports">导出</el-button>
				<el-input v-model="DYname" class="fr sousuoInput" placeHolder="请输入党员姓名">
					<template slot="append">
						<span @click="searchDY">搜索</span>
					</template>
				</el-input>
			</div>
			<el-table v-loading="tableFlag" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="40">
				</el-table-column>

				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="phone" label="手机号码"></el-table-column>
				<el-table-column prop="payMethod" label="支付方式"></el-table-column>
				<el-table-column prop="userMoney" label="缴费金额"></el-table-column>
				<el-table-column prop="successFailure" label="缴费状态"></el-table-column>
				<el-table-column prop="months" label="支付时长（月）"></el-table-column>
				<el-table-column prop="payTime" label="支付时间" width="200"></el-table-column>
				<el-table-column prop="" label="操作">
					<template slot-scope="scope">
						<!--	<el-button size="mini" @click="addPay(scope.$index, scope.row)">添加缴费</el-button>-->
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
		<el-dialog :visible.sync="addFlag" :before-close="clearList">

			<el-form label-width="120px" status-icon :model="list" ref="list" class="tabb">

				<el-form-item label="缴费金额（元）">
					<el-input v-model="list.userMoney"> </el-input>
				</el-form-item>
				<el-form-item label="支付时长（月）">
					<el-input v-model="list.months"> </el-input>
				</el-form-item>

				<el-button type="primary" @click="submit">增加缴费记录</el-button>
				<!--<el-button type="danger" @click="reset">重置</el-button>-->
			</el-form>

		</el-dialog>
		<el-dialog :visible.sync="userFlag" class="DYdialog" :before-close="clearLists">

			<el-input v-model="DYnameInner" class="sousuoInput" placeHolder="请输入党员姓名">
				<template slot="append">
					<span @click="searchDYs">搜索</span>
				</template>
			</el-input>
			<el-table :data="userData" class="DYtable" v-loading="DYloading">
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="phone" label="手机号码"></el-table-column>

				<el-table-column prop="" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="addPay(scope.$index, scope.row)">添加缴费</el-button>

					</template>
				</el-table-column>
			</el-table>
			<div align="center">
				<el-pagination @current-change="current_changes" :current-page="currentPages" :page-size="pagesizes" layout="total, prev, pager, next, jumper" :total="totalCounts">
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import myLog from './log'
	import URL from '../urlConfig'
	import axios from '../ajax'
	import $axios from 'axios'
	import * as Cookies from 'tiny-cookie'
	export default {
		components: {
			myLog
		},
		data() {
			return {
				pagesize: 5, //默认每页数据量           
				pagesizes: 5,
				currentPage: 1, //当前页码 
				currentPages: 1,
				totalCount: 0, //默认数据总数
				totalCounts: 0,
				labelPosition: 'top', //表格定位
				tableFlag: false,
				DYname: '',
				list: {
					userMoney: '', //题目

				},
				arr: [], //表格默认数据
				flag: false,
				addFlag: false,
				tableData: [],
				checkData: [],
				userId: '',
				oldList: {},
				userFlag: false,
				userData: [],
				DYloading: false,
				DYnameInner: '',
				startTime: '',
				endTime: '',
			}
		},
		methods: {

			/*
			 * params:currentPage
			 * return: 无
			 * function:导出数据
			 * */

			exports() {
				if(!this.startTime || !this.endTime) {
					this.$layer.msg('请选择开始时间和结束时间');
					return;
				}

				this.$layer.msg('正在导出数据');

				this.startTime = this.formatDateTime(this.startTime).substring(0, 10);
				this.endTime = this.formatDateTime(this.endTime).substring(0, 10);

				//$axios.post(URL.downloadExcel + "?startTime=" + this.startTime + '&endTime=' + this.endTime)

				var a = document.createElement('a');

				a.href = URL.downloadExcel + "?startTime=" + this.startTime + '&endTime=' + this.endTime; // response is a blob
				a.download = ""; //文件名称

				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
				a.remove();
				this.startTime = '';
				this.endTime = '';
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			userTable() {
				this.userFlag = true;
				this.getUserData();
			},

			/*
			 * params:无
			 * return: 无
			 * function:页码数量
			 * */
			getUserData() {
				this.DYlaoding = true;

				this.$axios.post(URL.lookDictionary, {
						name: this.DYnameInner,
						currentPage: this.currentPages,
						pageSize: this.pagesizes,
					})
					.then(res => {
						if(res.data.code == 200) {
							this.DYloading = false;
							this.userData = res.data.flag.list;
							this.totalCounts = res.data.flag.totalCount;

						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			clearList() {

				this.addFlag = false;

				this.list = this.oldList;

			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			clearLists() {

				this.userFlag = false;

				this.DYnameInner = '';

			},

			/*
			 * params: val选中的数据，数组
			 * return: 无
			 * function: 多选框选中
			 * */
			addPay(index, row) {

				this.addFlag = true;

				this.userId = row.id;

			},
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

					axios.post(URL.delRecord, {
							ids: ids,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$layer.msg("删除成功");
								ths.getData();
							}
						})
						.catch(err => {
							ths.$layer.msg("请求超时，请稍后重试");
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

			/**
			 * function 查询党员
			 */

			searchDY() {

				this.getData();
			},
			/**
			 * function 查询党员
			 */

			searchDYs() {

				this.getUserData();
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页面数量
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
				this.getData();
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页面数量
			 * */
			current_changes: function(currentPage) {
				this.currentPages = currentPage;
				this.getData();
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

				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				$axios.post(URL.addUserMoney, {
						userId: this.userId,
						userMoney: this.list.userMoney,
						months: this.list.months
					}, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					}).then(res => {

						this.addFlag = false;

						this.$layer.msg('添加成功');
						console.log(this.oldList);
						this.list.userMoney = '';
						this.list.months = '';
						console.log(this.list);
						this.getData();
					})
					.catch(err => {

						console.log(err)
					})

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
				let ths = this;
				this.$layer.confirm('确认删除？', {
					btn: ['确定', '取消']
				}, function() {
					ths.$axios.post(URL.delRecord, {
							ids: row.id,
						}).then(res => {
							//console.log(res.data)
							ths.$layer.alert("删除成功");
							ths.list = ths.oldList;
							ths.getData();
							ths.$layer.closeAll();

						})
						.catch(err => {
							console.log(err)
						})
				}, function() {
					ths.$layer.closeAll();
				})
			},
			xiuxin(x, y) {
				//console.log(x)
				this.data = y;
				this.flag = !this.flag;
			},
			/*
			 * params:无
			 * return: 无
			 * function:页码数量
			 * */
			getData() {
				this.tableFlag = true;
				axios.post(URL.lookAllRecord, {
						name: this.DYname || '',
						currentPage: this.currentPage,
						pageSize: this.pagesize,
					})
					.then(res => {
						console.log(this.list);
						if(res.data.code == 200) {
							this.tableFlag = false;
							this.tableData = res.data.flag.list;
							this.totalCount = res.data.flag.totalCount;

						}
					})
					.catch(err => {
						console.log(err);
					})
			},

			formatDateTime: function(date) {
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				var minute = date.getMinutes();
				minute = minute < 10 ? ('0' + minute) : minute;
				var second = date.getSeconds();
				second = second < 10 ? ('0' + second) : second;
				return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
			},
		},

		created() {
			this.oldList = JSON.parse(JSON.stringify(this.list));

			this.getData()
		}

	}
</script>

<style scoped lang='scss'>
	.DYtable {
		margin-top: 20px;
	}
	
	.DYdialog {
		.el-dialog {
			background: #000;
		}
	}
	
	.el-form {
		text-align: center;
	}
	
	.addBtn {
		margin-bottom: 20px;
		overflow: hidden;
		.sousuoInput {
			width: 300px;
			float: right;
		}
	}
	
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