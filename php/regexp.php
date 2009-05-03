<?php
class regexp{
	function regexp($exp){
		$this->exp=$exp;
	}
	function isEmail($string){//user@mail.com
		$exp="/^[0-9a-z]+[0-9a-z_\-\.]*@[0-9a-z_\-\.]+\.{1}[0-9a-z]+$/i";
		return regexp::match($string,$exp);
	}
	function isMPhone($string){//13800138000
		 $exp="/^1[0-9]{10}$/";
		 return regexp::match($string,$exp);
	}
	function isZIP(){//100000
		 $exp="/^[0-9]{6}$/";
		 return regexp::match($string,$exp);
	}
	function match($string,$exp=null){
		$exp||($exp=$this->exp);
		return preg_match($exp,$string);
	}
}
?>
