define(['baseSet','jquery'],function(baseSet){
	return function(fn){
		$.ajax({
			url:baseSet.postServer+'/getSignature.html',
			type:'post',
			data:{
				url:window.location.href
			},
			async:true,
			dataType:'json',
			success:function(data){
				fn(data);
			}
		});
	}
})