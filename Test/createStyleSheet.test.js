var testEl, currentStyle, styleSheets_length
module("Create StyleSheet",{
	setup: function(){
		if (!this.sheet){
			styleSheets_length = document.styleSheets.length
			this.sheet = SheetRuler.createStyleSheet('cssRule_tests')
		}
	}
})

test("Create a new StyleSheet", function(){
	
	var sheet = this.sheet
	
	ok (SheetRuler.isSheetReal(sheet), "sheet should be real")
	
	equal (SheetRuler.getElement(sheet).parentNode.nodeName, 'HTML', "parentNode should be HTML")
	
	equal (document.styleSheets.length, styleSheets_length + 1, "Created a new sheet")
	
	notEqual (document.styleSheets.length, styleSheets_length, "new Sheet changed document.styleSheets.length")
	
	var found
	for (var i = 0; i < document.styleSheets.length; ++i){
		if (sheet != document.styleSheets[i]) continue
		found = sheet === document.styleSheets[i]
	}
	ok (found, "new Sheet was added to document.styleSheets")
	
	ok (document.styleSheets[document.styleSheets.length -1] === sheet, "new Sheet is the last item in document.styleSheets")
	
	var styleElements = document.getElementsByTagName('style')
	ok (styleElements[styleElements.length-1] === (sheet.ownerNode || sheet.owningElement)
		,"new Sheet's STYLE element is the last STYLE in the DOM")
	
	ok ((sheet.ownerNode || sheet.owningElement).nextSibling == null
		,"shouldn't have a nextSibling")
	
	// equal ((sheet.ownerNode || sheet.owningElement).previousSibling
	// 	,document.getElementsByTagName('body')[0]
	// 	,"previousSibling should be BODY")
})
