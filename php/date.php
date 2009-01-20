<?php
//version: Liu ChuanRen, 05/12/08
class date{
	function __toString(){
		return $this->format();
	}
	function date($string=""){
		$time=@strtotime($string);
		$this->time=$time===false||$time===-1?time():$time;		
		$date=getdate($this->time);		
		$this->seconds=$date['seconds'];
		$this->minutes=$date['minutes'];
		$this->hours=$date['hours'];
		$this->mday=$date['mday'];
		$this->wday=$date['wday'];
		$this->mon=$date['mon'];
		$this->year=$date['year'];
		$this->yday=$date['yday'];
		$this->weekday=$date['weekday'];
		$this->month=$date['month'];
		$this->string=$this->format();
	}
	function checkCron($m="*",$h="*",$dom="*",$mon="*",$dow="*"){
		if(count($temp=explode(" ",$m))==5)list($m,$h,$dom,$mon,$dow)=$temp;
		return $this->checkCronCheck($this->minutes,$m)
			&&$this->checkCronCheck($this->hours,$h)
			&&$this->checkCronCheck($this->mday,$dom)
			&&$this->checkCronCheck($this->mon,$mon)
			&&$this->checkCronCheck($this->wday,$dow);
	}
	function checkCronCheck($value,$flag){
		if($flag=="*"){//star
			$return=true;
		}elseif(count($temp=explode(",",$flag))>1){//comma
			if(in_array($value,$temp)){
				$return=true;
			}else{
				$return=false;
			}
		}elseif($temp=strpos($flag,"/")){//like */10
			$temp=intval(substr($flag,$temp+1));
			if($temp>0){
				if($value%$temp){
					$return=false;
				}else{
					$return=true;
				}
			}else{
				$return=false;
			}
		}else{
			$return=false;
		}
		return $return;
	}
	function format($format="Y-m-d H:i:s"){
		return date($format,$this->time);
	}
}
?>
