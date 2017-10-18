function A() {
	this.model='A';
	this.showModel=function (argument) {
		alert(this.model);
	}
}

function B() {
	//this.model='B';
}

B.prototype.constructor=A.prototype.constructor;

B.constructor.prototype.type='123';

var b=new B();


var C=B.constructor;

console.log(C())

console.log(B.constructor===A.constructor);

//b.showModel();
console.log(b.type);
