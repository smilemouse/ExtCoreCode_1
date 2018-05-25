/**
 *对Element的样式操作
 * 
 */

XUHAO.Element.addMethods(function(){
	var supports=XUHAO.supports,//一些兼容性的支持的判别
		propCache={},	
		camelRe=/(-[a-z])/gi,	//单词拼接转驼峰的正则
		view=document.defaultView,//指向document的 window
		opacityRe=/alpha\(opacity=(.*)\)/i,//IE7-下的透明度
		trimRe=/^\s+|\s+$/g,	//前后空格的判别
		EL=XUHAO.Element,	//Element的构造函数
		spacesRe=/\s+/,	//空格的正则
		wordsRe=/\w+/g,	//字符的正则
		PADDING='padding',
		MARGIN='margin',
		BORDER='border',
		LEFT='-left',
		RIGHT='-right',
		TOP='-top',
		BOTTOM='-bottom',
		WIDTH = "-width",
        MATH = Math,
        HIDDEN = 'hidden',
        ISCLIPPED = 'isClipped',
        OVERFLOW = 'overflow',
        OVERFLOWX = 'overflow-x',
        OVERFLOWY = 'overflow-y',
        ORIGINALCLIP = 'originalClip',	
        borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
        paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
        margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
        data = Ext.Element.data;//获取缓存中的元素的数据

    //将单词连接的css属性-word转化为大写字母
    function camelFn(m,a){	
    	return a.charAt(1).toUpperCase();
    }

    function chkCache(prop){
    	//查看缓存中是否有改属性 没有则添加
    	//supports主要是兼容浏览器使用的
    	//cssFlot在现代浏览器中
    	//styleFloat是IE7-使用
    	return propCache[prop]||(propCache[prop] = prop == 'float' ? 
    		(supports.cssFloat ? 'cssFloat' : 'styleFloat') : 
    		prop.replace(camelRe, camelFn));
    }

	return {

		adjustWidth:function(width){
			var me=this;
			var isNum=(typeof width=='number');

			if(isNum&&me.autoBoxAdjust&&!me.isBorderBox()){
				width-=(me.getBorderWidth("lr") + me.getPadding("lr"));
			}

			return (isNum&&width<0)?0:width;
		},

		adjustHeight : function(height) {
            var me = this;
            var isNum = (typeof height == "number");
            if(isNum && me.autoBoxAdjust && !me.isBorderBox()){
               height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
            }
            return (isNum && height < 0) ? 0 : height;
        },

        addClass:function(className){
        	var me=this,
        		i,len,v,cls=[];

        	if(!XUHAO.isArray(className)){
        		if(typeof className=='string'&&!me.hasClass(className)){
        			me.dom.className+=' '+className;
        		}
        	}else{
        		for(i=0,len=className.length;i<len;i++){
        			v=className[i];

        			if(typeof v=='string'&&(' '+me.dom.className+' ').indexOf(' '+v+' ')==-1){
        				cls.push(v);
        			}
        		}
        		if(cls.length){
        			me.dom.className+=" "+cls.join(' ');
        		}

        	}
        	return me;
        },

        removeClass:function(className){
			var me=this,
				i,
				idx,
				len,
				cls,
				elClasses;
			if(! XUHAO.isArray(className)){
				className=[className];
			}  

			if(me.dom&&me.dom.className){
				elClasses = me.dom.className.replace(trimRe, '').split(spacesRe);

				for(i=0,len=elClasses.length;i<len;i++){
					cls=elClasses[i];
					if(typeof cls=='string'){
						cls = cls.replace(trimRe, '');
						idx=cls.indexOf(cls);
						if(idx>-1){
							elClasses.splice(idx,1);
						}
					}
				}

				me.dom.className=elClasses.join(' ');
			}
			return me;      		
        },

        /**
         * 去掉兄弟节点的上的className 自身添加className
         * @param  {[type]} className [description]
         * @return {[type]}           [description]
         */
        radioClass:function(className){
        	var cn=this.dom.parentNode.childNodes,
        		v,i,len;

        	className=XUHAO.isArray(className)?className:[className];
        	for(i=0,len=cn.length;i<len;i++){
        		v=cn[i];

        		if(v&&v.nodeType==1){
        			XUHAO.fly(v,'_internal').removeClass(className);
        		}
        	}
        	return this.addClass(className);
        },

        toggleClass:function(className){
        	return this.hasClass(className)?this.removeClass(className):this.addClass(className);
        },

        hasClass:function(className){
        	return className&&(' '+this.dom.className+' ').indexOf(' '+className+' ')!=-1;
        },

        replaceClass:function(oldClassName,newClassName){
        	return this.removeClass(oldClassName).addClass(newClassName);
        },

        isStyle:function(style,val){
        	return this.getStyle(style)==val;
        },

        //**
        //这里获取的都是原有的属性 并不是计算过的属性
        //
        getStyle:function(){
        	return view&&view.getComputedStyle?
        		function(prop){
        			var el=this.dom,
        				v,
        				cs,
        				out,
        				display;

        			if(el==document){
        				return null;
        			}

        			prop=chkCache(prop);
        			out = (v = el.style[prop]) ? v :
                           (cs = view.getComputedStyle(el, "")) ? cs[prop] : null;

                    if(prop == 'marginRight' && out != '0px' && !supports.correctRightMargin){
                        display = el.style.display;
                        el.style.display = 'inline-block';
                        out = view.getComputedStyle(el, '').marginRight;
                        el.style.display = display;
                    }
                    
                    if(prop == 'backgroundColor' && out == 'rgba(0, 0, 0, 0)' && !supports.correctTransparentColor){
                        out = 'transparent';
                    }
                    return out;

        		}:
        		//IE7-
        		function(prop){
        			var el=this.dom,
        				m,
        				cs;

        			if(el==document){
        				return null;
        			}

        			if(prop=='opacity'){
        				if(el.style.filter.match){
        					if(m=el.style.filter.match(opacityRe)){
        						var fv=parseFloat(m[1]);
        						if(!NaN(fv)){
        							return fv?fv/100:0;
        						}
        					}
        				}
        				return 1;
        			}
        			prop=chkCache(prop);
        			return el.style[prop]||(cs=el.currentStyle)?cs[prop]:null;
        		}

        }(),

        //将颜色转化为
        getColor:function(attr,defaultValue,prefix){
        	var v=this.getStyle(attr),
        		color=(typeof prefix!=undefined)?prefix:'#',
        		h;

        	if(!v||(/transparent|inherit/.test(v))){
        		return defaultValue;
        	}

        	//现代浏览器会将颜色转为rgb形式 这里反转
        	if(/^rgb\(/.test(v)){
        		XUHAO.each(v.slice(4,v.length-1).split(','),function(s){
        			h=parseInt(s,10);
        			color+=(h<16?'0':'')+h.toString(16);
        		});
        	}else if(v.indexOf(v)>-1){
        		//#000
        		v=v.replace('#','');
        		color+=v.length==3?v.replace(/^(\w)(\w)(\w)$/,'$1$1$2$2$3$3'):v;
        	}else{
        		//IE下的red black等
        		//这里只能采取遍历的形式了
        	}

        },

        //设置样式
        setStyle:function(prop,value){
        	var tmp,style;

        	if(typeof prop!=='object'){
        		tmp={};
        		tmp[prop]=value;
        		prop=temp;
        	}

        	for(style in prop){
        		value=prop[style];
        		style=='opacity'?
        			this.setOpacity(value):
        			this.dom.style[chkCache(prop)]=value;
        	}
        	return this;
        },

        //设置透明度
        setOpacity:function(opacity,animate){
        	var me = this,
                s = me.dom.style;

            if(!animate || !me.anim){
                if(XUHAO.isIE){
                    var opac = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')' : '',
                    val = s.filter.replace(opacityRe, '').replace(trimRe, '');

                    s.zoom = 1;
                    s.filter = val + (val.length > 0 ? ' ' : '') + opac;
                }else{
                    s.opacity = opacity;
                }
            }else{
                me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
            }
            return me;
        },

        clearOpacity : function(){
            var style = this.dom.style;
            if(Ext.isIE){
                if(!Ext.isEmpty(style.filter)){
                    style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
                }
            }else{
                style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
            }
            return this;
        },

        getHeight:function(contentHeight){
        	var me=this,
        		dom=me.dom,
        		hidden=(XUHAO.isIE7||XUHAO.isIE6)&&me.isStyle('display','none'),
        		//clientHeight在IE7-怪异模式高度会被内容撑开
        		//IE7-clientHeight 是存在数值的
        		h=MATH.max(dom.offsetHeight,hidde?0:dom.clientHeight)||0;

        	h=!contentHeight?h:h-me.getBorderWidth('tb')-me.getPadding('tb');
        	return h<0?0:h;	
        },

        getWidth:function(contentWidth){
        	 var me = this,
                dom = me.dom,
                hidden = (XUHAO.isIE7||XUHAO.isIE6) && me.isStyle('display', 'none'),
                w = MATH.max(dom.offsetWidth, hidden ? 0 : dom.clientWidth) || 0;
            w = !contentWidth ? w : w - me.getBorderWidth("lr") - me.getPadding("lr");
            return w < 0 ? 0 : w;
        },

        setWidth:function(width,animate){
        	var me=this;
        	width=me.adjustWidth(width);//计算dom的内容高度去掉边框的值
        	!animate||!me.anim?
        		me.dom.style.width=me.me.addUnits(width):
        		me.anim({width:{to:width}},me.preanim(arguments,1));
        	return me;
        },

        setHeight : function(height, animate){
            var me = this;
            height = me.adjustHeight(height);
            !animate || !me.anim ?
                me.dom.style.height = me.addUnits(height) :
                me.anim({height : {to : height}}, me.preanim(arguments, 1));
            return me;
        },

        getBorderWidth : function(side){
            return this.addStyles(side, borders);
        },

        getPadding : function(side){
            return this.addStyles(side, paddings);
        },

        //去除元素溢出的部分
        clip:function(){
        	var me=this,
        		dom=me.dom;

        	if(!data(dom,ISCLIPPED)){
        		data(dom,ISCLIPPED,true);
        		data(dom,ORIGINALCLIP,{
        			o:me.getStyle(OVERFLOW),
        			x:me.getStyle(OVERFLOWX),
        			y:me.getStyle(OVERFLOWY)
        		});
        		me.setStyle(OVERFLOW),
    			me.setStyle(OVERFLOWX),
    			me.setStyle(OVERFLOWY)
        	}
        	return me;
        },

        unclip:function(){
        	var me=this,
        		dom=me.dom;

        	if(data(dom,ISCLIPPED)){
        		data(dom,ISCLIPPED,false);
        		var o=data(dom,ORIGINALCLIP);

        		if(o.o){
                    me.setStyle(OVERFLOW, o.o);
                }
                if(o.x){
                    me.setStyle(OVERFLOWX, o.x);
                }
                if(o.y){
                    me.setStyle(OVERFLOWY, o.y);
                }
        	}
        	return me;
        }

        addStyles:function(sides,styles){
        	var ttlSize=0,
        		sideArr=sides.match(wordsRe),
        		side,
        		size,
        		i,
        		len=sideArr.length;

        	for(i=0,i<len;i++){
        		side=sideArr[i];
        		size=side&&parseInt(this.getStyle(styles[side]),10);
        		if(size){
        			ttlSize+=MATH.abs(size);
        		}
        	}
        	return ttlSize;
        },

        margins:margins

	}

}());