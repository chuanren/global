/**
* require: prototype.js vMenu.css
* @param element
* @param menuArray=[[text,href,children],...]
*/
var contextMenu=function(element,menuArray){
	this.element=element;
	this.element.contextMenu=this;
	this.menuArray=menuArray;
	this.menuHtml=this.array2html(this.menuArray);
	Element.insert(document.body,this.menuHtml);
	this.menuElement=document.body.lastChild;
	this.menuElement.hide();
	this.menuElement.addClassName("vMenu contextMenu");
	Event.observe(this.element,"contextmenu",function(event){
			this.contextMenu.hideAll();
			var pointer=Event.pointer(event);
			this.contextMenu.menuElement.setStyle({
					position: "absolute",
					left: pointer.x+"px",
					top: pointer.y+"px"
			});
			this.contextMenu.menuElement.show();
			Event.stop(event);
	});
	Event.observe(document.body,"click",this.hideAll);
};
contextMenu.prototype={
	array2html: function(array){
		var html;
		var i,a,t;
		html="<ul>";
		for(i=0;i<array.length;i++){
			a=array[i];
			html+="<li";
			if(a[2]){
				html+=" class=right";
				t=this.array2html(a[2]);
			}else{
				t="";
			}
			html+="><a href="+a[1]+">"+a[0]+"</a>"+t+"</li>";
		}
		html+="<ul>";
		return html;
	},
	hideAll: function(){
		$A(document.body.getElementsByClassName("contextMenu")).each(function(element){element.hide()});
	}
};