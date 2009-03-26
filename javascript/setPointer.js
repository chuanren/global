/**
* require prototype.js
*/
function setPointer(table,color,option){
	table=$(table);
	color||(color=[]);
	color[0]||(color[0]="#d5d5d5");
	color[1]||(color[1]="#e5e5e5");
	color[2]||(color[2]="#ccffcc");
	color[3]||(color[3]="#ffcc99");
	option||(option={});
	Object.isUndefined(option.tag)&&(option.tag=null);
	Object.isUndefined(option.bgcolor)&&(option.bgcolor=true);
	Object.isUndefined(option.mouse)&&(option.mouse=true);
	Object.isUndefined(option.click)&&(option.click=true);
	var trs;
	if(option.tag)true;
	else if((trs=table.select("tr"))&&trs.length)option.tag="tr";
	else if((trs=table.select("li"))&&trs.length)option.tag="li";
	if(option.bgcolor){
		trs.each(function(tr,index){
			var c=index%2?color[1]:color[0];
			tr.writeAttribute("backgroundColor",c);
			tr.setStyle({
					background: c
			});
		});
	}
	if(option.mouse){
		Event.observe(table,"mouseover",function(event){
			var tr=Event.findElement(event,option.tag);
			if(!tr||tr.readAttribute("selected"))return;
			tr.setStyle({
					background: color[2]
			});
		});
		Event.observe(table,"mouseout",function(event){
			var tr=Event.findElement(event,option.tag);
			if(!tr||tr.readAttribute("selected"))return;
			tr.setStyle({
					background: tr.readAttribute("backgroundColor")
			});
		});
	}
	if(option.click){
		Event.observe(table,"click",function(event){
			var tr=Event.findElement(event,option.tag);
			if(!tr)return;
			tr.writeAttribute("selected",tr.readAttribute("selected")?false:true);
			tr.setStyle({
					background: tr.readAttribute("selected")?color[3]:tr.readAttribute("backgroundColor")
			});
		});
	}
}
