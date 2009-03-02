<?php
//version: Liu ChuanRen, 05/09/08
//the program use database global.diczh
require_once(dirname(__file__)."/mysql.php");
class diczh{
	function getPinyin($zh){
		$return=array();
		$db=new mysql();
		$db->query("select `pinyin`, `tone` from `diczh` where `zh` like '%%%s%%'",array($zh));
		while($row=$db->getRow())$return[]=$row;
		return $return;
	}
	function getZh($pinyin,$tone="_"){
		$return="";
		$db=new mysql();
		$db->query("select `zh` from `diczh` where `pinyin` like '%s' and `tone` like '%s'",array($pinyin,$tone));
		while($row=$db->getRow())$return.=$row[0];
		return $return;
	}
}
?>
