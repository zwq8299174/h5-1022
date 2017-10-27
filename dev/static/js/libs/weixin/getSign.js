define(['baseSet','jquery'],function(baseSet){
	return {
		jsTicket:function(u,fn){
			$.ajax({
				url:baseSet.wxServer+baseSet.wxPath+'/getSignature.htm',
				type:'post',
				data:{
					url:u
				},
				async:true,
				dataType:'json',
				success:function(data){
					fn(data);
				}
			});
		}
	}
})