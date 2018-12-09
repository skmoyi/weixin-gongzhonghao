import Vue from 'vue'
import Vuex from 'vuex'
import URL from '../urlConfig'
import axios from '../ajax'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo:{}
	},
	mutations: {
		getUserInfo: (state, val) => {
			state.userInfo = val
		}
	},

})

export default store;