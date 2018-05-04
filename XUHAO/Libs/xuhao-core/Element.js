/**
 * 封装元素，将dom包括其中 同时提供dom兼容的解决方案
 */
(function(){
	var DOC=document;
	var DH=XUHAO.DomHelper;
	var El=XUHAO.Element;
	var EC=XUHAO.elCache;

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

		set:function(){

		},

		


	}



})()
