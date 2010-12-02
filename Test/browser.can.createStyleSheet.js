
function createStyleSheetRule(sheet, selector, style){
	var rules = sheet.cssRules || sheet.rules
	if (sheet.addRule) sheet.addRule(selector, style)
	if (sheet.insertRule) sheet.insertRule('' + selector + '{' + style + '}', rules.length)
	return rules[rules.length-1]
}

/*GLOBAL*/createStyleSheet = function(name){
	var sheet
	sheet = createStyleSheet1_1()
	if (sheet === document.styleSheets[document.styleSheets.length-1]) /*GLOBAL*/createStyleSheet = createStyleSheet1
	else sheet = createStyleSheet2()
	if (sheet === document.styleSheets[document.styleSheets.length-1]) /*GLOBAL*/createStyleSheet = createStyleSheet2
	else throw new Error("This browser doesn't support creating styleSheets");
	return sheet
}

function createStyleSheet1(name){
	// SUCCESS
	// Safari 5
	// Safari 4
	// Firefox 1.0
	// IE8 Standards
	// IE8 as IE7 Standards
	// IE8 Quirks
	// IE6
	// Opera 9.24
	
	// FAIL
	// Safari 2.0
	// Safari 2.0.4
	// Safari 3.0.4 creates a new StyleSheet without effecting the document
	
	var styleElement = document.createElement("style")
	document.documentElement.appendChild(styleElement)
	var sheet = styleElement.sheet || styleElement.styleSheet
	sheet.name = name
	return sheet
}

function createStyleSheet1_1(name){
	var styleElement = document.createElement("link")
	styleElement.setAttribute('ref', 'stylesheet')
	styleElement.setAttribute('href', 'javascript:""')
	document.documentElement.appendChild(styleElement)
	var sheet = styleElement.sheet || styleElement.styleSheet
	sheet.name = name
	return sheet
}

function createStyleSheet2(name){
	// Works in Safari 3.0.4
	var style = document.createElement('div')
	style.appendChild(document.createElement('style'))
	document.getElementsByTagName('head')[0].appendChild(style)
	var styleElement = style.firstChild
	return styleElement.sheet || styleElement.styleSheet
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

function String_escapeHTML(){
	return ('' + this).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

var styleSheets_length = document.styleSheets.length

ok(document.styleSheets, "document.styleSheets")

sheet = null
try{
	sheet = createStyleSheet('mySheet')
}catch(e){ok(false,e)}

ok(sheet.name == 'mySheet', "sheet.name == 'mySheet'")

ok(''+sheet == '[object CSSStyleSheet]', ''+sheet + " == [object CSSStyleSheet]")
ok(document.styleSheets.length > styleSheets_length, "Sheet created with a STYLE element")
ok(sheet === document.styleSheets[document.styleSheets.length -1], "styleElement.sheet === document.styleSheets[document.styleSheets.length -1]")

ok(document.styleSheets.length == styleSheets_length + 1, "Created a new sheet")

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

var old
var test = document.getElementById('test')

old = test.offsetHeight
createStyleSheetRule(sheet, '#test', 'height:10px;background:green;overflow:hidden')
ok(test.offsetHeight != old, "New cssRule")

old = test.offsetWidth
createStyleSheetRule(sheet, '#test', 'width:11px !important')
ok(test.offsetWidth != old, "New !important cssRule")

old = test.offsetTop
createStyleSheetRule(sheet, '#test', 'top:0')
ok(test.offsetTop == old, "New cssRule MUST NOT override inline style")
createStyleSheetRule(sheet, '#test', 'top:0 !important')
ok(test.offsetTop != old, "New !important MUST override inline style")

