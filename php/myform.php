<?php
//version: Liu ChuanRen, 11/22/07
class myform{
	var $attributes;//is a string, for example: method="post"
	var $inputs;//is a array, {name:{html,ereg,hint,check}}
	var $request;//$_REQUEST
	var $report=true;//true or false for show the hints
	var $check=null;
	var $form="";
	var $debug=false;
	function myform($attributes){
		$this->attributes=$attributes;
	}
	function message($msg){
		if($this->debug){
			return "\r\n<br />".$msg."<br />\r\n";
		}
	}
	function setInput($name,$html,$ereg=".*",$hint="WRONG!"){
		$this->inputs[$name]=array('html'=>$html,'ereg'=>$ereg,'hint'=>$hint);
	}
	function handleInput($name){
		$prefix=$suffix="";
		if(ereg($this->inputs[$name]['ereg'],$this->request[$name])){
			$this->inputs[$name]['check']=true;
		}else{
			echo $this->message($this->inputs[$name]['ereg']."<=WRONG=>".$this->request[$name]);
			$this->check=$this->inputs[$name]['check']=false;
			if($this->report){
				$prefix="<fieldset><legend>".$this->inputs[$name]['hint']."</legend>";
				$suffix="</fieldset>";
			}
		}
		return $prefix.$this->inputs[$name]['html'].$suffix;
	}
	function handleRequest($request){
		$this->request=$request;
		$this->check=true;
		$this->form="<form $this->attributes><ul>";
		while(list($key,$value)=each($this->inputs)){
			$this->form.="<li>".$this->handleInput($key)."</li>";
		}
		$this->form.="</ul></form>";
		return $this->check;
	}
}
?>
