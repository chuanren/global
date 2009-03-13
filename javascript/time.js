function time(str){
	var now;
	if(str)now=new Date(str);
	else now=new Date();
	var year=now.getYear();
	var month=now.getMonth()+1;
	var date=now.getDate();
	var day=now.getDay();
	var dayname=new Array("Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat.");
	return now.toLocaleString()+' '+dayname[day];
	return month+"/"+date+"/"+year+" "+dayname[day];
}