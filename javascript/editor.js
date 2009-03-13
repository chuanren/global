//version: Liu ChuanRen, 02/22/08
var _editor={
	path:"/global/FCKeditor/",
	loaded:{},
	elements:{}
}
_editor.close=function(id){
	if(_editor.loaded[id]){
		_editor.elements[id].value=FCKeditorAPI.GetInstance(id).GetXHTML(true);
		document.getElementById(id+"___Frame").style.display="none";
		_editor.elements[id].style.display="";
	}
}
function editor(id,config){
	if(_editor.loaded[id]){
		document.getElementById(id+"___Frame").style.display="";
		_editor.elements[id].style.display="none";
	}else{
		_editor.elements[id]=document.getElementById(id);
		var obj=new FCKeditor(id);
		obj.BasePath=_editor.path;
		obj.Width=_editor.elements[id].offsetWidth;
		obj.Height=_editor.elements[id].offsetHeight+80;
		if(config)obj.Config['CustomConfigurationsPath']=config;
		obj.ReplaceTextarea();
		_editor.loaded[id]=true;
	}
}
