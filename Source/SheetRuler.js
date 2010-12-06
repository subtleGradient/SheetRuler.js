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

var	styleSheets = document.styleSheets
,	styleSheetParent = document.documentElement

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
		if (element) element.parentNode.removeChild(element)
		styleSheetParent = document.getElementsByTagName('head')[0]
		sheet = createStyleSheet(name)
		if (!isSheetReal(sheet)) throw new Error("No support for dynamic styleSheets")
	}
	element = getElementForSheetOrRule(sheet)
	if (element && element.previousSibling && element.previousSibling.nodeName == 'BODY')
		SheetRuler.createStyleSheet = createStyleSheet
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
	//   This is the simplest way to ensure that the new STYLE is at the very end of the styleSheets collection.
	//   That is necessary for new sheets to have the greatest importance in the cascade.
	
	// SUCCESS
	//   Safari 5.0.3
	//   Safari 4.0
	//   Firefox 1.0.4
	//   IE6
	//   IE8 Standards
	//   IE8 as IE7 Standards
	//   IE8 Quirks
	//   IE9 Standards
	//   Opera 9.24
	//   Opera 10.54
	//   Mozilla 1.4
	
	// ODDNESS
	//   Before domready, this function will add your new STYLE before the BODY.
	//   Your new sheet will be lower down the cascade than the STYLEs in the BODY.
	//   But only in some browsers!
	// 
	//   Safari 3.0.4 is supported, but requires the styleSheetParent to be the HEAD
	//     see createStyleSheetWrapper
	
	// FAIL
	//   Safari 2.0
	//   Safari 2.0.4
	//   Internet Explorer 5.2.3 for Mac
	
	// if (!name) name = "SheetRuler-" + +new Date
	// else name = name.replace(/[^\w_-]/g,'-')
	var styleElement = document.createElement("style")
	// styleElement.setAttribute('name', styleElement.id = name)
	// if (document.documentElement.lastChild.nodeName == 'BODY')
	styleSheetParent.appendChild(styleElement)
	return styleElement.sheet || styleElement.styleSheet
}
// 
// function createStyleSheet_fallback(name){
// 	// Works in Safari 3.0.4
// 	// Older versions of Safari strictly limited STYLE elements to children of the HEAD
// 	// So, adding a STYLE element to a different parent dynamically fails silently.
// 	var styleElement = document.createElement('style')
// 	document.getElementsByTagName('head')[0].appendChild(styleElement)
// 	return styleElement.sheet || styleElement.styleSheet
// }

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
