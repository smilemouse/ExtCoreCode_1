/**
	Object-Oriented Programming 面向对象编程
	Object-Oriented Design 面向对象设计
	Object-Oriented Analysis 面向对象分析
 */
//只有构造函数才有prototype属性，而构造函数的实例是没有该属性的
//每一个函数的Prototype属性指向的对象都包含唯一一个不可枚举属性constructor,该属性的值是这么一个对象：它指向了它所在的构造函数。
//prototype.constructor仅仅可以用于识别对象是由哪个构造函数初始化的，仅此而已。
//
//
//
//主要用于复习面向对象编程
//所谓"构造函数"，其实就是一个普通函数，但是内部使用了this变量。对构造函数使用new运算符，就能生成实例，并且this变量会绑定在实例对象上f
//
//


function Animal(name,sex){
	this.name=name;
	this.sex=sex;
}


//构造函数绑定 继承
function Dog(name,sex,color){
	Animal.apply(this,arguments);//重点 利用apply改变函数执行的上下文
	this.color=color;
}

function Cat(color){

	this.color='cat_'+color;
	this.say=function(){
		alert('hahah');
	}
}

Cat.prototype.say1=function(){
	alert('hahah');
}
Dog.prototype.constructor=Cat;

var dog=new Dog('dog','母','red');



function Mouse(color){

	this.color=color;

	this.say=function(){

		alert(this.name);

	}
}


// prototype模式

Mouse.prototype=new Animal('mouse','公');
Mouse.prototype.constructor=Mouse;


var mouse=new Mouse('blue');
var mouse2=new Mouse('gray');

//mouse.say();

mouse.name='mouse12';

//mouse2.say();

// 直接继承prototype
// 


//缺点是Hosue的属性改变可以影响到Animal1的属性

function Animal1(){}

Animal1.prototype.isHasOld='是';

function House(){}

House.prototype=Animal1.prototype;
House.prototype.constructor=House;
House.prototype.change='yes';

var house=new House();
var animal1=new Animal1();
console.log(animal1.change);
console.log(house.isHasOld);

//利用空对象作为媒介来继承

function extend(Child,Parent){

	var F=function(){}
	F.prototype=Parent.prototype;
	Child.prototype=new F();
	Child.prototype.constructor=Child;

}

//拷贝继承
//
function extend2(Child, Parent) {
　　var p = Parent.prototype;　　　　
	var c = Child.prototype;　　　　
	for (var i in p) {　　　　　　
		c[i] = p[i];　　　　　　
	}　　　　
	c.uber = p;
}































