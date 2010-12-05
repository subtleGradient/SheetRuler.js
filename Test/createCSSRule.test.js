var testEl, currentStyle, styleSheets_length
module("Create cssRule",{
	setup: function(){
		if (!this.sheet){
			styleSheets_length = document.styleSheets.length
			this.sheet = SheetRuler.createStyleSheet('cssRule_tests')
		}
		testEl = document.getElementById('test')
		currentStyle = testEl.currentStyle || window.getComputedStyle(testEl,null)
	}
})

test("new rule must work", function(){
	var old = currentStyle.color
	SheetRuler.createRule(this.sheet, '#test', 'color:green')
	notEqual (currentStyle.color, old)
})

test("New rule must override existing style", function(){
	var old = testEl.offsetHeight
	SheetRuler.createRule(this.sheet, '#test', 'overflow:hidden;height:11px')
	notEqual(testEl.offsetHeight, old)
	
	old = currentStyle.backgroundColor
	SheetRuler.createRule(this.sheet, '#test', 'background-color:green')
	notEqual (currentStyle.backgroundColor, old)
})

test("New !important must override previous rules", function(){
	var old = testEl.offsetWidth
	SheetRuler.createRule(this.sheet, '#test', 'overflow:hidden;width:11px !important')
	notEqual (old, testEl.offsetWidth)
})

test("New cssRule must NOT override inline style", function(){
	var old = testEl.offsetTop
	SheetRuler.createRule(this.sheet, '#test', 'top:0')
	equal (old, testEl.offsetTop)
})

test("New !important must override inline style", function(){
	var old = testEl.offsetTop
	SheetRuler.createRule(this.sheet, '#test', 'top:0 !important')
	notEqual (old, testEl.offsetTop)
})