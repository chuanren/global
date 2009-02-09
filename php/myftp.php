<?php
//version: Liu ChuanRen, 11/10/07
class myftp{
	var $query_string="";
	var $request;
	var $root;
	var $current;
	var $ereg=array(
			'mkdir'=>"^[0-9a-zA-Z]{1,10}\$",
			'upload'=>"^[0-9a-zA-Z]{1,10}\.[0-9a-zA-Z]{1,3}\$"
		);
	function myftp($root){
		$this->root=realpath($root);
	}
	function url($type=""){
		$result="&$this->query_string&myftp_current=".$this->request['myftp_current']."&";
		if($type==='File')$result.="&global_notop=yes&";
		return $result;
	}
	function message($msg){
		echo "\r\n<p align=center>$msg<p>\r\n";
	}
	function showDir($dirname){
		$result="";
		$dir=dir($dirname);
		$result.="<table id='myftp' width=100%><caption>".$this->request['myftp_current']."</caption><thead>
		<tr><td colspan='4'>
			<form action=\"?myftp_action=mkdir".$this->url()."\" method=post>
				<input type=text name=input_new />
				<input type=submit name=submit value='Create New Dir' />
			</form>
		</td></tr>
		<tr><td colspan='4'>
			<form action=\"?myftp_action=upload".$this->url()."\" method=post enctype='multipart/form-data'>
				<input type=file name=input_new />
				<input type=submit name=submit value='Upload New File' />
			</form>
		</td></tr>
		<tr align=center><td>type</td><td>size(B)</td><td>time</td><td>name</td></tr>
		</thead><tbody>\r\n";
		$count=0;
		while($name=$dir->read()){
			$count++;
			$f=$dirname."/".$name;
			$type=is_dir($f)?"Dir":"File";
			$size=filesize($f);
			$time=date("Y-m-d H:i:s",filemtime($f));
			$result.="<tr ondblclick=\"unlink(this)\"><td>$type</td><td>$size</td><td>$time</td><td><a href=\"?myftp_next=$name".$this->url($type)."\">$name</a></td></tr>\r\n";
		}
		$dir->close();
		$result.="</tbody>";
		if($count===2){
			$result.="<tfoot>
			<tr><td colspan='4'><a href=\"?myftp_action=rmdir".$this->url()."\" onclick=\"return confirm('Really?');\">Remove This Dir</a></td></tr>
			</tfoot>";
		}else{
			$result.="<tfoot>
			<tr><td colspan='4'>dblclick a file row to unlink it!</td></tr>
			</tfoot>";
		}
		$result.="</table><script>
		function unlink(tr){
			var tds=tr.getElementsByTagName('td');
			var a=tr.getElementsByTagName('a')[0];
			if(tds[0].innerHTML=='File'){
				if(confirm('Really Unlink The File?')){
					location=a.getAttribute('href')+'&myftp_action=unlink';
				}
			}
		}
		</script>";
		return $result;
	}
	function showFile($filename){
		$temp=$filename;
		$temp=str_replace("\\","/",$temp);
		$temp=explode('/',$temp);
		$temp=$temp[count($temp)-1];
		header("Content-type: application/octet-stream");
		header("Content-Disposition: attatchment;filename=\"$temp\"");
		die(file_get_contents($filename));
	}
	function show($current){
		if(file_exists($current)){
			if(is_dir($current))$result=$this->showDir($current);
			else $result=$this->showFile($current);
		}
		return $result;
	}
	function check(){
		$check=true;
		$check=$check&&strpos($this->current,$this->root)===0;
		return $check;
	}
	function handleRequest($request){
		$this->request=$request;
		$this->request['myftp_current'].="/".$this->request['myftp_next'];
		$this->current=realpath($this->root."/".$this->request['myftp_current']);
		$this->request['myftp_current']=substr($this->current,strlen($this->root)+1);
		if($this->check()){
			switch($this->request['myftp_action']){
				case 'mkdir':
					if(ereg($this->ereg['mkdir'],$this->request['input_new'])){
						$temp=$this->current."/".$this->request['input_new'];
						if(file_exists($temp)){
							$this->message("The Dir Exists");
						}else{
							if(mkdir($temp)){
								$this->message("Mkdir Successfully");
							}else{
								$this->message("Mkdir Failed");
							}
						}
					}else{
						$this->message("The Input Is Illegal");
					}
					break;
				case 'upload':
					if(ereg($this->ereg['upload'],$_FILES['input_new']['name'])){
						$temp=$this->current."/".$_FILES['input_new']['name'];
						if(file_exists($temp)){
							$this->message("The File Exists");
						}else{
							if(copy($_FILES['input_new']['tmp_name'],$temp)){
								$this->message("Upload Successfully");
							}else{
								$this->message("Upload Failed");
							}
						}
					}else{
						$this->message("The Input Is Illegal");
					}
					break;
				case 'rmdir':
					if(rmdir($this->current)){
						$this->message("<a href=\"?$this->query_string\">Rmdir Successfully, Go To Root</a>");
					}else{
						$this->message("Rmdir Failed");
					}
					break;
				case 'unlink':
					if(unlink($this->current)){
						$this->message("<a href=\"?$this->query_string\">Unlink Successfully, Go To Root</a>");
					}else{
						$this->message("Unlink Failed");
					}
					break;
			}
			echo $this->show($this->current);
		}else{
			$this->message("<a href=\"?$this->query_string\">Bad Request, Go To Root</a>");
		}
	}
}
?>