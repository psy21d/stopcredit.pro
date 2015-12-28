var is_dev=true;
log=function(a){if(is_dev&&window.console){if(typeof(a)!=="string"&&typeof(a)!=="number"&&window.console.dir){window.console.dir(a)
}else{if(window.console.log){window.console.log(a)
}}}};
spaced_cli={};
spaced_cli.is_admin=0;
spaced_cli.run={};
spaced_cli.run.init=function(){this.$update_style=$('<style id="core_style"></style>');
$("head").append(this.$update_style);
this.is_touch="ontouchstart" in window;
this.old_innerWidth=$(window).width();
this.resize();
spaced_cli.block.init();
spaced_cli.stat.init();
spaced_cli.policy.init();
$(window).on("resize.core",this.resize);
setTimeout(this.resize,500)
};
spaced_cli.run.resize=function(){var a=$(window).width();
var b=$(window).height();
spaced_cli.run.old_innerWidth=a;
if($.browser.msie&&$.browser.version<9){spaced_cli.run.$update_style.replaceWith($('<style id="core_style">html body { min-height: '+b+"px; }</style>"))
}else{spaced_cli.run.$update_style.html("@media (min-height:"+b+"px) and (max-height:"+(b+1)+"px) { html body { min-height: "+b+"px; } }")
}spaced_cli.image.resize()
};
spaced_cli.policy={init:function(){$("a.policy").on("click",$.proxy(function(){this.show()
},this))
},show:function(){$(".policy_window").show().after('<div class="modal_overlay"></div>');
$(".policy_window a.close, .modal_overlay").off("click.policy").on("click.policy",$.proxy(function(){this.close()
},this));
this.height_fix();
$(window).on("resize.policy",this.height_fix)
},height_fix:function(){var a=parseInt($(".policy_window").height());
$(".policy_window .policy_data").height(a-60)
},close:function(){$(".policy_window").hide();
$(".modal_overlay").remove()
}};
$(document).ready(function(a){spaced_cli.run.init()
});
spaced_cli.image={load_list:{},resize:function(){this.update_all()
},update_all:function(b){var a;
if(b&&b.jquery){a=b.find("img[data-img-name]")
}else{if(typeof(b)==="string"){a=$(b).find("img[data-img-name]")
}else{a=$("img[data-img-name]")
}}a.each($.proxy(function(d,c){this.update($(c))
},this))
},update:function(b){var a=this.get_meta(b);
if(a.id<1){return
}if(this.load_list[a.path+a.name+a.rotate]&&this.load_list[a.path+a.name+a.rotate]>=a.width){a.width=this.load_list[a.path+a.name+a.rotate]
}else{this.load_list[a.path+a.name+a.rotate]=a.width
}var c=this.get_url(a);
if(b.attr("src")!=c){b.attr("src",c)
}},get_meta:function(b){var a=b.attr("data-file-id");
if(!a){a=b.attr("data-img-id")
}return{id:a,name:b.attr("data-img-name"),rotate:b.attr("data-rotate"),is_quadrate:b.attr("data-is-quadrate"),width:this.get_width(b.parent().width())}
},get_url:function(a){var b=a.id;
if(a.rotate&&(a.rotate==90||a.rotate==180||a.rotate==270)){b+="_r"+a.rotate
}if(a.is_quadrate=="true"){b+="_q"+a.width
}else{b+="_"+a.width
}return"/img/"+b+"/"+a.name
},get_width:function(b){if(window.devicePixelRatio&&window.devicePixelRatio>1){b=b*parseFloat(window.devicePixelRatio)
}var a;
if(b<=75){a=75
}else{if(b<=150){a=150
}else{if(b<=300){a=300
}else{if(b<=600){a=600
}else{if(b<=900){a=900
}else{if(b<=1200){a=1200
}else{if(b<=1800){a=1800
}else{if(b<=2500){a=2500
}}}}}}}}return a
}};
spaced_cli.form={list:{},create:function(a){this.list[a.id]=new spaced_cli.form.Form(a);
return this.list[a.id]
}};
spaced_cli.form.Form=function(a){this.o=a;
this.create()
};
spaced_cli.form.Form.prototype={o:{},create:function(){if(this.o.modal){this.$data=$('<div class="modal_form"></div>')
}else{this.$data=this.o.block.find(this.o.form);
this.bind()
}},show:function(){var a=this.o.block.find(this.o.form).eq(0).clone();
if(this.o.name){a.find('input[name="name"]').val(this.o.name)
}this.$data.html(a);
spaced_cli.modal.show({width:350,padding:0,data:this.$data});
spaced_cli.modal.$window.attr("data-id",this.o.block.attr("data-id")).attr("data-b-id",this.o.block.attr("data-b-id"));
this.bind()
},update:function(){if($(".modal_form").length<1){return
}var a=this.o.block.find(this.o.form).eq(0).clone();
this.$data.html(a);
spaced_cli.modal.set_data(this.$data);
this.bind()
},bind:function(){this.$form=this.$data.find("form").eq(0);
if(this.$form.length<1){return
}var a=$('<input type="hidden" name="jsform" value="'+parseInt(100*373*12+712)+'">');
this.$form.prepend(a).prepend('<input type="hidden" name="p_id" value="'+spaced_cli.p_id+'">');
this.$form.find(".form_field_submit").on("click",$.proxy(function(){this.$form.submit()
},this));
this.$form.on("submit",$.proxy(function(d){if(!this.validation()){return false
}if(typeof(FormData)==="undefined"){return true
}var c=new FormData(this.$form.get(0));
c.append("is_ajax","true");
this.$form.get(0).reset();
var b=$.ajax({url:this.$form.attr("action"),type:"POST",dataType:"json",processData:false,contentType:false,data:c,xhr:$.proxy(function(){var e=$.ajaxSettings.xhr();
if(e.upload){}return e
},this)});
b.done($.proxy(function(){this.$form.get(0).reset();
this.show_done()
},this));
b.fail(function(){});
return false
},this))
},validation:function(){var a=true;
this.$form.find("div[data-type]").each(function(g,f){var c=$(f);
var d=c.attr("data-type");
var b=(c.attr("data-is-required")=="true");
var e;
c.removeClass("is_error");
if(b){if($.inArray(d,["text","url","mail"])!=-1){e=c.find("input").val()
}else{if(d=="textarea"){e=c.find("textarea").val()
}else{if(d=="file"){e=c.find("input").get(0).files
}}}if(typeof(e)!=="undefined"&&e.length<1){c.addClass("is_error");
c.find(".error").text("Поле обязательно для заполнения");
a=false
}}});
return a
},show_done:function(){var $data=this.o.block.find(this.o.form_done).eq(0).clone();
this.$done_data=$('<div class="modal_form_done"></div>');
this.$done_data.html($data);
this.modal_done=spaced_cli.modal.show({width:350,padding:0,data:this.$done_data});
spaced_cli.modal.$window.attr("data-id",this.o.block.attr("data-id")).attr("data-b-id",this.o.block.attr("data-b-id"));
if(!spaced_cli.is_admin){var goal_name="order_done";
if(spaced_cli.yandex_id){eval("if( typeof(yaCounter"+spaced_cli.yandex_id+') === "object" ) { yaCounter'+spaced_cli.yandex_id+'.reachGoal("'+goal_name+'"); }')
}if(spaced_cli.google_id&&typeof(ga)==="function"){ga("send","event",goal_name,"send")
}}},set_name:function(a){this.o.name=a
}};
spaced_cli.modal={show:function(a){if(this.$window){this.$window.remove()
}this.$window=$('<div class="modal ext_b_block"></div>');
this.$window.html('<a class="close"></a>').append(a.data);
if(a.width){this.$window.css("width",a.width)
}if(a.height){this.$window.css("height",a.height)
}if(typeof(a.padding)!=="undefined"){this.$window.css("padding",a.padding)
}$("body").append(this.$window).append('<div class="modal_overlay"></div>');
this.update_position();
this.$window.on("click","a.close",$.proxy(function(){this.$window.remove();
$("body div.modal_overlay").remove()
},this));
setTimeout($.proxy(function(){this.update_position()
},this),2000)
},set_data:function(a){this.$window.html('<a class="close"></a>').append(a);
this.update_position()
},update_position:function(){this.$window.css("position","fixed").css("top","50%").css("left","50%").css("margin-left","-"+(this.$window.outerWidth()/2)+"px").css("margin-top","-"+(this.$window.outerHeight()/2)+"px")
}};
spaced_cli.stat={u_id:0,time:0,init:function(){var a=this.get_cookie("user_id");
if(a){return
}var b=this.get_cookie("f_uid");
if(b){this.u_id=b;
this.user_visit()
}else{this.user_create()
}},get_cookie:function(a){var b="; "+document.cookie;
var c=b.split("; "+a+"=");
if(c.length==2){return c.pop().split(";").shift()
}else{return false
}},set_cookie:function(b,c){var a=(new Date).getTime()+(3*365*24*60*60*1000);
document.cookie=b+"="+escape(c)+((a)?"; expires="+(new Date(a)):"")
},get_utm:function(){var b=(function(d){if(d==""){return{}
}var c={};
for(var e=0;
e<d.length;
++e){var f=d[e].split("=");
if(f.length!=2){continue
}c[f[0]]=decodeURIComponent(f[1].replace(/\+/g," "))
}return c
})(window.location.search.substr(1).split("&"));
var a={};
$.each(b,function(c,d){if(c.substring(0,4)=="utm_"){a[c]=d
}});
if(document.referrer){a.url=document.referrer
}return a
},user_create:function(){var a=$.ajax({url:"/mod/stat/",type:"POST",dataType:"json",data:{s_id:spaced_cli.s_id,p_id:spaced_cli.p_id,utm_data:this.get_utm()}});
a.done($.proxy(function(b){if(b.u_id){this.set_cookie("f_uid",b.u_id);
this.u_id=b.u_id
}else{log("cookie не установлена");
log(b)
}},this))
},user_visit:function(){var a=$.ajax({url:"/mod/stat/visit/",type:"POST",dataType:"json",data:{s_id:spaced_cli.s_id,p_id:spaced_cli.p_id,u_id:this.u_id}});
a.done($.proxy(function(b){if(b.v_id){}else{log("cookie визита не установлена");
log(b)
}},this))
}};
spaced_cli.block={data:{},css_loaded:{},block_default:{js:[],css:[],_on_init:function(){if(this.css.length>0){$.each(this.css,$.proxy(function(a,b){if(spaced_cli.block.css_loaded[b]){return
}$("body").append('<link href="'+b+'" rel="stylesheet" type="text/css" media="all">');
spaced_cli.block.css_loaded[b]=true
},this))
}if(this.js.length>0){require(this.js,$.proxy(function(){this.is_init=true;
this.on_init()
},this))
}else{this.is_init=true;
this.on_init()
}},_on_update:function(){if(this.js.length>0){require(this.js,$.proxy(function(){this.on_update()
},this))
}else{this.on_update()
}},on_init:function(){},on_update:function(){this.on_init()
},on_msg:function(a){log(a)
}},init:function(){$(window).on("spaced_block_add",$.proxy(function(c,b){if(b.id<1){return
}var a=$('.b_block[data-id="'+parseInt(b.id)+'"]');
this.bind(a)
},this));
$(window).on("spaced_block_render",$.proxy(function(c,b){if(b.id<1){return
}var a=$('.b_block[data-id="'+parseInt(b.id)+'"]');
var d=a.data("_core_block");
if(typeof(d)==="undefined"){return
}if(typeof(d._on_update)==="function"){d._on_update()
}},this));
$(window).on("spaced_block_msg",$.proxy(function(c,b){if(b.id<1){return
}var a=$('.b_block[data-id="'+parseInt(b.id)+'"]');
var d=a.data("_core_block");
if(typeof(d)==="undefined"){return
}d.on_msg(b.msg)
},this));
$(".b_block").each($.proxy(function(c,b){var a=$(b);
this.bind(a)
},this))
},bind:function(a){var b=a.attr("data-b-id");
if(!this.data[b]||a.data("_core_block")){return
}var c=new this.data[b](a);
if(typeof(c)!=="object"){return
}a.data("_core_block",c);
c._on_init()
},update:function(a){var b=a.data("_core_block");
if(typeof(b)==="undefined"){return
}if(typeof(b._on_update)==="function"){b._on_update()
}},register:function(b,c){if(!b){log("Приложение должно иметь уникальный номер")
}c.block_id=b;
spaced_cli.block.data[b]=function(d){this.$block=d;
this.data=this.$block.data("json");
this.id=this.$block.attr("data-id")
};
var a=$.extend(true,{},this.block_default);
spaced_cli.block.data[b].prototype=$.extend(true,{},a,c)
}};
spaced_cli.timer={list:{},create:function(a){this.list[a.id]=new spaced_cli.timer.Timer(a);
return this.list[a.id]
}};
spaced_cli.timer.Timer=function(a){this.o=a;
this.create()
};
spaced_cli.timer.Timer.prototype={o:{},create:function(){var e=$(this.o.block).find(this.o.item);
var d=e.data("time");
var f=new Date();
if(d.type=="date"){var b=d.my.toString().split(".");
this.final_date=new Date(b[1],parseInt(b[0])-1,d.d,d.h,d.m)
}else{if(d.type=="monthly"){this.final_date=new Date(f.getFullYear(),f.getMonth(),d.d,d.h,d.m);
if(f.getTime()>this.final_date.getTime()){this.final_date=new Date(f.getFullYear(),f.getMonth()+1,d.d,d.h,d.m)
}if(parseInt(d.d)!=this.final_date.getDate()){this.final_date.setDate(0);
if(f.getTime()>this.final_date.getTime()){this.final_date=new Date(this.final_date.getFullYear(),this.final_date.getMonth()+2,0,d.h,d.m)
}}}else{if(d.type=="weekly"){var a=parseInt(f.getDate())-parseInt(f.getDay())+parseInt(d.dw);
this.final_date=new Date(f.getFullYear(),f.getMonth(),a,d.h,d.m);
if(f.getTime()>this.final_date.getTime()){this.final_date.setDate(this.final_date.getDate()+7)
}}else{if(d.type=="daily"){this.final_date=new Date(f.getFullYear(),f.getMonth(),f.getDate(),d.h,d.m);
if(f.getTime()>this.final_date.getTime()){this.final_date.setDate(this.final_date.getDate()+1)
}}else{this.final_date=new Date();
this.final_date.setMonth(this.final_date.getMonth()+1,15)
}}}}this.item_d_1=e.find(".d [data-value]").eq(0);
this.item_d_2=e.find(".d [data-value]").eq(1);
this.item_d_3=e.find(".d [data-value]").eq(2);
this.item_h_1=e.find(".h [data-value]").eq(0);
this.item_h_2=e.find(".h [data-value]").eq(1);
this.item_m_1=e.find(".m [data-value]").eq(0);
this.item_m_2=e.find(".m [data-value]").eq(1);
this.item_s_1=e.find(".s [data-value]").eq(0);
this.item_s_2=e.find(".s [data-value]").eq(1);
this.last_offset={d:undefined,h:undefined,m:undefined,s:undefined};
this.start()
},update:function(){this.second_left=this.final_date.getTime()-new Date().getTime();
this.second_left=Math.ceil(this.second_left/1000);
this.second_left=this.second_left<0?0:this.second_left;
this.offset={d:Math.floor(this.second_left/60/60/24),h:Math.floor(this.second_left/60/60)%24,m:Math.floor(this.second_left/60)%60,s:this.second_left%60};
if(this.last_offset.d!=this.offset.d){var e=this.offset.d.toString().split("");
if(e.length<2){e.unshift(0)
}if(e.length<3){e.unshift(0)
}this.item_d_1.attr("data-value",e[0]).text(e[0]);
this.item_d_2.attr("data-value",e[1]).text(e[1]);
this.item_d_3.attr("data-value",e[2]).text(e[2])
}if(this.last_offset.h!=this.offset.h){var c=this.offset.h.toString().split("");
if(c.length<2){c.unshift(0)
}this.item_h_1.attr("data-value",c[0]).text(c[0]);
this.item_h_2.attr("data-value",c[1]).text(c[1])
}if(this.last_offset.m!=this.offset.m){var a=this.offset.m.toString().split("");
if(a.length<2){a.unshift(0)
}this.item_m_1.attr("data-value",a[0]).text(a[0]);
this.item_m_2.attr("data-value",a[1]).text(a[1])
}if(this.last_offset.s!=this.offset.s){var b=this.offset.s.toString().split("");
if(b.length<2){b.unshift(0)
}this.item_s_1.attr("data-value",b[0]).text(b[0]);
this.item_s_2.attr("data-value",b[1]).text(b[1])
}this.last_offset=this.offset;
if(this.second_left<0){this.stop();
return
}},start:function(){if(this.interval!==null){clearInterval(this.interval)
}this.update();
this.interval=setInterval($.proxy(function(){this.update()
},this),200)
},stop:function(){clearInterval(this.interval);
this.interval=null
}};
spaced_cli.block.register(2,{on_init:function(){this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(4,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(6,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.fancybox()
},fancybox:function(){this.$block.find(".item .img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(10,{js:["http://api-maps.yandex.ru/2.1/?lang=ru_RU"],on_init:function(){this.$map=this.$block.find("[data-map]").eq(0);
this.map_data=this.$map.data("map");
ymaps.ready($.proxy(function(){this.show_map()
},this))
},show_map:function(){if(typeof(this.map)!=="undefined"){this.map.destroy()
}this.map=new ymaps.Map(this.$map.get(0),{center:this.map_data.center,zoom:this.map_data.zoom,controls:["zoomControl","fullscreenControl"],behaviors:["default","scrollZoom"],type:"yandex#map"});
var a;
this.map.behaviors.disable("scrollZoom");
$(this.$map).off("mouseenter.map_scroll").on("mouseenter.map_scroll",$.proxy(function(b){a=window.setTimeout($.proxy(function(){this.map.behaviors.enable("scrollZoom")
},this),700)
},this));
$(this.$map).off("mouseleave.map_scroll").on("mouseleave.map_scroll",$.proxy(function(b){if(a){window.clearTimeout(a);
this.map.behaviors.disable("scrollZoom")
}},this));
this.update_places()
},update_places:function(){this.map.geoObjects.removeAll();
if(typeof(this.map_data.marker)==="undefined"){this.map_data.marker="/_app/block/10/mark_blue.png"
}$.each(this.map_data.places,$.proxy(function(c,a){if(typeof(a.color)==="undefined"){a.color="blue"
}var b=new ymaps.Placemark(a.coords,{balloonContent:a.address},{iconLayout:"default#image",iconImageHref:"/_app/block/10/mark_"+a.color+".png",iconImageSize:[50,50],iconImageOffset:[-25,-50]});
this.map.geoObjects.add(b)
},this))
}});
spaced_cli.block.register(13,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find("a.btn").on("click",$.proxy(function(){this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(14,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find("a.btn").on("click",$.proxy(function(){this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(15,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find("a.btn").on("click",$.proxy(function(){this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(16,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find("a.btn").on("click",$.proxy(function(){this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(17,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find("a.btn").on("click",$.proxy(function(){this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(24,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(25,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(26,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(27,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(28,{on_init:function(){this.form=spaced_cli.form.create({modal:true,id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"});
this.$block.find(".form_btn a").on("click",$.proxy(function(a){var b=$('<input type="hidden" name="form[1000]" value="">').val($(a.currentTarget).closest(".item").find(".name").text());
this.$block.find("div.form .form_fields").prepend('<input type="hidden" name="type[1000]" value="hidden">').prepend('<input type="hidden" name="vars[1000]" value="Услуга">').prepend(b);
this.form.show()
},this))
},on_msg:function(a){switch(a){case"form_show":this.form.show();
break;
case"form_update":this.form.update();
break;
case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(29,{on_init:function(){this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(30,{on_init:function(){this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(31,{on_init:function(){this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(41,{on_init:function(){this.timer=spaced_cli.timer.create({id:this.id,block:this.$block,item:"div.timer"})
},on_msg:function(a){}});
spaced_cli.block.register(42,{on_init:function(){this.timer=spaced_cli.timer.create({id:this.id,block:this.$block,item:"div.timer"})
},on_msg:function(a){}});
spaced_cli.block.register(43,{on_init:function(){this.timer=spaced_cli.timer.create({id:this.id,block:this.$block,item:"div.timer"});
this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(44,{on_init:function(){this.timer=spaced_cli.timer.create({id:this.id,block:this.$block,item:"div.timer"});
this.form=spaced_cli.form.create({id:this.id,block:this.$block,form:"div.form",form_done:"div.form_done"})
},on_msg:function(a){switch(a){case"form_done_show":this.form.show_done();
break
}}});
spaced_cli.block.register(45,{on_init:function(){this.$block.on("mouseover mouseout",".item",$.proxy(function(d){var b=$(d.currentTarget);
var a=b.find(".overlay");
var c=75+15;
if(this.$block.find(".item_list").hasClass("hide_desc")){c=50+15
}if(d.type=="mouseover"){b.addClass("hover");
a.css("height",c+parseInt(a.find(".img_text").outerHeight())+"px")
}else{b.removeClass("hover");
a.attr("style","")
}},this))
},on_msg:function(c){var d=this.$block.find(".item.hover");
if(d.length>0){var b=75+15;
if(this.$block.find(".item_list").hasClass("hide_desc")){b=50+15
}var a=d.find(".overlay");
a.css("height",b+parseInt(a.find(".img_text").outerHeight())+"px")
}}});
spaced_cli.block.register(46,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.fancybox()
},fancybox:function(){this.$block.find(".item a.img_big").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(47,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.fancybox()
},fancybox:function(){this.$block.find(".item a.img_big").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(48,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js","/_s/lib/spaced/flexbeSlider/jquery.flexbeSlider.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){function c(){var f=window,d="inner";
if(!("innerWidth" in window)){d="client";
f=document.documentElement||document.body
}return{width:f[d+"Width"],height:f[d+"Height"]}
}var a=c();
var b=this.$block.find(".slider").flexbeSlider({controls:true,pager:true,slideMove:3,slideMargin:0,slideWidth:(a.width>=1200)?370:293});
$(window).on("resize",function(){a=c();
b.setSettings({slideMargin:0,slideWidth:(a.width>=1200)?370:293})
});
this.fancybox()
},fancybox:function(){this.$block.find(".item a.img_big").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(49,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.size_render();
this.fancybox()
},fancybox:function(){this.$block.find(".item a.img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
},size_render:function(){var e=this.$block.find(".item_list");
var c={item:".item",cols:3,margin:10,resizable:true};
function b(g){var f=e.find(".preview_img > img");
var h=f.length;
if(h==0){g()
}f.each(function(k,j){var l=new Image();
l.onload=function(i){h--;
if(h==0){g()
}};
l.onerror=function(i){h--;
if(h==0){g()
}};
l.src=$(j).attr("src")
})
}function d(){e.css("position","relative");
var k=0;
var n,f,g,o,h,j,l=[];
h=parseInt(c.cols||3);
n=e.find(c.item);
f=e.outerWidth();
g=parseInt(c.margin||0);
o=parseInt(f/h)-g;
if(h==1){j=-g/2
}else{j=(f%(o+g))/2
}for(var m=0;
m<h;
m++){l.push(-g/2)
}n.each(function(r,s){var q=$(s);
var p=$.inArray(Math.min.apply(Math,l),l);
q.css({width:o,position:"absolute",margin:g/2,top:l[p]+g/2,left:(o+g)*p+j});
l[p]+=q.outerHeight()+g;
if(k<l[p]){k=l[p]
}});
e.css("height",k+parseInt(g/2))
}d();
b(function(){setTimeout(d,200)
});
if(c.resizable){var a=$(window).on("resize",function(){d()
});
e.on("remove",a.unbind)
}}});
spaced_cli.block.register(50,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.$block.find(".item a.big_img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(51,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.$block.find(".item a.big_img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(52,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.$block.find(".item a.big_img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});
spaced_cli.block.register(53,{js:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.pack.js"],css:["/_s/lib/jquery/fancybox/2.1.0/jquery.fancybox.css"],on_init:function(){this.$block.find(".item a.big_img").each($.proxy(function(c,b){var a=$(b);
a.attr("data-fancybox-group","gallery_"+this.id);
a.fancybox({type:"image",openEffect:"fade",closeEffect:"fade",nextEffect:"fade",prevEffect:"fade",helpers:{title:{type:"inside"}}})
},this))
}});