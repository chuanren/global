sdui||(sdui={});
sdui.toUrl=function(params,action){
	params||(params={});
	delete params[sdui.actionName];
	action||(action=sdui.action);
	var s=[];
	s.push(sdui.base,sdui.askmark);
	if(!Object.isArray(sdui.baseParams))for(k in sdui.baseParams){
			v=sdui.baseParams[k];
			s.push(k,sdui.eqnmark,v,sdui.andmark);
	}
	s.push(sdui.actionName,sdui.eqnmark,action,sdui.andmark);
	for(k in params){
			v=params[k];
			s.push(k,sdui.eqnmark,v,sdui.andmark);
	}
	var c=s.pop();
	if(c!==sdui.andmark)s.push(c);
	return s.join("");
}