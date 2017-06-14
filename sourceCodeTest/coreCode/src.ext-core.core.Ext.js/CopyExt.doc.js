//脚本结构分析

16-27 定义全局变量Ext

37-48 Ext.apply(o,c,defaults)//相当于属性拷贝，第三个参数为默认 如果存在 则和c一起拷贝到o中

50-842 封装了Ext基本方法：
	{
		浏览器判别
		系统判别
		applyIf
		id（el,prefix） //	获取元素的id或者自定义id prefix---前缀。	
		extend
		override
		namespace
		urlEncode
		urlDecode
		urlAppend
		toArray
		isIterable
		each
		iterate
		getDom
		getBody
		getHead
		removeNode
		isEmpty
		isArray
		isDate
		isObject
		isPrimitive  // string  number boolean 三种类型的判断
		isFunction
		isNumber
		isString
		isBoolean
		isElement
		isDefined
		
		Ext.ns('Ext.util', 'Ext.lib', 'Ext.data', 'Ext.supports');
		
		Function :{
			createInterceptor
			createCallback
			createDelegate
			defer
		}
		String :{
			format
		}
		
		Array:{
			indexOf
			remove
		}
		
		
		
	}