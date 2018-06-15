/**
 * 简单动画基础库
 */

(function() {
    'use strict'
    SimpleAnim.lib = {};
    var SIMPLEANIM = SimpleAnim.lib,
        noNegatives = /width|height|opacity|padding/, //表示没有负数样式属性
        offsetAttribute = /^((width|height)|(top|bottom))$/, //offset+
        defaultUnit = /width|height|top$|bottom$|left$|right$/i,
        offsetUnit = /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i,
        isSet = function(v) {
            return typeof v !== 'undefined';
        },
        now = function() {
            return new Date();
        };

    
    //运动调用的接口
    SIMPLEANIM.Anim = {

    }

    //运动基础库方法
    /**
     * [AnimBase description]
     * @param {[type]} el         [DOM封装的元素]
     * @param {[type]} attributes [DOM的属性]
     * @param {[type]} duration   [运动时间]
     * @param {[type]} method     [运动方式函数]
     */
    SIMPLEANIM.AnimBase = function(el, attributes, duration, method) {
        if (el) {
            this.init(el, attributes, duration, method);
        }
    }

    SIMPLEANIM.AnimBase.prototype = {
        doMethod: function(attr, start, end) {
        	var me=this;
        
        	var method=function (t, b, c, d) {
	            if ((t/=d) < (1/2.75)) {
	                return c*(7.5625*t*t) + b;
	            } else if (t < (2/2.75)) {
	                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	            } else if (t < (2.5/2.75)) {
	                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	            } else {
	                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	            }
	        }

	        // var method=function (t, b, c, d) {
	        //    return c * t / d + b;
	        // }
		        
        	return method(me.curFrame, start, end - start, me.totalFrames)

        	
        },

        setAttr: function(attr, val, unit) {
            //没有负数值属性检测
            if (noNegatives.test(attr) && val < 0) {
                val = 0;
            }
            this.el.setStyle(attr, val + unit);
        },

        getAttr: function(attr) {
            var el = this.el,
                val = el.getStyle(attr),
                a = offsetAttribute.exec(attr) || [];

            //可能会出先这种情况
            if (val !== 'auto' || !offsetUnit.test(val)) {
                return parseFloat(val);
            }

        },

        //给属性添加默认单位
        getDefaultUnit: function(attr) {
            return defaultUnit.test(attr) ? 'px' : ''
        },

        animateX: function(callback, scope) {

        },

        setRunAttr: function(attr) {
            var me = this,
                a = this.attributes[attr],
                to = a.to,
                by = a.by,
                from = a.from,
                unit = a.unit,
                ra = (this.runAttrs[attr] = {}),
                end;

            if (!isSet(to) && !isSet(by)) {
                return false;
            }
            var start = isSet(from) ? from : me.getAttr(attr);

            if (isSet(to)) {
                end = to;
            } else if (isSet(by)) {
                //暂时不实现这种情况


            }

            SimpleAnim.copy(ra, {
                start: start,
                end: end,
                unit: isSet(unit) ? unit : me.getDefaultUnit(attr)
            });

        },

        init: function(el, attributes, duration, method) {
            var me = this,
                actualFrames = 0, //实际运动过程中帧数
                mgr = SIMPLEANIM.AnimMgr;

            SimpleAnim.copy(me, {
                isAnimated: false,
                startTime: null,
                el: SimpleAnim.getDom(el),
                attributes: attributes || {},
                duration: duration || 1,
                method: method || SIMPLEANIM.Easing.easeNone,
                useSec: true, //duration是秒为单位还是毫秒
                curFrame: 0, //当前的帧数
                totalFrames: mgr.fps, //总共帧数
                runAttrs: {},
                //开始运动
                animate: function() {
                    var me = this,
                        d = me.duration;

                    if (me.isAnimated) {
                        return false;
                    }
                    me.isAnimated = true;
                    me.curFrame = 0;
                    me.totalFrames = me.useSec ? Math.ceil(mgr.fps * d) : d;
                    onStart(me);
                    mgr.registerElement(me);
                },

                stop: function(finish) {
                    var me = this;

                    if (finish) {
                        me.curFrame = me.totalFrames;
                        //me._onTween.fire();
                    }
                    mgr.stop(me);
                },

                onTween:onTween
            });


            function onStart(thiss) {
                var me = thiss,
                    attr;

                console.log(me);
                //存储要改变的属性
                me.runAttrs = {};

                //runAttrs添加属性
                for (attr in me.attributes) {
                    me.setRunAttr(attr);
                }

                //表示动画开始
                me.isAnimated = true;
                //运动开始时间
                me.startTime = now();

                //初始化当前帧数
                actualFrames = 0;
            };

            function onTween() {
                var me = this;
                var ra = me.runAttrs;
                var v;
                for (var attr in ra) {
                    v = ra[attr];
                    this.setAttr(attr, me.doMethod(attr, v.start, v.end), v.unit)
                }
         
                ++actualFrames;
            };

            function onComplete() {
                var me = this;

                me.isAnimated = false;
                actualFrames = 0;
            };


        }

    }

    SIMPLEANIM.AnimMgr = new function() {
        var me = this,
            thread = null,
            queue = [],
            tweenCount = 0;


        var startTime, endTime;

        SimpleAnim.copy(me, {
            fps: 1000,
            delay: 1,
            registerElement: function(tween) {
                queue.push(tween);
                ++tweenCount;
                me.start();
            },
            unRegister: function(tween, index) {
                index = index || queue.indexOf(tween);
                if (index != -1) {
                    queue.splice(index, 1);
                }
                if (--tweenCount <= 0) {
                    me.stop();
                }
            },

            start: function() {

                if (thread == null) {
                	startTime=new Date().getTime();
                    thread = setInterval(function(){
                    	//console.log(new Date().getTime());
                    	me.run();
                    }, me.delay);
                }

            },

            stop: function(tween) {
                if (!tween) {

                    clearInterval(thread);

                    for (var i = 0, len = queue.length; i < len; i++) {
                        if (queue[0].isAnimated) {
                            me.unRegister(queue[0], 0);
                        }
                    }
                    queue = [];
                    thread = null;
                    tweenCount = 0;
                } else {
                    me.unRegister(tween);
                }
            },

            run: function() {
                var tf, i, len, tween;
                for (i = 0, len = queue.length; i < len; i++) {
                    tween = queue[i];
                    if (tween && tween.isAnimated) {
                        tf = tween.totalFrames;
                        //console.log(tf);
                        if (tween.curFrame < tf || tf === null) {
                            ++tween.curFrame;
                            //console.log(tween.useSec=false);
                            //console.log(tween.curFrame);
                            if (tween.useSec) {
                                correctFrame(tween);
                            }
                            //tween.onTween();
                        } else {
                        	endTime=new Date().getTime();

                        	var diffTime=(endTime-startTime)/1000;

 
                            me.stop(tween);
                        }
                    }
                }

            }
        });


        var correctFrame = function(tween) {
            var frames = tween.totalFrames,
                frame = tween.curFrame,
                duration = tween.duration,
                expected = (frame * duration * 1000 / frames),
                elapsed = (now() - tween.startTime),
                tweak1=0,
                tweak = 0;
            if (elapsed < duration * 1000) {
                tweak = Math.round((elapsed / expected - 1) * frame);
            } else {
                tweak = frames - (frame + 1);
            }

            if (tweak > 0 && isFinite(tweak)) {
                if (tween.curFrame + tweak >= frames) {
                    tweak = frames - (frame + 1);
                }
                tween.curFrame += tweak;
            }
        };

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
    SIMPLEANIM.Easing = {

    }


})()