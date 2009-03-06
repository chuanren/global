<?php
require("framework.php");
class window{
	var $id;
	function window($id,$path="window"){
		$this->id=$id;
		$this->path=realpath($path);
		$this->framework=new framework($this->id,$this->path);
		$this->framework->setPlugins(dirname(__file__)."/Window/plugin");
	}
	function main(){
		$this->framework->main();
	}
}
?>
