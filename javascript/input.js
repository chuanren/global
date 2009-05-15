/**
Enhance input elements, perhaps useful for other elements too. method(input, option):
readOnly	(need: )
select	(need: )
liveSelect	(need: position.js)
calendar	(calendar.js)
editor	(need: editor.js)
fullScreen	(need: prototype.js)
*/
var _input={};
_input._id=-1;
_input.select={};
function inputGetId(){
	_input._id+=1;
	return "["+_input._id+"]";
}
function inputReadOnly(input){
	input.setAttribute("readonly","1",0);
}
function inputSelect(input,value,name,option){
	if(!value)value=[];
	if(!name)name=value;
	if(!option)option={};
	var id=inputGetId();
	input.valueArray=input.value.split(",");
	input.valueString=","+input.value+",";
	var select;
	if(select=document.getElementById("select"+input.getAttribute("_input_id"))){
		while(select.childNodes[0])select.removeChild(select.childNodes[0]);
	}else{
		select=document.createElement("select");
		select.id="select"+id;
		input.setAttribute("_input_id",id);
	}
	if(option['multiple'])select.setAttribute("multiple",1);
	var i,o;
	for(i=0;i<value.length;i++){
		o=document.createElement("option");
		o.value=value[i];
		if(input.valueArray.indexOf(value[i])>-1||input.valueString.indexOf(","+value[i]+",")>-1){
			o.setAttribute("selected","1",0);
			select.setAttribute("_hasValue","1",0);
		}
		o.innerHTML=name[i];
		select.appendChild(o);
	}
	if(!select.getAttribute("_hasValue")){
		input.value=value[0];
	}
	select.onchange=function(){
		var i,o;
		o=this.getElementsByTagName("option");
		this.nextSibling.valueArray=[];
		for(i=0;i<o.length;i++){
			if(o[i].selected){//getAttribute("selected") does not work.
				this.nextSibling.valueArray.push(o[i].value);
			}
		}
		this.nextSibling.value=this.nextSibling.valueArray.join(",");
		if(this.nextSibling.onchange){
			this.nextSibling.onchange();
		}
	}
	input.style.display="none";
	inputReadOnly(input);
	input.parentNode.insertBefore(select,input);
}
function inputLiveSelect(input,value,name,option){
	//now this do not work for live
	if(!value)value=[];
	if(!name)name=value;
	if(!option)option={};
	var id=inputGetId();
	var position=getPosition(input);
	var span=document.createElement("span");
	span.id="span"+id;
	span.style.position="absolute";
	span.style.left=position["x"]+"px";
	span.style.top=position["y"]+"px";
	span.style.display="none";
	span.style.overflow="visible";
	span.style.borderWidth="1px";
	span.style.borderStyle="solid";
	var i,o;
	for(i=0;i<value.length;i++){
		o=document.createElement("span");
		o.setAttribute("_index",i);
		o.setAttribute("_value",value[i]);
		o.style.display="block";
		o.style.cursor="pointer";
		if(value[i]==input.value){
			o.style.backgroundColor="#FFCC99";
		}else{
			o.style.backgroundColor="#E5E5E5";
		}
		o.onclick=function(){
			_input.select.input.value=this.getAttribute('_value');
			this.style.backgroundColor='#FFCC99';
			if(_input.select.index!=-1){
				_input.select.span.childNodes[_input.select.index].style.backgroundColor='#E5E5E5';
			}
			_input.select.index=this.getAttribute('_index');
		}
		o.onmouseover=function(){
			if(this.getAttribute('_value')!=_input.select.input.value){
				this.style.backgroundColor='#CCFFCC';
			}
		}
		o.onmouseout=function(){
			if(this.getAttribute('_value')!=_input.select.input.value){
				this.style.backgroundColor='#E5E5E5';
			}
		}
		o.innerHTML=name[i];
		span.appendChild(o);
	}
	document.body.appendChild(span);
	inputReadOnly(input);
	input.setAttribute("_input_id",id);
	input.onfocus=function(){
		_input.select.input=this;
		_input.select.span=document.getElementById("span"+this.getAttribute("_input_id"));
		_input.select.index=-1;
		var i;
		for(i=0;i<_input.select.span.childNodes.length;i++){
			if(_input.select.span.childNodes[i].getAttribute("_value")==this.value){
				_input.select.index=i;
			}
		}
		_input.select.span.style.display="";
		_input.select.span.style.width=Math.max(this.offsetWidth,_input.select.span.offsetWidth);
	}
	input.onblur=function(){
		_input.select.span=document.getElementById("span"+this.getAttribute("_input_id"));
		setTimeout("_input.select.span.style.display=\"none\";",500);
	}
}
function inputCalendar(input,option){
	//maybe this can not run more than once in one window.
	if(!option)option={};
	inputReadOnly(input);
	if(option.defaultValue&&!input.value)input.value=option.defaultValue;
	input.onfocus=function(){
		_calendar.show(this,this.value);
	}
}
function inputEditor(input){
	editor(input.id);
}
function inputFullScreen(input){
	input.inputFullScreened=false;
	input.inputFullScreenStyle={
		position: input.style.position,
		left: input.style.left,
		top: input.style.top,
		width: input.style.width,
		height: input.style.height
	};
	Event.observe(input,"keydown",function(event){
			if(event.keyCode==122){
				if(this.inputFullScreened){
					this.inputFullScreened=false;
					Object.extend(this.style,this.inputFullScreenStyle);
				}else{
					this.inputFullScreened=true;
					var dim=document.viewport.getDimensions();
					Object.extend(this.style,{
							position: "absolute",
							left: "0px",
							top: "0px",
							width: dim.width+"px",
							height: dim.height+"px"
					});
				}
				Event.stop(event);
			}
	});
}
