Ext.BLANK_IMAGE_URL="http://global.googlecode.com/svn/trunk/extjs/image/default/s.gif";
Ext.IMAGE_URL=function(sGif){
	return Ext.BLANK_IMAGE_URL.replace("s.gif",sGif);
};
Ext.override(Ext.tree.TreeNode,{
/*	eachDescendant: function(f,scope){
		var i;
		for(i=0;i<this.childNodes.length;i++){
			if(f.call(scope,this.childNodes[i])){
				this.childNodes[i].eachDescendant(f,scope);
			}else{
				break;
			}
		}
	},
*/	findDescendantBy: function(f,scope){
		var node=null;
		this.eachChild(function(n){
			if(f.call(this,n)){
				node=n;
				return false;
			}else if(n.childNodes){
				if(n=n.findDescendantBy(f,scope)){
					node=n;
					return false;
				}else{
					return true;
				}
			}
		},scope);
		return node;
	},
	findDescendant: function(attribute,value){
		return this.findDescendantBy(function(node){
				return node.attributes[attribute]==value;
		});
	}
});
