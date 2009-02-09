<?php
//version: php@liuchuanren.com.cn, 08/22/08
class url{
	function r2a($r,$b=null){
		is_string($b)&&($b=parse_url($b));
		$b||($b=array(
			"scheme"=>"http",
			"host"=>$_SERVER['SERVER_NAME'],
			"port"=>null,
			"user"=>null,
			"pass"=>null,
			"path"=>$_SERVER['REQUEST_URI'],
			"query"=>null,
			"fragment"=>null
		));
		$result=$b['scheme']."://";
		if($b['user']){
			$result.=$b['user'];
			if($b['pass'])$result.=":".$b['pass'];
			$result.="@";
		}
		$result.=$b['host'];
		$i=substr($r,0,1);
		if($i=="/"){
			$result.=$r;
		}elseif($i=="?"){
			$result.=$b['path'].$r;
		}else{
			$result.=substr($b['path'],0,strrpos($b['path'],"/"))."/".$r;
		}
		return $result;
	}
	function isA($r){
		return strpos($r,"://");
	}
	function toA($r,$b=null){
		if(self::isA($r))return $r;
		else return self::r2a($r,$b);
	}
	function c2a($c,$b=null){
		$c=preg_replace('/(href|src)=(\')(.*)(\')/i','$1."=\"".$3."\""',$c);
		$callback=create_function('$m','return $m[1]."=\"".url::toA("$m[2]",$b)."\"";');
		$c=preg_replace_callback('/(href|src)="(.*)"/i',$callback,$c);
		return $c;
	}
}
?>
