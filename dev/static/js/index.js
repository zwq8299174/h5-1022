define(['jquery', 'tap', 'Marquee'], function() {
	var $mask = $('.mask-shadow'),
		$foem = $('.form-submit');
		postData = {};
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
				alert("你中奖啦！"); // Do something
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}
});