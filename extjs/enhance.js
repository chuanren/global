//version: js@liuchuanren.com.cn, 08/09/08
//function
Ext.cookie={
	get: function(name,value){
		var nameEQ=name+"=";
		var i,a=document.cookie.split(/;\s*/);
		for(i=0;i<a.length;i++){
			if(a[i].indexOf(nameEQ)==0)break;
		}
		if(i==a.length)a=value||"";
		else a=a[i];
		return unescape(a.substr(nameEQ.length));
	},
	set: function(name,value,expires,path){
		var string=name+"="+escape(value);
		if(expires)string+="; expires="+expires;
		path||(path="/");
		document.cookie=string+"; path="+path;
	}
};
Ext.IMAGE_URL=function(sGif){
	return Ext.BLANK_IMAGE_URL.replace("s.gif",sGif);
};
Ext.merge=function(a,b){//merge hash just subhash or undefined attribute.
	if(!a)return a=b;
	var i;
	for(i in b){
		switch(typeof a[i]){
			case "function":
				break;
			case "object":
				a[i]=Ext.merge(a[i],b[i]);
				break;
			case "undefined":
				a[i]=b[i];
				break;
		}
	}
	for(i=2;i<arguments.length;i++)a=Ext.merge(a,arguments[i]);
	return a;
};
Ext.MessageBox.status=function(msg,time){
	//this empty function do nothing is used following in this script.
	//rewrite to show msg in the period of time
}
//prototype
Ext.override(Ext.Component,{
	mask: function(msg){
		this.getEl().mask(msg);
	},
	reset: function(){
		this.findParentBy(function(o){return typeof o.reset=="function";}).reset();
	},
	submit: function(cfg){
		this.findParentBy(function(o){return typeof o.submit=="function";}).submit(cfg);
	},
	unmask: function(){
		this.getEl().unmask();
	}
});
Ext.override(Ext.FormPanel,{
	getValues: function(asString){return this.form.getValues(asString);},
	isValid: function(){return this.form.isValid();},
	reset: function(){this.form.reset();},
	submit: function(cfg){this.form.submit(cfg);}
});
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
		var node;
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
	}
});
//new method
Ext.apply(Ext.form.Field.msgFx,{//so I can use msgFx: "highlight" in initialConfig of Field.
	highlight: {
		show: function(A,B){A.highlight();},
		hide: function(A,B){A.stopFx();A.setDisplayed(false).update("");}
	},
	frame: {
		show: function(A,B){A.frame();},
		hide: function(A,B){A.stopFx();A.setDisplayed(false).update("");}
	}
});
//new object
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
Ext.tree.ColumnTree = Ext.extend(Ext.tree.TreePanel, {
    lines:false,
    borderWidth: Ext.isBorderBox ? 0 : 2,
    cls:'x-column-tree',    
    onRender : function(){
        Ext.tree.ColumnTree.superclass.onRender.apply(this, arguments);
        this.headers = this.body.createChild({cls:'x-tree-headers'},this.innerCt.dom);
        var cols = this.columns, c;
        var totalWidth = 0;
        for(var i = 0, len = cols.length; i < len; i++){
             c = cols[i];
             totalWidth += c.width;
             this.headers.createChild({
                 cls:'x-tree-hd ' + (c.cls?c.cls+'-hd':''),
                 cn: {
                     cls:'x-tree-hd-text',
                     html: c.header
                 },
                 style:'width:'+(c.width-this.borderWidth)+'px;'
             });
        }
        this.headers.createChild({cls:'x-clear'});
        this.headers.setWidth(totalWidth);
        this.innerCt.setWidth(totalWidth);
    }
});
Ext.tree.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn,
    renderElements : function(n, a, targetNode, bulkRender){
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
        var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];
        var buf = [
             '<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf ', a.cls,'">',
                '<div class="x-tree-col" style="width:',c.width-bw,'px;">',
                    '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
                    '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
                    '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on">',
                    '<a hidefocus="on" class="x-tree-node-anchor" href="',a.href ? a.href : "#",'" tabIndex="1" ',
                    a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '>',
                    '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</span></a>",
                "</div>"];
        for(var i = 1, len = cols.length; i < len; i++){
             c = cols[i];
             buf.push('<div class="x-tree-col ',(c.cls?c.cls:''),'" style="width:',c.width-bw,'px;">',
                        '<div class="x-tree-col-text">',(c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</div>",
                      "</div>");
        }
        buf.push('<div class="x-clear"></div></div>','<ul class="x-tree-node-ct" style="display:none;"></ul>',"</li>");
        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", n.nextSibling.ui.getEl(), buf.join(""));
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }
        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        this.anchor = cs[3];
        this.textNode = cs[3].firstChild;
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
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.menu.EditableItem = Ext.extend(Ext.menu.BaseItem, {
    itemCls : "x-menu-item",
    hideOnClick: false,
    
    initComponent: function(){
      Ext.menu.EditableItem.superclass.initComponent.call(this);
    	this.addEvents('keyup');
    	
			this.editor = this.editor || new Ext.form.TextField();
			if(this.text) {
				this.editor.setValue(this.text);
      }
    },
    
    onRender: function(container){
        var s = container.createChild({
        	cls: this.itemCls,
        	html: '<img src="' + this.icon + '" class="x-menu-item-icon" style="margin: 3px 3px 2px 2px;" />'
        });
        
        Ext.apply(this.config, {width: 125});
        this.editor.render(s);
        
        this.el = s;
        this.relayEvents(this.editor.el, ["keyup"]);
        
        if(Ext.isGecko) {
    			s.setStyle('overflow', 'auto');
        }
			
        Ext.menu.EditableItem.superclass.onRender.call(this, container);
    },
    
    getValue: function(){
    	return this.editor.getValue();
    },
    
    setValue: function(value){
    	this.editor.setValue(value);
    },
    
    isValid: function(preventMark){
    	return this.editor.isValid(preventMark);
    }
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.menu.RangeMenu = function(config){
	Ext.menu.RangeMenu.superclass.constructor.call(this, config);
  
	this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

	var cfg = this.fieldCfg;
	var cls = this.fieldCls;
	var fields = this.fields = Ext.applyIf(this.fields || {}, {
		'gt': new Ext.menu.EditableItem({
			icon:  this.icons.gt,
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
    }),
		'lt': new Ext.menu.EditableItem({
			icon:  this.icons.lt,
			editor: new cls(typeof cfg == "object" ? cfg.lt || '' : cfg)
    }),
		'eq': new Ext.menu.EditableItem({
			icon:   this.icons.eq, 
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
    })
	});
	this.add(fields.gt, fields.lt, '-', fields.eq);
	
	for(var key in fields) {
		fields[key].on('keyup', this.onKeyUp.createDelegate(this, [fields[key]], true), this);
  }
  
	this.addEvents('update');
};

Ext.extend(Ext.menu.RangeMenu, Ext.menu.Menu, {
	fieldCls:     Ext.form.NumberField,
	fieldCfg:     '',
	updateBuffer: 500,
	icons: {
		gt: Ext.IMAGE_URL('filter/greater_then.png'),
		lt: Ext.IMAGE_URL('filter/less_then.png'),
		eq: Ext.IMAGE_URL('filter/equals.png')
  },
		
	fireUpdate: function() {
		this.fireEvent("update", this);
	},
	
	setValue: function(data) {
		for(var key in this.fields) {
			this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
    }
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		var result = {};
		for(var key in this.fields) {
			var field = this.fields[key];
			if(field.isValid() && String(field.getValue()).length > 0) { 
				result[key] = field.getValue();
      }
		}
		
		return result;
	},
  
  onKeyUp: function(event, input, notSure, field) {
    if(event.getKey() == event.ENTER && field.isValid()) {
	    this.hide(true);
	    return;
	  }
	
	  if(field == this.fields.eq) {
	    this.fields.gt.setValue(null);
	    this.fields.lt.setValue(null);
	  } else {
	    this.fields.eq.setValue(null);
	  }
	  
	  this.updateTask.delay(this.updateBuffer);
  }
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.GridFilters = function(config){		
	this.filters = new Ext.util.MixedCollection();
	this.filters.getKey = function(o) {return o ? o.dataIndex : null};
	
	for(var i=0, len=config.filters.length; i<len; i++) {
		(typeof config.filters[i]=='string')&&(config.filters[i]={dataIndex: config.filters[i]});
		config.filters[i].type||(config.filters[i].type='string');
		this.addFilter(config.filters[i]);
  }
  
	this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
	
	delete config.filters;
	Ext.apply(this, config);
};
Ext.extend(Ext.grid.GridFilters, Ext.util.Observable, {
	/**
	 * @cfg {Integer} updateBuffer
	 * Number of milisecond to defer store updates since the last filter change.
	 */
	updateBuffer: 500,
	/**
	 * @cfg {String} paramPrefix
	 * The url parameter prefix for the filters.
	 */
	paramPrefix: 'filter',
	/**
	 * @cfg {String} fitlerCls
	 * The css class to be applied to column headers that active filters. Defaults to 'ux-filterd-column'
	 */
	filterCls: 'ux-filtered-column',
	/**
	 * @cfg {Boolean} local
	 * True to use Ext.data.Store filter functions instead of server side filtering.
	 */
	local: true,
	/**
	 * @cfg {Boolean} autoReload
	 * True to automagicly reload the datasource when a filter change happens.
	 */
	autoReload: true,
	/**
	 * @cfg {String} stateId
	 * Name of the Ext.data.Store value to be used to store state information.
	 */
	stateId: undefined,
	/**
	 * @cfg {Boolean} showMenu
	 * True to show the filter menus
	 */
	showMenu: true,
    /**
     * @cfg {String} filtersText
     * The text displayed for the "Filters" menu item
     */
    filtersText: 'Filters',

	init: function(grid){
    if(grid instanceof Ext.grid.GridPanel){
      this.grid  = grid;
      
      this.store = this.grid.getStore();
      if(this.local){
        this.store.on('load', function(store) {
          store.filterBy(this.getRecordFilter());
        }, this);
      } else {
        this.store.on('beforeload', this.onBeforeLoad, this);
      }
      
      this.grid.filters = this;
      
      this.grid.addEvents('filterupdate');
      
      grid.on("render", this.onRender, this);
      grid.on("beforestaterestore", this.applyState, this);
      grid.on("beforestatesave", this.saveState, this);
      
    } else if(grid instanceof Ext.PagingToolbar) {
      this.toolbar = grid;
    }
	},
		
	/** private **/
	applyState: function(grid, state) {
		this.suspendStateStore = true;
		this.clearFilters();
		if(state.filters) {
			for(var key in state.filters) {
				var filter = this.filters.get(key);
				if(filter) {
					filter.setValue(state.filters[key]);
					filter.setActive(true);
				}
			}
    }
    
		this.deferredUpdate.cancel();
		if(this.local) {
			this.reload();
    }
    
		this.suspendStateStore = false;
	},
	
	/** private **/
	saveState: function(grid, state){
		var filters = {};
		this.filters.each(function(filter) {
			if(filter.active) {
				filters[filter.dataIndex] = filter.getValue();
      }
		});
		return state.filters = filters;
	},
	
	/** private **/
	onRender: function(){
		var hmenu;
		
		if(this.showMenu) {
			hmenu = this.grid.getView().hmenu;
			
			this.sep  = hmenu.addSeparator();
			this.menu = hmenu.add(new Ext.menu.CheckItem({
					text: this.filtersText,
					menu: new Ext.menu.Menu()
				}));
			this.menu.on('checkchange', this.onCheckChange, this);
			this.menu.on('beforecheckchange', this.onBeforeCheck, this);
				
			hmenu.on('beforeshow', this.onMenu, this);
		}
		
		this.grid.getView().on("refresh", this.onRefresh, this);
		this.updateColumnHeadings(this.grid.getView());
	},
	
	/** private **/
	onMenu: function(filterMenu) {
		var filter = this.getMenuFilter();
		if(filter) {
			this.menu.menu = filter.menu;
			this.menu.setChecked(filter.active, false);
		}
		
		this.menu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},
	
	/** private **/
	onCheckChange: function(item, value) {
		this.getMenuFilter().setActive(value);
	},
	
	/** private **/
	onBeforeCheck: function(check, value) {
		return !value || this.getMenuFilter().isActivatable();
	},
	
	/** private **/
	onStateChange: function(event, filter) {
    if(event == "serialize") {
      return;
    }
    
		if(filter == this.getMenuFilter()) {
			this.menu.setChecked(filter.active, false);
    }
			
		if(this.autoReload || this.local) {
			this.deferredUpdate.delay(this.updateBuffer);
    }
		
		var view = this.grid.getView();
		this.updateColumnHeadings(view);
			
		this.grid.saveState();
			
		this.grid.fireEvent('filterupdate', this, filter);
	},
	
	/** private **/
	onBeforeLoad: function(store, options) {
    options.params = options.params || {};
		this.cleanParams(options.params);		
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},
	
	/** private **/
	onRefresh: function(view) {
		this.updateColumnHeadings(view);
	},
	
	/** private **/
	getMenuFilter: function() {
		var view = this.grid.getView();
		if(!view || view.hdCtxIndex === undefined) {
			return null;
    }
		
		return this.filters.get(view.cm.config[view.hdCtxIndex].dataIndex);
	},
	
	/** private **/
	updateColumnHeadings: function(view) {
		if(!view || !view.mainHd) {
      return;
    }
		
		var hds = view.mainHd.select('td').removeClass(this.filterCls);
		for(var i=0, len=view.cm.config.length; i<len; i++) {
			var filter = this.getFilter(view.cm.config[i].dataIndex);
			if(filter && filter.active) {
				hds.item(i).addClass(this.filterCls);
      }
		}
	},
	
	/** private **/
	reload: function() {
		if(this.local){
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if(this.toolbar) {
				var start = this.toolbar.paramNames.start;
				if(store.lastOptions && store.lastOptions.params && store.lastOptions.params[start]) {
					store.lastOptions.params[start] = 0;
        }
			}
			store.reload();
		}
	},
	
	/**
	 * Method factory that generates a record validator for the filters active at the time
	 * of invokation.
	 * 
	 * @private
	 */
	getRecordFilter: function() {
		var f = [];
		this.filters.each(function(filter) {
			if(filter.active) {
        f.push(filter);
      }
		});
		
		var len = f.length;
		return function(record) {
			for(var i=0; i<len; i++) {
				if(!f[i].validateRecord(record)) {
					return false;
        }
      }
			return true;
		};
	},
	
	/**
	 * Adds a filter to the collection.
	 * 
	 * @param {Object/Ext.grid.filter.Filter} config A filter configuration or a filter object.
	 * 
	 * @return {Ext.grid.filter.Filter} The existing or newly created filter object.
	 */
	addFilter: function(config) {
		var filter = config.menu ? config : new (this.getFilterClass(config.type))(config);
		this.filters.add(filter);
		
		Ext.util.Observable.capture(filter, this.onStateChange, this);
		return filter;
	},
	
	/**
	 * Returns a filter for the given dataIndex, if on exists.
	 * 
	 * @param {String} dataIndex The dataIndex of the desired filter object.
	 * 
	 * @return {Ext.grid.filter.Filter}
	 */
	getFilter: function(dataIndex){
		return this.filters.get(dataIndex);
	},

	/**
	 * Turns all filters off. This does not clear the configuration information.
	 */
	clearFilters: function() {
		this.filters.each(function(filter) {
			filter.setActive(false);
		});
	},

	/** private **/
	getFilterData: function() {
		var filters = [];
		
		this.filters.each(function(f) {
			if(f.active) {
				var d = [].concat(f.serialize());
				for(var i=0, len=d.length; i<len; i++) {
					filters.push({field: f.dataIndex, data: d[i]});
        }
			}
		});
		
		return filters;
	},
	
	/**
	 * Function to take structured filter data and 'flatten' it into query parameteres. The default function
	 * will produce a query string of the form:
	 * 		filters[0][field]=dataIndex&filters[0][data][param1]=param&filters[0][data][param2]=param...
	 * 
	 * @param {Array} filters A collection of objects representing active filters and their configuration.
	 * 	  Each element will take the form of {field: dataIndex, data: filterConf}. dataIndex is not assured
	 *    to be unique as any one filter may be a composite of more basic filters for the same dataIndex.
	 * 
	 * @return {Object} Query keys and values
	 */
	buildQuery: function(filters) {
		var p = {};
		for(var i=0, len=filters.length; i<len; i++) {
			var f = filters[i];
			var root = [this.paramPrefix, '[', i, ']'].join('');
			p[root + '[field]'] = f.field;
			
			var dataPrefix = root + '[data]';
			for(var key in f.data) {
				p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
      }
		}
		
		return p;
	},
	
	/**
	 * Removes filter related query parameters from the provided object.
	 * 
	 * @param {Object} p Query parameters that may contain filter related fields.
	 */
	cleanParams: function(p) {
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for(var key in p) {
			if(regex.test(key)) {
				delete p[key];
      }
    }
	},
	
	/**
	 * Function for locating filter classes, overwrite this with your favorite
	 * loader to provide dynamic filter loading.
	 * 
	 * @param {String} type The type of filter to load.
	 * 
	 * @return {Class}
	 */
	getFilterClass: function(type){
		return Ext.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.ns("Ext.grid.filter");
Ext.grid.filter.Filter = function(config){
	Ext.apply(this, config);
		
	this.events = {
		/**
		 * @event activate
		 * Fires when a inactive filter becomes active
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'activate': true,
		/**
		 * @event deactivate
		 * Fires when a active filter becomes inactive
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'deactivate': true,
		/**
		 * @event update
		 * Fires when a filter configuration has changed
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'update': true,
		/**
		 * @event serialize
		 * Fires after the serialization process. Use this to apply additional parameters to the serialized data.
		 * @param {Array/Object} data A map or collection of maps representing the current filter configuration.
		 * @param {Ext.ux.grid.filter.Filter} filter The filter being serialized.
		 **/
		'serialize': true
	};
	Ext.grid.filter.Filter.superclass.constructor.call(this);
	
	this.menu = new Ext.menu.Menu();
	this.init();
	
	if(config && config.value) {
		this.setValue(config.value);
		this.setActive(config.active !== false, true);
		delete config.value;
	}
};
Ext.extend(Ext.grid.filter.Filter, Ext.util.Observable, {
	/**
	 * @cfg {Boolean} active
	 * Indicates the default status of the filter (defaults to false).
	 */
    /**
     * True if this filter is active. Read-only.
     * @type Boolean
     * @property
     */
	active: false,
	/**
	 * @cfg {String} dataIndex 
	 * The {@link Ext.data.Store} data index of the field this filter represents. The dataIndex does not actually
	 * have to exist in the store.
	 */
	dataIndex: null,
	/**
	 * The filter configuration menu that will be installed into the filter submenu of a column menu.
	 * @type Ext.menu.Menu
	 * @property
	 */
	menu: null,
	
	/**
	 * Initialize the filter and install required menu items.
	 */
	init: Ext.emptyFn,
	
	fireUpdate: function() {
		this.value = this.item.getValue();
		
		if(this.active) {
			this.fireEvent("update", this);
    }
		this.setActive(this.value.length > 0);
	},
	
	/**
	 * Returns true if the filter has enough configuration information to be activated.
	 * @return {Boolean}
	 */
	isActivatable: function() {
		return true;
	},
	
	/**
	 * Sets the status of the filter and fires that appropriate events.
	 * @param {Boolean} active        The new filter state.
	 * @param {Boolean} suppressEvent True to prevent events from being fired.
	 */
	setActive: function(active, suppressEvent) {
		if(this.active != active) {
			this.active = active;
			if(suppressEvent !== true) {
				this.fireEvent(active ? 'activate' : 'deactivate', this);
      }
		}
	},
	
	/**
	 * Get the value of the filter
	 * @return {Object} The 'serialized' form of this filter
	 */
	getValue: Ext.emptyFn,
	
	/**
	 * Set the value of the filter.
	 * @param {Object} data The value of the filter
	 */	
	setValue: Ext.emptyFn,
	
	/**
	 * Serialize the filter data for transmission to the server.
	 * @return {Object/Array} An object or collection of objects containing key value pairs representing
	 * 	the current configuration of the filter.
	 */
	serialize: Ext.emptyFn,
	
	/**
	 * Validates the provided Ext.data.Record against the filters configuration.
	 * @param {Ext.data.Record} record The record to validate
	 * @return {Boolean} True if the record is valid with in the bounds of the filter, false otherwise.
	 */
	 validateRecord: function(){return true;}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.filter.StringFilter = Ext.extend(Ext.grid.filter.Filter, {
	updateBuffer: 500,
	icon: Ext.IMAGE_URL('filter/find.png'),
	
	init: function() {
		var value = this.value = new Ext.menu.EditableItem({icon: this.icon});
		value.on('keyup', this.onKeyUp, this);
		this.menu.add(value);
		
		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	
	onKeyUp: function(event) {
		if(event.getKey() == event.ENTER){
			this.menu.hide(true);
			return;
		}
		this.updateTask.delay(this.updateBuffer);
	},
	
	isActivatable: function() {
		return this.value.getValue().length > 0;
	},
	
	fireUpdate: function() {		
		if(this.active) {
			this.fireEvent("update", this);
    }
		this.setActive(this.isActivatable());
	},
	
	setValue: function(value) {
		this.value.setValue(value);
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		return this.value.getValue();
	},
	
	serialize: function() {
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		var val = record.get(this.dataIndex);
		if(typeof val != "string") {
			return this.getValue().length == 0;
    }
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.filter.DateFilter = Ext.extend(Ext.grid.filter.Filter, {
    /**
     * @cfg {Date} dateFormat
     * The date format applied to the menu's {@link Ext.menu.DateMenu}
     */
	dateFormat: 'm/d/Y',
    /**
     * @cfg {Object} pickerOpts
     * The config object that will be passed to the menu's {@link Ext.menu.DateMenu} during
     * initialization (sets minDate, maxDate and format to the same configs specified on the filter)
     */
	pickerOpts: {},
    /**
     * @cfg {String} beforeText
     * The text displayed for the "Before" menu item
     */
    beforeText: 'Before',
    /**
     * @cfg {String} afterText
     * The text displayed for the "After" menu item
     */
    afterText: 'After',
    /**
     * @cfg {String} onText
     * The text displayed for the "On" menu item
     */
    onText: 'On',
    /**
     * @cfg {Date} minDate
     * The minimum date allowed in the menu's {@link Ext.menu.DateMenu}
     */
    /**
     * @cfg {Date} maxDate
     * The maximum date allowed in the menu's {@link Ext.menu.DateMenu}
     */
	
	init: function() {
		var opts = Ext.apply(this.pickerOpts, {
			minDate: this.minDate, 
			maxDate: this.maxDate, 
			format:  this.dateFormat
		});
		var dates = this.dates = {
			'before': new Ext.menu.CheckItem({text: this.beforeText, menu: new Ext.menu.DateMenu(opts)}),
			'after':  new Ext.menu.CheckItem({text: this.afterText, menu: new Ext.menu.DateMenu(opts)}),
			'on':     new Ext.menu.CheckItem({text: this.onText, menu: new Ext.menu.DateMenu(opts)})
    };
				
		this.menu.add(dates.before, dates.after, "-", dates.on);
		
		for(var key in dates) {
			var date = dates[key];
			date.menu.on('select', this.onSelect.createDelegate(this, [date]), this);
  
      date.on('checkchange', function(){
        this.setActive(this.isActivatable());
			}, this);
		};
	},
  
	onSelect: function(date, menuItem, value, picker) {
    date.setChecked(true);
    var dates = this.dates;
    
    if(date == dates.on) {
      dates.before.setChecked(false, true);
      dates.after.setChecked(false, true);
    } else {
      dates.on.setChecked(false, true);
      
      if(date == dates.after && dates.before.menu.picker.value < value) {
        dates.before.setChecked(false, true);
      } else if (date == dates.before && dates.after.menu.picker.value > value) {
        dates.after.setChecked(false, true);
      }
    }
    
    this.fireEvent("update", this);
  },
  
	getFieldValue: function(field) {
		return this.dates[field].menu.picker.getValue();
	},
	
	getPicker: function(field) {
		return this.dates[field].menu.picker;
	},
	
	isActivatable: function() {
		return this.dates.on.checked || this.dates.after.checked || this.dates.before.checked;
	},
	
	setValue: function(value) {
		for(var key in this.dates) {
			if(value[key]) {
				this.dates[key].menu.picker.setValue(value[key]);
				this.dates[key].setChecked(true);
			} else {
				this.dates[key].setChecked(false);
			}
    }
	},
	
	getValue: function() {
		var result = {};
		for(var key in this.dates) {
			if(this.dates[key].checked) {
				result[key] = this.dates[key].menu.picker.getValue();
      }
    }	
		return result;
	},
	
	serialize: function() {
		var args = [];
		if(this.dates.before.checked) {
			args = [{type: 'date', comparison: 'lt', value: this.getFieldValue('before').format(this.dateFormat)}];
    }
		if(this.dates.after.checked) {
			args.push({type: 'date', comparison: 'gt', value: this.getFieldValue('after').format(this.dateFormat)});
    }
		if(this.dates.on.checked) {
			args = {type: 'date', comparison: 'eq', value: this.getFieldValue('on').format(this.dateFormat)};
    }

    this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		var val = record.get(this.dataIndex).clearTime(true).getTime();
		
		if(this.dates.on.checked && val != this.getFieldValue('on').clearTime(true).getTime()) {
			return false;
    }
		if(this.dates.before.checked && val >= this.getFieldValue('before').clearTime(true).getTime()) {
			return false;
    }
		if(this.dates.after.checked && val <= this.getFieldValue('after').clearTime(true).getTime()) {
			return false;
    }
		return true;
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.filter.ListFilter = Ext.extend(Ext.grid.filter.Filter, {
	labelField:  'text',
	loadingText: 'Loading...',
	loadOnShow:  true,
	value:       [],
	loaded:      false,
	phpMode:     false,
	
	init: function(){
		this.menu.add('<span class="loading-indicator">' + this.loadingText + '</span>');
		
		if(this.store && this.loadOnShow) {
		  this.menu.on('show', this.onMenuLoad, this);
		} else if(this.options) {
			var options = [];
			for(var i=0, len=this.options.length; i<len; i++) {
				var value = this.options[i];
				switch(Ext.type(value)) {
					case 'array':  
            options.push(value);
            break;
					case 'object':
            options.push([value.id, value[this.labelField]]);
            break;
					case 'string':
            options.push([value, value]);
            break;
				}
			}
			
			this.store = new Ext.data.Store({
				reader: new Ext.data.ArrayReader({id: 0}, ['id', this.labelField])
			});
			this.options = options;
			this.menu.on('show', this.onMenuLoad, this);
		}
    
		this.store.on('load', this.onLoad, this);
		this.bindShowAdapter();
	},
	
	/**
	 * Lists will initially show a 'loading' item while the data is retrieved from the store. In some cases the
	 * loaded data will result in a list that goes off the screen to the right (as placement calculations were done
	 * with the loading item). This adaptor will allow show to be called with no arguments to show with the previous
	 * arguments and thusly recalculate the width and potentially hang the menu from the left.
	 * 
	 */
	bindShowAdapter: function() {
		var oShow = this.menu.show;
		var lastArgs = null;
		this.menu.show = function() {
			if(arguments.length == 0) {
				oShow.apply(this, lastArgs);
			} else {
				lastArgs = arguments;
				oShow.apply(this, arguments);
			}
		};
	},
	
	onMenuLoad: function() {
		if(!this.loaded) {
			if(this.options) {
				this.store.loadData(this.options);
      } else {
				this.store.load();
      }
		}
	},
	
	onLoad: function(store, records) {
		var visible = this.menu.isVisible();
		this.menu.hide(false);
		
		this.menu.removeAll();
		
		var gid = this.single ? Ext.id() : null;
		for(var i=0, len=records.length; i<len; i++) {
			var item = new Ext.menu.CheckItem({
				text: records[i].get(this.labelField), 
				group: gid, 
				checked: this.value.indexOf(records[i].id) > -1,
				hideOnClick: false
      });
			
			item.itemId = records[i].id;
			item.on('checkchange', this.checkChange, this);
						
			this.menu.add(item);
		}
		
		this.setActive(this.isActivatable());
		this.loaded = true;
		
		if(visible) {
			this.menu.show(); //Adaptor will re-invoke with previous arguments
    }
	},
	
	checkChange: function(item, checked) {
		var value = [];
		this.menu.items.each(function(item) {
			if(item.checked) {
				value.push(item.itemId);
      }
		},this);
		this.value = value;
		
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},
	
	isActivatable: function() {
		return this.value.length > 0;
	},
	
	setValue: function(value) {
		var value = this.value = [].concat(value);

		if(this.loaded) {
			this.menu.items.each(function(item) {
				item.setChecked(false, true);
				for(var i=0, len=value.length; i<len; i++) {
					if(item.itemId == value[i]) {
						item.setChecked(true, true);
          }
        }
			}, this);
    }
			
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		return this.value;
	},
	
	serialize: function() {
    var args = {type: 'list', value: this.phpMode ? this.value.join(',') : this.value};
    this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		return this.getValue().indexOf(record.get(this.dataIndex)) > -1;
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
Ext.grid.filter.NumericFilter = Ext.extend(Ext.grid.filter.Filter, {
	init: function() {
		this.menu = new Ext.menu.RangeMenu();
		
		this.menu.on("update", this.fireUpdate, this);
	},
	
	fireUpdate: function() {
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},
	
	isActivatable: function() {
		var value = this.menu.getValue();
		return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
	},
	
	setValue: function(value) {
		this.menu.setValue(value);
	},
	
	getValue: function() {
		return this.menu.getValue();
	},
	
	serialize: function() {
		var args = [];
		var values = this.menu.getValue();
		for(var key in values) {
			args.push({type: 'numeric', comparison: key, value: values[key]});
    }
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		var val = record.get(this.dataIndex),
			values = this.menu.getValue();
			
		if(values.eq != undefined && val != values.eq) {
			return false;
    }
		if(values.lt != undefined && val >= values.lt) {
			return false;
    }
		if(values.gt != undefined && val <= values.gt) {
			return false;
    }
		return true;
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
Ext.grid.filter.BooleanFilter = Ext.extend(Ext.grid.filter.Filter, {
    /**
     * @cfg {Boolean} defaultValue
     * The default value of this filter (defaults to false)
     */
    defaultValue: false,
    /**
     * @cfg {String} yesText
     * The text displayed for the "Yes" checkbox
     */
    yesText: 'Yes',
    /**
     * @cfg {String} noText
     * The text displayed for the "No" checkbox
     */
    noText: 'No',
	init: function(){
	    var gId = Ext.id();
			this.options = [
				new Ext.menu.CheckItem({text: this.yesText, group: gId, checked: this.defaultValue === true}),
				new Ext.menu.CheckItem({text: this.noText, group: gId, checked: this.defaultValue === false})
	    ];
		this.menu.add(this.options[0], this.options[1]);
		for(var i=0; i<this.options.length; i++) {
			this.options[i].on('click', this.fireUpdate, this);
			this.options[i].on('checkchange', this.fireUpdate, this);
		}
	},
	isActivatable: function() {
		return true;
	},
	fireUpdate: function() {		
		this.fireEvent("update", this);			
		this.setActive(true);
	},
	setValue: function(value) {
		this.options[value ? 0 : 1].setChecked(true);
	},
	getValue: function() {
		return this.options[0].checked;
	},
	serialize: function() {
		var args = {type: 'boolean', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	validateRecord: function(record) {
		return record.get(this.dataIndex) == this.getValue();
	}
});
/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.GroupSummary = function(config){
    Ext.apply(this, config);
};

Ext.extend(Ext.grid.GroupSummary, Ext.util.Observable, {
    init : function(grid){
        this.grid = grid;
        this.cm = grid.getColumnModel();
        this.view = grid.getView();

        var v = this.view;
        v.doGroupEnd = this.doGroupEnd.createDelegate(this);

        v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
        v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
        v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
        v.afterMethod('onUpdate', this.doUpdate, this);
        v.afterMethod('onRemove', this.doRemove, this);

        if(!this.rowTpl){
            this.rowTpl = new Ext.Template(
                '<div class="x-grid3-summary-row" style="{tstyle}">',
                '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr>{cells}</tr></tbody>',
                '</table></div>'
            );
            this.rowTpl.disableFormats = true;
        }
        this.rowTpl.compile();

        if(!this.cellTpl){
            this.cellTpl = new Ext.Template(
                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
                "</td>"
            );
            this.cellTpl.disableFormats = true;
        }
        this.cellTpl.compile();
    },

    toggleSummaries : function(visible){
        var el = this.grid.getGridEl();
        if(el){
            if(visible === undefined){
                visible = el.hasClass('x-grid-hide-summary');
            }
            el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
        }
    },

    renderSummary : function(o, cs){
        cs = cs || this.view.getColumnData();
        var cfg = this.cm.config;

        var buf = [], c, p = {}, cf, last = cs.length-1;
        for(var i = 0, len = cs.length; i < len; i++){
            c = cs[i];
            cf = cfg[i];
            p.id = c.id;
            p.style = c.style;
            p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            if(cf.summaryType || cf.summaryRenderer){
                p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
            }else{
                p.value = '';
            }
            if(p.value == undefined || p.value === "") p.value = "&#160;";
            buf[buf.length] = this.cellTpl.apply(p);
        }

        return this.rowTpl.apply({
            tstyle: 'width:'+this.view.getTotalWidth()+';',
            cells: buf.join('')
        });
    },

    calculate : function(rs, cs){
        var data = {}, r, c, cfg = this.cm.config, cf;
        for(var j = 0, jlen = rs.length; j < jlen; j++){
            r = rs[j];
            for(var i = 0, len = cs.length; i < len; i++){
                c = cs[i];
                cf = cfg[i];
                if(cf.summaryType){
                    data[c.name] = Ext.grid.GroupSummary.Calculations[cf.summaryType](data[c.name] || 0, r, c.name, data);
                }
            }
        }
        return data;
    },

    doGroupEnd : function(buf, g, cs, ds, colCount){
        var data = this.calculate(g.rs, cs);
        buf.push('</div>', this.renderSummary({data: data}, cs), '</div>');
    },

    doWidth : function(col, w, tw){
        var gs = this.view.getGroups(), s;
        for(var i = 0, len = gs.length; i < len; i++){
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.width = w;
        }
    },

    doAllWidths : function(ws, tw){
        var gs = this.view.getGroups(), s, cells, wlen = ws.length;
        for(var i = 0, len = gs.length; i < len; i++){
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for(var j = 0; j < wlen; j++){
                cells[j].style.width = ws[j];
            }
        }
    },

    doHidden : function(col, hidden, tw){
        var gs = this.view.getGroups(), s, display = hidden ? 'none' : '';
        for(var i = 0, len = gs.length; i < len; i++){
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        }
    },

    // Note: requires that all (or the first) record in the 
    // group share the same group value. Returns false if the group
    // could not be found.
    refreshSummary : function(groupValue){
        return this.refreshSummaryById(this.view.getGroupId(groupValue));
    },

    getSummaryNode : function(gid){
        var g = Ext.fly(gid, '_gsummary');
        if(g){
            return g.down('.x-grid3-summary-row', true);
        }
        return null;
    },

    refreshSummaryById : function(gid){
        var g = document.getElementById(gid);
        if(!g){
            return false;
        }
        var rs = [];
        this.grid.store.each(function(r){
            if(r._groupId == gid){
                rs[rs.length] = r;
            }
        });
        var cs = this.view.getColumnData();
        var data = this.calculate(rs, cs);
        var markup = this.renderSummary({data: data}, cs);

        var existing = this.getSummaryNode(gid);
        if(existing){
            g.removeChild(existing);
        }
        Ext.DomHelper.append(g, markup);
        return true;
    },

    doUpdate : function(ds, record){
        this.refreshSummaryById(record._groupId);
    },

    doRemove : function(ds, record, index, isUpdate){
        if(!isUpdate){
            this.refreshSummaryById(record._groupId);
        }
    },

    showSummaryMsg : function(groupValue, msg){
        var gid = this.view.getGroupId(groupValue);
        var node = this.getSummaryNode(gid);
        if(node){
            node.innerHTML = '<div class="x-grid3-summary-msg">' + msg + '</div>';
        }
    }
});

Ext.grid.GroupSummary.Calculations = {
    'sum' : function(v, record, field){
        return v + (record.data[field]||0);
    },
    'count' : function(v, record, field, data){
        return data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
    },
	'commaCount': function(v, record, field, data){
		var c=(record.data[field]||"").split(",").length;
		return data[field+'commaCount'] ? data[field+'commaCount'] += c: (data[field+'commaCount'] =c );
	},
    'max' : function(v, record, field, data){
        var v = record.data[field];
        var max = data[field+'max'] === undefined ? (data[field+'max'] = v) : data[field+'max'];
        return v > max ? (data[field+'max'] = v) : max;
    },
    'min' : function(v, record, field, data){
        var v = record.data[field];
        var min = data[field+'min'] === undefined ? (data[field+'min'] = v) : data[field+'min'];
        return v < min ? (data[field+'min'] = v) : min;
    },
    'average' : function(v, record, field, data){
        var c = data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
        var t = (data[field+'total'] = ((data[field+'total']||0) + (record.data[field]||0)));
        return t === 0 ? 0 : t / c;
    }
}

Ext.grid.HybridSummary = Ext.extend(Ext.grid.GroupSummary, {
    calculate : function(rs, cs){
        var gcol = this.view.getGroupField();
        var gvalue = rs[0].data[gcol];
        var gdata = this.getSummaryData(gvalue);
        return gdata || Ext.grid.HybridSummary.superclass.calculate.call(this, rs, cs);
    },

    updateSummaryData : function(groupValue, data, skipRefresh){
        var json = this.grid.store.reader.jsonData;
        if(!json.summaryData){
            json.summaryData = {};
        }
        json.summaryData[groupValue] = data;
        if(!skipRefresh){
            this.refreshSummary(groupValue);
        }
    },

    getSummaryData : function(groupValue){
        var json = this.grid.store.reader.jsonData;
        if(json && json.summaryData){
            return json.summaryData[groupValue];
        }
        return null;
    }
});