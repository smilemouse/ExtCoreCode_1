//Extjs代码复制
window.undefind=window.undefind;

var cExt={
	version:"3.4.0",
	versionDetail:{
		major:3, //主要的
		minor:4, //辅助
		parch:0	 //补丁
	}
};

//对象的浅复制
cExt.apply=function(o,c,defaults){

	if(defaults){
		Ext.apply(c,defaults);
	}

	if(o && typeof o=="object" &&c && typeof c=="object"){
		for(var p in c){
			o[p]=c[p];
		}
	}
};


(function(){
	var idSpeed=0,
		toString=Object.prototype.toString,
		ua=navigator.userAgent.toLowerCase(),
		check=function(r){
			return r.test(ua);
		},
		DOC=document,
		docMode=DOC.documentMode,//属性返回浏览器渲染文档的模式。 只有IE支持 返回的是数字
		isStrict=DOC.compatMode=="CSS1Compat",//"CSS1Compat"  "BackCompat"
		isOpera=check(/opera/),
		isChrome=check(/chrome/),
		isWebkit=check(/webkit/),
		//主要是chrome中含有Safari字样
		isSafari=!isChrome&&check(/safari/),//"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 **Safari***/537.36" chrome
		isSafari2=isSafari&&check(/applewebkit\/4/),
		isSafari3=isSafari&&check(/version\/3/),
		isSafari3=isSafari&&check(/version\/3/),
		isIE=!isOpera&&check(/msie/),
		isIE7=isIE&&check(/msie 7/),
		isIE8=isIE&&check(/msie 8/),
		isIE9=isIE&&check(/msie 9/),
		isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebkit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
 		isBorderBox = isIE && !isStrict,//是否是标准的盒子模型 只有ie低版本才出现这情况
 		isWindows = check(/windows|win32/),
 		isMac = check(/macintosh|mac os x/),
 		isAir = check(/adobeair/),
 		isLinux = check(/linux/),
 		isSecure = /^https/i.test(window.location.protocol);//是否是安全的浏览地址

	if(isIE6){
		try{
			document.execCommand('BackgroundImageCache',false,true);
		}catch(e){

		}

	}

	cExt.apply(cExt,{
		
		SSL_SECURE_URL:isSecure&&isIE?'javascript:""':'about:blank',
		isStrict:isStrict,
		isSecure:isSecure,
		isReady:false,
		enableForcedBoxModel:false,

		//cExt的主要方法入口

		applyIf:function (o,c) {
			if(o){
				for (var name in c) {
					if(!Ext.isDefined(o[name])){
						o[name]=c[name];
					}
				}
			}
			return o;
		},

		//创建唯一的id 如果元素存在id则不能改变
		id:function (el,prefix) {
			el=Ext.getDom(el,true)||{};
			if(!el.id){
				el.id=(prefix||'ext-gen')+(++idSpeed)
			}
			return el.id;
		},

		getDom:function (el,strict) {
			
			if(!el||!DOC){
				return null
			}

			if(el.dom){	//如果传递的extjs封装的元素对象 直接返回下面的dom
				return el.dom;
			}else{

				if(Ext.isString(el)){
					var e=DOC.getElementById(el);		

					if(e&&isIE&&strict){
						if(el===e.getAttribute('id')){
							return e;
						}else{
							return null;
						}
					}
					return e;	
				}else{
					return el;
				}

			}

		},

		extend:function () {
			var inlineoverrids=function(o){
				for(var name in o){
					this[name] =o[name];
				}
			}

			var objectConstructor=Object.prototype.constructor;

			return function (sb,sp,overrids) {
				if(Ext.isObject(sp)){
					overrids=sp;
					sp=sb;
					sb=overrids.constructor!=objectConstructor?overrids.constructor:'';
				}

				var F=function(){},
					sbp,
					spp=sp.prototype;
				
					F.prototype=spp;
			}
		},

		/**
		 * 需要注意的是后面的if判断，IE中for in不能遍历对象的Object的toSting等方法， 
         * 因此需要特别处理一下。IE9 beta重写对象的内置方法如toString后是可用for in遍历的 
		 */
		override:function (origclass,overrides) {
			
			if(overrides){
				var p=origclass.prototype;
				Ext.apply(p,overrides);

				if (cExt.isIE && overrides.hasOwnProperty('toString')) {
					p.toString = overrides.toString;
				}
			}
		},

		namespace:function(){
			var len1=arguments.length,
				i=0,
				len2,
				j,
				main,
				ns,
				sub,
				current;
			
			for(;i<len1;i++){
				main=arguments[i];
				ns=arguments[i].split('.');
				current=window[ns[0]];
				if(current===undefined){
					current=window[ns[0]]={};
				}
				sub=ns.slice(1);
				len2=sub.length;
				for (var j = 0; j < len2; j++) {
					current=current[sub[j]]=current[sub[j]]||{};			
				}
			}

			return current;
		},

		urlDecode:function (string,overwrite) {
			if(cExt.isEmpty(string)){
				return {};
			}

			var obj={},
				pairs=string.split('&'),
				d=decodeURIComponent,
				name,
				value;
			
			Ext.each(pairs,function(pair){
				pair=pair.split('=');
				name=d(pair[0]);
				value=d(pair[1]);
				obj[name]=overwrite||!obj[name]?value:[].concat(obj[name]).concat(value);
			});
			return obj;
		},

		urlAppend:function (url,s) {
			if(cExt.isEmpty(s)){
				return url+(url.indexOf('?')===-1?'?':'&')+s;
			}
			return url;
		},

		toArray: function () {
			return isIE ?
				function (a, i, j, res) {
					res = [];
					for (var x = 0; x < a.length; x++) {
						//res.push(a[x]);
						res[x]=a[i]//这样的效率高些
					}
					return res.slice(i || 0, j || res.length);
				} :
				function (a, i, j) {
					return Array.prototype.slice.call(a, i || 0, j || a.length)
				}
		}(),

		isIterable:function(v){
			//v.callee表示是arguments伪类也是符合条件的
			if(cExt.isArray(v)||v.callee){
				return true;
			}
			//node list
			if(/NodeList|HTMLCollection/.test(toString.call(v))){
				return true;
			}
			//NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
			return ((typeof nextNode!='undefined'||v.item)&&Ext.isNumber(v.length));

		},

		//类型的判断
		
		isEmpty:function(v,allowBlank){
			return v===null||v===undefined||(Ext.isArray(v)&&v.length===0)||(!allowBlank?v==='':false);
		},

		isArray:function(v){
			return toString.apply(v)==='[object Array]'
		},

		isDate:function(v){
			return toString.apply(v)==='[object Date]';
		},

		isObject:function(v){
			return !!v&&toString.apply(v)==='[object Object]';
		},

		//基本数据类型判断  String Number Boolean
		isPrimitive:function(v){
			return Ext.isString(v)||Ext.isNumber(v)||Ext.isBoolean(v);
		},

		isFunction:function(v){
			return toString.apply(v)==='[object Function]';
		},

		isNumber:function (v) {
			return toString.apply(v)==='[object Number]'&&isFinite(v);
		},

		isString:function (v) {
			return toString.apply(v)==='[object String]';
		},

		isBoolean:function (v) {
			return toString.apply(v)==='[object Boolean]';
		},

		isElement:function (v) {
			return v?!!v.tagName:false;//tagName 是元素的标志
		},

		isDefined:function (v) {
			return toString.apply(v)==='[object Undefined]';
		},
		/**
         * True if the detected browser is Opera.
         * @type Boolean
         */
        isOpera : isOpera,
        /**
         * True if the detected browser uses WebKit.
         * @type Boolean
         */
        isWebKit : isWebKit,
        /**
         * True if the detected browser is Chrome.
         * @type Boolean
         */
        isChrome : isChrome,
        /**
         * True if the detected browser is Safari.
         * @type Boolean
         */
        isSafari : isSafari,
        /**
         * True if the detected browser is Safari 3.x.
         * @type Boolean
         */
        isSafari3 : isSafari3,
        /**
         * True if the detected browser is Safari 4.x.
         * @type Boolean
         */
        isSafari4 : isSafari4,
        /**
         * True if the detected browser is Safari 2.x.
         * @type Boolean
         */
        isSafari2 : isSafari2,
        /**
         * True if the detected browser is Internet Explorer.
         * @type Boolean
         */
        isIE : isIE,
        /**
         * True if the detected browser is Internet Explorer 6.x.
         * @type Boolean
         */
        isIE6 : isIE6,
        /**
         * True if the detected browser is Internet Explorer 7.x.
         * @type Boolean
         */
        isIE7 : isIE7,
        /**
         * True if the detected browser is Internet Explorer 8.x.
         * @type Boolean
         */
        isIE8 : isIE8,
        /**
         * True if the detected browser is Internet Explorer 9.x.
         * @type Boolean
         */
        isIE9 : isIE9,
        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla, Firefox).
         * @type Boolean
         */
        isGecko : isGecko,
        /**
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g. Firefox 2.x).
         * @type Boolean
         */
        isGecko2 : isGecko2,
        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g. Firefox 3.x).
         * @type Boolean
         */
        isGecko3 : isGecko3,
        /**
         * True if the detected browser is Internet Explorer running in non-strict mode.
         * @type Boolean
         */
        isBorderBox : isBorderBox,
        /**
         * True if the detected platform is Linux.
         * @type Boolean
         */
        isLinux : isLinux,
        /**
         * True if the detected platform is Windows.
         * @type Boolean
         */
        isWindows : isWindows,
        /**
         * True if the detected platform is Mac OS.
         * @type Boolean
         */
        isMac : isMac,
        /**
         * True if the detected platform is Adobe Air.
         * @type Boolean
         */
        isAir : isAir,

		each:function(arry,fn,scope){
			if(cExt.isEmpty(arry,true)){
				return;
			}
			if(!cExt.isIterable(array)||cExt.isPrimitive(arry)){
				arry=[arry];//将基础类型的数据放到数组中
			}
			for(var i=0,len=arry.length;i<len;i++){
				if(fn.call(scope||arry[i],arry[i],i,arry)===false){
					return i;
				}
			}
		},
		iterate:function(obj,fn,scope){
			if(cExt.isEmpty(obj)){
				return;
			}
			if(cExt.isIterable(obj)){
				Ext.each(obj,fn,scope);
				return ;
			}else if(typeof obj==='object'){
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						if(fn.call(scope || obj, prop, obj[prop], obj) === false){
                            return;
                        };
					}
				}
			}

		},

		getBody:function(){
			return cExt.get(DOC.body||DOC.documentElement)
		},
		getHead:function(){
			var head;

			return function(){
				if(head==undefined){
					head=cExt.get(DOC.getElementsByTagName('head')[0])
				}
				return head;
			}
		}(),
		removeNode:function(){

		}


	});
	cExt.ns=cExt.namespace;

})();

