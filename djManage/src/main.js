import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css'

import store from './vuex/store'

import VueQuillEditor from 'vue-quill-editor';
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */ );
import App from './App.vue';
import router from './router'
import layer from 'vue-layer'
Vue.prototype.$layer = layer(Vue);
import axios from 'axios'
import Qs from 'qs';
import * as Cookies from 'tiny-cookie';
//Vue.prototype.$axios=axios;
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios.create({
	baseURL: '',
	transformRequest: [function(data) {
		// 对 data 进行任意转换处理
		var data = Qs.stringify(data);
		return data;
	}],

	// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
	transformResponse: [function(data) {
		// 对 data 进行任意转换处理
		var temData = JSON.parse(data);
		if(!temData.status) {
			if(temData.code == 200) {
				return temData
			} else {
				layer.msg(temData.msg)
			}
		}
	}],
});
//添加一个请求拦截器
Vue.prototype.$axios.interceptors.request.use(function(config) {
	//在请求发出之前进行一些操作
	let TOKEN = Cookies.get('ADMINTOKEN') || '';
	config.headers.Authorization = TOKEN;
	// loading = layer.load(1, {
	//   shade: [0.3,'#000'] //0.1透明度的白色背景
	// });
	// if (TOKEN == null || TOKEN == 'undefined') {
	//   router.replace({path:'/'});
	// }
	return config;
}, function(err) {
	// layer.close(loading);
	//Do something with request error
	return Promise.reject(err);
});

//axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<app/>',
	render: h => h(App)

});