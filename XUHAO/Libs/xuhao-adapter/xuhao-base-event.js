//事件库
//是个单例模式
//事件捕获指的是从document到触发事件的那个节点，即自上而下的去触发事件。
//相反的，事件冒泡是自下而上的去触发事件。
XUHAO.lib.Event=function(){
	var loadComplete=false,
		unloadListeners=[],
		retryCount=0,
		onAvailStack=[],
		_interval,
		locked=false,
		win=window,
		doc=document,

		POLL_RETRYS=200,
		POLL_INTERVAL=20,
		TYPE=0,
		FN=1,
		OBJ=2,
		ADJ_SCOPE=3,
		SCROLLLEFT='scrollLeft',
		SCROLLTOP='scrollTop',
		UNLOAD='unload',
		MOUSEOVER='mouseover',
		MOUSEOUT='mouseout',

		doAdd:function(){
			var ret;
			
			if(win.addEventListener){//现代浏览器
				ret=function(el,eventName,fn,capture){
					/**
					 * mouseenter /mouseleave 事件，它们仅IE支持。新的w3c已经支持了,早期的不支持
					 * mouseenter不同于mouseover，
					 * 它是在第一次鼠标进入节点区域时触发，以后在节点区域内(子节点间)移动时不触发。
					 */
					
					//鼠标指针穿过被选元素或其子元素，会触发 mouseover 事件。涉及到事件的冒泡作用
					//鼠标指针只在穿过被选元素时，才会触发 mouseenter 事件。
					if(eventName==='mouseenter'){
						fn=fn.createInterceptor();
						el.addEventListener(MOUSEOVER,fn,(capture));
					}else if(eventName==='mouseleave'){
						fn=fn.createInterceptor();
						el.addEventListener(MOUSEOUT,fn,(capture));
					}else{
						el.addEventListener(eventName,fn,(capture));
					}
				}	
			}else if(win.attachEvent){//低版本浏览器 主要是IE6,7
				ret=function(el,eventName,fn,capture){
					el.attachEvent('on'+eventName,fn);
					return fn;
				}
			}else{
				ret=function(){};
			}

			return ret;
		}(),

		doRemove=function(){
			var ret;

			if(window.removeEventListener){
				ret=function(el,eventName,fn,capture){
					if(eventName=='mouseenter'){
						eventName=MOUSEOVER;
					}else if(eventName=='mouseleave'){
						eventName=MOUSEOUT;
					}
					el.removeEventListener(eventName,fn,(capture));
					return fn;
				}
			}else if(window.detachEvent){
				ret=function(el,eventName,fn,capture){
					el.detachEvent('on'+eventName,fn);
					return fn;
				}
			}else{
				ret=function(){}
			}
			return ret;
		}();



	function checkRelatedTarget(e){
		return !elContains(e.currentTarget,pub.getRelatedTarget(e));
	}
	
	/**
	 * 判断元素是否是父子关系同时包含自身
	 * @param  {[type]} parent [description]
	 * @param  {[type]} child  [description]
	 * @return {[type]}        [description]
	 */
	function elContains(parent,child){
		if(parent&&parent.firstChild){
			while(child){
				if(child===parent){
					return true;
				}
				child=child.parentNode;
				if(child&&(child.nodeType!=1)){
					child=null;
				}
			}
		}
		return false;
	}


	function _tryPreloadAttach(){
		var ret=false,
			notAvail=[],
			element,
			i,
			v,
			override,
			tryAgain=!loadComplete||(retryCount>0);

		if(!locked){
			locked=true;
			for(i=0;i<onAvailStack.length;++i){
				v=onAvailStack[i];

				if(v&&(element=doc.getElementById(v.id))){
					if(!v.checkReady||loadComplete||element.nextSibling||(doc && doc.body)){
						override=v.override;
						
						if(override){
							if(override===true){
								element=v.obj;
							}else{
								element=override;
							}
						}else{
							element=element;
						}

						//element = override ? (override === true ? v.obj : override) : element;
						
						v.fn.call(element,v.obj);
						onAvailStack.remove(v);
						--i;
					}else{
						 notAvail.push(v);
					}
				}
			}


			retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;

			if(tryAgain){
				startInterval();
			}else{
				clearInterval(_interval);
				_interval=null;
			}
			ret=!(locked=false);
		}

		return ret;
	}

	function startInterval(){
		if(!_interval){
			var callback=function(){
				_tryPreloadAttach();
			};

			_interval=setInterval(callback, POLL_INTERVAL);

		}
	};




	function getScroll(){
		var dd=doc.documentElement;
		var db=doc.body;

		//声明DTD协议的时候
		if(dd&&(dd[SCROLLTOP]||dd[SCROLLLEFT])){
			return [dd[SCROLLLEFT],dd[SCROLLTOP]];
		}else if(db){
			//未声明协议的时候
			return [db[SCROLLLEFT],db[SCROLLTOP]]
		}else {
			return [0,0];
		}

	}

	function getPageCoord(ev,xy){
		ev=e ev.browserEvent || ev;
		console.log('ev.browserEvent:'+ev.browserEvent);
		var coord=ev['page'+xy];
		if(!coord&&coord!==0){
			coord=ev['client'+xy]||0; //'clientX clientY 是当前屏幕的位置'
			if(XUHAO.isIE){
				coord += getScroll()[xy == "X" ? 0 : 1];
			}
		}
		return coord;
	}




	var pub={
		extAdapter:true,
		/*

		它的作用是等到id对应的HTML元素可用时才执行fn这个函数.scope表示调用函数的作用域。 
		如果你仔细阅读代码就会了解， 
		里边使用的setInterval() 循环检测id对应的HTML元素， 
		直到它可用时才停止循环执行fn函数。
		*/
	

		onAvailable:function(p_id,p_fn,p_obj,p_override){
			onAvailStack.push({
				id:p_id,
				fn:p_fn,
				obj:p_obj,
				override:p_override,
				checkReady:false
			});
			retryCount=POLL_RETRYS;
			startInterval();
		},

		addListener:function(el,eventName,fn){
			el=XUHAO.getDom(el);

			if(el&&fn){
				if(eventName==UNLOAD){
					if(unloadListeners[el.id]===undefined){
						unloadListeners[el.id] = [];
					}
					//添加unload事件函数
					unloadListeners[el.id].push([eventName, fn]);
					return fn;		
				}
				return doAdd(el,eventName,fn,false);
			}
			return false;
		},

		removeListener:function(el,eventName,fn){
			el=XUHAO.getDom(el);

			var i,len,li, lis;

			if(el&&fn){
				if(eventName==UNLOAD){
					if((lis=unloadListeners[el.id])!==undefined){
						for(i=0,len=lis.length;i<len;i++){
							if((li=lis[i])&&li[TYPE]==eventName&&li[FN]==fn){
								unloadListeners[el.id].splice(i,1);
							}
						}
					}
					return ;
				}
				doRemove(el,evnentName,fn,false);
			}
		},

		//target 事件属性可返回事件的目标节点（触发该事件的节点）
		getTarget:function(ev){
			ev = ev.browserEvent || ev;
			return this.resolveTextNode(ev.target||ev.srcElement);//IE8-
		},

		resolveTextNode:function(node){
			//e.target can be a text node on mousewheel 
			//A recent change removed the code that normalized e.target to the parent element node in case it is a text node. 
			//This was removed because it apparently was an old Safari bug. However, it's still present in current Chrome.
 			//jq #13143
 			//bugs.jquery.com
			return 	node&&node.nodeType==3?node.parentNode:node;
		},

		//属性返回当鼠标移动时哪个元素进入或退出。
		//DOM通过event对象的relatedTarget属性提供了相关元素的信息。
		//个属性只对与mouseover和mouseout事件才包含值；
		//对于其他事件，这个属性的值是null。IE不支持relatedTarget属性，但提供了保存同样信息的不同属性。
		//在mouseover事件触发时IE的fromElement属性中保存了相关元素；在mouseout事件触发时，IE的toElement属性保存了相关元素。
		//如下跨浏览器获取相关属性的
		getRelatedTarget:function(ev){
			ev=ev.browserEvent||ev;
			return this.resolveTextNode(ev.relatedTarget||
				(/(mouseout|mouseleave).test(ev.type)/?ev.toElement:/(mouseover|mouseenter)/.test(ev.type) ? ev.fromElement : null

				));
		},

		getPageX:function(ev){
			return getPageCoord(ev,'X')
		},

		getPageY:function(ev){
			return getPageCoord(ev,'Y');
		},

		getXY:function(ev){
			return [this.getPageX(ev),this.getPageY()];
		},

		stopEvent:function(ev){
			//阻止冒泡和阻止默认行为
			this.stopPropagation(ev);
			this.preventDefault(ev);
		},

		stopPropagation:function(ev){
			ev=ev.browserEvent||ev;

			if(ev.stopPropagation){
				ev.stopPropagation();
			}else{
				ev.cancelBubble=true;
			}

		},

		preventDefault:function(ev){
			ev=ev.browserEvent||ev;
			if(ev.preventDefault){
				ev.preventDefault();	
			}else{
				if(ev.keyCode){
					ev.keyCode=0;
				}
				ev.returnValue=false;
			}
		},

		getEvent:function(e){
			e=e||win.event;

			//主要是firefox下
			//<button id="btn" onclick="foo()">按钮</button> 
			//function onclick(event) { foo(); } 
			//执行的顺序是onclick 然后是foo()导致参数无法传入 
			if(!e){
				var c=this.getEvent.caller;//调用上一级函数
				while(c){
					e=c.arguments[0];
					if(e&&Event==e.constructor){
						break;
					}
					c=c.caller;	
				}
			}
			return e;
		},

		getCharCode:function(ev){
			ev=ev.browserEvent||ev;
			return ev.charCode||ev.keyCode||0;//兼容写法
		},

		getListeners:function(el,eventName){
			XUHAO.EventManager.getListeners(el,eventName);
		},

		purgeElement:function(el, recurse, eventName){
			Ext.EventManager.purgeElement(el, recurse, eventName);
		},

		_load:function(e){
			loadComplete=true;

			if(XUHAO.isIE&&e!=true){
				doRemove(win,'load',arguments.callee);
			}
		},

		_unload:function(e){
			var EU=XUHAO.lib.Event;

			for(var id in unloadListeners){
				var ul=unloadListeners[id];
				for(var i=0,len=ul.length;i<len;i++){
					var v=ul[i];

					if(v){
						try{
							scope = v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) :  win;
                            v[FN].call(scope, EU.getEvent(e), v[OBJ]);
						}catch(ex){

						}
					}

				}
			};
			doRemove(win, UNLOAD, EU._unload);
		}
	}

	pub.on=pub.addListener;
	pub.un=pub.removeListener;

	if(doc&&doc.body){
		pub._load(true);
	}else{
		doAdd(win,'load',pub._load)
	}
	doAdd(win, UNLOAD, pub._unload);
    _tryPreloadAttach();
    return pub;
}();