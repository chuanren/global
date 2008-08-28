/*
How to Use? the example is following, notice modify the url:
-------------------------------------------------
<html>
	<head>
		<style>@import url("all.css");</style>
		<script src="base.js"></script>
		<script>Ext.BLANK_IMAGE_URL="image/default/s.gif";</script>
		<script src="all.js"></script>
		<script src="enhance.js"></script>
		<script src="window.js"></script>
		<script>
			Ext.smartWindow.navi=[{
				text:'Tree1',
				leaf:true,
				href: "Tree1.htm"
			},{
				text:'Tree2',
				children:[{
					text:'Tree21',
					leaf:true
				}],
				detail: "You will request a url, the response will be showed. enjoy."
			}];
		</script>
	</head>
	<body>
	<!--
-------------------------------------------------
|					top							|
-------------------------------------------------
|			|									|
|			|									|
|	navi	|									|
|			|				main				|
|			|									|
|			|									|
-------------									|
|	detail	|									|
-------------------------------------------------
|					info						|
-------------------------------------------------
	-->
		<h1 id="top">I@example</h1>
		<div id="detail">Additional navi details.</div>
		<div id="main"><a href=http://www.iexample.com.cn>I@example</a></div>
		<div id="info">Important runtime infomations.</div>
	</body>
</html>
*/
Ext.smartButtonConfig=function(cfg){return Ext.merge(cfg||{},{
	style: "cssFloat: left; styleFloat: left; margin: 5px;",
	handler: function(b){
		if(b.url){
			Ext.Ajax.request({
				url: b.url,
				success: function(r){
					Ext.Msg.status(b.text+": "+r.responseText,1000);
				},
				failure: function(r){
					Ext.Msg.alert("Alert",b.text+": "+r.responseText);
				}
			});
		}
	}
});};
Ext.smartButton=Ext.extend(Ext.Button,{
	constructor: function(cfg){
		Ext.smartButton.superclass.constructor.call(this,Ext.smartButtonConfig(cfg));
	}
});
Ext.smartFormPanelConfig=function(cfg){return Ext.merge(cfg||{},{
	xtype: "form",
	frame: true,
	buttonAlign: "left",
	defaults: {
		xtype: "textfield",
		width: 300,
		maxLength: 100,
		msgTarget: "under",
		msgFx: "highlight",
		validationEvent: "blur"
	},
	buttons: [{text: 'Submit',handler: function(){this.submit();}}],
	listeners: {
		actioncomplete: function(form,action){
			Ext.Msg.status("Form action complete: "+action.type+"("+(action.result&&action.result.success?"Success":"*")+")",1000);
			if(action.type!="load"&&form.autoLoadData)form.panel.load();
		},
		actionfailed: function(form,action){
			Ext.Msg.status("Form action failed: "+action.type+"("+action.failureType+")",3000);
		}
	},
	reader: new Ext.data.JsonReader()
});};
Ext.smartFormPanel=Ext.extend(Ext.FormPanel,{
	constructor: function(cfg){
		cfg=Ext.merge(Ext.smartFormPanelConfig(cfg),{panel:this});
		Ext.smartFormPanel.superclass.constructor.call(this,cfg);
		if(cfg.autoLoadData)this.load();
	},
	load: function(cfg){
		cfg=Ext.merge(cfg||{},{params: {action: "load"},waitMsg: "Loading Form's Data..."});
		if(!this.url&&!cfg.url)return;
		Ext.smartFormPanel.superclass.load.call(this,cfg);
	},
	submit: function(cfg){
		cfg=Ext.merge(cfg||{},{params: {action: "submit"},waitMsg: "Submiting Form's Data..."});
		if(!this.url&&!cfg.url)return;
		Ext.smartFormPanel.superclass.submit.call(this,cfg);
	}
});
Ext.smartTreePanelConfig=function(cfg){return Ext.merge(cfg||{},{
	autoScroll: true,
	listeners: {
		click: function(n){
			//href
			if(!n.attributes.href)return;
			Ext.EventObject.stopEvent();
			//hrefTarget
			n.attributes.hrefTarget||(n.attributes.hrefTarget=this.initialConfig.hrefTarget||Ext.getBody());
			n.attributes.hrefTarget=n.attributes.hrefTarget.body||Ext.get(n.attributes.hrefTarget);
			//mask
			n.attributes.mask||(n.attributes.mask=n.attributes.hrefTarget.parent());
			n.attributes.mask=n.attributes.mask.body||Ext.get(n.attributes.mask);
			if(n.attributes.mask.isMasked())return false;
			if(this.body.isMasked())return false;
			//do the load
			this.body.mask();
			n.attributes.mask.mask("Loading...");
			n.attributes.hrefTarget.load({
				url: n.attributes.href,
				scripts: true,
				callback:function(e,success,response,op){
					n.attributes.mask.unmask();
					if(!success){
						Ext.Msg.status("Error occured when you click \""+n.attributes.text+"\": "+response.responseText,3000);
					}
					this.body.unmask.defer(500,this.body);
				},
				scope: this
			});
		},
		contextmenu: Ext.emptyFn
	},
	loader: new Ext.tree.TreeLoader()
});};
Ext.smartTreePanel=Ext.extend(Ext.tree.TreePanel,{
	constructor: function(cfg){
		cfg=Ext.smartTreePanelConfig(cfg);
		cfg.root||(cfg.root=new Ext.tree.AsyncTreeNode(cfg.rootConfig));
		Ext.smartTreePanel.superclass.constructor.call(this,cfg);
	}
});
Ext.columnTreePanelConfig=function(cfg){return Ext.merge(cfg||{},{
	rootVisible:false,
	root: new Ext.tree.AsyncTreeNode()
});};
Ext.columnTreePanel=Ext.extend(Ext.tree.ColumnTree,{
	constructor: function(cfg){
		cfg=Ext.columnTreePanelConfig(cfg);
		cfg.loader||(cfg.loader=new Ext.tree.TreeLoader({
			url:cfg.url,
			baseAttrs: {uiProvider: Ext.tree.ColumnNodeUI},
			listeners: {
				beforeload: function(){this.panel.body.mask("Loading...");},
				load: function(){this.panel.body.unmask();}
			}
		}));
		cfg.loader.panel=this;
		Ext.columnTreePanel.superclass.constructor.call(this,cfg);
	}
});
//smart
Ext.Ajax.on({
	"beforerequest": {
		fn: function(){
			Ext.Msg.status("Loading...",500);
		}
	},
	"requestcomplete": {
		fn: function(conn,response,cfg){
			//alert(response.responseText);
			Ext.Msg.status("Complete.",500);
		}
	}
});
/***************************************************************************************/
Ext.smartWindow={
	navi: [{text:'Tree1',leaf:true,href: "Tree1.htm"},{text:'Tree2',children:[{text:'Tree21',leaf:true}],detail: "You will request a url, the response will be showed. enjoy."}],
	top: "top",
	detail: "detail",
	main: "main",
	info: "info",
	infoCloseDeferId: null
};
Ext.Msg.status=function(msg,time){
	if(Ext.smartWindow.info.collapsed){
		Ext.smartWindow.info.body.update(msg);
		Ext.smartWindow.info.expand();
		if(time){
			clearTimeout(Ext.smartWindow.infoCloseDeferId);
			Ext.smartWindow.infoCloseDeferId=Ext.smartWindow.info.collapse.defer(time,Ext.smartWindow.info);
		}
	}else{
		Ext.smartWindow.info.body.createChild({html:msg});
		Ext.smartWindow.info.body.scroll("bottom",1000);
	}
	Ext.smartWindow.info.body.stopFx();
	Ext.smartWindow.info.body.highlight();
};
Ext.smartWindow.top=new Ext.Panel({
	region: 'north',
	bodyStyle: "padding: 0 0 0 10px; background: transparent repeat-x 0 -5px;",
	contentEl: Ext.smartWindow.top,
	margins: '0 0 5 0'
});
Ext.smartWindow.detail=new Ext.Panel({
	region: 'south',
	height: 100,
	split: true,
	collapsible: true,
	animCollapse: false,
	autoScroll: true,
	title: 'Detail',
	bodyStyle: 'padding: 10px; background: #eee; font-size: 12px;',
	contentEl: Ext.smartWindow.detail
});
Ext.smartWindow.main=new Ext.Panel({
	region: 'center',
	autoScroll: true,
	bodyStyle: "padding: 10px;",
	contentEl: Ext.smartWindow.main
});
Ext.smartWindow.info=new Ext.Panel({
	region: 'south',
	height: 100,
	minHeight: 100,
	split: true,
	collapsible: true,
	collapsed: true,
	autoScroll: true,
	title: 'Information',
	bodyStyle: 'padding: 10px; background: #eee; font-size: 12px; color: red;',
	contentEl: Ext.smartWindow.info
});
Ext.EventManager.on(window,"load",function(){
/********************************************/
Ext.QuickTips.init();
Ext.smartWindow.navi=new Ext.smartTreePanel({
	region: "center",
	hrefTarget: Ext.smartWindow.main,
	title: "Navigation",
	rootVisible: false,
	rootConfig: {children: Ext.smartWindow.navi}
});
Ext.smartWindow.navi.on("click",function(n){
	if(n.attributes.detail){
		Ext.smartWindow.detail.body.update(n.attributes.detail);
		Ext.smartWindow.detail.expand();
	}else{
		Ext.smartWindow.detail.collapse();
	}
});
new Ext.Viewport({
	layout: "border",
    items: [
		Ext.smartWindow.top,
		new Ext.Panel({layout: 'border',region:'west',border: false,width: 200,minWidth: 100,split:true,items: [Ext.smartWindow.navi, Ext.smartWindow.detail]}),
		Ext.smartWindow.main,
		Ext.smartWindow.info
	]
});
//fix:
Ext.smartWindow.top.body.setStyle({
	backgroundImage: "url("+Ext.IMAGE_URL("panel/top-bottom.gif")+")",
	lineHeight: Ext.smartWindow.top.body.getHeight()+"px"
});
/********************************************/
});