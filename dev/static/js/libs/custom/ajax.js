define(['jquery'],function($){
	return{
		extend: function(destination, source) { // 一个静态方法表示继承, 目标对象将拥有源对象的所有属性和方法
			for (var property in source) {
				destination[property] = source[property]; // 利用动态语言的特性, 通过赋值动态添加属性与方法
			}
			return destination; // 返回扩展后的对象
		},
		ajaxPost:function(obj) { 
			//console.log('starPost');
			/*
			方法属性
			obj.url 访问地址
			obj.data 访问数据
			obj.success 成功后地址
			obj.error 错误后地址
			obj.beforeSend 访问前
			obj.complete 访问结束
			*/
			var suc = obj.success;
			delete obj.success;
			var postModel = {
				url:'',
				type: 'POST',
				data:{},
				dataType: 'json',
				contentType: 'application/json',
				success:function(e){
					//……成功方法
//					console.log('success'+e);
					var result=e.code=='0'?true:false;
					if(result){
						suc(e);
					}else{
						alert(e.msg);
					}
				},
				complete:function(e){
					//console.log(e)
					//……完成方法
//					console.log('complete'+e);
				},
				error:function(e){
					//……错误方法
//					console.log('error'+e);
					alert('服务器错误');
				},
				beforeSend:function(e){
//					console.log('error'+e);
				}
			};
			postModel = this.extend(postModel,obj);
			postModel.data = JSON.stringify(postModel.data);
			//console.log(postModel);
			//执行ajax
			$.ajax(postModel);
		},
		ajaxGet:function(obj) { 
			var suc = obj.success;
			delete obj.success;
			var getModel = {
				url:'',
				type: 'GET',
				contentType: 'application/json',
				success:function(e){
					//……成功方法
					//console.log(e);
					var result=e.code=='0'?true:false;
					if(result){
						suc(e);
					}else{
						alert(e.msg);
					}
				},
				complete:function(e){
					//console.log(e)
					//……完成方法
//					console.log('complete'+e);
				},
				error:function(e){
					//……错误方法
//					console.log('error'+e);
					alert('服务器错误');
				},
				beforeSend:function(e){
//					console.log('error'+e);
				}
			};
			getModel = this.extend(getModel,obj);
			//console.log(postModel);
			//执行ajax
			$.ajax(getModel);
		}
	};
});