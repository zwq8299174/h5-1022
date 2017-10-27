define(["wx"],function(wx){
	var wxConfig = function(a,firebug){
		wx.config({
		    debug: firebug,
		    appId: a.appid,
		    timestamp: a.timeStamp,
		    nonceStr: a.nonceStr,
		    signature: a.signature,
		    jsApiList: [
		        'checkJsApi',
		        'onMenuShareTimeline',
		        'onMenuShareAppMessage',
		        'onMenuShareQQ',
		        'onMenuShareWeibo',
		        'hideMenuItems',
		        'showMenuItems',
		        'hideAllNonBaseMenuItem',
		        'showAllNonBaseMenuItem',
		        'translateVoice',
		        'startRecord',
		        'stopRecord',
		        'onRecordEnd',
		        'playVoice',
		        'pauseVoice',
		        'stopVoice',
		        'uploadVoice',
		        'downloadVoice',
		        'chooseImage',
		        'previewImage',
		        'uploadImage',
		        'downloadImage',
		        'getNetworkType',
		        'openLocation',
		        'getLocation',
		        'hideOptionMenu',
		        'showOptionMenu',
		        'closeWindow',
		        'scanQRCode',
		        'chooseWXPay',
		        'openProductSpecificView',
		        'addCard',
		        'chooseCard',
		        'openCard'
		    ]
		});
	};
	return wxConfig
})
