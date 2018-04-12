//Ext 对元素的操作
(function(){
    var DOC=document;

    cExt.Element=function(element,forceNew){
        var dom=typeof element==='string'?
                DOC.getElementById(element):
                element,
            id;
        
        if(!dom)return null;

        id=dom.id;

        if(!foceNew&&id&&Ext.elCache[id]){
            return cExt.elCache[id].el;
        }

        this.dom=dom;
        this.id=id||Ext.id(dom);
    }

    var DH=cExt.DomHelper,
        El=cExt.Element,
        EC=cExt.elCache;

    EL.prototype={
      
        set:function (o,useSet) {
            var el=this.dom,
                attr,
                val,
                useSet=(useSet!==false)?&&!!el.setAttribute;

            for(attr in o){
                if(o.hasOwnProperty(attr)){
                    val =o[attr];
                    if(attr=='style'){
                        DH.applyStyles(el,val);
                    }else if(attr=='cls'){
                        el.className=val;
                    }else if(useSet){
                        el.setAttribute(attr,val);
                    }else{
                        el[attr]=val;
                    }
                }
            }
             return this;
        },

        defaultUnit:'px',

        is:function(simpleSelector){
            return Ext.DomQuery.is(this.dom,simpleSelector);
        },

        focus:function(defer,dom){
            var me=this,
                dom=dom||me.dom;

            try{
                if(Number(defer)){
                    me.focus.defer(defer,null,[null,dom]);
                }else{
                    dom.focus();
                }
            }catch(e){

            }
            return me;
        },

        blur:function(){
            try{
                this.dom.blur();
            }catch(e){}
            return this;
        },

        getValue:function(asNumber){
            var val=this.dom.value;
            return asNumber?parseInt(val,10):val;
        },

        addListener:function(eventName,fn,scope,options){
            cExt.EventManager.on(this.dom,eventName,fn,scope||this,options);
            return this;
        },

        removeListener:function(eventName,fn,scope){
            cExt.EventManager.removeListener(this.dom,eventName,fn,scope||this);
            return this;
        },

        removeAllListeners:function(){
            cExt.EventManager.removeAll(this.dom);
            return this;
        },

        purgeAllListeners:function(){
            cExt.EventManager.purgeElement(this.dom);
            return this;
        },

        addUnits:function(size){
            if(size==""||size=='auto'||size===undefined){
                size=size||'';
            }else if(!isNaN(size)||!unitPattern.test(size)){
                size=size+(this/defaultUnit||'px');
            }
            return size;
        },

        load:function(url,params,cb){
            cExt.Ajax.request(cExt.apply({
                params:params,
                url:url.url||url,
                callback:cb,
                el:this.dom,
                indicatorText:url.indicatorText||''
            },cExt.isObject(url)?url:{}));
        },

        isBorderBox:function(){
            return cExt.isBorderBox||cExt.isForcedBorderBox||noBoxAdjust[(this.dom.tagName||'').toLowerCase()]
        },

        remove:function(){
            var me=this,
                dom=me.dom;
            
            if(dom){
                delete me.dom;
                cExt.removeNode(dom);
            }
        },

        hover:function(overFn,outFn,scope,options){
            var me=this;

            me.on('mouseenter',overFn,scope||me.dom,options);
            me.on('mouseleave',outFn,scope||me.dom,options);
            return me ;
        },

        contains:function(el){
            return !el?false:cExt.lib.Dom.isAncestor(this.dom,el.dom?el.dom:el);
        },

        getAttributeNs:function(ns,name){
            return this.getAttributeNs(name,ns)
        },

        getAttribute:(function(){
            var test=document.createElement('table'),
                isBrokenOnTable=false,
                hasGetAttribute='getAttribute' in test,
                unknownRe=/undefined|unknown/;
            
            if(hasGetAttribute){
                try{
                    test.getAttribute('ext:qtip'); //这种参数模式在IE7-会出现参数无效的bug
                }catche(e){
                    isBrokenOnTable=true; //如果是IE7-表格元素
                }
                return function(name,ns){
                    var el=this.dom,
                        value;

                    if(el.getAttributeNs){
                        value=el.getAttributeNs(ns,name)||null;
                    }

                    if(value==null){
                        if(ns){
                            if(isBrokenOnTable&&el.tagName.toUpperCase()=='TABLE'){//如果是IE7-表格元素设置为空
                                try{
                                    value=el.getAttibute(ns+":"+name);
                                }catch(e){
                                    value='';
                                }
                            }else{
                                value=el.getAttibute(ns+":"+name);
                            }
                        }else{
                            value=el.getAttribute(name)||el[name]
                        }
                    }
                }
            }else{
                //不支持getAttribute属性时
                //
                return function(name,ns){
                    var el=this.dom,
                        value,
                        attribute;

                    if(ns){
                        asttribute=el[ns+':'+name]//ext:qtip
                        value=unknownRe.test(typeof attribute)?undefined:attribute;
                    }else{
                        value=el[name];
                    }
                    return value||'';
                }
            }
            test=null;
        })(),

        update:function(html){

            if(this.dom){
                this.dom.innerHTML=html;
            }
            return this;
        }
    };

    var ep=El.prototype;

    El.addMethods=function(o){
        cExt.apply(ep,o);
    }

    ep.on=ep.addListener;
    ep.un=ep.removeListener;
    ep.autoBoxAdjust=true;

    var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
        docEl;

    El.get=function(el){
        var ex,
            elm,
            id;

        if(!el){
            return null;
        }

        if(typeof el==='string'){
            if(!(elm=DOC.getElementById(el))){
                return null;
            }
            if(EC[el]&&EC[el].el){
                ex=EC[el].el;
                ex.dom=elm;
            }else{
                ex=El.addToCache(new El(el));
            }
            return ex;
        }else if(el instanceof El){
            if(el!=docEl){
                if(cExt.isIE&&(el.id==undefined||el.id=='')){
                    el.dom=el.dom;
                }else{
                    el.dom=DOC.getElementById(el.id)||el.dom;
                }
            }
            return el;
        }else if(el.isComposite){
            return el;
        }else if(cExt.isArray(el)){
            return El.select(el);
        }else if(el==DOC){
            if(!docEl){
                var f=function(){};
                f.prototype=El.prototype;
                docEl=new f();
                docEl.dom=DOC;
            }
            return docEl;
        }
        return null;
    }

    El.addToCache=function(el,id){
        id=id||el.id;
        EC[id]={
            el:el,
            data:{},
            events:{}
        }
        return el;
    }

    El.data=function(el,key,value){
        el=El.get(el);
        if(!el){
            return null;
        }
        var c=EC[el.id].data;
        if(arguments.length==2){
            return c[key];
        }else{
            return (c[key]=value);
        }

    }

    function garbageCollect(){
        if(!cExt.enbaleGarbageCollector){
            clearInterval(El.collectorThreadId);
        }else{
            var eid,
                el,
                d,
                o;
            for (eid in EC) {
                 o=EC[eid];
                 if(o.skipGC){
                    continue;
                 }   
                 el=o.el;
                 d=el.dom;

                 if(!d||!d.parentNode||(!d.offsetParent&&!DOC.getElementById(eid))){
                    if(cExt.enableListenerCollection){
                        cExt.EventManager.removeAll(d);
                    }
                    delete EC[eid];
                 }
            }

            if (Ext.isIE) {
                var t={};
                 for (eid in EC) {
                    t[eid] = EC[eid];
                }
                EC = Ext.elCache = t;
            }    
        }
    }

    El.collectorThreadId=setInterval(garbageCollect,30000);

    var flyFn=function(){};
    flyFn.prototype=El.prototype;
    El.Flyweight=function(dom){
        this.dom=dom;
    }
    El.Flyweight.prototype=new flyFn();
    El.Flyweight.prototype.isFlyweight=true;
    El._flyweight={};

    cExt.fly=function(el,named){
        var ret=null;

        named=named||'_global';

        if(el=cExt.getDom(el)){
            (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
            ret = El._flyweights[named];
        }
        return ret;
    };

    cExt.get=El.get;
    cExt.fly=El.fly;

    var noBoxAdjust=cExt.isStrict?{
        select:1
    }:{
        input:1,select:1,textarea:
    };

    if(cExt.isIE||cExt.isGecko){
        noBoxAdjust['button']=1;
    }
       
})();




