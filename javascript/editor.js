var _editor={
	path:"/global/FCKeditor/",
	loaded:{},
	closed: {},
	editors: {},
	frames: {},
	textareas: {}
}
_editor.close=function(id){
	if(_editor.loaded[id]){
		_editor.textareas[id].value=FCKeditorAPI.GetInstance(id).GetXHTML(true);
		_editor.frames[id].style.display="none";
		_editor.textareas[id].style.display="";
	}
	_editor.closed[id]=true;
}
function editor(id,config){
	if(_editor.loaded[id]){
		FCKeditorAPI.GetInstance(id).SetHTML(_editor.textareas[id].value);
		_editor.frames[id].style.display="";
		_editor.textareas[id].style.display="none";
	}else{
		_editor.textareas[id]=document.getElementById(id);
		_editor.editors[id]=new FCKeditor(id);
		_editor.editors[id].BasePath=_editor.path;
		_editor.editors[id].Width=_editor.textareas[id].offsetWidth;
		_editor.editors[id].Height=_editor.textareas[id].offsetHeight+80;
		if(config)_editor.editors[id].Config['CustomConfigurationsPath']=config;
		_editor.editors[id].ReplaceTextarea();
		_editor.frames[id]=document.getElementById(id+"___Frame");
		_editor.loaded[id]=true;
	}
	_editor.closed[id]=false;
}
