/**
 *DomHelper是对dom操作的基础类
 *采用的单例模式
 *该类配合Template类来一起调用将会非常的方便
 */

XUHAO.DomHelper=function(){
 	var tempTableEl = null,

 		//tag中填写的没有内容的标签 就是不能有子项的标签
 		emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,

 		//table布局中标签的过滤
        tableRe = /^table|tbody|tr|td$/i,

        //用于过滤自定义的属性
        confRe = /tag|children|cn|html$/i,

        tableElRe = /td|tr|tbody/i,
        cssRe = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
        endRe = /end/i,
        pub,
        // kill repeat to save bytes
        afterbegin = 'afterbegin',
        afterend = 'afterend',
        beforebegin = 'beforebegin',
        beforeend = 'beforeend',
        ts = '<table>', //tableStart
        te = '</table>',//tableEnd
        tbs = ts+'<tbody>',//tbodyStart  <table><tbdoy>
        tbe = '</tbody>'+te,//</tbody></table>
        trs = tbs + '<tr>',//<table><tbdoy><tr>
        tre = '</tr>'+tbe;//</tr></tbody></table


	function doInsert(el,o,returnElement,pos,sibling,append){

	}

	//创建html字符串
	function createHtml(o){
		var b='',
			attr,//o对象的属性
			val,//o对象属性值
			key,
			cn; //children node 如果有子节点的情况

		
		if(typeof o ==='string'){
			//如果传入的的字符串
			b=o;
		}else if(XUHAO.isArray(o)){
			//参数的数组 数组内容是相当于dom的兄弟节点
			XUHAO.each(o,function(co,pos){
				if(co){
					b+=createHtml(co);
				}
			});
		}else{
			//参数是对象
			/*{
		        id: 'my-ul',
		        tag: 'ul',//默认的div标签
		        cls: 'my-list', //class
		        htmlFor:'12',//for
		        html:'',//表示子项的html元素
		        children||cn: [
		            {tag: 'li', id: 'item0', html: 'List Item 0'},
		            {tag: 'li', id: 'item1', html: 'List Item 1'},
		            {tag: 'li', id: 'item2', html: 'List Item 2'}
		        ]
		    }*/

		    //如果没有设置标签则默认div同时存入o对象中
		    b+='<'+(o.tag=o.tag||'div');

		    for(var attr in o){
		    	val=o[attr];
		    	// confRe = /tag|children|cn|html$/i,
		    	if(!confRe.test(attr)){
		    		if(typeof val=='object'){
		    			b+=' '+attr+'="';
		    			//style:{width:50px,height:50px;}情况存在
		    			//to
		    			//style="width:50px;height:50px;"
		    			for(key in val){
		    				b+=key+':'+val+';';
		    			}
		    			b+='"';
		    		}else{
		    			//将标签的属性拼入字符串
		    			b+=' '+({cls:'class',htmlFor:'for'}[attr]||attr)+'="'+val+'"';
		    		}

		    	}
		    };

		    //如果tag定义的单闭合标签则结束对cn|children|html的操作
		    if(emptyTags.test(o.tag)){
		    	b+='/>'
		    }else{
		    	b+='>';

		    	if((cn=o.children||o.cn)){
		    		b+=createHtml(cn);
		    	}else if(o.html){
		    		b+=o.html
		    	}
		    	b+='</'+o.tag+'>';
		    }
		}
		return b;
	}

	/**
	 *
	 * 
	 * @param  {[type]} depth [description]
	 * @param  {[type]} s     开始标签
	 * @param  {[type]} h     html内容
	 * @param  {[type]} e     结束内容
	 * @return {[type]}       [description]
	 */
	function ieTable(depth,s,h,e){
		tempTableEl.innerHTML=[s,h,e].join('');
		var i=-1,
			el=tempTableEl,
			ns;

		while(++i<depth){
			el=el.firstChild;
		}

		if(el.nextSibling){
			var df=document.createDocumentFragment();

			while(el){
				ns=el.nextSibling;
				df.appendChild(ns);
				el=ns;
			}
			el=df;
		}
		return el;
	}

	/*因为IE在对innerHTML进行写操作时会检查element是否具备做为这些内容中html对象容器的要求，
	比如将<p>作为容器，它的innerHTML里面放入<li>，马上就会出错。
	更加另人郁闷的地方：<table>  <tbody>  <tr> 在ie中也无法作为innerHTML的容器使用在他们里头加入正确的<td>都不行，
	然而<td>却可以作为容器，放入包括<table>的innerHTML。
	
	只要对table的子项操作才会出现这种情况
	会提示：该操作的目标元件无效。 
	此时要改用dom节点操作节点方法来实现 createDocumentFragment 
	或者参考jquery的写法
	Extjs中并未做此情况的兼容
	*/

	function insertIntoTable(tag,where,el,html){
		var node,
			before;

		tempTableEl=tempTableEl||document.createElement(div);//全局变量保存 不用每次都创建


		//tableElRe = /td|tr|tbody/i,
		if(tag=='td'&&(where==afterbegin||where==beforeend)||!tableElRe.test(tag)&&(where==beforebign||where==afterend)){
			return;
		}	

		if(where==beforebign){
			before=el
		}else{
			if(where==afterend){
				before=el.nextSibling;
			}else{

				if( where == afterbegin){
					before=el.firstChild	
				}else{
					before=null;
				}
			}
		}

		if (where == beforebegin || where == afterend) {
            el = el.parentNode;
        }

        if (tag == 'td' || (tag == 'tr' && (where == beforeend || where == afterbegin))) {
            node = ieTable(4, trs, html, tre);
        } else if ((tag == 'tbody' && (where == beforeend || where == afterbegin)) ||
                   (tag == 'tr' && (where == beforebegin || where == afterend))) {
            node = ieTable(3, tbs, html, tbe);
        } else {
            node = ieTable(2, ts, html, te);
        }

		/*var insertedElement = parentElement.insertBefore(newElement, referenceElement);
			如果referenceElement为null则newElement将被插入到子节点的末尾。如果newElement已经在DOM树中，newElement首先会从DOM树中移除。

			insertedElement 是被插入的节点，即 newElement
			parentElement  是新插入节点的父节点
			newElement 是被插入的节点
			referenceElement 在插入newElement之前的那个节点以后会变成node的下一个兄弟节点*/



		el.insertBefore(node,before);
		return node;

	}

	//主要是IE9下丢失了该方法
	function createContextualFrament(html){
		var div=document.createElement('div'),
			fragment=document.createDocumentFragment(),
			i=0,
			length,
			childNodes;

		div.innerHTML=html;
		childNodes=div.childNodes;
		length=childNodes.lenght;

		for(;i<length;i++){
			fragment.appendChild(childNodes[i].cloneNode(true));
		}

		return fragment;
	}

	var pub={

		//返回是串联好的html标签字符串
		markup:function(o){
			return createHtml(o);
		},

		//将指定的样式应用到元素上面
		applyStles:function(el,styles){
			if(styles){
				var matches;
				
				el=XUHAO.fly(el);
				if(typeof el==='function'){
					styles=styles.call();
				}else if(typeof styles=='string'){
					cssRe.lastIndex=0;

					while ((matches=cssRe.exec(styles))){
						el.setStyles(matches[1],matches[2]);
					}


				}else if(typeof styles==='object'){
					el.setStyles(styles);
				}
			}


		},

		insertHtml:function(where,el,html){
			var hash={},
				hashVal=[],
				range,
				rangeEl,
				setStart,
				frag,
				rs;

			where=where.toLowerCase();

			hash[beforebegin]=['BeforeBegin','previousSibling'];
			hash[afterend]=['AfterEnd', 'nextSibling'];


			/*使用insertAdjacentHTML插入用户输入的HTML内容的时候, 需要转义之后才能使用.
			如果只是为了插入文本内容(而不是HTML节点), 不建议使用这个方法, 
			建议使用node.textContent 或者 node.insertAdjacentText() .
			 因为这样不需要经过HTML解释器的转换, 性能会好一点.*/


			//基本上所有的浏览器都有改函数，只有及其少数不存在
			if(el.insertAdjacentHTML){
				if(tableRe.test(el.tagName)&&(rs=insertIntoTable(el.tagName.toLowerCase(),where,el,html))){
					return rs
				}
				//非表格标签的操作
				hash[afterbegin]=['AfterBegin','firstChild'];
				hash[beforeend]=['BeforeEnd','lastChild'];
				if((hashVal=hash[where])){
					el.insertAdjacentHTML(hash[0],html);
					return el[hash[1]];
				}
			}else{

			/*该方法将创建一个 Range 对象，可以用来表示文档的一个区域或与该文档相关的 DocumentFragment 对象。
			注意，该方法实际上不是由 Document 接口定义的，而是由 DocumentRange 接口定义的。如果一个实现支持 Range 模块，
			那么 Document 对象就会实现 DocumentRange 接口，并定义该方法。IE 6 不支持这个模块。*/
				range = el.ownerDocument.createRange();
                setStart = 'setStart' + (endRe.test(where) ? 'After' : 'Before');
                if (hash[where]) {
                    range[setStart](el);
                    if (!range.createContextualFragment) {
                        frag = createContextualFragment(html);
                    }
                    else {
                        frag = range.createContextualFragment(html);
                    }
                    el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
                    return el[(where == beforebegin ? 'previous' : 'next') + 'Sibling'];
                } else {
                    rangeEl = (where == afterbegin ? 'first' : 'last') + 'Child';
                    if (el.firstChild) {
                        range[setStart](el[rangeEl]);
                        if (!range.createContextualFragment) {
                            frag = createContextualFragment(html);
                        }
                        else {
                            frag = range.createContextualFragment(html);
                        }
                        if(where == afterbegin){
                            el.insertBefore(frag, el.firstChild);
                        }else{
                            el.appendChild(frag);
                        }
                    } else {
                        el.innerHTML = html;
                    }
                    return el[rangeEl];
                }

			}

		},

		insertBefore:function(el, o, returnElement){
			return doInsert(el, o, returnElement, beforebegin);	
		},

		insertAfter:function(el, o, returnElement){
			return doInsert(el, o, returnElement, afterend, 'nextSibling');
		},

		insertFirst:function(el, o, returnElement){
			return doInsert(el, o, returnElement, afterbegin, 'firstChild');
		},

		append:function(el, o, returnElement){
			return doInsert(el, o, returnElement, beforeend, '', true);
		},

		overwirte:function(el, o, returnElement){
			el = Ext.getDom(el);
            el.innerHTML = createHtml(o);
            return returnElement ? Ext.get(el.firstChild) : el.firstChild;
		},

		createHtml:createHtml
	}

	return pub;
}();