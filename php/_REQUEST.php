<?php
class _REQUEST{
	private $_cache;
	private $_mode;
	private $_name;
	private $_value;
	function _REQUEST($name=null,&$cache=null){//the cache is default $_REQUEST for easy to use.
		$this->_name=$name;
		if($cache===null)$this->_cache=&$_REQUEST;
		else $this->_cache=&$cache;
		if($this->_name)$this->_value=&$this->_cache[$this->_name];
		else $this->_value=&$this->_cache;
		is_array($this->_value)||($this->_value=array("value"=>$this->_value));
	}
	function __get($name){
		return $this->_value[$name];
	}
	function __set($name,$value){
		$this->_value[$name]=$value;
	}
	function __toString(){
		$string="";
		reset($this->_value);
		while(list($k,$v)=each($this->_value)){
			$string.="&$this->_name[$k]=$v&";
		}
		return $string;
	}
	function checkRefer(){
		 $string=$_SERVER['HTTP_REFERER'];
		 $exp=($_SERVER['HTTPS']?"https":"http")."://".$_SERVER['SERVER_NAME'];
		 return strpos($string,$exp)===0;
	}
	function checkValue($name,$regexp,$value=null){
		if(preg_match($regexp,$this->_value[$name])){
			$return=true;
		}else{
			if($value!==null)$this->_value[$name]=$value;
			$return=false;
		}
		return $return;
	}
	function getAll(){
		return $this->_value;
	}
	function setAll($value){
		$this->_value=$value;
	}
	function removeMagicQuotes(){
		if(get_magic_quotes_gpc())$this->_value=$this->stripslashes($this->_value);
	}
	function stripSlashes($s){
		if(is_array($s)){
			while(list($k,$v)=each($s)){
				$s[$k]=$this->stripslashes($v);
			}
		}else $s=stripslashes($s);
		return $s;
	}
}
?>
