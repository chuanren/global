<?php
//version: Liu ChuanRen, 06/29/08
/*
not tested. if use this, "global $_SESSION;" is required in sub structure.
*/
if(!function_exists("session_start")){
	function session_save($ob){
		global $_SESSION;
		$dirname="/tmp";
		$basename="PHPSESSID_".session_id();
		$file=$dirname."/".$basename;
		//save session.
		$file=fopen($dirname."/".$basename,"w");
		fwrite($file,serialize($_SESSION));
		//end. return the original ob.
		return $ob;
	}
	function session_queryString(){
		global $_SESSION;
		return "PHPSESSID=".session_id();
	}
	function session_start(){
		global $_SESSION;
		$dirname="/tmp";
		$basename="PHPSESSID_".session_id();
		$file=$dirname."/".$basename;
		if(file_exists($file)){
			$_SESSION=unserialize(file_get_contents($file));
		}
		ob_start("session_save");
	}
}
if(!function_exists("session_id")){
	function session_id(){
		global $_SESSION;
		$_SESSION['PHPSESSID']
			||($_SESSION['PHPSESSID']=$_REQUEST['PHPSESSID'])
			||($_SESSION['PHPSESSID']=md5(time()."_PHPSESSID_".rand()));
		return $_SESSION['PHPSESSID'];
	}
}
?>
