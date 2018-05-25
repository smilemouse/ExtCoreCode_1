XUHAO.Element.addMethods(function(){
	var PARENTNODE='parentNode',
		NEXTSIBLIING='nextSibling',
		PREVIOUSSIBLING='previousSibling',
		DQ=XUHAO.DomQuery,
		GET=XUHAO.get;

	return {

		/**
		 * returnEl true返回的Element false返回的是DOM
		 * @param  {[type]} simpleSelector [description]
		 * @param  {[type]} maxDepth       [description]
		 * @param  {[type]} returnEl       [description]
		 * @return {[type]}                [description]
		 */
		findParent:function(simpleSelector,maxDepth,returnEl){
			var p=this.dom,
				b=document.body,
				depth=0,
				stopEl;

			maxDepth=maxDepth||50;

			if(isNaN(maxDepth)){
				stopEl=XUHAO.getDom(maxDepth);
				maxDepth = Number.MAX_VALUE;
			}
			while(p&&p.nodeType==1&&depth<maxDepth&&p!=b&&p!=stopEl){
				if(DQ.is(p, simpleSelector)){
					return returnEl?GET(P):P;
				}
				depth++;
	            p = p.parentNode;
			}
			return null;
		},

		findParentNode:function(simpleSelector,maxDepth,returnEl){
			//判断父节点是否存在
			var p=XUHAO.fly(this.dom.parentNode, '_internal');
			return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
		},

		//向上查找
		up : function(simpleSelector, maxDepth){
	        return this.findParentNode(simpleSelector, maxDepth, true);
	    },

	    select : function(selector){
	        return Ext.Element.select(selector, this.dom);
	    },

	    query : function(selector){
	        return DQ.select(selector, this.dom);
	    },

	    child : function(selector, returnDom){
	        var n = DQ.selectNode(selector, this.dom);
	        return returnDom ? n : GET(n);
	    },

	    down : function(selector, returnDom){
	        var n = DQ.selectNode(" > " + selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	    parent : function(selector, returnDom){
	        return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
	    },
	    next : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
	    },
	    prev : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
	    },
	    last : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
	    },
	    matchNode : function(dir, start, selector, returnDom){
	        var n = this.dom[start];
	        while(n){
	            if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
	                return !returnDom ? GET(n) : n;
	            }
	            n = n[dir];
	        }
	        return null;
	    }
	}

}());