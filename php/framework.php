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
		$this->setPlugins("{$this->path}/plugin");
	}
	public function getInstance($id){
		global $_FRAMEWORK;
		return $_FRAMEWORK[$id];
	}
	public function setPlugins($path){
		$path=realpath($path);
		$plugins=@scandir($path);
		while(list($k,$v)=@each($plugins)){
			//avoid ., .., .svn, ....
			if(substr($v,0,1)!=".")$this->plugins["$path/$v"]=scandir("$path/$v");
		}
	}
	public function toUrl($value){
		$s="{$this->base}{$this->askmark}";
		while(list($k,$v)=each($value)){
			$v=urlencode($v);
			$s.="$k{$this->eqnmark}$v{$this->andmark}";
		}
		return $s;
	}
	//Main
	public function main(){
		//Initialize
		$framework_flag=$this->BAEvent("Initialize","before");
		if(preg_match("/^([A-Za-z0-9]+)/",$_SERVER['QUERY_STRING'],$framework_t)){
			$this->action=$framework_t[1];
		}
		$this->value=$_REQUEST;
		if($framework_flag)$framework_flag=$this->BAEvent("Initialize");
		if($framework_flag)$framework_flag=$this->BAEvent("Initialize","after");
		//Route
		$framework_flag=$this->BAEvent("Route","before");
		$framework_path="{$this->path}/action/{$this->action}/model.php";
		if(is_file($framework_path)){
			require($framework_path);
		}
		$framework_path="{$this->path}/action/{$this->action}/controller.php";
		if(is_file($framework_path)){
			require($framework_path);
		}
		if($framework_flag)$framework_flag=$this->BAEvent("Route");
		if($framework_flag)$framework_flag=$this->BAEvent("Route","after");
		//Render
		$framework_flag=$this->BAEvent("Render","before");
		$framework_path="{$this->path}/action/{$this->action}/view.php";
		if(is_file($framework_path)){
			require($framework_path);
		}else{
			$framework_path="{$this->path}/action/default/view.php";
			if(is_file($framework_path)){
				require($framework_path);
			}
		}
		if($framework_flag)$framework_flag=$this->BAEvent("Render");
		if($framework_flag)$framework_flag=$this->BAEvent("Render","after");
		//Output
		$framework_flag=$this->BAEvent("Output","before");
		echo implode("",$this->stdout);
		if($framework_flag)$framework_flag=$this->BAEvent("Output");
		if($framework_flag)$framework_flag=$this->BAEvent("Output","after");
	}
	//Event mechanism
	private function BAEvent($framework_eventName,$framework_BA=""){
		$framework_flag=true;
		reset($this->plugins);
		while(list($framework_k,$framework_v)=each($this->plugins)){
			$framework_path="$framework_k/$framework_BA$framework_eventName.php";
			if(is_file($framework_path)){
				$framework_flag=require($framework_path);
				if($framework_flag){
					continue;
				}else break;
			}
		}
		return $framework_flag;
	}
}
?>
