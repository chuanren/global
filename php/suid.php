<?php
class suid{
	var $sql;
	var $database;
	var $table;
	var $columnNames;
	var $columns;
	var $charset;
	function suid($sql,$database,$table,$charset="utf8"){
		$this->sql=$sql;
		$this->database=$database;
		$this->table=$table;
		$this->charset=$charset;
		$this->sql->setDatabase($this->database);
		$this->sql->setCharset($this->charset);
		$this->columns=$this->sql->getAllColumns($this->table);
		$this->columnNames=array_keys($this->columns);
		$this->keyNames=array();
		while(list($k,$v)=each($this->columns)){
			if($v['key']=="PRI")$this->keyNames[]=$v['name'];
		}
	}
	
	/**
	* function to select
	* @access public
	* @param array $options 
	*	{
	*		field: [f1,f2,...],
	*		filter: [[f1,=,v1],...],
	*		start: 0,
	*		limit: 1
	*	}
	* @return array
	*	{
	*		root: [{f1:v1,f2:v2,...},...],
	*		count: 1
	*	}
	*/
	function select($options=array()){
		extract($options);
		
		if($field===null)$field=$this->columnNames;
		if($filter===null)$filter=array(array(1,"=",1));
		if($start===null)$start=0;
		if($limit===null)$limit=0;
		
		$string="select ";
		$array=array();
		
		$string.="`".implode("`,`",array_fill(0,count($field),"%s"))."` ";
		$array=array_merge($array,$field);
		
		$string.="from `%s` where ";
		$array[]=$this->table;
		
		while(list($k,$v)=each($filter)){
			$string.="%s %s '%s' ";
			$array=array_merge($array,$v);
		}
		
		if($limit){
			$string.="limit %d, %d";
			$array[]=$start;
			$array[]=$limit;
		}
		
		$this->sql->query($string,$array);
		
		$o=array(
			"root"=>$this->sql->getAllRows(),
			"count"=>$this->sql->selectedRows()
			);
		
		return $o;
	}
	
	/**
	* function to update
	* @access public
	* @param array $options
	*	{
	*		filter: [[f1,=,v1,...]],
	*		value: {f1:v1,...},
	*		limit: 0
	*	}
	* @return array
	*	{
	*		count: 1,
	*		message: ""
	*	}
	*/
	function update($options){
		extract($options);
		
		if($filter===null)$filter=array(array(1,"=",1));
		if($value===null)return;
		if($limit===null)$limit=0;
		
		$string="update `%s` set ";
		$array=array($this->table);
		
		while(list($k,$v)=each($value)){
			$string.="`%s`='%s' ";
			$array[]=$k;
			$array[]=$v;
		}
		
		$string.="where ";
		
		while(list($k,$v)=each($filter)){
			$string.="%s %s '%s' ";
			$array=array_merge($array,$v);
		}
		
		if($limit){
			$string.="limit %d";
			$array[]=$limit;
		}
		
		$this->sql->query($string,$array);
		
		$o=array(
			"count"=>$this->sql->affectedRows(),
			"message"=>""
			);
		
		return $o;
	}
	
	/**
	*function to insert
	* @access public
	* @param array $options
	*	{
	*		root: [{f1:v1,...},...]
	*	}
	* @return array
	*	{
	*		count: 1,
	*		message: ""
	*	}
	*/
	function insert($options){
		extract($options);
		
		if($root===null)return;
		
		$string="insert into `%s` ";
		$array=array($this->table);
		
		$field=array();
		while(list($k,$v)=each($root)){
			while(list($kk,$vv)=each($v)){
				$field[$kk]=true;
			}
		}
		$field=array_keys($field);
		$string.="(`".implode("`,`",array_fill(0,count($field),"%s"))."`)values";
		$array=array_merge($array,$field);
		
		$s=array();
		$a=array();
		reset($root);
		while(list($k,$v)=each($root)){
			$ss=array();
			reset($field);
			while(list($kk,$vv)=each($field)){
				if($v[$vv]===null){
					$ss[]="null";
				}else{
					$ss[]="'%s'";
					$a[]=$v[$vv];
				}
			}
			$s[]="(".implode(",",$ss).")";
		}
		$string.=implode(",",$s);
		$array=array_merge($array,$a);
		
		$this->sql->query($string,$array);
		
		$o=array(
			"count"=>$this->sql->affectedRows(),
			"message"=>""
			);
		
		return $o;
	}
	
	/**
	* function to delete
	* @access public
	* @param array $options
	*	{
	*		filter: [[f1,=,v1],...],
	*		limit: 0
	*	}
	* @return array
	*	{
	*		count: 1,
	*		message: ""
	*	}
	*/
	function delete($options){
		extract($options);
		
		if($filter===null)$filter=array(array(1,"=",1));
		if($limit===null)$limit=0;
		
		$string="delete from `%s` where ";
		$array=array($this->table);
		
		while(list($k,$v)=each($filter)){
			$string.="%s %s '%s' ";
			$array=array_merge($array,$v);
		}
		
		if($limit){
			$string.="limit %d";
			$array[]=$limit;
		}
		
		$this->sql->query($string,$array);
		
		$o=array(
			"count"=>$this->sql->affectedRows(),
			"message"=>""
			);
		
		return $o;
	}
	
	/**
	* should implement the machanism to do count, distinct,...
	* @access public
	* @param $options
	*	{
	*		filter: 
	*		distinct(?)
	*	}
	* @return array
	*	{
	*		count:0,
	*		message:""
	*	}
	*/
	function count($options){
	}
	
	/**
	* functions above are basic method, and functions below are shortcut for them
	*/
	
	function selectById(){
	}
	function updateById(){
	}
	function insertById(){
	}
	function deleteById(){
	}
}
?>
