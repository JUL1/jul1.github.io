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


/*
  * Normalized hide address bar for iOS & Android
  * (c) Scott Jehl, scottjehl.com
  * MIT License
*/
(function( win ){
	var doc = win.document;
	
	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){
		
		//scroll to 1
		window.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
		
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
		
		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		} );
	}
})( this );
