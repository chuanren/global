//version: Liu ChuanRen, 02/20/08
var _GET={};
var _GET_ok=false;
/*
name="a[b][c][d]", value="e", the result of _GET_set:
_GET["a"]={};
_GET["a"]["b"]={};
_GET["a"]["b"]["c"]={};
_GET["a"]["b"]["c"]["d"]="e";
*/
function _GET_set(name,value){
	name=name.replace(/]/g,"");
	name=name.split("[");
	var i,j,t,s;
	for(i=0;i<name.length;i++){
		t="";
		for(j=0;j<=i;j++){
			t+="[\""+name[j]+"\"]";
		}
		eval("if(typeof _GET"+t+"==\"undefined\")_GET"+t+"={};")
	}
	eval("_GET"+t+"=\""+value+"\";");
}
function GET(name,url){//url: http://server?query_string&name=value&time&a[b][c][d]=e
	if(_GET_ok){
	}else{
		if(!url)url=location.toString();
		url=url.substring(url.indexOf("?")+1);
		url=url.split("&");
		var i,temp;
		for(i=0;i<url.length;i++){
			temp=url[i].split("=");
			_GET_set(temp[0],temp[1]);
		}
	}
	if(typeof _GET[name]=="undefined")_GET[name]="";
	return _GET[name];
}
