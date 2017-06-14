//Extjs代码复制
window.undefind=window.undefind;

var cExt={
	version:"3.4.0",
	versionDetail:{
		major:3, //主要的
		minor:4, //辅助
		parch:0	 //补丁
	}
}

//对象的浅复制
cExt.apply=function(o,c,defaults){

	if(defaults){
		Ext.apply(c,defaults);
	}

	if(o && typeof o=="object" c && typeof c=="object"){
		for(var p in c){
			o[p]=c[p];
		}
	}
}
(function(){
	var idSpeed=0,
		toString=Object.prototype.toString,
		ua=navigator.userAgent.toLowerCase(),
		check=function(r){
			return r.test(ua);
		},
		DOC=document,
		docMode=DOC.documentMode,//属性返回浏览器渲染文档的模式。 只有IE支持 返回的是数字
		isStrict=DOC.compatMode=="CSS1Compat",//"CSS1Compat"  "BackCompat"
		isOpera=check(/opera/),
		isChrome=check(/chrome/),
		isWebkit=check(/webkit/),
		//主要是chrome中含有Safari字样
		isSafari=!isChrome&&check(/safari/),//"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 **Safari***/537.36" chrome
		isSafari2=isSafari&&check(/applewebkit\/4/),
		isSafari3=isSafari&&check(/version\/3/),
		isSafari3=isSafari&&check(/version\/3/),
		isIE=!isOpera&&check(/msie/),
		isIE7=isIE&&check(/msie 7/),
		isIE8=isIE&&check(/msie 8/),
		isIE9=isIE&&check(/msie 9/),
		isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
 		isBorderBox = isIE && !isStrict,//是否是标准的盒子模型 只有ie低版本才出现这情况
 		isWindows = check(/windows|win32/),
 		isMac = check(/macintosh|mac os x/),
 		isAir = check(/adobeair/),
 		isLinux = check(/linux/),
 		isSecure = /^https/i.test(window.location.protocol);//是否是安全的浏览地址

 		if(isIE6){
 			try{
 				document.execCommand('BackgroundImageCache',false,true);
 			}catch(e){

 			}

 		}

 		Ext.apply(Ext,{

 			SSL_SECURE_URL:isSecure&&isIE?'javascript:""':'about:blank',
 			isStrict:isStrict

 		});


})()

