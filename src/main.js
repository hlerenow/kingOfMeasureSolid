// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false;

// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: 'http://hilongjw.github.io/vue-lazyload/dist/404.png',
//   loading: 'http://app.yeegen.com/statics/loading.gif',
//   attempt: 1,
//   listenEvents: [ 'scroll' ]
// })

/*事件总线*/
Vue.prototype.$bus = new Vue();

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: "<app></app>",
	components: {
		'app': App
	}
});