/**
 *延时任务进程
 * 
 */


//new出来的对象 可以作为每一个函数的延时器，要也可以作为重复操作后只执行最后一次

XUHAO.util.DealyedTask=function(fn,scope,args){
	var me=this,
		id,
		call=function(){
			clearInterval(id);
			id=null;
			fn.apply(scope,args||[]);
		}

	me.delay=function(delay,newFn,newScope,newArgs){
		me.cancel();
		fn=newFn||fn;
		scope=newScope||scope;
		args=newArgs||args;
		id=setInterval(call, delay);
	},

	me.cancel=function(){
		if(id){
			clearInterval(id);
			id=null;
		}
	}
}