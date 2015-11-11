/*! Fabrik */
var FbDateTime=my.Class(FbElement,{options:{dateTimeFormat:"",watchElement:"",calendarSetup:{eventName:"click",ifFormat:"%Y/%m/%d",daFormat:"%Y/%m/%d",singleClick:!0,align:"Tl",range:[1900,2999],showsTime:!1,timeFormat:"24",electric:!0,step:2,cache:!1,showOthers:!1,advanced:!1,allowedDates:[],dateAllowFunc:""}},constructor:function(a,b){return FbDateTime.Super.call(this,a,b)?(this.hour="0",this.plugin="fabrikdate",this.minute="00",this.startElement=a,this.setUpDone=!1,this.convertAllowedDates(),void this.setUp()):!1},convertAllowedDates:function(){for(var a=0;a<this.options.allowedDates.length;a++)this.options.allowedDates[a]=new Date(this.options.allowedDates[a])},setUp:function(){var a=this;if(this.options.editable){this.watchButtons(),this.options.typing===!1?this.disableTyping():this.getDateField().on("blur",function(){var b=this.getDateField().val();if(""!==b){var c;c=a.options.advanced?Date.parseExact(b,Date.normalizeFormat(a.options.calendarSetup.ifFormat)):Date.parseDate(b,a.options.calendarSetup.ifFormat),a.setTimeFromField(c),a.update(c)}else a.options.value=""}),this.makeCalendar();var b=function(){this.cal.hide()};b.delay(100,this),this.getCalendarImg().on("click",function(b){b.stopPropagation(),a.cal.params.position?a.cal.showAt(a.cal.params.position[0],params.position[1]):a.cal.showAtElement(a.cal.params.button||a.cal.params.displayArea||a.cal.params.inputField,a.cal.params.align),a.cal._init(a.cal.firstDayOfWeek,a.cal.date),a.cal.show()}),Fabrik.addEvent("fabrik.form.submit.failed",function(){a.afterAjaxValidation()})}},attachedToForm:function(){FbDateTime.Super.prototype.attachedToForm(this),this.watchAjaxTrigger()},watchAjaxTrigger:function(){if(""!==this.options.watchElement){var a=this.form.elements[this.options.watchElement],b=this;a&&a.on("change",function(){var c={option:"com_fabrik",format:"raw",task:"plugin.pluginAjax",plugin:"date",method:"ajax_getAllowedDates",element_id:b.options.id,v:a.get("value"),formid:b.form.id};new $.getJSON({url:"",method:"post",data:c}).success(function(a){b.options.allowedDates=a,b.convertAllowedDates()})})}},getCalendarImg:function(){return this.element.find(".calendarbutton")},dateSelect:function(date){var allowed=this.options.allowedDates,i,fn=this.options.calendarSetup.dateAllowFunc,matched=!1;if(allowed.length>0){for(i=0;i<allowed.length;i++)allowed[i].format("%Y%m%d")===date.format("%Y%m%d")&&(matched=!0);if(!matched)return!0}""!==fn&&eval(fn)},calSelect:function(a){if(a.dateClicked&&!this.dateSelect(a.date)){var b=this.setTimeFromField(a.date);this.update(b.format("db")),this.getDateField().trigger("change"),this.timeButton&&this.getTimeField().trigger("change"),this.cal.callCloseHandler(),$(window).trigger("fabrik.date.select",this),Fabrik.trigger("fabrik.date.select",this)}},calClose:function(){this.cal.hide(),$(window).trigger("fabrik.date.close",this),this.options.validations&&this.form.doElementValidation(this.options.element)},onsubmit:function(a){var b=this.getValue();""!==b&&this.options.editable&&this.getDateField().val(b),FbDateTime.Super.prototype.onsubmit(this,a)},afterAjaxValidation:function(){this.update(this.getValue(),[])},makeCalendar:function(){var a,b=this.options.calendarSetup,c=["displayArea","button"];if(this.cal)return void this.cal.show();for(this.addEventToCalOpts(),a=0;a<c.length;a++)"string"==typeof b[c[a]]&&(b[c[a]]=document.getElementById(b[c[a]]));b.inputField=this.getDateField();var d=b.inputField||b.displayArea,e=b.inputField?b.ifFormat:b.daFormat;if(this.cal=null,d.length>0&&(this.options.advanced?""===d.val()?b.date="":(b.date=Date.parseExact(d.val()||d.html(),Date.normalizeFormat(e)),null===b.date&&(b.date=this.options)):b.date=Date.parseDate(d.val()||d.html(),e)),this.cal=new Calendar(b.firstDay,b.date,b.onSelect,b.onClose),this.cal.setDateStatusHandler(b.dateStatusFunc),this.cal.setDateToolTipHandler(b.dateTooltipFunc),this.cal.showsTime=b.showsTime,this.cal.time24="24"===b.timeFormat.toString(),this.cal.weekNumbers=b.weekNumbers,b.multiple)for(cal.multiple={},a=b.multiple.length;--a>=0;){var f=b.multiple[a],g=f.print("%Y%m%d");this.cal.multiple[g]=f}this.cal.showsOtherMonths=b.showOthers,this.cal.yearStep=b.step,void 0!==b.range&&this.cal.setRange(b.range[0],b.range[1]),this.cal.params=b,this.cal.getDateText=b.dateText,this.cal.setDateFormat(e),this.cal.create(),this.cal.refresh(),this.cal.hide()},disableTyping:function(){var a=this;return 0===this.element.length?void fconsole(this.element+": not date element container - is this a custom template with a missing $element->containerClass div/li surrounding the element?"):(this.element.prop("readonly","readonly"),void this.element.find(".fabrikinput").each(function(b){b.on("focus",function(c){a._disabledShowCalTime(b,c)}),b.on("click",function(c){a._disabledShowCalTime(b,c)})}))},_disabledShowCalTime:function(a,b){"object"==typeof b&&($(b.target).hasClass("timeField")?this.getContainer().find(".timeButton").trigger("click"):(this.options.calendarSetup.inputField=b.target.id,this.options.calendarSetup.button=this.element.prop("id")+"_img",this.cal.showAtElement(a,this.cal.params.align),void 0!==this.cal.wrapper&&this.cal.wrapper.parent().position({relativeTo:this.cal.params.inputField,position:"topLeft"})))},getValue:function(){var a;if(!this.options.editable)return this.options.value;if(this.find(),this.cal){var b=this.getDateField().val();if(""===b)return"";var c=new RegExp("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}");if(null!==b.match(c))return b;a=this.cal.date}else{if(this.dateIsEmpty(this.options.value))return"";a=new Date.parse(this.options.value)}return a=this.setTimeFromField(a),a.format("db")},dateIsEmpty:function(a){return""===a||null===a||"0000-00-00 00:00:00"===a},hasSeconds:function(){if(this.options.showtime===!0&&this.timeElement){if(this.options.dateTimeFormat.contains("%S"))return!0;if(this.options.dateTimeFormat.contains("%T"))return!0;if(this.options.dateTimeFormat.contains("s"))return!0}return!1},setTimeFromField:function(a){if("date"===$.type(a)){if(this.options.showtime===!0&&this.timeElement){var b=this.timeElement.get("value").toUpperCase(),c=b.contains("PM")?!0:!1;b=b.replace("PM","").replace("AM","");var d=b.split(":"),e=d[0]?d[0].toInt():0;c&&(e+=12);var f=d[1]?d[1].toInt():0;if(a.setHours(e),a.setMinutes(f),d[2]&&this.hasSeconds()){var g=d[2]?d[2].toInt():0;a.setSeconds(g)}else a.setSeconds(0)}return a}},watchButtons:function(){var a=this;this.options.showtime&&this.options.editable&&(this.getTimeField(),this.getTimeButton(),this.timeButton&&(this.timeButton.removeEvents("click"),this.timeButton.on("click",function(b){b.stopPropagation(),a.showTime()}),this.setUpDone||this.timeElement&&(this.dropdown=this.makeDropDown(),this.setActive(),this.dropdown.find("a.close-time").on("click",function(b){b.stopPropagation(),a.hideTime()}),this.setUpDone=!0)))},addNewEventAux:function(action,js){"change"===action?Fabrik.addEvent("fabrik.date.select",function(w){if(w.baseElementId===this.baseElementId){var e="fabrik.date.select";"function"==typeof js?js.delay(0,this,this):eval(js)}}.bind(this)):this.element.find("input").each(function(){var input=$(this);input.on(action,function(e){"object"==typeof e&&e.stopPropagation(),"function"==typeof js?js.delay(0,this,this):eval(js)})}.bind(this))},update:function(a,b){if(b=b?b:["change"],this.find(),"invalid date"===a)return void fconsole(this.element.id+": date not updated as not valid");var c;if("string"===typeOf(a)){if(c=Date.parse(a),null===c)return this._getSubElements().each(function(a){a.val("")}),this.cal&&(this.cal.date=new Date),void(this.options.editable||this.element.html(a))}else c=a;var d=this.options.calendarSetup.ifFormat;if(""!==this.options.dateTimeFormat&&this.options.showtime&&(d+=" "+this.options.dateTimeFormat),b.length>0&&this.fireEvents(b),"null"!==typeOf(a)&&a!==!1){if(!this.options.editable)return void this.element.html(c.format(d));if(this.options.hidden)return c=c.format(d),void this.getDateField().val(c);this.getTimeField(),this.hour=c.get("hours"),this.minute=c.get("minutes"),this.second=c.get("seconds"),this.stateTime(),this.cal.date=c,this.getDateField().val(c.format(this.options.calendarSetup.ifFormat))}},getDateField:function(){return this.element.find(".fabrikinput")},getTimeField:function(){return this.timeElement=this.getContainer().find(".timeField"),this.timeElement},getTimeButton:function(){return this.timeButton=this.getContainer().find(".timeButton"),this.timeButton},getAbsolutePos:function(a){var b={x:a.offsetLeft,y:a.offsetTop};if(a.offsetParent){var c=this.getAbsolutePos(a.offsetParent);b.x+=c.x,b.y+=c.y}return b},makeDropDown:function(){var a,b=null,c=this,d=$(document.createElement("div")).addClass("draggable modal-header").css({height:"20px",curor:"move",padding:"2px;"}).attr({id:this.startElement+"_handle"}).html('<i class="icon-clock"></i> '+this.options.timelabel+'<a href="#" class="close-time pull-right" ><i class="icon-cancel"></i></a>'),e=$(document.createElement("div")).addClass("fbDateTime fabrikWindow").css({"z-index":999999,display:"none",width:"300px",height:"180px"});e.appendChild(d);var f=$(document.createElement("div")).addClass("itemContentPadder");f.adopt($(document.createElement("p")).text("Hours")),f.adopt(this.hourButtons(0,12)),f.adopt(this.hourButtons(12,24)),f.adopt($(document.createElement("p")).text("Minutes"));var g=$(document.createElement("div")).addClass("btn-group").css({clear:"both",paddingTop:"5px"}),h=function(a){c.minute=c.formatMinute(a.target.innerHTML),c.stateTime(),c.setActive()},i=function(a){var b=a.target;c.minute!==this.formatMinute(b.html())&&$(this).addClass("btn-info")},j=function(a){var b=a.target;this.minute!==this.formatMinute(b.innerHTML)&&a.target.removeClass("btn-info")};for(a=0;12>a;a++)b=$(document.createElement("a")).addClass("btn fbdateTime-minute btn-mini").css({width:"10px"}),b.innerHTML=5*a,g.appendChild(b),b.on("click",h),b.on("mouseover",i),b.on("mouseout",j);f.appendChild(g),e.appendChild(f),$(document).on("click",function(){c.timeActive&&this!==c.timeButton&&this!==c.timeElement&&(this.within(c.dropdown)||c.hideTime())}),e.inject(document.body);var k=(new Drag.Move(e),d.find("a.close"));return k.on("click",function(a){a.stopPropagation(),c.hideTime()}),e},hourButtons:function(a,b){var c,d,e=this.getValue(),f=$(document.createElement("div")).addClass("btn-group"),g=this,h=function(){return function(){g.hour!==$(this).html()&&$(this).removeClass("btn-info")}},i=function(){return function(){g.hour!==$(this).html()&&$(this).addClass("btn-info")}},j=function(){return function(){g.hour=$(this).html(),g.stateTime(),g.setActive(),$(this).addClass("btn-successs").removeClass("badge-info")}};if(""===e)this.hour=0,this.minute=0;else{var k=Date.parse(e);this.hour=k.get("hours"),this.minute=k.get("minutes")}for(d=a;b>d;d++)c=$(document.createElement("a")).addClass("btn btn-mini fbdateTime-hour").css({width:"10px"}).html(d),f.appendChild(c),c.on("click",j()),c.on("mouseover",i()),c.on("mouseout",h());return f},toggleTime:function(){"none"===this.dropdown.css("display")?this.doShowTime():this.hideTime()},doShowTime:function(){this.dropdown.show(),this.timeActive=!0,Fabrik.trigger("fabrik.date.showtime",this)},hideTime:function(){this.timeActive=!1,this.dropdown.hide(),this.options.validations!==!1&&this.form.doElementValidation(this.element.id),Fabrik.trigger("fabrik.date.hidetime",this),Fabrik.trigger("fabrik.date.select",this),$(window).trigger("fabrik.date.select",this)},formatMinute:function(a){return a=a.replace(":",""),a.pad("2","0","left"),a},stateTime:function(){if(this.timeElement){var a=this.hour.toString().pad("2","0","left")+":"+this.minute.toString().pad("2","0","left");this.second&&(a+=":"+this.second.toString().pad("2","0","left"));var b=this.timeElement.val()!==a;this.timeElement.val(a),b&&this.fireEvents(["change"])}},showTime:function(){this.dropdown.position({relativeTo:this.timeElement,position:"topRight"}),this.toggleTime(),this.setActive()},setActive:function(){var a=this.dropdown.getElements(".fbdateTime-hour");a.removeClass("btn-success").removeClass("btn-info");var b=this.dropdown.getElements(".fbdateTime-minute");b.removeClass("btn-success").removeClass("btn-info"),b[this.minute/5].addClass("btn-success");var c=a[this.hour.toInt()];c.addClass("btn-success")},addEventToCalOpts:function(){this.options.calendarSetup.onSelect=function(a,b){this.calSelect(a,b)}.bind(this),this.options.calendarSetup.dateStatusFunc=function(a){return this.dateSelect(a)}.bind(this),this.options.calendarSetup.onClose=function(){this.calClose()}},cloned:function(a){this.setUpDone=!1,this.hour=0,delete this.cal;var b=this.element.find("img");b&&(b.id=this.element.id+"_cal_img");var c=this.element.find("input");c.id=this.element.id+"_cal",this.options.calendarSetup.inputField=c.id,this.options.calendarSetup.button=this.element.id+"_img",this.makeCalendar(),this.cal.hide(),this.setUp(),FbDateTime.Super.prototype.cloned(this,a)}});