/**
* require contextmenu.js
*/
if(!sduiHtmlSelectTableOptions.contextMenu)sduiHtmlSelectTableOptions.contextMenu=[
	['Update','?'+sduiHtmlSelectTableOptions.actionName+'=Update&id='],
	['Delete','?'+sduiHtmlSelectTableOptions.actionName+'=Delete&id='],
	['Insert','?'+sduiHtmlSelectTableOptions.actionName+'=Insert&']
];
if(sduiHtmlSelectTableOptions.contextMenu.length)Element.childElements($('sduiHtmlSelectTable').getElementsByTagName('tbody')[0]).each(function(tr){
	var id=tr.readAttribute('sduiID');
	var menuArray=[];
	sduiHtmlSelectTableOptions.contextMenu.each(function(menu,key){
		menuArray.push([menu[0],menu[1]+id]);
	});
	new contextMenu(tr,menuArray);
});