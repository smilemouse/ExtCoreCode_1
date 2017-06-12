function CountOnOrOffLine() { 
    this.pushCarIds=[];		//遍历车辆组时 存储该组下的所有 车辆
    this.reUnNodeHash={
    	groups:{},			//key:车辆组id value:该组下所有的车辆
    	isTreeGroup:{},		//key:车辆组id value:判断该组是否已经展开过即成为了树的节点 0:false 1:true
    	carsState:{},		//key:车辆id value:改车辆的在线状态 和报警状态 0 离线 1 停车在线 2行驶在线 - 0 无报警  1 有报警
    	isTreeLeaf:{}		//key:车辆id value:判断该车辆是否已经展开过即成为了树的节点 0:false 1:true
    };
}

CountOnOrOffLine.prototype={

	constructor:CountOnOrOffLine,

	/**
	 * [获取组下的所有的叶子节点]
	 * @data [树原始数据中的每个对象的children]
 	*/
	registerUnLeaf:function(data){
		Ext.each(data,function(child){
			if(child.leaf){
				this.pushCarIds.push(child.id);
			}else{
				Ext.each(child.children,function(cch){
					this.registerUnLeaf(cch);
				},this);
			}
		},this);
		return this.pushCarIds;
	},


	/**
	 * [遍历树的所有节点 组节点获取其下所有的叶子节点 同时设置reUnNodeHash想改属性]
	 * @data [树的原始数据]
 	*/
	registerUnTreeGroup:function(data){
		Ext.each(data,function(child){
			if(!child.leaf){
				this.pushCarIds=[];
				
				/*
				if(child.id.indexOf('cmp')>-1){
					child.expanded=true;
				}
				*/
				this.reUnNodeHash.groups[child.id]=this.registerUnLeaf(child.children);
				this.reUnNodeHash.isTreeGroup[child.id]='0';//‘0’表示未包装成树节点  ‘1’表示已经包装成树节点
				Ext.each(child.children,function(cch){
					this.registerUnTreeGroup(cch);
				},this);
			}else{
				this.reUnNodeHash.carsState[child.id]='0-0';//存储车辆的在线状态 '0' 离线 '1'停车在线 '2' 行驶在线    -0有报警  -1无报警
				this.reUnNodeHash.isTreeLeaf[child.id]='0';//‘0’表示未包装成树节点  ‘1’表示已经包装成树节点 
			}
		},this);
	},

	/**
	 * [统计每个组下所有叶子节点即车辆的离线 上线 总计等数据统计 ]
	 * @groupNode [description]
	*/
	groupCountResult:function(groupNode){
		var group=this.reUnNodeHash.groups[groupNode.id],
		t=group.length,
		r=s=o=0;

		Ext.each(group,function(val){
			var cArr=this.reUnNodeHash.carsState[val].split('-');//0-0 1-0 2-0 

			if(cArr[0]==='2'){
				r++;
			}else if(cArr[0]==='1'){
				s++;
			}else{
				o++;	
			}

		},this);

		var countText='<span style="color:green">'+r+'\/</span><span style="color:blue">'+s+'\/</span><span style="color:gray">'+o+'\/</span><span>'+t+'</span>',
			pos=groupNode.text.indexOf('(');

		return newNodeText=pos>-1?groupNode.text.replace(groupNode.text.substr(pos,groupNode.text.length-1),'('+countText+')'):
						   groupNode.text+'('+countText+')';
	},


	/**
	 * [更新叶子节点即车辆的icon和报警提示]
	 * @leafNode [description]
	*/
	updateLeafNode:function(leafNode){
		//跟新车辆的图标
		var iconCls='car_0',
			cArr=this.reUnNodeHash.carsState[leafNode.id].split('-');
		
		leafNode.getUI().getTextEl().innerHTML=cArr[1]==='0'?leafNode.text:"<span style='color:red'>" + leafNode.text + "</span>";
		if(cArr[0]==='1'){iconCls="car_2";}
		if(cArr[0]==='2'){iconCls="car_1";}
		if(leafNode.attributes.iconCls!==iconCls){leafNode.setIconCls(iconCls);}
	},


	/**
	 * 如果该组第一展开则更新子节点下组的车辆统计和叶子节点的在线 报警 状态
	 * @groupNode [当前展开的组节点]
	*/
	expandUpdateCount:function(groupNode){
		//公司节点判断加入改变其标志位
		
		if(this.reUnNodeHash.isTreeGroup[groupNode.id]==='0'){
			this.reUnNodeHash.isTreeGroup[groupNode.id]='1';
			groupNode.getUI().getTextEl().innerHTML=this.groupCountResult(groupNode);
		}
		groupNode.eachChild(function(node){
			if(!node.leaf){
				//组是否是第一次添加到树
				if(this.reUnNodeHash.isTreeGroup[node.id]==='0'){
					this.reUnNodeHash.isTreeGroup[node.id]='1';
					//总数，形式在线，停车在线，离线
					node.getUI().getTextEl().innerHTML=this.groupCountResult(node);
				}
			}else{
				//节点是否是第一次添加到树
				if(this.reUnNodeHash.isLeafNode[node.id]==='0'){
					this.reUnNodeHash.isLeafNode[node.id]='1'
					updateLeafNode(node);	
				}
			}
		},this);

	},


	/**
	 * [实时刷新叶子的在线 报警状态 和组的在线统计数据。]
	 *遍历数据源store更新reUnNodeHash.carIds数据
	 *跟新已经展开车辆组下的车辆信息并且统计数量信息
	 * 先判断该组的父节点是否展开 如展开则更新未展开不更新 再判断当前点是否展开，如果展开则更新该点下的叶子节点在线 报警状态，不更新其下的组节点。否则相反。
	 * @tree [整个树对象]
	*/
	refreshTreeLeafRealTime:function(tree){
		
		/*
		//跟新车辆的在线标志位
		GlobalVar.DS1.store.each(function(record,id){
			var state='0',
				alarm='0';

			if (record.data['LAST_LATITUDE'] != "" || record.data["ServerDateTime"] != "") {
	            
	            alarm=record.data["AlarmFlag"] != "0"?'1':'0';
				
	            if (record.data["IsOnLine"] == "1") {
	                state=record.data['Speed'] > 0?"2":"1";
	            }
	        }
	        reUnNodeHash.carsState[record.id]=state+'-'+alarm;

		});
		*/


		//test function

		for(var id in this.reUnNodeHash.carsState){
			this.reUnNodeHash.carsState[id]=parseInt(Math.random()*3)+'-'+'1';
		}


		//跟新已经展开车辆组下的车辆信息并且统计数量信息
		
		for(var id in this.reUnNodeHash.groups){

			var isTreeNode=this.reUnNodeHash.isTreeGroup[id],//判断该组节点是否曾经加入到树。
				group=this.reUnNodeHash.groups[id];

			if(isTreeNode==='1'){
				var treeLeafNode=tree.getNodeById(id);
				var parentTreeNoe=treeLeafNode.parentNode;

				if(parentTreeNoe.isExpanded()){
					treeLeafNode.getUI().getTextEl().innerHTML=this.groupCountResult(treeLeafNode);
					if(treeLeafNode.isExpanded()){
						treeLeafNode.eachChild(function(node){
							if(node.leaf){
								//更新图标和报警状态
								this.updateLeafNode(node);
							}
						},this);
					}	
				}

			}	

		}


		


	}





}