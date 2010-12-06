/*
---
name : SheetRuler
description : Low-level tool for manipulating styleSheets and cssRules

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

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

SheetRuler.isSheetReal = isSheetReal
function isSheetReal(sheet){
	// tests if the sheet exists, has rules and is in the document.styleSheets collection
	if (!(sheet && (sheet.cssRules || sheet.rules))) return false
	var i = styleSheets.length || 0
	while (i--) if (styleSheets[i] === sheet) return true
	return false
}

SheetRuler.getElement = getElementForSheetOrRule
function getElementForSheetOrRule(sheetOrRule){
	if (!sheetOrRule) return null
	return	sheetOrRule.ownerNode
		||	sheetOrRule.owningElement
		||	SheetRuler.getElement(sheetOrRule.parentStyleSheet)
}

SheetRuler.createRule = createStyleSheetRule
function createStyleSheetRule(sheet, selector, style){
	var rules = sheet.cssRules || sheet.rules
	if (sheet.insertRule) sheet.insertRule('' + selector + '{' + style + '}', rules.length)
	else if (sheet.addRule) sheet.addRule(selector, style)
	return rules[rules.length-1]
}

SheetRuler.createStyleSheet = createStyleSheetWrapper
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

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
SheetRuler.disableSheet = disableSheet
function disableSheet(sheet){}

SheetRuler.destroySheet = destroySheet
function destroySheet(sheet){}

SheetRuler.disableRule = disableRule
function disableRule(rule){}

SheetRuler.destroyRule = destroyRule
function destroyRule(rule){}

}(SheetRuler));
