//version: Liu ChuanRen, 05/14/07
var _xhr=new Object();
//callbacks: onerror, oncreate, oninitialized, onloading, onloaded, oninteractive, oncomplete, onsuccess, onfailure
_xhr.responders=new Object();
_xhr.responders.events=["oninitialized","onloading","onloaded","oninteractive","oncomplete"];
_xhr.responders.callbacks=new Array();
_xhr.responders.callback=function(on){
	var i=0;
	while(i<_xhr.responders.callbacks.length){
		if(_xhr.responders.callbacks[i]&&typeof _xhr.responders.callbacks[i][on]=='function'){
			_xhr.responders.callbacks[i][on]();
		}
		i++;
	}
}
_xhr.responders.register=function(responder){
	_xhr.responders.callbacks[_xhr.responders.callbacks.length]=responder;
}
_xhr.responders.unregister=function(responder){
	var i=0;
	while(i<_xhr.responders.callbacks.length){
		if(_xhr.responders.callbacks[i]==responder){
			_xhr.responders.callbacks[i]=null;
			break;
		}
		i++;
	}
}
//options
_xhr.options=new Object();
_xhr.options.asynchronous=true;
_xhr.options.contentType="application/x-www-form-urlencoded";
_xhr.options.encoding="utf-8";
_xhr.options.method="post";
_xhr.options.parameters="";
//create
_xhr.create=function(){	
	var xmlHttp;
	if(window.ActiveXObject){
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	else if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}
	return xmlHttp;
}
//xhr
function xhr(url,object){//[object:onsuccess,onfailure,parameters,method,asynchronous]
	var _this=this;
	this.url=url;
	object=object?object:this;
	this.onsuccess=object.onsuccess?object.onsuccess:function(){return;};
	this.onfailure=object.onfailure?object.onfailure:function(){return;};
	this.parameters=(object.parameters?object.parameters:"")+"&"+_xhr.options.parameters;
	this.method=object.method?object.method:_xhr.options.method;
	this.asynchronous=object.asynchronous?object.asynchronous:_xhr.options.asynchronous;
	this.req=_xhr.create();
	if(this.req)_xhr.responders.callback("oncreate");
	else _xhr.responders.callback("onerror");
	this.req.onreadystatechange=function(){
		_xhr.responders.callback(_xhr.responders.events[_this.req.readyState]);
		if(_this.req.readyState==4){
			if(_this.req.status==200){
				_xhr.responders.callback("onsuccess");
				_this.onsuccess();
			}else{
				_xhr.responders.callback("onfailure");
				_this.onfailure();
			}
		}
	}
	this.req.open(this.method,this.url,this.asynchronous);
	this.req.setRequestHeader("Content-Type",_xhr.options.contentType+"; charset="+_xhr.options.encoding);
	this.req.send(this.parameters);
}
//updater
_xhr.updater=function(container,url,todo,object){//I will use xhr(url,object)
	if(!object)object=new Object;
	if(!todo)todo=function(){return;};
	object.onsuccess=function(){
		container.innerHTML=this.req.responseText;
		todo();
	}
	this.xhr=new xhr(url,object);
}