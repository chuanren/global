<?php
//version: php@liuchuanren.com.cn, 12/30/08
require_once(dirname(__file__)."/abstract/sql.php");
class odbc extends sql{
	var $__charset="utf-8";
	var $_charset="utf-8";
	var $_offset;
	//begin of abstract methods
	function affectedRows(){
		return odbc_num_rows($result);
	}
	function close(){
		//return odbc_close($this->id);
	}
	function connect($server,$username,$password){
		return odbc_connect($server,$username,$password);
	}
	function escapeString($string){
		return mysql_escape_string($string);
	}
	function execute($sql){
		$sql=iconv($this->_charset,$this->__charset,$sql);
		$this->_offset=0;
		return odbc_exec($this->id,$sql);
	}
	function fetchRow($result){		
		$row=odbc_fetch_array($result);
		$ans=array();
		while(list($k,$v)=@each($row)){
			$k=iconv($this->__charset,$this->_charset,$k);
			$v=iconv($this->__charset,$this->_charset,$v);
			$ans[$k]=$v;
		}
		return $ans;
	}
	function fetchField($result,$offset=null){
		if(!isset($offset)){
			$this->_offset++;
			$offset=$this->_offset;
		}
		return @odbc_field_name($result,$offset);
	}
	function free($result){
		//return odbc_free_result($result);
	}
	function numRows($result){
		return odbc_num_rows($result);
	}
	function numFields($result){
	}
	function setCharset($charset){
		$this->_charset=$charset;
	}
	function setDatabase($database){
	}
	//end of abstract methods
	function tables(){
		$tables=odbc_tables($this->id);
		return $this->fetchAllRows($tables);
	}
	function columns(){
		$columns=odbc_columns($this->id);
		return $this->fetchAllRows($tables);
	}
}
?>
