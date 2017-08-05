import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import LMapEditorMobile from '@/components/LMapEditorMobile/LMapEditorMobile'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'LMapEditorMobile',
		component: LMapEditorMobile
	}]
})