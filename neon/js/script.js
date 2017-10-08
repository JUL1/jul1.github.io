//NAVBAR
var navToggler=document.getElementById("navToggler");
var navMenu=document.getElementById("navMenu");
var navBarBrand=document.getElementById("navBarBrand");
var isMobile=touchCapabilities();
var goTo='';

function touchCapabilities() {return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));}
function stopPropagation(e){if (!e) e = window.event;if (e.stopPropagation) {e.stopPropagation();}else {e.cancelBubble = true;}}

function toggleMenu(e,forceClose,url) {
if(navToggler){	
	var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");
	var style = window.getComputedStyle(navMenu, null).getPropertyValue("max-Height");
}

	if(url){goTo=url}else{goTo='';}

if(visibility==="visible"){

	if(forceClose && style!=="0px"){

		navMenu.style.animationName = 'collapse';
	}else if(style!=="0px"){navMenu.style.animationName = 'collapse';}else if(!forceClose){goTo='';navMenu.style.animationName = 'expand';}else if(forceClose){GOTO();}

}else{GOTO();}

}

function addNavButtonAnimation(e){stopPropagation(e);e.target.style.animationName = 'flicker';}

function toggle(e){stopPropagation(e);e.target.style.animationName = 'flicker';toggleMenu(e);}

function GOTO(){if(goTo!==''){window.open(goTo,"_self");goTo='';};}

function resizeHandler() {

if(navToggler){
var visibility = window.getComputedStyle(navToggler, null).getPropertyValue("visibility");
	
	var style = window.getComputedStyle(navMenu, null).getPropertyValue("max-height");

	if(visibility!=="visible" && style==="0px"){
		navMenu.style.maxHeight="512px";
	}else if(visibility==="visible"){navMenu.style.maxHeight="0px";};
}

}

function setNavBarLinks(){

if(navToggler){
var elems=navMenu.getElementsByTagName("span");

	for(var i=0; i < elems.length; i++){

		if(isMobile){elems[i].addEventListener("touchstart",addNavButtonAnimation,false);}else{elems[i].addEventListener("mousedown",addNavButtonAnimation,false);}
					 elems[i].addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e,false,e.target.getAttribute("target"));}, false);
	}

	if(isMobile){navToggler.addEventListener("touchstart",toggle,false);}else{navToggler.addEventListener("mousedown",toggle,false);}
				 navToggler.addEventListener('animationend', function(e){e.target.style.animationName = '';}, false);

				 navMenu.addEventListener('animationend', function(e){

				 	if(e.target.style.animationName==="collapse") {e.target.style.maxHeight="0px";GOTO();}
				 	else if(e.target.style.animationName==="expand") {e.target.style.maxHeight="512px";}

				 	e.target.style.animationName = '';

				 }, false);


}

if(isMobile){navBarBrand.addEventListener("touchstart",addNavButtonAnimation,false);}else{navBarBrand.addEventListener("mousedown",addNavButtonAnimation,false);}
		     navBarBrand.addEventListener('animationend', function(e){e.target.style.animationName = '';toggleMenu(e,true,e.target.getAttribute("target"));}, false);
	



	window.addEventListener("resize", resizeHandler);
}


resizeHandler();
setNavBarLinks();
//END OF NAVBAR

//CLOCK
function clock(){document.getElementById('clock').textContent=new Date();}

window.onload = function(){


if(document.getElementById('clock')){ clock(); setInterval( function(){ clock(); }, 1000);};

};
//END OF CLOCK




//GALLERY
var gallery=document.getElementById("gallery");
var viewer = undefined;
var viewerImg = undefined;
var imgTitle = undefined;
var imgLabel = undefined;
var galleryLength = undefined;
var currentTarget=undefined;
var galleryElements=undefined;
var galleryIndex=0;

