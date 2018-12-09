import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import login from '@/components/login'
import Two from '@/components/two'
import Three from '@/components/three'
import Four from '@/components/four'
import Five from '@/components/five'
import six from '@/components/six'
import seven from '@/components/seven'
import eight from '@/components/eight'
import answer from '@/components/answer/answer'
import logout from '@/components/logout/logout'
import study from '@/components/pages/study'
import integral from '@/components/pages/integral'

Vue.use(Router)

export default new Router({
	base:'/cms/',
	routes: [{
			path: '/',
			component: Home,
			redirect: '/two',
			children: [

				{
					path: 'two',
					component: Two,
					name: 'Two'
				},
				{
					path: '/three',
					component: Three,
					name:'three'
				},
				{
					path: '/four',
					component: Four,
					name:'four'
				},
				{
					path: '/five',
					component: Five,
					name:'five'
				},
				{
					path: '/six',
					component: six,
					name:'six'
				},
				{
					path: '/seven',
					component: seven,
					name:'seven'
				},
				{
					path: '/eight',
					component: eight,
					name: 'eight'
				},
				{
					path: '/answer',
					component: answer,
					name: 'answer'
				},
				{
					path: '/logout',
					component: logout,
					name: 'logout',
				},
				{
					path: 'study',
					component: study,
					name: 'study',
				},
				{
					path: 'integral',
					component: integral,
					name: 'integral',
				}
			],

		},
		{
			path: '/login',
			component: login,
			name: 'login'
		},

	]
})