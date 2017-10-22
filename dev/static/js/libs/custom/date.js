define(['moment'],function(moment){
	
//	2015-04-28
//	console.log(moment().year());
	var endDate = '2010-1-01';
	var nowYear = moment().year();
	var year = moment().year();
	var month = moment().month()+1;
	var endYear = parseInt(endDate.split('-')[0]);
	var endMonth = parseInt(endDate.split('-')[1]);
	var endDay= parseInt(endDate.split('-')[2]);
//	var months = [12,11,10,9,8,7,6,5,4,3,2,1];
	var months = [1,2,3,4,5,6,7,8,9,10,11,12];
	// console.log(month);
	var dateObj = {
		day:[],
		month:[],
		quarter:[],
		year:[endYear+'-'+nowYear]
	};
	for(;year>=endYear;year--){
		var tmp;
		if(year==nowYear){
			tmp = {
				year:year,
				months:months.slice(0,months.indexOf(month)+1)
			};
			dateObj.day.unshift(tmp);
		}else if(year==endYear){
			tmp = {
				year:year,
				months:months.slice(months.indexOf(endMonth))
			};
			dateObj.day.unshift(tmp);
		}else{
			tmp = {
				year:year,
				months:months
			};
			dateObj.day.unshift(tmp);
		};
		dateObj.month.unshift(year);
		dateObj.quarter.unshift(year);
//		console.log(dateObj);
	};
	return dateObj;
});