<?php
exit;
/**
* <#each(items=data,do=template)#>
*/
/*MYSCRIPT*/
$result="";
foreach($_MYSCRIPT['items'] as $k=>$v){
	$do=$_MYSCRIPT['do'];
	foreach($v as $key=>$value){
		$do=str_replace("\{{$key}\}",$value,$do);
	}
	$result.=$do;
}
return $result;
/*MYSCRIPT*/
?>