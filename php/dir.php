<?php
//version: Liu ChuanRen, 02/24/08
require_once(dirname(__file__)."/../gui/window.php");
class dir{
	var $dirname=".";
	var $queryString="";
	var $window;
	/*chuanren*/
	var $request;
	var $requestName="dir";
	var $requestValue;
	function url($values){
		$names=array("action","file");
		$url="?".$this->queryString."&";
		while(list($k,$v)=each($names)){
			if(isset($values[$v])){
				$url.=$this->requestName."[$v]=".$values[$v];
			}else{
				$url.=$this->requestName."[$v]=".$this->requestValue[$v];
			}
			$url.="&";
		}
		return $url;
	}
	function ls(){
		$result="";
		$dir=dir($this->dirname);
		$result.="<table><thead><tr><td colspan=\"4\"><form action=\"".$this->url(array("action"=>"upload"))."\" method=\"post\" enctype=\"multipart/form-data\"><input name=\"".$this->requestName."[file]\" type=file /><input type=submit value='Upload New File' /></form></td></tr><tr align=center><td>Type</td><td>Size(B)</td><td>Time</td><td>Name</td></tr></thead><tbody>\r\n";
		while($name=$dir->read()){
			if(ereg("^\.{1,2}$",$name))continue;
			$f=$this->dirname."/".$name;
			$type=is_dir($f)?"Dir":"File";
			$size=filesize($f);
			$time=date("Y-m-d H:i:s",filemtime($f));
			$result.="<tr ondblclick=\"if(confirm('Delete This Item?\\r\\nUnrecoverable!'))location='".$this->url(array("action"=>"rm","file"=>$name))."';\"><td>$type</td><td>$size</td><td>$time</td><td><a href=\"".$this->url(array("action"=>"download","file"=>$name))."&global[mainOnly]=yes\">$name</a></td></tr>\r\n";
		}
		$dir->close();
		$result.="</tbody><tfoot><tr><td colspan='4'>dblclick a file row to DELETE it!</td></tr></tfoot></table>";
		print($result);
	}
	function rm(){
		$url=$this->url(array("action"=>"ls"));
		if(unlink($this->dirname."/".$this->requestValue['file'])){
			window::alert("<a href=\"$url\">Delete Successfully.</a>");
		}else{
			window::alert("<a href=\"$url\">Failed.</a>");
		}
	}
	function download(){
		ob_clean();
		header("Content-type: application/octet-stream");
		header("Content-Disposition: attatchment;filename=\"".$this->requestValue['file']."\"");
		$result=file_get_contents($this->dirname."/".$this->requestValue['file']);
		print($result);
		die;
	}
	function upload(){
		$name=$this->dirname."/".$this->requestValue['file'];
		$url=$this->url(array("action"=>"ls"));
		if(file_exists($name)){
			window::alert("<a href=\"$url\">This File Already Exists.</a>");
		}else{
			if(copy($_FILES[$this->requestName]['tmp_name']['file'],$name)){
				window::alert("<a href=\"$url\">Upload Successfully.</a>");
			}else{
				window::alert("<a href=\"$url\">Failed.</a>");
			}
		}
	}
	function handleRequest($request){
		$this->request=$request;
		$this->requestValue=$this->request[$this->requestName];
		if($_FILES[$this->requestName])$this->requestValue['file']=$_FILES[$this->requestName]['name']['file'];
		if(!$this->requestValue['action'])$this->requestValue['action']="ls";
		$url=$this->url(array("action"=>"ls"));
		if(!ereg("^[0-9a-zA-Z\.\_]{0,20}$",$this->requestValue['file'])||ereg("php",$this->requestValue['file'])){
			$this->requestValue['action']=null;
			window::alert("<a href=\"$url\">Your File Name(".$this->requestValue['file'].") Is Illegal.</a>");
		}
		switch($this->requestValue['action']){
			case 'ls':
				$this->ls();
				break;
			case 'rm':
				$this->rm();
				break;
			case 'download':
				$this->download();
				break;
			case 'upload':
				$this->upload();
				break;
		}
	}
}
?>
