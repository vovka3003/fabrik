/*! Fabrik */
var FbSlider=my.Class(FbElement,{constructor:function(a,b){FbSlider.Super.call(this,a,b),this.plugin="slider",this.makeSlider()},makeSlider:function(){var a=!1;("null"===typeOf(this.options.value)||""===this.options.value)&&(this.options.value="",a=!0),this.options.value=""===this.options.value?"":this.options.value.toInt();var b=this.options.value;if(this.options.editable===!0){if("null"===typeOf(this.element))return void fconsole("no element found for slider");this.output=this.element.find(".fabrikinput"),this.output2=this.element.find(".slider_output"),this.output.value=this.options.value,this.output2.text(this.options.value),this.mySlide=new Slider(this.element.find(".fabrikslider-line"),this.element.find(".knob"),{onChange:function(a){this.output.value=a,this.options.value=a,this.output2.text(a),this.output.trigger("blur"),this.callChange()}.bind(this),onComplete:function(){this.output.trigger("blur"),this.element.trigger("change")}.bind(this),steps:this.options.steps}).set(b),a&&(this.output.value="",this.output2.text(""),this.options.value=""),this.watchClear()}},watchClear:function(){var a=this;this.element.on("click",".clearslider",function(b){b.preventDefault(),a.mySlide.set(0),a.output.val(""),a.output.trigger("blur"),a.output2.text("")})},getValue:function(){return this.options.value},callChange:function(){"function"===typeOf(this.changejs)?this.changejs.delay(0):eval(this.changejs)},addNewEvent:function(a,b){return"load"===a?(this.loadEvents.push(b),void this.runLoadEvent(b)):void("change"===a&&(this.changejs=b))},cloned:function(a){delete this.mySlide,this.makeSlider(),FbSlider.Super.prototype.cloned(this,a)}});