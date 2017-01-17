function clock(){

		var today = new Date();
	document.getElementById('clock').innerHTML=today;
}

window.onload = function(){
	
	
	if(document.getElementById('clock')){
		clock();
		setInterval(function(){ clock(); }, 1000);

	};

var url=window.location.href;

if (window.history.replaceState && url.indexOf("index") !=-1) {
    var loc=window.location.href.replace('index.html#end','');
    loc.replace('index.html','');
   window.history.replaceState('', '',loc);
}

}


function setTheme(nbr) {
    document.getElementById("pagestyle").setAttribute("href", "style"+nbr+".css");  
}


function fullScreen() {

    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !==null) || (document.mozFullScreen || document.webkitIsFullScreen);
    var docElm = document.documentElement;

    if (!isInFullScreen) {

        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
          
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
         
        }
        //if(!appIsLaunched){launchApp();}
    }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


