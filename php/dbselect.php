<?php
//can not be used!!!
//version: Liu ChuanRen, 07/02/08
require_once("request.php");
class dbselect{
	var $db;
	var $table;
	var $selectHash=array();
	var $selectColumn;
	var $request;
	var $requestName;
	function dbselect($db,$table,$requestName="dbselect"){
		$this->db=$db;
		$this->table=$table;
		$this->requestName=$requestName;
	}
	function getPagePanel(){
		$hash=array_merge(
			array(
				$this->request->value["searchField"]=>"%".$this->request->value["searchValue"]."%"
			),
			$this->selectHash
		);
		$limit=$this->request->value["pageLimit"];
		$row=$this->db->countHash($hash);
		$page=ceil($row/$limit);
		$current=$this->request->value["pageCurrent"];
		$start=$limit*$current;
		$end=$start+$limit-1;
		$body="$page Page(s), $row Item(s). ";
		$i=$current-5;($i<0)&&($i=0);
		$ii=$current+5;($ii>$page)&&($ii=$page);
		for($i;$i<$current;$i++){
			$body.="<a href=#".$this->requestName."[pageCurrent]=$i>$i</a>";
		}
		$body.="<a>$i($start-$end)</a>";
		for($i++;$i<$ii;$i++){
			$body.="<a href=#".$this->requestName."[pageCurrent]=$i>$i</a>";
		}
		return $body;
	}
	function getSearchPanel(){
		$body="<form id=".$this->requestName."[search] action='#'>";
		$body.="Select Item(s) Where <select id=".$this->requestName."[searchField]>";
		reset($this->fields);
		while(list($k,$v)=each($this->fields)){
			$body.="<option value=\"$v\">".$this->titles[$k]."</option>";
		}
		$body.="</select><select id=".$this->requestName."[searchLogic]>";
		$body.="<option value=\"like%\">Like %...%</option>";
		//$body.="<option value=\"like\">Like</option>";
		//$body.="<option value=\"not like\">Not Like</option>";
		$body.="</select><input id=".$this->requestName."[searchValue] type=input />";
		$body.="<input type=submit value=-Go- />";
		$body.="</form>";
		return $body;
	}
	function getTable(){
		$sql="select `".@implode("`,`",array_keys($this->selectColumn))."` from $this->view ";
		$sql.="order by `".$this->request->value['titleField']."` ".$this->request->value['titleOrder']." ";
		$sql.="limit ".($this->request->value['pageLimit']*$this->request->value['pageCurrent']).", ".$this->request->value['pageLimit'];
		$body="<table id=".$this->requestName."[table]><thead><tr>";
		reset($this->fields);
		while(list($k,$v)=each($this->fields)){
			$body.="<td><a href=#".$this->requestName."[titleField]=$v>".$this->titles[$k]."</a></td>";
		}
		$body.="</tr></thead><tbody>\n";
		$this->db->query($sql);
		while($row=$this->db->getRow()){
			$body.="<tr>";
			reset($this->fields);
			while(list($k,$v)=each($this->fields)){
				$body.="<td>".$row[$v]."</td>";
			}
			$body.="</tr>\n";
		}
		$body.="</tbody></table>";
		return $body;
	}
	function setView(){
		$this->view="`$this->table` where $this->where and `".$this->request->value['searchField']."` ";
		switch($this->request->value['searchLogic']){
			case "like%":
				$this->view.="like '%".str_replace(" ","%",$this->request->value['searchValue'])."%' ";
				break;
			default:
				$this->view.=$this->request->value['searchLogic']." '".$this->request->value['searchValue']."' ";
		}
	}
	function handleRequest(){
		$this->request=new request($this->requestName);
		$this->request->checkValue("pageLimit","/^[1-9]{1}[0-9]*$/",20);
		$this->request->checkValue("pageCurrent","/^[1-9]{1}[0-9]*$/",0);
		$this->request->checkValue("searchField",$temp="/".@implode("|",$this->fields)."/",$this->fields[0]);
		$this->request->checkValue("searchLogic","/^like%|like|not like$/","like%");
		$this->request->checkValue("titleField",$temp,$this->fields[0]);
		$this->request->checkValue("titleOrder","/^desc$/","");
		$this->setView();
		print($this->getSearchPanel());
		print($this->getTable());
		print($this->getPagePanel());
	}
}
?>
