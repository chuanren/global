/**
* require input.js
*/
if(!Object.isArray(sduiHtmlReplaceFormValues)){
	sduiHtmlReplaceFormValues=new Hash(sduiHtmlReplaceFormValues);
	sduiHtmlReplaceFormValues.each(function(p){
			var input=$("sduiHtmlReplaceForm["+p.key+"]");
			if(Object.isString(p.value)){
				switch(p.value){
				case 'inputCalendar':
					inputCalendar(input);
					break;
				case 'inputEditor':
					inputEditor(input);
					break;
				case 'inputReadOnly':
					inputReadOnly(input);
					break;
				default:
					input.value=p.value;
					break;
				}
			}else if(Object.isArray(p.value)){
				if(Object.isArray(p.value[0])&&Object.isArray(p.value[1])){
					inputSelect(input,p.value[0],p.value[1]);
				}else{
					switch(p.value[0]){
					case 'inputCalendar':
						input.value=p.value[1];
						inputCalendar(input);
						break;
					case 'inputEditor':
						input.value=p.value[1];
						inputEditor(input);
						break;
					case 'inputReadOnly':
						input.value=p.value[1];
						inputReadOnly(input);
						break;
					default:
						inputSelect(input,p.value);
						break;
					}
				}
			}
	});
}