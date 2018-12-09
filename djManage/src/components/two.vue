<!--author:王超楠
	created:2018-07-13
	effect:轮播图记录-->
<template>
	<div>

		<div class="table-wrapper">
			<div class="table-name">党员信息管理</div>
			<div class="addBtn">
				<el-button type="info" @click="deleteAll">批量删除</el-button>
				<el-input v-model="DYname" class="fr sousuoInput" placeHolder="请输入党员姓名">
					<template slot="append">
						<span @click="searchDY">搜索</span>
					</template>
				</el-input>
			</div>

			<el-table :data="tableData" @selection-change="handleSelectionChange" v-loading="tableFlag">
				<!--<el-table-column prop="" label="图片" width="180">
				<template slot-scope="scope">
					<img :src="scope.row.picUrl" width="100" />
				</template>
			</el-table-column>-->
				<el-table-column type="selection" fixed width="50">
				</el-table-column>
				<el-table-column prop="auditState" label="审核状态"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="workUnit" label="工作单位"></el-table-column>
				<el-table-column prop="crtTime" label="创建时间" width='150'></el-table-column>
				<!--<el-table-column prop="nation" label="民族"></el-table-column>
				<el-table-column prop="birthDay" label="出生日期" width="120"></el-table-column>
				<el-table-column prop="education" label="学历" width="120"></el-table-column>
				<el-table-column prop="workJobs" label="工作岗位" width="120"></el-table-column>-->
				<!--<el-table-column prop="province" label="省"></el-table-column>
				<el-table-column prop="city" label="市"></el-table-column>
				<el-table-column prop="county" label="县"></el-table-column>-->

				<el-table-column prop="" label="操作" width="490">
					<template slot-scope="scope">
						<el-button size="mini" v-if="scope.row.auditState == '审核未通过' || scope.row.auditState == '未审核'" @click="audit(scope.$index, scope.row)">审核</el-button>
						<el-button size="mini" @click="bj(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
						<el-button size="mini" type="danger" @click="detail(scope.$index, scope.row)">查看党员信息详情</el-button>
						<!--<el-button size="mini" type="danger" @click="relation(scope.$index, scope.row)">党关系转换详情</el-button>-->
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
		<el-dialog :visible.sync="flag" width="60%" :before-close="clearList">
			<el-form :model="infoForm" class="main position01">
				<h2 class="title">基本信息表</h2>

				<div class="row">
					<el-form-item label="姓名：" class="left">
						<el-input v-model="infoForm.name" class="name-input" placeholder="王某某"></el-input>
					</el-form-item>
					<el-form-item class="right" label="性别：">
						<el-select v-model="infoForm.sex" class="gender">
							<el-option v-for="(item,index) in sexs" :key="index" :label="item.name" :value="item.value"></el-option>

						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="民族：">
						<el-select v-model='infoForm.nation' placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in nations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="公民身份证号:">
						<el-input v-model="infoForm.idNumber" class="cardId" placeholder="请输入身份证号码"></el-input>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="出生日期:">
						<el-date-picker v-model="infoForm.birthDay" type="date" placeholder="选择日期" class="datePicker" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="学历：">
						<el-select v-model="infoForm.education" placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in educations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>

				<div class="row">
					<el-form-item label="人员类别：">
						<el-select v-model="infoForm.category" placeholder="点击请选择" class="national">
							<el-option label="正式党员" value="正式党员"></el-option>
							<el-option label="预备党员" value="预备党员"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="工作岗位：">
						<el-select v-model="infoForm.workJobs" placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in works" :key="index" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>

				<div class="row">

					<el-form-item label="联系电话：">
						<el-input v-model="infoForm.phone" class="cardId" placeholder="请点击填写"></el-input>
					</el-form-item>

				</div>
				<div class="row">
					<el-form-item label="固定电话：">
						<el-input v-model="infoForm.fixedPhone" class="fixedPhone" placeholder="请点击填写"></el-input>
						<!--<el-input v-model="fixedPhone02" class="fixedPhone" placeholder="请点击填写"></el-input>-->
					</el-form-item>
				</div>
				<div class="row">

					<el-form-item label="家庭住址（具体到门牌号）:">
						<!--<v-distpicker type="mobile"></v-distpicker>-->
						<!--<area-select v-model="selected"></area-select>
					<area-cascader v-model="selected2"></area-cascader>-->
						{{infoForm.province}}{{infoForm.city}}{{infoForm.county}}
						<el-input v-model="infoForm.address" placeholder="点击填写详细地址"></el-input>
					</el-form-item>

				</div>
			</el-form>
			<el-form class="main position04">
				<div class="row">
					<el-form-item label="党籍状态：">
						<el-select v-model="infoForm.partyState" placeholder="点击请选择" class="national">
							<el-option label="正常" value="正常"></el-option>
							<el-option label="停止党籍" value="停止党籍"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="是否为失联党员：">
						<el-select v-model="infoForm.lostIn" placeholder="点击请选择" class="cnational">
							<el-option label="是" value="是"></el-option>
							<el-option label="否" value="否"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row" v-if="infoForm.lostIn=='是'">
					<el-form-item label="失去联系日期:">
						<el-date-picker v-model="infoForm.lostTime" type="date" placeholder="选择日期" class="datePicker" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="是否为流动党员：">
						<el-select v-model="infoForm.theFlow" placeholder="点击请选择" class="cnational">
							<el-option label="是" value="是"></el-option>
							<el-option label="否" value="否"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="工作单位名称:">
						<el-input v-model="infoForm.workUnit" class="cardId" placeholder="请点击填写"></el-input>
					</el-form-item>
				</div>
				<el-button class="modify" type="primary" @click="submit">确认修改</el-button>
			</el-form>
		</el-dialog>
		<el-dialog :visible.sync="detailFlag" width="60%" :before-close="clearList">
			<el-form :model="infoForm" class="main position01">
				<h2 class="title">基本信息表</h2>

				<div class="row">
					<el-form-item label="姓名：" class="left">
						<el-input v-model="infoForm.name" class="name-input" placeholder="王某某"></el-input>
					</el-form-item>
					<el-form-item class="right" label="性别：">
						<el-select v-model="infoForm.sex" class="gender" disabled>
							<el-option v-for="(item,index) in sexs" :key="index" :label="item.name" :value="item.value"></el-option>

						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="民族：">
						<el-select v-model='infoForm.nation' placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in nations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="公民身份证号:">
						<el-input v-model="infoForm.idNumber" class="cardId" placeholder="请输入身份证号码"></el-input>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="出生日期:">
						<el-date-picker v-model="infoForm.birthDay" type="date" placeholder="选择日期" class="datePicker">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="学历：">
						<el-select v-model="infoForm.education" placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in educations" :key="item.dicId" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>

			</el-form>
			<el-form class="main position02">
				<div class="row">
					<el-form-item label="人员类别：">
						<el-select v-model="infoForm.category" placeholder="点击请选择" class="national">
							<el-option label="正式党员" value="正式党员"></el-option>
							<el-option label="预备党员" value="预备党员"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="工作岗位：">
						<el-select v-model="infoForm.workJobs" placeholder="点击请选择" class="national">
							<el-option v-for="(item,index) in works" :key="index" :label="item.dicName" :value="item.dicId"></el-option>

						</el-select>
					</el-form-item>
				</div>
			</el-form>
			<el-form class="main position03">
				<div class="row">

					<el-form-item label="联系电话：">
						<el-input v-model="infoForm.phone" class="cardId" placeholder="请点击填写"></el-input>
					</el-form-item>

				</div>
				<div class="row">
					<el-form-item label="固定电话：">
						<el-input v-model="infoForm.fixedPhone" class="fixedPhone" placeholder="请点击填写"></el-input>
						<!--<el-input v-model="fixedPhone02" class="fixedPhone" placeholder="请点击填写"></el-input>-->
					</el-form-item>
				</div>
				<div class="row">

					<el-form-item label="家庭住址（具体到门牌号）:">
						<!--<v-distpicker type="mobile"></v-distpicker>-->
						<!--<area-select v-model="selected"></area-select>
					<area-cascader v-model="selected2"></area-cascader>-->
						{{infoForm.province}}{{infoForm.city}}{{infoForm.county}}
						<el-input v-model="infoForm.address" placeholder="点击填写详细地址"></el-input>
					</el-form-item>

				</div>
			</el-form>
			<el-form class="main position04">
				<div class="row">
					<el-form-item label="党籍状态：">
						<el-select v-model="infoForm.partyState" placeholder="点击请选择" class="national">
							<el-option label="正常" value="正常"></el-option>
							<el-option label="停止党籍" value="停止党籍"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="是否为失联党员：">
						<el-select v-model="infoForm.lostIn" placeholder="点击请选择" class="cnational">
							<el-option label="是" value="是"></el-option>
							<el-option label="否" value="否"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="失去联系日期:">
						<el-date-picker v-model="infoForm.lostTime" type="date" placeholder="选择日期" class="datePicker">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="是否为流动党员：">
						<el-select v-model="infoForm.theFlow" placeholder="点击请选择" class="cnational">
							<el-option label="是" value="是"></el-option>
							<el-option label="否" value="否"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="row">
					<el-form-item label="工作单位名称:">
						<el-input v-model="infoForm.workUnit" class="cardId" placeholder="请点击填写"></el-input>
					</el-form-item>
				</div>
			</el-form>
		</el-dialog>
		<!-- 弹框部分 -->
		<el-dialog :visible.sync="relationFlag" width="60%">
			<!--<xinyong :cdz="data" class="xga" @tianjia="tianjia"></xinyong>-->
			<el-form :model="baseForm" class="main">
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
				<el-form-item label="转入组织部名称：">
					<el-input v-model="baseForm.organizationName" class="left cardId" placeholder="请点击填写"></el-input>
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
					<el-input class="cardId" v-model="baseForm.userIdNumber" placeholder="32176472341238747"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：">
					<el-input class="cardId" v-model="baseForm.userPhone" placeholder="点击填写"></el-input>
				</el-form-item>

			</el-form>

		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import swipe from './swipe'
	import URL from '../urlConfig'
	import axios from '../ajax'
	import $http from 'axios'
	import * as Cookies from 'tiny-cookie'
	export default {
		components: {
			swipe
		},
		data() {
			return {
				pagesize: 3, //默认每页数据量				
				currentPage: 1, //当前页码				
				totalCount: 0, //默认数据总数
				flag: false,
				detailFlag: false,
				relationFlag: false,
				labelPosition: 'top', //表格定位
				upImg: URL.imag, //,'https://jsonplaceholder.typicode.com/posts/'//上传图片的接口
				list: {
					picUrl: '', //图片路径
					picTypeId: '', //图片分类
					crtUser: '', //创建人
				},
				swipe: [], //轮播图的数据
				tableData: [],
				imgList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				lists: [],
				checkData: [],
				total: 0,
				DYname: '',
				tableFlag: false,
				infoForm: {
					name: '',
					sex: '',
					nation: '',
					idNumber: '',
					birthDay: '',
					education: '',
					category: '',
					workJobs: '',
					phone: '',
					fixedPhone: '',
					address: '',
					province: '',
					city: '',
					county: '',
					partyState: '',
					lostIn: '',
					lostTime: '',
					theFlow: '',
					workUnit: '',
				},
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
				sexs: [{
					name: '男',
					value: '男'
				}, {
					name: '女',
					value: '女'
				}],
				nations: [],
				educations: [],
				works: [],
				fixedPhone01: '',
				fixedPhone02: '',
			}
		},
		mounted() {

			this.getNation();
			this.getEducation();
			this.getWork();
			this.getData();
		},
		methods: {
			/**
			 * function 查询党员
			 */
			clearList() {

				this.flag = false;
				this.detailFlag = false;
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

					axios.post(URL.delParty, {
							ids: ids,
						}).then(res => {
							if(res.data.code == 200) {
								ths.$layer.closeAll();
								ths.$layer.msg("删除成功");
								ths.getData();
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
			 * function:获得工作岗位
			 * */
			getWork() {
				axios.post(URL.getWork)
					.then(res => {
						if(res.data.code == 200) {
							this.works = res.data.list
							this.works.forEach((item, index) => {
								item.dicName = item.dicName.slice(0, 11);
							})
						} else {
							this.$layer.msg(res.data.msg);
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
			 * function:获得民族信息
			 * */
			getNation() {
				axios.post(URL.getNation)
					.then(res => {
						if(res.data.code == 200) {
							this.nations = res.data.list
						}

					})
					.catch(err => {
						this.$layer.msg('请求超时，请重试');
					})
			},
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:获得学历信息
			 * */
			getEducation() {
				axios.post(URL.getEducation)
					.then(res => {
						if(res.data.code == 200) {
							this.educations = res.data.list
						} else {
							this.$layer.msg(res.data.msg);
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请重试')
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
				//console.log(x)
				axios.post(URL.getSingleOrganization, {
						id: y.organizationId,
					}).then(res => {

						if(res.data.code == 200) {
							this.baseForm = res.data.flag;
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
			},
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			detail(x, y) {

				this.detailFlag = !this.detailFlag;
				//console.log(x)
				axios.post(URL.partyMember, {
						phone: y.phone,
					}).then(res => {

						if(res.data.code == 200) {
							this.infoForm = res.data.flag || {};
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
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
					this.$confirm('确定审核通过？', '提示', {
						confirmButtonText: '审核通过',
						cancelButtonText: '审核不通过',
						type: 'info'
					}).then(() => {
						axios.post(URL.partyAudit, {
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
						axios.post(URL.partyAudit, {
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
					console.log(err);
				}

			},
			/*
			 * params:无
			 * return: 无
			 * function:页码数量
			 * */
			getData() {
				this.tableFlag = true;
				axios.post(URL.lookDictionary, {
						name: this.DYname,
						currentPage: this.currentPage,
						pageSize: this.pagesize,
					})
					.then(res => {
						if(res.data.code == 200) {
							this.tableFlag = false;
							this.tableData = res.data.flag.list;
							this.total = res.data.flag.totalCount;
							this.tableData.forEach((item, index) => {
								if(parseInt(item.auditState) == 1) {
									item.auditState = '已审核'
								} else if(parseInt(item.auditState) == 2) {
									item.auditState = '审核未通过'
								} else {
									item.auditState = '未审核'
								}
							})
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			/*
			 * params:无
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
			bj(x, y) {
				this.flag = true;
				//console.log(x)
				axios.post(URL.partyMember, {
						phone: y.phone,
					}).then(res => {

						if(res.data.code == 200) {
							this.infoForm = res.data.flag || {};
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时，请稍后重试');
					})
			},
			/*
			 * params:index.row
			 * return: 无
			 * function:删除
			 * */
			del(index, row) {
				let ths = this;
				this.$layer.confirm('确定删除', {
					btn: ['确定', '删除']
				}, function() {
					axios.post(URL.delParty, {
							ids: row.id,
						}).then(res => {
							ths.$layer.closeAll();
							ths.$layer.msg("删除成功");
							ths.getData();
						})
						.catch(err => {
							ths.$layer.msg('请求超时，请稍后重试');
						})
				}, function() {
					ths.$layer.closeAll();
				})
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
			 * params:无
			 * return: 无
			 * function: 提交按钮点击事件
			 * */
			submit() {

				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				$http.post(URL.addDetail, this.infoForm, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					})
					.then(res => {
						if(res.data.code == 200) {
							this.flag = false;
							this.$layer.msg('修改党员信息成功');
							this.getData();
						}
					})
					.catch(err => {
						this.$layer.msg('请求超时,请重试');
					})

			},
			/*
			 * params:无
			 * return: 无
			 * function: 重置按钮
			 * */
			reset() {
				this.list.title = "",
					this.list.content = '',
					this.list.crtUser = '',
					this.list.programa = '',
					this.list.programaName = ''
			},
			/*
			 * params:无
			 * return: 无
			 * function: 轮播图请求
			 * */
			swiper() {
				this.$axios.post(URL.swiper, {
						page: 1,
						pageSize: 2,
					}).then(res => {
						//console.log(res.data)
						this.arr = res.data.map.list
					})
					.catch(err => {
						console.log(err)
					})
			},

			/*
			 * params:无
			 * return: 无
			 * function: 列表请求
			 * */
			listt() {
				this.$axios.post(URL.listt, ).then(res => {
						//console.log(res.data)
						this.lists = res.data.map
					})
					.catch(err => {
						console.log(err)
					})
			},
			/*
			 * params:无
			 * return: 无
			 * function: 列表请求
			 * */
			async getUserInfo() {
				try {

					let data = (await axios.post(URL.adminMessage, {
						username: localStorage.getItem('username')
					})).data;
					if(data.code == 200) {
						this.$store.commit('getUserInfo', data.flag);
					}
				} catch(err) {
					console.log(err);
				}
			}

		},
		created() {
			this.getUserInfo();
			//this.swiper();
			//this.listt();
		}
	}
</script>
<style scoped lang='scss'>
	.clear:after {
		content: '';
		display: block;
		clear: both;
	}
	
	.el-form {
		text-align: center;
		.modify {
			margin-top: 20px;
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
		.addBtn {
			margin-bottom: 20px;
			overflow: hidden;
			.sousuoInput {
				width: 300px;
				float: right;
			}
		}
	}
	
	.el-select {
		float: right;
	}
	
	.el-date-editor {
		float: right;
	}
	
	.tab {
		width: 100%;
		background: white;
		height: 600px;
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
		height: 600px;
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
	
	.main {
		color: #fff;
		.el-form-item {
			.el-form-item__label {
				color: #fff;
			}
		}
	}
	
	.el-input__suffix {
		right: -7px;
	}
	
	.weui-cells {
		width: 100%;
		font-size: 1.1rem;
		line-height: 40px;
		padding: 0;
		.weui-cell {
			padding: 0;
		}
	}
	
	.weui-cells:before {
		border-top: none;
	}
	/*.weui-cells:after {
			border: 1px solid #ccc;
		}*/
	
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
		font-size: 1.3rem;
		overflow: hidden;
		margin: 0 auto;
		.title {
			text-align: center;
			line-height: 50px;
			color: #333;
		}
		.el-form-item {
			margin-top: 10px;
			overflow: hidden;
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
				width: 70%;
			}
			.gender {
				width: 80%;
			}
			.cardId {
				width: 70%;
			}
			.national {
				width: 70%;
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