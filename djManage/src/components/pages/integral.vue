<!--author:王超楠
	created:2018-07-13
	effect:政策法规-->
<template>
	<div id="integral">
		<!--<div class="s">
			<div class="st">
				<p>支部活动列表管理</p>
			</div>
		</div>-->

		<div class="table-wrapper">
			<div class="table-name">积分列表管理</div>

			<div class="addBtn">
				<el-button type="danger" @click="addContent">添加</el-button>
				<el-button type="info" @click="deleteAll">批量删除</el-button>
				<el-input v-model="activityTitle" class="fr sousuoInput" placeHolder="请输入姓名">
					<template slot="append">
						<span @click="searchDY">搜索</span>
					</template>
				</el-input>
			</div>
			<el-table v-loading="tableFlag" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
				<!--<el-table-column prop="activityContent" label="内容" width="140"></el-table-column>-->
				<el-table-column prop="allIntegral" label="总积分"></el-table-column>
				<!--<el-table-column prop="" label="图片">
					<template slot-scope="scope">
						<div v-for="(item,index) in " :key="index">
						<img :src="scope.row.url[0]" width="100" />
						</div>
					</template>
				</el-table-column>-->
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
						<el-button size="mini" @click="bj(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" @click="look(scope.$index,scope.row)">查看</el-button>
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
			<el-form :label-position="labelPosition" label-width="100px" :model="list">
				<el-form-item label="用户：">
					<el-select v-model="list.userId" placeholder="选择用户" class="select-item">
						<el-option :label="item.name" :key="item.id" :value="item.id" v-for="(item,index) in userInfo"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="今日签到：">
					<el-select v-model="list.signIn" placeholder="选择今日是否签到" class="select-item">
						<el-option :label="item.name" :key="index" :value="item.value" v-for="(item,index) in signStatus"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签到次数：">
					<el-input v-model="list.signInNumber" placeholder="请输入连续签到次数"></el-input>
				</el-form-item>

				<el-form-item label="今日答题：">
					<el-input v-model="list.answer" placeholder="请输入答题次数"></el-input>
				</el-form-item>
				<el-form-item label="今日学习：">
					<el-input v-model="list.study" placeholder="请输入学习次数"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="edit">确认修改</el-button>
				</el-form-item>
				<!--<el-button type="danger" @click="reset">重置</el-button>-->
			</el-form>
		</el-dialog>
		<el-dialog :visible.sync="addFlag" :before-close="clearList">
			<!--<div class="tab">-->
			<el-form :label-position="labelPosition" label-width="100px" :model="list">
				<el-form-item label="用户：">
					<el-select v-model="list.userId" placeholder="选择用户" class="select-item">
						<el-option :label="item.name" :key="item.id" :value="item.id" v-for="(item,index) in userInfo"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="今日签到：">
					<el-select v-model="list.signIn" placeholder="选择今日是否签到" class="select-item">
						<el-option :label="item.name" :key="index" :value="item.value" v-for="(item,index) in signStatus"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签到次数：">
					<el-input v-model="list.signInNumber" placeholder="请输入连续签到次数"></el-input>
				</el-form-item>

				<el-form-item label="今日答题：">
					<el-input v-model="list.answer" placeholder="请输入答题次数"></el-input>
				</el-form-item>
				<el-form-item label="今日学习：">
					<el-input v-model="list.study" placeholder="请输入学习次数"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submit">添加</el-button>
				</el-form-item>
				<!--<el-button type="danger" @click="reset">重置</el-button>-->
			</el-form>
			<!--</div>-->
		</el-dialog>
		<el-dialog :visible.sync="lookFlag" :before-close="clearList">
			<el-form :label-position="labelPosition" label-width="100px" :model="list">
				<el-form-item label="用户：">
					<el-select v-model="list.userId" placeholder="选择用户" class="select-item">
						<el-option :label="item.name" :key="item.id" :value="item.id" v-for="(item,index) in userInfo"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="今日签到：">
					<el-select v-model="list.signIn" placeholder="选择今日是否签到" class="select-item">
						<el-option :label="item.name" :key="index" :value="item.value" v-for="(item,index) in signStatus"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签到次数：">
					<el-input v-model="list.signInNumber" placeholder="请输入连续签到次数"></el-input>
				</el-form-item>

				<el-form-item label="今日答题：">
					<el-input v-model="list.answer" placeholder="请输入答题次数"></el-input>
				</el-form-item>
				<el-form-item label="今日学习：">
					<el-input v-model="list.study" placeholder="请输入学习次数"></el-input>
				</el-form-item>

			</el-form>
		</el-dialog>

	</div>
