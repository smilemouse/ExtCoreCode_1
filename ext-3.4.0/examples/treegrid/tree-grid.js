/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function() {
    Ext.QuickTips.init();

 var ch=   [{
    task:'Project: Shopping',
    duration:13.25,
    user:'Tommy Maintz',
    iconCls:'task-folder',
    expanded: true,
    children:[{
        task:'Housewares',
        duration:1.25,
        user:'Tommy Maintz',
        iconCls:'task-folder',
        children:[{
            task:'Kitchen supplies',
            duration:0.25,
            user:'Tommy Maintz',
            leaf:true,
            iconCls:'task'
        },{
            task:'Groceries',
            duration:.4,
            user:'Tommy Maintz',
            leaf:true,
            iconCls:'task'
        },{
            task:'Cleaning supplies',
            duration:.4,
            user:'Tommy Maintz',
            leaf:true,
            iconCls:'task'
        },{
            task: 'Office supplies',
            duration: .2,
            user: 'Tommy Maintz',
            leaf: true,
            iconCls: 'task'
        }]
    }, {
        task:'Remodeling',
        duration:12,
        user:'Tommy Maintz',
        iconCls:'task-folder',
        expanded: true,
        children:[{
            task:'Retile kitchen',
            duration:6.5,
            user:'Tommy Maintz',
            leaf:true,
            iconCls:'task'
        },{
            task:'Paint bedroom',
            duration: 2.75,
            user:'Tommy Maintz',
            iconCls:'task-folder',
            children: [{
                task: 'Ceiling',
                duration: 1.25,
                user: 'Tommy Maintz',
                iconCls: 'task',
                leaf: true
            }, {
                task: 'Walls',
                duration: 1.5,
                user: 'Tommy Maintz',
                iconCls: 'task',
                leaf: true
            }]
        },{
            task:'Decorate living room',
            duration:2.75,
            user:'Tommy Maintz',
            leaf:true,
            iconCls:'task'
        },{
            task: 'Fix lights',
            duration: .75,
            user: 'Tommy Maintz',
            leaf: true,
            iconCls: 'task'
        }, {
            task: 'Reattach screen door',
            duration: 2,
            user: 'Tommy Maintz',
            leaf: true,
            iconCls: 'task'
        }]
    }]
},{
    task:'Project: Testing',
    duration:2,
    user:'Core Team',
    iconCls:'task-folder',
    children:[{
        task: 'Mac OSX',
        duration: 0.75,
        user: 'Tommy Maintz',
        iconCls: 'task-folder',
        children: [{
            task: 'FireFox',
            duration: 0.25,
            user: 'Tommy Maintz',
            iconCls: 'task',
            leaf: true
        }, {
            task: 'Safari',
            duration: 0.25,
            user: 'Tommy Maintz',
            iconCls: 'task',
            leaf: true
        }, {
            task: 'Chrome',
            duration: 0.25,
            user: 'Tommy Maintz',
            iconCls: 'task',
            leaf: true
        }]
    },{
        task: 'Windows',
        duration: 3.75,
        user: 'Darrell Meyer',
        iconCls: 'task-folder',
        children: [{
            task: 'FireFox',
            duration: 0.25,
            user: 'Darrell Meyer',
            iconCls: 'task',
            leaf: true
        }, {
            task: 'Safari',
            duration: 0.25,
            user: 'Darrell Meyer',
            iconCls: 'task',
            leaf: true
        }, {
            task: 'Chrome',
            duration: 0.25,
            user: 'Darrell Meyer',
            iconCls: 'task',
            leaf: true
        },{
            task: 'Internet Exploder',
            duration: 3,
            user: 'Darrell Meyer',
            iconCls: 'task',
            leaf: true
        }]
    },{
        task: 'Linux',
        duration: 0.5,
        user: 'Aaron Conran',
        iconCls: 'task',
        children: [{
            task: 'FireFox',
            duration: 0.25,
            user: 'Aaron Conran',
            iconCls: 'task',
            leaf: true
        }, {
            task: 'Chrome',
            duration: 0.25,
            user: 'Aaron Conran',
            iconCls: 'task',
            leaf: true
        }]
    }]
}]


    var tree = new Ext.ux.tree.TreeGrid({
        title: 'Core Team Projects',
        width: 500,
        height: 300,
        renderTo: Ext.getBody(),
        enableDD: true,

        columns:[{
            header: 'Task',
            dataIndex: 'task',
            width: 230
        },{
            header: 'Duration',
            width: 100,
            dataIndex: 'duration',
            align: 'center',
            sortType: 'asFloat',
            tpl: new Ext.XTemplate('{duration:this.formatHours}', {
                formatHours: function(v) {
                    if(v < 1) {
                        return Math.round(v * 60) + ' mins';
                    } else if (Math.floor(v) !== v) {
                        var min = v - Math.floor(v);
                        return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                    } else {
                        return v + ' hour' + (v === 1 ? '' : 's');
                    }
                }
            })
        },{
            header: 'Assigned To',
            width: 150,
            dataIndex: 'user'
        }]

        //dataUrl: 'treegrid-data.json'
    });

    tree.root.appendChild(ch);

    tree.on('click',function(a,b,c,d){
        alert('123456');
    })


});