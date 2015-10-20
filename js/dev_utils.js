var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;

var debug = function (s) {
	if (typeof window.console != "undefined") {
		window.console.log(s);
	} else {
		trace(s);
	}
}

var printObjectProps = function(whichObj, doRecurse, whichLevel) {
//accepts an object reference and an optional boolean
//traces out all properties/values of whichObj
//if doRecurse is true (default is false), it recurses into nested objects
//usage:
//sape.Utils.printObjectProps(someObject, [true/false]);
	if (whichLevel == undefined) {
		whichLevel = 0;
	}
	var dispPrefix = "";
	for (var i=0; i<whichLevel; i++) {
		dispPrefix = dispPrefix + "----";
	}

	var recursing = false;
	if (doRecurse != undefined) {
		recursing = doRecurse;
	}
	for (var curProp in whichObj) {
		var curVal = whichObj[curProp];
		if (typeof(curVal) == "object") {
			if (recursing) {
				trace(dispPrefix + "recursing into: " + curProp + " (" + typeof(curVal) + ")");
				printObjectProps(curVal, true, whichLevel + 1);
			} else {
				trace(dispPrefix + curProp + ": " + curVal + " (" + typeof(curVal) + ") - not recursing");
			}
		} else {
			trace(dispPrefix + curProp + ": " + curVal + " (" + typeof(curVal) + ")");
		}
	}
}

var trace = function (whichString) {
	try {
		console.info(whichString);
	}
	catch(e) {
		if (document.getElementById('tForm') == "undefined" || document.getElementById('tForm') == undefined) {
			var divWidth = 850;
			var divHeight = 326;
			var docHeight = document.documentElement.clientHeight;
			var docWidth = document.documentElement.clientWidth;
			var formHolder = document.createElement('div');
			formHolder.id = "tFormHolder";
			formHolder.style.zIndex = "1000";
			formHolder.style.background = "#666666";
			formHolder.style.overflow = "hidden";
			formHolder.style.position = "absolute";
			formHolder.style.width = divWidth + "px";
			formHolder.style.height = divHeight + "px";
			formHolder.style.left = (docWidth - divWidth - 20) + "px";
			formHolder.style.top = (docHeight - divHeight - 20) + "px";
			formHolder.style.color = "#FFFFFF";
			formHolder.style.fontFamily = "Verdana";
			formHolder.style.fontSize = "11px";
			formHolder.style.fontWeight = "bold";
			formHolder.style.paddingTop = "2px";
			formHolder.style.textAlign = "center";
			formHolder.innerHTML = "Trace Window (<a href='javascript:toggleWindow();' style='color:#FFFFFF'>toggle</a>)";
			formHolder.onmousedown = function (event) { startDrag(event, this); };
			formHolder.onmouseup = function () { stopDrag(this); };
			
			var form = document.createElement('form');
			formHolder.appendChild(form);
			form.id = "tForm";
			var field = document.createElement('textarea');
			form.appendChild(field);
			field.rows = 5;
			field.cols = 18;
			field.id = "tText";
			field.style.position = "absolute";
			field.style.left = "1px";
			field.style.top = "20px";
			field.style.width = (divWidth-8) + "px";
			field.style.height = (divHeight-26) + "px";
	    
			//document.body.appendChild(formHolder);
			$("body").prepend(formHolder); 
		}
			
		var theField = document.getElementById('tText');
		theField.value = theField.value + "\n" + whichString;
		theField.scrollTop = theField.scrollHeight;
	}
}

var toggleWindow = function () {
	var d = document.getElementById('tFormHolder');
	if (d.style.height == "18px") {
		d.style.height = "326px";
	} else {
		d.style.height = "18px";
	}
}

var startDrag = function(e, whichElem) {
	var curMouseLoc = getMouseXY(e);
	var xOffset = curMouseLoc.x - whichElem.offsetLeft;
	var yOffset = curMouseLoc.y - whichElem.offsetTop;
	document.onmousemove = function(e) {
		var curMouseLoc = getMouseXY(e);
		var newX = curMouseLoc.x - xOffset;
		var newY = curMouseLoc.y - yOffset;
		whichElem.style.left = newX + "px";
		whichElem.style.top = newY + "px";
	}
}

var stopDrag = function(whichElem) {
	document.onmousemove = null;
}

var getMouseXY = function(e) {
	//must have an event (e.g. click, mousedown, mousemove, etc.) passed to it
	var curLoc = {};
	if (isIE) {
		curLoc.x = event.clientX + document.body.scrollLeft;
		curLoc.y = event.clientY + document.body.scrollTop;
	} else {
		curLoc.x = e.pageX;
		curLoc.y = e.pageY;
	}
	return curLoc;
}