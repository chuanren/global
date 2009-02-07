var _upload=new Object();
function upload(pl,ans,f){
	_upload.pl=pl;
	_upload.div=document.getElementById('_upload_div');
	var temp="position:absolute;left:0px;top:0px;z-index:100;background-color:#CCFFFF;"
	_upload.div.style.cssText=temp;
	_upload.div.setAttribute('style',temp);
	_upload.div.style.width=document.body.offsetWidth+_upload.div.offsetWidth+'px';
	_upload.div.style.height=document.body.offsetHeight+_upload.div.offsetHeight+'px';
	_upload.form=document.getElementById('_upload_form');
	_upload.form.action=_upload.pl;
	_upload.msg=document.getElementById('_upload_msg');
	_upload.msg.innerHTML='Select a file in your computer, then submit.';
	_upload.form.onsubmit=function(){
		_upload.msg.innerHTML='Wait...';
		window._upload_iframe.document.body.innerHTML='';
		_upload.interval=setInterval('_upload.check()',500);
		return true;
	}
	_upload.check=function(){
		_upload.returnValue=window._upload_iframe.document.getElementById('returnValue');
		if(_upload.returnValue){
			clearInterval(_upload.interval);
			_upload.returnValue=_upload.returnValue.innerHTML;
			_upload.msg.innerHTML="<a href='javascript:_upload._return();'>Done!</a>";
		}
	}
	_upload._return=function(){
		if(!_upload.returnValue)_upload.returnValue='';
		eval(ans+'="'+_upload.returnValue+'"');
		f();
		_upload.div.style.display='none';
	}
	_upload.form.elements[0].focus();
}
document.write(
"<div style=display:none id=_upload_div><form id='_upload_form' action='#' method='post' target='_upload_iframe' enctype='multipart/form-data'><input type=file id=file name=file /><input type=submit name=submit value=Submit /><input type=button name=return value=Return onclick='_upload._return();' /></form><iframe name=_upload_iframe id=_upload_iframe></iframe><br><div id='_upload_msg' style=color:red></div></div>");