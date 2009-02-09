<?php
//version Liu ChuanRen, 12/26/08
class myscript{
	var $script;					//backup the script
	var $debug=false;			//output debug infomation
	var $max_handle_times=100;	//for bad scripts
	var $begin;					//code begin position
	var $end;						//code end position
	var $current;					//times code function params result
	var $result;					//the temp result
	var $functions;				//a array, registered handler
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
