define(["baseSet", "wx"], function(baseSet, wx) {
	var wxPay = function(u, d, c, t) {
//				alert("url地址："+u);
//				alert("订单金额："+d.orderAmount);
//				alert("手机号："+d.mobile);
//				alert("优惠券编号："+d.couponNo);
//				alert("店铺ID："+d.merchId);
//				alert("用户ID："+d.memberId);
//				alert("订单ID："+d.preOrderNo);
//				alert("优惠券类型："+d.type);
		wx.ready(function() {
			$.ajax({
				url: u,
				type: "post",
				data: d,
				async: false,
				dataType: "json",
				success: function(data) {
//					alert(data);
//										alert(data.appid);
//										alert(data.timeStamp);
//										alert(data.nonce_str);
//										alert(data.prepay_id);
//										alert(data.paysign);
					wx.chooseWXPay({
						timestamp: data.timeStamp,
						nonceStr: data.nonce_str,
						package: "prepay_id=" + data.prepay_id,
						signType: 'MD5',
						paySign: data.paysign,
						success: function(res) {
							if (typeof(t) != 'undefined') {
							t.goSuc();
							} else {
								window.location.href = c.sucUrl + "?orderNo=" + c.orderNo + "&memberId=" + c.memberId + "&payAmount=" + c.payAmount;
							}
						},
						cancel: function() {
							if (typeof(t) != 'undefined') {
								t.goCancel();
							} else {
								window.location.href = c.failUrl + "?orderNo=" + c.orderNo + "&memberId=" + c.memberId + "&payAmount=" + c.payAmount;
							}
						},
						fail: function() {
							if (typeof(t) != 'undefined') {
								t.goFail();
							} else {
								window.location.href = c.failUrl + c.orderNo + c.memberId + c.payAmount;
							}
						}
					});
				},
				error: function(data) {
					alert("错误信息："+data.errorMsg);
				}
			});
		});
	};
	return wxPay
});