Ext.namespace("Ext.sys");
Ext.sys.win=new Ext.Window({
 	title:'main', 	
 	iconCls:'settings',
 	cls:'sysForm',
 	width:400, 
 	name:'conEx',
 	height:450,
 	closeAction:'hide',
 	autoScroll:true,
 	resizable:false,
 	//html:"你好，欢迎使用:功能!",
 	maximizable:true
 });

//设置风格 /**
     /*更改主题
     * @param {Object} value
     */
 	var saveThemeToCookie = function(value){
        saveCookie('xtheme', value);
    }
    var saveOldThemeToCookie = function(value){
        saveCookie('oldxtheme', value);
    }
    var changeTheme = function(value){
        if (value) {
            saveThemeToCookie(value);
        }
    }
    
 Ext.sys.tpl=new Ext.TabPanel({
                	id:'systabs',
                    enableTabScroll:true,
                    deferredRender : false,
                    border         : false,
                    activeTab:'purple',
                    activeTab:0,
                    //plugins: new Ext.ux.TabCloseMenu(),
                    items:[new Ext.Panel(
 							{title:'清爽天空',
 							id:'green',
 							iconCls:'scenery',
                    		html:'<img src ="./Images/style/a.jpg"' +
                    				' class="Fade" width = "350"' +
                    				' height = "375" />' }),
                    	new Ext.Panel({
                    		title:'田园风光',
                    		id:'purple',
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/b.jpg"' +
                    				' class="Fade" width = "350"' +
                    				' height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'豁然开朗',
                    		id:'olive' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/c.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'巧克力味',
                    		id:'chocolate' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/d.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	})
                    	,new Ext.Panel({
                    		title:'流金岁月',
                    		id:'black' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/e.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'非主流式',
                    		id:'slickness' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/f.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),new Ext.Panel({
                    		title:'香远逸清',
                    		id:'gray-extend' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/g.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'简单简约',
                    		id:'slate' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/h.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'香浓咖啡',
                    		id:'gray' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/i.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'好好学习',
                    		id:'darkgray' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/g.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),new Ext.Panel({
                    		title:'永恒不变',
                    		id:'peppermint' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/k.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),new Ext.Panel({
                    		title:'银色樱桃',
                    		id:'silverCherry' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/l.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	}),
                    	new Ext.Panel({
                    		title:'雪后青山',
                    		id:'indigo' ,
                    		closable:true,
                    		iconCls:'scenery',
                    		html:'<img src ="./Images/style/m.jpg" ' +
                    				'class="Fade" width = "350" height = "375" />'
                    	})//注册一个xtype Ext.reg();
                    	]
                });
 	
 		
 Ext.sys.selector=function(type){
 	var href='./Ext/resources/css/xtheme-'+type+'.css';
 	var htl;
 	if(type!=null){
 		//更改主题
 	 	htl=document.getElementById("personal").setAttribute("href",href);
 	 	//保全主题
 	 	//changeTheme(type);
 	 	}
 
 }
  Ext.sys.Swin = new Ext.Window({
                layout: 'fit',
                width:590, 
 				name:'conEx',
 				height:500,
                closeAction :'hide',
                iconCls:'settings',
 				cls:'sysForm',
                plain       : true,
                items:[Ext.sys.tpl] ,

                buttons: [{
                    text     : '确定',
                    disabled : false,
                    handler:function(){
                    			saveOldThemeToCookie(getCookie('xtheme'));
                    			var chk_code=Ext.sys.tpl.getActiveTab().getItemId();
                    			Ext.sys.selector(chk_code);
                    			changeTheme(Ext.sys.tpl.getActiveTab().getItemId());
                    	  		Ext.Msg.alert('确定','修改主题成功！');
                    	  }
                    
                },{
                    text     : '预览主题',
                    disabled : false,
                    handler:function(){
                    			saveOldThemeToCookie(getCookie('xtheme'));
                    			var chk_code=Ext.sys.tpl.getActiveTab().getItemId();
                    			Ext.sys.selector(chk_code);
                    	 		Ext.MessageBox.confirm('确认', '是否要将主题更改为'+Ext.sys.tpl.getActiveTab().title+'?', function(btn){
                    	  		if(btn=='no'){
                    	  			Ext.sys.selector(getCookie('xtheme'));
                    	  		}
                    	  		else{
                    	  				
                    	  				changeTheme(Ext.sys.tpl.getActiveTab().getItemId());
                    	  				Ext.Msg.alert('确定','修改主题成功！');
                    	  		}
                    	  });
                  			//Ext.Msg.alert('提示','message:'+getCookie('xtheme'));
                    }
                },{
                    text     : '关闭',
                    handler  : function(){
                       Ext.sys.winStyle.hide();
                    }
                }]
            });
 	
 	Ext.sys.winIcon=Ext.applyIf(new Ext.Window({title:'系统图标设置',closeAction:'hide'}),Ext.sys.win);
 	
 	Ext.sys.winStyle=Ext.applyIf(new Ext.Window({title:'自定义风格',resizible:false,closeAction:'hide'}),Ext.sys.Swin);
 	
 	
 	
	Ext.sys.ctrl= function conExercise(){	 
		Ext.sys.winStyle.show();
 	

 	}
