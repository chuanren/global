function CLASS_MSN_MESSAGE(id,width,height,caption,title,message,target,action){
	this.id = id;
	this.title = title; 
this.caption= caption; 
this.message= message; 
this.target = target; 
this.action = action;
this.width = width?width:200; 
this.height = height?height:120; 
this.timeout= 3000; 
this.speed = 20; 
this.step = 1; 

this.left = 0; 
this.right = screen.availWidth -1; 
this.top = 0; 
this.bottom = screen.availHeight; 
} 

/* 
* 隐藏消息方法 
*/ 
CLASS_MSN_MESSAGE.prototype.hide = function() 
{ 
if(this.onunload()) 
{ 
this.Pop.hide(); 
if(this.timer) 
{ 
window.clearInterval(this.timer); 
} 
} 
} 

/* 
* 消息卸载事件，可以重冿
*/ 
CLASS_MSN_MESSAGE.prototype.onunload = function() 
{ 
return true; 
} 
/* 
* 消息命令事件，要实现自己的连接，请重写它 
* 
*/ 
CLASS_MSN_MESSAGE.prototype.oncommand = function() 
{ 
alert(this.message); 
this.hide(); 
} 

/* 
* 消息显示方法 
*/ 
CLASS_MSN_MESSAGE.prototype.show = function() 
{ 
var oPopup = window.createPopup(); //IE5.5+ 

this.Pop = oPopup; 

var w = this.width; 
var h = this.height; 
var str = "<DIV id="+this.id+" style='BORDER-RIGHT: #455690 1px solid; BORDER-TOP: #a6b4cf 1px solid; Z-INDEX: 99999; LEFT: 0px; BORDER-LEFT: #a6b4cf 1px solid; WIDTH: " + w + "px; BORDER-BOTTOM: #455690 1px solid; POSITION: absolute; TOP: 0px; HEIGHT: " + h + "px; BACKGROUND-COLOR: #c9d3f3'>" 
str += "<TABLE style='BORDER-TOP: #ffffff 1px solid; BORDER-LEFT: #ffffff 1px solid' cellSpacing=0 cellPadding=0 width='100%' bgColor=#cfdef4 border=0>" 
str += "<TR>" 
str += "<TD style='FONT-SIZE: 12px;COLOR: #0f2c8c' width=30 height=24></TD>" 
str += "<TD style='PADDING-LEFT: 4px; FONT-WEIGHT: normal; FONT-SIZE: 12px; COLOR: #1f336b; PADDING-TOP: 4px' vAlign=center width='100%'>" + this.caption + "</TD>" 
str += "<TD style='PADDING-RIGHT: 2px; PADDING-TOP: 2px' vAlign=center align=right width=19>" 
str += "<SPAN title=关闭 style='FONT-WEIGHT: bold; FONT-SIZE: 12px; CURSOR: hand; COLOR: red; MARGIN-RIGHT: 4px' id='btSysClose' >×</SPAN></TD>" 
str += "</TR>" 
str += "<TR>" 
str += "<TD style='PADDING-RIGHT: 1px;PADDING-BOTTOM: 1px' colSpan=3 height=" + (h-28) + ">" 
str += "<DIV style='BORDER-RIGHT: #b9c9ef 1px solid; PADDING-RIGHT: 8px; BORDER-TOP: #728eb8 1px solid; PADDING-LEFT: 8px; FONT-SIZE: 12px; PADDING-BOTTOM: 8px; BORDER-LEFT: #728eb8 1px solid; WIDTH: 100%; COLOR: #1f336b; PADDING-TOP: 8px; BORDER-BOTTOM: #b9c9ef 1px solid; HEIGHT: 100%'>" + this.title + "<BR><BR>" 
str += "<DIV style='WORD-BREAK: break-all' align=left><A href='javascript:void(0)' hidefocus=true id='btCommand'><FONT color=#ff0000>" + this.message + "</FONT></A></DIV>" 
str += "</DIV>" 
str += "</TD>" 
str += "</TR>" 
str += "</TABLE>" 
str += "</DIV>" 

oPopup.document.body.innerHTML = str; 

var docWidth = this.right; 
var docHeight = this.bottom-h; 
var offset = screen.height - screen.availHeight; 

var me = this; 
var timer; 

var fun = function() 
{ 
oPopup.show(docWidth-w, docHeight + offset, w, h); 
if(offset <= 0) 
{ 
window.clearInterval(timer); 
} 
offset = offset - me.step; 

} 

timer = window.setInterval(fun,this.speed) 



var btClose = oPopup.document.getElementById("btSysClose"); 

btClose.onclick = function() 
{ 
me.hide(); 
} 

var btCommand = oPopup.document.getElementById("btCommand"); 
btCommand.onclick = function() 
{ 
me.oncommand(); 
} 

this.timer = timer; 

} 

/* 
** 设置速度方法 
**/ 
CLASS_MSN_MESSAGE.prototype.speed = function(s) 
{ 
var t = 20; 
try 
{ 
t = praseInt(s); 
} 
catch(e){} 

this.speed = t; 
} 
/* 
** 设置步长方法 
**/ 
CLASS_MSN_MESSAGE.prototype.step = function(s) 
{ 
var t = 1; 
try 
{ 
t = praseInt(s); 
} 
catch(e){} 

this.step = t; 
} 

CLASS_MSN_MESSAGE.prototype.rect = function(left,right,top,bottom) 
{ 
try 
{ 
this.left = left?left:0; 
this.right = right?right:screen.availWidth -1; 
this.top = top?top:0; 
this.bottom = bottom?bottom:screen.availHeight; 
} 
catch(e) 
{} 
}

function message(uid_,title_,content_,hint_,width_,height_){
	var msg_=new CLASS_MSN_MESSAGE(uid_,width_,height_,title_,content_,hint_);
	msg_.show();
}
