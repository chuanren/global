<?php
class ip{
	var $array=array(0,0,0,0);
	var $number=0;
	var $string="0.0.0.0";
	function __smarthis($from){
		if($from!==null)$_this=new ip($from);
		elseif($this)$_this=&$this;
		else $_this=new ip();
		return $_this;
	}
	function __toString(){
		return $this->string;
	}
	function ip($from=null){
		if($from===null){
			$this->getClient();
		}elseif(is_string($from)){
			$this->fromString($from);
		}elseif(is_array($from)){
			$this->fromArray($from);
		}else{
			$this->fromNumber($from);
		}
	}
	function fromArray($array){
		for($i=0;$i<4;$i++){
			$array[$i]=(intval($array[$i])%256+256)%256;
		}
		$this->array=array($array[0],$array[1],$array[2],$array[3]);
		$this->number=$this->array[0]*16777216+$this->array[1]*65536+$this->array[2]*256+$this->array[3];
		$this->string=implode(".",$this->array);
	}
	function fromNumber($number){
		$number=(double)$number;
		$d=fmod($number,256);
		$c=fmod($number=($number-$d)/256,256);
		$b=fmod($number=($number-$c)/256,256);
		$a=fmod($number=($number-$b)/256,256);
		$this->fromArray(array($a,$b,$c,$d));		
	}
	function fromString($string){
		$this->fromArray(explode(".",$string));
	}
	function getClient(){
		if(!$string=$_SERVER['HTTP_X_FORWARDED_FOR'])
			if(!$string=$_SERVER['REMOTE_ADDR'])
				$string="0.0.0.0";
		if($this instanceof ip)$this->fromString($string);
		return $string;
	}
	function toNumber($from=null){
		$_this=ip::__smarthis($from);
		return $_this->number;
	}
	function toLocaleString($from=null){
		$_this=ip::__smarthis($from);
		$db=new mysql();
		$db->query("select `locale` from `ipLocale` where `smallNumber`<='$_this->number' and `bigNumber`>='$_this->number' limit 0, 1");
		$row=$db->getRow();
		return $row[0];
	}
}
?>
