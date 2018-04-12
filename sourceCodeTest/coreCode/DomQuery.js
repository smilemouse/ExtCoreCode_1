//基础类中的DomQuery解析




//公开接口
return {
	getStyle(el,name) //获取某个样式的值
	compile(path,type) 	//
	jsSelect
	isXml
	select
	selectNode
	selectValue
	selectNumber
	is
	filter
	matchers
	operators:{  //选择符 通配
		"="
		"!="
		"^="
		"$="
		"*="
		"%="
		"|="
		"~="
	}
	pseudos:{  //伪类选择符
		first-child
		last-child
		nth-child
		only-child
		empty
		contains
		nodeValue
		checked
		not
		any
		odd
		even
		nth
		first
		last
		has
		next
		prev
	}
	
}

Ext.query = Ext.DomQuery.select;


