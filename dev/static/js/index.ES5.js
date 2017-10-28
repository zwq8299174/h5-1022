'use strict';

define(['api', 'jquery', 'tap', 'Marquee'], function (api) {
	$(function () {
		//window.location.href = 'http://';
		$('body').height($(window).height());
		var $mask = $('.mask-shadow'),
		    $foem = $('.form-submit'),
		    bag,
		    raining = false,
		    shark = false,
		    time = 60,
		    postData = {
			name: '',
			gender: '',
			mobile: '',
			code: '',
			provinceId: '',
			cityId: '666'
		},
		    coupon = {},
		    mp3 = document.getElementById('mp3'),
		    loginCode,
		    loginInfo;
		api.login(function (data) {
			console.log(data);
			loginInfo = data.data;
			coupon = data;
			loginCode = data.code;
		});

		api.getProvince(function (data) {
			//省份列表
			var tpl = '';
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					tpl += '<option value="' + item.id + '">' + item.name + '</option>';
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			;
			$('.provinceId').append(tpl);
		});
		function getWinnerList() {
			api.getWinnerList(function (data) {
				//奖品列表
				var tpl = '',
				    bar = '';
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						tpl += '<li><span>' + item.name.slice(0, 1) + '**</span><span>' + item.price + '</span></li>';
						bar += '<span>' + item.date + '，' + item.name.slice(0, 1) + '**，获得价值' + item.value + '元' + item.price + '。</span>';
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				;
				$('.prize-list ul').empty().append(tpl).liMarquee({ //奖品列表滚动
					direction: 'up',
					scrollamount: 80
				});
				$('.bottom-bar').empty().append(bar).liMarquee({ //底部滚动
					scrollamount: 150
				});
			});
		};
		getWinnerList();
		$('.close').on('tap', function () {
			//关闭按钮
			var $dialog = $(this).closest('.dialog').length == 0 ? $(this).closest('.already') : $(this).closest('.dialog');
			if ($dialog.hasClass('form-submit')) {
				time = 60;
				shark = false;
				$('.red-bag-rain').find('.time-bar').show();
				$('.red-bag-rain').find('.bag').removeClass('big');
			};
			$dialog.hide();
			$mask.hide();
		});

		$('.tags').on('tap', '.tag', function () {
			//左侧标签点击
			var cless = $(this).data('dialog');
			var height = $('.' + cless).outerHeight();
			if (cless == 'prize-list') {
				$('.' + cless).addClass('active');
			};
			$('.' + cless).css({
				'margin-top': '-' + height / 2 + 'px'
			}).show();
			$mask.show();
		});
		$('.form-submit').find('input').on('input', function (e) {
			if ($(this).hasClass('mobile')) {
				var pat = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
				if (pat.test($(this).val())) {
					$(this).removeClass('error');
				}
			} else {
				if ($(this).val() != '') {
					$(this).removeClass('error');
				}
			}
		});
		//$('.form-submit').find('input').on('keydown', function(e) {
		//e.stopPropagation();
		//e.preventDefault();
		//});
		$('select').on('focus', function () {
			$(this).addClass('open');
		});
		$('select').on('blur', function () {
			$(this).removeClass('open');
		});
		$('.provinceId').on('change', function () {
			postData.provinceId = $(this).val();
			if ($(this).val() != '') {
				$(this).removeClass('error');
			};
			api.getCity($(this).val(), function (data) {
				console.log(data);
				var tpl = '';
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = data.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var item = _step3.value;

						tpl += '<option value="' + item.id + '">' + item.name + '</option>';
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				;
				$('.cityId').append(tpl);
			});
		});
		$('.cityId').on('change', function () {
			postData.cityId = $(this).val();
			if ($(this).val() != '') {
				$(this).removeClass('error');
			}
		});
		$('.gender').on('change', function () {
			if ($(this).val() != '') {
				$(this).removeClass('error');
			}
			postData.gender = $(this).val();
		});
		function verify() {
			var result = false;
			var len = 0;
			for (var name in postData) {
				if (postData[name] == '') {
					$('.' + name).addClass('error');
					len = len + 1;
				} else {
					if (name == 'mobile' && !postData[name].match(/^1[3|4|5|7|8][0-9]{9}$/)) {
						$('.' + name).addClass('error');
						len = len + 1;
					}
				}
			};
			if (len > 0) {
				$('.error-msg').addClass('show');
			} else {
				result = true;
				$('.error-msg').removeClass('show');
			};
			return result;
		};
		$('.submit').on('tap', function () {
			//表单提交
			postData.name = $('.name').val();
			postData.mobile = $('.mobile').val();
			postData.code = $('.code').val();
			if (verify()) {
				api.binding(postData, function (data) {
					console.log(data);
					loginCode = data.code;
					if (data.code == 406) {
						alert('验证码错误');
					} else {
						$('.form-submit').remove();
						draw();
					}
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
			setTimeout(function () {
				$bag.css({
					'margin-top': $wrap.outerHeight() + 100 + 'px'
				});
			});
		};
		function showBag() {
			$('.red-bag-rain').find('.time-bar').hide();
			$('.red-bag-rain').find('.bag').addClass('big');
		};
		function rain(data) {
			if (data.code == 201) {
				getWinnerList();
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
			if (window.DeviceMotionEvent) {
				window.addEventListener('devicemotion', deviceMotionHandler, false);
			};
			setTimeout(function () {
				$rain.find('.time-bar').addClass('end');
			}, 100);
			setTimeout(function () {
				window.clearInterval(bag);
				window.removeEventListener('devicemotion', deviceMotionHandler, false);
				raining = false;
			}, 10000);
			setTimeout(function () {
				if (!shark) {
					showBag();
				}
			}, 11000);
		};
		function draw() {
			api.draw(function (data) {
				coupon = data;
				if (data.code == 409) {
					$mask.show();
					var height = $('.already').outerHeight();
					$('.already').css('margin-top', '-' + height / 2 + 'px').show();
				} else if (data.code == 410) {
					$('.awards-name').text(data.data.price);
					$('.awards-cost').text(data.data.value);
					$('.awards-code').text(data.data.code);
					$mask.show();
					var height = $('.prize-list').outerHeight();
					$('.prize-list').removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
				} else if (data.code == 406) {
					alert('验证码错误');
				} else {
					rain(data);
				}
			});
		};
		$('.again').on('tap', function () {
			//再次抽奖
			$('.no-prize').hide();
			$('.bag').removeClass('big');
			$('.time-bar').show().removeClass('end');
			draw();
		});
		$('.join').on('tap', function () {
			//参加按钮点击
			mp3.play();
			mp3.pause();
			console.log(loginCode);
			if (loginCode == 408) {
				$mask.show();
				$('.form-submit').show();
			} else if (loginCode == 409) {
				$mask.show();
				var height = $('.already').outerHeight();
				$('.already').css('margin-top', '-' + height / 2 + 'px').show();
			} else if (loginCode == 410) {
				console.log(coupon);
				$('.awards-name').text(coupon.data.price);
				$('.awards-cost').text(coupon.data.value);
				$('.awards-code').text(coupon.data.code);
				$mask.show();
				var height = $('.prize-list').outerHeight();
				$('.prize-list').removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
			} else if (loginCode == 201) {
				$mask.show();
				var height = $('.prize-list').outerHeight();
				$('.prize-list').removeClass('active').css('margin-top', '-' + height / 2 + 'px').show();
			} else {
				draw();
			}
		});
		$('.send-code').on('tap', function () {
			var _this = $(this);
			if (!_this.hasClass('can') || !$('.mobile').val().match(/^1[3|4|5|7|8][0-9]{9}$/)) return false;
			api.sendCode($('.mobile').val(), function (data) {
				_this.text(time + 's').removeClass('can');
				time--;
				var CD = setInterval(function () {
					if (time > 0) {
						_this.text(time + 's').removeClass('can');
						time--;
					} else {
						_this.text('发送验证码').addClass('can');
						clearInterval(CD);
					};
				}, 1000);
			});
		});
		$('.red-bag-rain').find('.bag').on('tap', function () {
			//红包点击
			if (coupon.code == 201) {
				var height = $('.prize').outerHeight();
				$('.prize').css('margin-top', '-' + height / 2 + 'px').show();
				$(this).closest('.red-bag-rain').hide();
			} else {
				var height = $('.no-prize').outerHeight();
				$('.no-prize').css('margin-top', '-' + height / 2 + 'px').show();
				$(this).closest('.red-bag-rain').hide();
			}
		});
		$('.share').on('tap', function () {
			//分享
			$('.share-wrapper').show();
		});
		$('.share-wrapper').on('tap', '.close', function (e) {
			//分享
			e.stopPropagation();
			e.preventDefault();
			$('.share-wrapper').hide();
		});
		//摇一摇功能
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		}
		//获取加速度信息
		//通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
		//而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
		var SHAKE_THRESHOLD = 4000;
		var last_update = 0;
		var x,
		    y,
		    z,
		    last_x = 0,
		    last_y = 0,
		    last_z = 0;

		function deviceMotionHandler(eventData) {
			eventData.stopPropagation();
			eventData.preventDefault();
			var acceleration = eventData.accelerationIncludingGravity;
			var curTime = new Date().getTime();
			if (curTime - last_update > 100) {
				var diffTime = curTime - last_update;
				last_update = curTime;
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
				var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
				if (speed > SHAKE_THRESHOLD && raining) {
					mp3.play();
					shark = true;
					window.clearInterval(bag);
					showBag();
				}
				last_x = x;
				last_y = y;
				last_z = z;
			}
		};
	});
});