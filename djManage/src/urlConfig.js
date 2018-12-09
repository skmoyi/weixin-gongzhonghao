/**
 * @author: 王超楠
 * @create: 2018/07/13
 * @describe: 请求路径配置
 */
"use strict";
var base = 'cms'; //开发环境
//var base = '';//生产环境

var URL = {
	getOrganization: base + '/allOrganization', //查询组织关系转换
	delOrganization: base + "/delOrganization", //刪除
	audits: base + '/disposeOrganization', //审核通过
	getNation: base + '/nationDictionary', //查询民族
	getEducation: base + '/educationDictionary', //获得学历
	getWork: base + '/workDictionary', //工作岗位
	getSingleOrganization: base + '/singleOrganization', //查询转换组织（单个）回显专用
	updOrganization: base + '/updOrganization', //修改组织转换信息

	lookData: base + '/allInform', //查询系统通知信息
	addInfo: base + '/addInform', //添加系统通知信息
	getSingleInform: base + '/singleInform', //查询单条系统通知信息(回显专用)
	updInform: base + '/updInform', //修改系统通知信息
	delInform: base + '/delInform', //删除系统通知信息

	lookDictionary: base + '/allDetails', //查询所有党建信息（模糊查询）
	partyAudit: base + '/audit', //修改审核状态（批量）
	partyMember: base + '/userMessage', //查看党员详情
	addDetail: base + '/addDetails', //添加黨員信息
	delParty: base + '/delDetails', //批量删除

	activities: base + '/allActivity', //查询活动信息(模糊查询)
	addActivity: base + '/addActivity', //添加活动信息
	lookActivity: base + '/singleActivity', //查询单条信息
	updActivity: base + '/updActivity', //确定修改活动
	delActivity: base + '/delActivity', //刪除活動

	allDuesPay: base + '/allDuesPay', //查询所有申报信息
	updDuesPay: base + '/updDuesPay', //修改申报信息
	singleDuesPay: base + '/singleDuesPay', //查询单条申报信息
	delDuesPay: base + '/delDuesPay', //删除单条申报信息
	updAuditState: base + '/updAuditState', //批量修改审核状态

	uploadImage: base + '/uploadActivityImg', //上传图片
	
	uploadImages: base + '/uploadDuesPayImg', //上传图片

	uploadExcel: base + '/uploadExcel', //题纲excel上传

	allExercisesRecord: base + '/allExercisesRecord', //查询用户做题进度
	getTime: base + '/allTime', //查询过期时间
	delRecords: base + '/delExercisesRecord', //批量删除用户的答题进度信息
	allTitle: base + '/allTitle', //通过大题id查询小题的信息
	allTemporaryExercises:base+'/allTemporaryExercises',//查询每日的题

	lookAuditUser: base + '/toAuditUser', //查询待审核用户
	updToAudit: base + '/updToAudit', //修改用户的注册状态

	allAdmin: base + '/allAdmin', //查询所有管理员
	addAdmin: base + '/addAdmin', ///添加管理员
	delAdmin: base + '/delAdmin', //删除管理员
	modifyAdmin: base + '/alterAdminMessage', //修改管理员

	login: base + '/login', //登陆
	loginAdmin: base + '/loginAdmin', //后台管理登陆
	adminMessage: base + '/adminMessage', //请求用户信息
	logout: base + '/logout', //退出登陆

	lookAllRecord: base + '/allRecord', //查询所有缴费记录
	delRecord: base + '/delRecord', //批量删除缴费记录
	addUserMoney: base + '/addUserMoney', //增加缴费记录

	findById: base + '/findById', //验证旧密码

	downloadExcel: base + '/downloadExcel', //excel导出

	allStudy: base + '/allStudy', //查询学习信息
	addStudy: base + '/addStudy', //添加学习信息
	delStudy: base + '/delStudy', //删除学习信息
	singleStudy: base + '/singleStudy', //查询学习信息(单条)
	updStudy: base + '/updStudy', //修改学习信息

	adminAllIntegral: base + '/adminAllIntegral', //管理员查询积分信息(模糊查询)
	adminDelIntegral: base + '/adminDelIntegral', //管理员删除积分信息
	singleIntegral: base + '/singleIntegral', //查询积分信息(单条)
	adminAddIntegral: base + '/adminAddIntegral', //管理员添加积分信息
	adminUpdIntegral: base + '/adminUpdIntegral', //管理员修改积分信息
	
	allGuidance:base+'/allGuidance',//查詢辦事指南
	updGuidance:base+'/updGuidance',//查詢辦事指南
};

export default URL;