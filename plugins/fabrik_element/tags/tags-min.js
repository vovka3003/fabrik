/*! Fabrik */
var FbTags=my.Class(FbElement,{options:{rowid:"",id:0},initialize:function(a,b){FbTags.Super.call(this,a,b),this.options.editable&&this.setUp()},setUp:function(){jQuery("#"+this.options.element).chosen({disable_search_threshold:10,allow_single_deselect:!0}),this.sel=jQuery("#"+this.options.element).ajaxChosen({type:"GET",url:Fabrik.liveSite+"index.php?option=com_tags&task=tags.searchAjax",dataType:"json",jsonTermKey:"like",afterTypeDelay:"500",minTermLength:"3"},function(a){var b=[];return jQuery.each(a,function(a,c){b.push({value:c.value,text:c.text})}),b});var a=this.sel;this.sel.on("change",function(){var b=jQuery(a).find("option");jQuery(a.data().chosen.results_data).each(function(){jQuery(b[this.options_index]).attr("selected",this.selected)})}),this.watchNew()},watchNew:function(){var a,b="#fabrik#",c=jQuery(this.getContainer()),d=this.options.element,e=c.find(".search-field input");e.keydown(function(e){if(this.value.length>=3&&(13===e.which||188===e.which)){var f=c.find("li.active-result.highlighted").first();if(13===e.which&&""!==f.text()){var g=b+f.text();c.find("option").filter(function(){return jQuery(this).val()===g}).remove(),a=c.find("option").filter(function(){return jQuery(this).html()===f.text()}),a.attr("selected","selected")}else{var h=this.value;if(a=c.find("option").filter(function(){return jQuery(this).html()===h}),""!==a.text())a.attr("selected","selected");else{var i=jQuery("<option>");i.text(this.value).val(b+this.value),i.attr("selected","selected"),c.find("select").append(i)}}this.value="",jQuery("#"+d).trigger("liszt:updated"),e.preventDefault()}})},cloned:function(a){Fabrik.trigger("fabrik.tags.update",this),FbTags.Super.prototype.cloned(this,a),this.setUp()}});