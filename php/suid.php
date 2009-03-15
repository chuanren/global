<?php
class suid{
	var $sql;
	var $database;
	var $table;
	var $columns;
	var $columnNames;
	var $keyNames;
	var $keyName;
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
		if(count($this->keyNames)==1){
			$this->keyName=$this->keyNames[0];
		}
	}
	
	/**
	* function to select
	* @access public
	* @param array $options 
	*	{
	*		field: [f1,f2,...],
	*		filter: [[f1,=,v1],...],
	*		order: [[f1,ASC|DESC],...],
	*		start: 0,
	*		limit: 1
	*	}
	* @return array
	*	{
	*		options: {},
	*		root: [{f1:v1,f2:v2,...},...],
	*		count: 1
	*	}
	*/
	function select($options=array()){
		extract($options);
		
		if($field===null)$field=$this->columnNames;
		if($filter===null)$filter=array(array(1,"=",1));
		if($order===null){
			$order=array();
			reset($this->keyNames);
			while(list($k,$v)=each($this->keyNames)){
				$order[]=array($v,"ASC");
			}
		}
		if($start===null)$start=0;
		if($limit===null)$limit=0;
		
		$string="select ";
		$array=array();
		
		$string.="`".implode("`,`",array_fill(0,count($field),"%s"))."` ";
		$array=array_merge($array,$field);
		
		$string.="from `%s` where ";
		$array[]=$this->table;
		
		list($k,$v)=each($filter);
		$string.="%s %s '%s' ";
		$array=array_merge($array,$v);
		
		while(list($k,$v)=each($filter)){
			$string.="and %s %s '%s' ";
			$array=array_merge($array,$v);
		}
		
		if($order){
			list($k,$v)=each($order);
			$string.="order by `%s` %s ";
			$array=array_merge($array,$v);
			while(list($k,$v)=each($order)){
				$string.=",`%s` %s ";
				$array=array_merge($array,$v);
			}
		}
		
		if($limit){
			$string.="limit %d, %d";
			$array[]=$start;
			$array[]=$limit;
		}
		
		$this->sql->query($string,$array);
		
		$o=array(
			"options"=>array(
				"field"=>$field,
				"filter"=>$filter,
				"order"=>$order,
				"start"=>$start,
				"limit"=>$limit
				),
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
	*		options: {},
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
		
		list($k,$v)=each($value);
		$string.="`%s`='%s'";
		$array[]=$k;
		$array[]=$v;
		
		while(list($k,$v)=each($value)){
			$string.=",`%s`='%s' ";
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
			"options"=>array(
				"filter"=>$filter,
				"value"=>$value,
				"limit"=>$limit
				),
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
	*		options: {},
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
			"options"=>array("root"=>$root),
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
	*		options: {},
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
			"options"=>array(
				"filter"=>$filter,
				"limit"=>$limit
				),
			"count"=>$this->sql->affectedRows(),
			"message"=>""
			);
		
		return $o;
	}
	
	/**
	* function to count
	* @access public
	* @param $options
	*	{
	*		filter: [[f1,like,v1],...],
	*		field: [f1,...],
	*		group: [f1,f2],
	*		distinct: "dictinct"
	*	}
	* @return array
	*	{
	*		result: 0,
	*		message:""
	*	}
	*/
	function count($options){
		extract($options);
		
		if($filter===null)$filter=array(array(1,"=",1));
		if($field===null)$field="*";
		if($group===null)true;
		if($distinct===null)$distinct="";else $distinct="distinct";
		
		
		$string="select count($distinct ";
		$array=array();
		
		if($field==="*")$string.="*";
		else{
			$string.="`".implode("`,`",array_fill(0,count($field),"%s"))."` ";
			$array=array_merge($array,$field);
		}
		
		$string.=") as `result` from `%s` where ";
		$array[]=$this->table;
		
		while(list($k,$v)=each($filter)){
			$string.="%s %s '%s' ";
			$array=array_merge($array,$v);
		}
		
		if($group){
			$string.="group by `".implode("`,`",array_fill(0,count($group),"%s"))."` ";
			$array=array_merge($array,$group);
		}
		
		$this->sql->query($string,$array);
		$o=$this->sql->getRow();
		$o['message']="";
		
		return $o;		
	}
	
	function avg(){
	}
	
	function min(){
	}
	
	function max(){
	}
	
	function sum(){
	}
	
	/**
	* functions above are basic method, and functions below are shortcut for them
	*/
	
	/**
	* @access public
	* @param mixed $id v;[v1,v2,...];{k1:v1,k2:v2,...}
	* @return array|null can be used as $options['filter']
	*/
	function id2filter($id){
		if(is_array($id)){
			$filter=array();
			reset($this->keyNames);
			while(list($k,$v)=each($this->keyNames)){
				if($id[$v]===null)$id[$v]=$id[$k];
				if($id[$v]===null)return;
				$filter[]=array($v,"=",$id[$v]);
			}
		}elseif($this->keyName){
			$filter=array(array($this->keyName,"=",$id));
		}else return;
		return $filter;
	}
	
	/**
	* @access public
	* @param mixed $id used by id2filter
	* @param mixed $field null;f1;[f1,f2,...]
	* @return mixed v;{f1:v1,f2:v2,...};null
	*/
	function selectById($id,$field=null){
		if(!$filter=$this->id2filter($id))return;
		if($field===null){
			$field=$this->columnNames;
		}elseif(is_string($field)){
			$field=array($field);
		}
		$o=$this->select(array(
			"field"=>$field,
			"filter"=>$filter,
			"start"=>0,
			"limit"=>1
			));
		$o=$o['root'][0];
		if(count($field)==1)$o=$o[$field[0]];
		return $o;		
	}
	
	/**
	* @access public
	* @param mixed $id used by id2filter
	* @param array $value can be used as $options['value'] in update
	* @return mixed null;bool
	*/
	function updateById($id,$value){
		if(!$filter=$this->id2filter($id))return;
		$o=$this->update(array(
			"filter"=>$filter,
			"value"=>$value,
			"limit"=>1
			));
		return $o['count']==1;
	}
	
	/**
	* @access public
	* @param array $value, one element of $options['root'] in insert
	* @return mixed v;null. if success, v will be the value of $this->keyName
	*/
	function insertById($value){
		if(!$this->keyName)return;
		$o=$this->insert(array(
			"root"=>array($value)
			));
		if($o['count']==1){
			return $this->sql->insertId();
		}
	}
	
	/**
	* @access public
	* @param mixed $id used by id2filter
	* @return mixed null;bool
	*/
	function deleteById($id){
		if(!$filter=$this->id2filter($id))return;
		$o=$this->delete(array(
			"filter"=>$filter,
			"limit"=>1
			));
		return $o['count']==1;
	}
}
?>
