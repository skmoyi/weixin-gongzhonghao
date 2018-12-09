<!--author:王超楠
	created:2018-07-13
	effect:信用动态记录-->
<template>
	<div id="fuwu">
		<!--<div class="s">
			<div class="st">
				<p>组织关系转换</p>
			</div>
		</div>-->
		<!--<div class="tab">
			<el-form :label-position="labelPosition" label-width="80px" :model="list" class="tabb">
				<el-form-item label="题目">
					<el-input v-model="list.title" placeholder="题目"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="list.content" placeholder="内容"></el-input>
				</el-form-item>
				<el-form-item label="创建人">
					<el-input v-model="list.crtUser" placeholder="创建人"></el-input>
				</el-form-item>
				<el-button type="primary" @click="submit">添加</el-button>
				<el-button type="danger" @click="reset">重置</el-button>
			</el-form>
		</div>-->
		<div class="table-wrapper">
			<div class="table-name">组织关系转换</div>

			<div class="addBtn">
				<el-button type="info" @click="deleteAll">批量删除</el-button>
				<el-input v-model="DYname" class="fr sousuoInput" placeHolder="请输入党员名">
					<template slot="append">
						<span @click="searchDY">搜索</span>
					</template>
				</el-input>
			</div>
			<el-table v-loading="tableFlag" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="organizationName" label="党委名称" width="140">
				</el-table-column>
				<el-table-column prop="secondaryName" label="基层支部名称" width="140">
				</el-table-column>
				<el-table-column prop="userName" label="姓名" width="140">
				</el-table-column>
				<!--<el-table-column prop="userAge" label="性別">
				</el-table-column>-->
				<!--<el-table-column prop="userSex" label="年龄">
				</el-table-column>
				<el-table-column prop="userNation" label="民族">
				</el-table-column>-->
				<!--<el-table-column prop="userCategory" label="是否为正式党员">
				</el-table-column>-->
				<!--<el-table-column prop="userIdNumber" label="身份证号">
				</el-table-column>-->
				<el-table-column prop="userPhone" label="联系电话">
				</el-table-column>
				<el-table-column prop="whetherSucceed" label="审核状态">
				</el-table-column>
				<el-table-column prop="" label="操作" width="370">
					<template slot-scope="scope">
						<el-button size="mini" v-if="scope.row.whetherSucceed=='审核未通过' || scope.row.whetherSucceed=='未审核'" @click="audit(scope.$index, scope.row)">审核</el-button>
						<el-button size="mini" @click="bj(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
						<el-button size="mini" type="danger" @click="relation(scope.$index, scope.row)">党员关系转换详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div align="center">
			<el-pagination @current-change="current_change" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="flag">
			<!--<xinyong :cdz="data" class="xga" @tianjia="tianjia"></xinyong>-->
			<el-form :model="baseForm" class="main">
				<div class="clear">
					<el-form-item class="left" label="姓名:">
						<el-input v-model="baseForm.userName" id="nameLeft" placeholder="王某某"></el-input>
					</el-form-item>
					<el-form-item class="right" label="性別：">
						<el-select v-model="baseForm.userSex">
							<el-option label="男" value="男"></el-option>
							<el-option label="女" value="女"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="党委名称：">
					<el-input v-model="baseForm.organizationName" class="left" placeholder="请点击填写"></el-input>
				</el-form-item>
				<el-form-item label="基层支部名称：">
					<el-input v-model="baseForm.secondaryName" class="left" placeholder="请点击填写"></el-input>
				</el-form-item>

				<el-form-item label="年龄：">
					<el-input v-model="baseForm.userAge" placeholder="请点击填写"></el-input>
				</el-form-item>
				<el-form-item label="民族：">
					<el-select v-model='baseForm.userNation' placeholder="点击请选择" class="national">
						<el-option v-for="(item,index) in nations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

					</el-select>
				</el-form-item>
				<el-form-item label="是否为正式党员：">
					<el-select v-model="baseForm.userCategory">
						<el-option label="是" value="是"></el-option>
						<el-option label="否" value="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证号：">
					<el-input v-model="baseForm.userIdNumber" placeholder="请输入身份证号码"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input v-model="baseForm.userPhone" placeholder="点击填写"></el-input>
				</el-form-item>
				<el-button type="primary" @click="submit">确认修改</el-button>
			</el-form>

		</el-dialog>
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="relationFlag" width="60%">

			<!--<xinyong :cdz="data" class="xga" @tianjia="tianjia"></xinyong>-->
			<el-form :model="baseForm" class="main">
				<h2 class="title">党员关系转换详情</h2>
				<div class="clear">
					<el-form-item class="left" label="姓名:">
						<el-input v-model="baseForm.userName" id="nameLeft" class="name-inputs" placeholder="王某某"></el-input>
					</el-form-item>
					<el-form-item class="right" label="性別：">
						<el-select class="name-inputs" v-model="baseForm.userSex">
							<el-option label="男" value="男"></el-option>
							<el-option label="女" value="女"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="党委名称：">
					<el-input v-model="baseForm.organizationName" class="left cardId" placeholder="请点击填写"></el-input>
				</el-form-item>
				<el-form-item label="基层支部名称：">
					<el-input v-model="baseForm.secondaryName" class="left cardId" placeholder="请点击填写"></el-input>
				</el-form-item>

				<el-form-item label="年龄：">
					<el-input class="cardId" v-model="baseForm.userAge" placeholder="请点击填写"></el-input>
				</el-form-item>
				<el-form-item label="民族：">
					<el-select v-model='baseForm.userNation' placeholder="点击请选择" class="national">
						<el-option v-for="(item,index) in nations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

					</el-select>
				</el-form-item>
				<el-form-item label="是否为正式党员：">
					<el-select v-model="baseForm.userCategory" class="national">
						<el-option label="是" value="是"></el-option>
						<el-option label="否" value="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证号：">
					<el-input class="cardId" v-model="baseForm.userIdNumber" placeholder="请输入身份证号码"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input class="cardId" v-model="baseForm.userPhone" placeholder="点击填写"></el-input>
				</el-form-item>

			</el-form>

		</el-dialog>
		<el-dialog :visible.sync="auditFlag" title="确定审核通过？" width="30%">
			<el-button type="primary" @click="auditSuccess">通过审核</el-button>
			<el-button type="danger" @click="auditErr">不通过审核</el-button>
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
				tableFlag: false,
				relationFlag: false,
				tableData: [],
				pagesize: 3, //默认每页数据量               
				currentPage: 1, //当前页码              
				totalCount: 0, //默认数据总数
				list: {
					title: '', //题目
					content: '', //内容
					crtUser: '', //创建人
				},
				total: 0,
				nations: [],
				baseForm: {
					organizationName: '',
					userName: '',
					userAge: '',
					userSex: '',
					userNation: '',
					userCategory: '',
					userIdNumber: '',
					userPhone: ''
				},
				DYname: '',
				auditFlag: false,
				rowId: '',
				checkData: [],
			}
		},
		mounted() {
			this.getData();
			this.getNation();
		},
		methods: {
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			auditErr() {
				var ths = this;
				axios.post(URL.audits, {
						ids: this.rowId,
						whetherSucceed: 2
					}).then(res => {
						if(res.data.code == 200) {
							ths.auditFlag = false;
							ths.$message("审核未通过");
							ths.getData();
						}
					})
					.catch(err => {
						console.log(err);

					})
			},

			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			auditSuccess() {
				var ths = this;
				axios.post(URL.audits, {
						ids: this.rowId,
						whetherSucceed: 1
					}).then(res => {
						if(res.data.code == 200) {
							ths.auditFlag = false;
							ths.$message("审核通过");
							ths.getData();
						}
					})
					.catch(err => {
						console.log(err);

					})
			},

			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			relation(x, y) {

				this.relationFlag = !this.relationFlag;
				//				console.log(x);
				axios.post(URL.getSingleOrganization, {
						id: y.id,
					}).then(res => {

						if(res.data.code == 200) {
							this.baseForm = res.data.flag;
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
			},

			/**
			 * function 查询党员
			 */

			searchDY() {

				this.getData();
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

					axios.post(URL.delOrganization, {
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

			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			getNation() {
				axios.post(URL.getNation)
					.then(res => {
						if(res.data.code == 200) {
							this.nations = res.data.list
						}

					})
					.catch(err => {
						console.log(err);
					})
			},
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			audit(index, row) {

				try {
					let ths = this;
					this.auditFlag = true;
					this.rowId = row.id;
					//					return;
					//
					//					this.$confirm('确定审核通过？', '提示', {
					//						confirmButtonText: '审核通过',
					//						cancelButtonText: '审核不通过',
					//						type: 'info'
					//					}).then((action) => {
					//
					//					}).catch((err) => {
					//						alert(222);
					//						console.log(err);
					//						return;
					//						
					//					});

				} catch(err) {

					console.log(err);
				}

			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			getData() {

				axios.post(URL.getOrganization, {
						userName: this.DYname,
						currentPage: this.currentPage,
						pageSize: this.pagesize,

					})
					.then((res) => {
						this.loading = false;
						//						console.log(res);
						this.tableData = res.data.flag.list;
						this.total = res.data.flag.totalCount;
						this.tableData.forEach((item, index) => {

							if(parseInt(item.whetherSucceed) == 1) {
								item.whetherSucceed = '已审核'
							} else if(parseInt(item.whetherSucceed) == 2) {
								item.whetherSucceed = '审核未通过'
							} else {
								item.whetherSucceed = '未审核'
							}
						})
					})
					.catch((err) => {
						console.log(err);
					})

				// this.setHeight();
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
				this.getData();
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

				axios.post(URL.delOrganization, {
						ids: this.tableData[index].id,
					}).then(res => {

						this.$layer.msg("删除成功");
						this.getData();
					})
					.catch(err => {
						console.log(err)
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
				axios.post(URL.getSingleOrganization, {
						id: y.id
					})
					.then(res => {
						if(res.data.code == 200) {
							this.baseForm = res.data.flag;
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
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
				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				$http.post(URL.updOrganization, this.baseForm, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					}).then(res => {
						if(res.data.code == 200) {
							this.flag = false;
							this.$layer.msg('修改成功');
							this.getData();
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
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
				this.$axios.post(URL.dongtai, {
						page: 1,
						pageSize: 5,
					}).then(res => {
						//console.log(res.data)
						this.tableFlag = false;
						this.tabdata = res.data.map.list
					})
					.catch(err => {
						this.tableFlag = false;
						console.log(err)
					})
			},
		},

	}
</script>

<style lang="scss" scoped>
	.clear:after {
		content: '';
		display: block;
		clear: both;
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
		.addBtn {
			margin-bottom: 20px;
			overflow: hidden;
			.sousuoInput {
				width: 300px;
				float: right;
			}
		}
	}
	
	.main {
		background: #fff;
		.left {
			width: 50%;
			.el-form-item__content {
				width: 50%;
			}
			.el-form-item__label {
				padding: 0;
			}
			#nameLeft {
				text-align: left;
				padding: 0;
			}
		}
		.right {
			width: 50%;
			.el-select {
				width: 58%;
				.el-input {
					width: 100%;
				}
			}
		}
		.el-form-item {
			.el-select {
				width: 53%;
				float: right;
				.el-input {
					width: 100%;
				}
			}
			.el-form-item__label {
				line-height: 50px;
			}
			.el-input {
				width: 53%;
				line-height: 40px;
				float: right;
				.el-input__inner {
					border: none;
					text-align: right;
				}
			}
		}
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
	
	.bg-top {
		position: absolute;
		top: 0;
		height: 50%;
		width: 100%;
	}
	
	.position01 {
		margin: 3% auto 0;
	}
	
	.position02 {
		margin: 3% auto 0;
	}
	
	.position03 {
		margin: 3% auto 0;
	}
	
	.position04 {
		margin: 3% auto 0;
	}
	
	.submit {
		width: 90%;
		margin: 3% auto 0;
	}
	
	.password {
		width: 90%;
		color: #fff;
		margin: 3% auto;
		text-align: center;
		text-decoration: underline;
	}
	
	.main {
		width: 80%;
		background: #fff;
		border-radius: 5px;
		padding: 0 5%;
		font-size: 1.3rem;
		overflow: hidden;
		margin: 0 auto;
		.title {
			text-align: center;
			line-height: 50px;
			color: #333;
		}
		.row {
			margin-top: 10px;
			overflow: hidden;
		}
		.row:last-child {
			border-bottom: none;
		}
		.el-form-item__label {
			padding: 0;
		}
		.el-input__inner {
			background: rgba(255, 255, 255, 0);
			border: none;
			/*	border-bottom: 1px solid gray;*/
			border-radius: 0;
			height: 40px;
			line-height: 40px;
			padding: 0;
			text-align: right;
			padding-right: 14px;
		}
		.input-top {
			margin-top: 30%;
		}
		.input-bottom {
			margin-top: 4%;
		}
		.el-form-item {
			margin-bottom: 0;
			margin-top: 10px;
			overflow: hidden;
			.input-phone {
				width: 60%
			}
			.btn-phone {
				float: right;
				margin-top: 25px;
			}
			.name-input {
				width: 70%;
				.el-input__inner {
					text-align: left;
				}
			}
			.name-inputs {
				width: 80%;
				float: right;
			}
			.gender {
				width: 80%;
			}
			.cardId {
				width: 70%;
			}
			.national {
				width: 53%;
				float: right;
			}
			.cnational {
				box-sizing: border-box;
				width: 70%;
				.el-input__inner {
					padding-right: 14px;
				}
			}
			.datePicker {
				width: 70%;
			}
			.fixedPhone {
				width: 70%;
				float: right;
			}
		}
		.left {
			width: 48%;
			float: left;
		}
		.right {
			width: 50%;
			float: right;
		}
		.btn-login {
			color: red;
			background: #fff;
			border: #fff;
			width: 100%;
			margin-top: 5%;
			border: 2px solid #fff;
		}
		.btn-register {
			background: red;
			border: 2px solid #fff;
			color: #fff;
			width: 100%;
			margin-top: 4%;
		}
		.el-button+.el-button {
			margin-left: 0px;
		}
		.el-input {
			float: right;
		}
		.el-form-item__content {
			line-height: 7px;
			text-align: right;
		}
	}
</style>