//DOM选择器
cExt.DomQuery=function(){
    var cache={},
        simpleCache={},
        valueCache={},
        nonSpace=/\S/,
        trimRe=/^\s+|\s+$/g,
        tplRe=/\{\(d+)\}/g,
        modeRe=/^(\s?[\/>+~]\s?|\s|$)/,
        tagTokenRe=/^(#)?([\w\-\*]+)/,
        nthRe=/(\d*)n\+?(\d*)/,
        nthRe2=/\D/,
        isIe=window.ActiveXObject?true:false,
        key=30803;
    eval('var batch=30803');
    
    //查找子节点
    function child(parent,index){
        var i=0,
            n=parent.firstChild;
        while(n){
            if(n.nodeType==1){//表示的是元素的意思
                if(++i==index){
                    return n;
                }
            }
            n=n.nextSibling;
        }
        return null;
    }
    //获取下一个兄弟节点
    function next(n) {
        while ((n=n.nextSibling)&&n.nodeType!=1)
        return n;
    }
    //获取上一个兄弟节点
    function pre(n) {
        while((n=n.previousSibling)&&n.nodeType!=1)}
        return n;
    }

    function children(parent) {
        var n = parent.firstChild,
            nodeIndex = -1,
            nextNode;

        while (n) {
            nextNode = n.nextSibling;
            if (n.nodeType == 3 && !nonSpace.test(n.nodeValue)) {
                parent.removeChild(n);
            } else {
                n.nodeIndex = ++nodeIndex;
            }
            n = nextNode;
        }
        return this;
    }

    function byClassName(nodeSet,cls) {
        
        if(!cls){
            return nodeSet;
        }
        var result=[],ri=-1;

        for(var i=0,ci;ci=nodeSet[i];i++){
            if((' '+ci.className+' ').indexOf(cls)!=-1){
                result[++ri]=ci;
            }
        }
        return result;
    }

    function attrValue(n,attr) {
        //如果n是数组的 选择第一项
        if(!n.tagName&&typeof n.length!='undefined'){
            n=n[0];
        }

        if(!n){
            return nul;
        }

        if(attr==='for'){
            return n.htmlFor;
        }
        if (attr==='class'||attr==='className') {
            return n.className;
        }
        return n.getAttribute(attr)||n[attr]
    }

    function getNodes(ns,mode,tagName) {
        var result=[],ri=-1,cs;

        if(!ns){
            return result;
        }
        tabName=tagName||"*";

        //将ns转化为数组
        if(typeof ns.getElementsByTagName!='undefined'){
            ns=[ns];
        }

        //获取所有的标签对象
        if(!mode){
            for (var i = 0,ni; ni=ns[i]; i++) {
                cs=ni.getElementsByTagName(tagName);
                for (var j = 0,ci;ci=cs[j];j++) {
                   result[++ri]=ci;
                }
            }

        //E>F E/F E后面的所有子元素F    

        }else if(mode=='/'||mode=='>'){
            var utag=tagName.toUpperCase();
            for(var i=0,ni,cn;ni=ns[i];i++)
                cn=ni.childNodes;
                for(var j=0,cj;cj=cn[j];j++){
                    if(cj.nodeName==utag||cj.nodeName=tagName||tagName=='*'){
                        result[++ri]=cj;
                    }

                }
            }

        }else if(mode=='+'){
            var utag=tagName.toUpperCase();
            for(var i=0,n;n=ns[i];i++){
                while((n=n.nextSibling)&&n.nodeType!=1){
                    if(m&(n.nodeName==utag||n.nodeName==tagName||tagName=='*')){
                        result[++ri]=n;
                    }
                }
            }

        }else if(mode=="~"){
            var utag=tagName.toUpperCase();
            for(var i=0,n;n=ns[i];i++){
                while(n=n.nextSibling){
                    if(m&(n.nodeName==utag||n.nodeName==tagName||tagName=='*')){
                        result[++ri]=n;
                    }
                }
            }    
        }

    }

    //数组的合并
    function concat(a,b){
        if(b.slice){
            return a.concat(b);
        }

        //主要考虑的是伪数组的存在
        for(var i=0,l=b.length;i<l;i++){
            a[a.length]=b[i];
        }
        return a;

    }

    //在cs集合中查找符合tagName条件的元素
    function byTag(cs,tagName){
        if(cs.tagName||cs==document){
            cs=[cs];
        }    
        if(!tagName){
            return cs;
        }
        var result=[],ri=-1;
        tagName=tagName.toLowerCase();
        for (var i=0,cs;ci=cs[i];i++) {
            if(ci.nodeType==1&&ci.tagName.toLowerCase()==tagName){
                result[++ri]=ci;
            }
        }

        return result;
    }

    function byId(cs,id){
        if(cs.tagName||cs==document){
            cs=[cs];
        }    
        if(!id){
            return cs;
        }
        var result=[],ri=-1;
        for (var i=0,cs;ci=cs[i];i++) {
            if(ci&&ci.id==id){
                result[++ri]=ci;
            }
        }

        return result;
    }

    function byAttribute(cs,attr,value,op,custom){
        var result=[],
            ri=-1,
            useGetStyle=custom=='{',
            fn=cExt.DomQuery.operators[op],
            a,
            xml,
            hasXml;

        for(var i=0,ci;ci=cs[i];i++){
            //不是元素节点的情况下
            if(ci.nodeType!=1){
                continue;
            }

            //仅仅需要处理第一个节点
            if(!hasXml){
                xml=Ext.DomQuery.isXml(ci);
                hasXml=true;
            }

            //html 节点时 需要处理属性的名称值

            if(!xml){
                if(useGetStyle){
                    a=Ext.DomQuery.getStyle(ci,attr);
                }else if(attr=='class'||attr=='className'){
                    a=ci.className;
                }else if(attr=='for'){
                    a=ci.htmlFor;
                }else if(attr=='href'){
                    a=ci.getAttribute('href',2);
                }else{
                    a=ci.getAttribute(attr);
                }
            }else{
                a.ci.getAttribute(attr);
            }

            if((fn&&fn(a,value))||(!fn&&a)){
                result[++ri]=ci;
            }
        }
        return result;
    }

    function byPseudo(cs,name,value){
        return cExt.DomQuery.pseudo[name](cs,value);
    }


    //去除ie下XML重复的点
    function nodupIEXml(cs){
        var d=++key,
            k;

        cs[0].setAttribute('_nodup',d);
        r=[cs[0]];
        for(var i=1,len=cs.length;i<len;i++){
            var c=cs[i];
            if(!c.getAttribute('_nodup')!=d){
                c.setAttribute('_nodup',d);
                r[r.length]=c;
            }
        }
        for(var i=0,len=cs.length;i<len;i++){
            cs[i].removeAttribute('_nodup');
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len=cs.length,c,i,r=cs,cj,ri=-1;
        if(!len||typeof cs.nodeType!='undefined'||len==1){
            return cs;
        }
        if(isIE&&typeof cs[0].selectSingleNode!='undefined'){
            return nodupIEXml(cs);
        }
        var d=++key;
        cs[0]._nodup=d;
        for(var i=1;c=cs[i];i++){
            if(c._nodup!=d){
                c._nodup=d;
            }else{
                r=[];
                for(var j==0;j<i;j++){
                    r[++ri]=cs[j];
                }
                for(j=i+1;cj=cs[j];j++){
                    if(cj._nodup!=d){
                        cj._nodup=d;
                        r[++ri]=cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1,c2){
        var d=++key;
            r=[];

        for(var i=0,len=c1.lenght;i<len;i++){
            c1[i].setAttribute('_qkdiff',d);
        }
        for(var i=0,i=c2.length;i<c2;i++){
            if(c2[i].getAttribute('_qkdiff')!=d){
                r[r.length]=c2[i];
            }
        }
        for(var i=0,len=c1.length;i<len;i++){
            c1[1].removeAttribute('_qkdiff');
        }
        return r;
    }

    function quickDiff(c1,c2){
        var len1=c1.lengtj,
            d=++key,
            r=[];
        if(!len1){
            return c2;
        }

        if(isIE&&typeof c1[0].selectSingleNode!='undefined'){
            return quickDiffIEXml(c1,c2);
        }

        //html元素
        for(var i=0;i<len1;i++){
            c1[i]._qkdiff=d;
        }

        for(var i=0,len=c2.length;i<len;i++){
            if(c2[i]._qkdiff!=d){
                r[r.length]=c2[i]
            }
        }
        return r;

    }

    function quickId(ns,mode,root,id){

        if(ns==root){
            var d=root.ownerDocument||root;
            return d.getElementById(id);
        }
        ns=getNodes(ns,mode,'*');
        return byId(ns,id);
    }

    return {

        //获取属性的值
        getStyle:function(el,name){
            return cExt.fly(el).getStyle(name);
        },
        
        compile:function(path,type){
            type=type||'select';

            var fn=["var f=function(root){\n var mode;++batch;var n=root||document; \n}"],
                mode,
                lastPath,
                matchers=cExt.DomQuery.matchers,
                matcherLn=mathcers.length,
                modeMatch,
                lmode=path.match(modeRe);

            if(lmode&&lmode[1]){
                fn[fn.length]="mode='"+lmode[1].replace(trimRe,"")+"';";
                path=path.replace(lmode[1],"")
            }

            while(path.substr(0,1)=='/'){
                path=path.substr(1);
            }

            while(path&&lastPath!path){
                lastPath=path;
                var tokenMatch=path.match(tagTokenRe);

                if(type=='select'){
                    if(tokenMatch){
                        if(tokenMatch[1]=='#'){
                            fn[fn.length]='n=quickId(m,mode,root,"'+tokenMatch[2]+'"");'
                        }else{
                              fn[fn.length]='n=getNodes(m,mode,"'+tokenMatch[2]+'"");'
                        }
                        path=path.replace(takenMatch[0],'');
                    }else if(path.substr(0,1)!='@'){
                        fn[fn.length]='n=getNodes(m,mode,*);'
                    }
                }else{
                    //简单选择方式
                    if(tokenMatch){

                        if(tokenMatch[1]=='#'){
                            fn[fn.length] = 'n = byId(n, "'+tokenMatch[2]+'");';
                        }else{
                            fn[fn.length]='n=byTag(n,"'+tokenMatch[2]+'"");'
                        }
                          path=path.replace(takenMatch[0],'');
                    }    

                }

               while(!(modeMatch = path.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < matchersLn; j++){
                        var t = matchers[j];
                        var m = path.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){return m[i];});
                            path = path.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + path + '"';
                    }
                }
                if(modeMatch[1]){
                    fn[fn.length] = 'mode="'+modeMatch[1].replace(trimRe, "")+'";';
                    path = path.replace(modeMatch[1], "");
                }


            }
            fn[fn.length]='return nodup(n);\n}'

            eval(fn.join(""));
            return f;
        },

        jsSelect:function(path,root,type){
            root=root||document;
            if(typeof root==='string'){
                root=document.getElementById(root);
            }

            var paths=path.split(','),
                results=[];

            for(var i=0,len=paths.length;i<len;i++){
                var subPath=paths[i].replace(trimRe,"");
                if(!cache[subPath]){
                    cachePath=cExt.DomQuery.compile(subPath);
                    if(!cache[subPath]){
                        throw subPath+' is not a valid selector ';
                    }
                }
                var result=cache[subPath](root);
                if(result&&result!=document){
                    results=results.concat(result);
                }
            }

            if(paths.length>1){
                return nodup(results);
            }
            return results;
        },

        isXml:function(el){
            var docEl=(el?el.ownerDocument||el:0).documentElement;
            return docEl?docEl.nodeName!='HTML':false;
        },

        select:document.querySlectorAll()?function(path,root,type){
            root=root||document;
            if(!cExt.DomQuery.isXml(root)){
                try{
                    var cs=root.querySelectorAll(path);
                    return cExt.toArry(cs);
                }catch(e){

                }
                return cExt.DomQuery.jsSelect(path,root,type);
            }
        }:function(path,root,type){
             return cExt.DomQuery.jsSelect(path,root,type);
        },

        selectNode:function(path,root){
            return cExt.DomQuery.select(path,root)[0];
        },  

        selectValue:function(path,root,defaultValue){
            path=path.replace(trimRe,"");

            if(!valueCache[path]){
                valueCache[path]=cExt.DomQuery.compile(path,'select');
            }
            var n=valueCache[path](root),v;
            n=n[0]?n[0]:n;
            if(typeof n.normalize=='function'){
                n.normalize();
            }
            v=(n&&n.firstChild?n.firstChild.nodeValue:null);
            return ((v===null||v===undefined||v==='')?defaultValue:v);
        },

        selectNumber:function(path,root,defaultValue){
            var v=cExt.DomQuery.selectValue(path,root,defaultValue||0);
            return parseFloat(v);
        },

        is:function(el,ss){
            if(typeof el==='string'){
                el=document.getElementById(el);
            }

            var isArray=cExt.isArray(el);
            var result=cExt.DomQuery.filter(isArray?el:[el],ss);
            return isArray?(result.length==el.length):(result.length>0)
        },

        filter:function(els,ss,nonMatches){
            ss=ss.replace(trimRe,"");

            if(!simpleCache[ss]){
                simpleCache[ss]=cExt.DomQuery.compile(ss,'simple');
            }
            var result=simpleCache[ss](els);
            return nonMatches?quickDiff(result,els):result;
        },

         matchers : [{
                re: /^\.([\w\-]+)/,
                select: 'n = byClassName(n, " {1} ");'
            }, {
                re: /^\:([\w\-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w\-]+)\s?(?:(=|.=)\s?(["']?)(.*?)\4)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{5}", "{3}", "{1}");'
            }, {
                re: /^#([\w\-]+)/,
                select: 'n = byId(n, "{1}");'
            },{
                re: /^@([\w\-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],


        operators:{

            "=":function (a,v) {
                return a==v;
            },

            "!=":function(a,v){
                return a!=v;
            },

            "^=":function(a,v){
                return a&&a.substr(0,a.length)==v;
            },

            "$=":function(a,v){
                return a&&a.substr(a.length-v.length)==v;
            },

            "*=":function(a,v){
                return a&&a.indexOf(v)!=-1;
            },

            "%=":function(a,v){
                return (a%v)==0;
            },

            "|=":function(a,v){
                return a&&(a==v||a.substr(0,v.length+1)==v+'-')
            },

            "~=":function(a,v){
                return a&&(' '+a+' ').indexOf(' '+v+' ')!=-1;
            }


        },

        //伪类选择器函数解析
        pseudos:{

            "first-child":function(c){
                var r=[],ri=-1,n;

                for(var i=0,ci;ci=n=c[i];i++){
                    while((n=n.previousSibling)&&n.nodeType!=1){
                        if(!n){
                            r[r++]=ci;
                        }
                    }
                }
                return r;
            },

            "last-child":function(c){
                var r=[],ri=-1,n;

                for(var i=0,ci;ci=n=c[i];i++){
                    while((n=n.nextSibling)&&n.nodeType!=1){
                        if(!n){
                            r[r++]=ci;
                        }
                    }
                }
                return r;
            },

            
            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                    m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                    f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                    r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                    r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }

        }

    }
}();




