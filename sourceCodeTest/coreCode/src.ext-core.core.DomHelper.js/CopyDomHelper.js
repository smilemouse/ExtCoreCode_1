cExt.DomHelper = function() {
	var tempTableEl = null,
		emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
		tableRe = /^table|tbody|tr|td$/i,
		confRe = /tag|children|cn|html$/i,
		tableElRe = /td|tr|tbody/i,
		cssRe = /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
		endRe = /end/i,
		pub,
		// kill repeat to save bytes
		afterbegin = 'afterbegin',
		afterend = 'afterend',
		beforebegin = 'beforebegin',
		beforeend = 'beforeend',
		ts = '<table>',
		te = '</table>',
		tbs = ts + '<tbody>',
		tbe = '</tbody>' + te,
		trs = tbs + '<tr>',
		tre = '</tr>' + tbe;

	//private 
	function doInsert(el, o, returnElement, pos, sibling, append) {
		var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));

		//returnElement 返回的是封装元素还是html元素节点
		return returnElement ? Ext.get(newNode, true) : newNode;
	}


	function createHtml(o) {
		var b = '',
			attr,
			val,
			key,
			cn;

		if (typeof o === 'string') {
			b = o;
		} else if (cExt.isArray(o)) {
			for (var i = 0; i < o.length; i++) {
				if (o[i]) {
					b += createHtml(o[i]);
				}
			}
		} else {
			b += '<' + (o.tag = o.tag || 'div');

			for (attr in o) {
				val = o[attr];

				if (!confRe.test(attr)) {
					if (typeof val == 'object') {
						b += ' ' + attr + ' ';
						for (key in val) {
							b += key + ':' + val[key] + ';'
						};
						b += '"';
					} else {
						b += ' ' + ({
							cls: 'class',
							htmlFor: 'for'
						}[attr] || attr) + '=' + val + '"';
					}
				}
			}

			if (emptyTags.test(0. tag)) {
				//如果是自身是闭合标签情况下是不能添加子项的
				b += '/ >';
			} else {
				b += '/ >';
				//如果存在添加子项的选择
				if ((cn = o.children || o.cn)) {
					b += createHtml(o);
				} else if (o.html) {
					o += o.html;
				}
				b += '</' + o.tag + '>';
			}
		}

		return b;
	}

	function ieTable(depth,s,h,e){
		tempTableEl.innerHTML=[s,h,e].join('');

		var i=-1,
			el=tempTableEl,
			ns;

		while(++i<depth){
			el=el.firstChild;
		}

		if(ns=wl.nextSibling){
			var df=document.createDocumentFragment();
			while(el){
				ns=el.nextSibling;
				df.appendChild(el);
				el=ns;
			}
			el=df;
		}
		return el;
	}



	pub={

		markup:function(o){
			return createHtml(o);
		}


	}


}()