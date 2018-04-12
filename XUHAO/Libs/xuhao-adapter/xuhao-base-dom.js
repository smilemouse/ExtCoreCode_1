/*
	什么是document.body？ 返回html dom中的body节点 即<body>
	什么是 document.documentElement？返回html dom中的root 节点 即<html>
	document.documentElement 与 document.body的应用场景

	获取 scrollTop 方面的差异

	在chrome(版本 52.0.2743.116 m)下获取scrollTop只能通过document.body.scrollTop,而且DTD是否存在,不会影响 document.body.scrollTop的获取。
	通过console查看结果：

	demo 1 with doctype : http://jsbin.com/cisacam 

	demo 2 without doctype: http://jsbin.com/kamexad/16
	复制代码
	 
	在firefox(47.0)及 IE(11.3)下获取scrollTop，DTD是否存,会影响document.body.scrollTop 与 document.documentElement.scrollTop的取值

	在firefox(47.0)

	页面存在DTD，使用document.documentElement.scrollTop获取滚动条距离；

	页面不存在，使用document.body.scrollTop 获取滚动条距离

	demo 1 with doctype : http://jsbin.com/cisacam 

	demo 2 without doctype: http://jsbin.com/kamexad/16

	IE(11.3)

	页面存在DTD，使用document.documentEelement.scrollTop获取滚动条距离

	页面不存在DTD,使用document.documentElement.scrollTop 或 document.body.scrollTop都可以获取到滚动条距离

	demo 1 with doctype : http://jsbin.com/cisacam 

	demo 2 without doctype: http://jsbin.com/kamexad/16


	总结
	页面具有 DTD，或者说指定了 DOCTYPE 时，使用 document.documentElement。

	页面不具有 DTD，或者说没有指定了 DOCTYPE，时，使用 document.body。

	在 IE 和 Firefox 中均是如此。

	兼容解决方案：

	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
 */



(function(){
	var DOC=document,
		DOCBODY=DOC.documentElement||Doc.body,
		isCSS1=DOC.compatMode=='CSS1Compat',
		MAX=Math.max,
		ROUND=Math.round,
		PARSEINT=parseInt;

	XUHAO.lib.Dom={

		//[ˈænˌsɛstɚ] 祖先，祖宗; 被继承人; 原型; （动物的） 原种，先祖;
		isAncestor:function(p,c){
			var ret=false;

			p=XUHAO.getDom(p);
			c=XUHAO.getDom(c);

			if(p&&c){
				if(p.contains){
					//这个方法起先用在 IE ，用来确定 DOM Node 是否包含在另一个 DOM Element 中。
					return p.contains(c);
				}else if(p.compareDocumentPosition){ //现代主流支持 IE8+
					//这个方法是 DOM Level 3 specification 的一部分，允许你确定 2 个 DOM Node 之间的相互位置。
					//这个方法比 .contains() 强大。这个方法的一个可能应用是排序 DOM Node 成一个详细精确的顺序，
					//该方法IE6~8是不支持的
					//Bits          Number        Meaning 
					//000000         0              元素一致 
					//000001         1              节点在不同的文档（或者一个在文档之外） 
					//000010         2              节点 B 在节点 A 之前 
					//000100         4              节点 A 在节点 B 之前 
					//001000         8              节点 B 包含节点 A 
					//010000         16             节点 A 包含节点 B 
					//100000         32             浏览器的私有使用
					
					return !!(p.compareDocumentPosition(c)&16);
				}else{
					while(c=c.parentNode){
						ret=c==p||ret;
					}
				}	
			}

			return ret;
		},

		getViewWidth:function(full){

			return full?this.getDocumentWidth():this.getViewportWidth();

		},

		getViewHeight:function(full){
			return full?this.getDocumentHeight():this.getViewportHeight();
		},

		getDocumentHeight:function(){

			return MAX(!isCSS1?DOC.body.scrollHeight:DOC.documentElement.scrollHeight,this.getViewportHeight())

		},

		getDocumentWidth:function(){

			return MAX(!isCSS1?DOC.body.scrollWidth:DOC.documentElement.scrollWidth,this.getViewportWidth())

		},

		getViewportHeight:function(){
			//self.innerHeight; window  获取的是浏览器窗口的大小
			return XUHAO.isIE?DOCBODY.clientHeight:self.innerHeight;

		},

		getViewportWidth:function(){
			return !isCSS1&&!XUHAO.isOpera?
				DOC.body.clientWidth:
				XUHAO.isIE9Down?DOC.documentElement.clientWidth:self.innerWidth;
		},

		getY:function(el){


		},

		getX:function(el){


		},

		getXY:function(el){

		},

		setXY:function(el,xy){


		},

		setX:function(el,x){


		},

		setY:function(el,y){


		}


	}


})()


/*
	理解 client-*,scroll-*,offset-*

	1.offsetWidth和offsetHeight

		任何HTML元素的只读属性offsetWidth和offsetHeight已CSS像素返回它的屏幕尺寸，
		返回的尺寸包括元素的边框和内边距（width/height + border + padding），和滚动条。
		注: 是没有外边距的


	2.offsetLeft & offsetTop
		
		所有HTML元素拥有offsetLeft和offsetTop属性来返回元素的X和Y坐标
			1)相对于已定位元素的后代元素和一些其他元素（表格单元），这些属性返回的坐标是相对于祖先元素
			2)一般元素，则是相对于文档，返回的是文档坐标
		offsetParent属性指定这些属性所相对的父元素，如果offsetParent为null，则这些属性都是文档坐标

	3.client是一种间接指代，它就是web浏览器客户端，专指它定义的窗口或视口。
	
		clientWidth & clientHeight
		clientWidth和clientHeight类似于offsetWidth和offsetHeight，
		不同的是不包含边框大小（width/height + padding）。
		同时在有滚动条的情况下，clientWidth和clientHeight在其返回值中也不包含滚动条。

		对于类似<i>;、<code>;、<span>;等内联元素，总是返回0

		clientLeft & clientTop
		返回元素的内边距的外边缘和他的边框的外边缘的水平距离和垂直距离，
		通常这些值就等于左边和上边的边框宽度。

		在有滚动条时，并且浏览器将这些滚动条放置在左侧或顶部（反正我是没见过），
		clientLEft和clientTop就包含这些滚动条的宽度。

	4.scrollWidth & scrollHeight
		这两个属性是元素的内容区域加上内边距，在加上任何溢出内容的尺寸.
		因此，如果没有溢出时，这些属性与clientWidth和clientHeight是相等的。

	5.scrollLeft & scrollTop
		指定的是元素的滚动条的位置
		scrollLeft和scrollTop都是可写的属性，通过设置它们来让元素中的内容滚动。

 */