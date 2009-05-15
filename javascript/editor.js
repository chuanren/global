var _editor={
	path:"/global/FCKeditor/",
	loaded:{},
	frames: {},
	textareas: {}
}
_editor.close=function(id){
	if(_editor.loaded[id]){
		_editor.textareas[id].value=FCKeditorAPI.GetInstance(id).GetXHTML(true);
		_editor.frames[id].style.display="none";
		_editor.textareas[id].style.display="";
	}
}
function editor(id,config){
	if(_editor.loaded[id]){
		_editor.frames[id].style.display="";
		_editor.textareas[id].style.display="none";
	}else{
		_editor.textareas[id]=document.getElementById(id);
		var obj=new FCKeditor(id);
		obj.BasePath=_editor.path;
		obj.Width=_editor.textareas[id].offsetWidth;
		obj.Height=_editor.textareas[id].offsetHeight+80;
		if(config)obj.Config['CustomConfigurationsPath']=config;
		obj.ReplaceTextarea();
		_editor.frames[id]=document.getElementById(id+"___Frame");
		_editor.loaded[id]=true;
	}
}
