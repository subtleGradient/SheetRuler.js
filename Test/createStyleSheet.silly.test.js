module("Wacky Stuff (ignore errors here)",{
	sheet: SheetRuler.createStyleSheet()
})

test("Silly Nerd Carp", function(){
	var sheet = this.sheet
	
	equal (typeof sheet, 'object', 'typeof')
	equal ({}.toString.call(sheet), '[object CSSStyleSheet]', "[[Class]]")
	ok (sheet instanceof Object, 'instanceof Object')
	ok (sheet.constructor, 'Has a constructor')
	ok (sheet.toString, 'Has a toString()')
	ok (sheet.valueOf, 'Has a valueOf()')
})

// test("Silly Nerd Carp: Subclassing a host object (lol)", function(){
// 	var hasOwnProperty = {}.hasOwnProperty;
// 	var sheet = this.sheet
// 	
// 	function WrappedSheet(){}
// 	WrappedSheet.prototype = sheet
// 	var subclass = new WrappedSheet
// 	
// 	ok(subclass, 'Subclassable')
// 	// equal(subclass, sheet, "Subclass is kindof equal to the sheet")
// 	
// 	var keys = []
// 	for (var property in sheet){
// 		
// 		equal(subclass[property], sheet[property], property)
// 		
// 		if (!hasOwnProperty.call(sheet, property)){
// 			keys.push("[[Prototype]]." + property)
// 			continue
// 		}
// 		keys.push(property)
// 	}
// 	
// 	var subclassKeys = []
// 	for (var property in subclass){
// 		if (!hasOwnProperty.call(subclass, property)){
// 			keys.push("[[Prototype]]." + property)
// 			continue
// 		}
// 		keys.push(property)
// 	}
// 	
// 	equal(subclassKeys, keys, "Subclass' keys are all the same")
// 	equal(sheet, Object(sheet), 'instanceof Object')
// })