</template>

<script>
	import URL from '../../urlConfig'
	import axios from '../../ajax'
	import $http from 'axios'
	import * as Cookies from 'tiny-cookie'
	let TOKEN = Cookies.get('ADMINTOKEN') || '';

	export default {

		data() {
			return {
				flag: false,
				addFlag: false,
				tableFlag: false,
				lookFlag: false,
				tableData: [], //表格当前页数据
				pagesize: 6, //默认每页数据量
				currentPage: 1, //当前页码
				totalCount: 0, //默认数据总数
				labelPosition: 'right', //表格定位
				quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示

				activityTitle: '',
				list: {
					studyTitle: '', //题目
					studyContent: '', //内容
					studyTime: '',
					url: [],
				},
				value: {

				},

				lists: {},
				upImg: URL.uploadImage,
				imgList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				myHeaders: {
					"Authorization": TOKEN
				},
				checkData: [],
				signStatus: [{
					name: '是',
					value: '1'
				}, {
					name: '否',
					value: '0'
				}],
				userInfo: {}
			}
		},
		mounted() {
			this.lists = JSON.parse(JSON.stringify(this.list));

		},
		methods: {
			onEditorChange({
				editor,
				html,
				text
			}) { //内容改变事件
				//				console.log("---内容改变事件---")
				//				this.list.activeContent = html
				//				console.log(html)
			},
			// 富文本图片上传前
			beforeUpload() {
				// 显示loading动画
				this.quillUpdateImg = true
			},

			uploadSuccess(res, file) {
				// res为图片服务器返回的数据
				// 获取富文本组件实例
				console.log(res);
				let quill = this.$refs.myQuillEditor.quill
				// 如果上传成功
				if(res.code == 200) {
					// 获取光标所在位置
					let length = quill.getSelection().index;
					// 插入图片  res.url为服务器返回的图片地址
					quill.insertEmbed(length, 'image', res.flag[0]);
					// 调整光标到最后
					quill.setSelection(length + 1)
				} else {
					this.$message.error('图片插入失败')
				}
				// loading动画消失
				this.quillUpdateImg = false
			},
			// 富文本图片上传失败
			uploadError() {
				// loading动画消失
				this.quillUpdateImg = false
				this.$message.error('图片插入失败')
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
						idArr.push(item.userId);
					});
					var ids = idArr.join(',');

					axios.post(URL.adminDelIntegral, {
							ids: ids,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$message("删除成功");
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
			 * params: x,y
			 * return: 无
			 * function: 显示编辑弹框
			 * */
			look(x, y) {
				this.lookFlag = true;

				axios.post(URL.singleIntegral, {
						userId: y.userId
					})
					.then(res => {
						if(res.data.code == 200) {

							this.list = res.data.flag;

						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
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
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */

			uploadImg: async function(id) {
				var vm = this
				vm.imageLoading = true
				var formData = new FormData($('#' + id)[0])
				try {
					const url = await vm.uploadImgReq(formData) // 自定义的图片上传函数
					if(url != null && url.length > 0) {
						var value = url
						vm.addImgRange = vm.$refs.newEditor.quill.getSelection()
						value = value.indexOf('http') != -1 ? value : 'http:' + value
						vm.$refs.newEditor.quill.insertEmbed(vm.addImgRange != null ? vm.addImgRange.index : 0, 'image', value, Quill.sources.USER)
					} else {
						vm.$message.warning("图片增加失败")
					}
					document.getElementById(vm.uniqueId).value = ''
				} catch({
					message: msg
				}) {
					document.getElementById(vm.uniqueId).value = ''
					vm.$message.warning(msg)
				}
				vm.imageLoading = false
			},
			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			handleChange(file, fileList) {

				this.imgList = fileList;

				//				if(fileList.length == 2) {
				//					this.$layer.msg("最多添加两张图片")
				//				}

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
			 * params:文件对象,文件列表
			 * return: 无
			 * function: 上传文件
			 * */
			handleRemove(file, fileList) {
				this.imgList = fileList;

			},
			/*
			 * params:file
			 * return: 无
			 * function: 上传图片
			 * */
			success(file, fileList) { //上传图片

				this.imgList.push({

				})
			},
			/*
			 * params:无
			 * return: 无
			 * function: 最多上传多少图片
			 * */
			limitLayer() {
				//				layer.msg('最多上传1张图片');
				this.$layer.alert('最多上传3张图片');
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			clearList() {
				this.flag = false;
				this.addFlag = false;
				this.lookFlag = false;
				this.list = this.lists;

			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			edit() {
				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				$http.post(URL.adminUpdIntegral, this.list, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							//							"Authorization": TOKEN
						}
					})
					.then(res => {
						if(res.data.code == 200) {
							this.flag = false;
							this.$message("修改成功");
							this.getData();

						}

					})
					.catch(err => {
						this.$layer.msg('服务错误，请稍后重试')
					})
			},

			/*
			 * params:currentPage
			 * return: 无
			 * function:页码改变数据
			 * */
			current_change: function(currentPage) {
				this.currentPage = currentPage;
				this.getData();
			},
			/*
			 * params: val
			 * return: 无
			 * function:编辑的方法
			 * */
			tianjia(val) {
				this.flag = val;
				this.$axios.post(URL.fagui, {
						page: 1,
						pageSize: 7,
					}).then(res => {
						//console.log(res.data)
						this.arr = res.data.map.list
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
				this.flag = !this.flag;

				axios.post(URL.singleIntegral, {
						userId: y.userId
					})
					.then(res => {
						if(res.data.code == 200) {
							this.list = res.data.flag;

						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
			},
			/*
			 * params: 无
			 * return: 无
			 * function: 提交按钮
			 * */
			submit() {
				var ths = this;

				let TOKEN = Cookies.get('ADMINTOKEN') || '';

				$http.post(URL.adminAddIntegral, this.list, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					})
					.then(res => {
						if(res.data.code == 200) {
							this.$layer.msg("添加成功");

							this.addFlag = false;
							this.getData();

						} else {
							this.$message(res.data.msg);
						}

					})
					.catch(err => {
						this.$layer.msg('服务错误，请稍后重试');
					})

			},
			/*
			 * params: 无
			 * return: 无
			 * function: 重置按钮
			 * */
			reset() {
				this.list.title = "",
					this.list.content = '',
					this.list.crtUser = '',
					this.list.articleSource = '',
					this.list.releaseTime = '',
					this.list.author = ''
			},
			/*
			 * params:index,row
			 * return: 无
			 * function:删除事件
			 * */
			del(index, row) {
				let ths = this;

				this.$layer.confirm('确定删除', {
					btn: ['确定', '取消']
				}, function() {
					axios.post(URL.adminDelIntegral, {
							ids: row.userId,
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
			 * params:无
			 * return: 无
			 * function: 请求法规列表
			 * */
			getData() {
				this.tableFlag = true;
				axios.post(URL.adminAllIntegral, {
						search: this.activityTitle,
						pageSize: this.pagesize,
						currentPage: this.currentPage,
					}).then(res => {
						this.tableFlag = false;
						this.tableData = res.data.flag.list;
						this.totalCount = res.data.flag.totalCount;
					})
					.catch(err => {
						this.tableFlag = false;
						console.log(err);
					})
				axios.post(URL.lookDictionary, {
						pageSize: 10000,
						currentPage: 1
					}).then(res => {

						this.userInfo = res.data.flag.list;

					})
					.catch(err => {

						console.log(err);
					})
			},

		},
		/*
		 * params:无
		 * return: 无
		 * function: 进页面的处理函数
		 * */
		created() {
			this.getData();

		}
	}
</script>

<style scoped lang="scss">
	.select-item {
		width: 100%;
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
	
	.addBtn {
		margin-bottom: 20px;
		overflow: hidden;
		.sousuoInput {
			width: 300px;
			float: right;
		}
	}
	
	.avatar-uploader {
		display: none;
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
	
	.xg {
		height: 570px;
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
	
	#activityContent {
		/*display: flex;
		justify-content: center;
		align-items: top;*/
		text-align: center;
		flex-direction: column;
		padding: 0 20px;
		min-height: 100%;
		background: #f1f1f1;
		h2 {
			line-height: 40px;
		}
		.time {
			line-height: 40px;
		}
		.content {
			line-height: 40px;
			text-indent: 32px;
			text-align: left;
		}
		.imgWrapper {
			width: 100%;
			display: flex;
			flex-direction: column;
			.img {
				margin-right: 2%;
				width: 100%;
				margin-bottom: 10px;
				.imgs {
					width: 100%;
				}
			}
			.img:last-child {
				margin-right: 0;
			}
		}
	}
</style>