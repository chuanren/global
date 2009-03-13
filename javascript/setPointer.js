/**
* require prototype.js
*/
function setPointer(table,color0,color1,color2,color3){
	table=$(table);
	color0||(color0="#d5d5d5");
	color1||(color1="#e5e5e5");
	color2||(color2="#ccffcc");
	color3||(color3="#ffcc99");
	var trs=table.select("tr");
	trs.each(function(tr,index){
		var color=index%2?color0:color1;
		tr.writeAttribute("backgroundColor",color);
		tr.setStyle({
				background: color
		});
	});
	Event.observe(table,"mouseover",function(event){
		var tr=Event.findElement(event,"tr");
		if(tr.readAttribute("selected"))return;
		tr.setStyle({
				background: color2
		});
	});
	Event.observe(table,"mouseout",function(event){
		var tr=Event.findElement(event,"tr");
		if(tr.readAttribute("selected"))return;
		tr.setStyle({
				background: tr.readAttribute("backgroundColor")
		});
	});
	Event.observe(table,"click",function(event){
		var tr=Event.findElement(event,"tr");
		tr.writeAttribute("selected",tr.readAttribute("selected")?false:true);
		tr.setStyle({
				background: tr.readAttribute("selected")?color3:tr.readAttribute("backgroundColor")
		});
	});
}
