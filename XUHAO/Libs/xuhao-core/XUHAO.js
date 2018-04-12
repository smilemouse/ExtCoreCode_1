/**
 * 分析extjs3.4.0代码的过程
 */

/**
 *  在较老的浏览器中，如IE5之前的浏览器，undefined并不是window对象的一个子对象，并不是一个已实现的系统保留字，而是代表一个未定义类型，除了直接赋值和typeof()之外，其它任何对undefined的操作都将导致异常。如果需要知道一个变量是否是undefined，只能采用typeof()的方法：如var v;if (typeof(v) == 'undefined') {// ...}。如果使用if(a==="undefined")则会报“undefined未定义”的错误。 
    因此为了兼容IE5及之前的浏览器，我们可以使用一些方法来解决这个问题。本文前面说到的就是其中一种方式。window.undefined=window.undefined;咋一看很难理解，写法有点bt，但理解一下就不觉得奇怪了，在较早的浏览器中因为window.undefined不存在所以会返回undefined，将此赋给等号前的window.undefined这样后面就可以直接使用if(a==="undefined")的判断方式了。在新版本的浏览器中window.undefined=undefined；因此不会造成什么负面影响。 
	除了使用window.undefined=window.undefined和window["undefined"]=window["undefined"]外，还有很多别的办法来实现对IE5及之前浏览器的兼容，如 
	var undefined = void null;  //void函数永远返回undefined 
	var undefined = function(){}(); 
	var undefined = void 0; 
	只要等号后的表达式返回undefined即可。 
 */

window.undefined=window.undefined;

var XUHAO={
	version:'3.4.0',
	versionDetail:{
		major:3,
		minor:4,
		patch:0
	}
};

/**
 * [apply description]
 * @param  {[type]} o    objective    [description]
 * @param  {[type]} c    copy     [description]
 * @param  {[type]} defaults [description]
 * @return {[type]}          [description]
 */
XUHAO.apply=function(o,c,defaults){
	if(defaults){
		XUHAO.apply(o,defaults);
	}
	if(o&&c&&typeof c=='object'){
		for(var p in c){
			o[p]=c[p];
		}
	}
	return o;
};


