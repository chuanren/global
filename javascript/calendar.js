//version Liu ChuanRen 05/11/08
var _calendar=new Object();
_calendar.targetObject=null;
_calendar.position=new Array(50,50);

_calendar.hidden=function(){
    var divNode=document.getElementById("myCalendarDIV");
    if(divNode)document.body.removeChild(divNode);
    return false;
}

_calendar.show=function(targetInput,initStr){
    if(targetInput)
    {
        _calendar.targetObject=targetInput;
    }
    if(_calendar.targetObject&&_position){
		_calendar.position=getPosition(_calendar.targetObject);
    }
   
    var curDate=_calendar.StrToDate(initStr);
    var preYear=new Date(curDate);        //上一年
    preYear.setFullYear (curDate.getFullYear()-1);
   
    var nextYear=new Date(curDate);        //下一年
    nextYear.setFullYear (curDate.getFullYear()+1);
   
    var preMonth=new Date(curDate);        //上一月
    preMonth.setMonth(curDate.getMonth()-1);
   
    var nextMonth=new Date(curDate);        //下一月
    nextMonth.setMonth(curDate.getMonth()+1);
   
    if( _calendar.subtractDate(nextMonth,curDate)>1 ) //确定下一个月
        nextMonth.setMonth(nextMonth.getMonth()-1);

    _calendar.hidden();
   
    divNode =document.createElement("DIV");
    document.body.appendChild(divNode);
    var atrr = document.createAttribute("id");
    atrr.value="myCalendarDIV";
    divNode.setAttributeNode(atrr);
    divNode.style.cssText="z-index:20080504; position:absolute; left:"+_calendar.position['x']+"px; top:"+_calendar.position['y']+"px;";

    var tableStr="<table style=\"font-family: 'Arial, Helvetica, sans-serif'; font-size: 12px; background-color: #4682b4;\">\n"+
                "<tr><td align=\"center\" colspan=\"7\"><table width=\"95%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n"+
                "<tr><td align=\"left\"><a href=\"#\" title=\"上一年\" onClick=\"javascript: return _calendar.show(null,'"+_calendar.DateToStr(preYear)+"');\"><<</a></td>\n"+
                "<td align=\"left\"><a href=\"#\" title=\"上一月\" onClick=\"javascript: return _calendar.show(null,'"+_calendar.DateToStr(preMonth)+"');\"><</a></td>\n"+
                "<td align=\"center\"><a href=\"#\" title=\"关闭\" onClick=\"javascript: return _calendar.doGetDate('"+_calendar.DateToStr(curDate)+"');\">"+_calendar.DateToStr(curDate)+"</a></td>\n"+
                "<td align=\"right\"><a href=\"#\" title=\"下一月\" onClick=\"javascript: return _calendar.show(null,'"+_calendar.DateToStr(nextMonth)+"');\">></a></td></td>\n"+
                "<td align=\"right\"><a href=\"#\" title=\"下一年\" onClick=\"javascript: return _calendar.show(null,'"+_calendar.DateToStr(nextYear)+"');\">>></a></td>\n"+
                "<td align=\"right\"> <a href=\"#\" title=\"关闭\" onClick=\"javascript: return _calendar.hidden();\">X</a></td>\n"+
                "</tr></table></td>\n"+
                "</tr>\n"+
                "<tr><td style=\"background-color: #87cefa;\">周一</td>\n"+
                "<td style=\"background-color: #87cefa;\">周二</td>\n"+
                "<td style=\"background-color: #87cefa;\">周三</td>\n"+
                "<td style=\"background-color: #87cefa;\">周四</td>\n"+
                "<td style=\"background-color: #87cefa;\">周五</td>\n"+
                "<td style=\"background-color: #87cefa;\">周六</td>\n"+
                "<td style=\"background-color: #87cefa;\">周日</td>\n"+
                "</tr>\n";
    var firstDate=new Date(curDate);        //第一天
    firstDate.setDate(1);
    var startDay=(6+firstDate.getDay())%7;    //本月第一天是星期几
   
    var endDate=new Date(nextMonth);        //第一天
    endDate.setDate(1);

    //如果第一天不是星期一
    //后退到上一月开始输出
    if(startDay>0)    firstDate.setDate(1-startDay);
    var count=0;
    while(_calendar.compareToDate(firstDate,endDate)==-1){
        tableStr+="<tr align=\"center\">"
        for(var i=0; i<7; i++)
        {//星期的开始位置
            d=firstDate.getDate();

            if(_calendar.compareToDate(firstDate,curDate)==0)  //输出所选择的日期
                tableStr+="<td style=\"background-color: #ffb6c1;\"><a href=\"#\" onClick=\"javascript: return _calendar.doGetDate('"+_calendar.DateToStr(firstDate)+"');\">"+_calendar.fillZero(d)+"</a></td>"
            else if(firstDate.getDay()==0 || firstDate.getDay()==6)
                tableStr+="<td style=\"background-color: #ddf8e3;\"><a href=\"#\" onClick=\"javascript: return _calendar.doGetDate('"+_calendar.DateToStr(firstDate)+"');\">"+_calendar.fillZero(d)+"</a></td>"
            else if(firstDate.getMonth()!=curDate.getMonth()) //设置不是本月的日期背景颜色
                tableStr+="<td style=\"background-color: #e4e4e4;\"><a href=\"#\" onClick=\"javascript: return _calendar.doGetDate('"+_calendar.DateToStr(firstDate)+"');\">"+_calendar.fillZero(d)+"</a></td>"
            else
                tableStr+="<td style=\"background-color: #fafafa;\"><a href=\"#\" onClick=\"javascript: return _calendar.doGetDate('"+_calendar.DateToStr(firstDate)+"');\">"+_calendar.fillZero(d)+"</a></td>"

            firstDate.setDate(d+1);//下一天
        }
        tableStr+="</tr>\n"
    }
    tableStr+="</table>\n";
    divNode.innerHTML=tableStr;

    return false;//divNode;
}

