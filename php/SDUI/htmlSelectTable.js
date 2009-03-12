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
Element.update($('sduiHtmlSelectTable').getElementsBySelector("tfoot td")[0],function(){
		var html="";
		var page=sduiHtmlSelectTableOptions.start/sduiHtmlSelectTableOptions.limit+1;
		var pages=Math.ceil(sduiHtmlSelectTableOptions.count/sduiHtmlSelectTableOptions.limit);
		html+=" Page: "+page+"("+pages+") ";
		var i,ii,t;
		for(i=Math.max(1,page-5),ii=page;i<ii;i++){
			html+="<a href=?"+sduiHtmlSelectTableOptions.actionName+"=Select&start="
			+sduiHtmlSelectTableOptions.limit*(i-1)
			+">"+i+"</a> ";
		}
		html+=page;
		for(i=page+i,ii=Math.min(pages,page+5);i<=ii;i++){
			html+=" <a href=?"+sduiHtmlSelectTableOptions.actionName+"=Select&start="
			+sduiHtmlSelectTableOptions.limit*(i-1)
			+">"+i+"</a>";
		}
		return html;
}());