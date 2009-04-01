<?php
class suid{
	public $sql;
	public $database;
	public $table;
	public $condition=array();//[[t1,f1,like,t2,f2],[t1,f1,like,v1],[f1,like,v1],...]
	public $columns;
	public $columnNames;
	public $keyNames;
	public $keyName;
	public $charset="utf8";
	public $tableNumber;
	function suid($sql,$database,$table,$condition=array(),$charset="utf8"){
		$this->sql=$sql;
		$this->database=$database;
		$this->table=is_array($table)?$table:array($table);
		is_array($arg=$condition)?($this->condition=$this->andFilter($arg)):($this->charset=$arg);
		is_array($arg=$charset)?($this->condition=$this->andFilter($arg)):($this->charset=$arg);
		$this->sql->setDatabase($this->database);
		$this->tableNumber=count($this->table);
		$this->sql->setCharset($this->charset);
		$this->columns=array();
		$this->columnsNames=array();
		$this->keyNames=array();
		$this->keyName=array();
		for($i=0;$i<$this->tableNumber;$i++){
			$this->columns[$i]=$this->sql->getAllColumns($this->table[$i]);
			$this->columnNames[$i]=array_keys($this->columns[$i]);
			$this->keyNames[$i]=array();
			while(list($k,$v)=each($this->columns[$i])){
				if($v['key']=="PRI")$this->keyNames[$i][]=$v['name'];
			}
			if(count($this->keyNames[$i])==1){
				$this->keyName[$i]=$this->keyNames[$i][0];
			}
		}
		$condition=array_fill(-1,$this->tableNumber+1,array());
		while(list($k,$v)=each($this->condition)){
			is_array($v)||($v=array($v));
			$l=count($v);
			if($l==3){
				for($i=0;$i<$this->tableNumber;$i++){
					if(in_array($v[0],$this->columnNames[$i])){
						$condition[$i][]=$v;
						break;
					}
				}
			}elseif($l==4){
				$keys=array_keys($this->table,$v[0]);
				if($keys){
					$i=$keys[0];
					$condition[$i][]=$v;
				}
			}else{
				$condition[-1][]=$v;
			}
		}
		$this->condition=$condition;
	}
	
	/**
	* function to parseField
	* @access public
	* @param $field
	*	[[t,f,n],[t,f],[f],f,...]
	* @param $string
	* @param $array
	*/
	public function parseField(&$field,&$string="",&$array=array()){
		$c="";
		while(list($k,$v)=each($field)){
			is_array($v)||($v=array($v));
			$string.=$c;
			$c=", ";
			$l=count($v);
			/**
			* I should write some notes here to avoid mistakes reoccuring again.
			* @#: not all fields need their as names, for example, in count method.
			* @#: all fields should be declared in its tables.
			*/
			if($l==1){
				$field[$k]=$v=array($this->table[0],$v[0]);
				$string.="`%s`.`%s` ";
			}elseif($l==2){
				$string.="`%s`.`%s` ";
			}elseif($l==3){
				$string.="`%s`.`%s` as `%s` ";
			}
			$array=array_merge($array,$v);
		}
	}
	
	/**
	* function to andFilter
	* @access public
	* @param filter[,filter[,...]]
	* @return filter: [element,...]
	*/
	public function andFilter(){
		$filters=func_get_args();
		$filter=array();
		while(list($k,$v)=each($filters)){
			if($this->isLogic($v))$v=array($v);
			elseif(!$this->isFilter($v)){
				if(is_array($v))$v=call_user_method_array("andFilter",$this,$v);
				else $v=array();
			}
			$filter=array_merge($filter,$v);
		}
		return $filter;
	}
	
	/**
	* function to isLogic
	* @access public
	* @param $logic
	* @return bool
	* if $logic is a logic(one element of a filter), returnValue will be true.
	*/
	public function isLogic($logic){
		$conjs=array(
			"like","not like","=","!=",">","<=","<",">=","in","not in"
			);
		return
			is_string($logic)||
			(is_array($logic)&&count($logic)==3&&in_array(strtolower($logic[1]),$conjs))||
			(is_array($logic)&&count($logic)==4&&in_array(strtolower($logic[2]),$conjs))||
			(is_array($logic)&&count($logic)==5&&in_array(strtolower($logic[2]),$conjs))
		;
	}
	
