<?php
class AH{
	public $array;//[row][column], specially, [-1] is the head and is null default
	public $height;//count of array
	public $keys;
	function AH($array=null){
		$this->array=array_values($array);
		$this->height=count($this->array);
		$this->keys=array_keys($this->array[0]);
	}
	function setHead($array){
		$this->array[-1]=$array;
		$this->keys=array_keys($this->array[-1]);
	}
	function setRow($row,$index=null){
		if($index===null){
			$index=$this->height;
			$this->height++;
		}
		$this->array[$index]=$row;
	}
	function getXLS(){
		$args=func_get_args();
		return call_user_method_array("xmlXLS",$this,$args);
	}
	function htmlXLS(){
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
		for($i=$this->array[-1]?-1:0;$i<$this->height;$i++){
			$ans.="<tr>";
			foreach($this->keys as $j){
				$ans.="<td class=xl2216681 nowrap>".$this->array[$i][$j]."</td>";
			}
			$ans.="</tr>\r\n";
		}
		$ans.="</table></div></body></html>";
		return $ans;
	}
	function xmlXLS($worksheet="Sheet1"){
		$header="<?xml version=\"1.0\" encoding=\"UTF-8\"?\>
				<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"
				xmlns:x=\"urn:schemas-microsoft-com:office:excel\"
				xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"
				xmlns:html=\"http://www.w3.org/TR/REC-html40\">";
		$header=stripslashes($header);
		$footer="</Workbook>";
		$xml="";
		$xml.=$header;
		$xml.="\n<Worksheet ss:Name=\"{$worksheet}\">\n<Table>\n";
		$xml.="<Column ss:Index=\"1\" ss:AutoFitWidth=\"0\" ss:Width=\"110\"/>\n";
		for($i=$this->array[-1]?-1:0;$i<$this->height;$i++){
			$line="";
			$line.="<Row>\n";
			foreach($this->keys as $j){
				$line.="<Cell><Data ss:Type=\"String\">{$this->array[$i][$j]}</Data></Cell>\n";
			}
			$line.="</Row>\n";
			$xml.=$line;
		}
		$xml.="</Table>\n</Worksheet>\n";
		$xml.=$footer;
		return $xml;
	}
	function htmlTable($encode="htmlspecialchars(\"%s\")"){
		$html="<table>";
		if($this->array[-1]){
			$html.="<thead><tr>";
			foreach($this->keys as $j){
				$html.="<td>".$this->array[-1][$j]."</td>";
			}
			$html.="</tr></thead>";
		}
		$html.="<tbody>";
		for($i=0;$i<$this->height;$i++){
			$html.="<tr>";
			foreach($this->keys as $j){
				$html.="<td>".@eval("return ".sprintf($encode,$this->array[$i][$j],$j,$i).";")."</td>";
			}
			$html.="</tr>";
		}
		$html.="</tbody></table>";
		return $html;
	}
	function sqlInsert($table){
		$database=null;
		$names=null;
		$argc=func_num_args();
		$args=func_get_args();
		for($i=1;$i<$argc;$i++){
			$arg=$args[$i];
			if(is_string($arg)){
				$database=$arg;
			}elseif(is_array($arg)){
				$names=$arg;
			}
		}
		if($database!==null)$table="`$database`.`$table`";
		if($names===null){
			$names=$this->keys;
		}
		if($names)$names="(`".implode("`.`",$names)."`)";
		else $names="";
		$values=array();
		for($i=0;$i<$this->height;$i++){
			$value=array();
			foreach($this->keys as $j){
				$value[]=$this->array[$i][$j];
			}
			$value="('".implode("','",$value)."')";
			$values[]=$value;
		}
		$values=implode(",",$values);
		$sql="insert into `$table` $names values $values";
		return $sql;
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
