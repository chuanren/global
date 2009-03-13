//version: Liu ChuanRen, 05/11/08
function formData(form){//not surport for checkbox radio..., just select text textarea...
	var str="",i,ii=form.elements.length;
	for(i=0;i<ii;i++){
		str+="&"+form.elements[i].name+"="+form.elements[i].value;
	}
	return str;
}
function fromInput(form,array){
	
}
