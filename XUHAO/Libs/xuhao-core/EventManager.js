XUHAO.EventManager=function(){
	var docReadyEvent,
		docReadyProcId,
		docReadyState=false,
		DETECT_NATIVE=XUHAO.isGecko||XUHAO.isWebKit||XUHAO.isSafari,
		E=XUHAO.lib.Event,
		D=XUHAO.lib.Dom,
		DOC=document,
		WINDOW=window,
		DOMCONTENTLOADED='DOMContentLoaded',
		COMPLETE='complete',
		propRe=/^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
		specialElCache=[];


	//获取dom对象的id
	function getId(el){
		var id=false,
			i=0,
			len=specialElCache.length,
			skip=false,
			o;

		if(el){
			if(el.getElementById||el.navigator){
				for(;i<len;i++){
					o=specialElCache[i];
					if(o.el===el){
						id=o.id;
						break;
					}
				}
				if(!id){
					id=XUHAO.id(el);
					specialElCache.push({
						id:id,
						el:el
					});
					skip=true;//防止被垃圾回收机制给回收掉
				}
			}else{
				id=XUHAO.id(el);
			}

			if(!XUHAO.elCache[id]){
				XUHAO.Element.addToCache(new Ext.Element(el), id);
				if(skip){
					XUHAO.elCache[id].skipGC=true;
				}
			}
		}
		return id;
	}
	/**
	 * [addListener description]
	 * @param {[type]}   el    [description]
	 * @param {[type]}   ename [description]
	 * @param {Function} fn    [description]
	 * @param {[type]}   task  [description]
	 * @param {[type]}   wrap  [执行fn函数前的修饰函数 比如延迟执行等]
	 * @param {[type]}   scope [description]
	 */
	function addListener(el,ename,fn,task,wrap,scope){
		el=XUHAO.getDom(el);
		var id=XUHAO.getId(el),
			es=XUHAO.elCache[id].events,
			wfn;
		wfn=E.on(el,ename,wrap);
		es[ename]=es[ename] || [];
		es[ename].push([fn,wrap,scope,wfn,task]);
		if(el.addEventListener&&ename=='mousewheel'){
			var args = ["DOMMouseScroll", wrap, false];
            el.addEventListener.apply(el, args);
            Ext.EventManager.addListener(WINDOW, 'unload', function(){
                el.removeEventListener.apply(el, args);
            });
		}
		 // fix stopped mousedowns on the document
        if(el == DOC && ename == "mousedown"){
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }

	}

	/*ie有个特有的doScroll方法，
	当页面DOM未加载完成时，
	调用doScroll方法时，就会报错，
	反过来，只要一直间隔调用doScroll直到不报错，
	那就表示页面DOM加载完毕了。*/

	function doScrollChk(){

		if(WINDOW!=top){
			return false;
		}

		try{
			DOC.documentElement.doScroll('left');
		}catch(e){
			return false;
		}

		fireDocReady();
		return true;
	}






}();




//Initialize doc classes
(function(){
    var initExtCss = function() {
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if (!bd) {
            return false;
        }

        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : (Ext.isIE8 ? 'ext-ie8' : 'ext-ie9')))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isWebKit ? "ext-webkit" : ""];

        if (Ext.isSafari) {
            cls.push("ext-safari " + (Ext.isSafari2 ? 'ext-safari2' : (Ext.isSafari3 ? 'ext-safari3' : 'ext-safari4')));
        } else if(Ext.isChrome) {
            cls.push("ext-chrome");
        }

        if (Ext.isMac) {
            cls.push("ext-mac");
        }
        if (Ext.isLinux) {
            cls.push("ext-linux");
        }

        // add to the parent to allow for selectors like ".ext-strict .ext-ie"
        if (Ext.isStrict || Ext.isBorderBox) {
            var p = bd.parentNode;
            if (p) {
                if (!Ext.isStrict) {
                    Ext.fly(p, '_internal').addClass('x-quirks');
                    if (Ext.isIE && !Ext.isStrict) {
                        Ext.isIEQuirks = true;
                    }
                }
                Ext.fly(p, '_internal').addClass(((Ext.isStrict && Ext.isIE ) || (!Ext.enableForcedBoxModel && !Ext.isIE)) ? ' ext-strict' : ' ext-border-box');
            }
        }
        // Forced border box model class applied to all elements. Bypassing javascript based box model adjustments
        // in favor of css.  This is for non-IE browsers.
        if (Ext.enableForcedBoxModel && !Ext.isIE) {
            Ext.isForcedBorderBox = true;
            cls.push("ext-forced-border-box");
        }
        
        Ext.fly(bd, '_internal').addClass(cls);
        return true;
    };
    
    if (!initExtCss()) {
        Ext.onReady(initExtCss);
    }
})();


