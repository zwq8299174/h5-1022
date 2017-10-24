//安装命令
//cnpm install --save-dev gulp gulp-minify-css amd-optimize gulp-jshint  gulp-uglify gulp-rename gulp-concat gulp-clean gulp-insert through2 gulp-htmlmin gulp-ng-html2js gulp-replace gulp-sourcemaps browser-sync gulp-rev gulp-rev-collector gulp-livereload gulp-imagemin gulp-html-replace rev-hash
//

var project = './dev';
var projectDist = './';
var version = '1.0';
var prevVersion = '1.0';
var postServer = 'http://117.50.8.212';
var postPort = '9100';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	minifycss = require('gulp-clean-css'), //css压缩
	amdOptimize = require('amd-optimize'), //requirejs打包
	jshint = require('gulp-jshint'), //js语法检查
	uglify = require('gulp-uglify'), //压缩混淆
	rename = require('gulp-rename'), //重命名
	concat = require('gulp-concat'), //文件合并
	clean = require('gulp-clean'), //清理文件
	insert = require('gulp-insert'), //插入内容
	package = require('./package.json'), //package.json
	through = require('through2'), //获取文件名
	htmlmin = require('gulp-htmlmin'), //HTML压缩
	htmlreplace = require('gulp-html-replace'),
	ngHtml2Js = require('gulp-ng-html2js'), //angular模板打包
	replace = require('gulp-replace'), //替换字符
	rev = require('gulp-rev'), //
	revHash = require('rev-hash'), //
	revCollector = require('gulp-rev-collector');

var header = '/*-----------------------\n' +
	' * Site:  H5 - {{ name }}\n' +
	' * Author: Clearlove 7*\n' +
	' * Updated: {{ date }}\n' +
	' * Version: {{ version }}\n' +
	' * -----------------------*/\n';
var nowTime = new Date().getTime();

function getDate(time, format) {
	var t = new Date(time);
	var tf = function(i) {
		return(i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g,
		function(a) {
			switch(a) {
				case 'yyyy':
					return tf(t.getFullYear());
					break;
				case 'MM':
					return tf(t.getMonth() + 1);
					break;
				case 'mm':
					return tf(t.getMinutes());
					break;
				case 'dd':
					return tf(t.getDate());
					break;
				case 'HH':
					return tf(t.getHours());
					break;
				case 'ss':
					return tf(t.getSeconds());
					break;
			};
		});
};
var tplHeader = '<script type="text/ng-template" id="{{ name }}">';
var tplFooter = '</script>';

gulp.task('cssmin', function() {
	var name = 'main.min.css';
	return gulp.src(['./' + project + '/static/css/**/**.css'])
		.pipe(concat(name))
		.pipe(minifycss({
			keepSpecialComments: 0
		}))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(replace('../../', '../'))
		.pipe(gulp.dest('./' + projectDist + '/static/css/'))
});

gulp.task('baseSet', function() {
	var stream, name;
	name = 'baseSet';
	stream = gulp.src('./' + project + '/static/js/libs/default/baseSet.js')
		.pipe(replace('\'' + postServer + ':' + postPort + '/\'', 'window.location.origin+\'/\''))
		.pipe(gulp.dest('./' + project + '/static/js/libs/default/'));
	return stream;
});

gulp.task('returnBaseSet', ['startJs'], function() {
	var stream, name;
	name = 'baseSet';
	stream = gulp.src('./' + project + '/static/js/libs/default/baseSet.js')
		.pipe(replace('window.location.origin+\'/\'', '\'' + postServer + ':' + postPort + '/\''))
		.pipe(gulp.dest('./' + project + '/static/js/libs/default/'));
	return stream;
});

gulp.task('img', function() {
	return gulp.src('./' + project + '/static/img/**.**')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./' + projectDist + '/static/img/'));
});

gulp.task('indexJs', function() {
	var name = 'index';
	return gulp.src('./' + project + '/static/js/*.js')
		.pipe(amdOptimize(name, {
			baseUrl: './' + project + '/static/js/',
			configFile: './' + project + '/static/js/config.js',
			findNestedDependencies: false,
			include: false
		}))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(insert.prepend(header))
		.pipe(replace('{{ date }}', getDate(nowTime, 'yyyy-MM-dd HH:mm')))
		.pipe(replace('{{ version }}', package.version))
		.pipe(replace('{{ name }}', name))
		.pipe(gulp.dest('./' + projectDist + '/static/js/'));
});

gulp.task('index', ['indexJs', 'cssmin','img'], function() {
	return gulp.src('./' + project + '/index.html')
		.pipe(htmlreplace({
			'css': './static/css/main.min.css?v={{ version }}',
			'js': {
				src: [
					['./static/js/require.min.js', './static/js/main.min.js?v={{ version }}']
				],
				tpl: '<script src="%s" data-main="%s"></script>'
			}
		}))
		.pipe(replace('{{ version }}', randomString(10)))
		.pipe(htmlmin({
			minifyJS: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./' + projectDist + '/'));
});

function randomString(len) {　　
	len = len || 32;　　
	var $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';　　
	var maxPos = $chars.length;　　
	var pwd = '';　　
	for(i = 0; i < len; i++) {　　　　
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
	};　　
	return pwd;
};