//version: js@liuchuanren.comc.cn, 08/06/08
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
			var naviTreeRootConfig={
				children: [{
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
				}]
			};
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
		<div id="detail">Additional details will display here.</div>
		<div id="main"><a href=http://www.iexample.com.cn>I@example</a></div>
		<div id="info">Some important infomations will display here.</div>
	</body>
</html>
*/
Ext.Msg.status=function(msg,time){
	if(info.collapsed){
		info.body.update(msg);
		info.expand();
		if(time){
			clearTimeout(infoCloseDeferId);
			infoCloseDeferId=info.collapse.defer(time,info);
		}
	}else{
		info.body.createChild({html:msg});
		info.body.scroll("bottom",1000);
	}
	info.body.stopFx();
	info.body.highlight();
};
var infoCloseDeferId;
var top=new Ext.Panel({
	region: 'north',
	bodyStyle: "padding: 0 0 0 10px; background: transparent repeat-x 0 -5px;",
	contentEl: "top",
	margins: '0 0 5 0'
});
var detail=new Ext.Panel({
	region: 'south',
	height: 100,
	split: true,
	collapsible: true,
	animCollapse: false,
	autoScroll: true,
	title: 'Detail',
	bodyStyle: 'padding: 10px; background: #eee; font-size: 12px;',
	contentEl: "detail"
});
var main=new Ext.Panel({
	region: 'center',
	autoScroll: true,
	bodyStyle: "padding: 10px;",
	contentEl: "main"
});
var info=new Ext.Panel({
	region: 'south',
	height: 100,
	minHeight: 100,
	split: true,
	collapsible: true,
	collapsed: true,
	autoScroll: true,
	title: 'Information',
	bodyStyle: 'padding: 10px; background: #eee; font-size: 12px; color: red;',
	contentEl: "info"
});
var navi,west;
Ext.EventManager.on(window,"load",function(){
/********************************************/
Ext.QuickTips.init();
navi=new Ext.smartTreePanel({
	region: "center",
	target: main,
	title: "Navigation",
	rootVisible: false,
	rootConfig: naviTreeRootConfig
});
navi.addListener("click",function(n){
	if(n.attributes.detail){
		detail.body.update(n.attributes.detail);
		detail.expand();
	}else{
		detail.collapse();
	}
});
west=new Ext.Panel({
	layout: 'border',
	region:'west',
	border: false,
	width: 200,
	minWidth: 100,
	split:true,
	items: [navi, detail]
});
view=new Ext.Viewport({
	layout: "border",
    items: [top, west, main, info]
});
//fix some details:
top.body.dom.style.backgroundImage="url("+Ext.BLANK_IMAGE_URL.replace("s.gif","panel/top-bottom.gif")+")";
top.body.dom.style.lineHeight=top.body.dom.offsetHeight+"px";
/********************************************/
});