	/**
	* function to isFilter
	* @access public
	* @param $filter
	* @return bool
	* if $filter is a filter(with logic elments), returnValue will be true.
	*/
	public function isFilter($filter){
		if(is_array($filter)){
			while(list($k,$v)=each($filter)){
				if(!$this->isLogic($v))return false;
			}
			return true;
		}else{
			return false;
		}
	}
	
	/**
	* function to parseFilter
	* @access public
	* @param $filter
	*	[[t1,f1,like,t2,f2],[t,f,like,v],[f,=,v],s,...] or one element.
	* @param $string
	* @param $array
	*/
	public function parseFilter(&$filter,&$string="",&$array=array()){
		$filter=$this->andFilter($filter);
		$string.=" ";
		$c="";
		while(list($k,$v)=each($filter)){
			if(is_array($v))$l=count($v);
			else $l=0;
			if($l==0&&is_string($v)){
				$string.="{$c}{$v} ";
				$c="and ";
			}elseif($l==3){
				$filter[$k]=$v=array($this->table[0],$v[0],$v[1],$v[2]);
				$string.="{$c}`%s`.`%s` %s '%s' ";
				$array=array_merge($array,$v);
				$c="and ";
			}elseif($l==4){
				$string.="{$c}`%s`.`%s` %s '%s' ";
				$array=array_merge($array,$v);
				$c="and ";
			}elseif($l==5){
				$string.="{$c}`%s`.`%s` %s `%s`.`%s` ";
				$array=array_merge($array,$v);
				$c="and ";
			}
		}
		if($c=="")$string.="1 ";
	}
	
	/**
	* function to parseGroup
	* @access public
	* @param $group
	*	[[t,f],[f],f,...]
	* @param $string
	* @param $array
	*/
	public function parseGroup(&$group,&$string="",&$array=array()){
		$c="";
		while(list($k,$v)=each($group)){
			is_array($v)||($v=array($v));
			$string.=$c;
			$c=", ";
			$l=count($v);
			if($l==1){
				$group[$k]=$v=array($this->table[0],$v[0]);
			}
			$string.="`%s`.`%s` ";
			$array=array_merge($array,$v);
		}
	}
	
