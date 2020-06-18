$.roojaxui.EventEmitter = function(){
    this.className = "EventEmitter";    
    this.serialXML = "";
	this.init();
	
};
$.roojaxui.EventEmitter.extend(window.Function);
$.roojaxui.EventEmitter.methods({
	init : function() 
	{
		this.callbackList = {};
		this.onceCallbackList = {};
	},
	
	addListener : function(event, listener) 
	{
		if ((typeof(listener) == "function") || ((listener instanceof Array) && (listener.length == 2) && (typeof(listener[1]) == "function")))
		{
			if (this.callbackList[event] == undefined)
				this.callbackList[event] = new Array();
			
			this.callbackList[event].push(listener);
			
			this.emit("newListener", event, listener);
		}
		
	},
	on : function(event, listener)
	{
		this.addListener(event, listener);
	},
	
	removeListener : function(event, listener) 
	{
		var list = this.callbackList[event];
		
		if (list != undefined)
		{
			var pos = list.indexOf(listener);
			
			if (pos > 0)
				list.splice(pos, 1);
		}
	},
	
	removeAllListeners : function(event)
	{
		if (event != null)
		{
			this.callbackList[event] = undefined;
			this.onceCallbackList[event] = undefined;
		}
		else
		{
			for (var i in this.callbackList)
				this.callbackList[i] = undefined;
			
			for (var i in this.onceCallbackList)
				this.onceCallbackList[i] = undefined;
		}
	},
	
	setMaxListeners : function(n)
	{
		this.maxListener = n;
	},
	
	listeners : function(event)
	{
		return this.callbackList[event];
	},
	
	callFunc : function()
	{
		if (arguments.length > 0)
		{
			var cb = arguments[0];
			
			if (cb != null)
			{
				var param = new Array();
				
				for (var i = 1; i < arguments.length; i++)
					param.push(arguments[i]);
				
				if (cb instanceof Array)
					cb[1].apply(cb[0], param);
				else
					cb.apply(null, param);
			}
		}
	},
	
	emit : function()
	{
		if (arguments.length > 0)
		{
			var event = arguments[0];
			
			var param = new Array();
			
			for (var i = 1; i < arguments.length; i++)
				param.push(arguments[i]);
			
			var list = this.callbackList[event];
			if (list != undefined)
			{
				for (var i in list)
				{
					if (list[i] instanceof Array)
						list[i][1].apply(list[i][0], param);
					else
						list[i].apply(null, param);
				}
			}
		}
	}
});
