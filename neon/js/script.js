//document.getElementById("togglerBtn").addEventListener("click",toggleMenu);
var navToggler=document.getElementById("navToggler");
var navMenu=document.getElementById("navMenu");

function toggleMenu() {
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

navToggler.addEventListener("touchstart",toggleMenu);
navMenu.addEventListener("touchstart",toggleMenu);
window.addEventListener("resize", resizeHandler);

//toggleMenu();