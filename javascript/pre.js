//version: Liu ChuanRen, 02/20/08
var _pre={};
_pre.elements=document.getElementsByTagName("pre");
_pre.function=function(){
	var i,c;
	for(i=0;i<_pre.elements.length;i++){
		c=_pre.elements[i].innerHTML;
		c=c.replace(/\r/g,"</p><p>");
		c=c.replace(/\n/g,"</p><p>");
		c="<p>"+c+"</p>";
		_pre.elements[i].innerHTML=c;
	}
}
