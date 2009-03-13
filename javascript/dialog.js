var _dialog=new Object();
function dialog(src,call,returnParameter,title){
	_dialog.title="&nbsp;&nbsp;The Dialog Window&nbsp;&nbsp;";
	_dialog.returnValue=false;
	_dialog.returnParameter="returnValue";
	_dialog.interval=null;
	_dialog.call=function(){};
	_dialog.onLoad=function(){
		_dialog.div=document.createElement("div");
		var temp="position:absolute;left:0px;top:0px;z-index:100;background-color:#CCFFFF;"
		_dialog.div.setAttribute("style",temp,0);
		_dialog.div.style.cssText=temp;
		_dialog.p=document.createElement("p");
		_dialog.p.innerHTML=_dialog.title;
		_dialog.a=document.createElement("a");
		_dialog.a.href="javascript:_dialog.close()";
		_dialog.a.innerHTML="Close This Window";
		_dialog.iframe=document.createElement("iframe");
		_dialog.iframe.id="_dialog_iframe";
		_dialog.iframe.name="_dialog_iframe";
		_dialog.p.appendChild(_dialog.a);
		_dialog.div.appendChild(_dialog.p);
		_dialog.div.appendChild(_dialog.iframe);
		document.body.appendChild(_dialog.div);
		_dialog.iframe.width="100%";
		_dialog.iframe.height="1000px";
		_dialog.div.style.width=document.body.offsetWidth+"px";
		_dialog.div.style.height=document.body.offsetHeight+_dialog.div.offsetHeight+_dialog.iframe.offsetHeight+_dialog.p.offsetHeight+"px";
		_dialog.div.style.display="none";
	}
	_dialog.onUnLoad=function(){
		_dialog.returnValue=_dialog.returnValue.innerHTML?_dialog.returnValue.innerHTML:_dialog.returnValue;
		_dialog.returnValue=_dialog.returnValue.value?_dialog.returnValue.value:_dialog.returnValue;
		eval(_dialog.returnParameter+"='"+_dialog.returnValue+"'");
		_dialog.call();
		_dialog.a.innerHTML="Done!!!";
	}
	_dialog.server=function(){
		if(!window._dialog_iframe)return;
		_dialog.returnValue=window._dialog_iframe.document.getElementById("returnValue");
		if(_dialog.returnValue){
			_dialog.onUnLoad();
		}
	}
	_dialog.close=function(){
		clearInterval(_dialog.interval);
		_dialog.div.style.display="none";
		document.body.removeChild(_dialog.div);
	}

	if(call)_dialog.call=call;
	if(returnParameter)_dialog.returnParameter=returnParameter;
	if(title)_dialog.title=title;
	_dialog.onLoad();
	_dialog.iframe.src=src;
	_dialog.div.style.display="";
	_dialog.interval=setInterval("_dialog.server()",500);
	scroll(0,0);
}