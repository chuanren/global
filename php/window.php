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
	public function alert($msg){
		
	}
	public function confirm($msg){
	}
}
?>
