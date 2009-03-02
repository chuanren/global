<?php
//version: Liu ChuanRen, 09/11/08
class AA{
	var $array;//[row][column], specially, [-1] is the head and is null default
	var $height=0;//count of arrar
	var $width=0;//maxCount of array[*]
	function AA($array=null){
		$this->array=$array;
		$this->height=count($this->array);
		$this->width=0;
		for($i=0;$i<$this->height;$i++){
			$t=count($this->array[$i]);
			if($t>$this->width){
				$this->width=$t;
			}
		}
	}
	function setHead($array){
		$this->array[-1]=$array;
	}
	function setRow($row,$index=null){
		$width=count($row);
		if($width){
			if($index===null){
				$index=$this->height;
				$this->height++;
			}
			$this->array[$index]=$row;
			if($width>$this->width){
				$this->width=$width;
			}
		}
	}
	function getXls(){
		$ans='<html 
			xmlns:o="urn:schemas-microsoft-com:office:office" 
			xmlns:x="urn:schemas-microsoft-com:office:excel" 
			xmlns="http://www.w3.org/TR/REC-html40">
			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html>
			<head>
			<meta http-equiv="Content-type" content="text/html;charset=utf-8" />
			<style id="Classeur1_16681_Styles"></style></head>
			<body>
			<div id="Classeur1_16681" align=center x:publishsource="Excel">
			<table x:str border=0 cellpadding=0 cellspacing=0 width=100% style="border-collapse: collapse">'."\r\n";
		$i=0;
		if($this->array[-1])$i=-1;
		for($i;$i<$this->height;$i++){
			$ans.="<tr>";
			for($j=0;$j<$this->width;$j++){
				$ans.="<td class=xl2216681 nowrap>".$this->array[$i][$j]."</td>";
			}
			$ans.="</tr>\r\n";
		}
		$ans.="</table></div></body></html>";
		return $ans;
	}
	function htmlTable($encode="htmlspecialchars(\"%s\")"){
		$html="<table>";
		if($this->array[-1]){
			$html.="<thead><tr>";
			for($j=0;$j<$this->width;$j++){
				$html.="<td>".$this->array[-1][$j]."</td>";
			}
			$html.="</tr></thead>";
		}
		$html.="<tbody>";
		for($i=0;$i<$this->height;$i++){
			$html.="<tr>";
			reset($this->array[$i]);
			while(list($k,$v)=each($this->array[$i])){
				$html.="<td>".@eval("return ".sprintf($encode,$v,$k,$i).";")."</td>";
			}
			$html.="</tr>";
		}
		$html.="</tbody></table>";
		return $html;
	}
	function sum($key){
		$r=0;
		for($i=0;$i<$this->height;$i++){
			$r+=$this->array[$i][$key];
		}
		return $r;
	}
}
?>