_calendar.doGetDate=function(strDate){
    if(_calendar.targetObject!=null)
        _calendar.targetObject.value=strDate;
    _calendar.hidden();
    return false;
}

//strDate 的格式是 yyyy-mm-dd, 如果格式不正确返回当前日期
_calendar.StrToDate=function(strDate){
	if(!strDate)return new Date();
    var splitArray=strDate.split("-")
    if(splitArray.length!=3)return new Date();
    for(var i=0; i<3; i++){
        if(isNaN(splitArray[i])) return new Date();
    }
    return new Date(splitArray[0],splitArray[1]-1,splitArray[2]);
}

//日期转化为字符串格式： yyyy-mm-dd
_calendar.DateToStr=function(dt){
    var str="";
    var y,m,d;
    if(dt.getFullYear){
        y=dt.getFullYear();
        m=dt.getMonth()+1;  //1-12
        d=dt.getDate();
        str=""+y+"-"+_calendar.fillZero(m)+"-"+_calendar.fillZero(d);
    }
    return str;
}

//填充0
_calendar.fillZero=function(num) {
  return (num    < 10) ?  "0"+num : num ;
}

//比较日期date1,date2，date1>date2=1
_calendar.compareToDate=function(date1,date2) {
    var y= date1.getFullYear() -date2.getFullYear();
    var m= date1.getMonth()-date2.getMonth();
    var d= date1.getDate() -date2.getDate();
    if(y==0 && m==0 && d==0 ) return 0;
    else if(y>0) return 1;
    else if(y==0 && m>0 ) return 1;
    else if(y==0 && m==0 && d>0 ) return 1;

    else if(y<0) return -1;
    else if(y==0 && m<0 ) return -1;
    else if(y==0 && m==0 && d<0 ) return -1;
}

//日期date1,date2和相减的月数
//返回date1-date2，精确到月
_calendar.subtractDate=function(date1,date2) {
    return ((date1.getFullYear() -date2.getFullYear())*12+(date1.getMonth()-date2.getMonth()));
}

function calendar(input,value,x,y){
	if(value)input.value=value;
	if(x&&y)_calendar.position=new Array(x,y);
	input.onclick=function(){
		_calendar.show(this,this.value);
	}
}
