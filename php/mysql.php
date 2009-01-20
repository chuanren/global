<?php
require_once(dirname(__file__)."/abstract/sql.php");
class mysql extends sql{
	//begin of abstract methods
	function affectedRows(){
		return mysql_affected_rows($this->id);
	}
	function close(){
		return mysql_close($this->id);
	}
	function connect($server,$username,$password){
		return mysql_connect($server,$username,$password,true);
	}
	function escapeString($string){
		return mysql_real_escape_string($string,$this->id);
	}
	function execute($sql){
		return mysql_query($sql,$this->id);
	}
	function fetchColumn($table,$column){
		$o=false;
		$result=$this->executef("show full columns from `%s` like '%s'",array($table,$column));
		//array(Field, Type, Collation, Null, Key, Default, Extra, Privileges, Comment)
		$row=$this->fetchRow($result);
		if($row){
			$o=array(
				"name"=>$row['Field'],
				"key"=>$row['Key']
				);
		}
		return $o;
	}
	function fetchAllColumnNames($table){
		$names=array();
		$result=$this->executef("show columns from `%s`",array($table));
		while($row=$this->fetchRow($result))$names[]=$row['Field'];
		return $names;
	}
	function fetchField($result,$offset=null){
		if($offset===null)$return=mysql_fetch_field($result);
		else $return=mysql_fetch_field($result,$offset);
		//the if statement is necessary, because (array)false=array(false) is true , not false or null.
		//the function will return null if it fetches nothing from result.
		if($return)$return=(array)$return;
		return $return;
	}
	function fetchRow($result){
		return mysql_fetch_assoc($result);
	}
	function free($result){
		return mysql_free_result($result);
	}
	function numRows($result){
		return @mysql_num_rows($result);
	}
	function numFields($result){
		return @mysql_num_fields($result);
	}
	function setCharset($charset){
		return $this->execute("set names '".$this->escapeString($charset)."'");
	}
	function setDatabase($database){
		return mysql_select_db($database,$this->id);
	}	
	//end of abstract methods
	function getAllColumns($table){
		$columns=array();
		$result=$this->executef("show full columns from `%s`",array($table));
		while($row=$this->fetchRow($result)){
			$columns[$row['Field']]=array(
				"name"=>$row['Field'],
				"key"=>$row['Key']
				);
		}
		return $columns;
	}
	//end of rewriting methods
	function insertId(){
		return mysql_insert_id($this->id);
	}
}
/*
	//ui methods
	function htmlColumnToInput($column,$id=null,$value=null){
		if(!$id)$id=$column['Field'];
		if($value===null)$value=$column['Default'];
		if(!preg_match("/^([a-z]*)\((.*)\)$/",$info['Type'],$type))preg_match("/^([a-z]*)$/",$info['Type'],$type);
		switch($type[1]){
			case "text":
				$html="<textarea id=\"$id\" name=\"$id\">$value</textarea>";
				break;
			case "enum":
				$options=$type[2];
				$options=str_replace("'","",$options);
				$options=explode(",",$options);
				$html="<select id=\"$id\" name=\"$id\">";
				while(list($k,$v)=each($options)){
					if($v==$value){
						$html.="<option value=\"$v\" selected>$v</option>";
					}else{
						$html.="<option value=\"$v\">$v</option>";
					}
				}
				$html.="</select>";
				break;
			case "set":
				$options=$type[2];
				$options=str_replace("'","",$options);
				$options=explode(",",$options);
				$html="<select id=\"".$id."[]\" name=\"".$id."[]\" multiple>";
				while(list($k,$v)=each($options)){
					if(strpos(",$value,",",".$v.",")===false){
						$html.="<option value=\"$v\">$v</option>";
					}else{
						$html.="<option value=\"$v\" selected>$v</option>";
					}
				}
				$html.="</select>";
				break;
			default:
				$html="<input id=\"$id\" name=\"$id\" type=\"text\" maxlength=\"".$type[2]."\" value=\"$value\" />";
				break;
		}
		return $html;
	}
*/
?>
