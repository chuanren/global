<?php
class select{
	public $sql;
	public $database;
	public $table;
	public $columns;
	public $columnNames;
	public $condition;//[[t1,f1,like,t2,f2],[t1,f1,like,v1],[f1,like,v1],...]
	public $charset;
	private $count;
	public function select($sql,$database,$table,$condition=array(),$charset="utf8"){
		$this->sql=$sql;
		$this->database=$database;
		$this->table=is_array($table)?$table:array($table);
		$this->condition=$condition;
		$this->charset=$charset;
		$this->count=count($this->table);
		$this->sql->setDatabase($this->database);
		$this->sql->setCharset($this->charset);
		$this->columns=array();
		$this->columnsNames=array();
		for($i=0;$i<$this->count;$i++){
			$this->columns[$i]=$this->sql->getAllColumns($this->table[$i]);
			$this->columnNames[$i]=array_keys($this->columns[$i]);
		}
	}
	
	/**
	* function to get
	* @access public
	* @param array $options 
	*	{
	*		field: [[t1,f1],f2,...],
	*		filter: [[t1,f1,like,t2,f2],[t1,f1,like,v1],[f1,=,v1],...],
	*		order: [[t1,f1,ASC],[f1,DESC],[f1],...],
	*		start: 0,
	*		limit: 1
	*	}
	* @return array
	*	{
	*		options: {},
	*		root: [{n1:v1,n2:v2,...},...],
	*		count: 1
	*	}
	*/
	public function get($options){
		extract($options);
		
		if($field===null){
			$field=array();
			for($i=0;$i<$this->count;$i++){
				for($j=0,$jj=count($this->columnNames[$i]);$j<$jj;$j++){
					$field[]=array($this->table[$i],$this->columnNames[$i][$j]);
				}
			}
		}
		if($filter===null)$filter=array(array(1,"=",1));
		if($order===null)true;
		if($start===null)$start=0;
		if($limit===null)$limit=0;
		
		$string="select ";
		$array=array();
		
		$c="";
		while(list($k,$v)=each($field)){
			$string.=$c;
			$c=", ";
			if(is_array($v)){
				$string.="`%s`.`%s` as `%s_%s` ";
				$array[]=$v[0];
				$array[]=$v[1];
				$array[]=$v[0];
				$array[]=$v[1];
			}else{
				$string.="`%s` ";
				$array[]=$v;
			}
		}
		
		$string.="from `".implode("`,`",array_fill(0,count($this->table),"%s"))."` where ";
		$array=array_merge($array,$this->table);

		$c="";
		while(list($k,$v)=each($filter)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		while(list($k,$v)=each($this->condition)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		if($order){
			$string.="order by ";
			$c="";
			while(list($k,$v)=each($order)){
				$string.=$c;
				$c=", ";
				$l=count($v);
				if($l==1){
					$string.="order by `%s` %s ";
					$v['1']="ASC";
					$order[$k]=$v;
				}elseif($l==2){
					$string.="order by `%s` %s ";
				}elseif($l==3){
					$string.="order by `%s`.`%s` %s ";
				}
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
	* function to count
	* Notice: the function just count one result, in another word, it can not be used for "select count(f1), count(f2)..."! It can be used as "select count(f1)...", "select count(*)" or "select count(distinct f1, f2,...)".
	* @access public
	* @param $options
	*	{
	*		filter: [[t1,f1,like,t2,f2],[t1,f1,like,v1],[f1,=,v1],...],
	*		field: [[t1,f1],f2,...],
	*		group: [[t1,f1],f2,...],
	*		distinct: "dictinct"
	*	}
	* @return array
	*	{
	*		result: [0,0,...]||0,
	*		message:""
	*	}
	*/
	function count($options){
		extract($options);
		
		if($filter===null)$filter=array(array(1,"=",1));
		if($field===null){
			$field=array();
			for($i=0;$i<$this->count;$i++){
				for($j=0,$jj=count($this->columnNames[$i]);$j<$jj;$j++){
					$field[]=array($this->table[$i],$this->columnNames[$i][$j]);
				}
			}
		}
		if($group===null)true;
		if($distinct===null)$distinct="";else $distinct="distinct";
		
		$string="select count($distinct ";
		$array=array();
		
		$c="";
		while(list($k,$v)=each($field)){
			$string.=$c;
			$c=", ";
			if(is_array($v)){
				$string.="`%s`.`%s` ";
				$array=array_merge($array,$v);
			}else{
				$string.="`%s` ";
				$array[]=$v;
			}
		}
		
		$string.=") as `result` from `".implode("`,`",array_fill(0,count($this->table),"%s"))."` where ";
		$array=array_merge($array,$this->table);
		
		$c="";
		while(list($k,$v)=each($filter)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		while(list($k,$v)=each($this->condition)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		if($group){
			$string.="group by ";
			$c="";
			while(list($k,$v)=each($group)){
				$string.=$c;
				$c=", ";
				if(is_array($v)){
					$string.="`%s`.`%s` ";
					$array=array_merge($array,$v);
				}else{
					$string.="`%s`";
					$array[]=$v;
				}
			}
		}
		
		$this->sql->query($string,$array);
		$rows=$this->sql->getAllRows();
		$o['result']=array();
		while(list($k,$v)=each($rows)){
			$o['result'][]=$v['result'];
		}
		if(count($o['result'])==1)$o['result']=$o['result'][0];
		$o['message']="";
		
		return $o;
	}
	
	function avg(){
	}
	
	function min(){
	}
	
	function max(){
	}
	
	/**
	* function to sum
	* @access public
	* @param $options
	*	{
	*		filter: [[t1,f1,like,t2,f2],[t1,f1,like,v1],[f1,=,v1],...],
	*		field: [[t1,f1],f2,...],
	*		group: [[t1,f1],f2,...]
	*	}
	* @return array||null
	*	{
	*		result: [{n1:sum1,n2:sum2},{n1:sum1,n2:sum2},...]||{n1:sum1,n2:sum2}||sum,
	*		message: "" 
	*	}
	*/
	function sum($options){
		extract($options);
		
		if($filter===null)$filter=array(array(1,"=",1));
		if($field===null)return;
		if($group===null)true;
		
		$string="select ";
		$array=array();
		
		$c="";
		while(list($k,$v)=each($field)){
			$string.=$c;
			$c=", ";
			if(is_array($v)){
				$string.="sum(`%s`.`%s`) as `%s_%s` ";
				$array[]=$v[0];
				$array[]=$v[1];
				$array[]=$v[0];
				$array[]=$v[1];
			}else{
				$string.="sum(`%s`) as `%s` ";
				$array[]=$v;
				$array[]=$v;
			}
		}
		
		$string.="from `".implode("`,`",array_fill(0,count($this->table),"%s"))."` where ";
		$array=array_merge($array,$this->table);
		
		$c="";
		while(list($k,$v)=each($filter)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		while(list($k,$v)=each($this->condition)){
			$string.=$c;
			$c="and ";
			$l=count($v);
			if($l==3){
				$string.="%s %s '%s' ";
			}elseif($l==4){
				$string.="`%s`.`%s` %s '%s' ";
			}elseif($l==5){
				$string.="`%s`.`%s` %s `%s`.`%s` ";
			}
			$array=array_merge($array,$v);
		}
		
		if($group){
			$string.="group by ";
			$c="";
			while(list($k,$v)=each($group)){
				$string.=$c;
				$c=", ";
				if(is_array($v)){
					$string.="`%s`.`%s` ";
					$array=array_merge($array,$v);
				}else{
					$string.="`%s`";
					$array[]=$v;
				}
			}
		}
		
		$this->sql->query($string,$array);
		$o['result']=$this->sql->getAllRows();
		if(count($o['result'])==1)$o['result']=$o['result'][0];
		if(count($field)==1)$o['result']=$o['result'][$field];
		$o['message']="";
		
		return $o;
	}
	
	/**
	* function to get one row with table.field=value
	* @access public
	* @param string $table
	* @param string $field
	* @param mixed $value
	* @return mixed {f1:v1,f2:v2,...};null
	*/
	function getBy($table,$field,$value){
		$o=$this->get(array(
			"filter"=>array(array($table,$field,"=",$value)),
			"start"=>0,
			"limit"=>1
			));
		$o=$o['root'][0];
		return $o;		
	}
}
?>
