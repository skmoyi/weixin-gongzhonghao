<!--author:王超楠
	created:2018-07-13
	effect:信用动态记录-->
<template>
	<div id="fuwu">
		<!--<div class="s">
			<div class="st">
				<p>工资列表管理</p>
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
			<div class="table-name">工资列表管理</div>

			<div class="addBtn">
				<el-button type="info" @click="deleteAll">批量删除</el-button>
				<el-input v-model="DYname" class="fr sousuoInput" placeHolder="请输入党员名">
					<template slot="append">
						<span @click="searchDY">搜索</span>
					</template>
				</el-input>
			</div>
			<el-table v-loading="tableFlag" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="userName" label="姓名" width="130">
				</el-table-column>
				<el-table-column prop="workUnit" label="单位名称" width="130">
				</el-table-column>
				<el-table-column prop="duesPay" label="收入" width="130">
				</el-table-column>
				<el-table-column prop="auditState" label="审核状态" width="130">
				</el-table-column>
				<el-table-column prop="" label="工资详情">
					<template slot-scope="scope">
						<div @click="detailImage(item)" v-for="(item,index) in scope.row.url" :key="index" class="image-wrapper">
							<img class="pay-image" :src="item" width="100" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="" label="操作" width="260">
					<template slot-scope="scope">
						<el-button size="mini" v-if="scope.row.auditState == '审核未通过' || scope.row.auditState == '未审核'" @click="audit(scope.$index, scope.row)">审核</el-button>
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
		<el-dialog :visible.sync="flag" :before-close="clearData">
			<div class="tabList">
				<el-input v-model="duesPay" placeholder="请填写工资收入"></el-input>
				<div class="pay" type='textarea' placeholder="上传凭证，如社保缴费信息等" :rows="13">

					<div v-if="imgArr.length==0" class="tip">上传凭证，如社保缴费信息等</div>
					<div class="imgWrapper" v-for="(imgs,index) in imgArr" :key="index">
						<i class="el-icon-circle-close-outline" @click="delImage(index)"></i>
						<img class="img" :src="imgs" alt="" />
					</div>
				</div>
				<div v-if="imgArr.length<5" class="uploadSalary" @click="uploadImages">
					<i class="el-icon-plus"></i>
				</div>

				<input type="file" ref="file" value="" id="file" @change="uploadConfig" accept="image/*" multiple="multiple" style="display:none">

				<div class="annotation">注：工资一旦填好后，一年后才可更改</div>
				<el-button @click="beforeSubmit" class="submit" round>确认修改</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="imageFlag" :before-close="clearData">
			<div class="image-wrapper">

				<img class="image-inner" :src="imageSrc" />

			</div>

		</el-dialog>
	</div>
</template>

