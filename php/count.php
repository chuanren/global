<?php
//version: Liu ChuanRen, 11/12/07
@error_reporting(0);
ob_start();
session_start();
require_once("database/sql.php");
$sql=new sql('localhost','root','1234','res');
$sql->report=0;
$ip=$_SERVER['HTTP_X_FORWARDED_FOR']?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR'];
$sql->query("insert into `count`(count_time,count_ip,count_session,count_referer,count_query)values('".time()."','".$ip."','".session_id()."','".$_SERVER['HTTP_REFERER']."','".$_SERVER['QUERY_STRING']."')");
echo "$sql->num_rows;";
?>