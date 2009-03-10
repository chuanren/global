<?php
require_once("suid.php");
class sdui extends suid{
	public $replaceColumns;
	public $selectColumns;
	public function htmlSelectTable($options=array()){
		if($options['field']===null)$options['field']=array_keys($this->selectColumns);
		if($options['limit']===null)$options['limit']=20;
		if($options['contextMenu']===null)$options['contextMenu']=array(
			array("Update","?{$this->actionName}=Update&id="),
			array("Delete","?{$this->actionName}=Delete&id="),
			array("Insert","?{$this->actionName}=Insert&")
			);
		$o=$this->select($options);
		$html="<table id=sduiSelectTable class=windowTable width=100% cellspacing=0>\n";
		$html.="<thead><tr>";
		while(list($k,$v)=each($options['field'])){
			$v=$this->columns[$v]['comment']?$this->columns[$v]['comment']:$v;
			$html.="<td>$v</td>";
		}
		$html.="</tr></thead>\n";
		$html.="<tbody>\n";
		while(list($k,$v)=each($o['root'])){
			$id=$v[$this->keyName];
			$html.="<tr sduiId=$id>";
			while(list($kk,$vv)=each($v)){
				$vv=($vv=="")?"&nbsp;":$vv;
				$html.="<td>$vv</td>";
			}
			$html.="</tr>\n";
		}
		$html.="</tbody>";
		$html.="</table>";
		if($options['contextMenu']){
			$html.="
		<style>@import url('/global/menu/vMenu.css');></style>
		<script src=/global/menu/contextMenu.js></script>
		<script>
		Element.childElements($('sduiSelectTable').getElementsByTagName('tbody')[0]).each(function(tr){
			var id=tr.readAttribute('sduiID');
			new contextMenu(tr,[";
			list($k,$v)=each($options['contextMenu']);
			$html.="['{$v[0]}','{$v[1]}'+id]";
			while(list($k,$v)=each($options['contextMenu'])){
				$html.=",['{$v[0]}','{$v[1]}'+id]";
			}
			$html.="]);
		});
		</script>
			";
		}
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