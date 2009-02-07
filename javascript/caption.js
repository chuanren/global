//返回数组，0为数组上限，1至上限是渐行字幕，参数为字幕字符串
function caption_str(msg_){
		var length_=msg_.length;
		var ubound_=length_*(length_+1)/2;
		var str_=new Array(ubound_+1);
		for(var i=1;i<=length_;i++){
			for(var j=1;j<=length_+1-i;j++){
				var str_1="";
				for(var k=1;k<=length_;k++){
					if(k<i){
						str_1+=msg_.charAt(k-1);
					}
				  else{
				  	if(k==length_+1-j){
						str_1+=msg_.charAt(i-1);
					  }
				    else{
				  	str_1+=" ";
				    }
				 }
				}
				str_[(i-1)*length_+j-(i-1)*(i-2)/2]=str_1;
			}
		}
		str_[0]=ubound_;
		return str_;
}
//循环函数
function caption_(i){
	window.status=msg_caption[i];
	if(i<msg_caption[0])i++;
  else i=1;
	var cmd="caption_("+ i +")";
	window.setTimeout(cmd,delay_);
}
//调用此函数即可
function caption(msg_1,delay_1){
	msg_caption=caption_str(msg_1);
	delay_=delay_1;
	caption_(1);
}
//例如：
//caption("中国科学技术大学",60);