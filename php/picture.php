<?php
/**
* this script can also be executed from CLI(Command Line Interface).
*/
if(!function_exists('image_type_to_extension')){
	function image_type_to_extension($image_type, $include_dot=true){
		$extension = "";
		if((is_int($image_type)) AND (is_bool($include_dot)) AND (IMAGETYPE_GIF <= $image_type) AND (IMAGETYPE_XBM >=$image_type)){
			$image_type_extension = array (
                   IMAGETYPE_GIF        => 'gif',        ###  1 = GIF
                   IMAGETYPE_JPEG        => 'jpg',        ###  2 = JPG
                   IMAGETYPE_PNG        => 'png',        ###  3 = PNG
                   IMAGETYPE_SWF        => 'swf',        ###  4 = SWF
                   IMAGETYPE_PSD        => 'psd',        ###  5 = PSD
                   IMAGETYPE_BMP        => 'bmp',        ###  6 = BMP    
                   IMAGETYPE_TIFF_II    => 'tiff',        ###  7 = TIFF    (intel byte order)
                   IMAGETYPE_TIFF_MM    => 'tiff',        ###  8 = TIFF    (motorola byte order)
                   IMAGETYPE_JPC        => 'jpc',        ###  9 = JPC
                   IMAGETYPE_JP2        => 'jp2',        ### 10 = JP2
                   IMAGETYPE_JPX        => 'jpf',        ### 11 = JPX    Yes! jpf extension is correct for JPX image type
                   IMAGETYPE_JB2        => 'jb2',        ### 12 = JB2
                   IMAGETYPE_SWC        => 'swc',        ### 13 = SWC
                   IMAGETYPE_IFF        => 'aiff',        ### 14 = IFF
                   IMAGETYPE_WBMP        => 'wbmp',        ### 15 = WBMP
                   IMAGETYPE_XBM        => 'xbm'        ### 16 = XBM
			);
			$extension = $image_type_extension[$image_type];
			if($include_dot) $extension = '.' . $extension; // If $include_dot is true prefix a dot to extension
		}
		return $extension;
	}
}
class picture{
	var $data;
	var $file;
	var $size;
	var $width;
	var $height;
	var $type;
	var $extension;
	var $creater;
	var $default='jpeg';
	var $handle;
	function picture($file_data,$extension=false){//also get width height
		if(file_exists($file_data)){
			$this->file=$file_data;
			$this->size=@getimagesize($this->file);
			$this->width=$this->size[0];
			$this->height=$this->size[1];
			$this->type=$this->size[2];
			$this->extension=@image_type_to_extension($this->type,false);
			if($extension)$this->creater="imagecreatefrom".$extension;
			else $this->creater="imagecreatefrom".$this->extension;
			if(!function_exists($this->creater))$this->creater="imagecreatefrom".$this->default;
			$creater=$this->creater;
			$this->handle=$creater($this->file);
		}elseif(is_string($file_date)){
			$this->data=$file_data;
			$this->creater="imagecreatefromstring";
			$creater=$this->creater;
			$this->handle=$creater($this->data);
			$this->width=imagesx($this->handle);
			$this->height=imagesy($this->handle);
		}else{
			$this->width=$file_data;
			$this->height=$extension;
			$this->handle=imagecreate($this->width,$this->height);
		}
	}
	function resize($width_scale,$height=false,$keepScale=true,$MinMax=0){
		if($height){
			$width=$width_scale;
			if($keepScale){
				$this->setSize($width,$height,$MinMax);
			}else{
				$this->setSize($width,$height);
			}
		}else{
			$this->scale($width_scale);
		}
		return true;
	}
	function save($file=false,$type=false){
		if(!$file)$file=$this->file;
		if(!$type){
			$type=explode(".",$file);
			$type=$type[count($type)-1];
		}
		$saver="image".$type;
		if(!function_exists($saver))$saver="image".$this->default;
		$saver($this->handle,$file);
		return true;
	}
	function pasteTo(&$picture,$x,$y){
		imagecopy($picture->handle,$this->handle,$x,$y,0,0,$this->width,$this->height);
	}
	function setColor($r,$g,$b,$alpha=0){
		imagecolorallocatealpha($this->handle,$r,$g,$b,$alpha);
	}
	function scale($scale){
		$width=$scale*$this->width;
		$height=$scale*$this->height;
		return $this->setSize($width,$height);
	}
	function setWidth($width,$keepScale=true){
		if($keepScale){
			return $this->scale($width/$this->width);
		}else{
			return $this->setSize($width,$this->height);
		}
	}
	function setHeight($height,$keepScale=true){
		if($keepScale){
			return $this->scale($height/$this->height);
		}else{
			return $this->setSize($this->width,$height);
		}
	}
	function setSize($width,$height,$keepScale=false){
		if($keepScale===false){
			$blank=imagecreatetruecolor($width,$height);
			imagecopyresized($blank,$this->handle,0,0,0,0,$width,$height,$this->width,$this->height);
			$this->handle=$blank;
			$this->width=imagesx($this->handle);
			$this->height=imagesy($this->handle);
			return $this;
		}else{
			$min=array("min","max");
			($min=$min[$keepScale])||($min="min");
			$scale=$min($width/$this->width,$height/$this->height);
			return $this->scale($scale);
		}
	}
	function trueColor(){
		if (!imageistruecolor($this->handle)){
           $width=imagesx($this->handle);
           $height=imagesy($this->handle);
           $blank=imagecreatetruecolor($width,$height);
           imagecopy($blank,$this->handle,0,0,0,0,$width,$height);
		   $this->handle=$blank;
       }
	}
}
$global['php']['picture']['opt']=getopt("w:h:s:");
if($global['php']['picture']['opt']['w']||$global['php']['picture']['opt']['h']||$global['php']['picture']['opt']['s']){
	$global['php']['picture']['o']=new picture($argv[1]);
	if($global['php']['picture']['opt']['w']&&$global['php']['picture']['opt']['h']){
		$global['php']['picture']['o']->setSize($global['php']['picture']['opt']['w'],$global['php']['picture']['opt']['h'],0);
	}elseif($global['php']['picture']['opt']['w']){
		$global['php']['picture']['o']->setWidth($global['php']['picture']['opt']['w']);
	}elseif($global['php']['picture']['opt']['h']){
		$global['php']['picture']['o']->setHeight($global['php']['picture']['opt']['h']);
	}
	if($global['php']['picture']['opt']['s']){
		$global['php']['picture']['o']->scale($global['php']['picture']['opt']['s']);
	}
	$global['php']['picture']['o']->save($argv[2]);
}
?>
