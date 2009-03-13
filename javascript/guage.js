msg_guage=new Array();
//返回数组
function guage_str(char_,length_,uid_){
		var str_=new Array(length_+1);
		for(var i=1;i<=length_;i++){
			var str_1="";
			for(var j=1;j<=i;j++)str_1+=char_;
			str_[i]=str_1;
		}
		str_[0]=document.getElementById(uid_);
		return str_;
}
//循环函数
function guage_(uid_,i,delay_){
	msg_guage[uid_][0].innerHTML=msg_guage[uid_][i];
	i++;
	if(i>=msg_guage[uid_].length)i=1;
	var cmd="guage_('"+uid_+"',"+ i +","+delay_+")";
	window.setTimeout(cmd,delay_);
}
//调用此函数即可
function guage(uid_,char_,length_,delay_){	
	document.write("<div id="+uid_+"></div>");
	msg_guage[uid_]=guage_str(char_,length_,uid_);
	guage_(uid_,1,delay_);
}
//例如：
/*
<script language=javascript src=guage.js></script>
<body>
<script language=javascript>guage("guagefield","*",20,60);</script>
<script language=javascript>guage("field","*",20,60);</script>
</body>
*/