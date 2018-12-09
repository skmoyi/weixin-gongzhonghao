<template>
	<div id="app">
		<div class="shang">
			<span class="title">智慧党建后台管理系统</span>
			<span class="version">V1.0.0</span>
			<span class="userName">
				<el-dropdown trigger="click">
						<span class="el-dropdown-link">~欢迎  {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>
					<div @click="modifyPass">修改密码</div>
				</el-dropdown-item>
				<el-dropdown-item>
					<div @click="logout">退出</div>
				</el-dropdown-item>
			</el-dropdown-menu>
			</el-dropdown>
			</span>
		</div>
		<el-container>

			<el-aside style="width:238px">
				<!-- 用element布局宽度必须使用行内样式方可生效 -->

				<div class="xia">
					<!--<router-link to="/one" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-mobile-phone"></span>
						<p>用户页面</p>
					</router-link>-->
					<router-link to="/two" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-xinxi"></span>
						<p>党员信息管理</p>
					</router-link>
					<router-link v-if="userInfo.id==1" to="/three" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-guanliyuan"></span>
						<p>管理员列表 </p>
					</router-link>
					<router-link to="/four" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-web-icon-"></span>
						<p>党费支付信息管理</p>
					</router-link>

					<router-link to="/seven" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-gongzi"></span>
						<p>工资列表管理</p>
					</router-link>
					<router-link to="/eight" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-zhuanhuan"></span>
						<p>组织关系转换</p>
					</router-link>
					<router-link to="/five" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-huodong"></span>
						<p>支部活动列表管理</p>
					</router-link>
					<router-link to="/study" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-xuexi"></span>
						<p>学习列表管理</p>
					</router-link>
					<router-link to="/six" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-tongzhi"></span>
						<p>系统通知列表管理</p>
					</router-link>
					<router-link to="/answer" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-datiqia"></span>
						<p>答题管理</p>
					</router-link>
					<router-link to="/integral" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-jifen"></span>
						<p>积分管理</p>
					</router-link>
					<router-link to="/logout" tag="div" class="xiaa" active-class="active">
						<span class="el-icon-dj-banshizhinan"></span>
						<p>办事指南</p>
					</router-link>
				</div>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
		<el-dialog :visible.sync="passFlag">
			<el-form label-width="100px" status-icon :model="list" ref="list" class="tabb">

				<el-form-item label="输入旧密码" prop="oldPassword">
					<el-input type="password" v-model="list.oldPassword" @blur="checkOld"></el-input>
				</el-form-item>
				<el-form-item label="输入密码" prop="password">
					<el-input type="password" v-model="list.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="list.checkPass"></el-input>
				</el-form-item>

				<el-button type="primary" @click="modify">确定修改</el-button>
				<!--<el-button type="danger" @click="reset">重置</el-button>-->
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import URL from '../urlConfig'
	import * as Cookies from 'tiny-cookie'
	import $http from 'axios'
	import crypto from 'crypto'

	export default {
		name: 'App',
		data() {
			return {
				list: {
					oldPassword: '',
					password: '',
					checkPass: '',
				},
				passFlag: false,
				oldTrue: false,
				oldList: {},
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		mounted() {
			try {
				let TOKEN = Cookies.get('ADMINTOKEN') || '';
				if(!TOKEN) {
					this.$router.push({
						name: 'login'
					})
				}
			} catch(err) {
				console.log(err)
			}
			this.list.id = this.userInfo.id;
			this.oldList = JSON.parse(JSON.stringify(this.list));
			//			console.log(this.oldList);

		},
		methods: {
			/**
			 * 
			 * function 修改密碼
			 */
			async modify() {

				if(!this.oldTrue) {
					this.$message('请输入正确的旧密码');
					return;
				}
				console.log(this.list.password == this.list.checkPass);
				this.list.password=this.setMd5(this.list.password);
				this.list.checkPass=this.setMd5(this.list.checkPass);
				if(this.list.password == this.list.checkPass) {
					let TOKEN = Cookies.get('ADMINTOKEN') || '';
					let data = (await $http.post(URL.modifyAdmin, this.list, {
						dataType: "JSON",
						headers: {
							"Content-Type": "application/json;charsetset=UTF-8",
							"Authorization": TOKEN
						}
					})).data;
					console.log(data);
					if(data.code == 200) {
						this.passFlag = false;
						this.$layer.msg('修改成功');
						this.list = this.oldList;

					} else {
						this.$layer.msg('添加失败');
					}
				} else {
					this.$layer.msg('请填写一致的密码');
				}

			},

			/**
			 * 
			 * function 判断旧密码
			 */
			async checkOld() {
				this.list.oldPassword=this.setMd5(this.list.oldPassword);
				let data = (await this.$axios.post(URL.findById, {
					id: this.userInfo.id,
					password: this.list.oldPassword
				})).data;
				console.log(data.flag);
				if(data.flag) {
					this.oldTrue = true;
				} else {
					this.oldTrue = false;
					this.$message('请输入正确的原密码');
				}

			},

			/**
			 * 
			 * function 修改密码
			 */
			modifyPass() {
				this.passFlag = true;
			},

			/**
			 * 
			 * 
			 * 
			 */
			async logout() {

				Cookies.remove('ADMINTOKEN');
				this.$router.push({
					path: '/login'
				});

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
		}
	}
</script>

<style scoped lang="scss">
	html,
	body {
		width: 100%;
		height: 100%;
	}
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		width: 100%;
		height: 100%;
		.el-aside {
			width: 200px;
			background: #222d32;
		}
	}
	
	.tabb {
		text-align: center;
	}
	
	.el-dropdown-link {
		color: #fff;
	}
	
	.s {
		color: #fff;
		width: 100%;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #DDDDDD;
		background: #e53a1e;
	}
	
	.st {
		margin-left: 3%;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	
	.el-container {
		width: 100%;
		height: calc(100% - 60px);
	}
	
	.el-aside {
		height: 100%;
	}
	
	.shang {
		/*display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;*/
		font-size: 24px;
		background: #e53a1e;
		color: #fff;
		height: 60px;
		line-height: 60px;
		overflow: hidden;
		.title {
			text-align: left;
			padding-left: 32px;
		}
		.version {
			font-size: 12px;
		}
		.userName {
			float: right;
			font-size: 16px;
			margin-right: 20px;
		}
	}
	
	.shang p {
		width: 100%;
		margin: 5px 0;
	}
	
	.xia {
		padding-left: 15%;
		padding-right: 15%;
		font-size: 14px;
		color: #fff;
	}
	
	.xia .xiaa {
		width: 100%;
		margin-top: 20px;
		line-height: 30px;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		cursor: pointer;
	}
	
	.xia .xiaa span {
		font-size: 16px;
		margin-right: 10px;
		font-weight: bold;
	}
	
	.active {
		color: #EB5E28;
		background: #fff;
		border-radius: 20px;
		.el-icon-dj-yonghu,
		.el-icon-dj-xinxi,
		.el-icon-dj-web-icon-,
		.el-icon-dj-huodong,
		.el-icon-dj-tongzhi,
		.el-icon-dj-gongzi,
		.el-icon-dj-zhuanhuan,
		.el-icon-dj-datiqia,
		.el-icon-dj-yonghu,
		.el-icon-dj-guanliyuan,
		.el-icon-dj-xuexi,
		.el-icon-dj-jifen,
		.el-icon-dj-banshizhinan {
			color: #EB5E28
		}
	}
	
	.el-main {
		margin: 0;
		padding: 0;
		background: #f5f5f5;
	}
</style>