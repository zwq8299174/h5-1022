var stamp = (new Date()).getTime();

var staticUrl = './static';
'use strict';
requirejs.config({
	baseUrl: staticUrl+'/js',
	paths: {
//基础lib----------------
		'baseSet': 'libs/default/baseSet',
		'jquery': 'libs/jquery/jquery.min',
		'bootstrap': 'libs/bootstrap/bootstrap.min',
		'browser': 'libs/custom/browser',
		'domReady': 'libs/require/domReady',
		'cache': 'libs/custom/cache',
		'swiper': 'libs/swiper/swiper.min',
		'swiper.animate': 'libs/swiper/swiper.animate1.0.2.min',
//custom-----------------------
		'tools': 'libs/custom/tools',
		'ajax': 'libs/custom/ajax',
		'geturl': 'libs/custom/getUrlVars',
		'api':'libs/custom/api',
		'loader':'libs/custom/loader',
		'appAlert':'libs/custom/appAlert',
		'sweetalert':'libs/other/sweetalert',
		'loading':'libs/custom/loading',
		'base64':'libs/other/base64.min',
		'date':'libs/custom/date',
		'tap':'libs/jquery/jquery.tap',
		'Marquee':'libs/jquery/jquery.Marquee',
		'wx':'weixin/jweixin-1.2.0',
		'wxConfig':'weixin/wxConfig',
		'getSign':'weixin/getSign'
	},
	// shim选项设定。模块间的依存关系定义。
	shim: {
		'bootstrap': {
			// jQuery依赖，所以paths设定了“module / name”指定。
			deps: ['jquery']
		},
		'ajax': {
			deps: ['jquery']
		},
		'api': {
			deps: ['jquery','ajax']
		},
		'swiper':{
			deps:[],
			exports: 'Swiper'
		},
		'tap':{
			deps: ['jquery']
		},
		'Marquee':{
			deps: ['jquery']
		},
		'wxConfig':{
			deps: ['wx'],
			exports: 'wxConfig'
		},
	},
	//启动应用程序
	deps: [
		'jquery'
	],
	waitSeconds: 0
});
