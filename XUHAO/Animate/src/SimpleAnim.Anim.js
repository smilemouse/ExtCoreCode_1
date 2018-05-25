/**
 * 简单动画基础库
 */

var SimpleAnim={
	lib:{}
};

(function(){
	var SIMPLEANIM=SimpleAnim.lib,
		noNegatives=/width|height|opacity|padding/,//表示没有负数样式属性
		offsetAttribute=/^((width|height)|(top|bottom))$/,//offset+
		defaultUnit=/width|height|top$|bottom$|left$|right$/i,
		offsetUnit=/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i,
		isSet=function(v){
			return typeof v !=='undefined';
		},
		now=function(){
			return new Date();
		}

		//运动调用的接口
		SIMPLEANIM.Anim={

		}

		//运动基础库方法
		/**
		 * [AnimBase description]
		 * @param {[type]} el         [DOM封装的元素]
		 * @param {[type]} attributes [DOM的属性]
		 * @param {[type]} duration   [运动时间]
		 * @param {[type]} method     [运动方式函数]
		 */
		SIMPLEANIM.AnimBase=function(el,attributes,duration,method){
			if(el){
				this.init(el,attributes,duration,method);
			}
		}

		SIMPLEANIM.AnimBase.prototype={
			doMethod:function(attr,start,end){

			},

			setAttr:function(attr,val,unit){

			},

			getAttr:function(attr){
				

			},

			getDefaultUnit:function(){


			},

			animateX:function(callback,scope){

			},

			setRunAttr:function(attr){
				var me=this,
					a=this.attributes[attr],
					to=a.to,
					by=a.by,
					from=a.from,
					unit=a.unit,
					ra=(this.runAttrs[attr]={}),
					end;

				if(!isSet(to)&&!isSet(by)){
					return false;
				}
				var start=isSet(from)?from:me.getAttr(attr);



			},

			init:function(el,attributes,duration,method){
				var me=this,
					actualFrames=0,//实际运动过程中帧数
					mgr=SIMPLEANIM.AnimMgr;

				SimpleAnim.copy(me,{
					isAnimated:false,
					startTime:null,
					el:SimpleAnim.getDom(el),
					attributes:attributes||{},
					duration:duration||1,
					method:method||SIMPLEANIM.Easing.easeNone,
					useSec:true,//duration是秒为单位还是毫秒
					curFrame:0,//当前的帧数
					totalFrames:mgr.fps,//总共帧数
					runAttrs:{},
					//开始运动
					animate:function(){
						var me=this,
							d=me.duration;

						if(me.isAnimated){
							return false,
						}

						me.curFrame=0;
						me.totalFrames=me.useSec?Math.ceil(mgr.fps*d):d;
						mgr.registerElement(me);
					},

					stop:function(finish){
						var me=this,

						if(finish){
							me.curFrame = me.totalFrames;
							me._onTween.fire();
						}
						mgr.stop(me);
					}
				});


				function onStart(){
					var me=this,
						attr,


					//存储要改变的属性
					me.runAttrs={};

					//runAttrs添加属性
					for(attr in this.attributes){
						this.setRunAttr(attr);
					}

					//表示动画开始
					me.isAnimated=true;
					//运动开始时间
					me.startTime=now();

					//初始化当前帧数
					actualFrames = 0;
				},

				function onTween(){
					var me=this;
					var ra=me.runAttrs;
					var v;

					for(var attr in ra){
						v=ra[attr];
						this.setAttr(attr,me.doMethod(attr,v.start,v.end),v.unit)
					}

					++actualFrames;
				},

				function onComplete(){
					var me=this;

					me.isAnimated=false;
					actualFrames=0;
				}


			}

		}

		SIMPLEANIM.AnimMgr=new function(){
			var me=this,
				thread=null,
				queue=[],
				tweenCount=0;	


			SIMPLEANIM.copy(me,{
				fps:1000,
				delay:1,
				registerElement:function(tween){
					queue.push(tween);
					++tweenCount;

				},
				unRegister:function(){

				},

				start:function(){

					if(thread==null){
						thread=setInterval(me.start,me.delay);
					}

				},

				stop:function(tween){
					if(!tween){
						clearInterval(thread);

					}
				},

				run:function(){


				}


			});

		}

		/*分三个缓动方式，分别是：
		easeIn：从0开始加速的缓动，也就是先慢后快；
		easeOut：减速到0的缓动，也就是先快后慢；
		easeInOut：前半段从0开始加速，后半段减速到0的缓动。
		很多小伙伴easeIn和easeOut哪个先快，哪个先慢一直记不清楚，我这里再给大家传授一遍我独门的邪恶记法，想想我们第一次OOXX，是不是进去(easeIn)的时候都是先慢，等进去了就快了；然后出来(easeOut)的时候，开始很快，都要出来了恋恋不舍速度就慢了。跟我们这里的动画效果是完全匹配的。*/
		/*
		 * t: current time（当前时间）；
		 * b: beginning value（初始值）；
		 * c: change in value（变化量）；
		 * d: duration（持续时间）。
		 */
		SIMPLEANIM.Easing={

		}


})()