function setUpGallery(){

var parent=document.body;
var mc=document.getElementById("mainContainer");

viewer = document.createElement("div");
viewer.id = "viewer";

viewerImg = document.createElement("img");
viewerImg.id="viewerImg";
viewerImg.src="./img/artworks/artwork1.jpg";
viewer.appendChild(viewerImg);

var prevBtn = document.createElement("span");
prevBtn.id="prevBtn";
viewer.appendChild(prevBtn);

var nextBtn = document.createElement("span");
nextBtn.id="nextBtn";
viewer.appendChild(nextBtn);

var imgCounter = document.createElement("span");
imgCounter.id="imgCounter";
viewer.appendChild(imgCounter);

imgTitle = document.createElement("span");
imgTitle.id="imgTitle";
viewer.appendChild(imgTitle);

imgLabel = document.createElement("span");
imgLabel.id="imgLabel";
viewer.appendChild(imgLabel);

var closeBtn = document.createElement("span");
closeBtn.id="closeBtn";
viewer.appendChild(closeBtn);

mc.parentNode.insertBefore(viewer, mc);
//
//console.log(turf);
	if(isMobile){

		closeBtn.addEventListener("touchstart",closeViewer,false);
		nextBtn.addEventListener("touchstart",nextImg,false);
		prevBtn.addEventListener("touchstart",prevImg,false);
		viewerImg.addEventListener("touchstart",nextImg,false);

	}else{
		closeBtn.addEventListener("mousedown",closeViewer,false);
		nextBtn.addEventListener("mousedown",nextImg,false);
		prevBtn.addEventListener("mousedown",prevImg,false);
		viewerImg.addEventListener("mousedown",nextImg,false);

	}
				 
	viewer.addEventListener('animationend', function(e){

		if(e.target.style.animationName==="fadeIn"){
		e.target.style.visibility="visible";
		e.target.style.animationName = '';
		}else if(e.target.style.animationName==="fadeOut"){
		e.target.style.visibility="hidden";
		e.target.style.animationName = '';
		}

	}, false);


	nextBtn.addEventListener('animationend', function(e){e.target.style.animationName = '';}, false);
	prevBtn.addEventListener('animationend', function(e){e.target.style.animationName = '';}, false);
	viewerImg.addEventListener('animationend', function(e){

	if(e.target.style.animationName ==='fadeOutImg') {
		e.target.style.animationName = 'fadeInImg';
		e.target.src=currentTarget.src;
	}else if(e.target.style.animationName==='fadeInImg'){
		e.target.style.animationName = '';
	}

	}, false);

	galleryElements=gallery.getElementsByTagName("img");

	galleryLength=galleryElements.length;

	for(var i=0; i < galleryLength; i++){
		galleryElements[i].setAttribute("index",i);
		if(isMobile){

			galleryElements[i].addEventListener("touchstart",openViewer,false);
		}else{
			galleryElements[i].addEventListener("mousedown",openViewer,false);
		}
		

	}

}

function galleryIndexHandler(){
if(galleryIndex<0){galleryIndex=galleryLength-1;}
else if(galleryIndex>=galleryLength){galleryIndex=0;}
currentTarget=galleryElements[galleryIndex];
updateInfos();
}

function updateInfos(){
	var infos=currentTarget.nextElementSibling;
	imgTitle.textContent=infos.getAttribute("title");
	imgLabel.textContent=infos.getAttribute("label");
	imgCounter.textContent=(parseInt(currentTarget.getAttribute("index"))+1)+'/'+galleryLength;
}

function closeViewer(){
	viewer.style.animationName ='fadeOut';
}

function nextImg(e){
	galleryIndex+=1;
	galleryIndexHandler();
	updateInfos();
	if(nextBtn.style.animationName==="fadeBtn"){
		nextBtn.style.animation = "";
		nextBtn.offsetHeight;
	};
	viewerImg.style.animationName ='fadeOutImg';
	nextBtn.style.animationName ='fadeBtn';
}

function prevImg(e){
	galleryIndex-=1;
	galleryIndexHandler();
	updateInfos();
	if(prevBtn.style.animationName==="fadeBtn"){
		prevBtn.style.animation ="";
		prevBtn.offsetHeight;
	};
	viewerImg.style.animationName ='fadeOutImg';
	prevBtn.style.animationName ='fadeBtn';	
}

function openViewer(e){
	currentTarget=e.target;
	viewerImg.src=e.target.src;
	galleryIndex=parseInt(e.target.getAttribute("index"));
	updateInfos();
	viewer.style.visibility="visible";
	viewer.style.animationName = 'fadeIn';
}


if(gallery){setUpGallery();};
//END OF CALLERY