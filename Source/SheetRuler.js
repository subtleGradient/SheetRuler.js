/*
---
name : SheetRuler
description : SheetRuler will rock your socks!

authors   : Thomas Aylott
copyright : © 2010 Thomas Aylott
license   : MIT

provides : SheetRuler
...
*/
var SheetRuler = {}
;(function(SheetRuler){

var styleSheets = document.styleSheets

SheetRuler.isSheetReal = isSheetReal
SheetRuler.createStyleSheet = createStyleSheetWrapper
SheetRuler.createRule = createStyleSheetRule
SheetRuler.getElement = getElementForSheetOrRule

/*
SheetRuler.createStyleSheet = function(){
	var sheet
	sheet = createStyleSheet1()
	if (sheet === styleSheets[styleSheets.length-1])
		SheetRuler.createStyleSheet = createStyleSheet1
	else sheet = createStyleSheet2()
	if (sheet === styleSheets[styleSheets.length-1])
		SheetRuler.createStyleSheet = createStyleSheet2
	else throw new Error("This browser doesn't support creating styleSheets");
	return sheet
}
*/

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
function isSheetReal(sheet){
	// tests if the sheet exists, has rules and is in the document.styleSheets collection
	if (!(sheet && (sheet.cssRules || sheet.rules))) return false
	var i = styleSheets.length || 0
	while (i--) if (styleSheets[i] === sheet) return true
	return false
}

function createStyleSheetWrapper(name){
	var	fallback
	,	element
	,	sheet = createStyleSheet(name)
	if (!isSheetReal(sheet)){
		element = getElementForSheetOrRule(sheet)
		element.parentNode.removeChild(element)
		fallback = sheet = createStyleSheet_fallback(name)
		if (!isSheetReal(sheet)) throw new Error("No support for dynamic styleSheets")
	}
	// element = getElementForSheetOrRule(sheet)
	// if (element && element.previousSibling && element.previousSibling.nodeName == 'HEAD'){
	// 	if (fallback) SheetRuler.createStyleSheet = createStyleSheet_fallback
	// 	else SheetRuler.createStyleSheet = createStyleSheet
	// }
	return sheet
}

function getElementForSheetOrRule(sheetOrRule){
	if (!sheetOrRule) return null
	return	sheetOrRule.ownerNode
		||	sheetOrRule.owningElement
		||	SheetRuler.getElement(sheetOrRule.parentStyleSheet)
}
function createStyleSheetRule(sheet, selector, style){
	var rules = sheet.cssRules || sheet.rules
	if (sheet.insertRule) sheet.insertRule('' + selector + '{' + style + '}', rules.length)
	else if (sheet.addRule) sheet.addRule(selector, style)
	return rules[rules.length-1]
}

function createStyleSheet(name){
	// Append a new STYLE element to the end of the greatest grandparent element.
	// This is the simplest way to ensure that the new STYLE is at the very end of the styleSheets collection.
	// That is necessary for new sheets to have the greatest importance in the cascade.
	
	// SUCCESS
	//   Safari 5
	//   Safari 4
	//   Firefox 1.0
	//   IE6
	//   IE8 Standards
	//   IE8 as IE7 Standards
	//   IE8 Quirks
	//   IE9 Standards
	//   Opera 9.24
	//   Mozilla 1.4
	
	// ODDNESS
	// In Opera 9.24 & 10.54 (uh, probly all of them), before domready
	//   document.documentElement.appendChild(document.createElement('style')) 
	//   adds the new STYLE element BEFORE the BODY tag.
	//   But if there are any STYLE elements in the BODY, 
	//   they will be applied with higher precidence than the dynamic sheet you just added.
	
	// FAIL
	//   Safari 2.0
	//   Safari 2.0.4
	//   Safari 3.0.4 creates a new StyleSheet without effecting the document
	
	if (!name) name = "SheetRuler-" + +new Date
	else name = name.replace(/[^\w_-]/g,'-')
	var styleElement = document.createElement("style")
	styleElement.setAttribute('name', styleElement.id = name)
	// if (document.documentElement.lastChild.nodeName == 'BODY')
	document.documentElement.appendChild(styleElement)
	return styleElement.sheet || styleElement.styleSheet
}

function createStyleSheet_fallback(name){
	// Works in Safari 3.0.4
	// Older versions of Safari strictly limited STYLE elements to children of the HEAD
	// So, adding a STYLE element to a different parent dynamically fails silently.
	var style = document.createElement('div')
	style.appendChild(document.createElement('style'))
	document.getElementsByTagName('head')[0].appendChild(style)
	var styleElement = style.firstChild
	return styleElement.sheet || styleElement.styleSheet
}

function disableSheet(sheet){}
function destroySheet(sheet){}
function disableRule(rule){}
function destroyRule(rule){}



}(SheetRuler));


// var styleParent = document.documentElement
// var sheetCount = styleSheets.length
// styleParent.appendChild(document.createElement("style"))
// if (styleSheets.length == sheetCount)
// 	styleParent = document.getElementsByTagName('head')[0]

// document.getElementsByTagName('head')[0].appendChild(style = document.createElement("style"))

// function createStyleSheet1_2(){
// 	// Works in: Safari 5, Safari 3.0.4
// 	// IE6 Operation Aborted
// 	var	styles = document.getElementsByTagName('style')
// 	,	lastSheetEl = styles[styles.length-1]
// 	,	styleElement = document.createElement("style")
// 	if (lastSheetEl) styleElement.parentNode.insertBefore(styleElement, lastSheetEl.nextSibling)
// 	// else styleParent.appendChild(styleElement)
// 	return styleElement.sheet || styleElement.styleSheet
// }

// function createStyleSheet1_1(){
// 	var styleElement = document.createElement("link")
// 	styleElement.setAttribute('ref', 'stylesheet')
// 	styleElement.setAttribute('href', 'javascript:""')
// 	document.documentElement.appendChild(styleElement)
// 	var sheet = styleElement.sheet || styleElement.styleSheet
// 	return sheet
// }

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

function String_escapeHTML(){
	return ('' + this).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
}
