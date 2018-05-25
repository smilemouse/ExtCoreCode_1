/**
 * Element的插入方法总集合
 */

XUHAO.Element.addMethods(function(){
	var GETDOM=XUHAO.getDom(),
		GET=XUHAO.get,
		DH=XUHAO.DomHelper;

	return {

		appendChild:function(el){
			return GET(el).appendTo(this)
		},

		appendTo:function(el){
			GETDOM(el).appendChild(this.dom);
			return this;
		},

		insertBefore:function(el){
			(el=GETDOM(el)).parentNode.insertBefore(this.dom,el);
			return this;
		},

		insertAfter:function(el){
			(el=GETDOM(el)).parentNode.insertBefore(this.dom,el.nextSibiling);
			return this;
		},

		insertFirst:function(el,returnDom){
			el=el||{};

			if(el.nodeType||el.dom||typeof el=='string'){
				el=GETDOM(el);
				this.dom.insertBefore(el,this.dom.firstChild);
				return !returnDom?GET(el):el;
			}else{
				return this.createChild(el,this.dom.fistChild,returnDom);
			}

		},

		replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },

	    replaceWith: function(el){
		    var me = this;
                
            if(el.nodeType || el.dom || typeof el == 'string'){
                el = GETDOM(el);
                me.dom.parentNode.insertBefore(el, me.dom);
            }else{
                el = DH.insertBefore(me.dom, el);
            }
	        
	        delete Ext.elCache[me.id];
	        Ext.removeNode(me.dom);      
	        me.id = Ext.id(me.dom = el);
	        Ext.Element.addToCache(me.isFlyweight ? new Ext.Element(me.dom) : me);     
            return me;
	    },

		createChild:function(config.insertBefore,returnDom){
			config=config||{tag:'div'};

			return DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},

		
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},

		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Ext.get(el) : el;
		}
	}

}());