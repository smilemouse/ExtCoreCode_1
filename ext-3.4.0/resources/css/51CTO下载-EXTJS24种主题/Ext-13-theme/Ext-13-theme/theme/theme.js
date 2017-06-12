Ext.onReady(function(){
	var theme=getCookie('xtheme');//获取cookie里面的主题
		if(theme!=null){
			Ext.sys.selector(theme);
		}
		
	//--------------------------------
		var el = Ext.get('divhello');//加载进度图片
		el.remove();
	//-----------------------------
	document.getElementById("btnAlert").onclick=function(){
		Ext.sys.winStyle.show();//更改主题
	};
});