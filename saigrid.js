(function($){

    $.fn.saiGrid = function(methodOrOptions){

        var h = this.height() - 40;
        this.$containerHeader = $("<div class='header' style='position:absolute;top:0;width:100%;height:40px;background:#336600'></div>");
        this.$container = $("<div class='container' style='position:absolute;top:40px;width:100%;background:#9a9a9a;overflow:auto'></div>");
        this.$container.css({height:h});

        this.$containerNumber = $("<div class='fixed' style='position:absolute;top:0;background:#272727;width:40px;height:100%;top:0px'></div>");
        
        this.$containerHeader.appendTo(this);
        this.append(this.$container);
        // this.append(this.$containerNumber);
        this.$container.on("scroll", () =>{
            this.$containerHeader.css({left: - this.$container.scrollLeft()});
        });

        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        } 
    };
    var methods = {
        init: function(options){
            console.log("Init");
            
            if (options.colTitle){
                _createColumn(this, options.colTitle);
            }
            if (options.rowCount){
                _createRow(this, options.rowCount);
            }
        }
    };
    
    function _createColumn($this, colTitle){
        var l = 0;
        $this.colTitle = colTitle;
        $.each(colTitle, (i, col) => {
            var w = col.width;
            var $column = $("<div style='position:absolute;display:flex;width: "+ w +"px;height:100%;top:0px'> </div>");
            $column.css({left:l,alignItems: "center",justifyContent: "center",borderRight:"1px solid #888888"});
            
            $column.html(col.title);
            $column.appendTo($this.$containerHeader);
            l += w;
        }); 
        $this.$containerHeader.css({width: l});
    }
    function _createRow($this, rowCount){
        console.log($this.colTitle);
        for(var i = 0; i < rowCount; i++){
            var l = 0;
            var rowNode = $("<div style='position:relative;height:30px;border-bottom:1px solid #888888;'></div>");
            $.each($this.colTitle, (c, col) => {
                var w = col.width;
                var $column = $("<div style='position:absolute;width: "+ w +"px;height:100%;top:0px;overflow:hidden;white-space: nowrap'> </div>");
                var cell = $("<div contenteditable=true style='display:flex;position:absolute;margin-left:10px; margin-right:10px;overflow:hidden;height:100%'></div>");
                cell.css({alignItems: "center",justifyContent: "left", width:w - 20});
                $column.css({left:l,borderRight:"1px solid #888888"});
                cell.html("Col " + c +": Row"+ i);
                cell.appendTo($column);
                $column.appendTo(rowNode);
                cell.on("keyup",()=>{
                    console.log(cell.html());
                });
                l += w;
            }); 
            rowNode.css({width: l});
            rowNode.appendTo($this.$container);
        }

    };
    
}(jQuery));