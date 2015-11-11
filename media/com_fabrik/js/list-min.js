/*! Fabrik */
var FbList=my.Class({options:{admin:!1,filterMethod:"onchange",ajax:!1,ajax_links:!1,links:{edit:"",detail:"",add:""},form:"listform_"+this.id,hightLight:"#ccffff",primaryKey:"",headings:[],labels:{},Itemid:0,formid:0,canEdit:!0,canView:!0,page:"index.php",actionMethod:"floating",formels:[],data:[],rowtemplate:"",floatPos:"left",csvChoose:!1,csvOpts:{},popup_width:300,popup_height:300,popup_offset_x:null,popup_offset_y:null,groupByOpts:{},listRef:"",fabrik_show_in_list:[],singleOrdering:!1,tmpl:"",groupedBy:"",toggleCols:!1},constructor:function(a,b){this.id=a,this.options=$.extend(this.options,b),this.getForm(),this.result=!0,this.plugins=[],this.list=$("#list_"+this.options.listRef),this.options.toggleCols&&(this.toggleCols=new FbListToggle(this.form)),this.groupToggle=new FbGroupedToggler(this.form,this.options.groupByOpts),new FbListKeys(this),this.list&&("table"===this.list.get("tag")&&(this.tbody=this.list.find("tbody")),"null"===typeOf(this.tbody)&&(this.tbody=this.list),window.ie&&(this.options.rowtemplate=this.list.find(".fabrik_row"))),this.watchAll(!1),Fabrik.on("fabrik.form.submitted",function(){this.updateRows()}.bind(this)),window.history&&history.pushState&&history.state&&this.options.ajax&&this._updateRows(history.state)},setRowTemplate:function(){if("string"===typeOf(this.options.rowtemplate)){var a=this.list.find(".fabrik_row");window.ie&&"null"!==typeOf(a)&&(this.options.rowtemplate=a)}},rowClicks:function(){this.list.on("click:relay(.fabrik_row)",function(a,b){var c=Array.from(b.id.split("_")),d={};d.rowid=c.getLast();var e={errors:{},data:d,rowid:c.getLast(),listid:this.id};Fabrik.trigger("fabrik.list.row.selected",e)}.bind(this))},watchAll:function(a){a=a?a:!1,this.watchNav(),this.storeCurrentValue(),a||(this.watchRows(),this.watchFilters()),this.watchOrder(),this.watchEmpty(),a||(this.watchGroupByMenu(),this.watchButtons())},watchGroupByMenu:function(){this.options.ajax&&this.form.on("click:relay(*[data-groupBy])",function(a,b){this.options.groupedBy=b.get("data-groupBy"),a.rightClick||(a.preventDefault(),this.updateRows())}.bind(this))},watchButtons:function(){var a=this;this.exportWindowOpts={id:"exportcsv",title:"Export CSV",loadMethod:"html",minimizable:!1,width:360,height:120,content:"",bootstrap:!0},"csv"===this.options.view?this.openCSVWindow():this.form.find(".csvExportButton")&&this.form.find(".csvExportButton").each(function(b){b.hasClass("custom")===!1&&b.on("click",function(b){a.openCSVWindow(),b.stopPropagation()})})},openCSVWindow:function(){var a=this.makeCSVExportForm();this.exportWindowOpts.content=a,this.exportWindowOpts.onContentLoaded=function(){this.fitToContent(!1)},this.csvWindow=Fabrik.getWindow(this.exportWindowOpts)},makeCSVExportForm:function(){return this.options.csvChoose?this._csvExportForm():this._csvAutoStart()},_csvAutoStart:function(){var a=$("<div />").attr({id:"csvmsg"}).html(Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>');return this.csvopts=this.options.csvOpts,this.csvfields=this.options.csvFields,this.triggerCSVExport(-1),a},_csvExportForm:function(){var a=Joomla.JText._("JYES"),b='<input type="radio" value="1" name="incfilters" checked="checked" />'+a,c='<input type="radio" value="1" name="incraw" checked="checked" />'+a,d='<input type="radio" value="1" name="inccalcs" checked="checked" />'+a,e='<input type="radio" value="1" name="inctabledata" checked="checked" />'+a,f='<input type="radio" value="1" name="excel" checked="checked" />Excel CSV',g="index.php?option=com_fabrik&view=list&listid="+this.id+"&format=csv&Itemid="+this.options.Itemid,h={styles:{width:"200px","float":"left"}},i=Joomla.JText._("JNO"),j=$("<form />").attr({action:g,method:"post"}).adopt([$("<div />").attr(h).text(Joomla.JText._("COM_FABRIK_FILE_TYPE")),$("<label />").html(f),$("<label />").adopt([$("<input />").attr({type:"radio",name:"excel",value:"0"}),$("<span />").text("CSV")]),$("<br />"),$("<br />"),$("<div />").attr(h).text(Joomla.JText._("COM_FABRIK_INCLUDE_FILTERS")),$("<label />").html(b),$("<label />").adopt([$("<input />").attr({type:"radio",name:"incfilters",value:"0"}),$("<span />").text(i)]),$("<br />"),$("<div />").attr(h).text(Joomla.JText._("COM_FABRIK_INCLUDE_DATA")),$("<label />").html(e),$("<label />").adopt([$("<input />").attr({type:"radio",name:"inctabledata",value:"0"}),$("<span />").text(i)]),$("<br />"),$("<div />").attr(h).text(Joomla.JText._("COM_FABRIK_INCLUDE_RAW_DATA")),$("<label />").html(c),$("<label />").adopt([$("<input />").attr({type:"radio",name:"incraw",value:"0"}),$("<span />").text(i)]),$("<br />"),$("<div />").attr(h).text(Joomla.JText._("COM_FABRIK_INCLUDE_CALCULATIONS")),$("<label />").html(d),$("<label />").adopt([$("<input />").attr({type:"radio",name:"inccalcs",value:"0"}),$("<span />").text(i)])]);$("<h4 />").text(Joomla.JText._("COM_FABRIK_SELECT_COLUMNS_TO_EXPORT")).inject(j);var k="",l=0;return jQuery.each(this.options.labels,function(b,c){if("fabrik_"!==b.substr(0,7)&&"____form_heading"!==b){var d=b.split("___")[0];d!==k&&(k=d,$("<h5 />").text(k).inject(j));var e='<input type="radio" value="1" name="fields['+b+']" checked="checked" />'+a;c=c.replace(/<\/?[^>]+(>|$)/g,"");var f=$("<div />").attr(h).text(c);f.inject(j),$("<label />").html(e).inject(j),$("<label />").adopt([$("<input />").attr({type:"radio",name:"fields["+b+"]",value:"0"}),$("<span />").text(Joomla.JText._("JNO"))]).inject(j),$("<br />").inject(j)}l++}.bind(this)),this.options.formels.length>0&&($("<h5 />").text(Joomla.JText._("COM_FABRIK_FORM_FIELDS")).inject(j),this.options.formels.each(function(b){var c='<input type="radio" value="1" name="fields['+b.name+']" checked="checked" />'+a,d=$("<div />").attr(h).text(b.label);d.inject(j),$("<label />").html(c).inject(j),$("<label />").adopt([$("<input />").attr({type:"radio",name:"fields["+b.name+"]",value:"0"}),$("<span />").text(Joomla.JText._("JNO"))]).inject(j),$("<br />").inject(j)}.bind(this))),$("<div />").css({"text-align":"right"}).adopt($("<input />").attr({type:"button",name:"submit",value:Joomla.JText._("COM_FABRIK_EXPORT"),"class":"button exportCSVButton",events:{click:function(a){a.stopPropagation(),a.target.disabled=!0;var b=$("#csvmsg");0===b.length&&(b=$("<div />").attr({id:"csvmsg"}).inject(a.target,"before")),b.html(Joomla.JText._("COM_FABRIK_LOADING")+' <br /><span id="csvcount">0</span> / <span id="csvtotal"></span> '+Joomla.JText._("COM_FABRIK_RECORDS")+".<br/>"+Joomla.JText._("COM_FABRIK_SAVING_TO")+'<span id="csvfile"></span>'),this.triggerCSVExport(0)}.bind(this)}})).inject(j),$("<input />").attr({type:"hidden",name:"view",value:"table"}).inject(j),$("<input />").attr({type:"hidden",name:"option",value:"com_fabrik"}).inject(j),$("<input />").attr({type:"hidden",name:"listid",value:this.id}).inject(j),$("<input />").attr({type:"hidden",name:"format",value:"csv"}).inject(j),$("<input />").attr({type:"hidden",name:"c",value:"table"}).inject(j),j},triggerCSVExport:function(a,b,c){var d=this;0!==a?-1===a?(a=0,b=this.csvopts,b.fields=this.csvfields):(b=this.csvopts,c=this.csvfields):(b||(b={},["incfilters","inctabledata","incraw","inccalcs","excel"].each(function(a){var c=$("#exportcsv").find("input[name="+a+"]");c.length>0&&(b[a]=c.filter(function(a){return a.checked})[0].value)})),c||(c={},$("#exportcsv").find("input[name^=field]").each(function(a){if(a.checked){var b=a.name.replace("fields[","").replace("]","");c[b]=a.val()}})),b.fields=c,this.csvopts=b,this.csvfields=c),b=this.csvExportFilterOpts(b),b.start=a,b.option="com_fabrik",b.view="list",b.format="csv",b.Itemid=this.options.Itemid,b.listid=this.id,b.listref=this.options.listRef,b.download=0,b.setListRefFromRequest=1,this.options.csvOpts.custom_qs.split("&").each(function(a){var c=a.split("=");b[c[0]]=c[1]});var e=new Request.JSON({url:"?"+this.options.csvOpts.custom_qs,method:"post",data:b,onError:function(a,b){fconsole(a,b)},onComplete:function(a){if(a.err)window.alert(a.err),Fabrik.Windows.exportcsv.close();else if($("#csvcount").text(a.count),$("#csvtotal").text(a.total),$("#csvfile").text(a.file),a.count<a.total)this.triggerCSVExport(a.count);else{var b="index.php?option=com_fabrik&view=list&format=csv&listid="+d.id+"&start="+a.count+"&Itemid="+d.options.Itemid,c='<div class="alert alert-success"><h3>'+Joomla.JText._("COM_FABRIK_CSV_COMPLETE");c+='</h3><p><a class="btn btn-success" href="'+b+'"><i class="icon-download"></i> '+Joomla.JText._("COM_FABRIK_CSV_DOWNLOAD_HERE")+"</a></p></div>",$("#csvmsg").html(c),d.csvWindow.fitToContent(!1),$("input.exportCSVButton").removeProperty("disabled")}}});e.send()},csvExportFilterOpts:function(a){var b,c,d,e=0,f=0,g=["value","condition","join","key","search_type","match","full_words_only","eval","grouped_to_previous","hidden","elementid"];return this.getFilters().each(function(b){c=b.name.split("["),c.length>3&&(d=parseInt(c[3].replace("]",""),10),e=d>e?d:e,"checkbox"===b.get("type")||"radio"===b.get("type")?b.checked&&(a[b.name]=b.val()):a[b.name]=b.val())}.bind(this)),e++,Object.each(this.options.advancedFilters,function(c,d){if(g.contains(d))for(f=0,b=0;b<c.length;b++)f=b+e,aName="fabrik___filter[list_"+this.options.listRef+"]["+d+"]["+f+"]",a[aName]=c[b]}.bind(this)),a},addPlugins:function(a){a.each(function(a){a.list=this}.bind(this)),this.plugins=a},firePlugin:function(a){var b=Array.prototype.slice.call(arguments),c=this;return b=b.slice(1,b.length),this.plugins.each(function(){Fabrik.trigger(a,[c,b])}),this.result===!1?!1:!0},watchEmpty:function(){var a=$("#"+this.options.form).find(".doempty"),b=this;a.on("click",function(a){a.stopPropagation(),window.confirm(Joomla.JText._("COM_FABRIK_CONFIRM_DROP"))&&b.submit("list.doempty")})},watchOrder:function(){var a=!1,b=$("#"+this.options.form).find(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc");b.removeEvents("click"),b.each(function(b){b.on("click",function(c){var d="ordernone.png",e="",f="",g="",h="";b=$(c.target);var i=$(this).closest(".fabrik_ordercell");switch("A"!==$(this).prop("tagName")&&(b=i.closest("a")),b.className){case"fabrikorder-asc":f="fabrikorder-desc",g=b.get("data-sort-desc-icon"),h=b.get("data-sort-asc-icon"),e="desc",d="orderdesc.png";break;case"fabrikorder-desc":f="fabrikorder",g=b.get("data-sort-icon"),h=b.get("data-sort-desc-icon"),e="-",d="ordernone.png";break;case"fabrikorder":f="fabrikorder-asc",g=b.get("data-sort-asc-icon"),h=b.get("data-sort-icon"),e="asc",d="orderasc.png"}if(i.className.split(" ").each(function(b){b.contains("_order")&&(a=b.replace("_order","").replace(/^\s+/g,"").replace(/\s+$/g,""))}),!a)return void fconsole("woops didnt find the element id, cant order");b.className=f;var j=(b.find("img"),b.firstElementChild);this.options.singleOrdering&&$("#"+this.options.form).find(".fabrikorder, .fabrikorder-asc, .fabrikorder-desc").each(function(a){var b=a.firstElementChild;switch(a.className){case"fabrikorder-asc":b.removeClass(a.get("data-sort-asc-icon")),b.addClass(a.get("data-sort-icon"));break;case"fabrikorder-desc":b.removeClass(a.get("data-sort-desc-icon")),b.addClass(a.get("data-sort-icon"));break;case"fabrikorder":}}),j.removeClass(h),j.addClass(g),this.fabrikNavOrder(a,e),c.stopPropagation()}.bind(this))}.bind(this))},getFilters:function(){return $("#"+this.options.form).find(".fabrik_filter")},storeCurrentValue:function(){this.getFilters().each(function(a){"submitform"!==this.options.filterMethod&&a.store("initialvalue",a.val())}.bind(this))},watchFilters:function(){var a="",b=this,c=$("#"+this.options.form).find(".fabrik_filter_submit");this.getFilters().each(function(d){a="select"===d.get("tag")?"change":"blur","submitform"!==b.options.filterMethod?(d.removeEvent(a),d.on(a,function(a){a.stopPropagation(),$(a.target).data("initialvalue")!==$(a.target).val()&&b.doFilter()})):d.on(a,function(){c.highlight("#ffaa00")})}),c&&(c.removeEvents(),c.on("click",function(a){a.stopPropagation(),this.doFilter()}.bind(this))),this.getFilters().on("keydown",function(a){13===a.code&&(a.stopPropagation(),this.doFilter())}.bind(this))},doFilter:function(){var a=Fabrik.trigger("list.filter",[this]).eventResults;"null"===typeOf(a)&&this.submit("list.filter"),0!==a.length&&a.contains(!1)||this.submit("list.filter")},setActive:function(a){this.list.find(".fabrik_row").each(function(a){a.removeClass("activeRow")}),a.addClass("activeRow")},getActiveRow:function(a){var b=$(a.target).closest(".fabrik_row");return b||(b=Fabrik.activeRow),b},watchRows:function(){this.list&&this.rowClicks()},getForm:function(){return this.form||(this.form=$("#"+this.options.form)),this.form},uncheckAll:function(){this.form.find("input[name^=ids]").each(function(a){a.checked=""})},submit:function(a){this.getForm();var b=this.options.ajax,c=this;if("list.doPlugin.noAJAX"===a&&(a="list.doPlugin",b=!1),"list.delete"===a){var d=!1,e=0;if(this.form.find("input[name^=ids]").each(function(a){a.checked&&(e++,d=!0)}),!d)return alert(Joomla.JText._("COM_FABRIK_SELECT_ROWS_FOR_DELETION")),Fabrik.loader.stop("listform_"+this.options.listRef),!1;var f=1===e?Joomla.JText._("COM_FABRIK_CONFIRM_DELETE_1"):Joomla.JText._("COM_FABRIK_CONFIRM_DELETE").replace("%s",e);if(!confirm(f))return Fabrik.loader.stop("listform_"+this.options.listRef),this.uncheckAll(),!1}if("list.filter"===a?(Fabrik["filter_listform_"+this.options.listRef].onSubmit(),this.form.task.value=a,this.form["limitstart"+this.id]&&(this.form.find("#limitstart"+this.id).value=0)):""!==a&&(this.form.task.value=a),b){Fabrik.loader.start("listform_"+this.options.listRef),this.form.find("input[name=option]").value="com_fabrik",this.form.find("input[name=view]").value="list",this.form.find("input[name=format]").value="raw";var g=this.form.toQueryString();if("list.filter"===a&&this.advancedSearch!==!1){var h=document.find("form.advancedSeach_"+this.options.listRef);"null"!==typeOf(h)&&(g+="&"+h.toQueryString(),g+="&replacefilters=1")}for(var i=0;i<this.options.fabrik_show_in_list.length;i++)g+="&fabrik_show_in_list[]="+this.options.fabrik_show_in_list[i];g+="&tmpl="+this.options.tmpl,this.request=$.getJSON({url:this.form.get("action"),data:g}).done(function(a){c._updateRows(a),Fabrik.loader.stop("listform_"+c.options.listRef),Fabrik["filter_listform_"+c.options.listRef].onUpdateData(),Fabrik.trigger("fabrik.list.submit.ajax.complete",[c,a]),a.msg&&window.alert(a.msg)}),window.history&&window.history.pushState&&history.pushState(g,"fabrik.list.submit"),Fabrik.trigger("fabrik.list.submit",[a,this.form.toQueryString().toObject()])}else this.form.submit();return!1},fabrikNav:function(a){return this.options.limitStart=a,this.form.find("#limitstart"+this.id).value=a,Fabrik.trigger("fabrik.list.navigate",[this,a]),this.result?(this.submit("list.view"),!1):(this.result=!0,!1)},getRowIds:function(){var a=[];return jQuery.each(this.options.data,function(b,c){c.each(function(b){a.push(b.data.__pk_val)})}),a},getRow:function(a){var b={};return jQuery.each(this.options.data,function(c,d){for(var e=0;e<d.length;e++){var f=d[e];f&&f.data.__pk_val===a&&(b=f.data)}}),b},fabrikNavOrder:function(a,b){return this.form.orderby.value=a,this.form.orderdir.value=b,Fabrik.trigger("fabrik.list.order",[this,a,b]),this.result?void this.submit("list.order"):(this.result=!0,!1)},removeRows:function(a){var b,c=this;for(b=0;b<a.length;b++){var d=$("#list_"+this.id+"_row_"+a[b]),e=new Fx.Morph(d,{duration:1e3});e.start({backgroundColor:this.options.hightLight}).chain(function(){this.start({opacity:0})}).chain(function(){d.dispose(),c.checkEmpty()})}},editRow:function(){},clearRows:function(){this.list.find(".fabrik_row").each(function(a){a.dispose()})},updateRows:function(){var a={option:"com_fabrik",view:"list",task:"list.view",format:"raw",listid:this.id,group_by:this.options.groupedBy,listref:this.options.listRef},b="";a["limit"+this.id]=this.options.limitLength,new Request({url:b,data:a,evalScripts:!1,onSuccess:function(a){a=a.stripScripts(),a=JSON.decode(a),this._updateRows(a)}.bind(this),onError:function(a,b){fconsole(a,b)},onFailure:function(a){fconsole(a)}}).send()},_updateRows:function(a){var b,c,d,e,f;if("object"===typeOf(a)){if(window.history&&window.history.pushState&&history.pushState(a,"fabrik.list.rows"),a.id===this.id&&"list"===a.model){var g=$("#"+this.options.form).find(".fabrik___heading").getLast(),h=new Hash(a.headings);h.each(function(a,b){b="."+b;try{"null"!==typeOf(g.find(b))&&g.find(b).find("span").html(a)}catch(c){fconsole(c)}}),this.setRowTemplate(),this.clearRows();var i=0,j=0;c=[],this.options.data=a.data,a.calculations&&this.updateCals(a.calculations),this.form.find(".fabrikNav").html(a.htmlnav);var k=a.data,l=0;jQuery.each(k,function(a,c){var g,h;if(b=this.options.isGrouped?this.list.find(".fabrik_groupdata")[l]:this.tbody,this.options.isGrouped&&b&&(d=b.getPrevious(),d.find(".groupTitle").html(c[0].groupHeading)),"null"!==typeOf(b))for(l++,e=0;e<c.length;e++){"string"==typeof this.options.rowtemplate?(g="<tr"===this.options.rowtemplate.trim().slice(0,3)?"<table />":"<div />",h=$(g),h.html(this.options.rowtemplate)):(g="tr"===this.options.rowtemplate.get("tag")?"<table />":"<div />",h=$(g),h.adopt(this.options.rowtemplate.clone()));var k=c[e];if(jQuery.each(k.data,function(a,b){var c="."+a,d=h.find(c);"A"!==d.prop("tagName")&&d.html(b),j++}),h.find(".fabrik_row").id=k.id,"string"==typeof this.options.rowtemplate){var m=h.find(".fabrik_row").clone();m.prop("id",k.id);var n=k["class"].split(" ");for(f=0;f<n.length;f++)m.addClass(n[f]);m.inject(b)}else{var o=h.find(".fabrik_row");o.inject(b),h.empty()}i++}}.bind(this));var m=this.list.find("tbody");m.css("display",""),m.each(function(a){if(!a.hasClass("fabrik_groupdata")){var b=a.getNext();0===b.find(".fabrik_row").length&&(a.hide(),b.hide())}});var n=this.list.closest(".fabrikDataContainer"),o=this.list.closest(".fabrikForm").find(".emptyDataMessage");0===j?(o.css("display",""),"none"===o.parent().css("display")&&o.parent().css("display",""),o.find(".emptyDataMessage").css("display","")):(n.css("display",""),o.css("display","none")),this.form.find(".fabrikNav").html(a.htmlnav),this.watchAll(!0),Fabrik.trigger("fabrik.list.updaterows"),Fabrik.trigger("fabrik.list.update",[this,a])}this.stripe(),this.mediaScan(),Fabrik.loader.stop("listform_"+this.options.listRef)}},mediaScan:function(){"undefined"!=typeof Slimbox&&Slimbox.scanPage(),"undefined"!=typeof Lightbox&&Lightbox.init(),"undefined"!=typeof Mediabox&&Mediabox.scanPage()},addRow:function(a){var b=$("<tr />").addClass("oddRow1");for(var c in a)if(-1!==this.options.headings.indexOf(c)){var d=$("<td />").text(a[c]);b.appendChild(d)}b.inject(this.tbody)},addRows:function(a){var b,c;for(b=0;b<a.length;b++)for(c=0;c<a[b].length;c++)this.addRow(a[b][c]);this.stripe()},stripe:function(){var a,b=this.list.find(".fabrik_row");for(a=0;a<b.length;a++)if(!b[a].hasClass("fabrik___header")){var c="oddRow"+a%2;b[a].addClass(c)}},checkEmpty:function(){var a=this.list.find("tr");2===a.length&&this.addRow({label:Joomla.JText._("COM_FABRIK_NO_RECORDS")})},watchCheckAll:function(){var a,b=this.form.find("input[name=checkAll]"),c=this;"null"!==typeOf(b)&&b.on("click",function(b){var c=this.list.closest(".fabrikList").length>0?this.list.closest(".fabrikList"):this.list,d=c.find("input[name^=ids]");a=b.target.checked?"checked":"";for(var e=0;e<d.length;e++)d[e].checked=a,this.toggleJoinKeysChx(d[e])}.bind(this)),this.form.find("input[name^=ids]").each(function(){var a=$(this);a.on("change",function(){c.toggleJoinKeysChx(a)})})},toggleJoinKeysChx:function(a){a.parent().find("input[class=fabrik_joinedkey]").each(function(){this.checked=a.checked})},watchNav:function(){var a=null,b=null,c=this;if(null!==this.form&&(a=this.form.find("select[name*=limit]"),b=this.form.find(".addRecord")),null!==a&&a.on("change",function(){Fabrik.trigger("fabrik.list.limit",[c]);return c.result===!1?(c.result=!0,!1):void c.doFilter()}),null!==b&&this.options.ajax_links){b.removeEvents();var d=""===this.options.links.add||b.href.contains(Fabrik.liveSite)?"xhr":"iframe",e=b.href;e+=e.contains("?")?"&":"?",e+="tmpl=component&ajax=1",b.on("click",function(a){a.stopPropagation();var b={id:"add."+this.id,title:this.options.popup_add_label,loadMethod:d,contentURL:e,width:this.options.popup_width,height:this.options.popup_height};"null"!==typeOf(this.options.popup_offset_x)&&(b.offset_x=this.options.popup_offset_x),"null"!==typeOf(this.options.popup_offset_y)&&(b.offset_y=this.options.popup_offset_y),Fabrik.getWindow(b)}.bind(this))}$("#fabrik__swaptable").on("change",function(){window.location="index.php?option=com_fabrik&task=list.view&cid="+$(this).val()});var f=this.form.find(".pagination .pagenav");0===f.length&&(f=this.form.find(".pagination a")),f.each(function(a){a.on("click",function(b){if(b.stopPropagation(),"A"===a.prop("tagName")){var d=a.href.toObject();c.fabrikNav(d["limitstart"+this.id])}})}),this.watchCheckAll()},updateCals:function(a){var b=["sums","avgs","count","medians"];this.form.find(".fabrik_calculations").each(function(c){b.each(function(b){jQuery.each(a[b],function(a,b){var d=c.find("."+a);"null"!==typeOf(d)&&d.html(b)})})})}}),FbListKeys=my.Class({constructor:function(a){window.on("keyup",function(b){if(b.alt)switch(b.key){case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_ADD"):var c=a.form.find(".addRecord");a.options.ajax&&c.trigger("click"),c.find("a").length>0?a.options.ajax?c.find("a").trigger("click"):document.location=c.find("a").prop("href"):a.options.ajax||(document.location=c.get("href"));break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_EDIT"):fconsole("edit");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_DELETE"):fconsole("delete");break;case Joomla.JText._("COM_FABRIK_LIST_SHORTCUTS_FILTER"):fconsole("filter")}}.bind(this))}}),FbGroupedToggler=my.Class({options:{collapseOthers:!1,startCollapsed:!1,bootstrap:!1},constructor:function(a,b){var c,d,e,f;"null"!==typeOf(a)&&(this.options=$.extend(this.options,b),this.container=a,this.toggleState="shown",this.options.startCollapsed&&this.options.isGrouped&&this.collapse(),a.on("click:relay(.fabrik_groupheading a.toggle)",function(a){return a.rightClick?void 0:(a.stopPropagation(),a.preventDefault(),this.options.collapseOthers&&this.collapse(),d=$(a.target).closest(".fabrik_groupheading"),e=d.find(this.options.bootstrap?'*[data-role="toggle"]':"img"),f=e.retrieve("showgroup",!0),c=d.getNext()&&d.getNext().hasClass("fabrik_groupdata")?d.getNext():d.parent().getNext(),f?c.hide():c.show(),this.setIcon(e,f),f=f?!1:!0,e.store("showgroup",f),!1)}.bind(this)))},setIcon:function(a,b){if(this.options.bootstrap){var c=a.get("data-expand-icon"),d=a.get("data-collapse-icon");b?(a.removeClass(c),a.addClass(d)):(a.addClass(c),a.removeClass(d))}else a.src=b?a.src.replace("orderasc","orderneutral"):a.src.replace("orderneutral","orderasc")},collapse:function(){this.container.find(".fabrik_groupdata").hide();var a=this.options.bootstrap?"i":"img",b=this.container.find(".fabrik_groupheading a "+a);0===b.length&&(b=this.container.find(".fabrik_groupheading "+a)),b.each(function(a){a.store("showgroup",!1),this.setIcon(a,!0)}.bind(this))},expand:function(){this.container.find(".fabrik_groupdata").show();var a=this.container.find(".fabrik_groupheading a img");0===a.length&&(a=this.container.find(".fabrik_groupheading img")),a.each(function(a){a.store("showgroup",!0),this.setIcon(a,!1)}.bind(this))},toggle:function(){"shown"===this.toggleState?this.collapse():this.expand(),this.toggleState="shown"===this.toggleState?"hidden":"shown"}}),FbListActions=my.Class({options:{selector:"ul.fabrik_action, .btn-group.fabrik_action",method:"floating",floatPos:"bottom"},constructor:function(a,b){this.options=$.extend(this.options,b),this.list=a,this.actions=[],this.setUpSubMenus(),Fabrik.on("fabrik.list.update",function(){this.observe()}.bind(this)),this.observe()},observe:function(){"floating"===this.options.method?this.setUpFloating():this.setUpDefault()},setUpSubMenus:function(){this.list.form&&(this.actions=this.list.form.find(this.options.selector),this.actions.each(function(a){if(a.find("ul")){var b=a.find("ul"),c=$("<div />").adopt(b.clone()),d=b.getPrevious();d.find(".fabrikTip")&&(d=d.find(".fabrikTip"));{var e=Fabrik.tips?Fabrik.tips.options:{},f=Object.merge(Object.clone(e),{showOn:"click",hideOn:"click",position:"bottom",content:c});new FloatingTips(d,f)}b.dispose()}}))},setUpDefault:function(){this.actions=this.list.form.find(this.options.selector),this.actions.each(function(a){if(!a.parent().hasClass("fabrik_buttons")){a.fade(.6);var b=a.closest(a.closest(".fabrik_row").length>0?".fabrik_row":".fabrik___heading");b&&b.ons({mouseenter:function(){a.fade(.99)},mouseleave:function(){a.fade(.6)}})}})},setUpFloating:function(){var a=!1;this.list.form.find(this.options.selector).each(function(b){if(b.closest(".fabrik_row")&&(i=b.closest(".fabrik_row").find("input[type=checkbox]"))){a=!0;{var c=function(){var a=b.parent();return a.store("activeRow",b.closest(".fabrik_row")),a}.bind(this.list),d={position:this.options.floatPos,showOn:"change",hideOn:"click",content:c,heading:"Edit: ",hideFn:function(a){return!a.target.checked},showFn:function(a,c){return Fabrik.activeRow=b.parent().retrieve("activeRow"),c.store("list",this.list),a.target.checked}.bind(this.list)},e=Fabrik.tips?Object.merge(Object.clone(Fabrik.tips.options),d):d;new FloatingTips(i,e)}}}.bind(this)),this.list.form.find(".fabrik_select input[type=checkbox]").on("click",function(a){Fabrik.activeRow=a.target.closest(".fabrik_row")});var b=this.list.form.find("input[name=checkAll]");"null"!==typeOf(b)&&b.store("listid",this.list.id);{var c=function(a){var b=a.closest(".fabrik___heading");return"null"!==typeOf(b)?b.find(this.options.selector):""}.bind(this),d=Fabrik.tips?Object.clone(Fabrik.tips.options):{},e=Object.merge(d,{position:this.options.floatPos,html:!0,showOn:"click",hideOn:"click",content:c,heading:"Edit all: ",hideFn:function(a){return!a.target.checked},showFn:function(a,b){return b.retrieve("tip").click.store("list",this.list),a.target.checked}.bind(this.list)});new FloatingTips(b,e)}if(this.list.form.find(".fabrik_actions")&&a&&this.list.form.find(".fabrik_actions").hide(),this.list.form.find(".fabrik_calculation")){var f=this.list.form.find(".fabrik_calculation").getLast();"null"!==typeOf(f)&&f.hide()}}});