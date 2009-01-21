<?php
abstract class sql{
	var $id;
	var $result;
	function sql($server,$username="",$password="",$database=null,$charset=null){
		$this->id=$this->connect($server,$username,$password);
		$database&&$this->setDatabase($database);
		$charset&&$this->setCharset($charset);
	}
	function __destruct(){
		@$this->free($this->result);
		@$this->close();
	}
	abstract function affectedRows();
	abstract function close();
	abstract function connect($server,$username,$password);
	abstract function escapeString($string);
	abstract function execute($sql);//iconv
	abstract function fetchRow($result);//iconv
	abstract function fetchField($result);//iconv
	
	/**
	* function to retrieve the information of database.table.column
	* @abstract
	* @access public
	* @param string $table the name of database.table
	* @param string $column the name of database.table.column
	* @return array|bool if success the array will contain the keys: name, key; or false. the name's value is the name of database.table.column, the key's value will be "PRI"|"UNI"|"MUL"|""
	*/
	abstract function fetchColumn($table,$column);
	
	/**
	* function to retrive the names of database.table.columns
	* @abstract
	* @access public
	* @param string $table the name of database.table
	* @return array the array will contain all the names of database.table.columns
	*/
	abstract function fetchAllColumnNames($table);
	
	abstract function free($result);
	abstract function insertId();
	abstract function numRows($result);
	abstract function numFields($result);
	abstract function setCharset($charset);
	abstract function setDatabase($database);
	function escapeArray($array){
		while(list($k,$v)=each($array)){
			$array[$k]=$this->escapeString($v);
		}
		return $array;
	}
	function executef($format,$array){
		$array=$this->escapeArray($array);
		$sql=call_user_func_array("sprintf",array_merge(array($format),$array));
		return $this->execute($sql);
	}
	function fetchAllFields($result){
		$return=array();
		while($field=$this->fetchField($result))$return[]=$field;
		return $return;
	}
	function fetchAllRows($result){
		$return=array();
		while($row=$this->fetchRow($result))$return[]=$row;
		return $return;
	}
	function getField(){
		return $this->fetchField($this->result);
	}
	function getAllFields(){
		return $this->fetchAllFields($this->result);
	}
	function getRow(){
		return $this->fetchRow($this->result);
	}
	function getAllRows(){
		return $this->fetchAllRows($this->result);
	}
	function getColumn($table,$column){
		return $this->fetchColumn($table,$column);
	}
	function getAllColumnNames($table){
		return $this->fetchAllColumnNames($table);
	}
	function getAllColumns($table){
		$columns=array();
		$names=$this->getAllColumnNames($table);
		while(list($k,$v)=each($names)){
			$columns[$v]=$this->getColumn($table,$v);
		}
		return $columns;
	}
	function getAllKeyNames($table,$type="PRI"){
		$names=array();
		$columns=$this->getAllColumns($table);
		while(list($k,$v)=each($columns)){
			if($v['key']==$type)$names[]=$v['name'];
		}
		return $names;
	}
	function getAllKeys($table,$type="PRI"){
		$keys=array();
		$columns=$this->getAllColumns($table);
		while(list($k,$v)=each($columns)){
			if($v['key']==$type)$keys[$v['name']]=$v;
		}
		return $keys;
	}	
	function query($sql,$array=array()){
		if($array)return $this->result=$this->executef($sql,$array);
		else return $this->result=$this->execute($sql);
	}
	function selectedRows(){
		return $this->numRows($this->result);
	}
	function selectedFields(){
		return $this->numFields($this->result);
	}
}
?>
