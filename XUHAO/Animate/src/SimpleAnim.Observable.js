/**
 * 简单封装一个事件存储与触发函数
 *
 * 这种功能基本采用的都是观察者设计模式
 */
(function() {
    var SANIMUTIL = SimpleAnim.util = {},
        TRUE=true,
        FALSE=false;

    SANIMUTIL.Event=function(obj,name){
        this.name=name;//
        this.obj=obj;//被设置事件的对象
        this.firing=FALSE,//事件是否正在执行
        this.listeners=[];
    }   

    SANIMUTIL.Event.prototype={

        createListener:function(fn,scope,options){
            options=options||{};
            scope=scope||this.obj;
            return {
                fn:fn,
                fireFn:fn,
                scope:scope,
                options:options
            }
        },

        addListener:function(fn,scope,options){
            var me=this;

            scope=scope||me.obj;

            if(!me.isListening(fn,scope)){
                var l=me.createListener(fn,scope,options);
                if(me.firing){
                    me.listeners=me.listeners.slice(0);
                }
                me.listeners.push(l);
            }
        },

        findListener:function(fn,scope){
            var me=this,
                lists=me.listeners,
                retIndex=-1;

            SimpleAnim.each(lists,function(list,index){
                if(list){
                    if(list.fn==fn&&list.scope==scope){
                        retIndex=index;
                        return false;
                    }
                }
            })
            return retIndex;
        },

        isListening:function(fn,scope){
            return this.findListener(fn.scope)!=-1;
        },

        removeListener:function(fn,scope){
            var index=this.findListener(fm,scope),
                me=this;

            if(index!=-1){
                //如果事件正在执行中，不要打断事件的执行。
                //需要重新拷贝一份数据出来
                if(me.firing){
                    me.listeners=me.listeners.slice(0);
                }
                me.listeners.splice(index,1);
                return TRUE;
            }
            return FALSE;
        },

        clearListeners:function(){
            var me=this,
                l=me.listeners,
                i=l.length;

            while(--i){
                 me.removeListener(l[i].fn,li[i],scope);
            }
        },

        fire:function(){
            var me=this,
                ls=me.listeners,
                len=ls.length;

            if(len>0){
                var args=Array.prototype.slice.call(arguments,0);
                me.firing=TRUE;
                for(var i=0,l;i<len;i++){
                    l=ls[i];
                    if(l&&l.fireFn.apply(l.scope||me.obj||window,args)==FALSE){
                        return (me.firing=FALSE);
                    }
                }
                me.firing=FALSE
                return TRUE;
            }

        }

    }

})()