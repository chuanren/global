//version: Liu ChuanRen, 05/04/08
var _position={};
function getPosition(obj){
	var ans=new Array();
	ans['x']=0;ans['y']=0;
	while(obj!=null){
		ans['x']+=obj.offsetLeft;
		ans['y']+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return ans;
}

function setPosition(obj,x,y,live){
	if(live){x+=document.body.scrollLeft;y+=document.body.scrollTop;}
	obj.style.position="absolute";
	obj.style.left=x+"px";
	obj.style.top=y+"px";
}

function setLivePosition(obj,x,y){
	if(!x||!y)x=getPosition(obj);y=x['y'];x=x['x'];
	setInterval("setPositionById('"+obj.id+"',"+x+","+y+",1)",1);
}

function getPositionById(id){
	return getPosition(document.getElementById(id));
}

function setPositionById(id,x,y,live){
	setPosition(document.getElementById(id),x,y,live);
}

function setLivePositionById(id,x,y){
	if(!x||!y)x=getPositionById(id);y=x['y'];x=x['x'];
	setInterval("setPositionById('"+id+"',"+x+","+y+",1)",1);
}

function mousePosition(e){
	var ans=new Array();
	if (!e)var e = window.event;
	if (e.pageX || e.pageY){
		ans['x'] = e.pageX;
		ans['y'] = e.pageY;
	}
	else if (e.clientX || e.clientY){
		ans['x'] = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
		ans['y'] = e.clientY + document.body.scrollTop	+ document.documentElement.scrollTop;
	}
	return ans;
}
