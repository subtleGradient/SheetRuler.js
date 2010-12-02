/*
---
name : Sheet.DOM
description : Sheet.DOM adds some handy stuff for working with the browser's native CSS capabilities.

authors   : Thomas Aylott
copyright : © 2010 Thomas Aylott
license   : MIT

provides : Sheet.DOM
...
*/
;(function(document,styleSheets){

if (typeof Sheet == 'undefined') Sheet = {}
if (Sheet.DOM == null) Sheet.DOM = {}

Sheet.DOM.createSheetNode = function(raw){
	var sheet = Sheet.DOM.createSheet(raw)
	var node = sheet.ownerNode
	node.parentNode.removeChild(node)
	return node
}

var UID = 0

Sheet.DOM.createSheet = function(raw){
	var	oldLength = styleSheets.length
	,	style
	,	sheet
	,	head = document.getElementsByTagName('head')[0]
	
	var uid = ".Sheet" + ++UID + +new Date
	
	raw = uid + "{}" + raw
	
	if (document.createStyleSheet){
		document.createStyleSheet()
		styleSheets[styleSheets.length - 1].cssText = raw
	}
	
	if (oldLength >= styleSheets.length){
		style = document.createElement('style')
		style.setAttribute('type','text/css')
		style.appendChild(document.createTextNode(raw))
		head.insertBefore(style, head.firstChild)
	}
	
	if (oldLength >= styleSheets.length){
		style = document.createElement('div')
		style.innerHTML = '<style type="text/css">' + String_escapeHTML.call(raw) + '</style>'
		head.insertBefore(style, head.firstChild)
	}
	
	if (oldLength >= styleSheets.length)
		throw new Error('no styleSheet added :(')
	
	for (var i = -1, sheet; sheet = styleSheets[++i];)
		if ((sheet.rules || sheet.cssRules)[0].selectorText == uid) break
	
	sheet.cssText = raw
	
	return sheet
}

Sheet.DOM.createStyle = function(raw){
	var div = document.createElement('div')
	div.innerHTML = '<p style="' + String_escapeHTML.call(raw) + '"></p>'
	return div.firstChild.style
}

Sheet.DOM.createSheetStyle = function(raw){
	var className = 'Sheet' + +new Date
	var sheet = Sheet.DOM.createSheet("." + className + "{" + raw + "}")
	return (sheet.rules || sheet.cssRules)[0].style
}

Sheet.DOM.createRule = function(selector,style){
	var rule = selector + "{" + style + "}"
	
	var sheet = Sheet.DOM.createSheet(rule)
	var rules = sheet.rules || sheet.cssRules
	return rules[rules.length - 1]
}

Sheet.DOM.createStyleWrapped = function(raw){
	return {style:Sheet.DOM.createStyle(raw)}
}

function String_escapeHTML(){
	return ('' + this).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
}

}(document, document.styleSheets));
