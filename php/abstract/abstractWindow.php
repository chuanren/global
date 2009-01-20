<?php
//version: php@liuchuanren.com.cn, 07/24/08
abstract class abstractWindow{
	var $id;
	function abstractWindow($id){
		$this->id=$id;
		$this->initialize();
	}
	function __call($method,$parameters){
		print "<script>window.$method.apply(this,".json_encode($parameters).");</script>";
		ob_flush();
		flush();
	}
	abstract function initialize();
	abstract function handleRequest();
}
?>
