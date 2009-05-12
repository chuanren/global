<?php
require_once("suid.php");
require_once("window.php");
class sdui extends suid{
	public $base="";
	public $askmark="?";
	public $eqnmark="=";
	public $andmark="&";
	public $baseParams=array();
	
	public $action;
	public $actionName;
	public $replaceColumns;
	public $selectColumns;
	public function sdui($sql,$database,$table,$charset="utf8"){
		parent::__construct($sql,$database,$table,$charset);
		$this->QueryString="";
		$this->actionName="action";
		$this->replaceColumns=$this->columns[0];
		array_shift($this->replaceColumns);
		$this->selectColumns=$this->columns[0];
		foreach($this->selectColumns as $k=>$v){
			if($v['type']=="text")unset($this->selectColumns[$k]);
		}
	}
	public function toUrl($params=array(),$action=null){
		unset($params[$this->actionName]);
		$action||($action=$this->action);
		$params=array_merge(array($this->actionName=>$action),$params);
		return window::toUrl($params,$this);
	}
	public function htmlSelectTable($options=array()){
		$session=&$_SESSION["sduiHtmlSelectTableOptions_{$this->actionName}"];
		$session||($session=array());
		$options=array_merge($session,$options);
		if($options['field']===null)$options['field']=array_keys($this->selectColumns);
		if($options['start']===null)$options['start']=0;
		if($options['limit']===null)$options['limit']=20;
		$session=$options;
		$o=$this->select($options);
		$options=array_merge($options,$o['options']);
		$html="<table id=sduiHtmlSelectTable class=windowTable width=100%>\n";
		$html.="<thead><tr windowTip='Click to sort the items.'>";
		while(list($k,$v)=each($options['field'])){
			$text=$this->columns[0][$v[1]]['comment']?$this->columns[0][$v[1]]['comment']:$v[1];
			$html.="<td field={$v[1]}>$text</td>";
		}
		$html.="</tr></thead>\n";
		$html.="<tbody>\n";
		while(list($k,$v)=each($o['root'])){
			$id=$v[$this->keyName[0]];
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
		$html.="<script>var sdui=".@json_encode($this)."</script>";
		$html.="<script>var sduiHtmlSelectTableOptions=".json_encode($options).";</script>";
		$html.="<script src=/global/php/SDUI/sdui.js></script>";
		$html.="<script src=/global/php/SDUI/htmlSelectTable.js></script>";
		$html.="<style>@import url(/global/php/SDUI/htmlSelectTable.css);</style>";
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
		$html="<form id=sduiHtmlReplaceForm action=\"#\" method=\"post\" class=windowForm><fieldset><legend>$legend</legend><ul>";
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
		$html.="<script>var sdui=".@json_encode($this)."</script>";
		$html.="<script>var sduiHtmlReplaceFormValues=".json_encode($values).";</script>";
		$html.="<script src=/global/php/SDUI/sdui.js></script>";
		$html.="<script src=/global/php/SDUI/htmlReplaceForm.js></script>";
		return $html;
	}
	public function handleRequest(){
		switch($this->action=$_GET[$this->actionName]){
		case "Update":
			$id=$_GET['id'];
			if($_POST['sduiHtmlReplaceFormSubmit']){
				if(ini_get('magic_quotes_gpc')){
					while(list($k,$v)=each($_POST['sduiHtmlReplaceForm'])){
						if(is_string($v))$_POST['sduiHtmlReplaceForm'][$k]=stripslashes($v);
					}
				}
				if($this->updateById($id,$_POST['sduiHtmlReplaceForm']))$html=window::alert("Succeeded to Update ID={$id}",$this->toUrl(array(),"Select"));
				else	$html=window::alert("Failed to Update ID={$id}",$this->toUrl(array(),"Select"));
			}else{
				$html=$this->htmlReplaceForm($id);
			}
			break;
		case "Insert":
			if($_POST['sduiHtmlReplaceFormSubmit']){
				if(ini_get('magic_quotes_gpc')){
					while(list($k,$v)=each($_POST['sduiHtmlReplaceForm'])){
						if(is_string($v))$_POST['sduiHtmlReplaceForm'][$k]=stripslashes($v);
					}
				}
				$id=$this->insertById($_POST['sduiHtmlReplaceForm']);
				$html=window::alert("Succeeded to Insert ID={$id}",$this->toUrl(array(),"Select"));
			}else{
				$html=$this->htmlReplaceForm();
			}
			break;
		case "Delete":
			$id=$_GET['id'];
			$confirm=window::confirm("Confirm to DELETE ID={$id}?");
			if($confirm=="yes"){
				if($this->deleteById($id))$html=window::alert("Succeeded to Delete ID={$id}",$this->toUrl(array(),"Select"));
				else $html=window::alert("Failed to Delete ID={$id}",$this->toUrl(array(),"Select"));
			}elseif($confirm=="no"){
				$html=window::alert("Canceled to Delete ID: {$id}",$this->toUrl(array(),"Select"));
			}else{
				$html=$confirm;
			}
			break;
		default:
			$options=$_GET;
			$html=$this->htmlSelectTable($options);
		}
		return $html;
	}
}
?>