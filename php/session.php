<?php
class session{
	var $_id;
	var $_cache;
	var $_name;
	var $_value;
	function session($name){
		$name="globalphpsession_$name";
		session_start();
		$this->_id=session_id();
		$this->_cache=&$_SESSION;
		$this->_name=$name;
		$this->_value=&$this->_cache[$this->_name];
	}
	function __get($name){
		return $this->_value[$name];
	}
	function __set($name,$value){
		$this->_value[$name]=$value;
	}
}
?>
