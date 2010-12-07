var testEl, currentStyle, styleSheets_length

module("Basic",{
	setup: function(){
		if (!this.sheet){
			styleSheets_length = document.styleSheets.length
			this.sheet = SheetRuler.createStyleSheet()
		}
		testEl = document.getElementById('test')
		currentStyle = testEl.currentStyle || window.getComputedStyle(testEl,null)
	}
})

test("rules collection", function(){
	var rules = this.sheet.cssRules || this.sheet.rules
	var old = rules.length
	SheetRuler.createRule(this.sheet, '#test', 'color:yellow')
	equal (rules.length, old + 1, "new rule SHOULD be added to the rules collection")
})

test("new rule must work", function(){
	var old = currentStyle.color
	SheetRuler.createRule(this.sheet, '#test', 'color:green')
	notEqual (currentStyle.color, old)
})

test("creating a new rule should not require an existing sheet", function(){
	var old = currentStyle.color
	SheetRuler.createRule(null, '#test', 'color:purple')
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

// test("maximum number of cssRules?", function(){
// 	// var rules = (this.sheet.cssRules || this.sheet.rules)
// 	// BIZARRE! in Safari 3.0.4, resolving sheet.cssRules into a single 
// 	// rules variable breaks the magical length property!
// 	// Apparently you must always use sheet.cssRules.length
// 	var sheet = this.sheet
// 	var startLength = (sheet.cssRules || sheet.rules).length
// 	var i = 0, max = 256
// 	while (++i <= max){
// 		SheetRuler.createRule(sheet, '#test', 'height:' + i + "px")
// 		equal (i, testEl.offsetHeight,
// 			"cssRule " + (startLength + i) + " should work")
// 	}
// })



// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
module("Basic: Disable", {
	setup: function(){
		this.sheet = SheetRuler.createStyleSheet()
		testEl = document.getElementById('test')
		currentStyle = testEl.currentStyle || window.getComputedStyle(testEl,null)
	}
})
// test("Disable rule", function(){
// 	var old = testEl.offsetHeight
// 	var rule = SheetRuler.createRule(this.sheet, '#test', 'overflow:hidden;height:99px')
// 	notEqual(testEl.offsetHeight, old, "new style must work")
// 	SheetRuler.disableRule(rule)
// 	equal(testEl.offsetHeight, old, "new style must be disabled")
// })
// test("Destroy rule", function(){
// 	var old = testEl.offsetHeight
// 	var rule = SheetRuler.createRule(this.sheet, '#test', 'overflow:hidden;height:99px')
// 	notEqual(testEl.offsetHeight, old, "new style must work")
// 	SheetRuler.deleteRule(rule)
// 	equal(testEl.offsetHeight, old, "new style must stop working")
// })

test("Erase rule", function(){
	var old = testEl.offsetHeight
	var old1 = testEl.offsetTop
	var rule = SheetRuler.createRule(this.sheet, '#test', 'overflow:hidden;height:44px')
	
	ok(rule, "new rule must exist")
	notEqual(testEl.offsetHeight, old, "new style must work")
	SheetRuler.eraseRule(rule)
	equal(testEl.offsetHeight, old, "new style must stop working")
	equal(testEl.offsetTop, old1, "don't apply new style")
})



// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //
module("Advanced", {
	sheet: SheetRuler.createStyleSheet(),
	setup: function(){
		testEl = document.getElementById('test')
		currentStyle = testEl.currentStyle || window.getComputedStyle(testEl,null)
		this.rule = SheetRuler.createRule(this.sheet, '#test', 'line-height:1em')
	}
})

test("set rule.style.cssText",function(){
	ok(this.rule.style.cssText, "Rule has style.cssText")
	ok(this.rule.style.cssText = "height:98px", "setting rule.style.cssText doesn't throw")
	equal(this.rule.style.height, '98px', "setting rule.style.cssText works")
})
test("set rule.foo = 'bar'",function(){
	ok(this.rule.foo = 'bar')
	ok(this.rule.foo == 'bar')
})
test("get rule.parentStyleSheet",function(){
	ok(SheetRuler.isSheetReal(this.rule.parentStyleSheet), "rule.parentStyleSheet is real")
})
test("set rule.selectorText",function(){
	equal(this.rule.selectorText, "#test", "Sanity check")
	ok(this.rule.selectorText = '.foo')
	equal(this.rule.selectorText, '.foo', "selectorText is writable")
})
test("set rule.cssText",function(){
	ok(this.rule.cssText, "Rule has cssText")
	ok(this.rule.cssText = "#test{height:99px}", "setting rule.cssText doesn't throw")
	equal(this.rule.style.height, '99px', "setting rule.cssText works")
})

