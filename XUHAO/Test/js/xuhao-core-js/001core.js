/**
 * 用于测试基本的代码
 */
var _xuhao={};
XUHAO.apply(_xuhao,{
	sex:'男',
	face:'帅'
});

XUHAO.applyIf();


//测试数据类型
/*
var Name='类型'
function test(){}
console.log(Name+XUHAO.isObject(_xuhao));
console.log(Name+XUHAO.isEmpty('',false));
console.log(Name+XUHAO.isArray([]));
console.log(Name+XUHAO.isPrimitive('123'));
console.log(Name+XUHAO.isFunction(test));
console.log(Name+XUHAO.isDefined(Name));
*/

//测试getDom等方法

//console.log(XUHAO.getDom('div0').style);


function Animal(name){

	this.name=name;

}

function Dog(color){

	this.color=color;

}

XUHAO.extend(Dog,Animal,{

	say:function(){

		console.log(this.name);

	}

});


var Dog1=XUHAO.extend(Dog,{

	dogWangWang:function(){
		console.log('wang wang wang');
	}

});

var dog=new Dog('red');
var dog1=new Dog1('blue');


//dog.say()
dog1.dogWangWang();
//console.log(dog);
//
XUHAO.namespace('xu.hao.love.you');

var config={
	'type':'123',
	'name':['a','b','c']
}

//var urlEn=XUHAO.urlEncode(config,'xuhao');
//console.log(urlEn);

console.log(XUHAO.toArray('xuhao',1,3));

var oDiv=document.getElementsByTagName('body')[0];
console.log(oDiv.childNodes);
console.log(XUHAO.toArray(oDiv.childNodes));

function sayName(name){
	alert(name);
}




var sayXuhao=sayName.createInterceptor(function(name){
	return name=='xuhao';
});

//sayXuhao('nima');
//sayXuhao('xuhao');


var testCB=function(){
	alert('nimei');
}

//测试createDelegate


function testDelegate(){
	alert('hahha');
}

testDelegate.createDelegate(window,['a','b','c','d'],2)({e:'e'},'f','g','h');



































