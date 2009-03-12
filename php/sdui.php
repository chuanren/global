<?php
require_once("suid.php");
require_once("window.php");
class sdui extends suid{
	public $actionName;
	public $replaceColumns;
	public $selectColumns;
	public function sdui($sql,$database,$table,$charset="utf8"){
		parent::__construct($sql,$database,$table,$charset);
		$this->actionName="action";
		$this->replaceColumns=$this->columns;
		array_shift($this->replaceColumns);
		$this->selectColumns=$this->columns;
		$_SESSION['sduiHtmlSelectTableOptions']=array();
	}
	public function htmlSelectTable($options=array()){
		$options=array_merge($_SESSION['sduiHtmlSelectTableOptions'],$options);
		if($options['field']===null)$options['field']=array_keys($this->selectColumns);
		if($options['start']===null)$options['start']=0;
		if($options['limit']===null)$options['limit']=20;
		$_SESSION['sduiHtmlSelectTableOptions']=$options;
		$o=$this->select($options);
		$html="<table id=sduiHtmlSelectTable class=windowTable width=100%>\n";
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
		$html.="<tfoot><tr><td colspan=".count($options['field'])."></td></tr></tfoot>";
		$html.="</table>";
		$options['count']=$this->count(array("filter"=>$options['filter']));
		$options['count']=$options['count']['result'];
		$options['actionName']=$this->actionName;
		$html.="<script>var sduiHtmlSelectTableOptions=".json_encode($options).";</script>";
		$html.="<script src=/global/php/SDUI/htmlSelectTable.js></script>";
		return $html;
	}
	
	/**
	* @access public
	* @param $id null||ID
	* @param $values array the key in the array should be the columnName, the value in the array can be: string, array(string), array(array(string),array(string))
	* @return html
	*/
	public function htmlReplaceForm($id=null,$values=array()){
		if($id===null){
			$row=null;
			$legend="New Item(Id: #)";
		}else{
			$row=$this->selectById($id);
			$legend="Update Item(Id: $id)";
		}
		$html="<form action=\"#\" method=\"post\" class=windowForm><fieldset><legend>$legend</legend><ul>";
		reset($this->replaceColumns);
		while(list($k,$v)=each($this->replaceColumns)){
			$name=$v['name'];
			$span=$v['comment']?$v['comment']:$name;
			$html.="<li><label>$span</label>";
			$html.=sql::htmlColumnToInput($v,"sduiHtmlReplaceForm[{$name}]",$row[$name]);
			$html.="</li>";
		}
		$html.="</ul></fieldset>";
		$html.="<input type=reset value=Reset />";
		$html.="<input type=submit name=sduiHtmlReplaceFormSubmit value=Submit />";
		$html.="</form>";
		$html.="<script>var sduiHtmlReplaceFormValues=".json_encode($values).";</script>";
		$html.="<script src=/global/php/SDUI/htmlReplaceForm.js></script>";
		return $html;
	}
	public function handleRequest(){
		switch($_GET[$this->actionName]){
		case "Update":
			$id=$_GET['id'];
			if($_POST['sduiHtmlReplaceFormSubmit']){
				$this->updateById($id,$_POST['sduiHtmlReplaceForm']);
				$html=window::alert("Succeeded to Update ID={$id}","?{$this->actionName}");
			}else{
				$html=$this->htmlReplaceForm($id);
			}
			break;
		case "Insert":
			if($_POST['sduiHtmlReplaceFormSubmit']){
				$id=$this->insertById($_POST['sduiHtmlReplaceForm']);
				$html=window::alert("Succeeded to Insert ID={$id}","?{$this->actionName}");
			}else{
				$html=$this->htmlReplaceForm();
			}
			break;
		case "Delete":
			$id=$_GET['id'];
			$confirm=window::confirm("Confirm to DELETE ID={$id}?");
			if($confirm=="yes"){
				if($this->deleteById($id))$html=window::alert("Succeeded to Delete ID={$id}","?{$this->actionName}");
				else $html=window::alert("Failed to Delete ID={$id}","?{$this->actionName}");
			}elseif($confirm=="no"){
				$html=window::alert("Canceled to Delete ID: {$id}","?{$this->actionName}");
			}else{
				$html=$confirm;
			}
			break;
		default:
			$html=$this->htmlSelectTable(array(
				"start"=>$_GET['start']
				));
		}
		return $html;
	}
}
?>