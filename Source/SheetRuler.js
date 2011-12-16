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
/*jshint asi:true */

var SheetRuler = {}
;(function(SheetRuler){

if (!SheetRuler.Sheet) SheetRuler.Sheet = {}
var Sheet = SheetRuler.Sheet

if (!SheetRuler.Rule) SheetRuler.Rule = {}
var Rule = SheetRuler.Rule

// ,	styleSheetParent = document.getElementsByTagName('html')[0]

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

var	styleSheets
SheetRuler.setDocument = setDocument
function setDocument(document){styleSheets = document.styleSheets}
if (document) setDocument(document)

SheetRuler.isSheetReal = isSheetReal
function isSheetReal(sheet){
	// Tests if the sheet exists, has rules and is in the document.styleSheets collection
	if (!(sheet && (sheet.cssRules || sheet.rules))) return false
	var i = styleSheets.length || 0
	while (i--) if (styleSheets[i] === sheet) return true
	return false
}

// SheetRuler.getElement = getElementForSheetOrRule
// function getElementForSheetOrRule(sheetOrRule){
// 	if (!sheetOrRule) return null
// 	return	sheetOrRule.ownerNode
// 		||	sheetOrRule.owningElement
// 		||	SheetRuler.getElement(sheetOrRule.parentStyleSheet)
// }

SheetRuler.createRule = createStyleSheetRule
function createStyleSheetRule(sheet, selector, style){
	// if (style == null) throw new Error("usage: createStyleSheetRule(sheet, selector, style)");
	if (!sheet) sheet = createStyleSheet()
	var rules = sheet.cssRules || sheet.rules
	if (sheet.addRule) sheet.addRule(selector, style)
	else if (sheet.insertRule) sheet.insertRule('' + selector + '{' + style + '}', rules.length)
	var rule = rules[rules.length-1]
	return rule
}

function createStyleSheetRuleInNewSheet(sheet, selector, style){
	sheet = createStyleSheetWithCSS('' + selector + '{' + style + '}')
	var rule = (sheet.cssRules || sheet.rules)[0]
	return rule
}


function getLength(collection){
	var i = -1
	while (collection[++i]);
	return i
}
function getLast(collection){
	var lastItem, i = -1
	while (collection[++i]) lastItem = collection[i]
	return lastItem
}


// SheetRuler.createStyleSheet = createStyleSheetWrapper
// function createStyleSheetWrapper(name){
// 	var	sheet = createStyleSheet(name)
// 	// if (!isSheetReal(sheet)){
// 	// 	// element = getElementForSheetOrRule(sheet)
// 	// 	// if (element) element.parentNode.removeChild(element)
// 	// 	// styleSheetParent = document.getElementsByTagName('head')[0]
// 	// 	// sheet = createStyleSheet(name)
// 	// }
// 	if (!isSheetReal(sheet)) throw new Error("No support for dynamic styleSheets")
// 	// element = getElementForSheetOrRule(sheet)
// 	// if (element && element.previousSibling && element.previousSibling.nodeName == 'BODY')
// 	// 	SheetRuler.createStyleSheet = createStyleSheet
// 	return sheet
// }
function createStyleSheetWithCSS(css){
	var styleElement = document.createElement("style")
	styleElement.appendChild(document.createTextNode(css))
	styleElement.setAttribute('name', styleElement.id = "SheetRuler-" + +new Date)
	document.getElementsByTagName('head')[0].appendChild(styleElement)

	return styleElement.sheet || styleElement.styleSheet
}


SheetRuler.createStyleSheet = createStyleSheet
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
	//   Safari 3.0.4
	//   Before domready IE6
	//   Before domready IE8 Standards
	
	// ODDNESS
	//   Before domready, this function may add your new STYLE before the BODY.
	//   Your new sheet will be lower down the cascade than the STYLEs in the BODY.
	//   But only in some browsers!
	
	// FAIL
	//   Safari 2.0
	//   Safari 2.0.4
	//   Internet Explorer 5.2.3 for Mac

	var styleElement = document.createElement("style")
	// styleElement.appendChild(document.createTextNode('@charset "UTF-8";')) // Fixes Safari 3.0.1 bug where cssRules would be empty forever // or doesn't

	if (!name) name = "SheetRuler-" + +new Date
	else name = (''+name).replace(/[^\w_-]/g,'-')
	styleElement.setAttribute('name', styleElement.id = name)

	var parent, styles = document.getElementsByTagName('style')
	if (styles.length) parent = styles[styles.length-1].parentNode
	else parent = document.getElementsByTagName('head')[0]
	parent.appendChild(styleElement)

	return styleElement.sheet || styleElement.styleSheet
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
SheetRuler.disableSheet = disableSheet
function disableSheet(sheet){}

SheetRuler.destroySheet = destroySheet
function destroySheet(sheet){}

SheetRuler.disableRule = disableRule
function disableRule(rule){
	// rule.disabled = true
	// rule.disabledSelectorText = rule.selectorText
	// rule.selectorText = ".SheetRuler-disabled"
}

SheetRuler.eraseRule = eraseRule
function eraseRule(rule){
	rule.style.cssText = "top:0" // Fix for older Mozilla: can't be blank or it'll be ignored
	rule.style.top = ''
}

SheetRuler.deleteRule = Sheet_deleteRule
function Sheet_deleteRule(sheet, rule){
	// if (!sheet) sheet = rule.parentStyleSheet // ERROR: Safari 3 throws on any interaction with this property
	if (!sheet) sheet = DEFAULT_SHEET
	var index = getRuleIndex(sheet, rule)
	if (index >= 0) call.call(StyleSheet_deleteRule, sheet, index)
}

function getRuleIndex(sheet, rule){
	var rules = sheet.cssRules || sheet.rules
	for (var i = -1; rules[++i];) // rules.length is not reliable
		if (rule == rules[i]) return i
	return -1
}

var call = function(){}.call

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
var DEFAULT_SHEET = createStyleSheet()
var StyleSheet_deleteRule = DEFAULT_SHEET.deleteRule || DEFAULT_SHEET.removeRule
var ADDRULE_INCREMENTS_RULES_LENGTH = (function(){
	var rules = DEFAULT_SHEET.cssRules || DEFAULT_SHEET.rules
	var length = rules.length
	var rule = createStyleSheetRule(DEFAULT_SHEET,"*","")
	return rules.length > length
}())

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
if (!ADDRULE_INCREMENTS_RULES_LENGTH) SheetRuler.createRule = createStyleSheetRuleInNewSheet

}(SheetRuler));


