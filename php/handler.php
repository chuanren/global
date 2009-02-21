<?php
//version: Liu ChuanRen, 07/24/08
class handler{
	var $globals=array();
	var $handlers=array();
	function setGlobal($var){
		$this->globals=array_merge($this->globals,explode(",",$var));
	}
	function signUp($filename){
		$this->handlers[]=$filename;
	}
	function signIn(&$index){
		if(!$this->handlers[$index])$index=0;
	}
	function fire($index){
		eval('global $'.implode(',$',$this->globals).';');
		require($this->handlers[$index]);
	}
}
?>
