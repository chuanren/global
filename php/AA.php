<?php
require_once("AH.php");
class AA extends AH{
	public $width;//maxCount of array[*]
	function AA($array=null){
		parent::__construct($array);
		$this->width=0;
		for($i=0;$i<$this->height;$i++){
			$this->array[$i]=array_values($this->array[$i]);
			$t=count($this->array[$i]);
			if($t>$this->width){
				$this->width=$t;
			}
		}
		$this->keys=array_keys(array_fill(0,$this->width,0));
	}
	function setHead($array){
		$array=array_values($array);
		parent::setHead($array);
		$width=count($array);
		if($width>$this->width){
			$this->width=$width;
			$this->keys=array_keys(array_fill(0,$this->width,0));
		}
	}
	function setRow($row,$index=null){
		$row=array_values($row);
		parent::setRow($row,$index);
		$width=count($row);
		if($width>$this->width){
			$this->width=$width;
			$this->keys=array_keys(array_fill(0,$this->width,0));
		}
	}
}
?>
