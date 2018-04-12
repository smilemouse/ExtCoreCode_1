/**
 *模板基础构造函数
 * 
 */

XUHAO.Template=function(html){
	var me=this,
		a=arguments,
		buf=[],
		v;

	if(XUHAO.isArray(html)){
		html=html.join('');//XUHAO.Templat(['<div>','<a>','</a>','</div>'])
	}else if(a.length>1){
		//XUHAO.Templat(['<div>','<a>','</a>','</div>'])
		
		for(var i=0,len=a.length;i<a;i++){
			v=a[i];
			if(typeof v=='object'){
				//h函数参数中添加了配置参数
				//
				/*var t = new Ext.Template(
				    '&lt;div name="{id}"&gt;',
				        '&lt;span class="{cls}"&gt;{name} {value}&lt;/span&gt;',
				    '&lt;/div&gt;',

				    {
				        compiled: true,      // {@link #compile} immediately
				        disableFormats: true // See Notes below.
				    }

				);*/

				XUHAO.apply(me,v);
			}else{
				buf.push(v);
			}
		}
		html=buf.join('');
	}

	me.html=html;

	//立刻对模板进行编译 默认是false
	if(me.compiled){
		me.compiled();
	}

}

XUHAO.Template.prototype={

	re:/\{([\w\-]+)\}/g,

	applyTemplate:function(values){
		var me=this;

		return me.compiled?
				me.compiled(values):
				me.html.replace(me.re,function(m,name){ //m={name} name='name'
					return values[name]!==undefined?values[name]:'';
				});
	},

	set:function(html,compile){
		var me=this;
		me.html=html;
		me.compiled=null;
		return compile?me.compile():me;
	},


	/*
	windows下enter是 \r\n; 
	linux/unix下是\n; 
	mac下是\r

	此函数实际功能是动态的创建编译好的html字符串
	 */
	compile:function(){
		var me=this,
			sep=Ext.isGecko?'+':',';


		//正则表达式的回调函数
		function fn(m, name){
            name = "values['" + name + "']";
            return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }



        //是对\ r\n \n '做转义
        eval("this.compiled = function(values){ return " + (Ext.isGecko ? "'" : "['") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Ext.isGecko ?  "';};" : "'].join('');};"));
        return me;
	},

	insertFirst:function(el,values,returnElement){
		return this.doInsert('afterBegin',el,values,returnElement);
	},

	insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert:function(where,el,values,returnElement){
    	el=XUHAO.getDom(el);
    	var newNode=XUHAO.DomHelper.insertHtml(where,el,this.applyTemplate(values));
    	return returnElement?Ext.get(newNode, true):newNode;
    },

    overwirte:function(el,values,returnElement){
    	el=XUHAO.getDom(el);
    	el.innerHTML=this.applyTemplate(values);
    	return returnElement?XUHAO.get(el.firstChild,true):el.firstChild;
    }

};

XUHAO.Template.prototype.apply=XUHAO.Template.prototype.applyTemplate;

//静态属性
XUHAO.Template.from=function(el,config){
	el=XUHAO.getDom(el);
	return new XUHAO.Template(el.value||el.innerHTML,config||'');
}