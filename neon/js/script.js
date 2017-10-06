//document.getElementById("togglerBtn").addEventListener("click",toggleMenu);
var navToggler=document.getElementById("navToggler");
var navMenu=document.getElementById("navMenu");
var navBarBrand=document.getElementById("navBarBrand");
var isMobile=touchCapabilities();

function touchCapabilities() {return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));}
function stopPropagation(e){if (!e) e = window.event;if (e.stopPropagation) {e.stopPropagation();}else {e.cancelBubble = true;}}

function toggleMenu(e,forceClose,url) {
	
	var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");
	var style = window.getComputedStyle(navMenu, null).getPropertyValue("max-Height");




if(visibility==="visible"){

	if(forceClose){

		navMenu.style.animationName = 'collapse';
	}else if(style!=="0px"){navMenu.style.animationName = 'collapse';}else{navMenu.style.animationName = 'expand';}
}
	
/*
	if(forceClose && style!=="0"){

		navMenu.style.animationName = 'collapse';
	}
	
	

	if(visibility==="visible"){
		if(style==="0") {navMenu.style.animationName = 'expand';}else{navMenu.style.animationName = 'collapse';};
	}
*/
}

function addNavButtonAnimation(e){
	//alert(e.target.getAttribute("target"));
	stopPropagation(e);
	e.target.style.animationName = 'flicker';

}


function toggle(e){

	stopPropagation(e);
	e.target.style.animationName = 'flicker';
	toggleMenu(e);
}

//window.open(e.target.getAttribute("target"),"_self");
function setNavBarLinks(){

var elems=navMenu.getElementsByTagName("span");

	for(var i=0; i < elems.length; i++){

		if(isMobile){elems[i].addEventListener("touchstart",addNavButtonAnimation,false);}else{elems[i].addEventListener("mousedown",addNavButtonAnimation,false);}
					 elems[i].addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e,false,e.target.getAttribute("target"));}, false);
		//alert(elems[i].getAttribute("target"));
	}

if(isMobile){navBarBrand.addEventListener("touchstart",addNavButtonAnimation,false);}else{navBarBrand.addEventListener("mousedown",addNavButtonAnimation,false);}
		     navBarBrand.addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e,true,e.target.getAttribute("target"));}, false);
	

	if(isMobile){navToggler.addEventListener("touchstart",toggle,false);}else{navToggler.addEventListener("mousedown",toggle,false);}
				 navToggler.addEventListener('animationend', function(e){e.target.style.animationName = '';}, false);

				 navMenu.addEventListener('animationend', function(e){

				 	if(e.target.style.animationName==="collapse") {e.target.style.maxHeight="0px";}
				 	else if(e.target.style.animationName==="expand") {e.target.style.maxHeight="512px";}
				 	e.target.style.animationName = '';

				 }, false);
}




setNavBarLinks();



function resizeHandler() {

var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");
	
	var style = window.getComputedStyle(navMenu, null).getPropertyValue("max-height");

	if(visibility!=="visible" && style==="0px"){
		navMenu.style.maxHeight="512px";
	}else if(visibility==="visible"){navMenu.style.maxHeight="0px";};

}

window.addEventListener("resize", resizeHandler);

resizeHandler();


//toggleMenu();