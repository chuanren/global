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
		$html="<center><div class=windowAlert>$msg<hr /><button href=$href>OK</button></div></center>";
		if($this)$this->stdout[]=$html;
		return $html;
	}
	public function close(){
		$html="<script>top.close();</script>";
		if($this)$this->stdout[]=$html;
		return $html;
	}
	public function confirm($msg){
		$confirm=$_GET['windowConfirm'];
		if($confirm)return $confirm;
		$queryString=$_SERVER['QUERY_STRING'];
		$html="<center><div class=windowAlert>$msg<hr /><button href=?{$queryString}&windowConfirm=yes>Yes</button> <button href=?{$queryString}&windowConfirm=no>No</button> <button href=#>Ignore</button></div></center>";
		if($this)$this->stdout[]=$html;
		return $html;
	}
	public function location($href,$delay=0){
		if($delay>0)sleep($delay);
		header("Locaton: $href");
		$html="<script>location=\"$href\";</script>";
		if($this)$this->stdout[]=$html;
		return $this;
	}
}
?>
