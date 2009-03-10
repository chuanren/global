<?php
require_once("framework.php");
class window extends framework{
	public $charset="utf-8";
	public $title="PHP Window";
	public $menu;
	public function window($id,$path="window"){
		parent::__construct($id,$path);
		$this->setPlugins(dirname(__file__)."/Window/plugin");
	}
	public function alert($msg,$href="#"){
		$this->stdout[]="<center><div class=windowAlert>$msg<hr /><a href=$href onclick='Element.remove(this.parentNode.parentNode);'>OK</a></div></center>";
	}
	public function confirm($msg){
		$confirm=$_GET['windowConfirm'];
		if($confirm)return $confirm;
		$queryString=$_SERVER['QUERY_STRING'];
		$this->stdout[]="<center><div class=windowAlert>$msg<hr /><a href=?{$queryString}&windowConfirm=yes>Yes</a> <a href=?{$queryString}&windowConfirm=no>No</a></div></center>";
	}
}
?>
