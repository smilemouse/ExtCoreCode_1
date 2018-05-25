(function(){

var EXTUTIL = Ext.util,
    EACH = Ext.each,
    TRUE = true,
    FALSE = false;

EXTUTIL.Observable = function(){
   
    var me = this, e = me.events;
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

EXTUTIL.Observable.prototype = {
  
    filterOptRe : /^(?:scope|delay|buffer|single)$/,

    fireEvent : function(){
        var a = Array.prototype.slice.call(arguments, 0),
            ename = a[0].toLowerCase(),
            me = this,
            ret = TRUE,
            ce = me.events[ename],
            cc,
            q,
            c;
        if (me.eventsSuspended === TRUE) {
            if (q = me.eventQueue) {
                q.push(a);
            }
        }
        else if(typeof ce == 'object') {
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

    addListener : function(eventName, fn, scope, o){
        var me = this,
            e,
            oe,
            ce;
            
        if (typeof eventName == 'object') {
            o = eventName;
            for (e in o) {
                oe = o[e];
                if (!me.filterOptRe.test(e)) {
                    me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
                }
            }
        } else {
            eventName = eventName.toLowerCase();
            ce = me.events[eventName] || TRUE;
            if (typeof ce == 'boolean') {
                me.events[eventName] = ce = new EXTUTIL.Event(me, eventName);
            }
            ce.addListener(fn, scope, typeof o == 'object' ? o : {});
        }
    },

    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if (typeof ce == 'object') {
            ce.removeListener(fn, scope);
        }
    },

  
    purgeListeners : function(){
        var events = this.events,
            evt,
            key;
        for(key in events){
            evt = events[key];
            if(typeof evt == 'object'){
                evt.clearListeners();
            }
        }
    },

    addEvents : function(o){
        var me = this;
        me.events = me.events || {};
        if (typeof o == 'string') {
            var a = arguments,
                i = a.length;
            while(i--) {
                me.events[a[i]] = me.events[a[i]] || TRUE;
            }
        } else {
            Ext.applyIf(me.events, o);
        }
    },

 
    hasListener : function(eventName){
        var e = this.events[eventName.toLowerCase()];
        return typeof e == 'object' && e.listeners.length > 0;
    },

  
    suspendEvents : function(queueSuspended){
        this.eventsSuspended = TRUE;
        if(queueSuspended && !this.eventQueue){
            this.eventQueue = [];
        }
    },

   
    resumeEvents : function(){
        var me = this,
            queued = me.eventQueue || [];
        me.eventsSuspended = FALSE;
        delete me.eventQueue;
        EACH(queued, function(e) {
            me.fireEvent.apply(me, e);
        });
    }
};

var OBSERVABLE = EXTUTIL.Observable.prototype;

OBSERVABLE.on = OBSERVABLE.addListener;

OBSERVABLE.un = OBSERVABLE.removeListener;

EXTUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = OBSERVABLE.fireEvent;
};



function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, Array.prototype.slice.call(arguments, 0));
        }
    };
};

function createBuffered(h, o, l, scope){
    l.task = new EXTUTIL.DelayedTask();
    return function(){
        l.task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
    };
};

function createSingle(h, e, fn, scope){
    return function(){
        e.removeListener(fn, scope);
        return h.apply(scope, arguments);
    };
};

function createDelayed(h, o, l, scope){
    return function(){
        var task = new EXTUTIL.DelayedTask(),
            args = Array.prototype.slice.call(arguments, 0);
        if(!l.tasks) {
            l.tasks = [];
        }
        l.tasks.push(task);
        task.delay(o.delay || 10, function(){
            l.tasks.remove(task);
            h.apply(scope, args);
        }, scope);
    };
};


EXTUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
};

EXTUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
            l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.push(l);
        }
    },

    createListener: function(fn, scope, o){
        o = o || {};
        scope = scope || this.obj;
        var l = {
            fn: fn,
            scope: scope,
            options: o
        }, h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        if(o.delay){
            h = createDelayed(h, o, l, scope);
        }
        if(o.single){
            h = createSingle(h, this, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o, l, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){
        var list = this.listeners,
            i = list.length,
            l;

        scope = scope || this.obj;
        while(i--){
            l = list[i];
            if(l){
                if(l.fn == fn && l.scope == scope){
                    return i;
                }
            }
        }
        return -1;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
            l,
            k,
            me = this,
            ret = FALSE;
        if((index = me.findListener(fn, scope)) != -1){
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            l = me.listeners[index];
            if(l.task) {
                l.task.cancel();
                delete l.task;
            }
            k = l.tasks && l.tasks.length;
            if(k) {
                while(k--) {
                    l.tasks[k].cancel();
                }
                delete l.tasks;
            }
            me.listeners.splice(index, 1);
            ret = TRUE;
        }
        return ret;
    },

    clearListeners : function(){
        var me = this,
            l = me.listeners,
            i = l.length;
        while(i--) {
            me.removeListener(l[i].fn, l[i].scope);
        }
    },

    fire : function(){
        var me = this,
            listeners = me.listeners,
            len = listeners.length,
            i = 0,
            l;

        if(len > 0){
            me.firing = TRUE;
            var args = Array.prototype.slice.call(arguments, 0);
            for (; i < len; i++) {
                l = listeners[i];
                if(l && l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
                    return (me.firing = FALSE);
                }
            }
        }
        me.firing = FALSE;
        return TRUE;
    }

};
})();
