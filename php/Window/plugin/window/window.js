if(!_window){
	var _window={};
	Event.observe(window,"load",function(){
		$$(".windowAlert button").each(function(button){
			Event.observe(button,"click",function(event){
				Element.extend(this.parentNode.parentNode);
				this.parentNode.parentNode.remove();
				location=this.readAttribute("href");
			});
		});
		$$(".windowTable").each(function(table){
			table.writeAttribute("cellspacing","0");
		});
	});
}