<script>
	import xinyong from './xinyong'
	import URL from '../urlConfig'
	import axios from '../ajax'
	import * as Cookies from 'tiny-cookie'
	import $http from 'axios'
	export default {
		components: {
			xinyong
		},
		data() {
			return {
				labelPosition: 'top', //表格定位
				flag: false,
				tableFlag: false,
				tableData: [], //表格当前页数据                
				pagesize: 3, //默认每页数据量               
				currentPage: 1, //当前页码              
				totalCount: 0, //默认数据总数
				list: {
					title: '', //题目
					content: '', //内容
					crtUser: '', //创建人
				},
				duesPay: '',
				id: '',
				checkData: [],
				DYname: '',
				imgArr: [],
				files: [],
				upImg: URL.uploadImages,
				imageSrc: '', //圖片詳情
				imageFlag: false, //是否展示圖片
			}
		},
		methods: {

			/**
			 * 
			 * 查看圖片詳情
			 */

			detailImage(src) {
				this.imageSrc = src;

				this.imageFlag = true;
			},

			submit() {
				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				const vm = this;
				$http.post(URL.updDuesPay, {
						id: this.id,
						duesPay: this.duesPay,
						url: this.imgSrc
					}, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					})
					.then(res => {
						if(res.data.code == 200) {
							this.$layer.msg('修改工资成功');
							vm.getData();
							vm.flag = false;
							vm.duesPay = '';
							vm.imgArr = [];
							vm.num = 1;
							// this.$router.push({
							// 	name: 'index'
							// })
						} else {
							this.$layer.msg(res.data.msg);
						}
					})
					.catch(err => {
						console.log(err);

					})
			},

			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			beforeSubmit() {
				let TOKEN = Cookies.get('ADMINTOKEN') || '';

				let formData = new FormData();

				this.files.forEach((file, index) => {
					formData.append('file', file);
				})

				let config = {

					headers: {
						"Content-Type": "multipart/form-data",
						"Authorization": TOKEN
					}

				};
				let vm = this;
				$http.post(this.upImg, formData, config).then(function(res) {
						if(res.data.code == 200) {
							vm.imgSrc = res.data.flag || [];
							vm.submit();
							// console.log(vm.duesPay)

						}

					})
					.catch(err => {
						console.log(err);
					})
			},

			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			uploadConfig(e) {
				this.files = Array.from(e.target.files);
				Array.from(e.target.files).forEach((file, index) => {
					this.readFile(file);
				})
				//				this.readFile(e.target.files[0]);
				return;

			},

			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			uploadImages() {
				this.$refs.file.click();
			},

			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			readFile(file) {
				var ths = this;
				var reader = new FileReader();

				reader.onload = function(e) {
					//					console.log(reader.result);
					//					console.log(e.target.result);
					//					ths.testImage = reader.result;
					ths.imgArr.push(e.target.result);
					//					console.log(ths.imgArr);
				};

				reader.readAsDataURL(file);
			},

			/**
			 * 
			 * 
			 * function 删除图片
			 */
			delImage(index) {
				this.imgArr.splice(index, 1);
				this.files.splice(index, 1);
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

					axios.post(URL.delDuesPay, {
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
			audit(index, row) {

				try {
					let ths = this;

					this.$confirm('确定审核通过？', '提示', {
						confirmButtonText: '审核通过',
						cancelButtonText: '审核不通过',
						type: 'info'
					}).then(() => {
						axios.post(URL.updAuditState, {
								ids: row.id,
								auditState: 1
							}).then(res => {

								if(res.data.code == 200) {

									ths.$message("审核通过");
									ths.getData();
								}
							})
							.catch(err => {
								console.log(err);
							})
					}).catch(() => {
						axios.post(URL.updAuditState, {
								ids: row.id,
								auditState: 2
							}).then(res => {

								if(res.data.code == 200) {

									ths.$message("审核未通过");
									ths.getData();
								}
							})
							.catch(err => {
								console.log(err);
							})
					});
				} catch(err) {
					console.log(err)
				}

			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			clearData() {
				this.flag = false;
				this.imageFlag = false;
				this.imageSrc = '';
				this.duesPay = '';
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			update() {

				axios.post(URL.updDuesPay, {
						id: this.id,
						duesPay: this.duesPay
					})
					.then(res => {
						if(res.data.code == 200) {
							this.$layer.msg('工资修改成功');
							this.flag = false;
						} else {
							this.$layer.msg(res.data.msg);
						}
					})
					.catch(err => {
						this.$layer.msg('请求失败，请稍后');
					})
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
				axios.post(URL.delDuesPay, {
						ids: row.id,
					}).then(res => {

						if(res.data.code == 200) {
							this.$layer.msg("删除成功");
							this.getData();
						}
					})
					.catch(err => {
						this.$layer.msg('网络错误，请稍后重试');
					})
			},
			/*
			 * params: x,y
			 * return: 无
			 * function: 显示编辑弹框
			 * */
			bj(x, y) {
				this.id = y.id;
				this.flag = !this.flag;
				axios.post(URL.singleDuesPay, {
						id: y.id
					})
					.then(res => {
						if(res.data.code == 200) {
							this.duesPay = res.data.flag.duesPay;
							this.imgArr = res.data.flag.url || [];
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})

			},
			/*
			 * params:无
			 * return: 无
			 * function:提交按钮事件
			 * */
			//			submit() {
			//				var all = false;
			//				for(var item in this.list) {
			//					if(this.list[item].length == 0) {
			//						all = true;
			//					}
			//				}
			//				if(all) {
			//					this.$layer.alert("请填写完整信息")
			//				} else {
			//					this.$axios.post(URL.addxin, {
			//							title: this.list.title,
			//							content: this.list.content,
			//							crtUser: this.list.crtUser,
			//						}).then(res => {
			//							this.dongtai();
			//							this.$layer.alert("提交成功")
			//						})
			//						.catch(err => {
			//							console.log(err)
			//						})
			//				}
			//			},
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
			getData() {
				this.tableFlag = true;
				axios.post(URL.allDuesPay, {
						name: this.DYname,
						pageSize: this.pagesize,
						currentPage: this.currentPage,
					}).then(res => {
						//console.log(res.data)
						this.tableFlag = false;
						this.tableData = res.data.flag.list;
						this.totalCount = res.data.flag.totalCount;
						this.tableData.forEach((item, index) => {
							if(parseInt(item.auditState) == 1) {
								item.auditState = '已审核'
							} else if(parseInt(item.auditState) == 2) {
								item.auditState = '审核未通过'
							} else {
								item.auditState = '未审核'
							}
						})
					})
					.catch(err => {
						this.tableFlag = false;
						console.log(err)
					})
			},
		},
		created() {
			this.getData();
		}
	}
</script>

<style scoped lang="scss">
	.el-dialog {
		.image-wrapper {
			width: 600px;
			height: 600px;
			margin: 0 auto;
			.image-inner {
				width: 100%;
				height: 100%;
			}
		}
		.tabList {
			position: relative;
			.pay-mounth {
				margin-bottom: 20px;
			}
			.jisuan {
				font-size: 12px;
				margin-top: 10px;
				color: #9f9f9f;
			}
			.uploadSalary {
				width: 60px;
				height: 60px;
				border: 1px dotted #ccc;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				bottom: 126px;
				left: 16px;
			}
			.pay {
				margin-top: 5%;
				height: 280px;
				border: 1px solid #ccc;
				padding: 0 10px;
				.tip {
					color: #b3b3b3;
					margin-top: 10px;
				}
				.imgWrapper {
					height: 60px;
					width: 60px;
					margin-right: 3%;
					margin-top: 10px;
					float: left;
					position: relative;
					.el-icon-circle-close-outline {
						position: absolute;
						top: 0;
						right: 0;
						font-size: 26px;
					}
					.img {
						display: inline-block;
						width: 100%;
						height: 100%;
					}
				}
			}
			.annotation {
				font-size: 0.8rem;
				line-height: 2.5rem;
				color: #8b8b8b;
			}
			.submit {
				width: 100%;
				background: #e53a1e;
				color: #fff;
				margin-top: 5%;
			}
			.getPay {
				width: 100%;
				background: #e53a1e;
				color: #fff;
			}
			.showPay {
				height: 20rem;
				position: relative;
				.title {
					color: #e53d1e;
					line-height: 4rem;
					font-size: 12px;
				}
				.amount {
					font-size: 12px;
					color: #505050;
					.money {
						font-size: 18px;
						color: #e53d1e;
					}
				}
				.goPay {
					position: absolute;
					bottom: 129px;
					width: 100%;
					background: #e53a1e;
					color: #fff;
				}
			}
		}
	}
	
	.pay {
		margin-top: 20px;
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
	
	.image-wrapper {
		width: 40px;
		height: 40px;
		.pay-image {
			width: 100%;
			height: 100%;
		}
	}
	
	.addBtn {
		margin-bottom: 20px;
		overflow: hidden;
		.sousuoInput {
			width: 300px;
			float: right;
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
</style>