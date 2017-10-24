//---------------------------------
//Site:  H5 - API-module
//Author: Clearlove 7*
//Updated: 2016.4.7
//Version: 1.0
//---------------------------------
define(['ajax','baseSet'],function(a,b){
	return{
		getProvince:function(suc){
			a.ajaxPost({
				url:b.postServer+'campaign/getProvinceList',
				success:function(data){
					suc(data);
				}
			});
		},
		getCity:function(id,suc){
			a.ajaxPost({
				url:b.postServer+'campaign/getCityList',
				data:{
					provinceId:id
				},
				success:function(data){
					suc(data);
				}
			});
		},
		login:function(postData,suc,con){
			a.ajaxPost({
				url:'/v1/login',
				data:postData,
				success:function(data){
					suc(data);
				},
				complete:function(data){
					con(data);
				}
			});
		}
	};
});
