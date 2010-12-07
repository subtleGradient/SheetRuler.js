var testEl, currentStyle, styleSheets_length = document.styleSheets.length
module("Create StyleSheet",{
	// sheet: SheetRuler.createStyleSheet('cssRule_tests'),
	setup: function(){
		if (!this.sheet){
			styleSheets_length = document.styleSheets.length
			this.sheet = SheetRuler.createStyleSheet('cssRule_tests')
		}
	}
})

test("Create a new StyleSheet", function(){
	ok (SheetRuler.isSheetReal(this.sheet), "sheet should be real")
})

test("new Sheet changed document.styleSheets.length", function(){
	notEqual (document.styleSheets.length, styleSheets_length)
	equal (document.styleSheets.length, styleSheets_length + 1)
})

test("new Sheet was added to document.styleSheets", function(){
	var found
	for (var i = 0; i < document.styleSheets.length; ++i){
		if (this.sheet != document.styleSheets[i]) continue
		found = this.sheet === document.styleSheets[i]
	}
	ok (found)
})

test("new Sheet is the last item in document.styleSheets", function(){
	ok (document.styleSheets[document.styleSheets.length -1] === this.sheet)
})

test("new Sheet's STYLE element is the last STYLE in the DOM", function(){
	var styleElements = document.getElementsByTagName('style')
	ok (styleElements[styleElements.length-1] === (this.sheet.ownerNode || this.sheet.owningElement))
})

test("shouldn't have a nextSibling", function(){
	ok ((this.sheet.ownerNode || this.sheet.owningElement).nextSibling == null)
})

module("Browser",{
	sheet: SheetRuler.createStyleSheet()
})
test("inspection", function(){
	equal (typeof this.sheet, 'object', 'typeof')
	equal ({}.toString.call(this.sheet), '[object CSSStyleSheet]', "[[Class]]")
	ok (this.sheet instanceof Object, 'instanceof Object')
	ok (this.sheet.constructor, 'Has a constructor')
	ok (this.sheet.toString, 'Has a toString()')
	ok (this.sheet.valueOf, 'Has a valueOf()')
})
test("styleSheets limit?", function(){
	var startLength = document.styleSheets.length
	var i = 0, max = 36 - startLength
	while (++i <= max){
		SheetRuler.createStyleSheet("Sheet-" + i)
		equal (document.styleSheets.length, startLength + i, "Should support at least " + (startLength + i) + " styleSheets")
	}
})

