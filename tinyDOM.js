window.tinyDOM = (function() {
	function TinyDOM(element) {
		// this.element = document.createElement(type);
		// this.className = className;
		this.element = element
	};

	TinyDOM.prototype.className = '';

	//create an element
	TinyDOM.prototype.createElement = function(element, className) {
		var newElement = new TinyDOM(element, className);
		return newElement;
	};

	//add an element to the parent element
	TinyDOM.prototype.append = function(element) {
		this.element.appendChild(element);
	};

	//add src to an element
	TinyDOM.prototype.addSrc = function(src) {
		this.element.src = src;
	};

	//remove children of elements
	TinyDOM.prototype.empty = function(elements) {
		elements.forEach
	}
})();