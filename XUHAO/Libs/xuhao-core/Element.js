/**
 * 封装元素，将dom包括其中 同时提供dom兼容的解决方案
 */
(function(){
	var DOC=document;
	var DH=XUHAO.DomHelper;
	var El=XUHAO.Element;
	var EC=XUHAO.elCache;

/*	XUHAO.elCache={

		#id:{
			data:{},
			el:'#Element',
			events:{}
		},
		.
		.
		.
	}*/

	/**
	 * 创建元素构造函数
	 * @param {[type]} element  [ dom 或者 id]
	 * @param {[type]} forceNew [是否从缓存中获取]
	 */
	XUHAO.Element=function(element,forceNew){
		var dom=typeof element=='string'?
			DOC.getElementById(element):element;

		if(dom){return null}
		id=dom.id;
		if(!forceNew&&id&&XUHAO.elCache[id]){
			return XUHAO.elCache[id].el;
		}
		this.dom=dom;
		this.id=id||XUHAO.id(dom);
	}


	El.prototype={

		set:function(o,useSet){
			var el=this.dom,
				attr,
				val,
				useSet=(useSet!==false)&&!!el.setAttribute;

			for(attr in o){
				if(o.hasOwnProperty(attr)){
					val=o[attr];
					if(attr=='style'){
						DH.applyStyles(el,val);
					}else if(attr=='cls'){
						el.className=val;
					}else if(useSet){
						el.setAttribute(val);
					}else{
						el[attr]=val;
					}
				}

			}
			return this;
		},

		defaultUnit:'px',

		is:function(simpleSelector){
			return XUHAO.DomQuery.is(simpleSelector);
		},

		focus:function(defer,dom){
			var me=this,
				dom=dom||this.dom;
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

		blur:function(dom){
			var me=this,
				dom=dom||this.dom;
			try{
				dom.blur();
			}catch(e){

			}
			return me;	
		},

		getValue:function(asNumber){
			var val=this.dom.value;
			return asNumber ? parseInt(val, 10) : val;
		},

		addListener:function(eventName,fn,scope,options){
			XUHAO.EventManager.on(this.dom,eventName,fn,scope||this,opeions);
		},

		removeListener : function(eventName, fn, scope){
	        XUHAO.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
	        return this;
	    },

	    removeAllListeners : function(){
	        XUHAO.EventManager.removeAll(this.dom);
	        return this;
	    },

	    purgeAllListeners : function() {
	        XUHAO.EventManager.purgeElement(this, true);
	        return this;
	    },

	    addUnits:function(size){
	    	if(size==""||size=="auto"||size=='undefined'){
	    		size=size||'';
	    	}else if(!isNaN(size)||!unitPattern.test(size)){
	    		size = size + (this.defaultUnit || 'px');
	    	}
	    	return size;
	    },

	    load:function(url,params,cb){
	    	XUHAO.Ajax.request(XUHAO.apply({
	    		params: params,
	            url: url.url || url,
	            callback: cb,
	            el: this.dom,
	            indicatorText: url.indicatorText || ''
	    	},XUHAO.isObject(url) ? url : {}));
	    	return this;
	    },

	    remove:function(){
	    	var me=this,
	    		dom=me.dom;

	    	if(dom){
	    		delete me.dom;
	    		XUHAO.removeNode(dom);//这里面删除了dom上的各种事件
	    	}
	    },

	    hover : function(overFn, outFn, scope, options){
	        var me = this;
	        me.on('mouseenter', overFn, scope || me.dom, options);
	        me.on('mouseleave', outFn, scope || me.dom, options);
	        return me;
	    },

	    contains:function(el){
	    	return !el?false:XUHAO.lib.Dom.isAncestor(tis.dom,el.dom?el.dom||el);
	    },

	    getAttributeNS : function(ns, name){
	        return this.getAttribute(name, ns);
	    },

	    getAttribute:(function(){
	    	var test=document.createElement('table'),
	    		isBrokenOnTable = false,
	    		hasGetAttribute = 'getAttribute' in test,//测试浏览器是否支持该属性
	    		unknownRe=/undefined|unknown/;//IE中获取命名空间时会出现unknown的情况，且要把值改为空字符串
	    		
	    	if(hasGetAttribute){
	    		
	    	}else{
	    		return function(name,ns){
	    			var el=this.dom,
	    				value,
	    				attribute;

	    			if(ns){

	    				/*IE8之前的版本返回false.
	    				因为DOM对象是宿主对象，是通过COM而不是JScript实现的，
	    				document.createElement()函数是一个COM对象。IE9已更正。

						 var xhr=new ActiveXObject("Microsoft.XMLHttp");
						 if(xhr.open){ //error
						     //TO-DO
						 }
						直接把函数属性访问会导致JS错误。typeof xhr.open 返回“unknown”

						*/

	    				attribute=el[ns+":"+name];//如果返回的值是COM对象属性会返回unknown
	    				value=unknownRe.test(typeof attribute)?undefined:attribute;
	    			}else{
	    				value=el[name];
	    			}

	    			return value||'';
	    		}
	    		test=null;
	    	}

	    })(),

	    update:function(html){
	    	if(this.dom){
	    		this.dom.innerHTML=html;
	    	}
	    	return this;
	    }
	}

	var ep=El.prototype;

	El.addMethods=function(o){
		Ext.apply(ep,o);
	};

	ep.on=ep.addListener;
	ep.un=ep.removeListener;

	ep.autoBoxAdjust=false;

	var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    docEl;

    //获取的封装好的element元素，如果不存在则new一个出来
   /* 该方法是一静态方法，他的功能是获取元素对象。
	   	get方法不会获取组件对象Ext.Component Component，而只是对DOM元素进行Ext.Element封装，
	   	要想获取组件，请调用方法Ext.ComponentMgr.get。Ext.get是该方法的别名。
	   	对于传入的参数el可分为以下几种情况
	1、传入参数是dom的id：首先利用DOC.getElementById(el)判断该dom是否存在，存在的话先从缓存中取，不存在的话实例化该对象并压入到缓存中
	2、传入参数是HTMLElement对象：首先判断该dom是否有id值（没有则创建），对于该种情况也是先从缓存中取，与1一样
	3、传入参数是Ext.Element，即已经封装好的对象：如果不是docEl，重新给dom属性赋值后直接返回
	4、传入参数是Ext.CompositeElementLite：直接返回
		Ext.CompositeElementLite 在后续会介绍，这个类用来操作批量的Ext.Element
	5、传入参数是数组的话：调用El.select(el)返回，后续会介绍
	6、传入参数是document：
    如果docEl不存在则创建。因为document是唯一的，因此该对象只创建一次。后续直接返回即可。可以看到docEl与普通Ext.Element不同之处在于其dom属性的不同。
    */
    XUHAO.get=function(el){
    	var ex,
    		elm,
    		id;

    	if(!el){return null};
    	
    	if(typeof el==='string'){
    		//表示输入的是id

    		if(!(elm=document.getElementById(el))){
    			return null;
    		}
    		//先从缓存中获取 如果不存在则缓存中添加el对象 
    		if(EC[el]&&EC[el].el){
    			ex=EC[el].el;
    			ex.dom=elm;
    		}else{
    			ex=El.addToCache(new El(elm));
    		}
    		return ex;

    	}else if(el.tagName){
    		//输入的dom元素
    		//和id的区别就是无需创建dom
    		if(!(id=el.id)){
    			id=XUHAO.id(el)
    		}

    		if(EC[id]&&EC[id].el){
    			ex=EC[id].el;
    			ex.dom=el;
    		}else{
    			ex=El.addToCache(new El(el));
    		}
    		return ex;

    	}else if(el instanceof El){
    		//输入的封装的element元素
    		
    		if(el!=docEl){

    			if (XUHAO.isIE && (el.id == undefined || el.id == '')) {
	                el.dom = el.dom;
	            } else {
	                el.dom = DOC.getElementById(el.id) || el.dom;
	            }
    		}
    		return el;

    	}else if(el.isComposite){
    		//Ext.CompositeElementLite元素集合
    		return el;
    	}else if(XUHAO.isArray(el)){
    		return El.select(el);
    	}else if(el==DOC){
    		if(!docEl){
    			var F=function(){};
    			F.prototype=El.prototype;
    			docEl=new F();
    			docEl.dom=el;
    		}
    		return docEl;
    	}
    	return null;
    };

    El.addToCache=function(el,id){
    	id=id||el.id;
    	EC[id]={
    		el:el,
    		events:{},
    		data:{}
    	}
    	return el;
    }

    /**
     * 获取元素存储的data数据 value存在则替换
     * @param  {[type]} el    [description]
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    El.data=function(el,key,value){
    	el=XUHAO.get(el);
    	if(!el){
    		return null;
    	}
    	var c=EC[el.id].data;

    	if(arguments.length==2){
    		return c[key];
    	}else{
    		return (c[key] = value);
    	}	

    }

    //垃圾回收机制
    function garbageCollect(){
    	if(!XUHAO.enableGarbageCollector){
    		clearInterval(El.collectorThreadId);
    	}else{
    		var eid,
            el,
            d,
            o;

        for(eid in EC){
            o = EC[eid];
            if(o.skipGC){
                continue;
            }
            el = o.el;
            d = el.dom;
            if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
                if(Ext.enableListenerCollection){
                    Ext.EventManager.removeAll(d);
                }
                delete EC[eid];
            }
        }
        if (Ext.isIE) {
            var t = {};
            for (eid in EC) {
                t[eid] = EC[eid];
            }
            EC = Ext.elCache = t;
        }
    	}
    }

    El.collectorThreadId = setInterval(garbageCollect, 30000);


    //一种享元模式的基础构造
    //将dom和对应的方法存储起来，这样就不用每次调用都重新生成了。
    //直接获取缓存机制里的对象就可以了
    var flyFn=function (){};
    flyFn.prototype=El.prototype;
    El.FlyWeight=function(dom){
    	this.dom=dom;
    }
    El.Flyweight.prototype = new flyFn();
	El.Flyweight.prototype.isFlyweight = true;
	El._flyweights = {};

	El.fly=function(el,named){
		var ret=null;
		named=named||'_global';

		if(el=XUHAO.getDom(el)){
			(El._flyweights[named]=El._flyweights[named]||new El.Flyweight()).dom=el;
			ret=El._flyweights[named];
		}
		return ret;
	}

	Ext.get=El.get;
	Ext.fly=El.fly;
	var noBoxAdjust = Ext.isStrict ? {
	    select:1
	} : {
	    input:1, select:1, textarea:1
	};
	if(Ext.isIE || Ext.isGecko){
	    noBoxAdjust['button'] = 1;
	}
})()
