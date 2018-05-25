var SimpleAnim={
	Developer:{
		author:'dds@NanJing',
		email:'xuhao20088002@163.com',
		qq:'534951063',
		time:'2018-05-23',
		job:'急需一份可以养家糊口的前端工作',
		version:'0.0.1'
	}
};

SimpleAnim.copy=function(obj,copy,defaults){

	if(defaults&&(typeof defaults=='object')){
		SimpleAnim.copy(obj,defaults);
	}

	if(obj&&copy&&(typeof copy=='object')){
		
		for(var name in copy){
			obj[name]=copy[name];
		}
	}

	return obj;
};


(function(){
	var Doc=document,
		view=Doc.defaultView,
		toString=Object.prototype.toString;
		classTypes={
			'[object Boolean]':'boolean',
			'[object Number]':'number',
			'[object String]':'string',
			'[object Function]':'function',
			'[object Array]':'array',
			'[object Date]':'date',
			'[object RegExp]':'regExp',
			'[object Object]':'object',
			'[object Error]':'error'
		};

	SimpleAnim.copy(SimpleAnim,{

		
		//用于判断数据类型
		type:function(obj){
			
			if(obj==null||obj==undefined){
				return obj+'';
			}

			return classTypes[toString.call(obj)]?classTypes[toString.call(obj)]:'object';
		},

		isObject:function(obj){
			return this.type(obj)=='object';
		},

		getDom:function(el){
			return el;
		},

		copyIf:function(obj,copy){
			if(obj){
				for(var name in copy){
					if(obj[name]!='undefined'){
						obj[name]=copy[name];
					}
				}
			}
		}

	});


	

})()

/**
 * 给数组添加没有的方法
 */
SimpleAnim.copyIf(Array.prototype,{

	indexOf:function(o,from){
		var len=this.length;
		from=from||0;
		from+=(from<0)?len:0;
		for(;from<len;++from){
			if(this[from]==o){
				return from;
			}
		}
		return from;
	},

	remove:function(o){
		var index=this.indexOf(o);
		
		if(index>-1){
			this.splice(index,1);
		}
		return this;
	}

});


/**
 * 封装DOM元素
 * @return {[type]} [description]
 */
(function(){
	var Doc=document,
		view=Doc.defaultView,
		opacityRe=/alpha\(opacity=(.*)\)/i,
		camelRe=/(-[a-z])/gi,
		propCache={},
		El=SimpleAnim.Element;

	SimpleAnim.Element=function(element){
		var dom=typeof element=='string'?
			Doc.getElementById(element):element;

		this.dom=dom;
		this.id=dom.id||(new Date().getTime());
		this.dom.id=this.id;
	};

	function camelFn(m, a) {
        return a.charAt(1).toUpperCase();
    }

	function chkCache(prop){
		return propCache[prop]||(propCache[prop] = prop == 'float' ? ('cssFloat') : prop.replace(camelRe,camelFn));
	}




	SimpleAnim.Element.prototype={


		getStyle:function(){
			return view&&view.getComputedStyle?
				function(prop){
					var dom=this.dom;
					var v=null;
					var retValue;

					if(dom==Doc)return null;
					prop=chkCache(prop);

					v=view.getComputedStyle(dom,null);
					if(v[propCache[prop]]){
						retValue=v[propCache[prop]];
					}else if(v=dom.style[prop]){
						retValue=v[propCache[prop]];
					}
					return retValue;
				}:
				function(prop){
					var dom=this.dom;
					var m;
					var cs;

					if(dom==Doc)return null;

					if(prop=='opacity'){
						if(dom.style.filter.match){
							if(m=dom.stle.filter.match(opacityRe)){
								var fv=parseFloat(m[1]);
								if(!isNaN(fv)){
									return fv?fv/100:0;
								}
							}
						}
						return 1;
					}
					prop=chkCache(prop);
					return ((cs = dom.currentStyle) ? cs[prop] : null)||dom.style[prop];
				}
		}(),

		setStyle:function(prop,value){
			var temp,
				style,
				dom=this.dom;

			if(!SimpleAnim.isObject(prop)){
				temp={};
				temp[prop]=value;
				prop=temp;
			}
			for(style in prop){
				value=prop[style];
				
				if(style=='opacity'){
					 dom.style.filter = 'alpha(opacity:'+(value)+')';  
                     dom.style.opacity = value;  
				}else{
					dom.style[chkCache(style)]=value;
				}

			}
		}

	}


})()


