
//统计车辆在线和总数
var reUnNodeHash={
	group:{},		//key:车辆组id value:该组下所有的车辆
	isTreeGroup:{}, //key:车辆组id value:判断该组是否已经展开过即成为了树的节点 0:false 1:true
	carIds:{},		//key:车辆id value:改车辆的在线状态 和报警状态 0 离线 1 停车在线 2行驶在线 - 0 无报警  1 有报警
	isTreeNode:{}	//key:车辆id value:判断该车辆是否已经展开过即成为了树的节点 0:false 1:true
};


var pushCars=[];  //遍历车辆组时 存储该组下的所有 车辆



/**
 * [遍历树的所有节点 组节点获取其下所有的叶子节点 同时设置reUnNodeHash想改属性]
 * @data [树的原始数据]
 */
function registerUnNodeGroup(data){
	Ext.each(data,function(child){
		if(!child.leaf){
			pushCars=[];
			
			/*
			if(child.id.indexOf('cmp')>-1){
				child.expanded=true;
			}
			*/
			reUnNodeHash.group[child.id]=registerUnCar(child.children);
			reUnNodeHash.isTreeGroup[child.id]='0';//‘0’表示未包装成树节点  ‘1’表示已经包装成树节点
			Ext.each(child.children,function(cch){
				registerUnNodeGroup(cch);
			});
		}else{
			reUnNodeHash.carIds[child.id]='0-0';//存储车辆的在线状态 '0' 离线 '1'停车在线 '2' 行驶在线    -0有报警  -1无报警
			reUnNodeHash.isTreeNode[child.id]='0';//‘0’表示未包装成树节点  ‘1’表示已经包装成树节点 
		}
	});
}

/**
 * [获取组下的所有的叶子节点]
 * @data [树原始数据中的每个对象的children]
 */
function registerUnCar(data){
	Ext.each(data,function(child){
		if(child.leaf){
			pushCars.push(child.id);
		}else{
			Ext.each(child.children,function(cch){
				registerUnCar(cch);
			});
		}
	});
	return pushCars;
}



/**
 * [统计每个组下所有叶子节点即车辆的离线 上线 总计等数据统计 ]
 * @node [description]
 */
function groupCountResult(node){
	
	var group=reUnNodeHash.group[node.id],
		t=group.length,
		r=0,
		s=0,
		o=0;

	Ext.each(group,function(val){
		var cArr=reUnNodeHash.carIds[val].split('-');//0-0 1-0 2-0 

		if(cArr[0]==='2'){
			s++;
		}else if(cArr[0]==='1'){
			r++;
		}else{
			o++;	
		}

	});

	var countText='<span style="color:green">'+r+'\/</span><span style="color:blue">'+s+'\/</span><span style="color:gray">'+o+'\/</span><span>'+t+'</span>',
		pos=node.text.indexOf('(');

	return newNodeText=pos>-1?node.text.replace(node.text.substr(pos,node.text.length-1),'('+countText+')'):
					   node.text+'('+countText+')';

}




/**
 * [更新叶子节点即车辆的icon和报警提示]
 * @node [description]
 */
function updateLeafNode(node){
	//跟新车辆的图标
	var iconCls='car_0',
		cArr=reUnNodeHash.carIds[node.id].split('-');
	
	node.getUI().getTextEl().innerHTML=cArr[1]==='0'?node.text:"<span style='color:red'>" + node.text + "</span>";
	if(cArr[0]==='1'){iconCls="car_2";}
	if(cArr[0]==='2'){iconCls="car_1";}
	if(node.attributes.iconCls!==iconCls){node.setIconCls(iconCls);}
}


/**
 * 如果该组第一展开则更新子节点下组的车辆统计和叶子节点的在线 报警 状态
 * @nodeG [当前展开的组节点]
 */
function expandUpdateCount(nodeG){
	//公司节点判断加入改变其标志位
	if(reUnNodeHash.isTreeGroup[nodeG.id]==='0'){
		reUnNodeHash.isTreeGroup[nodeG.id]='1';
		nodeG.getUI().getTextEl().innerHTML=groupCountResult(nodeG);
	}
	nodeG.eachChild(function(node){
		if(!node.leaf){
			//组是否是第一次添加到树
			if(reUnNodeHash.isTreeGroup[node.id]==='0'){
				reUnNodeHash.isTreeGroup[node.id]='1';
				//总数，形式在线，停车在线，离线
				node.getUI().getTextEl().innerHTML=groupCountResult(node);
			}
		}else{
			//节点是否是第一次添加到树
			if(reUnNodeHash.isTreeNode[node.id]==='0'){
				reUnNodeHash.isTreeNode[node.id]='1'
				updateLeafNode(node);	
			}
		}
	});

}

/**
 * [实时刷新叶子的在线 报警状态 和组的在线统计数据。]
 *遍历数据源store更新reUnNodeHash.carIds数据
 *跟新已经展开车辆组下的车辆信息并且统计数量信息
 * 先判断该组的父节点是否展开 如展开则更新未展开不更新 再判断当前点是否展开，如果展开则更新该点下的叶子节点在线 报警状态，不更新其下的组节点。否则相反。
 * @tree [整个树对象]
 */
function refreshTreeNodeRealTime(tree){
	
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
        reUnNodeHash.carIds[id]=state+'-'+alarm;

	});
	*/


	//test function

	for(var id in reUnNodeHash.carIds){
		reUnNodeHash.carIds[id]=parseInt(Math.random()*3)+'-'+'1';
	}


	//跟新已经展开车辆组下的车辆信息并且统计数量信息
	
	for(var id in reUnNodeHash.group){

		var isTreeNode=reUnNodeHash.isTreeGroup[id],//判断该组节点是否曾经加入到树。
			group=reUnNodeHash.group[id];

		if(isTreeNode==='1'){
			var treeLeafNode=tree.getNodeById(id);
			var parentTreeNoe=treeLeafNode.parentNode;

			if(parentTreeNoe.isExpanded()){
				treeLeafNode.getUI().getTextEl().innerHTML=groupCountResult(treeLeafNode);
				if(treeLeafNode.isExpanded()){
					treeLeafNode.eachChild(function(node){
						if(node.leaf){
							//更新图标和报警状态
							updateLeafNode(node);
						}
					});
				}	
			}

		}	

	}


}












