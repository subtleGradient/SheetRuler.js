/*
---
name : SheetRule
description : CSSOM sugar. Style-object oriented interface

authors   : Thomas Aylott
copyright : © 2010 Thomas Aylott
license   : MIT

provides : SheetRule
requires : Sheet.DOM
...
*/

function SheetRule(){
	if (this instanceof SheetRule)
		this.construct.apply(this, arguments)
	else return SheetRule.run.apply({}, arguments)
}

;(function(SheetRule){
	var	proto = SheetRule.prototype = {constructor:SheetRule}

	SheetRule.run = function(){
		throw new Error("Usage: `new SheetRule`");
	}
	
	SheetRule._rules = []
	
	SheetRule._register = function(className, rule){
		if (!SheetRule._rules[className]) SheetRule._rules[className] = []
		SheetRule._rules[className].push(rule)
	}
	SheetRule.get = function(className){
		return SheetRule._rules[className] || []
	}
	
	proto.construct = function(className){
		if (className == null) className = 'SheetRule' +  ++util.UID + +new Date
		this._className = className
		this._parentClassName = this._className + 'Parent'
		SheetRule._register(this._className, this)
		SheetRule._register(this._parentClassName, this)
		
		this.rule = util.createRule('.' + this._className, "")
		this.style = this.rule.style
		this._selectors = [this.rule.selectorText]
		this._childSelectors = []
	}
	
	proto._updateSelectors = function(){
		var _childSelectors = '.'+this._parentClassName+" " + this._childSelectors.join(', .'+this._parentClassName+" ")
		this.rule.selectorText = this._selectors.join(',') + ',' + _childSelectors
	}
	
	proto.addSelector = function(){
		this._selectors = this._selectors.concat(util.slice.call(arguments))
		this._updateSelectors()
		return this
	}
	
	proto.addChildSelector = function(){
		this._childSelectors = this._childSelectors.concat(util.slice.call(arguments))
		this._updateSelectors()
		return this
	}
	
	proto.removeSelector = function(selector){
		var _selectors = this._selectors
		util.Array_erase.call(this._selectors, selector)
		this._updateSelectors()
		return this
	}
	
	proto.toString = function(){
		return this.style.parentRule.cssText
	}
	
	proto.getElements = function(context){
		return util.call.call(util.getElementsByClassName, context || document, this._className)
	}
	
	proto.getParentElements = function(context){
		return util.call.call(util.getElementsByClassName, context || document, this._parentClassName)
	}
	
	proto.appendStyle = function(style){
		this.style.cssText += ';' + style
		return this
	}
	
	proto.setTransition = function(transition){
		if (typeof transition == 'number') transition = 'all ' + transition + 's ease-in'
		if (transition == null) transition = 'all .5s ease-in'
		if (transition === false) transition = 'none'
		this.appendStyle(util.cssPrefix('transition:' + transition))
		return this
	}
	
	proto.applyTo = function(nodes, _asParent){
		var className = _asParent ? this._parentClassName : this._className
		if (nodes[0] && nodes[0].className != null)
			for (var i = -1, node; node = nodes[++i];)
				node.className = className + ' ' + node.className
		else nodes.className = className + ' ' + nodes.className
		return this
	}
	
	proto.removeFrom = function(nodes, _asParent){
		var className = _asParent ? this._parentClassName : this._className
		if (nodes[0] && nodes[0].className != null)
			for (var i = -1, node; node = nodes[++i];)
				node.className = util.trim(('' + node.className).replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1'))
		else nodes.className = util.trim(('' + nodes.className).replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1'))
		return this
	}
	
	proto.enableFor = function(nodes){ return this.applyTo(nodes, true) }
	proto.disableFor = function(nodes){ return this.removeFrom(nodes, true) }

	// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

	var util = SheetRule.util = {}

	util.UID = 0

	var _log = []
	function log(message){
		_log.push(arguments)
		if (typeof DEBUG != 'undefined') util.dumpLog()
	}
	util.dumpLog = function(){var log = _log; _log = []; return log}

	util.trim = function(str){
		// http://blog.stevenlevithan.com/archives/faster-trim-javascript
		var	str = (''+str).replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}

	util.call = function(){}.call
	util.slice = [].slice

	util.getElementsByClassName = document.getElementsByClassName 
		|| function(className){return ($$||$)("." + className)}

	util.cssPrefixes = '-webkit- -moz- -ms- -o-'.split(' ')
	util.cssPrefix = function(css, joiner){
		if (joiner == null) joiner = ';'
		var CSS = []
		CSS.push(css)
		for (var i = 0; i < util.cssPrefixes.length; ++i)
			CSS.push(util.cssPrefixes[i] + css)
		return CSS.join(joiner)
	}

	util.createRule = Sheet.DOM.createRule

	util.Array_erase = function(item){
		// From MooTools 1.3
		for (var i = this.length; i--;)
			if (this[i] === item) this.splice(i, 1);
		return this;
	}


	/*<DEBUG>*/
	for (var property in proto) if (typeof proto[property] == 'function') proto[property].displayName = 'SheetRule.prototype.' + property
	for (var property in util) if (typeof proto[property] == 'function') proto[property].displayName = 'SheetRule.util.' + property
	/*</DEBUG>*/

}(SheetRule))

/*<CommonJS>*/if (typeof exports != 'undefined') exports.SheetRule = SheetRule/*</CommonJS>*/
