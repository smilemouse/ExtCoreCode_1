XUHAO.util.JSON=new (function(){
	var useHasOwn=!!{}.hasOwnProperty,
		isNative=function(){
			var useNative=null;

			return function(){
				if(useNative===null){
					useNative=XUHAO.USE_NATIVE_JSON&&window.JSON&&JSON.toString()=='[object JSON]';
				}
				return useNative;
			}
		}(),
		pad:function(n){
			return n<10?'0'+n:n;
		},
		doDecode:function(json){
			
		}


})();