cExt.ns('cExt.util','cExt.lib','cExt.data','cExt.supports');
cExt.elCache={};
cExt.apply(Function.prototype,{

	createInterceptor:function(fcn,scope){
		var method=this;

		return !cExt.isFunction(fcn)?
				this:
				function(){
					var me=this;
					var args=arguments;
					fcn.target=me;
					fcn.method=method;
					return (fcn.apply(scope||me||window,args)!==false)?
							method.apply(me||window,args):
							null;
				}
	},
	createCallback:function(){
		var args=arguments;
		var method=this;
		return function(){
			return method.apply(window,args)
		}
	},
	createDelegate:function(obj,args,appendArgs){
		var method=this;
		return function(){
			var callArgs=args||arguments;
			if(appendArgs===true){
				callArgs=Array.prototype.slice.call(arguments,0);
				callArgs=callArgs.concat(args);
			}else if(cExt.isNumber(appendArgs)){
				callArgs=Array.prototype.slice.call(arguments,0);
				var applyArgs=[appendArgs,0].concat(args);
				Array.prototype.splice.apply(callArgs, applyArgs);
			}
			return method.apply(obj||window,callArgs);
		}
	},
	defer:function(millis,obj,args,appendArgs){
		var fn=this.createDelegate(obj,args,appendArgs);

		if(millis>0){
			return setTimeout(fn,millis);
		}
		fn();
		return 0;
	}
});

Ext.applyIf(String,{
	format:function(format){
		var args=Ext.toArray(arguments,1);
		return format.replace(/\{(\d+)\}/g,function(m,i){
			return args[i]
		});
	}
});

Ext.applyIf(Array.prototype,{

	indexOf:function(o,from){
		var len=this.length;
		from=from||0;
		from+=(from<0)?len:0;
		for(;from<len;++from){
			if(this[from]===o){
				return from;
			}
		}
		return -1;
	},
	remove:function (o) {
		var index=this.indexOf(o);
		 
		if(index!=-1){
			this.splice(index,1)
		}
		return this;
	}

});


