<?php
//version: php@liuchuanren.com.cn, 07/15/08
class A{
	var $array;
	var $length;
	function A($array=null){
		$this->array=$array;
		$this->length=count($this->array);
	}
	function each(){
		return each($this->array);
	}
	function getKeys($type=3){//1: continuous integers, 2: others, 3: all
		$return=array(array(),array(),array());
		for($i=0;$i<$this->length;$i++){
			if(isset($this->array[$i])){
				$return[0][]=$i;
			}else{
				break;
			}
		}
		if($type==1)return $return[0];
		$this->walk(create_function('$v,$k,$return','
			if($k!==$return[0][$k])$return[1][]=$k;
		'),$return);
		if($type==2)return $return[1];
		$return[2]=array_merge($return[0],$return[1]);
		return $return[2];
	}
	function getValue($k){
		return $this->array[$k];
	}
	function reset(){
		return reset($this->array);
	}
	function setValue($v,$k=null){
		if($k===null)$this->array[]=$v;
		else $this->array[$k]=$v;
		$this->length=count($this->array);
	}
	function walk($f,$third=null){
		return array_walk($this->array,$f,$third);
	}
}
?>
