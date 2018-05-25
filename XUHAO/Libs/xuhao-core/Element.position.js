/**
 * 获取元素的位置信息
 */
(function(){
	var D=XUHAO.lib.Dom,
		LEFT='left',
		RIGHT='right',
		TOP='top',
		BOTTOM='bottom',
		POSITION='position',
		STATIC='static',
		RELATIVE='relative',
		AUTO='auto',
		ZINDEX='z-index';

	XUHAO.Element.addMethods({

		getX:function(){
			return D.getX(this.dom);
		},

		getY:function(){
			return D.getY(this.dom);
		},

		getXY:function(){
			return D.getXY(this.dom);
		},

		

	});

})()