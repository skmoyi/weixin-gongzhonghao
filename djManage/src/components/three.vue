<!--author:王超楠
	created:2018-07-13
	effect:服务记录-->
<template>
	<div id="fuwu">
		<!--<div class="s">
			<div class="st">
				<p>管理员列表</p>
			</div>
		</div>-->

		<div class="table-wrapper">
			<div class="table-name">管理员列表</div>
			<el-button class="addBtn" type="danger" @click="addContent">添加管理员</el-button>
			<el-button class="addBtn" type="info" @click="deleteAll">批量删除</el-button>
			<el-table v-loading="tableFlag" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<!--<el-table-column prop="" label="图片" width="180">
				<template slot-scope="scope">
					<img :src="scope.row.picUrl" width="100" />
				</template>
			</el-table-column>-->
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="name" label="管理员名称">
				</el-table-column>
				<el-table-column prop="username" label="用户名">
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
		<!--<div align="center">
			<el-pagination @current-change="current_change" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="arr.length">
			</el-pagination>
		</div>-->
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="flag" :before-close="clearList">
			<el-form label-width="100px" status-icon :rules="rules" :model="list" ref="list" class="tabb">

				<el-form-item label="管理员名称">
					<el-input v-model="list.name"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="list.username"> </el-input>
				</el-form-item>
				<el-form-item label="输入密码" prop="password">
					<el-input type="password" v-model="list.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="list.checkPass"></el-input>
				</el-form-item>

				<el-button type="primary" @click="modify">确定修改</el-button>
			</el-form>
		</el-dialog>

		<el-dialog :visible.sync="addFlag" :before-close="clearList">
			<div class="tab">
				<el-form label-width="100px" status-icon :rules="rules" :model="list" ref="list" class="tabb">
					<el-form-item label="管理员名称">
						<el-input v-model="list.name"></el-input>
					</el-form-item>
					<el-form-item label="用户名">
						<el-input v-model="list.username"> </el-input>
					</el-form-item>
					<el-form-item label="输入密码" prop="password">
						<el-input type="password" v-model="list.password"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="list.checkPass"></el-input>
					</el-form-item>

					<!--<el-form-item label="上传图片">
					<el-upload :action="upImg" name="file" :limit="1" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="imgList" :on-success="success" :on-exceed="limitLayer" list-type="picture-card">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" append-to-body>
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>-->
					<el-button type="primary" @click="submit">创建管理员</el-button>
					<!--<el-button type="danger" @click="reset">重置</el-button>-->
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import fuwu from './fuwu'
	import URL from '../urlConfig'
	import $http from "axios";
	import $axios from '../ajax';
	import * as Cookies from 'tiny-cookie';
	import crypto from 'crypto'
	export default {
		components: {
			fuwu
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(this.list.checkPass !== '') {
						this.$refs.list.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.list.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				pagesize: 3, //默认每页数据量              
				currentPage: 1, //当前页码                
				totalCount: 0, //默认数据总数
				flag: false,
				tableFlag: false,
				addFlag: false,
				tableData: [], //服务列表
				list: {
					name: '', //题目
					username: '', //内容
					password: '', //创建人
					checkPass: '',
				},
				oldList: {},
				lists: {},
				upImg: URL.imag, // 'https://jsonplaceholder.typicode.com/posts/'//上传图片接口
				imgList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				rules: {
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
				},
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

					$axios.post(URL.delAdmin, {
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
				this.flag = false;
				this.addFlag = false;
				this.list = {};
				this.$refs['list'].resetFields();
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			async modify() {
				try {

					if(this.list.name == '') {
						this.$message('请输入管理员名称');
						return;
					}
					if(this.list.username == '') {
						this.$message('请输入登陆名');
						return;
					}
					this.list.password = this.setMd5(this.list.password);
					this.list.checkPass = this.setMd5(this.list.checkPass);

					if(this.list.password == this.list.checkPass) {
						let TOKEN = Cookies.get('ADMINTOKEN') || '';
						let data = (await $http.post(URL.modifyAdmin, this.list, {
							dataType: "JSON",
							headers: {
								"Content-Type": "application/json;charsetset=UTF-8",
								"Authorization": TOKEN
							}
						})).data;
						if(data.code == 200) {
							this.flag = false;
							this.$layer.msg('添加成功');

							this.list = this.oldList;
							this.$refs['list'].resetFields();
							this.getData();
						} else {
							this.$layer.msg('添加失败');
						}
					} else {
						this.$layer.msg('请填写一致的密码');
					}

				} catch(err) {
					console.log(err);
				}
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
			},
			/*
			 * params:无
			 * return: 无
			 * function: 提交按钮
			 * */
			async submit() {
				try {
					var all = false;
					for(var item in this.list) {
						if(this.list[item].length == 0) {
							all = true;
						}
					}
					if(all) {
						this.$message("请填写完整信息");
					} else {

						this.list.password = this.setMd5(this.list.password);
						this.list.checkPass = this.setMd5(this.list.checkPass);
						if(this.list.password == this.list.checkPass) {
							let TOKEN = Cookies.get('ADMINTOKEN') || '';
							let data = (await $http.post(URL.addAdmin, this.list, {
								dataType: "JSON",
								headers: {
									"Content-Type": "application/json;charsetset=UTF-8",
									"Authorization": TOKEN
								}
							})).data;
							if(data.code == 200) {
								this.$message('添加成功');
								this.addFlag = false;
								this.list = {};
								this.$refs['list'].resetFields();
								this.getData();
							} else {
								this.$layer.msg('添加失败');
							}
						} else {
							this.$layer.msg('请填写一致的密码');
						}

					}
				} catch(err) {
					console.log(err);
				}
				//						.then(res => {
				//							//console.log(res.data)
				//							this.$layer.alert("提交成功")
				//							this.fagui()
				//						})
				//						.catch(err => {
				//							console.log(err)
				//						})

			},

			/*
			 * params: 无
			 * return: 无
			 * function: 重置按钮
			 * */
			reset() {
				this.list.title = "",
					this.list.content = '',
					this.list.crtUser = ''
			},
			/*
			 * params:文件对象,文件列表
			 * return: 无
			 * function: 上传文件
			 * */
			handleRemove(file, fileList) {
				var arr = [];
				fileList.forEach((item, i) => {
					arr.push({
						url: item.url
					})
				})
				this.imgList = arr;
			},
			/*
			 * params:无
			 * return: 无
			 * function: 最多上传多少图片
			 * */
			limitLayer() {
				//				layer.msg('最多上传1张图片');
				this.$layer.alert('最多上传1张图片')
			},
			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			handlePreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			/*
			 * params:file
			 * return: 无
			 * function: 上传图片
			 * */
			success(file) { //上传图片
				this.imgList.push({
					url: file.picUrl || ''
				})
			},
			/*
			 * params: val
			 * return: 无
			 * function:添加的方法
			 * */
			tianjia(val) {
				this.flag = val;
			},
			/*
			 * params: x,y
			 * return: 无
			 * function: 显示编辑弹框
			 * */
			async bj(x, y) {
				try {
					this.flag = !this.flag;
					let data = (await $axios.post(URL.allAdmin, {
						id: y.id
					})).data;
					if(data.code == 200) {
						this.list = data.flag;
						this.list.id = y.id;
					} else {
						this.$layer.msg('请求用户信息失败');
					}
				} catch(err) {
					console.log(err);
				}
			},
			/*
			 * params:index.row
			 * return: 无
			 * function:删除
			 * */
			async del(index, row) {
				try {
					let ths = this;
					this.$layer.confirm('确认删除', {
						btn: ['确定', '取消']
					}, async function() {
						let data = (await $axios.post(URL.delAdmin, {
							ids: row.id,
						})).data;
						if(data.code == 200) {
							ths.$layer.closeAll();
							ths.getData();
						} else {
							ths.$layer.msg('删除失败');
						}
					}, function() {
						ths.$layer.closeAll();
					})
				} catch(err) {
					console.log(err);
				}

			},
			/*
			 * params:page: pageSize:
			 * return: 无
			 * function:服务列表
			 * */
			async getData() {
				this.tableFlag = true;

				this.tableData = (await this.$axios.post(URL.allAdmin)).data.flag;
				this.tableFlag = false;
				//					.then(res => {
				//						//console.log(res.data)
				//						this.arr = res.data.map.list
				//					})
				//					.catch(err => {
				//						console.log(err)
				//					})
			},

			/**
			 * 
			 * 加密方法
			 */
			setMd5(name) {
				var md5 = crypto.createHash("md5")
				md5.update(name) //this.pw2这是你要加密的密码
				return md5.digest('hex') //this.pw这就是你加密完的密码，这个往后台传就行了
			},
		},

		created() {
			this.oldList = JSON.parse(JSON.stringify(this.list));

			this.getData();
			//this.imge()
		}
	}
</script>

<style scoped lang="scss">
	.el-form {
		text-align: center;
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
		}
	}
	
	.tab {
		width: 100%;
		background: white;
		padding-top: 20px;
		text-align: center;
	}
	
	.tabb {
		width: 50%;
		margin: 0 auto;
		padding-bottom: 20px;
	}
	
	.s {
		color: #9A9A9A;
		width: 100%;
		height: 60px;
		line-height: 60px;
		border-bottom: 1px solid #DDDDDD;
		border: 1px solid #DDDDDD;
		background: #3c8dbc;
	}
	
	.st {
		margin-left: 3%;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	
	.xg {
		height: 550px;
		width: 1050px;
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