/**
 * 判断浏览器属性之间的差异判断
 */
(function(){
	var supports=XUHAO.apply(XUHAO.supports,{

		correctRightMargin:true,

		correctTransparentColor:true,

		cssFloat:true
	});

	var supportTest=function(){
		var div=document.createElement(dov),
			doc=document,
			view,
			last;
		div.innerHTML='<div style="height:30px;width:50px;"><div style="height:20px;width:20px;"></div></div><div style="float:left;background-color:transparent;">';
		doc.body.appendChild(div);
		last=div.lastChild;

		if((view = doc.defaultView)){
            if(view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px'){
                supports.correctRightMargin = false;
            }
            if(view.getComputedStyle(last, null).backgroundColor != 'transparent'){
                supports.correctTransparentColor = false;
            }
        }
        supports.cssFloat=!!last.style.cssFloat;
        doc.body.removeChild(div);
	}

	if(XUHAO.isReady){
		supportTest();
	}ele{
		XUHAO.onReady(supportTest);
	}

})();



/**
 *
 *浏览器事件属性的封装
 * 
 */
XUHAO.EventObject=function(){
	//IE只有keyCode属性，
	//FireFox中有which和charCode属性，
	//Opera中有keyCode和which属性，
	//Chrome中有keyCode、which和charCode属性。
	var E=XUHAO.lib.Event,
		clickRe=/(dbl)?click/,
		safariKeys={
			3 : 13, // enter
            63234 : 37, // left
            63235 : 39, // right
            63232 : 38, // up
            63233 : 40, // down
            63276 : 33, // page up
            63277 : 34, // page down
            63272 : 46, // delete
            63273 : 36, // home
            63275 : 35  // end
		},

		// 鼠标的左中右键 IE下不是规则的
		btnMap=XUHAO.isIE?{1:0,4:1,2:2}:{0:0,1:1,2:2};

	XUHAO.EventObjectImpl=function(e){
		if(e){
			this.setEvent(e.browserEvent||e);
		}
	}

	XUHAO.EventObjectImpl.prototype={

		//重新设置事件参数信息 统一标准消除浏览器差异

		setEvent:function(e){
			var me=this;
			if(e==me||(e&&e.browerEvent)){//已经被包装过的事件参数
				return e;
			}
			if(e){
				me.button=e.button?btnMap[e.button]:(e.which?e.whiche-1:-1);
				if(clickRe.test(e.type)&&me.button==-1){
					me.button=0;
				}
				me.type=e.type;
				me.shifKey=e.shifKey;
				me.ctrlKey=e.shifKey||e.metaKey||false,
				me.altKey=e.altKey;
				me.keyCode=e.keyCode;
				me.charCode=e.charCode;
				me.target=E.getTarget(e);
				me.xy=E.getXY(e);	
			}else{
				me.button=-1;
				me.shifKey=false;
				me.ctrlKey=false,
				me.altKey=false;
				me.keyCode=0;
				me.charCode=0;
				me.target=null;
				me.xy=[0,0];
			}
			return me;
		},

		stopEvent:function(){
			var me=this;

			if(me.browserEvent){
				if(me.browserEvent.type=='mousedown'){
					XUHAO.EventManager.stoppedMouseDownEvent.fire(me);
				}
				E.stopEvent(me.browserEvent);
			}

		},

		preventDefault:function(){
			if(this.browserEvent){
				E.preventDefault(this.browserEvent);
			}
		},

		stopPropagation:function(){
			var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
		},

		getCharCode:function(){
			return this.charCode||this.keyCode;
		},

		getKey:function(){
			return this.normalizeKey(this.getCharCode());
		},

		normalizeKey:function(k){
			return XUHAO.isSafari?(safariKeys[k]||k):k;
		},

		getPageX:function(){
			return this.xy[0];
		},

		getPageY:function(){
			return this.xy[1];
		},

		getPageXY:function () {
			return this.xy;
		},

		getTarget:function(selector,maxDepth,returnEl){
			return selector?XUHAO.fly(this.target).findParent(selector,maxDepth,returnEl):
				(returnEl?XUHAO.get(this.target);this.target);
		},

		getRelatedTarget:function(){
			return this.browserEvent?E.getRelatedTarget(this.browserEvent):null;
		},


		//判断鼠标滚轴运动的方向 正数表示向上 负数表示向下
		getWheelDelta:function(){
			var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta/120;
            }else if(e.detail){ /* Mozilla case. */
                delta = -e.detail/3;
            }
            return delta;
		},

		within:function(el,related,allowEl){
			if(el){
				var t=this[related?'getRelatedTarget':'getTarget']();
				return t&&((allowEl?(t==Ext.getDom(el):false)|| Ext.fly(el).contains(t));
			}
		}
	};

	return new XUHAO.EventObjectImpl();

}();