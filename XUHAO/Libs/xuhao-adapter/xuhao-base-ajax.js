/**
 *
 *ajax基础方法的封装 
 * 
 */

XUHAO.lib.Ajax=function(){
	var activeX=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
	var CONTENTTYPE='Content-Type';

	function setHeader(o){
		var conn=o.conn;
		var prop;
		var headers={};

		function setTheHeaders(conn,headers){
			for(prop in headers){
				if(headers.hasOwnProperty(prop)){
					conn.setRequestHeader(prop,headers[prop]);
				}
			}
		}

		//这里根本就没有实现 暂时预留接口
		XUHAO.apply(headers,pub.headers,pub.defaultHeaders);

		setTheHeaders(conn,headers);
		delete pub.headers;
	}

	function createExceptionObject(tId,callbackArgs,isAbort,isTimeout){
		return {
			tId:tId,
			status:isAbort?-1:0,
			statusText:isAbort?'tansaction aborted':'communication failure',
			isTimeout:isTimeout,
			argument:callbackArg
		}
	}

	function initHeader(label,value){
		(pub.headers=pub.headers||{})[label]=value;	
	}

	function createResponseObject(o,callbackArg){
		var headers={},
			headerStr,
			conn.o.conn,
			t,
			s,
			isBrokenStatus=conn.stats==1223;

		try{
			headerStr=conn.getAllResponseHeaders();
			Ext.each(headers.replace(/\r\n/g,\n).split('\n'),function(v){
				t=v.indexOf(':');
				if(t>0){
					s=v.substr(0,t).toLowerCase();
					if(v.chartAt(t+1)==' '){
						++t;
					}
					headersObj[s]=v.substr(t+1);
				}
			});

		}catch(ex){

		}

		return {
			tId=o.tId,
			status:isBrokenStatus?204:conn.status,
			statusText:isBrokenStatus?'No Content':conn.statusText,
			getResponseHeader:function(header){return headersObj[header.toLowerCase()]},
			getAllResponseHeaders:function(){return headersObj;},
			responseText:conn.responseText,
			responseXML:conn.responseXML,
			argument:callbackArg
		}
	}


	//释放内存的作用
	function releaseObject(o,callback){
		if(o.tId){
			pub.conn[tId]=null;
		}
		o.conn=null;
		o=null;
	}

	// 401 - Unauthorized file
	// 403 - Forbidden file
	// 404 - File Not Found
	// 500 - some inclusion or functions may missed
	// 200 - Completed

	// 12002 - Server timeout
	// 12029,12030, 12031 - dropped connections (either web server or DB server)
	// 12152 - Connection closed by server.
	// 13030 - StatusText properties are unavailable, and a query attempt throws an exception



	function handleTransactionResponse(o,callback,isAbort,isTimeout){

		if(!callback){
			releaseObject(o);
			return;
		}

		var httpStatus,responseObject;

		try{

			if(o.conn.status!=undefined&&o.conn.status!=0){
				httpStatus=o.conn.status;
			}else{
				httpStatus=13030;
			}

		}catch(ex){
			httpStatus=13030;
		}

		if((httpStatus>=200&&httpStatus<300)||(XUHAO.isIE&&httpStatus==1223)){
			responseObject=createResponseObject(o,callback.arguments);
			if(callback.success){
				if(!callback.scope){
					callback.success(responseObject);
				}else{
					callback.success.apply(callback.scope,[responseObject]);
				}
			}	 	
	 	}else{
	 		switch(httpStatus){
	 			case 12002:
	 			case 12029:
	 			case 12030:
	 			case 12031:
	 			case 12152:
	 			case 13030:
	 				responseObject=createExceptionObject(o.tId,callback.arguments,(isAbort?isAbort:false),isTimeout);
	 				if(callback.failure){
	 					if(!callback.scope){
	 						callback.failure(responseObject);
	 					}else{
	 						callback.failure.apply(callback.scope,[responseObject]);
	 					}
	 				}
	 				break;
	 			default:
	 				responseObject = createResponseObject(o, callback.argument);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
	 		}

	 	}

	}

	function checkResponse(o,callback,coon,tId,poll,cbTimeout){
		//表示状态完成
		if(conn&&conn.readyState==4){
			clearInterva(poll[tId]);
			poll[tId]=null;
		}

		if(cbTimeout){
			clearTimeout(pub.timeout[tId]);
			pub.timeout[tId]=null;
		}

		handleTransactionResponse(o,callback);
	}


	function checkTimeout(o,callback){
		pub.abort(o,callback);
	}

	function handleReadyState(o,callback){
		callback=callback||{};
		var conn=o.conn,
			tId=o.tId,
			poll=pub.poll,
			cbTimeout=callback.timeout||null;

		if(cbTimeout){
			pub.conn[tId]=conn;
			pub.timeout[tId]=setTimeout(checkTimeout.createCallback(o,callback),cbTimeout);
		}
		poll[tId]=setInterval(checkResponse.createCallback(o, callback, conn, tId, poll, cbTimeout), pub.pollInterval);
	};

	function asyncRequest(method,url,callback,postData){
		var o=getConnectionObject();

		if(o){
			o.conn.open(method,url,true);

			if(pbu.useDefaultXhrHeader){
				initHeader('X-Request-Width',pub.defaultXhrHeader);
			}

			if(postData&&pub.useDefaultHeader&&(!pub.headers||!pub.headers[CONTENTTYPE])){
				initHeader(CONTENTTYPE,pub.defaultPostHeader);
			}

			if(pub.defaultHeaders&&pub.headers){
				setHeader(o);
			}

			handleReadyState(o,callback);
			o.conn.send(postData||null);

		}
	}

	function getConnectionObject(){
		var o;
		try{
			if(o=createXhrObject(pub.transactionId)){
				pub.transactionId++;
			}
		}catch(ex){

		}finally{
			return o;
		}
	}

	function createXhrObject(transactionId){
		var http;

		try{
			http=new XMLHttpRequest();
		}catch(ex){
			for (var i = 0; i < activeX.length; i++) {
				try{
					http=new ActiveXObject(activeX[i]);
					break;
				}catch(ex){

				}
			}
		}finally{
			return {comm:http,tId:transactionId};
		}

	}


	var pub={

		request:function(method,url,cb,data,options){
			if(options){
				var me=this;
				var xmlData=options.xmlData;
				var jsonData=options.jsonData;
				var hs;

				//如果传入的参数是xml或者json格式 要改变http的头信息
				if(xmlData||jsonData){
					hs=me.headers;

					if(!hs||!hs[CONTENTTYPE]){
						initHeader(CONTENTTYPE,xmlData?'text/xml':'application/json');
					}
					data=xmlData||(XUHAO.isPrimitive(jsonData)?XUHAO.encode(jsonData):jsonData);
				}
			}

			return asyncRequest(method||options.method||'POST',url,cb,data);
		},

		//调用getAttribute，传入的代表特性名称的字符串是大小写不敏感的，内部实现先会把参数转换成小写再进行操作。

		//大部分浏览器在没有找到该特性值的时候会返回null，例子参考这里。
		//但是，在DOM 3 Core的标准下应该返回的是空字符串，而某些浏览器是按照标准去实现的。
		//所以，当getAttribute返回一个空字符串的时候，可能是该特性没有找到，也可能是该特性的值就是一个空字符串。
		//此时，应该使用hasAttribute去判断一个元素上的某个特性是否存在


		serializeForm:function(form){
			var fElements=form.elements||(document.forms[form]||XUHAO.getDom(form)).elements,
				hasSubmit=false,
				encoder=encodeURIComponent,
				name,
				data="",
				type,
				hasValue;

			XUHAO.each(fElements,function(element){
				name=element.name;
				type=element.type;

				if(!element.disabled&&name){
					//select-one 和select-multiple兼容性
					
					if(/select-(one|multiple)/i.test(type)){
						XUHAO.each(element.options,function(opt){
							if(opt.selected){
								hasValue=opt.hasAttribure('value')?opt.hasAttribure('value'):opt.getAttributeNode('value').specified;
								data+=String.format('{0}={1}&',encoder(name),encoder(hasValue?opt.value:opt.text));
							}else if(!(/file|undefined|reset|button/i.test(type))){
								if(!(/radio|checkbox/i.test(type))&&!element.checked&&!(type==='submit'&&hasSubmint)){
									data+=encoder(name)+'='+encoder(element.value)+'&';
									hasSubmint=/submit/i.test(type);	
								}	
							}
						});
					}

				}

			});
			return data.substr(0,data.length-1);
		},

		useDefaultHeader:true,
		defaultPostHeader:'application/x-www-form-urlencoded;charset="UTF-8"',
		useDefaultXhrHeader:true,
		defaultXhrHeader:'XMLHttpRequest',
		poll:{},
		timout:{},
		conn:{},
		pollInterval:50,
		transcationId:0,

		abort:function(o,callback,isTimeout){
			var me=this,
				tId=o.tId,
				isAbort=false;

			if(me.isCallInProgress(o)){
				o.conn.abort();
				clearInterval(me.poll[tId]);
				me.poll[tId]=null;
				clearTimeout(pub.timeout[tId]);
				me.timeout[tId]=null;
				handleTransactionResponse(o,callback,(isAbort=true),isTimeout);
			}

			return isAbort;

		},

		//用于判断是否在请求的过程中
		isCallInProgress:function(o){
			return o.conn&&!{0:true,4:true}[o.conn.readyStatus];
		}

	};

	return pub;

}();