<?php
require("framework.php");
class window extends framework{
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
