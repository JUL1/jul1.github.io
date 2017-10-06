//document.getElementById("togglerBtn").addEventListener("click",toggleMenu);
var navToggler=document.getElementById("navToggler");
var navMenu=document.getElementById("navMenu");
var navBarBrand=document.getElementById("navBarBrand");
var isMobile=touchCapabilities();

function touchCapabilities() {
 return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}


function toggleMenu(e) {
	

	
	var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");

	if(visibility==="visible"){
		if(navMenu.classList.contains("collapse")) {navMenu.classList.remove("collapse");navMenu.classList.add("deploy");}else{navMenu.classList.add("collapse");navMenu.classList.remove("deploy");};
	}
}

function resizeHandler() {

var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");
	
	if(visibility!=="visible" && navMenu.classList.contains("deploy")){
		navMenu.classList.remove("deploy");navMenu.classList.add("collapse");
	}

}



function addAnimation(e){
	//alert(e.target.getAttribute("target"));
	    if (!e) e = window.event;
    if (e.stopPropagation) {e.stopPropagation();}else {e.cancelBubble = true;}

	e.target.style.animationName = 'flicker';
}



function setNavBarLinks(){

var elems=navMenu.getElementsByTagName("span");

	for(var i=0; i < elems.length; i++){

		if(isMobile){elems[i].addEventListener("touchstart",addAnimation,false);}else{elems[i].addEventListener("mousedown",addAnimation,false);}
		elems[i].addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e);window.open(e.target.getAttribute("target"),"_self");}, false);
		//alert(elems[i].getAttribute("target"));
	}

if(isMobile){navToggler.addEventListener("touchstart",addAnimation,false);}else{navToggler.addEventListener("mousedown",addAnimation,false);}
navToggler.addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e);}, false);
}




setNavBarLinks();

window.addEventListener("resize", resizeHandler);




//toggleMenu();