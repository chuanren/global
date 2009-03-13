//version: Liu ChuanRen, 04/16/08
var _marquee={};
function marquee(content,option){
	this.id=new Date().getTime()+Math.random();
	_marquee[this.id]=this;
	this.content=content;
	this.option=option||{};
	this.setOption();
	this.createElement();
	this.setStyle();
	document.write(this.toHTML());
	this.getElement();
	this.element.onmouseover=function(){
		var _this=_marquee[this.id];
		clearInterval(_this.interval)
	}
	this.element.onmouseout=function(){
		var _this=_marquee[this.id];
		_this.interval=setInterval(_this.run(_this),100);
	}
	this.position=0;
	this.element.onmouseout.call(this.element);
}
marquee.prototype={
	createElement: function(){
		this.element=document.createElement("div");
		this.element.id=this.id;
		this.childs=[document.createElement("div"),document.createElement("div")];
		this.element.appendChild(this.childs[0]);
		this.element.appendChild(this.childs[1]);
		this.childs[0].innerHTML=this.childs[1].innerHTML=this.content;
	},
	getElement: function(){
		this.element=document.getElementById(this.id);
		this.childs=this.element.childNodes;
	},
	run: function(_this){
		var f;
		if(_this.option.direction=="x"){
			f=function(){
				_this.position+=_this.option.speed;
				_this.position%=_this.option.width;
				_this.childs[0].style.marginLeft=-_this.position+"px";
				_this.childs[1].style.marginLeft=_this.option.width-_this.position+"px";
			}
		}else{
			f=function(){
				_this.position+=_this.option.speed;
				_this.position%=_this.option.height;
				_this.childs[0].style.marginTop=-_this.position+"px";
			}
		}
		return f;
	},
	setOption: function(){
		//direction, speed, width, height
		this.option.direction||(this.option.direction="x");
		this.option.speed||(this.option.speed=1);
		var o=document.createElement("div");
		o.style.position="absolute";
		o.innerHTML=this.content;
		document.body.appendChild(o);
		this.option.width||(this.option.width=o.offsetWidth);
		this.option.height||(this.option.height=o.offsetHeight);
		document.body.removeChild(o);
	},
	setStyle: function(){
		this.element.style.width=this.childs[0].style.width=this.childs[1].style.width=this.option.width+"px";
		this.element.style.height=this.childs[0].style.height=this.childs[1].style.height=this.option.height+"px";
		this.element.style.overflow=this.childs[0].style.overflow=this.childs[1].style.overflow="hidden";
		this.childs[0].style.margin=this.childs[1].style.margin="0px";
		if(this.option.direction=="x"){
			this.childs[1].style.marginLeft=this.option.width+"px";
			this.childs[1].style.marginTop=-this.option.height+"px";
		}
	},
	toHTML: function(){//with id, style
		var o=document.createElement("div");
		o.appendChild(this.element);
		return o.innerHTML;
	}
}
