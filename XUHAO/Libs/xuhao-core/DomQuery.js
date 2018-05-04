/**
 *DOM查询的基础方法
 *
 */
/**
 * 记录没有兼容性的节点方法
 * 1.firstChild
 * 2.lastChild
 * 3.nextSibling
 * 4.previousSibling
 * 5.removeChild
 * 6.childNodes
 *
 *
 * node.nodeValue
 *
 * 
 */
XUHAO.DomQuery=function(){
	var cache={},
		simpleCache={},
		valueCache={},
		nonSpace=/\S/,//\S 匹配所有非空白，而 \w 只匹配单词字符，等价于 [a-zA-Z0-9_] 
		trimRe=/^\s+|\s+$/g,
		tplRe=/\{(\d+)\}/g,//{ 0 }
		modeRe=/^(\s?[\/>+~]\s?|\s|$)/,//
		tagTokenRe = /^(#)?([\w\-\*]+)/,
		nthRe=/(\d*)n\+?(\d*)/, 
		nthRe2 = /\D/,
		isIE=window.ActiveXObjext?true:false,
		key=30803;

		//主要是给元素节点添加—个标识，标识该节点是否已经进行过nodeIndex索引
		//用eval写法是防止变量名称在压缩是被替换点
	eval("var batch=30803;");

	/**
	 * 查找元素下的子节点
	 * @param  {[type]} parent [description]
	 * @param  {[type]} index  [description]
	 * @return {[type]}        [description]
	 */
	function child(parent,index){
		var i=0,
			n=parent.firstChild;

		while(n){
			if(n.nodeType==1){
				if(++i==index){
					return n;
				}
			}
			n=n.nextSibling;
		}
		return null;
	}

	/**
	 * 查找兄弟节点
	 * @param  {[type]}   n [description]
	 * @return {Function}   [description]
	 */
	function next(n){

		while((n=n.nextSibling)&&n.nodeType!=1);

		return n;
	}

	/**
	 * 查找上一个兄弟节点
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	function prev(n){
		while((n=n.previousSibling)&&n.nodeType!=1);
		return n;
	}
	
	/**
	 * 在每个子节点上标记一个节点索引，并删除空文本节点。
	 * 只是遍历了parent节点下的子节点 不包括孙节点
	 * @param  {[type]} parent [description]
	 * @return {[type]}        [description]
	 */
	function children(parent){
		var n=parent.firstChild,
			nodeIndex=-1,
			nextNode;

		while(n){
			nextNode=n.nextSibling;
			if((n.nodeType==3)&&nonSpace.test(n.nodeValue)){
				parent.removeChild(n);
			}else{
				n.nodeIndex=++nodeIndex;
			}
			n=nextNode;
		}

		return this;
	}

	/**通过class获取节点集合
	 * nodeSet 是节点数组
	 * [byClassName description]
	 * @return {[type]} [description]
	 */
	function byClassName(nodeSet,cls){
		if(!cls){
			return nodeSet;
		}

		var result=[],ri=-1;

		for(var i=0,ci;ci=noseSet[i];i++){
			if((' '+ci.className+' ').indexOf(cls)!=-1){
				result[++ri]=ci;
			}
		}
		return result;
	}

	/**
	 * 返回的是标签的属性值 有几个要特殊处理
	 * label标签的for---->htmlFor
	 * class--->className
	 * @param  {[type]} m    [description]
	 * @param  {[type]} attr [description]
	 * @return {[type]}      [description]
	 */
	function attrVale(n,attr) {
		//如果n是数组怎取其第一个值
		if(!n.tagName&&typeof n.length!=undefined){
			n=n[0];
		}

		if(!n){
			return null;
		}

		if(attr=='for'){
			return n.htmlFor;
		}

		if(attr=='class'||attr=='className'){
			return n.className;
		}
		//作了兼容低版本的IE
		return n.getAttribute(attr)||n[attr];
	}

	/**
	 * [getNodes description]
	 * @param  {[type]} ns      [nodes]
	 * @param  {[type]} mode    [false, /, >, +, ~]
	 * @param  {[type]} tagName [description]
	 * @return {[type]}         [defaults to "*"]
	 */
	function getNodes(ns,mode,tagName) {
		var result=[],ri=-1,cs;

		if(!ns){
			return result;
		}	

		//判断是不是dom节点 不能是使用tagName来判断 有可能是document类型 切记
		if(typeof ns.getElementsByTagName!='undefined'){
			ns=[ns];
		}

		//不存在选择的模式则将所有符合的标签全部选中
		if(!mode){
			for(var i=0,ni;ni=ns[i];i++){
				cs=ni.getElementsByTagName(tagName);
				for(var j=0,cj;ci=cs[j];j++){
					result[++ri]=cj;
				}
			}
		}else if(mode=='/'||mode=='>'){
			//选择元素下所有的tagName的子元素

			var utag=tagName.toUpperCase();

			for(var i=0,ni,cn;ni=ns[i];i++){
				cn=ni.childNodes;
				for(var j=0,cj;ci=cn[i];j++){
					if(cj.nodeName==utag||cj.nodeName==tagName||tagName=='*'){
						result[++ri]=cj;
					}
				}
			}
		}else if(mode=='+'){
			//选取指定元素下面的第一个符合的TagName兄弟元素
			//对于 IE8 及更早版本的浏览器中的 element+element必须声明 <!DOCTYPE>。
			var utag=tagName.toUpperCase();
			for(var i=0,ni;ni=ns[i];i++){
				ni=next(ni);
				//while((ni=ni.nextSibling)&&ni.nodeType!=1);
				if(ni.nodeName==utag||ni.nodeName==tagName||tagName=="*"){
					result[++ri]=ni;
				}
			}

		}else if(mode=='~'){
			//目标元素下面所有符合的兄弟节点tagName + 符合是取第一个 这个是取所有的
			var utag=tagName.toUpperCase();

			for(var i=0,ni;ni=ns[i];i++){
				while((ni=ni.nextSibling)){
					if(ni.nodeName==utag||ni.nodeName==tagName||tagName=="*"){
						result[++ri]=ni;
					}
				}
			}	
		}

		return result;

	}

	/**
	 * 数组的合并 分为真数组和伪数组的判别,
	 * 一个工具方法而已
	 * [concat description]
	 * @return {[type]} [description]
	 */
	function concat(a,b){
		if(b.slice){
			return a.concat(b);
		}

		for(var i=0,l=b.length;i<l;i++){
			a[a.length]=b[i];//这里很巧妙
		}
		return a;
	}

	/**
	 * [byTag description]
	 * @param  {[type]} cs      [description]
	 * @param  {[type]} tagName [description]
	 * @return {[type]}         [description]
	 */
	function byTag(cs,tagName) {
		if(cs.tagName||cs==document){
			cs=[cs];
		}
		if(!cs){
			return cs;
		}

		var result=[],ri=-1;

		tagName=tagName.toUpperCase();
		for(var i=0,ci;ci=cs[i];i++){
			if(ci.nodeType==1&&ci.tagName.toUpperCase()==tagName){
				result[++ri]=ci;
			}
		}
		return result;
	}

	function byId(cs,id) {
		if(cs.tagName||cs==document){
			cs=[cs];
		}
		if(!cs){
			return cs;
		}		

		var result=[],ri=-1;

		for(var i=0,ci;ci=cs[i];i++){
			if(ci&&ci.id==id){////这里存在问题，因为IE下表单元素的id值不能为"id"《IE6的getElementById bug》
				result[++ri]=ci;
				return result;//这里主要是因为id是唯一的找到目标立刻跳出
			}
		}
		return result;
	}

	/**
	 * operators are =, !=, ^=, $=, *=, %=, |= and ~=
	 * @param  {[type]} cs     [description]
	 * @param  {[type]} attr   [description]
	 * @param  {[type]} value  [description]
	 * @param  {[type]} op     [description]
	 * @param  {[type]} custom [ "{" ]
	 * @return {[type]}        [description]
	 */
	
	 /**
	  *流程图
	  *
	  *判断ci是否是xml元素
	  *在根据attr获取相应的value
	  *然后通过operaters比较看是否获取的值与输入的值是否相等
	  *最后将符合条件的元素以数组的方式返回
	  * 
	  */
	function byAttribute(cs,attr,value,op,custom){
		var result=[],
			ri=-1,
			useGetStyle=custom=='{',//是否是样式选择器判断{width=200}
			fn=XUHAO.DomQuery.operaters[op],//选择器操作函数
			a,
			xml,
			hasXml;

		for(var i=0,ci;ci=cs[i];i++){
			if(ci.nodeType!=1){
				continue;
			}

			//判断是不是xml节点元素
			if(!hasXml){
				//只要判断一个节点元素就可以判断出是否是xml元素了
				xml=XUHAO.DomQuery.isXml(ci);
				hasXml=true;
			}
			if(!xml){
				//样式选择器
				//["[id=c1]", "[", "id", "=", "", "c1", index: 0, input: "[id=c1]"]
				//["{width=200}", "{", "width", "=", "", "200", index: 0, input: "{width=200}"]
				//n, "{2}", "{5}", "{3}", "{1}"
				if(useGetStyle){
					a=XUHAO.DomQuery.getStyle(ci,attr);
				}else if(attr=='class'||attr=='className'){
					a=ci.className;
				}else if(attr=='for'){
					a=ci.htmlFor;
				}else if(attr=='href'){
					//兼容了IE6,7 会返回的是完整浏览器。现代浏览器返回的是相对路径
					a=ci.getAttribute('href',2);
				}else{
					a=ci.getAttribute(attr);
				}
			}else{
				a=ci.getAttribute(attr);
			}

			if((fn&&fn(a,value))||(!fn&&a)){
				result[++ri]=ci;
			}

		}
		return result;
	}

	//伪类选择器调用想用的选择方法
	function byPseudo(cs,name,value){
		return XUHAO.DomQuery.pseudo[name](cs,value);	
	}

	function nodupIEXml(cs){
		var d=++key,
			r;

		cs[0].setAttribute('_nodup',d);
		r=[cs[0]];

		for(var i=1,ci;ci=cs[i];i++){
			if(ci.getAttribute('_nodup')!=d){
				ci.setAttribute('_nodup')=d;
				r[r.length]=ci;
			}
		}

		//移除添加的_nodup属性

		for(var i=0,ci;ci=cs[i];i++){
			ci.removeAttribute('_nodup');
		}

		return r;
	}


	//去重
	function nodup(cs) {
		if(!cs){
			return [];
		}

		var len=cs.length,ci,i,j,r=cs,cj,ri=-1;

		if(!len||cs.nodeType!=undefined||len==1){
			return cs;
		}

		if(isIE&&typeof cs[0].selectSingleNode!=undefined){
			return nodupIEXml(cs);
		}

		var d=++key;

		cs[0]._nodup=d;

		//[a,b,c,a,b,d,e,c,f]
		//
		/**
		 *去重的流程
		 *1)[a,b,c] i=2 j=0 集合A
		 *
		 *2)[b,d,e,c,f] j=3 集合B
		 *
		 *3)集合A和集合B两个并集 并且去掉重复部分
		 * 
		 */

		for(var i=0;ci=cs[i];i++){
			if(ci._nodup!=d){
				ci._nodup=d;
			}else{
				var r=[];
				for(var j=0,cj;j<i;j++){
					r[++ri]=cs[j]//先将未重复的部分放入结果集中
				}

				for(j=i+1;cj=cs[j];j++){
					if(cj._nodup!=d){
						cj._nodup=d;
						r[++ri]=cj;
					}
				}
				return r;
			}
		}

	}

	function quickDiffIEXml(){
		var d = ++key,
            r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
	}

	//获取c2和c1不同的部分
	function quickDiff(c1,c2){
		var len1=c1.length,
			d=++key,
			ri=-1;
			r=[];

		if(!len1){
			return c2;
		}
		if(isIE&&typeof c1[0].selectSingleNode!=undefined){
			quickDiffIEXml(c1,c2);
		}
		for(var i=0,c1i;c1i=c1[i];i++){
			c1i._qdiff=d;
		}
		for(var i=0,c2i;c2i=c2[i];i++){
			if(c2i._qdiff!=d){
				r[++ri]=c2i;
			}
		}

		return r;
	}

	function quickId(ns,mode,root,id){
		if(ns=='root'){
			var d=root.ownerDocument||root;
			return d.getElementById(id);
		}

		ns=getNodes(ns,mode,'*');
		return byId(ns,id);
	}

	return {

		getStyle:function(el.name){
			return XUHAO.fly(el).getStyle(name);
		},

		//编译查询元素函数
		//console.log(Ext.DomQuery.jsSelect('///#c0/#c00'));
		//console.log(Ext.DomQuery.jsSelect('div#parent:first-child'));
		compile:function(path,type){
			type==type||"select";

			var fn=["var f=function(root){\n var mode;++batch;var n=root||document;\n}"],
				mode,
				lastPath,
				matchers=XUHAO.DomQuery.matchers,
				matcherLn=matchers.length,
				modeMatch,
				lmode=path.match(modeRe);// modeRe=/^(\s?[\/>+~]\s?|\s|$)/, 

			//如果path是以 空格 / > + ~开始的情况下
			if(lmode&&lmode[1]){
				fn[fn.length]="mode="+lmode[1].replace(trimRe,"")+";";
				path=path.replace(trimRe,"")
			}

			//如果path是///#c0/#c00过滤掉最开始端的/符号  就是带状符号连接的path
			while(path.substr(0,1)=='/'){
				path=path.substr(1);
			}

			while(path&&lastPath!=path){
				lastPath=path;
				var tokenMatch=path.match(tagTokenRe);

				//tagTokenRe=/^(#)?([\w\-\*]+)/,判断是标签 # 或者通配符选择器
				
				if(type=="select"){
					if(tokenMatch){
						//表示id选择器 ["#c0", "#", "c0", index: 0, input: "#c0/#c00"]
						if(tokenMatch[1]=="#"){
							fn[fn.length]="n=quickId(n,mode,root,'"+tokenMatch[2]+"')";
						}else{
							fn[fn.length]="n=getNodes(n,mode,'"+tokenMatch[2]+"')";
						}
						//继续查询下一级的选择器
						path=path.replace(tokenMatch[0], "");
					}else if(path.substr(0, 1) != '@'){
						//如果都不符合上面的条件则查询所有的标签
						fn[fn.length] = 'n = getNodes(n, mode, "*");';
					}
				}else{
					//简单选择
					 if(tokenMatch){
                        if(tokenMatch[1] == "#"){
                            fn[fn.length] = 'n = byId(n, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tokenMatch[2]+'");';
                        }
                        path = path.replace(tokenMatch[0], "");
                    }
				}

				//此类查询的类 伪类 属性选择 @ 以及以id开始查询
				while(!(modeMatch=path.match(modeRe))){
					var matched=false;
					for(var j=0;j<matchers.length;j++){
						var t=matchers[j];
						var m=path.match(t.re);//查找匹配的选择器模式

						if(m){
							fn[fn.length]=t.select.replace(tplRe,function(x,i){return m[i]});
							path=path.replace(m[0],"");
							matched=true;
							break;
						}
					}
					if(!matched){
						throw "path没有可以匹配的项";
					}
				}

				//设置下一次查询符号
				if(modeMatch[1]){
					fn[fn.length] = 'mode="'+modeMatch[1].replace(trimRe, "")+'";';
                    path = path.replace(modeMatch[1], "");
				}
			}

			fn[fn.length]="return nodup(n);\n}";
			eval(fn.join(""));
			return f;
		},

		/**
		 * 选择符合条件的dom元素
		 * @param  {[type]} path [选择符]
		 * @param  {[type]} root [选择的起点]
		 * @param  {[type]} type [是采用选择器（select）或者简单的id或者标签选择方法]
		 * @return {[type]}      [description]
		 */
		jsSelect:function(path,root,type){
			root=root||document;

			//root如果是字符传则表示的是id
			if(typeof root=='string'){
				root=document.getElementById(root);
			}

			var paths=path.split(',');
			var results=[];

			for(var i=0,len=paths.length;i<len;i++){
				var subPath=paths[i].replace(trimRe,"");
				if(!cache[subPath]){
					cache[subPath] = XUHAO.DomQuery.compile(subPath);
					if(!cache[subPath]){
						throw subPath +'不是正确的选择器'
					}
				}

				var result=cache[subPath](root);
				if(result&&result!=document){
					results=results.concat(result);
				}

			}



		},

		isXml:function(el){
			var docEl=(el?el.ownerDocument||el:0).documentElement;
			return docEl?docEl.nodeName!="HTML":false;
		},

		select:!document.querySelectorAll?
			function(path,root,type){
				root=root||document;

				if(!XUHAO.DomQuery.isXml(root)){
					try{
						var cs=root.querySelectorAll(path);
						return XUHAO.toArray(cs);
					}catch(e){}
				}
				return XUHAO.DomQuery.jsSelect.call(this, path, root, type);
			}
			:
			function(path,root,type){
				return XUHAO.DomQuery.jsSelect.call(this,path,root,type);
			},

			
		selectNode:function(path,root){
			 return XUHAO.DomQuery.select(path, root)[0];
		},

		selectValue:function(path,root,defaultValue){
			path=path.replace(trimeRe,"");

			//存储查找的编译的函数
			if(!valueCache[path]){
				valueCache[path]=XUHAO.DomQuery.compile(path,'select');
			}
			var n=valueCache[path](root),v;
			n=n[0]?n[0]:n;
			if(typeof n.normalize=='function'){
				n.normalize();
			}
			v=(n&&n.firstChild?n.firstChild.nodeValue:null);
			return ((v === null||v === undefined||v==='') ? defaultValue : v);
		},

		selectNumber:function(path, root, defaultValue){
			var v = XUHAO.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
		},

		/**
		 * 如果所给的元素与简易选择符相匹配，则返回 true（例如：div.some-class 或者 span:first-child） 
		 * @param  {[type]}  el [description]
		 * @param  {[type]}  ss [simple selector]
		 * @return {Boolean}    [description]
		 */
		is:function(el, ss){
			if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
            	result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
		},

		//nonMatches 如果值为 true，将返回与选择符不匹配的元素，而不是匹配的元素 
		filter:function(els, ss, nonMatches){
			 ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = XUHAO.DomQuery.compile(ss, "simple");
            }

            var r= function (root){
                var mode; ++batch;
                var n = root || document;
                n = byId(n, "getStyle2");
                mode=">";
                n = byClassName(n, " class1 ");
                return nodup(n);
            }
            result=r(els);

            return nonMatches ? quickDiff(result, els) : result;

		},

		matchers:[
			{
				//class选择器
				//只能匹配.(数字|字母|_|-) 格式开始的类名
				re:/^\.([\w\-]+)/,
				select: 'n = byClassName(n, " {1} ");'
			},
			{
				//伪类匹配模式
				re: /^\:([\w\-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
			},
			{
                //属性匹配模式
                //可以匹配两种模式[title^='name']|{width=200}
                re: /^(?:([\[\{])(?:@)?([\w\-]+)\s?(?:(=|.=)\s?(["']?)(.*?)\4)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{5}", "{3}", "{1}");'
            },
            {
                //id匹配模式
                re: /^#([\w\-]+)/,
                select: 'n = byId(n, "{1}");'
            },
            {
                re: /^@([\w\-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
		],

		operators:{
			'=':function(a,v){
				return a==v;
			},

			'!=':function(a,v){
				return a!=v;
			},

			'^=':function(a,v){
				return a&&a.substr(0,v.length)==v;
			},

			'$=':function(a,v){
				return a&&a.substr(a.length-v.lenght)==v;
			},

			'*=':function(a,v){
				return a&&a.indexOf(v)!=-1;
			},

			'%=':function(a,v){
				return (a%v)==0;
			},

			//以v开头并且-两字符的属性或者等于相等
			'|=':function(a,v){
				return a&&a(a==v||a.substr(0,v.length+1)==v+'-');
			},

			//a中包含单词v的目标元素
			'~=':function(a,v){
				return a&&(' '+a+' ').indexOf(' '+v+' ')!=-1;
			}
		},

		pseudos:{

			'first-child':function(c){
				var r=[],ri=-1,n;

				for(var i=0,ci;ci=n=c[i];i++){
					while((n=n.previousSibling&&n.nodeType!=1)){}
					if(!n){
						r[++ri]=ci;
					}
				}
				return r;
			},

			'last-child':function(c){
				var r=[],ri=-1,n;

				for(var i=0,ci;ci=n=c[i];i++){
					while((n=n.nextSibling&&n.nodeType!=1)){}
					if(!n){
						r[++ri]=ci;
					}
				}
				return r;
			},

			//nth 表示的不定序数 n+th 第n个  sixth fifth.....
			//存在功能不全 不能识别n+5,-n+5 3n+1等模式
			//存在问题 待以后复习解决
			'nth-child':function(c,a){
				var r=[],ri=-1,
					// ["2n", "2", "", index: 0, input: "2n"]
					// ["2n+1", "2", "1", index: 0, input: "2n+1"]
					// ["n+2", "", "2", index: 0, input: "n+2"] a=2
					m=nthRe.exec(a=='even'&&'2n'||a=='odd'||'2n+1'||!nthRe2.test(a)&&"n+"+a||a),

			},

			"only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    //存在在上一个节点和下一个节点
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            //表示节点下面不存在文本节点和元素节点
            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return XUHAO.DomQuery.filter(c, ss, true);
            },


            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }

		}
	};
	
}();

XUHAO.query=XUHAO.DomQuery.select;