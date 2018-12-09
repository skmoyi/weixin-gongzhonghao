<!--author:王超楠
	created:2018-07-13
	effect:用户页面-->
<template>
	<div id="bd">
		<!--<div class="s">
            <div class="set">
                <span class="el-icon-rank"></span>&nbsp;
                <p>Stats</p>
            </div>
            <div class="set">
                <span class="el-icon-info"></span>&nbsp;
                <p>5 Notifications</p>&nbsp;
                <span class="el-icon-caret-bottom"></span>
            </div>
            <div class="set">
                <span class="el-icon-setting"></span>&nbsp;
                <p>Setting</p>
            </div>
        </div>-->
		<img class="manage-logo" src="../assets/manage-logo.png" alt="" />
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
			<el-form-item style="margin-left: -20px;">
				<el-input placeholder="用户名" v-model.number="ruleForm2.username"></el-input>
			</el-form-item>

			<el-form-item style="margin-left: -20px;">
				<el-input placeholder="密码" type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
			</el-form-item>

			<!--<el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
            </el-form-item>-->

			<el-form-item style="margin-left: -20px;">
				<el-button type="primary" @click="login">登陆</el-button>
				
				<!--<el-button type="primary" @click="submitForm('ruleForm2')">注册</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>-->
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import $http from 'axios'
	import $axios from '../ajax'
	import URL from '../urlConfig'
	import qs from 'qs'
	import * as Cookies from 'tiny-cookie'
	import crypto from 'crypto'
	export default {
		data() {
			var checkAge = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('用户名不能为空'));
				}
				setTimeout(() => {
					if(!Number.isInteger(value)) {
						callback(new Error('请输入数字值'));
					} else {
						if(value < 18) {
							callback(new Error('必须年满18岁'));
						} else {
							callback();
						}
					}
				}, 1000);
			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(this.ruleForm2.checkPass !== '') {
						this.$refs.ruleForm2.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm2.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm2: {
					username: '',
					pass: '',
					age: ''
				},
				rules2: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					age: [{
						validator: checkAge,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			
			/*
			 * params:index,row
			 *
			 * return: 无
			 * function:删除事件
			 * */
			async login() {
				try {
					this.ruleForm2.pass=this.setMd5(this.ruleForm2.pass);
					let data = await $http.post(URL.login, qs.stringify({
						username: this.ruleForm2.username,
						password: this.ruleForm2.pass
					}))

					if(data.status == 200) {
						this.$router.push({
							path: '/'
						})
						Cookies.set("ADMINTOKEN", data.headers.authorization);
						localStorage.setItem('username', this.ruleForm2.username);

					} else {
						this.$router.push({
							path: '/login'
						})
						this.$layer.msg('用户名或密码错误');
					}
				} catch(err) {
					this.$layer.msg('用户名或密码错误');
					console.log(err);
				}
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$layer.alert('注册成功');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			
			setMd5(name) {
				var md5 = crypto.createHash("md5")
				md5.update(name) //this.pw2这是你要加密的密码
				return md5.digest('hex') //this.pw这就是你加密完的密码，这个往后台传就行了
			},

		}
	}
</script>

<style scoped lang="scss">
	#bd {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: url(../assets/login-bg.png) no-repeat;
		background-size: 100% 100%;
		position: relative;
		.manage-logo {
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0);
			top: 120px;
			width: 30%;
		}
	}
	
	.el-form {
		width: 460px;
		padding-top: 60px;
		height: 260px;
		margin: 0 auto;
		background: white;
		margin-top: 80px;
		background: rgba(0, 0, 0, 0.5);
	}
	
	.el-input {
		width: 300px;
	}
	
	.s {
		color: #9A9A9A;
		width: 100%;
		height: 60px;
		display: flex;
		/*justify-content: flex-end;*/
		align-items: center;
		border-bottom: 1px solid #DDDDDD;
	}
	
	.el-button {
		width: 300px;
	}
	
	.set {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 20px;
	}
</style>