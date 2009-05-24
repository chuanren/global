<?php
class myscript{
	var $script;
	var $debug=false;
	var $max_handle_times=100;
	var $begin;		
	var $end;		
	var $current;		
	var $result;		
	var $functions;		
	function myscript($script=""){
		$this->script=$script;
		$this->result=$this->script;
	}
	function getCode(){
		$this->result=str_replace("&lt;#","<#",$this->result);
		$this->result=str_replace("#&gt;","#>",$this->result);
		if(!$this->end=strpos($this->result,"#>"))return false;
		$this->current['code']=substr($this->result,0,$this->end);
		if(($this->begin=strrpos($this->current['code'],"<#"))===false)return false;
		$this->begin+=2;
		$this->current['code']=substr($this->result,$this->begin,$this->end-$this->begin);
		$a=strpos($this->current['code'],'(');
		$b=strrpos($this->current['code'],')');
		$this->current['params']=array();
		if($a&&$b){
			$this->current['function']=substr($this->current['code'],0,$a);
			$ps=explode(",",substr($this->current['code'],$a+1,$b-$a-1));
			$count=0;
			while(list($k,$v)=each($ps)){
				$count++;
				$firstequal=strpos($v,"=");
				$this->current['params'][substr($v,0,$firstequal)]=$this->current['params'][$count]=substr($v,$firstequal+1);
			}
		}else{
			$this->current['function']=$this->current['code'];
		}
		return true;
	}
	function handleOneCode(){
		//use $_MYSCRIPT
		$_MYSCRIPT=$this->current['params'];
		if($this->functions[$this->current['function']]){
			$this->current['result']=eval($this->functions[$this->current['function']]);
		}else{
			$this->current['result']="<!--".$this->current['code']."-->";
		}
		$this->result=str_replace("<#".$this->current['code']."#>",$this->current['result'],$this->result);
		$this->message();
	}
	function handleCode($script_or_file=null){
		if(isset($script_or_file))$this->myscript($script_or_file);
		$this->current['times']=0;
		$this->message();
		while($this->current['times']<$this->max_handle_times&&$this->getCode()){
			$this->current['times']++;
			$this->handleOneCode();
		}
	}
	function setHandler($name,$code){
		$code=explode("/*MYSCRIPT*/",$code);
		$code=$code[1]?$code[1]:$code[0];		
		$this->functions[$name]=$code;
		$this->message("setHandler",$name);
	}
	function setHandlerByFile($filename){
		$basename=basename($filename);
		$p=strrpos($basename,".");
		$name=substr($basename,0,$p);
		$code=file_get_contents($filename);
		$this->setHandler($name,$code);
	}
	function setHandlerByDir($dirname){
		$dir=dir($dirname);
		while($basename=$dir->read()){
			if(ereg("^(.*)\.php$",$basename,$ereg)){
				$this->setHandler($ereg[1],file_get_contents($dirname."/".$basename));
			}
		}
		$dir->close();
	}
	function loadHandler(){
		$argv=func_get_args();
		$argc=count($argv);
		if($argc==0){//load global/php/MyScript
			$this->setHandlerByDir(dirname(__file__)."/MyScript");
		}elseif($argc==1){
			$path=$argv[0];
			if(is_file($path)){
				$this->setHandlerByFile($path);
			}elseif(is_dir($path)){
				$this->setHandlerByDir($path);
			}
		}elseif($argc==2){
			$name=$argv[0];
			$code=$argv[1];
			$this->setHandler($name,$code);
		}
	}
	function message($flag=false,$content=false){
		if($this->debug){
			if($flag&&$content){
				echo "\r\n<br>".$flag.":-->".$content."<br>\r\n";
			}else{
				echo "\r\n<br>debug:-->".$this->current['times']."-->".$this->current['function']."<br>\r\n";
			}
		}
	}
}
?>
