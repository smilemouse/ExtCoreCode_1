//模拟多线程操作
/**
 * [多线程操作]
 *
 *	1) 
 *		var task={
 *			run:function(){
 *				//操作方法
 *				return false //表示退出线程
 *			},
 *
 *			onStop:function(){
 *				//线程停止后调用的方法
 *			}
 * 
 * 			interval:1000 //定时器
 *
 * 			repeat:10, //表示执行的次数 后 停止执行线程
 * 
 * 			duration:10*1000 //多少时间段内停止执行线程
 * 			
 *		}
 *
 *		XUHAO.TaskMgr.start(task);
 *		
 *  	XUHAO.TaskMgr.stop(task);
 *
 * 		XUHAO.TaskMgr.stopAll();
 *
 * 
 */
XUHAO.util.TaskRunner=function(interval){
	interval=interval||10;
	var tasks=[],
		removeQueue=[],
		id=0,
		running=false,

		stopThread=function(){
			runing=false;
			clearInterval(id);
			id=0;
		},

		startThread=function(){
			if(!running){
				running=true;
				id=setInterval(runTasks, interval);
			}
		},

		removeTask=function(t){
			removeQueue.push(t);
			if(t.onStop){
				t.onStop.apply(t.scope||t);
			}
		},

		runTasks=function(){
			var rqLen=removeQueue.length,
				now=new Date().getTime();

			if(rqLen>0){
				for(var i=0;i<rqLen;i++){
					tasks.remove(removeQueue[i]);
				}
				removeQueue=[];
				if(tasks.length<1){
					stopThread();
					return ;
				}
			}

			for(var i=0,t,itime,rt,len=tasks.length;i<len;i++){
				t=tasks[i];
				itime=now-t.taskRunTime;	
				if(t.interval<=itime){
					rt=t.run.apply(t.scope||t,t.args||[++t.taskRunCount]);
					t.taskRunTime=now;
					if(rt===false||t.taskRunCount==t.repeat){
						removeTask(t);
						return;
					}
				}
				if(t.duration&&t.duration<=(now-t.taskStartTime)){
					removeTask(t);
				}
			}
		};

	this.start=function(task){
		tasks.push(task);
		task.taskStartTime=new Date().getTime();
		task.taskRunTime=0;
		task.taskRunCount=0;
		startThread();
		return task;
	};

	this.stop=function(task){
		removeTask(task);
		return task;
	};

	this.stopAll=function(){
		stopThread();

		for(var i=0, len=tasks.length;i<len;i++){
			if(task[i].onStop){
				task[i].onStop();
			}
		}
		tasks=[];
		removeQueue=[];
	};

}


XUHAO.TaskMgr=new XUHAO.util.TaskRunner();