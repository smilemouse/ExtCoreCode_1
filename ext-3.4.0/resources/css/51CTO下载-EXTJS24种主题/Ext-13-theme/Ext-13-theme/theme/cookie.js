/**
 * @name Cookie.js
 * 这应该是一个比较老式的cookie工具了，如果想用这个工具类保存一下
 * 不重要的东西还是可以的(如状态等等)，用户名和密码就别想了
 */

/**
 * 保存
 * @param {Object} name
 * @param {Object} value
 */
saveCookie = function(name, value){
    //保存一个月
    var saveDate = new Date((new Date()).getTime() + 30 * 24 * 3600 * 1000);
    //console.log(saveDate.toUTCString());
    Cookies.set(name, value, saveDate);
}
/**
 * 获取
 * @param {Object} name
 */
getCookie = function(name){
    return Cookies.get(name);
}
/**
 * 清除
 * @param {Object} name
 */
clearCookie = function(name){
    Cookies.clear(name);
}

var Cookies = {};
Cookies.set = function(name, value){
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : '/';
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + encodeURIComponent(value) +
    ((expires == null) ? "" : ("; expires=" + expires.toUTCString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
};

Cookies.get = function(name){
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while (i < clen) {
        j = i + alen;
        if (document.cookie.substring(i, j) == arg) 
            return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) 
            break;
    }
    return null;
};

Cookies.clear = function(name){
    if (Cookies.get(name)) {
        document.cookie = name + "=" +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};

Cookies.getCookieVal = function(offset){
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return decodeURIComponent(document.cookie.substring(offset, endstr));
};