(function(){
	var idSpeed=0,
		toString=Object.prototype.toString,
		ua=navigator.userAgent.toLowerCase(),
		//正则表达式验证方法 主要是浏览器区别
		check=function(r){
			return r.test(ua);
		},
		DOC=document,
		docMode=DOC.documentMode,//IE的私有属性
		//随着IE开始区分标准模式和怪异模式，确定浏览器处于何种模式的需求也就应运而生。IE为document对象添加了一个名为compatMode属性，这个属性的唯一使命就是表示浏览器处于什么模式。
		//如果是标准模式，则document.compatMode的值等于”CSS1Compat“，如果是怪异模式，则document.compatMode的值等于”BackCompat“。
		//后来，Firefox、Opera和Chrome都实现了这个属性。Safari从3.1版开始也实现了document.compatMode
		//IE8又为document对象引入了一个名为documentMode的新属性，其用法如下面的例子所示。这是因为IE8有3中不同的呈现模式，而这个属性正是为了区分这些模式。
		//这个属性的值如果是5，则表示怪异模式（即IE5模式）；如果是7，则表示IE7仿真模式；如果是8，则表示IE8标准模式。
		//documentMode取得的值是真正的IE按照那种模式去解析页面，$.browser.version所取得的IE版本是不准确的【嵌套iframe的时候】，
		//特别是外部嵌套webbrowser的时候，不管是IE8还是IE9，用webbrowser嵌套后用$.browser.version取到的IE版本总是7.0，如果增加了<meta http-equiv="x-ua-compatible" content="IE=5;IE=8;" />这个标记，取到的结果依然是7.0，
		//但是实际上取到的documentMode为8，而页面也是按照IE=8的模式去解析的。由此可以看出，通过$.browser.version取到的版本不是真正页面按照那个IE版本去解析的，而documentMode取得的结果却是IE按照哪个模式进行解析的，documentMode是IE8之后新增的。
		isStrict=DOC.compatMode=='CSS1Compat',
		isOpera=check(/opera/),
		isChrome=check(/\bchrome\b/),//\b表示单词边界
		
		//FireFox是基于 Gecko 开发; 
		//- Webkit：苹果公司自己的内核，google的chrome也使用webkit作为内核。
		 
		isWebkit=check(/webkit/),
		//"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2"
		isSafari=!isChrome&&check(/safari/),
		isSafari2=isSafari&&check(/applewebkit\/4/),
		isSafari3=isSafari&&check(/version\/3/),
		isSafari4 = isSafari && check(/version\/4/),
		isSafari5=isSafari && check(/version\/5/),
		isIE=!isOpera&&check(/msie/),
		isIE7=isIE&&(check(/msie 7/)||docMode==7),
		isIE8=isIE&&(check(/msie 8/)),
		isIE9=isIE&&(check(/msie 9/)),

		isIE10=isIE&&(check(/msie 10/)),
		isIE11=isIE&&(check(/msie 11/)),
		isIEEdge=isIE&&(check(/edge/));
		isIE6=isIE&&!isIE7&&!isIE8&&!isIE9&&!isIE10&&!isIE11&&!isIEEdge,
		isIE9Down=isIE6&&isIE7&&isIE8,

		isGecko=!isWebkit&&check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        
		//判断IE下的特有的盒模型
		//IE 盒子模型的范围也包括 margin、border、padding、content，和标准 W3C 盒子模型不同的是：IE 盒子模型的 content 部分包含了 border 和 pading。
        isBorderBox=isIE&&!isStrict,
        isWindows=check(/windows|win32/),
        isMac=check(/macintosh|mac os x/),
        isAir=check(/adobeair/),
        isLinux=check(/linux/),
        //[səˈkjʊr] 安全的 牢固的
        isSecure=/^https/i.test(window.location.protocol);//用来判断浏览器地址链接是否是安全https


        //修复ie6下图片切换出现卡顿现象的bug
        //很多时候，我们给按钮或者图片设置背景，但为了样式和结构分离，通常背景都在css里面设置，但是IE这一行为会有一个bug，
        //那就是因为IE在默认的情况下，不缓存背景图片。所以当鼠标在有css背景的按钮或者图片移动的时候，图片会闪烁甚至鼠标会出现忙的状态。
        //而在FireFox下没有这个问 题，为了解决这个问题，有两种解决办法，其一是在CSS中加入如下样式：
    if(isIE6){
    	try{
    		DOC.execCommand('BackgroundImageCache',false,true);
    	}catch(e){

    	}
    }

    XUHAO.apply(XUHAO,{

    	SSL_SECURE_URL:isSecure&&isIE?'javascript:""':'about:blank',

    	isStrict:isStrict,//是否是标准模式

    	isSecure:isSecure,

    	isReady:false,

    	enableForcedBoxModel:false,

    	enableGarbageCollector:true,

    	enableListenerCollection:false,

    	enableNestedListenerRemoval:false,

    	USE_NATIVE_JSON:false,

    	applyIf:function(o,c){
    		if(o){
    			for(var p in c){
    				if(!XUHAO.isDefined(o[p])){
    					o[p]=c[p];
    				}
    			}
    		}

    		return o;
    	},

    	id:function(el,prefix){
    		el=XUHAO.getDom(el,true)||{};

    		if(!el.id){
    			el.id=(prefix||'xuhao-gen')+(++idSpeed);
    		}
    		return el.id;
    	},

    	extend:function(){
    		var io=function(o){
    			for(var m in o){
    				this[m]=o[m];
    			}
    		}
    		var oc=Object.prototype.constructor;
    		return function(sb,sp,overrides){
    			if(typeof sp=='object'){
    				//var Dog=extend(Animal,{});
    				overrides=sp;
    				sp=sb;
    				//创建 继承Animal的空函数
    				sb=overrides.constructor!=oc?overrides.constructor:function(){sp.apply(this,arguments);}
    			}
    			var F=function(){},//继承媒介函数
        			sbp, //sb.prototype
        			spp=sp.prototype; //sp.prototype	

        		F.prototype=spp;
        		sbp=sb.prototype=new F();
        		sbp.constructor=sb;	
        		sb.superclass=spp;//指向父类的prototype
        		if(spp.constructor==oc){
        			spp.constructor=sp; //如果是Atypeof sp=='object' 将其指向改为原先指向
        		}
        		sb.override=function(o){
        			XUHAO.override(sb,o);
        		}

        		sbp.superclass=sbp['super']=function(){return spp;};
        		sbp.override=io;
        		XUHAO.override(sb,overrides);
        		sb.extend=function(o){return XUHAO.extend(sb,o);};
        		return sb;
    		}
    	}(),


    	/**
		 * 需要注意的是后面的if判断，IE中for in不能遍历对象的Object的toSting等方法， 
         * 因此需要特别处理一下。IE9 beta重写对象的内置方法如toString后是可用for in遍历的 
		*/

		override: function(origclass, overrides) {
			if (overrides) {
				var p = origclass.prototype;
				XUHAO.apply(p, overrides);
				if (XUHAO.isIE && overrides.hasOwnProperty('toString')) {
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

			for(var i=0;i<len1;i++){
				main=arguments[i];
				ns=main.split('.');
				current=window[ns[0]];
				if(current==undefined){
					current=window[ns[0]]={};
				}
				sub=ns.slice(1);
				len2=sub.length;
				for(var j=0;j<len2;j++){
					current=current[sub[j]]=current[sub[j]]||{};
				}
			}
			return current;
		},



		//地址栏url反格式化
		//var map={key:'123',id:'456'}; value还可以是数组
		//urlEncode(map) "key=123&id=456"
		//urlEncode(map xuhao) "xuhao&key=123&id=456"
		urlEncode:function(o,pre){
			var empty,
				buf=[],
				e=encodeURIComponent;

			XUHAO.iterate(o,function(key,item){
				empty=XUHAO.isEmpty(item);
				XUHAO.each(empty?key:item,function(val){
					var result='';
					if(!XUHAO.isEmpty(val) && (val != key || !empty)){
						if(XUHAO.isDate(val)){
							result=XUHAO.encode(val).replace(/"/g, '');	
						}else{
							result=e(val);
						}
					}
					buf.push("&",e(key),'=',result);
				});

				if(!pre){
					buf.shift();
					pre='';
				}

				return pre+buf.join();

			});
		},


		//urlDecode(window.location.href.split('?')[1])
		//{PrivilegeId: "U2FsdGVkX1+vXtWdFjwLbnBmFB4TE/JrCnn2Hu3bSwc", TL: "20180810"}
		urlDecode:function(string,overwrite){
			//overwrite具有多个相同的参数 true表示覆盖 只保留第一个 false会以数组的形式保存
			//var href='TL=123&TL=789';
			//urlDecode(href,true) Object {TL: "789"}
			//urlDecode(href,false)  Object {TL: Array[2]}
			
			if(XUHAO.isEmpty(string)){
				return {};
			}

			var obj={},
				pairs=string.split('&'),//副词 成对 成双的意思
				d=decodeURIComponent,
				name,
				value;

			XUHAO.each(pairs,function(pair){
				pair=pair.split('=');
				name=d(pair[0]);
				value=d(pair[1]);
				//[].concat(obj[name]).concat(value) 将obj[name]值合并再和value合并
				obj[name]=overwrite||!obj[name]?name:[].concat(obj[name]).concat(value);
			});
			return obj;
		},

		//urlAppend(window.location.href,'xuhao=123')
		//.......?TL=20180810&xuhao=123"
		urlAppend:function(url,s){

			if(!XUHAO.isEmpty(s)){
				url=url+(url.indexOf("?")==-1?'?':'&')+s;
			}

			return url;

		},

		//是将字符串割裂为数组
		//console.log(XUHAO.toArray('xuhao',1,3)); ["u", "h"]
		toArray:function(){
			return isIE?
				function(a,i,j,res){
					res=[];
					for(var x=0,len=a.length;x<len;x++){
						res.push(a[x]);
					}
					return res.slice(i||0,j||res.length);
				}:
				function(a,i,j){

					//主要是ie8以下的BOM伪类不支持 无法转化
					return Array.prototype.slice.call(a,i||0,j||a.length);
				}
		}(),

		isIterable:function(v){	
			//callee 作为arguments的特有属性	
			if(XUHAO.isArray(v)||v.callee){
				return true;
			}
			//判断html元素伪类
			if(/NodeList|HTMLCollection/.test(toString.call(v))){
				return true;
			}

			return (typeof v.nextNode!=undefined||v.item)&&XUHAO.isNumber(v.length);
		},

		each:function(array,fn,scope){

			if(XUHAO.empty(array,true)){
				return;
			}

			//如果不能遍历 或者是基本数据类型 则包装成数组
			if(!XUHAO.isIterable(array)||XUHAO.isPrimitive(array)){
				array=[array];
			}

			for (var i=0,len=array.length; i< len; i++) {
				if(fn.call(scope||array,array[i],i,array)===false){
					return i;
				}
			}
		},

		iterate:function(obj,fn,scope){

			if(XUHAO.isEmpty(obj)){
				return false;
			}

			if(XUHAO.isIterable(obj)){
				XUHAO.each(obj,fn,scope);
				return;
			}else if(typeof obj=='object'){//普通对象的遍历
				for(var prop in obj){
					if(obj.hasOwnProperty(prop)){
						if(fn.call(scope||obj,prop,obj[prop],obj)===false){
							return ;
						}
					}
				}
			}
		},

    	getDom:function(el,strict){
    		if(!el||!DOC){
    			return null;
    		}
    		if(el.dom){
    			return el.dom;
    		}else{
    			if(XUHAO.isString(el)){
    				var e=DOC.getElementById(el);
    				//主要是在IE7以下 name和id是一样的效果 从而要判断其属性名称
    				if(e&&isIE&&strict){
    					if(el==e.getAttribute('id')){
    						return e;
    					}else{
    						return null;
    					}
    				}
    				return e;
    			}else{
    				//如果都不符合条件则返回本来数值
    				return el;
    			}
    		}

    	},

    	getBody:function(){

    		//主要是获取的封装好的库元素而不是原始html元素
    		return XUHAO.get(DOC.body||DOC.documentElement);

    	},

    	getHead:function(){
    		var head;

    		return function(){

    			if(head==undefined){
    				head=XUHAO.get(DOC.getElementsByTagName('head')[0]);
    			}
    		}


    	}(),




    	//数据类型的判断
    	
    	isEmpty:function(v,allowBlank){

    		return v===null||v===undefined||((XUHAO.isArray(v)&&v.length))||(!allowBlank?v==='':false);

    	},

    	isArray:function(v){

    		return toString.apply(v)=='[object Array]';

    	},

    	isDate:function(v){

    		return toString.apply(v)==='[object Date]';

    	},

    	isObject:function(v){

    		return !!v&&toString.apply(v)=='[object Object]';

    	},


    	//是否是原始数据类型
    	isPrimitive:function(v){

    		return XUHAO.isNumber(v)||XUHAO.isString(v)||XUHAO.isBoolean(v);

    	},

    	isFunction:function(v){

    		return toString.apply(v)=='[object Function]';

    	},

    	isNumber:function(v){

    		return typeof v=='number'&& isFinite(v);//[ˈfaɪˌnaɪt]  有限的; [语] 限定的; [数] 有穷的，有限的

    	},

    	isString:function(v){

    		return typeof v=='string';

    	},

    	isBoolean:function(v){

    		return typeof v=='boolean';

    	},

    	isDefined:function(v){

    		return typeof v=='undefined';

    	},

    	//判断是否是HTML元素
    	isElement:function(v){

    		return v?!!!v.tagName:false;

    	},

        isOpera : isOpera,
      
        isWebKit : isWebkit,
       
        isChrome : isChrome,
       
        isSafari : isSafari,
       
        isSafari3 : isSafari3,
        
        isSafari4 : isSafari4,
        
        isSafari2 : isSafari2,
       
        isIE : isIE,
       
        isIE6 : isIE6,
       
        isIE7 : isIE7,
       
        isIE8 : isIE8,
        
        isIE9 : isIE9,

        isIE10:isIE10,

		isIE11:isIE11,

		isIEEdge:isIEEdge,

		isIE9Down:isIE9Down,
        
        isGecko : isGecko,
       
        isGecko2 : isGecko2,
        
        isGecko3 : isGecko3,
        
        isBorderBox : isBorderBox,
       
        isLinux : isLinux,
       
        isWindows : isWindows,
       
        isMac : isMac,
        
        isAir : isAir

    });

	XUHAO.ns=XUHAO.namespace;
})();

XUHAO.ns('XUHAO.util','XUHAO.lib','XUHAO.data','XUHAO.supports');
XUHAO.elCache={};//页面存储所有的封装好的元素，当做缓存使用

XUHAO.apply(Function.prototype,{

	//函数拦截器
	createInterceptor:function(fcn,scope){
		var method=this;

		return !XUHAO.isFunction(fcn)?
				this:
				function(){
					var me=this;
					var args=arguments;

					fcn.target=me;
					fcn.method=method;
					return (fcn.apply(scope||me||window,args)!==false)?
						method.apply(me||window,args):
						null;	
				};
	},
	//就是相当于返回一个执行函数
	createCallback:function(){
		var args=arguments;
		var method=this;
		var fn=function(){
			return method.apply(window,args);
		};
		return fn
	},

	createDelegate:function(obj,args,appendArgs){
		var method=this;

		return function(){
			var callArgs=args||arguments;

			if(appendArgs===true){
				//表示将 arguments添加到args前面
				callArgs=Array.prototype.slice.call(arguments,0);
				callArgs=callArgs.concat(args);
			}else if(XUHAO.isNumber(appendArgs)){
				//如果是数字表示将args添加到其arguments相应位置 前面参数插入后面参数
				callArgs = Array.prototype.slice.call(arguments, 0); 
                var applyArgs = [appendArgs, 0].concat(args); //这地方写的真是牛逼之极了 ，太牛逼了。
                Array.prototype.splice.apply(callArgs, applyArgs); 
			}
			return method.apply(obj||window,callArgs);
		}
	},

	defer:function(millis,obj,args,appendArgs){
		var fn=this.createDelegate(obj,args,appendArgs);

		if(millis>0){
			return setTimeout(fn, millis);
		}
		fn();
		return 0;
	}

});

XUHAO.applyIf(String,{

	format:function(format){
		var args=XUHAO.toArray(arguments,1);
		return format.replace(/\{(\d+)\}/g,function(m,i){
			return args[i]
		});
	}

});

XUHAO.applyIf(Array.prototype,{

	indexOf:function(o,from){
		var len=this.length;
		
		from=from||0;//如果没有指定其开始位置 则从0开始遍历
		from+=(from<0)?len:0;//如果from小于则表示从后面开始位置遍历

		for(;from<len;from++){
			if(this[from]===o){
				return from;
			}
		}
		return -1;
	},

	remove:function(o){
		var index=this.indexOf(o);

		if(index>-1){
			this.splice(index,1);
		}
		return this;
	}

});







