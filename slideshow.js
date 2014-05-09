function Slide(element) {
	this.element = element;
	this.text = element.innerHTML.toString();
	this.color = element.attributes["color"] == undefined ? "#000" : element.attributes["color"].nodeValue;
	this.photoUrl = element.attributes["imageurl"].nodeValue;
	this.font_proportion = 0.05;

	var self = this;

	this.adjustFontSize = function () {
		this.element.style.fontSize = self.element.parentNode.offsetWidth * this.font_proportion + "px";
	}

	function setupNode() {
		self.element.style.backgroundImage = "url(" + self.photoUrl.toString() + ")";
		self.element.style.color = self.color;
		self.adjustFontSize();
		self.element.innerHTML = '<div class="slide-text"><span>' + self.text + "</span></div>";
	}

	setupNode();

	this.show = function () {
		this.element.classList.add("slide-active");
		this.pagerDot.element.classList.add("active");
	}

	this.hide = function () {
		this.element.classList.remove("slide-active");
		this.pagerDot.element.classList.remove("active");
	}

}

function PagerDot(parent, slide) {
	this.slide = slide;

	this.slide.pagerDot = this;

	var self = this;

	this.parent = parent;

	this.element = document.createElement("div");
	this.element.classList.add("slideshow-dot");

	this.element.onclick = function () {
		self.show();
	}

	parent.element.appendChild(this.element);

	this.show = function () {
		this.parent.hideAll();
		this.slide.show();
	}

	this.hide = function () {
		this.slide.hide();
	}
}

function Pager(parent) {
	this.element = document.createElement("div");
	this.element.classList.add("slideshow-pager");
	parent.appendChild(this.element);

	this.dots = [];

	this.addSlide = function (slide) {
		this.dots.push(new PagerDot(this, slide));
	}

	this.hideAll = function () {
		for (var i in this.dots) {
			this.dots[i].hide();
		}
	}
}

function Slideshow(element) {
	this.element = element;
	this.slides = [];

	this.duration = 2000;

	this.currentSlideIndex = 0;

	this.pager = new Pager(this.element);

	var self = this;

	this.registerSlide = function (slide) {
		this.slides.push(slide);
		this.pager.addSlide(slide);
	}

	function getSlides() {
		var slideNodes = self.element.querySelectorAll("slide");


		for (var i = 0, element; element = slideNodes[i]; i++) {
			self.registerSlide(new Slide(element));
		}


		self.slides[0].show();
	}

	this.nextSlide = function () {
		self.pager.hideAll();
		self.slides[++self.currentSlideIndex % self.slides.length].show();
	}

	this.resetFonts = function () {
		for (var i in self.slides) {
			self.slides[i].adjustFontSize();
		}
	}

	getSlides();

	this.autoRotate = function () {
		setTimeout(function () {
			self.nextSlide();
			self.autoRotate();
		}, self.duration);
	}

	this.autoRotate();

	window.onresize = function () {
		self.resetFonts();
	}

}

var SlideshowSetup = new function () {
		all_slideshows = [];
		this.setup = function (element) {
			var slideshow = new Slideshow(element);
			all_slideshows.push(slideshow);
		}
	}