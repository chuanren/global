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
	target: Ext.smartWindow.main,
	title: "Navigation",
	rootVisible: false,
	rootConfig: {children: Ext.smartWindow.navi}
});
Ext.smartWindow.navi.addListener("click",function(n){
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
	backgroundImage: "url("+Ext.BLANK_IMAGE_URL.replace("s.gif","panel/top-bottom.gif")+")",
	lineHeight: Ext.smartWindow.top.body.getHeight()+"px"
});
/********************************************/
});