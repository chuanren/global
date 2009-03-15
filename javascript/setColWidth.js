/**
* need prototype.js
*/
function setColWidth(table){
	table=$(table);
	var tr=table.select("tr")[0];
	var tds=tr.select("td");
	Event.observe(tr,"mousemove",function(event){
			var td=Event.findElement(event,"td");
			var position=td.cumulativeOffset();
			var pointer=Event.pointer(event);
			if(pointer.x<position.left){
				return;
			}else if(pointer.x<position.left+5){
				var previousTd=td.previous("td");
				if(!previousTd)return;
				this.setColWidthTdLeft=previousTd;
				this.setColWidthTdRight=td;
				td.setStyle({
						cursor: "col-resize"
				});
			}else if(pointer.x<position.left+td.getWidth()-5){
				if(this.mousedown)return;
				this.setColWidthTdLeft=false;
				this.setColWidthTdRight=false;
				td.setStyle({
						cursor: ""
				});
			}else{
				var nextTd=td.next("td");
				if(!nextTd)return;
				this.setColWidthTdLeft=td;
				this.setColWidthTdRight=nextTd;
				td.setStyle({
						cursor: "col-resize"
				});
			}
	});
	Event.observe(tr,"mousedown",function(event){
			this.stopclick=false;
			if(!this.setColWidthTdLeft||!this.setColWidthTdRight)return;
			this.mousedown=true;
			this.stopclick=true;
			var pointer=Event.pointer(event);
			this.setColWidthX=pointer.x;
	});
	Event.observe(tr,"mouseup",function(event){
			if(!this.setColWidthTdLeft||!this.setColWidthTdRight)return;
			this.mousedown=false;
			var pointer=Event.pointer(event);
			var d=pointer.x-this.setColWidthX;
			if(d==0)return;
			this.setColWidthTdLeft.writeAttribute("width",this.setColWidthTdLeft.getWidth()+d);
			this.setColWidthTdRight.writeAttribute("width",this.setColWidthTdRight.getWidth()-d);
	});
	Event.observe(tr,"click",function(event){
			if(this.stopclick)Event.stop(event);
	});
}