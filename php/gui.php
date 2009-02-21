<?php
//version: php@liuchuanren.com.cn, 07/15/08
class gui{
	function __call($method,$parameters){
		include_once(dirname(__file__)."/../gui/$method.php");
		return new $method($parameters[0]);
	}
	function getInstance($class,$id){
		include_once(dirname(__file__)."/../gui/$class.php");
		return new $class($id);
	}
}
?>
