<?php
require_once("suid.php");
class sdui extends suid{
	public $replaceColumns;
	public $selectColumns;
	public function htmlSelectTable($options=array()){
		if($options['field']===null)$options['field']=array_keys($this->selectColumns);
		if($options['limit']===null)$options['limit']=20;
		$o=$this->select($options);
		$html="<table class=windowTable width=100% cellspacing=0>\n";
		$html.="<thead><tr>";
		while(list($k,$v)=each($options['field'])){
			$v=$this->columns[$v]['comment']?$this->columns[$v]['comment']:$v;
			$html.="<td>$v</td>";
		}
		$html.="</tr></thead>\n";
		$html.="<tbody>\n";
		while(list($k,$v)=each($o['root'])){
			$html.="<tr>";
			while(list($kk,$vv)=each($v)){
				$vv=($vv=="")?"&nbsp;":$vv;
				$html.="<td>$vv</td>";
			}
			$id=$v[$this->keyName];
			$html.="</tr>\n";
		}
		$html.="</tbody>";
		$html.="</table>";
		return $html;
	}
	public function htmlReplaceForm($id=null){
		if($id===null){
			$row=null;
			$legend="New Item";
		}else{
			$row=$this->selectById($id);
			$legend="Update Item(Id: $id)";
		}
		$html="<form action=\"#\" method=\"post\" class=windowForm><fieldset><legend>$legend</legend><ul>";
		reset($this->replaceColumns);
		while(list($k,$v)=each($this->replaceColumns)){
			$span=$v['comment']?$v['comment']:$v['name'];
			$html.="<li><label>$span</label>";
			$html.=sql::htmlColumnToInput($v,"ReplaceForm[{$v['name']}]",$row[$v['name']]);
			$html.="</li>";
		}
		$html.="</ul></fieldset>";
		$html.="<input type=reset value=Reset />";
		$html.="<input type=submit name=submit value=Submit />";
		$html.="</form>";
		return $html;
	}
}
?>