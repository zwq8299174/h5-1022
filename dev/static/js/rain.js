define(['api', 'jquery', 'tap', 'Marquee'], function(api) {
	$(function() {
		$('body').height($(window).height());
		var $mask = $('.mask-shadow'),
			$prizeList = $('.prize-list'),
			$prize = $('.prize'),
			$noPrize = $('.no-prize'),
			$already = $('.already'),
			bag,
			raining = false,
			shark = false,
			time = 60,
			coupon = {},
			loginCode,
			loginInfo,
			mp3 = document.getElementById('mp3');
		draw();
		function getWinnerList(){
			api.getWinnerList((data) => { //奖品列表
				let tpl = '',
					bar = '';
				for(let item of data.data) {
					tpl += '<li><span>' + item.name.slice(0,1) + '**</span><span>' + item.price + '</span></li>';
					bar += '<span>' + item.date + '，' + item.name.slice(0,1) + '**，获得价值' + item.value + '元' + item.price + '。</span>';
				};
				$prizeList.find('ul').empty().append(tpl).liMarquee({ //奖品列表滚动
					direction: 'up',
					scrollamount: 80
				});
				$('.bottom-bar').empty().append(bar).liMarquee({ //底部滚动
					scrollamount: 150
				});
			});
		};
		getWinnerList();
		$('.close').on('tap', function() { //关闭按钮
			var $dialog = $(this).closest('.dialog').length == 0 ? $(this).closest('.already') : $(this).closest('.dialog');
			if($dialog.hasClass('form-submit')){
				time = 60;
				shark = false;
				$('.red-bag-rain').find('.time-bar').show();
				$('.red-bag-rain').find('.bag').removeClass('big');
			};
			$dialog.hide();
			$mask.hide();
		});

		$('.tags').on('tap', '.tag', function() { //左侧标签点击
			var cless = $(this).data('dialog');
			var height = $('.' + cless).outerHeight();
			if(cless == 'prize-list') {
				$('.' + cless).addClass('active');
			};
			$('.' + cless).css({
				'margin-top': '-' + height / 2 + 'px'
			}).show();
			$mask.show();
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
		function rain(data){
			if(data.code==201){
				loginCode = 201;
				$('.awards-name').text(data.data.price);
				$('.awards-cost').text(data.data.value);
				$('.awards-code').text(data.data.code);
			};
			$mask.show();
			var $rain = $('.red-bag-rain');
			$rain.find('.time-bar').removeClass('end');
			$rain.show();
			raining = true;
			bag = window.setInterval(createBag, 300);
			if(window.DeviceMotionEvent) {
				window.addEventListener('devicemotion', deviceMotionHandler, false);
			};
			setTimeout(function() {
				$rain.find('.time-bar').addClass('end');
			}, 100);
			if(!shark){
				setTimeout(function() {
					window.clearInterval(bag);
					window.removeEventListener('devicemotion', deviceMotionHandler, false);
					raining = false;
					getWinnerList();
				}, 10000);
				setTimeout(function() {
					showBag();
				}, 11000);
			};
		};
		function draw(){
			api.draw((data) => {
				coupon = data;
				loginCode = data.code;
				if(data.code==409){
					$mask.show();
					var height = $already.outerHeight();
					$already.css('margin-top', '-' + height / 2 + 'px').show();
				}else if(data.code==410){
					$('.awards-name').text(data.data.price);
					$('.awards-cost').text(data.data.value);
					$('.awards-code').text(data.data.code);
					$mask.show();
					var height = $prizeList.outerHeight();
					$prizeList.removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
				}else if(data.code==406){
					alert('验证码错误');
				} else if(data.code==408){
					window.location.href = 'index.html';
				} else {
					
					rain(data);
				}
			});
		};
		$('.again').on('tap', function() { //再次抽奖
			$noPrize.hide();
			$('.bag').removeClass('big');
			$('.time-bar').show().removeClass('end');
			draw();
		});
		$('.red-bag-rain').find('.bag').on('tap', function() { //红包点击
			mp3.play();
			if(coupon.code==201){
				var height = $prize.outerHeight();
				$prize.css('margin-top', '-' + height / 2 + 'px').show();
				$(this).closest('.red-bag-rain').hide();
			}else{
				var height = $noPrize.outerHeight();
				$noPrize.css('margin-top', '-' + height / 2 + 'px').show();
				$(this).closest('.red-bag-rain').hide();
			}
		});
		$('.share').on('tap', function() { //分享
			$('.share-wrapper').show();
		});
		$('.share-wrapper').on('tap','.close', function(e) { //分享
			e.stopPropagation();
			e.preventDefault();
			$('.share-wrapper').hide();
		});
		//摇一摇功能
		//获取加速度信息
		//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
		//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
		var SHAKE_THRESHOLD = 4000;
		var last_update = 0;
		var x, y, z, last_x = 0,
			last_y = 0,
			last_z = 0;

		function deviceMotionHandler(eventData) {
			eventData.stopPropagation();
			eventData.preventDefault();
			var acceleration = eventData.accelerationIncludingGravity;
			var curTime = new Date().getTime();
			if((curTime - last_update) > 100) {
				var diffTime = curTime - last_update;
				last_update = curTime;
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
				var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
				if(speed > SHAKE_THRESHOLD&&raining) {
					window.clearInterval(bag);
					window.removeEventListener('devicemotion', deviceMotionHandler, false);
					shark = true;
					window.clearInterval(bag);
					showBag();
				}
				last_x = x;
				last_y = y;
				last_z = z;
			}
		};
		$('.join').on('tap', function() { //参加按钮点击
			if(!loginCode) return;
			if(loginCode==408){
				$mask.show();
				$form.show();
			}else if(loginCode==409){
				$mask.show();
				var height = $already.outerHeight();
				$already.css('margin-top', '-' + height / 2 + 'px').show();
			}else if(loginCode==410){
				console.log(coupon);
				$('.awards-name').text(coupon.data.price);
				$('.awards-cost').text(coupon.data.value);
				$('.awards-code').text(coupon.data.code);
				$mask.show();
				var height = $prizeList.outerHeight();
				$prizeList.removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
			}else if(loginCode==201){
				$mask.show();
				var height = $prizeList.outerHeight();
				$prizeList.removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
			}else{
				window.location.href = 'rain.html';
//				draw();
			}
		});
	});
});