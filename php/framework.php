<?php
//version: php@liuchuanren.com.cn, 07/04/08
/*
ZF's MVC solution: every controller is a predefined class by ZF. 
But I prefer to use original php scripts as controllers. In every script, $this is the model's instance who is calling the script as controller. When the script is normally ended, $this->__destruct will run.

Now we discuss the view if you noticed $model->views="/path/to/view" above. In my opinion, view is an optional part. The controller can output htmls so you can abandon the view part. Or the controller can set the object $model->view(Notice $model is $this in script). For example, the content of
	/path/to/view/signIn.php
is:
	<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<title>signIn</title>
		</head>
		<body>
			<#name#>
			<?php print($this->var->name);?>
			value
		</body>
	</html>
the content of 
	/path/to/controller/signIn.php
is:
	<?php
		$this->var->name="value";
	?>
Now, I am considering to use output_add_rewrite_var function.
*/
class framework{
	public $id;
	public $path;//contains subdirectories: model, view, controller, plugin.
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
		$this->path=realpath($path);
		$_FRAMEWORK[$id]=&$this;
	}
	public function getInstance($id){
		global $_FRAMEWORK;
		return $_FRAMEWORK[$id];
	}
	public function toUrl($value){
		$s="{$this->base}{$this->askmark}";
		while(list($k,$v)=each($value)){
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
		if(preg_match("([A-Za-z0-9]+)",$_SERVER['QUERY_STRING'],$action)){
			$this->action=$action[1];
		}
		@include("{$this->path}/model/{$this->action}.php");
		require("{$this->path}/controller/{$this->action}.php");
		return true;
	}
	private function Render(){
		@include("{$this->path}/view/{$this->action}.php");
		return true;
	}
	private function Output(){
		print implode("",$this->stdout);
		return true;
	}
	//Event mechanism
	private function BAEvent($framework_eventName,$framework_BA){
		$framework_flag=true;
		$framework_path="{$this->path}/plugin/$framework_BA$framework_eventName";
		$framework_plgs=@scandir($framework_path);
		while(list($framework_k,$framework_v)=@each($framework_plgs)){
			if(preg_match("/\.php$/",$framework_v)){
				$framework_flag=require("$framework_path/$framework_v");
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
		if($framework_flag)$framework_flag=$this->BAEvent($framework_eventName,"after");
		return $framework_flag;
	}
}
?>