	/**
	* function to select
	* @access public
	* @param array $options 
	*	{
	*		field: parseField,
	*		filter: parseFilter,
	*		order: [[t,f,ASC],[f,DESC],[f],f,...],
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
	function select($options=array()){
		extract($options);
		
		if($field===null){
			if($this->tableNumber==1)$field=$this->columnNames[0];
			else{
				$field=array();
				for($i=0;$i<$this->tableNumber;$i++){
					for($j=0,$jj=count($this->columnNames[$i]);$j<$jj;$j++){
						$field[]=array($this->table[$i],$this->columnNames[$i][$j]);
					}
				}
			}
		}
		if($order===null){
			$order=array();
			reset($this->keyNames[0]);
			while(list($k,$v)=each($this->keyNames[0])){
				$order[]=$v;
			}
		}
		if($start===null)$start=0;
		if($limit===null)$limit=0;
		
		$string="select ";
		$array=array();
		
		$this->parseField($field,$string,$array);
		
		$string.="from `".implode("`,`",array_fill(0,$this->tableNumber,"%s"))."` where ";
		$array=array_merge($array,$this->table);
		
		$this->parseFilter($this->andFilter($filter,$this->condition),$string,$array);
		
		if($order){
			$string.="order by ";
			$c="";
			while(list($k,$v)=each($order)){
				is_array($v)||($v=array($v));
				$string.=$c;
				$c=", ";
				$l=count($v);
				if($l==1){
					$order[$k]=$v=array($this->table[0],$v[0],"ASC");
				}elseif($l==2){
					$order[$k]=$v=array($this->table[0],$v[0],$v[1]);
				}
				$string.="`%s`.`%s` %s ";
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
		
		if($value===null)return;
		if($limit===null)$limit=0;
		
		$string="update `%s` set ";
		$array=array($this->table[0]);
		
		$c="";
		while(list($k,$v)=each($value)){
			$string.="$c`%s`='%s' ";
			$c=",";
			$array[]=$k;
			$array[]=$v;
		}
		
		$string.="where ";
		
		$this->parseFilter($this->andFilter($filter,$this->condition[0]),$string,$array);
		
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
		$array=array($this->table[0]);
		
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
		
		if($limit===null)$limit=0;
		
		$string="delete from `%s` where ";
		$array=array($this->table[0]);
		
		$this->parseFilter($this->andFilter($filter,$this->condition[0]),$string,$array);
		
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
	* Notice: the function just count one result, in another word, it can not be used for "select count(f1), count(f2)..."! It can be used as "select count(f1)...", "select count(*)" or "select count(distinct f1, f2,...)".
	* @access public
	* @param $options
	*	{
	*		filter: parseFilter,
	*		field: parseField,
	*		group: parseGroup,
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
		
		if($filter===null)$filter=1;
		if($field===null){
			$field=array();
			for($i=0;$i<$this->tableNumber;$i++){
				for($j=0,$jj=count($this->columnNames[$i]);$j<$jj;$j++){
					$field[]=array($this->table[$i],$this->columnNames[$i][$j]);
				}
			}
			$distinct="distinct";
		}
		if($group===null)true;
		if($distinct===null)$distinct="";else $distinct="distinct";
		
		$string="select count($distinct ";
		$array=array();
		
		$this->parseField($field,$string,$array);
		
		$string.=") as `result` from `".implode("`,`",array_fill(0,$this->tableNumber,"%s"))."` where ";
		$array=array_merge($array,$this->table);
		
		$this->parseFilter($this->andFilter($filter,$this->condition),$string,$array);
		
		if($group){
			$string.="group by ";
			$this->parseGroup($group,$string,$array);
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
	* @access public
	* @param $options
	*	{
	*		filter: parseFilter,
	*		field: parseField,
	*		group: parseGroup
	*	}
	* @return array||null
	*	{
	*		result: [{f1:sum1,f2:sum2},{f1:sum1,f2:sum2},...]||{f1:sum1,f2:sum2}||sum,
	*		message: "" 
	*	}
	*/
	function sum($options){
		extract($options);
		
		if($filter===null)$filter=1;
		if($field===null)return;
		if($group===null)true;
		
		$string="select ";
		$array=array();
		
		$c="";
		while(list($k,$v)=each($field)){
			is_array($v)||($v=array($v));
			$string.=$c;
			$c=", ";
			$l=count($v);
			if($l==1){
				$string.="sum(`%s`) as `%s` ";
				$array[]=$v[0];
				$array[]=$v[0];
			}elseif($l==2){
				$string.="sum(`%s`.`%s`) as `%s_%s` ";
				$array[]=$v[0];
				$array[]=$v[1];
				$array[]=$v[0];
				$array[]=$v[1];
			}elseif($l==3){
				$string.="sum(`%s`.`%s`) as `%s` ";
				$array[]=$v[0];
				$array[]=$v[1];
				$array[]=$v[3];
			}
		}
		
		$string.="from `".implode("`,`",array_fill(0,$this->tableNumber,"%s"))."` where ";
		$array=array_merge($array,$this->table);
		
		$this->parseFilter($this->andFilter($filter,$this->condition),$string,$array);
		
		if($group){
			$string.="group by ";
			$this->parseGroup($group,$string,$array);
		}
		
		$this->sql->query($string,$array);
		$o['result']=$this->sql->getAllRows();
		if(count($o['result'])==1)$o['result']=$o['result'][0];
		if(count($field)==1)$o['result']=$o['result'][$field];
		$o['message']="";
		
		return $o;
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
			reset($this->keyNames[0]);
			while(list($k,$v)=each($this->keyNames[0])){
				if($id[$v]===null)$id[$v]=$id[$k];
				if($id[$v]===null)return;
				$filter[]=array($v,"=",$id[$v]);
			}
		}elseif($this->keyName[0]){
			$filter=array($this->keyName[0],"=",$id);
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
			reset($this->columnNames[0]);
			while(list($k,$v)=each($this->columnNames[0])){
				$field[]=array($this->table[0],$v);
			}
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
