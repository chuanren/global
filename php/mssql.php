<?php
//version: php@liuchuanren.com.cn, 09/10/08
require_once(dirname(__file__)."/abstract/sql.php");
class mssql extends sql{
	var $_charset="gbk";
	function affectedRows(){
		return mssql_rows_affected($this->id);
	}
	function close(){
		return mssql_close($this->id);
	}
	function connect($server,$username,$password){
		return mssql_connect($server,$username,$password,true);
	}
	function escapeString($string){
		return mysql_escape_string($string);
	}
	function execute($sql){
		$sql=iconv($this->_charset,"gbk",$sql);
		return mssql_query($sql,$this->id);
	}
	function fetchRow($result){
		$row=mssql_fetch_assoc($result);
		while(list($k,$v)=@each($row)){
			$row[$k]=iconv("gbk",$this->_charset,$v);
		}
		@reset($row);
		return $row;
	}
	function fetchField($result,$offset=null){
		if($offset===null)$return=mssql_fetch_field($result);
		else $return=mssql_fetch_field($result,$offset);
		//the if statement is necessary, because (array)false=array(false) is true , not false or null.
		//the function will return null if it fetches nothing from result.
		if($return)$return=(array)$return;
		return $return;
	}
	function free($result){
		return mssql_free_result($result);
	}
	function numRows($result){
		return @mssql_num_rows($result);
	}
	function numFields($result){
		return @mssql_num_fields($result);
	}
	function setCharset($charset){
		$this->_charset=$charset;
	}
	function setDatabase($database){
		return mssql_select_db($database,$this->id);
	}
}
?>
