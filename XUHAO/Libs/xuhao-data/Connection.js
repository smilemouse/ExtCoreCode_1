/**
 * 重新封装ajax调用的方法
 */

(function() {
	var BEFOREREQUEST = 'beforequest',
		REQUESTCOMPLETE = 'requestcomplete',
		REQUESTEXCEPTION = 'requestexception',
		UNDEFINED = undefined,
		LOAD = 'load',
		POST = 'post',
		GET = 'get',
		WINDOW = window;

	XUHAO.data.Connection = function(config) {

		XUHAO.apply(this, config);
		this.addEvents(
			BEFOREREQUEST,
			REQUESTCOMPLETE,
			REQUESTEXCEPTION
		);
		XUHAO.data.Connection.superclass.constructor.call(this);

	}

	XUHAO.extend(XUHAO.data.Connection, XUHAO.util.Observable, {

		//请求数据定时器
		timeout: 30000,

		//是否自动中断
		autoAbort: false,

		//是否使用缓存
		disableCaching: true,

		//清除缓存参数名称
		disableCachingParam: '_dc',

		//主要调用方法
		request: function(o) {
			var me = this;

			//请求之前处理参数过程
			if (me.fireEvent(BEFOREREQUEST, me, o)) {

				//对Element进行数据请求
				if (o.el) {
					if (!XUHAO.isEmpty(o.indicatorText)) {
						me.indicatorText = '<div class="loading-indicator">' + o.indicatorText + "</div>"
					}

					if(me.indicatorText){
						XUHAO.getDom(o.el).innerHTML=me.indicatorText;
					}

					o.success=(XUHAO.isFunction(o.success)?o.success:function(){}).createInterceptor(function(response){
						XUHAO.getDom(o.el).innerHTML=response.responseText;
					});
				}

				var p=o.params,
					url=o.url||me.url,
					method,
					cb={
						success:me.handleResponse,
						failure:me.handleFailure,
						scope:me,
						argument:{options:o},
						timeout:XUHAO.num(o.timeout,me.timeout)
					},
					form,
					serForm;

				//参数如果是函数形式时	
				if(XUHAO.isFunction(p)){
					p=p.call(o.scope||WINDOW,o);
				}

				p=XUHAO.urlEncode(me.extraParams,XUHAO.isObject(p)?XUHAO.urlEncode:p);

				// URL是通过函数形式返回的模式
				if(XUHAO.isFunction(url)){
					url=url.call(o.scope||WINDOW,o);
				}

				//ajax表单提交
				if((form=XUHAO.getDom(o.form))){
					url=url||form.action;

					/*application/x-www-form-urlencoded	在发送前编码所有字符（默认）
					multipart/form-data	不对字符编码。
					在使用包含文件上传控件的表单时，必须使用该值。
					text/plain	空格转换为 "+" 加号，但不对特殊字符编码(HTML5)。*/

					if(o.isUpload||(/multipart\/form-data/i.test(form.getAttribute('enctype')))){
						return doFormUpload.call(me,o,p,url);
					}
					serForm=XUHAO.lib.Ajax.serializeForm(form);
					p=p?p = p ? (p + '&' + serForm) : serForm;
				}

				method=o.method||me.method||((p||o.xmlData||jsonData)?POST:GET);

				//method==GET判断在这里应该是多余的 
				if(method==GET&&(me.disableCaching&&o.disableCaching!==false)||o.disableCaching === true){
					var dcp=o.disableCachingParam||me.disableCachingParam;
					url=XUHAO.urlAppend(url,dcp+'='(new Date().getTime()));
				}

				//设置headers
				o.headers=XUHAO.applyIf(o.headers||{},me.defaultHeaders||{});
				if(o.autoAbort===true||me.autoAbort){
					me.abort();
				}

				if((method==GET||o.xmlData||o.jsonData)&&p){
					url = Ext.urlAppend(url, p);
                    p = '';
				}
				return (me.transId=XUHAO.lib.Ajax.request(method, url, cb, p, o));
			}else{
				 return o.callback ? o.callback.apply(o.scope, [o,UNDEFINED,UNDEFINED]) : null;
			}

		},

		isLoading:function(transId){
			return transId?XUHAO.lib.Ajax.isCallInProgress(transId):!!this.transId;
		},

		abort:function(transId){
			if(transId||this.isLoading()){
				XUHAO.lib.Ajax.abort(transId||this.transId);
			}
		},

		handleResponse:function(response){
			this.transId=false;
			var options=response.arguments.options;
			response.argument=options? options.argument : null;
			this.fire(REQUESTCOMPLETE,this,response,options);
			if(options.success){
				options.success.call(options.scope,response,options);
			}
			if(options.callback){
                options.callback.call(options.scope, options, true, response);
            }
		},

		handleFailure : function(response, e){
            this.transId = false;
            var options = response.argument.options;
            response.argument = options ? options.argument : null;
            this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
            if(options.failure){
                options.failure.call(options.scope, response, options);
            }
            if(options.callback){
                options.callback.call(options.scope, options, false, response);
            }
        },

        doFormUpload:function(){
        	var id=XUHAO.id(),
        		doc=document,
        		frame=doc.createElement('iframe'),
        		form=XUHAO.getDom(o.form),
        		hiddens=[],
        		hd,
        		encoding='multipart/form-data',
        		buf={
        			target:form.target,
        			method:form.method,
        			encoding:form.encoding,
        			enctype:form.enctype,
        			action:form.action
        		};

        	XUHAO.fly(frame).set({
        		id:id,
        		name:id,
        		cls:'x-hidden',
        		src:XUHAO.SSL_SCURE_URL
        	});

        	doc.body.appendChild(frame);

        	if(XUHAO.isIE){
        		doc.frames[id].name=id;
        	}
        	XUHAO.fly(form).set({
        		target:id,
        		method:POST,
        		enctype:encoding,
        		encoding:encoding,
        		action:url||bug.action
        	});
        	XUHAO.iterate(Ext.urlDecode(ps, false), function(k, v){
                hd = doc.createElement('input');
                Ext.fly(hd).set({
                    type: 'hidden',
                    value: v,
                    name: k
                });
                form.appendChild(hd);
                hiddens.push(hd);
            });

            function cb(){
            	var me=this,
            		r={
            			responseText:'',
            			responseXML:null,
            			argument:o.argument
            		},
            		doc,
            		firstChild;

            	try{
            		doc=frame.contentWindow.document||frame.contentDocument||WINDOW.frames[id].document;
            		if(doc){
            			if(doc.body){
            				if(/textarea/i.test((firstChild=doc.body.firstChild||{}).tagName)){
            					r.responseText=firstChild.value;
            				}else{
            					r.responseText=doc.body.innerHTML;
            				}
            			}
            			r.responseXML = doc.XMLDocument || doc;
            		}
            	}catche(e){}

            	XUHAO.EventManager.removeListener(frame,LOAD,cb,me);
            	me.fireEvent(REQUESTCOMPLETE,me,r,o);

            	function runCallback(fn,scope,args){
            		if(XUHAO.isFunction(fn)){
            			fn.apply(scope,args);
            		}
            	}

            	runCallback(o.success,o.scope,[r,o]);
            	runCallback(o.callback,o.scope,[o,true,r]);

            	if(!me.debugUploads){
            		setTimout(function(){XUHAO.removeNode(frame);},100);
            	}
            }
            XUHAO.EventManager.on(frame,LOAD,cb,this);
            form.submit();
            XUHAO.fly(form).set(buf);
            XUHAO.each(hiddens, function(h) {
                XUHAO.removeNode(h);
            });
        }

	})

})();

XUHAO.Ajax=new XUHAO.data.Connection({
	autoAbort:false,
	serializeForm:function(form){
		return XUHAO.lib.Ajax.serializeForm(form);
	}
});