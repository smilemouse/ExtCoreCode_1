/**
 *delay：在事件发生延迟一段进间才执行。
buffer：在事件发生延迟一段进间才执行，同时会创建一个Ext.util.DelayTask对象，并把fn放入其中等待执行。若在等待的过程中再次触发事件，上次的任务就会被取消，并把新的fn放入任务队列中，可以保证fn不会重复执行多次。
 *
 */


(function(){
	var XUHAOUTIL=XUHAO.util;
	var EACH=XUHAO.each;
	var TRUE=true;
	var FALSE=false;

	XUHAOUTIL.Observable=function(){
		var me=this;
		var e=me.events;

		if(me.listeners){
			me.on(me.listeners);
			delete me.listeners;
		}
		me.events=e||{};
	}


	XUHAOUTIL.Observable.prototype={

		filterOptRe:/^(?:scope|delay|buffer|single)$/,

		fireEvent:function(){
			var a=Array.prototype.slice.call(argumetns,0);
			var ename=a[0].toLowerCase();
			var me=this;
			var ret=TRUE;
			var ce=me.events[ename]//事件子项
			var cc;
			var q;
			var c;

			if(me.eventsSuspended==TRUE){
				//其实这里未做任何处理 只是将一些数据对象保存了起来估计以后扩展使用
				if(q=me.eventQueue){
					q.push(a);
				}
			}else if(typeof ce == 'object') {

				//暂时未做分析

	            if (ce.bubble){
	                if(ce.fire.apply(ce, a.slice(1)) === FALSE) {
	                    return FALSE;
	                }
	                c = me.getBubbleTarget && me.getBubbleTarget();
	                if(c && c.enableBubble) {
	                    cc = c.events[ename];
	                    if(!cc || typeof cc != 'object' || !cc.bubble) {
	                        c.enableBubble(ename);
	                    }
	                    return c.fireEvent.apply(c, a);
	                }
	            }
	            else {
	                a.shift();
	                ret = ce.fire.apply(ce, a);
	            }
	        }

			return ret;

		},

		addListener:function(eventName,fn,scope,o){
			var me=this,
				e,
				oe,
				ce;

			/*on({
				'click':{
					fn: function(){
						console.log('click');
					},
				    scope: this,
				    delay: 100
				},
				'mouseenter':{
					fn: function(){
						console.log('mouseenter');
					},
				    scope: this,
				    single :false,
				    delay: 100,
				    buffer:2000,
				    //target:Ext.get('clock1')
				},
				'mouseleave':{
					fn: function(){
						console.log('mouseleave');
					},
				    scope: this
				}

			});*/

			/*on({
				'click' : this.onClick,
				'mouseover' : this.onMouseOver,
				'mouseout' : this.onMouseOut,
				 scope: this
			});*/

			if(typeof eventName=='object'){
				o=eventName;
				for(e in o){
					oe=o[e];
					if(!me.filterOptRe.test(e)){
						me.addListener(e,oe.fn||oe,oe.scope||o.scope,oe.fn?oe:o);
					}
					
				}
			}else{
				eventName=eventName.toLowerCase();
				ce=me.events[eventName]||TRUE;
				if(typeof ce=='boolean'){
					me.events[eventName]=ce=new EXTUTIL.Event(me, eventName);
				}
				ce.addListener(fn,scope,typeof o=='object'?o:{});
			}

		},

		removeListener:function(eventName,fn,scope){
			var ce=this.events[eventName.toLowerCase()];
			if(typeof ce=='object'){
				ce.removeListener(fn,scope);
			}
		},

		pureLisreners:function(){
			var events=this.events;
			var evt;
			var key;

			for(key in events){
				evt=events[key];
				if(typeof evt=='object'){
					evt.clearListeners();
				}
			}

		},

		addEvents:function(o){
			var me=this;

			me.events=me.events||{};
			if(typeof o=='string'){
				var a=arguments;
				var i=a.length;

				while(i--){
					me.events[a[i]]=me.events[a[i]]||TRUE;
				}
			}else{
				XUHAO.applyIf(me.events,o);
			}

		},

		hasListener:function(eventName){
			var e=this.events[eventName.toLowerCase()];
			return typeof e=='object'&&e.listeners.length>0;
		},


		//暂停该对象所有事件的处理

		suspendEvents:function(queueSuspended){
			this.eventSuspended=TRUE;

			if(queueSuspended&&!this.eventQueue){
				this.eventQueue=[];	
			}

		},

		//回复该对象所有事件处理
		resumeEvents:function(){
			var me=this,
				queued=me.eventQueue||[];

			me.eventSuspended=FALSE;

			delete me.eventQueue;
			EACH(queued,function(e){
				me.fireEvent.apply(me,e);
			});

		}


	}


	var OBSERVABLE=XUHAOUTIL.Observable.prototype;

	OBSERVABLE.on=OBSERVABLE.addListener;

	OBSERVABLE.un=OBSERVABLE.removeListener;

	XUHAOUTIL.Observable.releaseCapture=function(){

	}

	function createTargeted(h,o,scope){
		return function(){
			if(o.target == arguments[0]){
	            h.apply(scope, Array.prototype.slice.call(arguments, 0));
	        }
		}
	}

	function createBuffered(h,o,l,scope){
		l.task=new EXTUTIL.DelayedTask();
		return function(){
			l.task.delay(o.buffer,h,scope,Array.prototype.slice.call(arguments,0));
		}
	}

	function createSingle(h,e,fn,scope){
		return function(){
			e.removeListener(fn,scope);
			return h.apply(scope,arguments);
		}
	}

	function createDelayed(h,o,l,scope){
		return function(){
			var task=new XUHAOUTIL.DelayedTask(),
				args=Array.prototype.slice.call(arguments,0);

			if(!l.tasks){
				l.tasks=[];
			}

			l.tasks.push(task);
			task.delay(o.delay||10,function(){
				l,tasks.remove(task);
				h.apply(scope,args);
			},scope);
		}

	}

	/**
	 *	this.listeners
	 *
	 *	{
	 *		fireFn,//触发的函数 
	 *		fn,//源函数
	 *		options,//配置参数
	 *		scope//作用域
	 *	}
	 *
	 * 
	 */
	XUHAOUTIL.Event=function(obj,name){

		this.name=name;//事件名名称
		this.obj=obj; //事件生效的对象
		this.listeners=[];//存储的事件

	}

	XUHAOUTIL.prototype={

		addListener:function(fn,scope,options){
			var me=this;
			var l;

			scope=scope||me.obj;

			if(!me.isListening(fn,scope)){
				l=me.createListener(fm,scope,options);
				if(me.firing){
					me.listeners=me.listeners.slice(0);//很是不理解这句话是干嘛的
				}
				me.listeners.push(l);
			}
		},

		createListener:function(fn,scope,o){
			o=o||{};
			scope=scope||this.obj;

			var l={
				fn:fn,
				scope:scope,
				options:o
			};
			h=fn;
			if(o.target){
				h=createTargeted(h,o,scope);
			}
			if(o.delay){
				h=createDelayed(h,o,l,scope)
			}
			if(o.single){
	            h = createSingle(h, this, fn, scope);
	        }
	        if(o.buffer){
	            h = createBuffered(h, o, l, scope);
	        }
	        l.fireFn=h;
	        return l;
		},

		findListener:function(fn,scope){
			var list=this.listeners;
			var i=list.length;
			var l;

			scope=scope||this.obj;

			while(i--){
				l=list[i];
				if(l){
					if(l.fn==fn&&l.scope==scope){
						return i;
					}
				}
			}

			return -1;
		},


		//判断是否存在该事件
		isListening:function(fn,scope){
			return this.findListener(fn,scope)!=-1;
		},


		removeListener:function(fn,scope){
			var index,l,k,me=this,ret=FALSE;

			//如果存在该事件
			if((index=me.findListener(fn,scope))!=-1){
				if(me.firing){
					me.listeners=me.listeners.slice(0);
				}
				l=me.listeners[index];

				//如果是正在延迟触发函数
				if(l.task){
					l.task.cancel();
					delete l.task;
				}

				//删除缓存延迟函数
				k=l.tasks&&l.tasks.length;
				if(k){
					while(k--){
						l.tasks[k].cancel();
					}
					delete l.tasks;
				}

				me.listeners.splice(index,1);
				ret= TRUE;
			}
			return ret;
		},

		clearListeners:function(){
			var me=this;
			var l=me.listeners;
			var i=l.length;

			while(i--){
				me.removeListener(l[i].fn,l[i].scope);
			}
		},

		fire:function(){
			var me=this,
				listeners=me.listeners,
				len=listeners.length,
				i=0,
				l;

			if(len>0){
				var args=Array.prototype.slice.call(arguments,0);

				me.firing=TRUE;
				for(;i<len;i++){
					l=listeners[i];
					if(l&&l.fireFn.apply(l.scope||me.obj||window,args)===FALSE){
						return (me.firing=FALSE);
					}

				}
			}
			me.firing=FALSE;
			return TRUE;
		}

	}

	
})()