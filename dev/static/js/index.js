define(['api', 'jquery', 'tap', 'Marquee'], function(api) {
	var $mask = $('.mask-shadow'),
		$foem = $('.form-submit'),
		bag,
		once = localStorage.getItem('once')=='1'?true:false,
		shark = false,
		postData = {
			name: '',
			gender: '',
			mobile: '',
			code: '',
			provinceId: '',
			cityId: '',
			couponId: '123'
		},
		mp3 = document.getElementById('mp3');

	api.getProvince((data) => { //省份列表
		let tpl = '';
		for(let item of data) {
			tpl += '<option value="' + item.id + '">' + item.name + '</option>';
		};
		$('.provinceId').append(tpl);
	});

	api.getWinnerList((data) => { //奖品列表
		let tpl = '',
			bar = '';
		for(let item of data) {
			tpl += '<li><span>' + item.name + '</span><span>' + item.price + '</span></li>';
			bar += '<span>' + item.date + '，' + item.name + '，获得价值' + item.value + '元' + item.price + '。</span>';
		};
		$('.prize-list ul').append(tpl).liMarquee({ //奖品列表滚动
			direction: 'up',
			scrollamount: 80
		});
		$('.bottom-bar').append(bar).liMarquee({ //底部滚动
			scrollamount: 150
		});
	});

	$('.close').on('tap', function() { //关闭按钮
		var $dialog = $(this).closest('.dialog').length == 0 ? $(this).closest('.already') : $(this).closest('.dialog');
		$dialog.hide();
		$mask.hide();
	});

	$('.tags').on('tap', '.tag', function() { //左侧标签点击
		var cless = $(this).data('dialog');
		var height = $('.' + cless).outerHeight();
		if(cless == 'prize-list') {
			$('.' + cless).addClass('active');
		};
		$('.' + cless).css({'margin-top':'-'+height/2+'px'}).show();
		$mask.show();
	});
	$('.form-submit').find('input').on('input',function(e){
		if($(this).val()!=''){
			$(this).removeClass('error');
		}
	});
	$('.provinceId').on('change', function() {
		postData.provinceId = $(this).val();
		if($(this).val()!=''){
			$(this).removeClass('error');
		};
		api.getCity($(this).val(), (data) => {
			console.log(data);
			let tpl = '';
			for(let item of data) {
				tpl += '<option value="' + item.id + '">' + item.name + '</option>';
			};
			$('.cityId').append(tpl);
		});
	});
	$('.cityId').on('change', function() {
		postData.cityId = $(this).val();
		if($(this).val()!=''){
			$(this).removeClass('error');
		}
	});
	$('.gender').on('change', function() {
		if($(this).val()!=''){
			$(this).removeClass('error');
		}
		postData.gender = $(this).val();
	});
	function verify(){
		let result = false;
		let len = 0;
		for(let name in postData) {
			if(postData[name] == '') {
				$('.'+name).addClass('error');
				len = len + 1;
			}
		};
		if(len > 0) {
			$('.error-msg').addClass('show');
		} else {
			result = true;
			$('.error-msg').removeClass('show');
		};
		return result;
	};
	$('.submit').on('tap', function() { //表单提交
		postData.name = $('.name').val();
		postData.mobile = $('.mobile').val();
		postData.code = $('.code').val();
		if(verify()){
			api.binding(postData,(data)=>{
				localStorage.setItem('once', '1');
				$('.form-submit').hide();
				var $dialog = $('.prize-list');
				var height = $dialog.outerHeight();
				$dialog.removeClass('active');
				$dialog.css('margin-top','-'+height/2+'px').show();
			});
		}
	});

	//红包雨
	function RandomNum(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.floor(Rand * Range);
		return num;
	};

	function createBag() {
		var $bag = $('<img src="./static/img/red-bag.png"/>'),
			$wrap = $('.rain-wrap'),
			num = RandomNum(140, 180);
		$bag.height(num);
		$bag.css({
			left: RandomNum(10, 90) + '%',
			transform: 'rotate(' + RandomNum(-60, 60) + 'deg)'
		});
		$wrap.append($bag);
		setTimeout(function() {
			$bag.css({
				'margin-top': $wrap.outerHeight() + 100 + 'px'
			});
		});
	};

	function showBag() {
		$('.red-bag-rain').find('.time-bar').hide();
		$('.red-bag-rain').find('.bag').addClass('big');
	};
	$('.join').on('tap', function() { //参加按钮点击
		if(!once) {
			api.draw((data) => {
				postData.couponId = data.id;
				$('.awards-name').text(data.price);
				$('.awards-cost').text(data.value);
				$('.awards-code').text(data.coupon);
				$mask.show();
				var $rain = $('.red-bag-rain');
				$rain.show();
				bag = window.setInterval(createBag, 300);
				if(window.DeviceMotionEvent) {
					window.addEventListener('devicemotion', deviceMotionHandler, false);
				};
				setTimeout(function() {
					$rain.find('.time-bar').addClass('end');
				},100);
				setTimeout(function() {
					window.clearInterval(bag);
					window.removeEventListener('devicemotion', deviceMotionHandler, false);
				}, 10000);
				setTimeout(function() {
					if(!shark) {
						showBag();
					}
				}, 11000);
				once = true;

			});
		} else {
			$mask.show();
			var height = $('.prize').outerHeight();
			$('.already').css('margin-top','-'+height/2+'px').show();
		};
	});
	$('.send-code').on('tap', function() {
		var _this = $(this);
		if(!_this.hasClass('can')) return false;
		api.sendCode((data) => {
			var time = 59;
			var CD = setInterval(function() {
				if(time > 0) {
					_this.text(time + 's').removeClass('can');
					time--;
				} else {
					_this.text('发送验证码').addClass('can');
					clearInterval(CD);
				};
			}, 1000);
		});
	});
	$('.red-bag-rain').find('.bag').on('tap', function() { //红包点击
		var height = $('.prize').outerHeight();
		$('.prize').css('margin-top','-'+height/2+'px').show();
		$(this).closest('.red-bag-rain').hide();
	});
	$('.income').on('tap', function() { //收入囊中
		//$('.prize-list').removeClass('active').show();
		$(this).closest('.prize').hide();
		setTimeout(function(){
			$('.form-submit').show();
		});
	});
	//摇一摇功能
	if(window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	}
	//获取加速度信息
	//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
	//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
	var SHAKE_THRESHOLD = 4000;
	var last_update = 0;
	var x, y, z, last_x = 0,
		last_y = 0,
		last_z = 0;

	function deviceMotionHandler(eventData) {
		var acceleration = eventData.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if((curTime - last_update) > 100) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
			if(speed > SHAKE_THRESHOLD) {
				mp3.play();
				shark = true;
				window.clearInterval(bag);
				showBag();
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}
});