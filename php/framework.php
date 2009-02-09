<?php
/**
framework
	action
		default
			model.php
			view.php
			controller.php
			
	plugin
		test
			beforeEvent.php
			Event.php
			afterEvent.php


*/
class framework{
	public $id;
	public $path;
	
	public $actions=array();
	public $plugins=array();
	
	public $base="";
	public $askmark="?";
	public $eqnmark="=";
	public $andmark="&";
	
	public $value=array();
	public $action="default";
	
	public $stdout=array();
	public $stderr=array();
	
	public function framework($id,$path="framework"){
		global $_FRAMEWORK;
		$this->id=$id;
		$_FRAMEWORK[$id]=&$this;
		$this->path=realpath($path);
		$plugins=@scandir("{$this->path}/plugin");
		list($k,$v)=@each($plugins);//.
		list($k,$v)=@each($plugins);//..
		while(list($k,$v)=@each($plugins)){
			$this->plugins[$v]=scandir("{$this->path}/plugin/$v");
		}
	}
	public function getInstance($id){
		global $_FRAMEWORK;
		return $_FRAMEWORK[$id];
	}
	public function toUrl($value){
		$s="{$this->base}{$this->askmark}";
		while(list($k,$v)=each($value)){
			$v=urlencode($v);
			$s.="$k{$this->eqnmark}$v{$this->andmark}";
		}
		return $s;
	}
	//Events
	private function Initialize(){
		return true;
	}
	private function Route(){
		$this->value=$_REQUEST;
		if(preg_match("/^([A-Za-z0-9]+)/",$_SERVER['QUERY_STRING'],$framework_t)){
			$this->action=$framework_t[1];
		}
		@include("{$this->path}/action/{$this->action}/model.php");
		include("{$this->path}/action/{$this->action}/controller.php");
		return true;
	}
	private function Render(){
		$framework_path="{$this->path}/action/{$this->action}/view.php";
		if(is_file($framework_path))include($framework_path);
		else include("{$this->path}/action/default/view.php");
		return true;
	}
	private function Output(){
		echo implode("",$this->stdout);
		return true;
	}
	//Event mechanism
	private function BAEvent($framework_eventName,$framework_BA=""){
		$framework_flag=true;
		reset($this->plugins);
		while(list($framework_k,$framework_v)=each($this->plugins)){
			$framework_path="{$this->path}/plugin/$framework_k/$framework_BA$framework_eventName.php";
			if(is_file($framework_path)){
				$framework_flag=require($framework_path);
				if($framework_flag)continue;
				else break;
			}
		}
		return $framework_flag;
	}
	public function fireEvent($framework_eventName){
		$framework_flag=true;
		$framework_flag=$this->BAEvent($framework_eventName,"before");
		if($framework_flag)$framework_flag=$this->$framework_eventName();
		if($framework_flag)$framework_flag=$this->BAEvent($framework_eventName);
		if($framework_flag)$framework_flag=$this->BAEvent($framework_eventName,"after");
		return $framework_flag;
	}
}
?>
