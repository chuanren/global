function highlight(key,color,obj){
	if(!color)color="<font color=red>"+key+"</font>";
	if(!obj)obj=document.body;
	if(obj.nodeName.toString().toLowerCase()=="script")return;
	if(obj.innerHTML.toString().indexOf(key)==-1)return;
	if(obj.innerHTML.toString().toLowerCase().indexOf(color.toLowerCase())!=-1)return;//useful for setInterval, but make up some problems too, the color should be splited then plus together.
	var temp=obj.childNodes,i,j,str,text,font,span;
	for(i=0;i<temp.length;i++){
		if(temp[i].nodeType==3){
			str=temp[i].nodeValue.toString();
			if(str.indexOf(key)>-1){
				span=document.createElement("span");
				str=str.split(key);
				for(j=0;j<str.length-1;j++){
					text=document.createTextNode(str[j]);
					span.appendChild(text);
					font=document.createElement("span");
					font.innerHTML=color;//this clause is not perfect
					span.appendChild(font);
				}
				text=document.createTextNode(str[j]);
				span.appendChild(text);
				temp[i].parentNode.replaceChild(span,temp[i]);
			}
		}else{
			highlight(key,color,temp[i]);
		}
	}
}