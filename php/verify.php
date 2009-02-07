<?php
require_once("session.php");
class verify extends session{
	var $code="";
	var $_codeSet=array(0,1,2,3,4,5,6,7,8,9);
	var $_length=4;
	function verify($name=null){
		$name||($name="globalphpverify");
		parent::__construct($name);
		$this->code=$this->_value["code"];
		$this->generateCode();
	}
	function generateCode(){
		if(!$this->code){
			$max=count($this->_codeSet)-1;
			for($i=0;$i<$this->_length;$i++){
				$j=rand(0,$max);
				$c=$this->_codeSet[$j];
				$this->code.=$c;
			}
			$this->_value["code"]=$this->code;
		}
	}
	function checkCode($code){
		if($code&&$code===$this->code){
			$return=true;
		}else $return=false;
		$this->_value["code"]=$this->code=false;
		$this->generateCode();
		return $return;
	}
	function getCode(){
		return $this->code;
	}
	function getImage(){
		$noise=10;
		$width=12;
		$height=20;
		$font=5;
		//
		$Noise=$noise*$this->_length;
		$Width=$width*$this->_length;
		//
		$image=imageCreate($Width,$height);
		$black=imagecolorallocate($image,0,0,0);
		$color=imagecolorallocate($image,200,200,200);
		for($i=0;$i<$this->_length;$i++){
			$x=$width*$i+rand(0,4);
			$y=rand(0,4);
			$c=$this->code[$i];
			imagestring($image,$font,$x,$y,$c,$color);
		}
		for($i=0;$i<$Noise;$i++){  
			$randcolor=imagecolorallocate($image,rand(0,255),rand(0,255),rand(0,255));
			imagesetpixel($image,rand(0,$Width),rand(0,$height),$randcolor);
		}
		header("Content-type: image/PNG");
		imagepng($image);
	}
}
if(($global['php']['verify']=get_required_files())&&$global['php']['verify'][0]==__file__
	&&preg_match("/^(.*)\[getImage\]/",$_SERVER['QUERY_STRING'],$global['php']['verify'])){
	$global['php']['verify']=new verify($global['php']['verify'][1]);
	$global['php']['verify']->getImage();
}
?>
