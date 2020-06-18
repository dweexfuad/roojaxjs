__uses_waitlist = [];
__classDir = "roojaxui";
__Color = [];

window.Function.prototype.extend = function(parentClassOrObject){
    try
    {				
        if (typeof(parentClassOrObject) == "function")
        {
        	if (parentClassOrObject.constructor == Function)
            {
                this.prototype = new parentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.parent = parentClassOrObject.prototype;				
    	    }
    	    else
    	    {
                this.prototype = parentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.parent = parentClassOrObject;
    	    }			
            return this;
        }
    }
    catch (e)
    {
        if (this.className != undefined)
            alert("Error when extending class : " + this.className + " : " + e);
        else
            alert("Error when extending class : " + this + " : " + e);
    }
};
window.Function.prototype.methods = function(a1, a2, a3){
	try{
		if (a2 == undefined) a2 = true;
		if (typeof a1 == 'string') return this.addMethod(a1, a2, a3);	
		for (var p in a1) this.addMethod(p, a1[p], a2);						
	}catch(e){
		alert(e);
	}		
};

window.Function.prototype.addMethod = function(name, method, force){				
		if (force || !this.prototype[name]) eval( "this.prototype."+ name+" = "+method);			
};
function getBasicResourceId()
{
    var result = window.basicResourceId;
    window.basicResourceId++;
    
    return result;
};
window.basicResourceId = 1;

$.roojaxui = $.roojaxui || {};
$.roojaxui.uses = function(classList, cb)
{
	var loadIndicator = document.getElementById("loadIndicator");
	__classVer = "?v="+Date().toString();

	if (loadIndicator != null)
		loadIndicator.style.display = "";

	if (typeof(classList) == "string")
	{
		var className = classList;
		classList = [className];
	}

	//console.log("Uses : " + JSON.stringify(classList));

	var wait = false;

	var head = document.getElementsByTagName('head')[0];

	for (var i in classList)
	{

		if (!classExist(classList[i]))
		{
			var className = classList[i];

			wait = true;

			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = filePath(className);
			head.appendChild(script);

			script.onload = function () { usesComplete(className); }
		}
	}

	__uses_waitlist.push({usesList : classList, callBack : cb});

	if (!wait)
		usesComplete("synch : " + JSON.stringify(classList));

	function filePath(className)
	{
		var result = className;
		result = result.replace(/\./g, "/");

		result = __classDir + "/" + result + ".js" + __classVer;
		console.log(result);
		return result;
	}
}

function classExist(className)
{
	var result = false;
	
	var script = "result = ($.roojaxui." + className + " != undefined);";

	try
	{
		console.log(script);
		eval(script);
	}
	catch (e)
	{
		result = false;
	}
	console.log(result);
	return result;
}

function usesComplete(className)
{
	try{
		console.log("usesComplete : " + className);

		do
		{
			var i = 0;
			var changed = false;

			while (i < __uses_waitlist.length)
			{
				var item = __uses_waitlist[i];

				var complete = true;
			
				for (var j in item.usesList)
				{
					
					if (!classExist(item.usesList[j]))
					{
						complete = false;
						break;
					}
                }
                
                console.log(complete +":"+item.callBack);

				if (complete)
				{
                    
					item.callBack.call(null);
					__uses_waitlist.splice(i, 1);
					changed = true;
				}
				else
					i++;
			}
		} while (changed);

		if (__uses_waitlist.length <= 0)
		{
			var loadIndicator = document.getElementById("loadIndicator");

			if (loadIndicator != null)
				loadIndicator.style.display = "none";
		}
	}catch(e){
		console.log(e);
	}
}
