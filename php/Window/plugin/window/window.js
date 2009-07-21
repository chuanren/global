if(!_window){
	var _window={};
	Event.observe(window,"load",function(){
		$$(".windowAlert button").each(function(button){
			Event.observe(button,"click",function(event){
				var href=this.readAttribute("href");
				var container=$(this.parentNode.parentNode);
				if(href=="#"){
					container.remove();
				}else{
					container.select("span")[0].update("Loading...Please Wait...");
					location=href;
				}
			});
		});
		$$(".windowTable").each(function(table){
			table.writeAttribute("cellspacing","0");
		});
		$$("[windowTip]").each(function(element){
			Event.observe(element,"mouseover",function(event){
					if(!element.windowTipElement){
						element.windowTip=element.readAttribute("windowTip");
						Element.insert(document.body,"<div style='position: absolute; display: none; border: 1px solid black; padding: 5px; background: white; z-index: 1000;'></div>");
						element.windowTipElement=$(document.body.lastChild);
						element.windowTipElement.update(element.windowTip);
					}
					this.windowTipTimer=function(element,event){
						var pointer=Event.pointer(event);
						element.windowTipElement.setStyle({
								left: pointer.x+"px",
								top: pointer.y+10+"px"
						}).show();
					}.delay(1,this,event);
			});
			Event.observe(element,"mouseout",function(){
					this.windowTipElement.hide();
					clearTimeout(this.windowTipTimer);
			});
		});
	});
	Event.observe(window,"beforeunload",function(event){
			$("windowMessage").update("Loading...Please Wait...Do Not Close This Window!");
	});
}
