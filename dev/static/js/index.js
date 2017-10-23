define(['jquery', 'tap', 'Marquee'], function() {
	var $mask = $('.mask-shadow'),
		$foem = $('.form-submit'),
		bag,
		once=false,
		shark=false,
		postData = {};
	$('.close').on('tap',function(){
		var $dialog = $(this).closest('.dialog').length==0?$(this).closest('.already'):$(this).closest('.dialog');
		$dialog.hide();
		$mask.hide();
	});
	$('.tags').on('tap','.tag',function(){
		var cless = $(this).data('dialog');
		if(cless=='prize-list'){
			$('.'+cless).addClass('active');
		};
		$('.'+cless).show();
		$mask.show();
	});
	$('.submit').on('tap', function() {
		postData = {
			name:$('.name').val(),
			sex:$('.sex').val(),
			mobile:$('.mobile').val(),
			code:$('.code').val(),
			region:{
				province:$('.province').val(),
				city:$('.city').val()
			}
		};
		console.log(postData);
	});
	$('.bottom-bar').liMarquee({
		scrollamount: 150
	});
	$('.prize-list ul').liMarquee({
		direction:'up',
		scrollamount: 80
	});
	
	//红包雨
	function RandomNum(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.floor(Rand * Range);
		return num;
	};
	function createBag(){
		var $bag = $('<img src="./static/img/red-bag.png"/>'),
			$wrap = $('.rain-wrap'),
			num = RandomNum(140,180);
		$bag.height(num);
		$bag.css({
			left:RandomNum(10,90)+'%',
			transform:'rotate('+RandomNum(-60,60)+'deg)'
		});
		$wrap.append($bag);
		setTimeout(function(){
			$bag.css({
				'margin-top':$wrap.outerHeight()+100+'px'
			});
		});
	};
	function showBag(){
		$('.red-bag-rain').find('.time-bar').hide();
		$('.red-bag-rain').find('.bag').addClass('big');
	};
	$('.join').on('tap',function(){
		$mask.show();
		if(!once){
			var $rain = $('.red-bag-rain');
			$rain.show();
			bag = window.setInterval(createBag,300);
			if(window.DeviceMotionEvent) {
				window.addEventListener('devicemotion', deviceMotionHandler, false);
			};
			setTimeout(function(){
				$rain.find('.time-bar').addClass('end');
			});
			setTimeout(function(){
				window.clearInterval(bag);
				window.removeEventListener('devicemotion', deviceMotionHandler, false);
			},10000);
			setTimeout(function(){
				if(!shark){
					showBag();
				}
			},11000);
			once = true;
		}else{
			$('.already').show();
		}
	});
	$('.red-bag-rain').find('.bag').on('tap',function(){
		$('.prize').show();
		$(this).closest('.red-bag-rain').hide();
	});
	$('.income').on('tap',function(){
		$('.prize-list').removeClass('active').show();
		$(this).closest('.prize').hide();
	});
	
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