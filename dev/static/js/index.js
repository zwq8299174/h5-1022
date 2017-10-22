define(['jquery','tap','Marquee'], function(){
	$('.submit').on('tap',function(){
		console.log(123)
	});
	$('.bottom-bar').liMarquee({
		scrollamount:150
	});
});