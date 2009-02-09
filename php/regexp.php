<?php
//version: Liu ChuanRen, 05/29/08
class regexp{
	function regexp($exp){
		$this->exp=$exp;
	}
	function isEmail($string){
		$exp="/^[0-9a-z]+[0-9a-z_\-\.]*@[0-9a-z_\-\.]+\.{1}[0-9a-z]+$/i";
		return regexp::match($string,$exp);
	}
	function checkRefer(){
		$string=$_SERVER['HTTP_REFERER'];
		$exp=($_SERVER['HTTPS']?"https":"http")."://".$_SERVER['SERVER_NAME'];
		return strpos($string,$exp)===0;
	}
	function match($string,$exp=null){
		$exp||($exp=$this->exp);
		return preg_match($exp,$string);
	}
}
?>
