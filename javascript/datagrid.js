/*
powered by chuanren@ustc
datagrid should be sorted by 2 kinds:
1, one only will be marked some data, this will be solved on caiwu.ustc.edu.cn
2, almost fully editable required, this will be solved on lqcc.ustc.edu.cn
I will name them datamark and dataedit in file. for example: datamark.js dataedit.php
the js is designed to use ajax tech.
in my plan, the php file need a costomized sql class.
by the way, the datagrid will be show like a table, and the table's size can be changed, comfortable.

this program is be witten to solve the table. It is a table by tagname.

need position.js
need urlparams.js
<script language=javascript id=datagrid src="/global/javascript/datagrid.js?id=tableid"></script>
*/
var _datagrid=new Object();
function datagrid(id){
	var i,j,div,str,p,right;

	_datagrid._this=this;
	_datagrid.id=id;
	_datagrid.obj=document.getElementById(id);
	_datagrid.tr=_datagrid.obj.getElementsByTagName('tr');
	_datagrid.td=_datagrid.obj.getElementsByTagName('td');
	_datagrid.td.num=_datagrid.tr[0].getElementsByTagName('td').length;
	_datagrid.width=new Array();
	_datagrid.index=-1;
	_datagrid.x=-1;
	
	_datagrid.obj.border=1;
	_datagrid.obj.width=null;
	_datagrid.obj.setAttribute('border',1);
	_datagrid.obj.setAttribute('width','');
	this.resume();
	for(i=0;i<_datagrid.td.length;i++){
		div=document.createElement('div');
		str="width:"+_datagrid.width[i%_datagrid.td.num]+"px;overflow:hidden;white-space:nowrap;";
		div.style.cssText=str;
		div.setAttribute("style",str);
		div.innerHTML=_datagrid.td[i].innerHTML;
		_datagrid.td[i].innerHTML='';
		_datagrid.td[i].appendChild(div);
	}
	this.resume(true);
	for(i=0;i<_datagrid.td.num;i++){
		_datagrid.td[i]._datagrid_index=i;
		_datagrid.td[i].onmousemove=function(e){
			right=getPosition(this);
			right=right['x'];
			right+=this.offsetWidth;
			p=mousePosition(e);
			if(p['x']>right-10){
				this.style.cursor="col-resize";
				if(_datagrid.index==-1)_datagrid.index=this._datagrid_index;
			}else{
				this.style.cursor="";
				_datagrid.index=-1;
			}
			if(_datagrid.x>-1&&_datagrid.index==this._datagrid_index){
				_datagrid.width[this._datagrid_index]+=p['x']-_datagrid.x;
				_datagrid.x=p['x'];
				_datagrid._this.colwidth(this._datagrid_index);
			}else _datagrid.x=-1;
		}
		_datagrid.td[i].onmousedown=function(e){
			if(_datagrid.index>-1){
				p=mousePosition(e);
				_datagrid.x=p['x'];
			}
		}
		_datagrid.td[i].onmouseup=function(){
			_datagrid._this.resume(true);
			_datagrid.x=-1;
		}
	}
}
datagrid.prototype.resume=function(colwidth){
	_datagrid.width[-1]=getPosition(_datagrid.obj);
	_datagrid.width[-1]=_datagrid.width[-1]['x'];	
	var i;
	for(i=0;i<_datagrid.td.num;i++){
		_datagrid.width[i]=parseInt(_datagrid.td[i].width);
		if(!_datagrid.width[i])_datagrid.width[i]=parseInt(_datagrid.td[i].style.width);
		if(!_datagrid.width[i])_datagrid.width[i]=parseInt(_datagrid.td[i].offsetWidth);
		//if(colwidth)this.colwidth(i);
	}
}
datagrid.prototype.colwidth=function(index){
	var i,str,td;
	str=_datagrid.width[index]+'px';
	for(i=0;i<_datagrid.tr.length;i++){
		td=_datagrid.td[i*_datagrid.td.num+index];
		td.width=str;
		td.childNodes[0].style.width=str;
	}
}
if(temp=document.getElementById('datagrid')){
	temp=urlparams('',temp.src);
	temp=new datagrid(temp['id']);
}