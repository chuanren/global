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
	updateBuffer: 500,
	paramPrefix: 'filter',
	filterCls: 'ux-filtered-column',
	local: true,
	autoReload: true,
	stateId: undefined,
	showMenu: true,
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
	saveState: function(grid, state){
		var filters = {};
		this.filters.each(function(filter) {
			if(filter.active) {
				filters[filter.dataIndex] = filter.getValue();
      }
		});
		return state.filters = filters;
	},
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
	onMenu: function(filterMenu) {
		var filter = this.getMenuFilter();
		if(filter) {
			this.menu.menu = filter.menu;
			this.menu.setChecked(filter.active, false);
		}
		
		this.menu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},
	onCheckChange: function(item, value) {
		this.getMenuFilter().setActive(value);
	},
	onBeforeCheck: function(check, value) {
		return !value || this.getMenuFilter().isActivatable();
	},
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
	onBeforeLoad: function(store, options) {
    options.params = options.params || {};
		this.cleanParams(options.params);		
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},
	onRefresh: function(view) {
		this.updateColumnHeadings(view);
	},
	getMenuFilter: function() {
		var view = this.grid.getView();
		if(!view || view.hdCtxIndex === undefined) {
			return null;
    }
		
		return this.filters.get(view.cm.config[view.hdCtxIndex].dataIndex);
	},
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
	addFilter: function(config) {
		var filter = config.menu ? config : new (this.getFilterClass(config.type))(config);
		this.filters.add(filter);
		
		Ext.util.Observable.capture(filter, this.onStateChange, this);
		return filter;
	},
	getFilter: function(dataIndex){
		return this.filters.get(dataIndex);
	},
	clearFilters: function() {
		this.filters.each(function(filter) {
			filter.setActive(false);
		});
	},
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
	cleanParams: function(p) {
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for(var key in p) {
			if(regex.test(key)) {
				delete p[key];
      }
    }
	},
	getFilterClass: function(type){
		return Ext.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});
Ext.ns("Ext.grid.filter");
Ext.grid.filter.Filter = function(config){
	Ext.apply(this, config);
		
	this.events = {
		'activate': true,
		'deactivate': true,
		'update': true,
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
	active: false,
	dataIndex: null,
	menu: null,
	init: Ext.emptyFn,
	
	fireUpdate: function() {
		this.value = this.item.getValue();
		
		if(this.active) {
			this.fireEvent("update", this);
    }
		this.setActive(this.value.length > 0);
	},
	isActivatable: function() {
		return true;
	},
	setActive: function(active, suppressEvent) {
		if(this.active != active) {
			this.active = active;
			if(suppressEvent !== true) {
				this.fireEvent(active ? 'activate' : 'deactivate', this);
      }
		}
	},
	getValue: Ext.emptyFn,
	setValue: Ext.emptyFn,
	serialize: Ext.emptyFn,
	 validateRecord: function(){return true;}
});
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
Ext.grid.filter.DateFilter = Ext.extend(Ext.grid.filter.Filter, {
		dateFormat: 'm/d/Y',
		pickerOpts: {},
		beforeText: 'Before',
		afterText: 'After',
		onText: 'On',
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
Ext.grid.filter.BooleanFilter = Ext.extend(Ext.grid.filter.Filter, {
    defaultValue: false,
    yesText: 'Yes',
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