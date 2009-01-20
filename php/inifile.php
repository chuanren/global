<?php
//version: php@liuchuanren.com.cn, 07/24/08
class inifile{
	private $_file;
	private $_value;
	function inifile($file,$section=false){
		$this->_file=$file;
		$this->_value=$this->read($this->_file,$section);
	}
	function __get($name){
		return $this->_value[$name];
	}
	function __set($name,$value){
		$this->_value[$name]=$value;
	}
	function __toString(){
		return "inifile($this->_file)";
	}
	function getAll(){
		return $this->_value;
	}
	function save(){
		$this->write($this->_file,$this->_value);
	}
	function setAll($value){
		$this->_value=$value;
	}
	//can be called with out this
	function read($file,$section=false){
		return parse_ini_file($file,$section);
	}
	function write($file,$array){
		$content="";
		while(list($k,$v)=each($array)){
			if(is_array($v)){
				$content.="[$k]\r\n";
				while(list($kk,$vv)=each($v)){
					$content.="$kk=\"$vv\"\r\n";
				}
			}else{
				$content="$k=\"$v\"\r\n".$content;
			}
		}
		$f=@fopen($file,"w");
		if($f){
			flock($f,LOCK_EX);
			fwrite($f,$content);
			fclose($f);
		}else{
			print("inifile::write can not open $file (w).");
		}
	}
}
?> 
