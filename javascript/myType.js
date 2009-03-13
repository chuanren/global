//version: Liu ChuanRen, 05/04/08
/*
all things in constructor.prototype will be append and NOT cover to all instances
all instances of any constructor have method toString, but this method can not be visited when instance.each().
*/
Object.prototype.extend=function(object){
	var k;
	for(k in object)this[k]=object[k];
	return this;
};
//the order is important: 1, 2, .... and 0 must be the last!
//1: Array
Array.prototype.extend({
	each: function(f,stopValue){
		var i;
		for(i=0;i<this.length;i++){
			if(stopValue==f.call(this,this[i],i)&&arguments.length==2)return i;
		}
	},
	toJSON: function(){
		var a=[];
		this.each(function(object){
			a.push(object.toJSON());
		});
		return '['+a.join(',')+']';
	}
});
//2: Boolean
Boolean.prototype.extend({
	toJSON: function(){
		return this.toString();
	}
});
//3: Date
Date.prototype.extend({
	toJSON: function(){
		return this.toObject().toJSON();
	},
	toObject: function(){
		return {
			j:this.getDate(),//1-31
			G:this.getHours(),//0-23
			i:this.getMinutes(),//0-59
			n:this.getMonth()+1,//1-12
			s:this.getSeconds(),//0-59
			Y:this.getFullYear()//2008
		};
	}
});
//4: Element
var Element=function(arg){
	$O(arg);
	$O(arg.style);
	$A(arg.childNodes).each(function(value){
		if(value.nodeType==1)new Element(value);
	});
	arg.extend(Element.prototype);
	return arg;
};
Element.prototype.extend({
	cumulativeOffset: function(){
		var l=0,t=0,e=this;
		do{
			l+=this.offsetLeft||0;
			t+=this.offsetTop||0;
			e=e.offsetParent;
		}while(e);
		return {left:l,top:t};
	},
	scrollTo: function(){
		var position=this.cumulativeOffset();
		scrollTo(position.left,position.top);
	},
	toHTML: function(){
		var o=document.createElement("div");
		o.appendChild(this);
		return o.innerHTML;
	},
	toMarquee: function(options){
		if(this._marquee)return;
		this.style.overflow="visible";
		this._marquee={
			x:0,
			y:0,
			width: this.offsetWidth,
			height: this.offsetHeight,
			xSpeed: -1,
			ySpeed: 0,
			interval: 100
		}.extend(options||{});
		this.style.overflow="hidden";
		this.style.extend({
			width: this.offsetWidth+"px",
			height: this.offsetHeight+"px"
		});
		this.update("<div>"+("<div>"+this.innerHTML+"</div>").times(9)+"</div>");
		this.childNodes[0]._marquee_left=-this._marquee.width;
		this.childNodes[0]._marquee_top=-this._marquee.height;
		this.childNodes[0].style.extend({
			overflow: 'hidden',
			width: this._marquee.width*3+"px",
			height: this._marquee.height*3+"px",
			marginLeft: -this._marquee.width+"px",
			marginTop: -this._marquee.height+"px"
		});
		$A(this.childNodes[0].childNodes).each(function(value,index){
			value.style.marginLeft=index%3*this._marquee.width+"px";
			if(index%3){
				value.style.marginTop=-this._marquee.height+"px";
			}
			value.style.extend({
				overflow: "hidden",
				width: this._marquee.width+"px",
				height: this._marquee.height+"px"
			});
		}.bind(this));
		this.observe("mouseover",function(){
			clearInterval(this._marquee.interval_id);
		});
		this.observe("mouseout",function(){
			clearInterval(this._marquee.interval_id);
			this._marquee.interval_id=this._marqueeInterval.bind(this).interval(this._marquee.interval);
		});
		this._marquee.interval_id=this._marqueeInterval.bind(this).interval(this._marquee.interval);
		return this;
	},
	_marqueeInterval: function(){//document.title=this.childNodes[0]._marquee_top;
		this._marquee.x+=this._marquee.xSpeed;
		this._marquee.x%=this._marquee.width;
		this._marquee.y+=this._marquee.ySpeed;
		this._marquee.y%=this._marquee.height;
		this.childNodes[0].style.marginLeft=this.childNodes[0]._marquee_left+this._marquee.x+"px";
		this.childNodes[0].style.marginTop=this.childNodes[0]._marquee_top+this._marquee.y+"px";
	},
	toSelect: function(valueArray,titleArray,options){
		titleArray||(titleArray=valueArray);
		options||(options={});
		var id,select;
		if(id=this._select_id){
			select=$("_select_"+id);
			select.update("");
		}else{
			id=this.getId();
			this._select_id=id;
			this.style.display="none";
			select=$(document.createElement("select"));
			select.id="_select_"+id;
			select.multiple=options.multiple||null;
			select.observe("change",function(event){
				var a=[];
				$A(this.childNodes).each(function(value,index){
					if(value.selected){
						a.push(value.value);
					}
				}.bind(this));
				this.nextSibling.value=a.join(",");
				this.nextSibling.fire("change");
			});
			this.parentNode.insertBefore(select,this);
		}
		this._select_valueString=","+this.value+",";
		this._select_hasValue=false;
		valueArray.each(function(value,index){
			var option=$(document.createElement("option"));
			option.value=value;
			option.update(titleArray[index]);
			if(this._select_valueString.indexOf(","+value+",")>-1){
				option.selected=1;
				this._select_hasValue=true;
			}
			select.appendChild(option);
		}.bind(this));
		if(!this._select_hasValue)this.value=valueArray[0];
		return this;
	},
	update: function(html){
		this.innerHTML=html;
		return new Element(this);
	}
});
//5: Event
var Event=function(event){
	$O(event);
	event.extend(Event.prototype);
}
Event.prototype.extend({
	element: function(arg){
		//so always use element as instead of target or srcElement.
		var element=this.target||this.srcElement;
		if(this.target.nodeType==3)this.target.parentNode;
		if(arg){
			arg=arg.toLowerCase();
			while(element&&element.nodeName&&element.nodeName.toLowerCase()!=arg){
				if(element==element.parentNode)break;
				element=element.parentNode;
			}
		}
		return element||null;
	},
	pointer: function(){
		return{
			x:this.pageX||(this.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)),
			y:this.pageY||(this.clientY+(document.documentElement.scrollTop||document.body.scrollTop))
		};
	},
	stop: function(){
		try{
			this.preventDefault();
			this.stopPropagation();
		}catch(e){
			this.returnValue=false;
			this.cancelBubble=true;
		}
		this.stopped=true;
	}
});
//6: Function
Function.prototype.extend({
	bind: function(){
		//example: f.bind(a,x,y).bind(b,z)()=f.bind(a,x,y,z)()=f(x,y,z). f has this for a.
		var _this=this,argv=$A(arguments),object=argv.shift();
		return function(){
			return _this.apply(object,argv.concat($A(arguments)));
		}
	},
	confirm: function(){
		var argv=$A(arguments),message=argv.shift();
		return function(){
			if(confirm(message))return this.apply(window,argv);
		}.bind(this);
	},
	interval: function(){
		var argv=$A(arguments),interval=argv.shift();
    	return setInterval(function(){
			return this.apply(window,argv);
		}.bind(this,argv),interval);
	},
	timeout: function(){
		var argv=$A(arguments),timeout=argv.shift();
    	return setTimeout(function(){
			return this.apply(window,argv);
		}.bind(this,argv),timeout);
	}
});
//7: Number
Number.prototype.extend({
	toJSON: function(){
		return this.toString();
	}
});
//8: String
String.prototype.extend({
	each: function(f,stopValue){
		return this.toArray().each(f,stopValue);
	},
	inspect: function(){
		return "\""+this+"\"";
	},
	times: function(count){
		return count<1?"":new Array(count+1).join(this);
	},
	toArray: function(){
		return this.split("");
	},
	toJSON: function(){
		return this.inspect();
	}
});
//9: XMLHttpRequest
if(!XMLHttpRequest){
	//here is interesting!
	var XMLHttpRequest=function(){
		this._this=(ActiveXObject&&(new ActiveXObject('Microsoft.XMLHTTP')||new ActiveXObject('Msxml2.XMLHTTP')))
				||{
					readyState: -1,
					status: 0,
					responseText: "",
					responseXML: null,
					open: function(){},
					setRequestHeader: function(){},
					send: function(){},
					getResponseHeader: function(){},
					getAllResponseHeaders: function(){}
				};
		this._this.onreadystatechange=function(){
			this.tryGet("readyState",-1);
			this.tryGet("status",0);
			this.tryGet("responseText","");
			this.tryGet("responseXML",null);
			this.onreadystatechange();
		}.bind(this);
	};
	XMLHttpRequest.prototype.extend({
		tryGet: function(name,value){
			try{
				this[name]=this._this[name]||value;
			}catch(e){this[name]=value;}
		},
		open: function(){
			return this._this.open(arguments[0],arguments[1],arguments[2]);
		},
		setRequestHeader: function(){
			return this._this.setRequestHeader(arguments[0],arguments[1]);
		},
		send: function(){
			return this._this.send(arguments[0]);
		},
		getResponseHeader: function(){
			return this._this.getResponseHeader(arguments[0]);
		},
		getAllResponseHeaders: function(){
			return this._this.getAllResponseHeaders();
		},
		onreadystatechange: function(){
		}
	});
}
XMLHttpRequest.prototype.extend({
	responders: [{
		onComplete: function(request){
			request.responseHeaders=request.getAllResponseHeaders();
		}
	}],
	events: ['Uninitialized','Loading','Loaded','Interactive','Complete'],
	onEvent: function(){
		var f;
		this.responders.each(function(value,index){
			var f;
			if(f=value["on"+this.state])f(this);
		}.bind(this));
		if(f=this.options["on"+this.state])f(this);
	},
	fire: function(url,options){
		this.url=url;
		this.options={
			method:       'post',
			asynchronous: true,
			contentType:  'application/x-www-form-urlencoded',
			encoding:     'UTF-8',
			parameters:   ''
		}.extend(options||{});
		this.options.method=this.options.method.toUpperCase();
		this.state="Create";
		this.onEvent();
		this.open(this.options.method,this.url,this.options.asynchronous);
		this.onreadystatechange=function(){
			this.state=this.events[this.readyState];
			this.onEvent();
			if(this.state=="Complete"){
				if(!this.status||(this.status>=200&&this.status<300)){
					this.state="Success";
				}else{
					this.state="Failure";
				}
				this.onEvent();
			}
		}.bind(this);
		[
			{name:'Accept',value: 'text/javascript, text/html, application/xml, text/xml, */*'},
			{name:'Content-type',value:this.options.contentType+"; charset="+this.options.encoding},
			{name:'Connection',value:'close'}
		].each(function(value,index){
			this.setRequestHeader(value.name,value.value);
		}.bind(this));
		this.send(this.options.parameters);
	}
});
//0: Object
Object.prototype.extend({
	each: function(f,stopValue){
		//f(value,index), if f returns stopValue, loop will be stoped by each's returning current index.
		var k;
		for(k in this){
			if(stopValue==f.call(this,this[k],k)&&arguments.length==2)return k;
		}
	},
	fire: function(name,memo){
		memo||(memo={});
		var f,event;
		if(document.createEvent){
			switch(name.toLowerCase()){
				case "blur":case "change":case "load":case "unload":
					event=document.createEvent("HTMLEvents");
					event.initEvent(name,true,true);
					this.dispatchEvent(event);
					break;
				case "keydown":case "keypress":case "keyup":
					event=document.createEvent("KeyboardEvent");
					event.initKeyEvent(name,true,true,null,false,false,false,false,9,0);
					this.dispatchEvent(event);
					break;
				case "click":case "dblclick":
				case "mousedown":case "mousemove":case "mouseover":case "mouseout":case "mouseup":
					event=document.createEvent("MouseEvents");
					event.initMouseEvent(name,true,true,window,0,0,0,0,0,false,false,false,false,0,null);
					this.dispatchEvent(event);
					break;
				case "focus":case "reset":case "select":case "submit":
					this[name].bind(this).timeout(0);
					break;
				default:
					event=document.createEvent("UIEvents");
					event.initUIEvent(name,true,true,window,1);
					this.dispatchEvent(event);
					break;
			}
		}else if(document.createEventObject){
			event=document.createEventObject();
			event.eventType="on"+name;
			event.eventName=name;
			event.memo=memo;
			this.fireEvent(event.eventType,event);
		}else if(f=this["on"+name]){
			f.call(this);
		}
		return event;
	},
	getId: function(){
		return new Date().getTime()+Math.random();
	},
	indexOf: function(object){
		return this.each(function(value,index){
			if(value===object)return true;
		},true);
	},
	keys: function(){
		var a=[];
		this.each(function(value,index){
			a.push(index);
		});
		return a;
	},
	observe: function(name,f){
		//here give event as first parameter to f. and this is not wrong as window. maybe srcElement.
		var wrapper=function(event){
			return f.call(this,event);
		}.bind(this);
		if(false&&this.addEventListener){
			this.addEventListener(name,wrapper,false);
		}else if(false&&this.attachEvent){
			this.attachEvent("on"+name,wrapper);
		}else{
			//use this because i can control the order and the event will have things in Event.prototype.
			var old=this["on"+name];
			this["on"+name]=function(event){
				event||(event=window.event);
				new Event(event);
				if(old)old.call(this,event);
				f.call(this,event);
			}.bind(this);
			
		}
	},
	toArray: function(){
		if(typeof this.length=="number"){
			var i,a=[];
			for(i=0;i<this.length;i++){
				if(typeof this[i]=="undefined")return this.values();
				a.push(this[i]);
			}
			return a;
		}
		return this.values();
	},
	toJSON: function(){
		var k,a=[];
		for(k in this){
			if(typeof this[k]!="function"){
				a.push(k.toJSON()+":"+(this[k]===null?"null":this[k].toJSON()));
			}
		}
		return '{'+a.join(',')+'}';
	},
	values: function(){
		var a=[];
		this.each(function(value,index){
			a.push(value);
		});
		return a;
	}
});
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
var $E=function(arg){
	if(arguments.length>1){
		for(var i=0,a=[];i<arguments.length;i++)
			a.push($E(arguments[i]));
		return a;
	}
	if(typeof arg=="string")arg=document.getElementById(arg);
	arg=new Element(arg);
	return arg;
};
var $A=function(arg){//return array from arg
	try{
		if(arg.toArray)return arg.toArray();
		return Object.prototype.toArray.call(arg);
	}catch(e){return [];}
}
var $O=function(arg){
	//some things instanceof Object is false.
	try{
		Object.prototype.each(function(value,index){
			if(typeof this[index]=="undefined"){
				//bind?
				//if(typeof value=="function")value=value.bind(this);
				this[index]=value;
			}
		}.bind(arg));
		arg.each(function(value,index){
			if(!arg.extend)$O(value);
		});
	}catch(e){}
	return arg;
}
$O(window);
var $=$E;
window.observe("load",function(){
	//$(document.body);
});
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
//test 1/3.php in opera, rewrite marquee
