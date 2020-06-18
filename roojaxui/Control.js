//***********************************************************************************************
//*	Copyright (c) 2009 roojax
//*	 All rights reserved. This program and the accompanying materials
//*	 are made available under the terms of the Common Public License v1.0
//*	 which accompanies this distribution, and is available at
//*	Contributors 
//* 			roojax jamboo											
//***********************************************************************************************
$.roojaxui.Control = function(owner, options){
    if (owner)
    {				
        this.isRounded = false;
		$.roojaxui.Control.prototype.parent.constructor.call(this, owner);		
		this.className = "control_control";
		this.left = 8;
		this.top = 0;        
		this.width = 32;
		this.height = 32;
		this.name = "control";			
		this.visible = true;        
		this.tabIndex = 1;
		this.tabStop = false;		
		this.tag = 0;
		this.opacity = 100;
		this.opacity2 = 100;
		this.heightTmp = 0;			
		this.isPopUp = false;
		this.interval = 50;
		this.fadeIn = false;
		this.data = "";
        this.enabled = true;
		this.hint = "";		
		this.options = options;
		if (options !== undefined){
			this.updateByOptions(options);			
			if (options.interval !== undefined) this.setIntvl(options.interval);
			if (options.autoComplete) this.setAutoComplete(options.autoComplete);
		}
    }
};
$.roojaxui.Control.extend($.roojaxui.Component);
window.control = $.roojaxui.Control;
$.roojaxui.Control.methods({
	draw: function(canvas){		
		try{
			var node = $("<div id='"+this.getFullId()+"' style='position:absolute;left:0;top:0;width:32;height:32'></div>");			
			node.appendTo(canvas);
            if (this.doDraw) 
                this.doDraw(node);
			this.canvas = node;
		}catch(e){
			error_log(this+"$draw()"+e);
		}
	},
	setInnerHTML: function(html, canvas){		
		var cnv = canvas !== undefined ? canvas : this.getCanvas();				
		if (cnv !== undefined){		    
			html = html.replace(/[{}]/gi,"");
			cnv.html(html);
		}
	},
	getCanvas: function(){	    
	    return $("#"+this.getFullId());
	},
	doDraw:function(canvas){
	},
	bringToFront:function(){
	    if (this.owner.isContainer){ 
	        var zIndex = this.owner.getNextZIndex();        
	        var canvas = this.getCanvas();
	        if (canvas != undefined)
	            canvas.css({'z-index' : zIndex});
	    }
	},
	sendToBack:function(){
	    if (this.owner.isContainer){ 
	        var canvas = this.getCanvas();
	        if (canvas != undefined)
	            canvas.css({'z-index' : 0});
	    }
	},
	getVisibility:function (el) {				
	},
	setFocus: function(){	
		try{
			var edit = $("#"+this.getFullId() +"_edit");			
			if (edit != undefined &&  edit.is(':visible') && this.isVisible()) {				
				edit.focus();							
			}else if (this.tabStop) this.getForm().setActiveControl(this);						
			this.doSetFocus();			
		}catch(e){						
			error_log("setFocus: "+e+":"+this.caption);
		}
	},
	doThemesChange: function(themeName){
	},
	doLostFocus: function(){
		try{				
			this.doDefocus();
		}catch(e){
			alert(e);
		}
	},
	doDefocus: function(){				
		var edit = $("#"+this.getFullId() +"_edit");
		if (edit && this.autoComplete && this.app.suggestionBox) {							
			if (edit.val() !="" )this.app.suggestionBox.add(edit.value);							
			this.app.suggestionBox.hide();
		}
	},
	doSetFocus: function(){
		var edit = $("#"+this.getFullId()+"_edit");		
		if (edit && this.autoComplete){			
			if (this.app.suggestionBox === undefined){			    		    			
				uses("control_suggestionBox");					
				this.app.suggestionBox = new control_suggestionBox(this.app);								
			}
			this.app.suggestionBox.setCtrl(this);
			this.app.suggestionBox.hide();
		}
	},
	doSizeChange: function(width, height){	 		
		$("#"+this.getFullId()).fixBoxModel();
	},
	getForm: function(){
		try{
			var result = this.owner;		
			if (window.control_childForm === undefined){
			     uses("control_childForm");
            }
			while ((result != undefined) && !(result instanceof control_commonForm  || result instanceof control_childForm))  							
				result = result.getOwner();
		}catch(e){
			error_log(this+"$getForm()"+e);
		}
	    return result;
	},
	getHint: function(){
		return this.hint;
	},
	setHint: function(data){
		//this.hint = data;	
		this.hint = "";
		this.canvas.prop("title", data);
	},
	getLeft: function(){
		return this.left;
	},
	setLeft: function(data){	 		
		$("#"+this.getFullId()).css({left: data});		
		this.left = data;//$("#"+this.getFullId()).position().left;
	},
	getTop: function(){
		return this.top;
	},
	setTop: function(data){	    		
		$("#"+this.getFullId()).css({top : data });		
		this.top = data;//$("#"+this.getFullId()).position().top;
	},
	invalidateSize : function(width, height){
	},
	getWidth: function(){
		return this.width;
	},
	setWidth: function(data){	
	   try{
    	    if (this.width != data)
    	    {    	        
    	        $("#"+this.getFullId()).width(data);
    	        this.width = $("#"+this.getFullId()).width();
    			this.doSizeChange(this.width, this.height);
    	    }	    
  	    }catch(e){
  	         systemAPI.alert(this+"$setWidth()",e);
        }
	},
	getHeight: function(){
		return this.height;
	},
	setHeight: function(data){
		try{
		    if (this.height != data)
		    {		        
				$("#"+this.getFullId()).height(data);
				this.height = $("#"+this.getFullId()).height();    
		        this.doSizeChange(this.width, this.height);			
		    }		    
		}catch(e){
			systemAPI.alert(this+"$setHeight()",e);
		}
	},
	getTabIndex: function(){
		return this.tabIndex;
	},
	setTabIndex: function(data){
		this.tabIndex = data;
	},
	isTabStop: function(){
		return this.tabStop;
	},
	setTabStop: function(data){
		this.tabStop = data;
	},
	isVisible: function(){
		return this.visible;
	},
	setVisible: function(data){
		this.visible = data;    
	    var node = this.getCanvas();
	    if (node != undefined){
			if (data)
				node.show();
			else node.hide();
	    }
	},
	getPopUpMenu: function(){
		return this.popUpMenu;
	},
	setPopUpMenu: function(data){
		this.popUpMenu = data;
	},	
	show: function(options){
		this.visible = true;
		this.getCanvas().show(options);
	},
	hide: function(options){
		this.visible = false;
		this.getCanvas().hide(options);
	},
	setTag: function(tag){
		this.tag = tag;
	},
	getTag: function(){
		return this.tag;
	},
	fade: function(){			
	},
	fadeOut: function(){		
	},
	setOpacity: function(cnv,opacity){		
		if (opacity == undefined){
			opacity = cnv;
			cnv = this.getCanvas();
		}
		cnv.css({opacity : opacity/100, filter:"alpha(opacity="+opacity+")" });		
	},
	setBound:function(x, y, w, h){
		this.setLeft(x);
		this.setTop(y);
		this.setWidth(w);
		this.setHeight(h);
	},
	setData: function(data){
		this.data = data;
	},
	getData: function(){
		return this.data;
	},
	
	setStyle: function(style){
		var cnv = this.getCanvas();
		if (cnv !== undefined && cnv !== null){
			cnv.css(style);
		}
	},
	removeStyle: function(){
		var cnv = this.getCanvas();
		if (cnv !== undefined && cnv !== null){
			cnv.css();
		}
	}, 
	updateByOptions: function(options){
		try{
			if (options.bound !== undefined) {
				this.setLeft(options.bound[0]);
				this.setTop(options.bound[1]);
				this.setWidth(options.bound[2]);
				this.setHeight(options.bound[3]);
			}
			if (options.height !== undefined) this.setHeight(options.height);
			if (options.left !== undefined) this.setLeft(options.left);
			if (options.top !== undefined) this.setTop(options.top);
			if (options.width !== undefined) this.setWidth(options.width);
			if (options.name !== undefined) this.setName(options.name);
			if (options.hint !== undefined) this.setHint(options.hint);			
			if (options.tag !== undefined) this.setTag(options.tag);			
			if (options.visible !== undefined) this.setVisible(options.visible);	
			if (options.border !== undefined) this.setBorder(options.border);
			if (options.corner !== undefined) this.corner(options.corner);
			if (options.cursor) this.setCursor(options.cursor);
			if (options.shadow) this.setShadow(options.shadow);

		}catch(e){
			error_log(e);
		}
	}
});
