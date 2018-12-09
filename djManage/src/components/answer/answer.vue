<!--author:王超楠
	created:2018-07-13
	effect:服务记录-->
<template>
	<div id="fuwu">
		<!--<div class="s">
			<div class="st">
				<p>答题管理</p>
			</div>
		</div>-->

		<div class="table-wrapper">
			<div class="table-name">答题管理</div>
			<el-button class="addBtn" type="danger" @click="addContent">添加题目</el-button>
			<el-button class="addBtn" type="info" @click="deleteAll">批量删除</el-button>
			<el-button class="addBtn" type="primary" @click="download">下载模板</el-button>
			<el-button class="addBtn" type="primary" @click="bj">查询题库</el-button>
			<el-button class="addBtn" type="primary" @click="eachDay">每日题目</el-button>
			<el-table v-loading="tableFlag" :data="dataTable" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="180">
				</el-table-column>
				<el-table-column prop="phone" label="手机号码" width="140">
				</el-table-column>
				<el-table-column prop="record" label="答题记录">
				</el-table-column>
				<!--<el-table-column prop="title" label="答题组数">
				</el-table-column>-->
				<el-table-column prop="" label="操作">
					<template slot-scope="scope">
						<!--<el-button size="mini" @click="bj(scope.$index, scope.row)">查询题目</el-button>-->
						<el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div align="center">
			<el-pagination @current-change="current_change" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="totalPage">
			</el-pagination>
		</div>
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="flag">
			<!--<fuwu :cdz="data" class="xga" @tianjia="tianjia"></fuwu>-->
			<el-table v-loading="tableFlag" :data="titleAll" style="width: 100%">

				<el-table-column prop="content" label="题目" width="180">
				</el-table-column>
				<el-table-column prop="answer" label="正确答案" width="140">
				</el-table-column>
				<el-table-column prop="optionA" label="选项A">
				</el-table-column>
				<el-table-column prop="optionB" label="选项B">
				</el-table-column>
				<el-table-column prop="optionC" label="选项C">
				</el-table-column>
				<el-table-column prop="optionD" label="选项D">
				</el-table-column>
				<el-table-column prop="optionE" label="选项E">
				</el-table-column>

			</el-table>
			<el-pagination @current-change="current_changes" :current-page="currentPages" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="totalPages">
			</el-pagination>

		</el-dialog>
		<el-dialog :visible.sync="addFlag" :before-close="clearList">
			<div class="tab">
				<el-form label-width="100px" :model="list" ref="list" class="tabb">
					<!--<el-form-item label="题目">
					<el-input v-model="list.title"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="list.content"> </el-input>
				</el-form-item>-->
					<el-form-item label="答题开始时间">
						<el-date-picker v-model="list.startTime" type="date" placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="答题结束时间">
						<el-date-picker v-model="list.endTime" type="date" placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="上传excel">
						<!--<el-upload :action="uploadExcel" :data="list" name="file" :limit="1" :on-remove="handleRemove" :file-list="imgList" :on-success="success" :on-exceed="limitLayer">
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :visible.sync="dialogVisible" append-to-body>
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>-->

						<el-upload class="upload-demo" drag :data="list" :action="uploadExcel" :limit="1" :on-exceed="limitLayer" :file-list="imgList" :on-success="success">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
					</el-form-item>
					<!--<el-button type="primary" @click="submit">添加</el-button>
				<el-button type="danger" @click="reset">重置</el-button>-->
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import URL from '../../urlConfig'
	import $axios from "axios";
	import axios from '../../ajax';
	export default {

		data() {
			return {
				pagesize: 5, //默认每页数据量              
				currentPage: 1, //当前页码
				currentPages: 1, //当前页码  
				totalPage: 0, //默认数据总数
				totalPages:0,
				flag: false,
				addFlag: false,
				tableFlag: false,
				dataTable: [], //服务列表
				list: {
					title: '', //题目
					content: '', //内容
					crtUser: '', //创建人
					id: '',
					startTime: '',
					endTime: '',
				},
				oldList: {},
				uploadExcel: URL.uploadExcel, // 'https://jsonplaceholder.typicode.com/posts/'//上传图片接口
				imgList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				answerInfo: {},
				titleAll: [],
				checkData: [],
			}
		},

		methods: {
			/**
			 * 
			 * 每天的题库
			 */
			
			async eachDay(){
				this.flag = true;
				const data = (await this.$axios.post(URL.allTemporaryExercises, {
					pageSize: 5,
					currentPage: this.currentPages
				})).data.flag;
				this.titleAll = data;
				this.totalPages= 5;
			},
			
			/*
			 * params: val选中的数据，数组
			 * return: 无
			 * function: 多选框选中
			 * */
			download() {
				var a = document.createElement('a');

				a.href = 'http://lddy.ysrencai.com/cms/images/有色智慧党建答题Excel表上传模板.xlsx'; // response is a blob
				a.download = ""; //文件名称

				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
				a.remove();
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
						ths.$message('请选择需要删除的数据');
						ths.$layer.closeAll();
						return;
					}

					var idArr = [];

					ths.checkData.forEach(function(item, i) {
						idArr.push(item.id);
					});
					var ids = idArr.join(',');

					axios.post(URL.delRecords, {
							ids: ids,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$layer.msg("删除成功");
								ths.initData();
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
			 * return null
			 */
			clearList() {
				this.addFlag = false;
				this.list = this.oldList;
				this.imgList = [];

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
			current_change: function(currentPage) {
				this.currentPage = currentPage;
				this.initData();
			},
			/*
			 * params:currentPage
			 * return: 无
			 * function:页码数量
			 * */
			current_changes: function(currentPage) {
				this.currentPages = currentPage;
				this.bj();
			},
			/*
			 * params:无
			 * return: 无
			 * function: 提交按钮
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
					this.$axios.post(URL.addzheng, {
							title: this.list.title,
							content: this.list.content,
							crtUser: this.list.crtUser,
						}).then(res => {
							//console.log(res.data)
							this.$layer.alert("提交成功")
							this.fagui()
						})
						.catch(err => {
							console.log(err)
						})
				}
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
				this.$message('最多上传1组');
			},
			/*
			 * params:file
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			handlePreview(file) {
				console.log(file);
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			/*
			 * params:file
			 * return: 无
			 * function: 上传图片
			 * */
			success(file) { //上传图片
				//				this.addFlag = false;
				this.list = this.oldList;

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
				this.flag = true;
				const data = (await this.$axios.post(URL.allTitle, {
					pageSize: 5,
					currentPage: this.currentPages
				})).data.flag;
				this.titleAll = data.list;
				this.totalPages= data.totalCount;
				  
			},
			/*
			 * params:index.row
			 * return: 无
			 * function:删除
			 * */
			async del(index, row) {

				try {
					await this.$axios.post(URL.delRecords, {
						ids: row.id,
					})
					await this.initData();

				} catch(err) {
					console.log(err);
				}

			},
			/*
			 * params:page: pageSize:
			 * return: 无
			 * function:服务列表
			 * */
			getData() {
				return this.$axios.post(URL.allExercisesRecord, {
					name: '',
					startTime: this.list.startTime,
					endTime: this.list.endTime,
					currentPage: this.currentPage,
					pageSize: this.pagesize,
				})
				//					.then(res => {
				//						//console.log(res.data)
				//						this.arr = res.data.map.list
				//					})
				//					.catch(err => {
				//						console.log(err)
				//					})
			},
			/*
			 * params:page: pageSize:
			 * return: 无
			 * function:服务列表
			 * */
			async initData() {

				this.list.startTime = (await axios.post(URL.getTime)).data.flag.startTime;

				this.list.endTime = (await axios.post(URL.getTime)).data.flag.endTime;
				this.tableFlag = true;
				this.answerInfo = (await this.getData()).data.flag;
				this.tableFlag = false;
				this.dataTable = this.answerInfo.list;
				this.totalPage = this.answerInfo.totalCount;
			},

		},
		/*
		 * params:page: pageSize:
		 * return: 无
		 * function:服务列表
		 * */
		async created() {
			try {
				await this.initData();
			} catch(err) {
				console.log(err);
			}
			this.oldList = JSON.parse(JSON.stringify(this.list));

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
		.addBtn {
			margin-bottom: 20px;
		}
	}
	
	.tab {
		width: 100%;
		background: white;
		padding-top: 20px;
	}
	
	.tabb {
		width: 80%;
		margin: 0 auto;
		padding-bottom: 20px;
	}
	
	.s {
		color: #9A9A9A;
		width: 100%;
		height: 60px;
		line-height: 60px;
		border-bottom: 1px solid #DDDDDD;
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