<?php
//version: php@liuchuanren.com.cn, 07/04/08
/*
ZF's MVC solution: every controller is a predefined class by ZF. 
But I prefer to use original php scripts as controllers. In every script, $this is the model's instance who is calling the script as controller. When the script is normally ended, $this->__destruct will run.
Some controllers will output links(html). The link attributes must be properly set. Use .htaccess solution.
Normally, controllers(scripts) are stored in one folder. For example, 
	/path/to/controller 
is a directory, contains 
	/path/to/controller/signIn.php
	/path/to/controller/signOut.php.
The two files are controllers. Then
	http://example.com/application/signIn?name=value
	http://example.com/application/signOut
are two requests who will call associate controllers above. In the situation, 
	http://example.com/application/signIn?name=value
can output a link like <a href="signOut">SignOut</a>. It works. NOTICE: 
	http://example.com/application
is associate with 
	/applicationpath/to/application.
We need create two files if we use Apache:
	/applicationpath/to/application/.htaccess
	/applicationpath/to/application/index.php.
The content of
	/applicationpath/to/application/.htaccess
is:
	RewriteEngine on
	RewriteRule ^[a-zA-Z0-9]$ index.php
The content of 
	/applicationpath/to/application/index.php
is:
	<?php
		require("model.php");
		$model=new model("/path/to");
	?>
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
	var $id;
	var $path;//contains subdirectories: model, view, controller, plugin, vendor
	public function framework($id,$path){
		global $_FRAMEWORK;
		$this->id=$id;
		$this->path=$path;
		$_FRAMEWORK[$id]=&$this;
		$this->fireEvent("Initialize");
		$this->fireEvent("Route");
		$this->fireEvent("Render");
		$this->fireEvent("Output");
	}
	public function getInstance($id){
		global $_FRAMEWORK;
		return &$_FRAMEWORK[$id];
	}
	//Events, maybe plugins with modification for event should be implemented. 
	public function Initialize(){
	}
	public function Route(){
	}
	public function Render(){
	}
	public function Output(){
	}
	private function BAEvent($framework_eventName,$framework_BA){
		$framework_flag=true;
		$framework_path="{$this->path}/plugin/$framework_BA$framework_eventName";
		$framework_plgs=scandir($framework_path);
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
