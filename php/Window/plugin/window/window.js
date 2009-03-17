if(!_window){
	var _window={};
	Event.observe(window,"load",function(){
		$A(document.getElementsByClassName("windowAlert")).each(function(div){
			Event.observe(div.lastChild,"click",function(event){
				Element.extend(this.parentNode.parentNode);
				this.parentNode.parentNode.remove();
			});
		});
		$A(document.getElementsByClassName("windowTable")).each(function(table){
			table.writeAttribute("cellspacing","0");
		});
	});
}
