/**

CommandoThug - Action Shooter Game

Copyright (C) 2015  Julien Renaut

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Tested with:
*** CPU: 1.6 GHz Atom >>> 2.53 GHz Core 2 Duo ***
*** Phaser v2.0.5 - v2.1.0 - v2.3.0 ***

----------------------------------------------------------------------
15/01/2017 - By JR

Looking back on it 2 years later...
Ok, it's coded like shit, kind of
Lots of bizarre stuffs, that could have been done in a simplier way...
With framework's functions for instance that I wasn't aware of (fades), or done in a shit way (such as parseInt instead of Math.round)
Some stuffs didn't work as expected... (scaling does a dirty smoothing on this version of the framework, hence, the pre scalled sprites and fonts)
I made it in canvas because retro fonts display didn't work well with WebGL, for instance...
There are couple of useless optimizations and variables here and there...
...
But eh, as far as I know, it works from end to end, without major bugs
...
Colors are rather shitty, just as the screen I used to dev it
...
That is all
----------------------------------------------------------------------
*/

Game = {};
//700x450
var skipQuadTree=false;
var FPS=false;//60;
var FORCE_UPDATE=false;

var defaultPlayersNbr=10;
var defaultTicketsNbr=36;
var maxNumberOfPlayers=defaultPlayersNbr;//16 max
var tickets=defaultTicketsNbr;
var totalNbrOfLevels=15;
var gameMode='1 player';
var copyrightNotice="\n\nThis program is free software:\n\n\n\nyou can redistribute it and/or modify it under\n\nthe terms of the GNU General Public License\n\nas published by the Free Software Foundation\n\neither version 3 of the License\n\nor (at your option) any later version.\n\n\n\nCopyright (C) 2015  Julien Renaut\n\nGNU General Public License";
var startState='InitScreen';
var stageWidth=768;
var stageHeight=448;

var screenCenterX=Math.round(stageWidth/2);
var screenCenterY=Math.round(stageHeight/2);
var Scale=4;
var navyBlue='#141f3d';
var black='#111111';
var realBlack='#000000';

var Boot_bkgColor=navyBlue;
var Load_bkgColor=realBlack;
var LogoScreen_bkgColor=realBlack;
var IntroScreen_bkgColor=realBlack;
var MainMenu_bkgColor=realBlack;
var OptionsMenu_bkgColor=realBlack;
var DemoMode_bkgColor=realBlack;
var LevelEnd_bkgColor=realBlack;
var GameOver_bkgColor=realBlack;
var CopyRight_bkgColor=realBlack;
var Levels_bkgColor=realBlack;

var team1Color=0xdd0000;// 0xdd0000//'#7b2522';
var team2Color=0x006fe1;//'#152e4d';


var mapTextures=['tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1','tileSet1'];

var victoryMessage='defeat';
var fontString='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!:.©_-/()';
var fontStringLength=fontString.length;
var fontHeight=16;

var Volume=0.1;
var MusicVolume=0.2;
var inputBlockDelay=800;
var noMusic=true;

var randomizeNbrOfPlayers=false;


var currentLevel=0;
var team1Tickets=tickets;
var team2Tickets=tickets;
var gameRoundDuration=0;
var roundDuration=gameRoundDuration;
var demoRoundDuration=-30;
var creditsP1=3;
var creditsP2=3;
var playerLife=100;

var player1Life=playerLife;
var player2Life=playerLife;


var player1ClipNbr=0;
var player1AmmoClip=0;

var player2ClipNbr=0;
var player2AmmoClip=0;
var soundConfig='music off / fx on';
var player1Gun='machineGun';
var player2Gun='shotGun';
var killValue=1;
var player1Nick='player 1';
var player2Nick='player 2';

var player1Score=0;
var player2Score=0;

var player1_HighScore=0;
var player2_HighScore=0;

var randomizeMaps=true;

var previousState="IntroSceen";

var assetPath='assets/';

function resetStats(){
killValue=1;
creditsP1=3;
creditsP2=3;
currentLevel=0;
player1Score=0;
player2Score=0;
player1Gun='machineGun';
player2Gun='shotGun';
}


var highScorePanelStartDelay=1500;
var highScorePanelDelays=4000;
var demoModeDelay=32000;

var chatEnabled=false;
var keyReset = true;
//localStorage.clear();
//getLocalStorage();
//setLocalStorage();
var currentPlayer=1;
var gameScreenShot=undefined;
var firstRun=true;







function screenShot(){
gameScreenShot = game.make.bitmapData(stageWidth, stageHeight);
gameScreenShot.draw(game.canvas, 0, 0);
}


function setLocalStorage(){
    /*
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem("maxNumberOfPlayers", maxNumberOfPlayers);
        localStorage.setItem("gameRoundDuration", gameRoundDuration);
        localStorage.setItem("roundDuration", roundDuration);
        localStorage.setItem("tickets", tickets);
        localStorage.setItem("team1Tickets", team1Tickets);
        localStorage.setItem("team2Tickets", team2Tickets);
        localStorage.setItem("gameMode", gameMode);
    }
    */


}

function getLocalStorage(){
    /*
    if(typeof(Storage) !== "undefined") {
        if(localStorage.getItem("maxNumberOfPlayers")){maxNumberOfPlayers=localStorage.getItem("maxNumberOfPlayers");};
        if(localStorage.getItem("gameRoundDuration")){gameRoundDuration=localStorage.getItem("gameRoundDuration");};
        if(localStorage.getItem("roundDuration")){roundDuration=localStorage.getItem("roundDuration");};
        if(localStorage.getItem("tickets")){tickets=localStorage.getItem("tickets");};
        if(localStorage.getItem("team1Tickets")){team1Tickets=localStorage.getItem("team1Tickets");};
        if(localStorage.getItem("team2Tickets")){team2Tickets=localStorage.getItem("team2Tickets");};
        if(localStorage.getItem("gameMode")){gameMode=localStorage.getItem("gameMode");};
    }
    */

}



function durationToTextTime(nbr){
    var res='';
    var totalTime='';

    var curtime=nbr;
    var minsLeft=Math.round(curtime/60);
    var secsLeft=( curtime-(60*( minsLeft-1)));
    if(secsLeft===60){secsLeft=0;minsLeft+=1;};
    if(secsLeft>9){totalTime=minsLeft+':'+secsLeft;}else{totalTime=minsLeft+':0'+secsLeft;}
    if(minsLeft>9){res =''+totalTime;}else{res ='0'+totalTime;}
    if(minsLeft<0){res ='00:00';}

    return res;
}



var randomMapArray = [];

function randomMapList(){
randomMapArray = [];
randomMapArray[0]=0;
    while(randomMapArray.length < totalNbrOfLevels){
    var randomnumber=1+Math.floor(Math.random()*totalNbrOfLevels-1)
    var found=false;
    for(var i=1;i<randomMapArray.length;i++){
        if(randomMapArray[i]==randomnumber){found=true;break}
    }
    if(!found) {randomMapArray[randomMapArray.length]=randomnumber;}
    }

}


//function randNbr(){return 5+Math.round(Math.random()*50);}


var topScore_serverOutput='oddskill:800,JUL:1984,hardtail:1024,seb:768,sir_everard:808,sarge:266,m1gh71:480,pedro24:24,bob:14,rex:2';
//var defaultPlayerList="deathpigeon:5000,ghostwheel:4000,SolidMonkey:3000,sleepybear:2000,NovaKing:1000,DrDoom:50,badhorse:40,lizarmaster:30,reddog:20,antihero:10";
var defaultPlayerList="ghostwheel:4000,m1gh71:480,NovaKing:1000,Spitfire:266,delta6:2,antihero:10,botMatser:200,Lokky:30,blindsight:40,DrDoom:50,Butt3rfly:2000,wolf_mozart:5000,Maverick:44,Xenolith:14,Xiti:24,DarkElement:5000";
var HighScoresNames=[];
var HighScores=[];

var nickListTeam1=[];
var nickListTeam2=[];
var scoreListTeam1=[];
var scoreListTeam2=[];




function computeTopScore(output,split){
HighScoresNames=[];
HighScores=[];
nickListTeam1=[];
nickListTeam2=[];
scoreListTeam1=[];
scoreListTeam2=[];

var arr=output.split(",");
var arrTeam1=arr.slice(0,Math.round(arr.length/2));
var arrTeam2=arr.slice(Math.round(arr.length/2), arr.length);

arr.sort(function(a,b){
    a=a.split(":");
    b=b.split(":");
    var an=parseInt(a[1],10);
    var bn=parseInt(b[1],10);
    return an<=bn;
});

arrTeam1.sort(function(a,b){
    a=a.split(":");
    b=b.split(":");
    var an=parseInt(a[1],10);
    var bn=parseInt(b[1],10);
    return an<=bn;
});

arrTeam2.sort(function(a,b){
    a=a.split(":");
    b=b.split(":");
    var an=parseInt(a[1],10);
    var bn=parseInt(b[1],10);
    return an<=bn;
});

var resulta =[];
var resultb =[];



if(split){

for(var i=0;i<maxNumberOfPlayers/2;i++)
{
    var splitarray = arrTeam1[i].split(":");
    nickListTeam1[i] = splitarray[0];
    scoreListTeam1[i] = splitarray[1];
}

for(var i=0;i<maxNumberOfPlayers/2;i++)
{
    var splitarray = arrTeam2[i].split(":");
    nickListTeam2[i] = splitarray[0];
    scoreListTeam2[i] = splitarray[1];
}
}else{
for(var i=0;i<arr.length;i++)
{
    var splitarray = arr[i].split(":");
    resulta[i] = splitarray[0];
    resultb[i] = splitarray[1];

    if(i<Math.round(arr.length/2)){
        nickListTeam1[i]=resulta[i];
        scoreListTeam1[i]=resultb[i];
    }else{
            nickListTeam2[i-Math.round(arr.length/2)]=resulta[i];
            scoreListTeam2[i-Math.round(arr.length/2)]=resultb[i];
        }
}
HighScoresNames=nickListTeam1.concat(nickListTeam2); 
HighScores=scoreListTeam1.concat(scoreListTeam2);
}


}



var playersNbrTeam1=nickListTeam1.length/2;
var playersNbrTeam2=nickListTeam2.length/2;



var spawnPointTeam1=[];
var spawnPointTeam2=[];


var memory = {
    highScore:'oddskill:1000,JUL:2000,hardtail:389,seb:124,sir_everard:128,sarge:50,m1gh71:30,pedro24:45,bob:14,rex:222',
    currentScores:'oddskill:1000,JUL:2000,hardtail:389,seb:124,sir_everard:128,sarge:50,m1gh71:30,pedro24:45,bob:14,rex:222',
    getMatchResults:function(){return this.currentScores},
    init:function(){this.currentScores='';},
    incrementCurrentScores:function(str,obj){ this.currentScores+=''+str+','; if(obj.nick==player1Nick){player1Score+=obj.score;} if(obj.nick==player2Nick){player2Score+=obj.score;}} 
//var topScore_serverOutput='oddskill:3000,JUL:20000,hardtail:3389,seb:1024,sir_everard:1288,sarge:540,m1gh71:320,pedro24:45,bob:14,rex:2';
};




var musics = new Object();

musics.play = function(key){ if(!noMusic){this[key].play();} };
musics.stop = function(key){this[key].stop();};


var sounds = new Object();

sounds.play = function(key){this[key].play();};
sounds.stop = function(key){this[key].stop();};

function switchState(stateName){

    memory.init();
    //players.forEach(function(obj) {memory.incrementCurrentScores(obj.nick+':'+obj.score);}, this);
   
    for(var i=0;i<playersArray.length;i++){if(playersArray[i].team===1){memory.incrementCurrentScores(playersArray[i].nick+':'+playersArray[i].score, playersArray[i]);  }}
    for(var i=0;i<playersArray.length;i++){if(playersArray[i].team===2){memory.incrementCurrentScores(playersArray[i].nick+':'+playersArray[i].score, playersArray[i]);  }}
    if(memory.currentScores.charAt(memory.currentScores.length-1)===','){memory.currentScores = memory.currentScores.substring(0,memory.currentScores.length-1);}
   
        computeTopScore(memory.getMatchResults(),true);
        //game.state.start(stateName);
      if(stateName==='reset'){game.state.restart(true);}
      else{game.state.start(stateName, true, false);};
}


var anyKeyDown=false;



function compareTotalScoreToTOP10(nick,score,scoreStr){

    var arr = scoreStr.split(",");
    var tempIndex=-1;
    var tempStr="";
    var tempDeplace=[];

    for(var i=0;i<arr.length;i++){
        
            var arrTemp = arr[i].split(":");

            if(arrTemp[1]<=score){tempIndex=i;}


            

    }

    if(tempIndex>-1){
        for(var i=arr.length;i>tempIndex;i--) { arr[i]=arr[i-1]; };
        arr[tempIndex]=nick+":"+score;
    }



/*
            tempDeplace[i]=arr[i];
            for(var i=tempIndex;i<arr.length;i++){tempDeplace[i]=arr[i];};       
            for(var i=tempIndex;i<arr.length;i++){ arr[i]=tempDeplace[i+1];};
*/



    for(var i=0;i<arr.length;i++){tempStr+=arr[i]+","};

    if(tempStr.charAt(tempStr.length-1)===','){tempStr = tempStr.substring(0,tempStr.length-1);}

    return tempStr;
}


var credTextP1=undefined;
var credTextP2=undefined;
 
function initState(){
game.sound.channels=1;
anyKeyDown=false;
this.timeStamp=game.time.time;

if(FPS){game.time.desiredFps = FPS;}
if(FORCE_UPDATE){game.forceSingleUpdate = FORCE_UPDATE;}

if(game.state.current==="InitScreen"){
    game.stage.backgroundColor = '#000000';
    addBkgImg.call(this,'catHead',screenCenterX,screenCenterY);
    sounds.play('initSound');

 }else if(game.state.current==="IntroScreen"){
        game.stage.backgroundColor = IntroScreen_bkgColor;
        randomMapList();
        if(firstRun){firstRun=false;sounds.play('supersound');}


        topScore_serverOutput='oddskill:800,JUL:1984,hardtail:768,seb:1024,sir_everard:648,sarge:266,m1gh71:480,pedro24:24,bob:14,rex:2';

if(player1Score>=player1_HighScore){player1_HighScore=player1Score; };
if(player2Score>=player2_HighScore){player2_HighScore=player2Score; };



        var top10Str = compareTotalScoreToTOP10(player1Nick,player1_HighScore,topScore_serverOutput);
        
        if(gameMode!=='1 player'){

            top10Str = compareTotalScoreToTOP10(player2Nick,player2_HighScore,top10Str);

        }
        computeTopScore(top10Str);
        // if(!musics.charSelectTheme.isPlaying){musics.play('charSelectTheme');}
        addBkgImg.call(this,'introScreen',screenCenterX,screenCenterY);

        addText.call(this,screenCenterX,stageHeight-fontHeight*2,'COMMANDO THUG © 2015 JUL');


    var version='Demo v1.0';
    var engineVersion='Phaser'+"\n"+"v"+Phaser.VERSION;

    addText.call(this,stageWidth-90,0,version);
    addText.call(this,stageWidth-10,stageHeight-fontHeight*3,engineVersion,0.1);
    //this.versionMention.y= stageHeight-fontHeight*2;

        
        this.worldTopTen=new HighScorePanel(game,0,0,false,null,null,1.5,14);
        this.worldTopTen.delay=400;

        addText.call(this,screenCenterX,screenCenterY+112,'press start',null,null,true);
    game.input.keyboard.onUpCallback = function(e) {anyKeyDown=false;keyReset=true;};
    game.input.keyboard.onDownCallback = function(e) {anyKeyDown=true;};
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
    space = game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.BACKSPACE);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
       
}else if(game.state.current==="LogoScreen"){
   // if(!musics.charSelectTheme.isPlaying){musics.play('charSelectTheme');}
        game.stage.backgroundColor = LogoScreen_bkgColor;
        addBkgImg.call(this,'logoScreen',screenCenterX,screenCenterY);
        fadeOut.call(this,'IntroScreen',800,false,true);
        //addText.call(this,screenCenterX,screenCenterY+100,'press start');
        //addText.call(this,screenCenterX,stageHeight-fontHeight*2,'COMMANDO THUG © JUL 2015');
}else if(game.state.current==="LevelEnd"){
       
        game.stage.backgroundColor = LevelEnd_bkgColor;
        
                //createMap.call(this).tint = 0x00FF00;
        this.bkgPIC=game.add.image(0, 0,gameScreenShot);
        this.bkgPIC.alpha=0.3;
        addBlackBanners.call(this);

          

        currentPlayer=1;

        this.panelLeft=new HighScorePanel(game,-180,fontHeight/2,true,8,true,2.5,8);
        this.panelRight=new HighScorePanel(game,180,fontHeight/2,true,8,false,2.5,8);
        //HighScorePanel = function (game, x, y,split,lineSize,altCol,spacing,maxsize) {

        this.panelLeft.highlight1st=this.panelRight.highlight1st=false;
        this.panelLeft.delay=this.panelRight.delay=100;
        this.panelLeft.subDelay=this.panelRight.subDelay=Number.MAX_VALUE;
//x,y,str,alpha,fixed,flicker,font,tint
if(victoryMessage==='team1 wins'){addText.call(this,screenCenterX,fontHeight*1.5,victoryMessage,null,null,null,null,team1Color);}
else {addText.call(this,screenCenterX,fontHeight*1.5,victoryMessage,null,null,null,null,team2Color);}
       
        addText.call(this,screenCenterX+13,stageHeight-fontHeight*2.3,'press to continue');//

            //addText(x,y,str,alpha,fixed,flicker,font,tint,container,align,staticX)
        addText.call(this,null,stageHeight-fontHeight*3,'score P1:'+player1Score,0.5,null,null,null,null,null,null,0);
        if(gameMode!=='1 player'){addText.call(this,null,stageHeight-fontHeight*3,'score P2:'+player2Score,0.5,null,null,null,null,null,null,stageWidth-196);};

        credTextP1=addText.call(this,null,stageHeight-fontHeight*1.5,'credits P1:'+creditsP1,0.5,null,null,null,null,null,null,0);
        if(gameMode!=='1 player'){credTextP2=addText.call(this,null,stageHeight-fontHeight*1.5,'credits P2:'+creditsP2,0.5,null,null,null,null,null,null,stageWidth-196);}

        game.input.keyboard.onUpCallback = function(e) {anyKeyDown=false;};
        game.input.keyboard.onDownCallback = function(e) {anyKeyDown=true;};
       
        //addText.call(this,screenCenterX,screenCenterY+100,'press start');
        //addText.call(this,screenCenterX,stageHeight-fontHeight*2,'COMMANDO THUG © JUL 2015');
}else if(game.state.current==="GameOver"){

        game.stage.backgroundColor = GameOver_bkgColor;
        addBkgImg.call(this,'gameOverScreen',screenCenterX,screenCenterY);
        noMusic=false;
        musics.play('gameOver');

        game.input.keyboard.onUpCallback = function(e) {anyKeyDown=false;};
        game.input.keyboard.onDownCallback = function(e) {anyKeyDown=true;};
        //addText.call(this,screenCenterX,screenCenterY+100,'press start');
        //addText.call(this,screenCenterX,stageHeight-fontHeight*2,'COMMANDO THUG © JUL 2015');

}else if(game.state.current==="GameEnd"){
        game.stage.backgroundColor = GameOver_bkgColor;
        //this.textArray=['- the end -'," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","programing,"," ","graphics,"," ","music/soundFX,"," ","game design,"," ","original idea"," "," ","BY JUL©2015"," "," "," ","special thanks to oddskill"," ","for the array sorting function"];
        this.textCreditsArray=['- the end -',"programing\ngraphics\nmusic/soundFX\ngame design\noriginal idea\n\n\nBY JUL©2015","special thanks to\n\n\noddskill for the array sorting function\nhardtail for nothing in particular\nseb for the prototype method\nmom for her total support\nmy father for who he was\ndanielle and julia for their kindness\nmichel for the food\nall the relatives not mentioned above\n\n\nAnd rich for the phaser framework"];

        this.TEXT=game.add.group();

        this._TEXT=addText.call(this,screenCenterX-fontHeight*15,screenCenterY-fontHeight*10,this.textCreditsArray[0],null,null,null,null,null,this.TEXT);
        /*
        for(var i=0;i<this.textArray.length;i++){ 

            addText.call(this,screenCenterX,fontHeight*i,this.textArray[i],null,null,null,null,null,this.TEXT);

        }
        */



}else if(game.state.current==="DemoMode"){
        game.stage.backgroundColor = DemoMode_bkgColor;
        //if(!musics.charSelectTheme.isPlaying){musics.play('charSelectTheme');}
        roundDuration=demoRoundDuration;
        team1Tickets=tickets;
        team2Tickets=tickets;
        createWorld.call(this);
        addText.call(this,screenCenterX,screenCenterY+110-fontHeight*2,'DEMO MODE',null,true);
        addText.call(this,screenCenterX,screenCenterY+110,'press start',null,true,true);
        game.input.keyboard.onUpCallback = function(e) {anyKeyDown=false;};
        game.input.keyboard.onDownCallback = function(e) {anyKeyDown=true;};

}else if(game.state.current==="MainMenuScreen"){

     game.stage.backgroundColor = MainMenu_bkgColor;

    this.menu= new Menu(game);
    //initMenu(this);

    

    this.Ypos=Math.round(stageHeight/2-fontHeight*3);//
    this.menu.addSection('start game',null,this.Ypos,"startGameCallback",'whatever');
    this.menu.addSection('options',null,this.Ypos+fontHeight*2,"optionsCallback",null);   

 
         
    

}else if(game.state.current==="OptionsMenuScreen"){

    game.stage.backgroundColor = OptionsMenu_bkgColor;

    this.menu= new Menu(game);

    this.Ypos=fontHeight*2+fontHeight*2;
    this.Xpos=fontHeight*3;

    this.menu.addSection('options',fontHeight,fontHeight/2,null,'sel');
//name,X,Y,callBackFunctionName,sel
if(randomizeNbrOfPlayers===true){
 this.menu.nbrOfPlayersSection=this.menu.addSection('Number of Players:'+'random', this.Xpos, this.Ypos+fontHeight*2,'numberOfPlayersCallback','sel');
}else{ this.menu.nbrOfPlayersSection=this.menu.addSection('Number of Players:'+maxNumberOfPlayers/2+' vs '+maxNumberOfPlayers/2, this.Xpos, this.Ypos+fontHeight*2,'numberOfPlayersCallback','sel');}
   
    this.menu.addSection('Team Tickets:'+tickets, this.Xpos, this.Ypos+fontHeight*4,'teamTicketsCallback', null);
    this.menu.addSection('Round duration:'+durationToTextTime(gameRoundDuration), this.Xpos, this.Ypos+fontHeight*6,'roundDurationCallback',null);
    if (game.device.desktop){this.menu.addSection('Game mode:'+gameMode, this.Xpos, this.Ypos+fontHeight*8,'gameModeCallback',null);}//2 players VS // 2 players coop
   // this.menu.addSection('sound config:'+soundConfig, this.Xpos, this.Ypos+fontHeight*10,'setSoundCallback',null);//'music off / fx on'//'music off / fx off'

    this.menu.addSection('restore factory settings', this.Xpos, this.Ypos+fontHeight*12,'factorySettingsCallback',null);
    //this.menu.addSection('reset game', this.Xpos, this.Ypos+fontHeight*14,'resetGameCallback',null);
    this.menu.addSection('exit',null,this.Ypos+fontHeight*18,'exitCallback',null);
//1 player 2 players coop 2 players versus


}else if(game.state.current==="CharacterSelect"){
                game.stage.backgroundColor = '#000000';
                //addBkgImg.call(this,'characterSelect',screenCenterX,screenCenterY);
                   // musics.charSelectTheme.volume=MusicVolume;
                 //if(!musics.charSelectTheme.isPlaying){musics.play('charSelectTheme');}
                createMap.call(this);
                addBlackBanners.call(this);



                this.characterSelectMenu = new CharacterSelectMenu(game,currentPlayer);


    game.input.keyboard.onUpCallback = function(e) {anyKeyDown=false;keyReset=true;};
    game.input.keyboard.onDownCallback = function(e) {anyKeyDown=true;};


}else if(game.state.current==="Levels"){

                game.stage.backgroundColor = Levels_bkgColor;
                roundDuration=gameRoundDuration;
                //team1Tickets=10+Math.round(Math.random()*10);
                //team2Tickets=10+Math.round(Math.random()*10);
               
                team1Tickets=tickets;
                team2Tickets=tickets;
                createWorld.call(this);



}else if(game.state.current==="CopyrightScreen"){
                game.stage.backgroundColor = CopyRight_bkgColor;
                addText.call(this,screenCenterX,fontHeight*1,"",null,null,null,'gameFont1Polychrom');
                this.CRTXT=addText.call(this,null,fontHeight*2,"",null,null,null,'gameFont1Polychrom');

        }


}

function addBlackBanners(){
this.bmd = game.add.bitmapData(stageWidth, 80);
this.bmd.ctx.beginPath();
this.bmd.ctx.rect(0, 0, stageWidth, 64);
this.bmd.ctx.fillStyle = '#000000';
this.bmd.ctx.fill();
game.add.sprite(0, 0, this.bmd);

this.bmd = game.add.bitmapData(stageWidth, 64);
this.bmd.ctx.beginPath();
this.bmd.ctx.rect(0, 0, stageWidth, 64);
this.bmd.ctx.fillStyle = '#000000';
this.bmd.ctx.fill();
game.add.sprite(0, stageHeight-64, this.bmd);
}
Game.Boot = function (game) { };

Game.Boot.prototype = {
    
    preload: function () {
    game.load.image('loadingBar', assetPath+'img_ProgressBar.png');
    game.load.image('loadingFrame', assetPath+'img_ProgressFrame.png');
    document.body.style.backgroundColor = "#000000";
    document.body.style.margin=0; 
        

    },
    
    create: function () {

    game.stage.backgroundColor = Boot_bkgColor;
    //game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.input.maxPointers = 1;
    //this.stage.disableVisibilityChange = true;
    //this.scale.setMinMax(stageWidth, stageHeight, stageWidth*10, stageHeight*10);
        


    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.setScreenSize(true);
    //game.scale.refresh();

    //game.input.keyboard.destroy();
 game.state.start('Load');

    }


};






Game.Load = function (game) { };

Game.Load.prototype = {
  preload: function () {
    game.stage.backgroundColor = Load_bkgColor;
  this.loadingFrame = game.add.sprite(screenCenterX-304,screenCenterY-64, 'loadingFrame');
  this.loadingBar = game.add.sprite(screenCenterX-304, screenCenterY-64, 'loadingBar');
  game.load.setPreloadSprite(this.loadingBar);

    game.load.spritesheet('SoldierTeam1',assetPath+'img_SoldierTeam1.png', 36*Scale, 36*Scale);
    game.load.spritesheet('SoldierTeam2',assetPath+'img_SoldierTeam2.png', 36*Scale, 36*Scale);
    game.load.spritesheet('SoldierTeam1Human',assetPath+'img_SoldierTeam1Human.png', 36*Scale, 36*Scale);
    game.load.spritesheet('SoldierTeam2Human',assetPath+'img_SoldierTeam2Human.png', 36*Scale, 36*Scale);
    game.load.spritesheet('SoldierTeam1HumanAlt',assetPath+'img_SoldierTeam1HumanAlt.png', 36*Scale, 36*Scale);


    game.load.spritesheet('projectiles',assetPath+'img_Projectiles.png', 24*Scale, 8*Scale);
    game.load.spritesheet('explosions',assetPath+'img_Explosions.png', 32*Scale, 32*Scale);
    game.load.spritesheet('impactEffects',assetPath+'img_ImpactEffects.png', 16*Scale, 16*Scale);
    game.load.spritesheet('items',assetPath+'img_Items.png',24*Scale, 16*Scale);
    game.load.spritesheet('loadAnim',assetPath+'img_LoadAnim.png',32*Scale, 8*Scale);


    game.load.image('introScreen', assetPath+"img_IntroScreen.png");
    game.load.image('logoScreen', assetPath+"img_LogoScreen.png");
    game.load.image('gameOverScreen', assetPath+"img_GameOverScreen.png");
    game.load.image('catHead', assetPath+'img_CatHead.png');
    
    game.load.image('triangleBig', assetPath+'img_TriangleBig.png');
    game.load.spritesheet('IDCard', assetPath+'img_IDCard.png',128*Scale,64*Scale);
    game.load.spritesheet('portraits',assetPath+'img_Portraits.png', 35*Scale, 64*Scale);

    for(var i=0;i<=totalNbrOfLevels;i++){game.load.tilemap('level'+i, assetPath+'map_Level'+i+'.json', null, Phaser.Tilemap.TILED_JSON);}

    game.load.image('tileSet1', assetPath+'img_TileSet1.png');
    game.load.image('gameFont1', assetPath+'img_GameFont1.png');
    game.load.image('gameFont1Sans', assetPath+'img_GameFont1Sans.png');
    game.load.image('gameFont1SansBIG', assetPath+'img_GameFont1SansBIG.png');
    game.load.image('gameFont2', assetPath+'img_GameFont2.png');
    game.load.image('gameFont1Polychrom', assetPath+'img_GameFont1Polychrom.png');   
    
    game.load.image('playerRepAlt', assetPath+'img_RepAlt.png');  
    game.load.image('playerRepTeam1', assetPath+'img_RepTeam1.png'); 
    game.load.image('playerRepTeam2', assetPath+'img_RepTeam2.png'); 
 
    game.load.image('triangle', assetPath+'img_Triangle.png');


//sprite sound
/*
    game.load.audio('sfx', 'sfx.ogg'); 
    sounds = game.add.audio('sfx',Volume);
    sounds.allowMultiple = true;

    //  And this defines the markers.

    //  They consist of a key (for replaying), the time the sound starts and the duration, both given in seconds.
    //  You can also set the volume and loop state, although we don't use them in this example (see the docs)

    sounds.addMarker('mainTheme', 0, 31.0);
    sounds.addMarker('sniper2', 33.4, 0.4);
    sounds.addMarker('sniper', 33.8, 0.6);
    sounds.addMarker('blip', 34.4, 0.1);
    sounds.addMarker('explosion', 34.9, 0.4);
    sounds.addMarker('flame', 35.3, 0.3);
    sounds.addMarker('grabItem', 35.7, 0.5);
    sounds.addMarker('grenade', 36.2, 0.3);
    sounds.addMarker('hurt', 36.6, 0.2);
    sounds.addMarker('initSound', 36.9, 0.9);
    sounds.addMarker('lazer', 37.8, 0.3);
    sounds.addMarker('machineGun', 38.1, 0.2);
    sounds.addMarker('radioChatter', 38.4, 0.4);
    sounds.addMarker('reload', 38.8, 0.4);
    sounds.addMarker('rocket', 39.9, 1.2);
    sounds.addMarker('select', 41.3, 0.5);
    sounds.addMarker('shotGun', 41.8, 0.5);

    //sounds.play(button.name);
*/

    game.load.audio('initSound',        [assetPath+'snd_initSound.mp3',  assetPath+'snd_initSound.ogg']);
    game.load.audio('supersound',       [assetPath+'snd_Supersound.mp3', assetPath+'snd_Supersound.ogg']);
    game.load.audio('grabItem',         [assetPath+'snd_GrabItem.mp3',   assetPath+'snd_GrabItem.ogg']);
    game.load.audio('machineGun',       [assetPath+'snd_MachineGun.mp3', assetPath+'snd_MachineGun.ogg']);
    game.load.audio('grenade',          [assetPath+'snd_Grenade.mp3',    assetPath+'snd_Grenade.ogg']);
    game.load.audio('shotGun',          [assetPath+'snd_ShotGun.mp3',  assetPath+'snd_ShotGun.ogg']);
    game.load.audio('flame',            [assetPath+'snd_Flame.mp3',  assetPath+'snd_Flame.ogg']);
    game.load.audio('lazer',            [assetPath+'snd_Lazer.mp3',  assetPath+'snd_Lazer.ogg']);
    game.load.audio('sniper',           [assetPath+'snd_50Bmg.mp3',  assetPath+'snd_50Bmg.ogg']);
    game.load.audio('sniper2',          [assetPath+'snd_Socom2.mp3',  assetPath+'snd_Socom2.ogg']);
    game.load.audio('rocket',           [assetPath+'snd_Rocket.mp3',  assetPath+'snd_Rocket.ogg']);
    game.load.audio('explosion',        [assetPath+'snd_Explosion.mp3',  assetPath+'snd_Explosion.ogg']);
    game.load.audio('cling',            [assetPath+'snd_Cling.mp3',  assetPath+'snd_Cling.ogg']);
    game.load.audio('hurt',             [assetPath+'snd_Hurt.mp3',  assetPath+'snd_Hurt.ogg']);
    game.load.audio('reload',           [assetPath+'snd_Reload.mp3',  assetPath+'snd_Reload.ogg']);
    game.load.audio('airstrikeCall',    [assetPath+'snd_airstrikeCall.mp3',  assetPath+'snd_airstrikeCall.ogg']);
    game.load.audio('radioChatter',     [assetPath+'snd_RadioChatter.mp3',  assetPath+'snd_RadioChatter.ogg']);
    game.load.audio('blip',             [assetPath+'snd_Blip.mp3',  assetPath+'snd_Blip.ogg']);
    game.load.audio('select',           [assetPath+'snd_Select.mp3',  assetPath+'snd_Select.ogg']);
    game.load.audio('gameOver',         [assetPath+'snd_GameOver.mp3',  assetPath+'snd_GameOver.ogg']);
    game.load.audio('select',           [assetPath+'snd_Select.mp3',  assetPath+'snd_Select.ogg']);
    game.load.audio('gameOver',         [assetPath+'snd_GameOver.mp3',  assetPath+'snd_GameOver.ogg']);


//    game.load.audio('charSelectTheme',  [assetPath+'snd_CharSelectTheme.mp3',  assetPath+'snd_CharSelectTheme.ogg']);
//    game.load.audio('mainTheme',        [assetPath+'snd_CMDTMainTheme.mp3',  assetPath+'snd_CMDTMainTheme.ogg']);   


    },

    create: function () {

    sounds.initSound  = game.add.audio('initSound',Volume);sounds.initSound.allowMultiple=false;
    sounds.supersound  = game.add.audio('supersound',Volume);sounds.supersound.allowMultiple=false;
    sounds.grabItem  = game.add.audio('grabItem',Volume);sounds.grabItem.allowMultiple=false;
    sounds.machineGun  = game.add.audio('machineGun',Volume);sounds.machineGun.allowMultiple=false;
    sounds.grenade  = game.add.audio('grenade',Volume);sounds.grenade.allowMultiple=false;
    sounds.shotGun  = game.add.audio('shotGun',Volume);sounds.shotGun.allowMultiple=false;
    sounds.flame  = game.add.audio('flame',Volume);sounds.flame.allowMultiple=false;
    sounds.lazer  = game.add.audio('lazer',Volume);sounds.lazer.allowMultiple=false;
    sounds.sniper  = game.add.audio('sniper',Volume);sounds.sniper.allowMultiple=false;
    sounds.sniper2  = game.add.audio('sniper2',Volume);sounds.sniper2.allowMultiple=false;
    sounds.rocket  = game.add.audio('rocket',Volume);sounds.rocket.allowMultiple=false;
    sounds.explosion  = game.add.audio('explosion',Volume);sounds.explosion.allowMultiple=false;
    sounds.cling  = game.add.audio('cling',Volume);sounds.cling.allowMultiple=false;
    sounds.hurt  = game.add.audio('hurt',Volume);sounds.hurt.allowMultiple=false;
    sounds.reload  = game.add.audio('reload',Volume);sounds.reload.allowMultiple=false;
    sounds.airstrikeCall  = game.add.audio('airstrikeCall',Volume);sounds.airstrikeCall.allowMultiple=false;
    sounds.radioChatter  = game.add.audio('radioChatter',Volume);sounds.radioChatter.allowMultiple=false;
    sounds.blip  = game.add.audio('blip',Volume);sounds.blip.allowMultiple=false;
    sounds.select  = game.add.audio('select',Volume);sounds.select.allowMultiple=false;
    musics.gameOver  = game.add.audio('gameOver',MusicVolume); musics.gameOver.allowMultiple=false;
    //musics.charSelectTheme  = game.add.audio('charSelectTheme',MusicVolume,true); musics.charSelectTheme.allowMultiple=false;
    //musics.mainTheme  = game.add.audio('mainTheme',MusicVolume,true); musics.mainTheme.allowMultiple=false;

    game.state.start(startState);
    },

    update: function () {

    }


};










function addBkgImg(assetName,x,y){
    this.bkg = game.add.image(x, y, assetName);
    this.bkg.x=x-this.bkg.width*0.5;
    this.bkg.y=y-this.bkg.height*0.5;

}
var flickerInterval=0;
function addText(x,y,str,alpha,fixed,flicker,font,tint,container,align,staticX){
    this.txt = game.add.retroFont(font || 'gameFont1Sans', fontHeight, fontHeight, fontString, fontStringLength, 0, 0);
    this.txt.multiLine=true;
    if(align){this.txt.align=align}
    this.txt.text =str;
    this.txt_Img = game.add.image(0,0, this.txt);

    if(staticX){this.txt_Img.x=staticX;} else if(x){this.txt_Img.x=x-Math.round((str.length*fontHeight)*0.5)}//sorry bout that
    if(y){this.txt_Img.y=y}
    if(alpha){this.txt_Img.alpha=alpha};
    if(fixed){this.txt_Img.fixedToCamera=true;}
    if(flicker){this.txt_Img.update= function () { if (game.time.time> flickerInterval) {this.visible=!this.visible;flickerInterval=game.time.time+200;} };}
    if(tint){this.txt_Img.tint=tint};
    if(container){container.add(this.txt_Img);}
    return this.txt;
    
}

var fadeLock=false;
        function fadeOut(newState,time,blackOut,force) {
      if(!fadeLock){ 
        this.fadeIMG = game.add.graphics(0, 0);
        this.fadeIMG.fixedToCamera=true; 
        this.fadeIMG.beginFill(0x000000, 1);
        this.fadeIMG.drawRect(0, 0,stageWidth, stageHeight);
        this.fadeIMG.endFill();
        if(!blackOut){this.fadeIMG.alpha = 0;}else if(force){game.sound.stopAll();}

        this.tween = game.add.tween(this.fadeIMG);
        this.tween.to({ alpha: 1 }, time, Phaser.Easing.Linear.None);

        this.tween.onComplete.add(fadeOutComplete,{nextState: newState,force:force});

        this.tween.start();
        } 
        fadeLock=true;
        };


        function fadeInComplete() {
        fadeLock=false;
        };

        function fadeOutComplete() {
            if(this.force){game.sound.stopAll()};
            if(this.nextState==='reset'){game.state.restart();}
            else {game.state.start(this.nextState);} 
            fadeLock=false;  
            //fadeIMG.destroy();   
        };

Game.InitScreen = function (game) { };
Game.InitScreen.prototype = {

    create: function () {
    initState.call(this);
    this.counter=0;
    this.colArray=['#000000','#000000','#000000','#000000','#000000','#000000','#000000','#000000','#00ffff','#000000','#00ffff','#000000','#00ffff','#000000','#00ffff','#000000'];
    },

    update: function () {
    
    if(this.counter<this.colArray.length){this.counter+=0.3;game.stage.backgroundColor = this.colArray[Math.floor(this.counter)];}else if(!fadeLock){fadeOut.call(this,'CopyrightScreen',100,true,true);}
    
    
    
    }
};


Game.CopyrightScreen = function (game) { };
Game.CopyrightScreen.prototype = {

    create: function () {
    
    initState.call(this);
    this.txtInd=0;
    },

    update: function () {
 
    //this.flickeringTXT.visible=!this.flickeringTXT.visible;
        //if(game.input.activePointer.isDown || anyKeyDown){if(!fadeLock){fadeOut.call(this,'IntroScreen',800,false,true);}}
    
    if(game.input.activePointer.isDown || anyKeyDown){this.CRTXT.text=copyrightNotice;if(!fadeLock){fadeOut.call(this,'LogoScreen',800,false,true);}}
    else if(this.CRTXT.text.length<copyrightNotice.length){this.CRTXT.text+=copyrightNotice.charAt(this.txtInd);this.txtInd+=1;}
    else if(!fadeLock && game.time.time>this.timeStamp+8000){fadeOut.call(this,'LogoScreen',800,false,true);}
   

    
    }
};




Game.LogoScreen = function (game) { };
Game.LogoScreen.prototype = {

    create: function () {
    
    initState.call(this);
    },

    update: function () {
    
    }
};

/*
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
*/



Game.IntroScreen = function (game) { };
Game.IntroScreen.prototype = {

    create: function () {
    
    //game.input.onDown.add(gofull, this);
    initState.call(this);

    },

    update: function () {
     
        if((game.input.activePointer.isDown || anyKeyDown) && game.time.time> this.timeStamp+inputBlockDelay){

            if(!fadeLock){
                resetStats();

                //if(game.device.desktop){fadeOut.call(this,'MainMenuScreen',10,true,false);}else{fadeOut.call(this,'CharacterSelect',10,true,false);}
                fadeOut.call(this,'MainMenuScreen',30,true,false);
                //sounds.play('supersound');
                
                
            }

            }else if(game.time.time>this.timeStamp+demoModeDelay){if(!fadeLock){fadeOut.call(this,'DemoMode',800,false,true);}}
        }
   
 
};

//

Game.MainMenuScreen = function (game) { };

Game.MainMenuScreen.prototype = {
    
    
    create: function () {

    initState.call(this);

    },

    update: function () {

    }


};

Game.OptionsMenuScreen = function (game) { };

Game.OptionsMenuScreen.prototype = {
    
    
    create: function () {

    initState.call(this);

    },

    update: function () {

    }


};


Game.CharacterSelect = function (game) { };

Game.CharacterSelect.prototype = {
    
    
    create: function () {

    initState.call(this);

    },

    update: function () {

    }


};
var combatSkillsArray=[135, 142, 160, 135, 100, 125, 130,125];
//this.gunArray=['machineGun','shotGun','grenade','sniper2','flame','rocket','sniper','lazer'];
CharacterSelectMenu = function (game) {
           // musics.charSelectTheme.volume=MusicVolume;
           // if(!musics.charSelectTheme.isPlaying){musics.play('charSelectTheme');}
            Phaser.Group.call(this, game);
            
            //this.gunArray=['machineGun','shotGun','grenade','flame','lazer'];
            this.gunArray=['machineGun','shotGun','grenade','sniper2','flame','rocket','sniper','lazer'];
            this.classArray=['assault','support','heavy-assault','recon','spec-ops','anti-tank','heavy-sniper','engineer'];
            this.ratesArray=['750','450','250','550','max','450','350','650'];
            this.rangesArray=['medium','medium','low','high','low','medium','high','max'];

            
            this.weaponDescription=[];
            this.weaponDescription[0]='5.56 mm\nassault rifle';
            this.weaponDescription[1]='12-gauge\nshotgun';
            //this.weaponDescription[2]='XM25 CDTE 25mm\ngrenade launcher';
            this.weaponDescription[2]='25 mm\ngrenade launcher';
            
            this.weaponDescription[3]='7.62 mm\nBattle Rifle';
            this.weaponDescription[4]='diesel\nflamethrower';
            this.weaponDescription[5]='66 mm\nrocket launcher';
            this.weaponDescription[6]='.50 bmg\nsniper rifle';
            this.weaponDescription[7]='40 watt\nplasma rifle';


            //this.weaponDescription[4]='Beowulf SBR .50\nSniper Rifle';
            
            keyReset = true;

     

                    this.menu= new Menu(game);
                    var tempstr='';
                    if(randomizeMaps){tempstr='zone '+randomMapArray[currentLevel];}else{tempstr='zone '+currentLevel};
                    
                    this.menu.addSection(tempstr,stageWidth-tempstr.length*fontHeight, 0,null,null,0.3);
                    //var strrrr=
                    this.menu.addSection(window['player'+currentPlayer+'Nick'],stageWidth/2-(window['player'+currentPlayer+'Nick'].length/2*fontHeight), fontHeight*2,"characterSelectionCallback",'selection');
                    this.menu.currentSel=undefined;
                    this.menu.addSection('options',stageWidth/2-('options'.length/2*fontHeight), stageHeight-fontHeight*3,"optionsCallback",null);


            this.IDindex=this.gunArray.indexOf(window['player'+currentPlayer+'Gun']);
            this.indexLength= this.gunArray.length;
         
for (var i=0;i<this.indexLength;i++){

            this['idCardGroup'+i]=game.add.group();
            this.add(this['idCardGroup'+i]);
            this.profileCardBkg = game.add.sprite(Math.round(stageWidth/2)-256,Math.round(stageHeight/5)-Scale*2,'IDCard');
            this.profileCardBkg.animations.add('validTeam1',[0,1,0,1,0], 18, false);
            this.profileCardBkg.animations.add('validTeam2',[0,2,0,2,0], 18, false);
            this.profileCardBkg.inputEnabled = true;

            this.profileCardBkg.events.onInputDown.add(this.startGame,{owner:this.profileCardBkg,state:'Levels',snd:'select',parent:this});
            this.profileCardBkg.events.onInputOver.add(this.over,{owner:this.profileCardBkg,menu:this.menu});
            
            this.profileCardBkg.anchor.setTo(0, 0);

            //this.profileCardBkg.alpha=0.5;
            this['idCardGroup'+i].add(this.profileCardBkg);
            this.portrait = game.add.sprite(this.profileCardBkg.x+20*fontHeight,this.profileCardBkg.y,'portraits');
            this.portrait.anchor.setTo(0, 0);
            this.portrait.frame= i;
            setWeapon(this.portrait,this.gunArray[i]);//
            if(i!==this.IDindex){this['idCardGroup'+i].visible=false;};

            this.IDText = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, 46, 0, 0);
            this.IDText.multiLine=true;

            this.IDNbr = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, 46, 0, 0);
            this.IDNbr.text = ''+(1+i);
            this.IDNbrIMG = game.add.image(this.profileCardBkg.x+this.profileCardBkg.width-fontHeight*2,  this.profileCardBkg.y+fontHeight, this.IDNbr);
            this.IDNbrIMG.visible=false; 
            
            

            //for(var c=0;c<this.portrait.firingRate.length;c++){this.res+=this.portrait.firingRate[c]};
            //this.res=Math.round(1.58*(this.res/this.portrait.firingRate.length)*10)*60+' rpm';
            this.res=this.ratesArray[i];
    
            this.blastDamage=45;
            if(this.portrait.projExplode===false){ this.blastDamage=0;}
            this.IDText.customSpacingY=8;
            this.IDText.text =this.classArray[i]+'\n\n'+' damage : '+(this.portrait.projDamage+parseInt(this.blastDamage))+'\n'+' ammo   : '+this.portrait.ammoClip+'x'+this.portrait.ammoClipNbr+'\n'+' range  : '+this.rangesArray[i]+'\n'+' rate   : '+this.res+'\n\n'+this.weaponDescription[i];
            this.IDTextIMG = game.add.image(this.profileCardBkg.x+2*fontHeight,  this.portrait.y+Math.round(1.5*fontHeight), this.IDText); 
            
            this['idCardGroup'+i].add(this.IDTextIMG);
            this['idCardGroup'+i].add(this.portrait);
            this['idCardGroup'+i].add(this.IDNbrIMG);
            this.menu.currentSel=this['idCardGroup'+this.IDindex];
            
            

            



}


            this.arrowLeft = game.add.sprite(35,Math.round(stageHeight/2)-Scale*2,'triangleBig');
            this.arrowLeft.anchor.setTo(0.5, 0.5);
            this.arrowLeft.alpha=0.5;
            this.arrowLeft.inputEnabled = true;
            this.arrowLeft.events.onInputDown.add(this.listenerArrows, this,this.arrowLeft);
            this.arrowLeft.events.onInputOver.add(this.over, {owner:this.arrowLeft,menu:this.menu});
            this.arrowLeft.events.onInputOut.add(this.out, {owner:this.arrowLeft,menu:this.menu});
            this.add(this.arrowLeft);


            this.arrowRight = game.add.sprite(stageWidth-35,Math.round(stageHeight/2)-Scale*2,'triangleBig');
            this.arrowRight.anchor.setTo(0.5, 0.5);
            this.arrowRight.alpha=0.5;
            this.arrowRight.scale.x=-1;
            this.arrowRight.inputEnabled = true;
            this.arrowRight.events.onInputDown.add(this.listenerArrows, this,this.arrowRight);
            this.arrowRight.events.onInputOver.add(this.over, {owner:this.arrowRight,menu:this.menu});
            this.arrowRight.events.onInputOut.add(this.out, {owner:this.arrowRight,menu:this.menu});

            this.add(this.arrowRight); 

            this.inTransition=false;


            
            
           //this.tween(this['idCardGroup'+this.IDindex],stageWidth);

            

           
            
          
            

}

CharacterSelectMenu.prototype = Object.create(Phaser.Group.prototype);
CharacterSelectMenu.prototype.constructor = CharacterSelectMenu;
CharacterSelectMenu.prototype.update = function() {

        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)===true){this.listenerArrows(this.arrowLeft);}
        else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)===true){this.listenerArrows(this.arrowRight);}
  
        //if(!fadeLock){this.cursorPosition();}
};


CharacterSelectMenu.prototype.listenerArrows = function(owner) {
//alert(this['idCardGroup'+this.IDindex]);
//for(var i=0;i<this.indexLength;i++){ this['idCardGroup'+i].y=-stageHeight};
if(this.inTransition===false && fadeLock===false){
    var curInd=0;
if(owner===this.arrowLeft){
this.arrowLeft.alpha=1;
this.inTransition=true;
if(this.IDindex<=0){this.IDindex=this.indexLength-1;curInd=0;}else{this.IDindex-=1;curInd=this.IDindex+1;}
this.tween(this['idCardGroup'+this.IDindex],this['idCardGroup'+curInd],stageWidth,this.IDindex);

}else{
this.arrowRight.alpha=1;
this.inTransition=true;
if(this.IDindex>=this.indexLength-1){this.IDindex=0;curInd=this.indexLength-1}else{this.IDindex+=1;curInd=this.IDindex-1;}
this.tween(this['idCardGroup'+this.IDindex],this['idCardGroup'+curInd],-stageWidth,this.IDindex);

}


//sounds.play('blip');
owner.parent.menu.resetPosition(); 
}
//sounds.play('blip');
window['player'+currentPlayer+'Gun']=this.gunArray[this.IDindex];

this.menu.currentSel=this['idCardGroup'+this.IDindex];
//alert(this.menu.currentSel.parent.profileCardBkg);

/*
if(this.IDindex>=this.indexLength-1){this.tween(this['idCardGroup'+this.IDindex],this['idCardGroup'+0],stageWidth);this.IDindex=0;}
else if(this.IDindex<=0){this.tween(this['idCardGroup'+this.IDindex],this['idCardGroup'+this.indexLength-1],stageWidth);this.IDindex+=1;}
else{this.tween(this['idCardGroup'+this.IDindex],this['idCardGroup'+(this.IDindex-1)],stageWidth);this.IDindex+=1;}
*/
}
CharacterSelectMenu.prototype.startGame = function() {
     this.parent.menu.resetPosition(); 
if(this.owner.visible===true && this.parent.inTransition===false){
if(currentPlayer===1 && gameMode==='1 player'){
    this.owner.play('validTeam1');

    this.parent.switchState(this.state,'select');
}else
if(currentPlayer===1){
    currentPlayer=2;
    this.owner.play('validTeam1');
    this.parent.switchState('reset','select');
}else
if(currentPlayer===2){
    if(gameMode==='2 players versus'){this.owner.play('validTeam2');}else{this.owner.play('validTeam1');}
    this.parent.switchState(this.state,'select');
}
}
 

//

};
CharacterSelectMenu.prototype.over = function() {this.owner.alpha=1;this.menu.resetPosition();};
CharacterSelectMenu.prototype.out = function() {this.owner.alpha=0.5;};



CharacterSelectMenu.prototype.optionsMenu = function(owner) {
owner.alpha=1;
this.switchState('OptionsMenuScreen','select');
}
CharacterSelectMenu.prototype.switchState = function(state,snd) {
    if(!fadeLock){if(snd){sounds.play(snd)};fadeOut.call(this,state,700);}   
//alert(state);
}



CharacterSelectMenu.prototype.tween = function(neighbor,obj,position,index) {

obj.y=0;
neighbor.y=0;
obj.x=0;
neighbor.x=-position;
neighbor.visible=true;
    /*
    if(position>=0){
        if(index<=0){neighbor=this['idCardGroup'+this.indexLength];}
        else if(index>=this.indexLength){neighbor=this['idCardGroup'+0];}
        else{neighbor=this['idCardGroup'+(index-1)];}
        neighbor.x=-position;
        
    }
    else{
        if(index<=0){neighbor=this['idCardGroup'+this.indexLength];}
        else if(index>=this.indexLength){neighbor=this['idCardGroup'+0];}
        else{neighbor=this['idCardGroup'+(index+1)];}
        neighbor.x=Math.abs(position);
    }   
            
      */      
            this.currentTween=game.add.tween(obj).to({x:position}, 350, Phaser.Easing.Cubic.InOut, true, 0, 0, false);
            this.currentTween.onComplete.add(function() {game.tweens.remove(this.currentTween);obj.visible=false;this.arrowLeft.alpha=this.arrowRight.alpha=0.5;this.inTransition=false;}, this);

            this.currentTween2=game.add.tween(neighbor).to({x:0}, 350, Phaser.Easing.Cubic.InOut, true, 0, 0, false);
            this.currentTween2.onComplete.add(function() {game.tweens.remove(this.currentTween2);this.inTransition=false;}, this);

         
};

Menu = function (game) {
            Phaser.Group.call(this, game);
            keyReset = true;
            this.lastMouseX=game.input.worldX;
            this.lastMouseY=game.input.worldY;
       
            this.currentSection=null;
            
            this.pointerReset = true;
           
            this.sectionsIndex_Mouse=0;
            this.sectionsIndex_Keyboard=0;
            this.Input="m";
            

            this.sectionsArray_Mouse=new Array( Math.round(stageHeight/fontHeight) );
            this.sectionsArray_Keyboard=new Array();
 
            this.selector = game.add.sprite(0,0,'triangle');
            this.selector.anchor.setTo(1.5, 0.2);
            this.add(this.selector); 

            this.currentSel=undefined;

}

Menu.prototype = Object.create(Phaser.Group.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.resetPosition = function() {
    this.Input="k";
    this.sectionsIndex_Mouse=2;
    this.sectionsIndex_Keyboard=0;
    this.currentSection.alpha=0.5;

    this.currentSection=this.sectionsArray_Mouse[2];
    this.currentSection.alpha=1;
    if(this.selector.y!=this.currentSection.y){sounds.play('blip');}
    this.selector.x=this.currentSection.x;
    this.selector.y=this.currentSection.y;
    //this.pointerReset=true;
    //keyReset=true;
    //if(this.pointerReset){this.pointerReset=false;this[this.currentSection.callBack](this.currentSection);}
}

Menu.prototype.update = function() {

        if(!fadeLock){this.cursorPosition();}
};

Menu.prototype.characterSelectionCallback = function() {
//this.parent.currentSel['profileCardBkg'].play('validTeam1');

//alert(this.currentSel.profileCardBkg);
if(this.currentSel.children[0].visible===true && this.currentSel.parent.inTransition===false){
if(currentPlayer===1 && gameMode==='1 player'){
    this.currentSel.children[0].play('validTeam1');

    this.currentSel.parent.switchState('Levels','select');
}else
if(currentPlayer===1){
    currentPlayer=2;
    this.currentSel.children[0].play('validTeam1');
    this.currentSel.parent.switchState('reset','select');
}else
if(currentPlayer===2){
    if(gameMode==='2 players versus'){this.currentSel.children[0].play('validTeam2');}else{this.currentSel.children[0].play('validTeam1');}
    this.currentSel.parent.switchState('Levels','select');
}
}
//if(gameMode==='2 players versus'){this.currentSel.children[0].play('validTeam2');}else{this.currentSel.children[0].play('validTeam1');}

}
Menu.prototype.cursorPosition = function() {

            if (cursors.up.isDown && keyReset){
                keyReset=false;
                this.Input="k"; 
                if(this.sectionsArray_Keyboard[Math.round(this.sectionsIndex_Keyboard-1)]!=null){
                this.sectionsIndex_Keyboard-=1;
                this.currentSection.alpha=0.5;
                this.currentSection=this.sectionsArray_Keyboard[Math.round(this.sectionsIndex_Keyboard)];
                this.currentSection.alpha=1;
                if(this.selector.y!=this.currentSection.y){sounds.play('blip');}
                this.selector.x=this.currentSection.x;
                this.selector.y=this.currentSection.y;
                } 
            }
            else
            if(cursors.down.isDown && keyReset){
                keyReset=false;
                this.Input="k"; 
                if(this.sectionsArray_Keyboard[Math.round(this.sectionsIndex_Keyboard+1)]!=null){
                this.sectionsIndex_Keyboard+=1;
                this.currentSection.alpha=0.5;
                this.currentSection=this.sectionsArray_Keyboard[Math.round(this.sectionsIndex_Keyboard)];
                this.currentSection.alpha=1;
                if(this.selector.y!=this.currentSection.y){sounds.play('blip');}
                this.selector.x=this.currentSection.x;
                this.selector.y=this.currentSection.y;
                } 
            }
            else
            if ( game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.isDown(Phaser.Keyboard.ENTER) ) {
                if(keyReset){
                keyReset=false;
                this.Input="k"; 
                //startFade=true;
                //sounds.play('select');
                this[this.currentSection.callBack](this.currentSection);
                }
            }

            if(this.lastMouseX!=game.input.worldX){this.lastMouseX=game.input.worldX;this.Input="m"}
            if(this.lastMouseY!=game.input.worldY){this.lastMouseY=game.input.worldY;this.Input="m"}

            if(this.Input=="m"){
                this.sectionsIndex_Mouse=Math.round((game.input.worldY-fontHeight/2)/fontHeight);
                if(this.sectionsArray_Mouse[this.sectionsIndex_Mouse]!=null){       
                    this.currentSection.alpha=0.5;
                    this.currentSection=this.sectionsArray_Mouse[this.sectionsIndex_Mouse];
                    this.currentSection.alpha=1;
                    this.sectionsIndex_Keyboard=this.currentSection.sectionsIndex_Keyboard;
                    if(this.selector.y!=this.currentSection.y){sounds.play('blip');}
                    this.selector.x=this.currentSection.x;
                    this.selector.y=this.currentSection.y;
                    if ( game.input.activePointer.isDown){ if(this.pointerReset){this.pointerReset=false;this[this.currentSection.callBack](this.currentSection);}}else{this.pointerReset=true;}
                }
            }
   
            //;

        };





Menu.prototype.addSection = function (name,X,Y,callBackFunctionName,sel,alpha) {


            this.sectionText = game.add.retroFont('gameFont1Sans', fontHeight, fontHeight, fontString, 46, 0, 0);
            this.sectionText.text = name;

            this.section = game.add.image(0, 0, this.sectionText);
            this.section.textField=this.sectionText;

            if(X==null){this.section.x=parseInt(stageWidth/2) - parseInt( ((this.sectionText.text.length)*fontHeight)/2 );}
            else{this.section.x=X};
            if(Y==null){this.section.y=parseInt(stageHeight/2)-parseInt(fontHeight/2);}
            else{this.section.y=Y};
    
            if(callBackFunctionName!=null){
            this.section.callBack=callBackFunctionName;
            this.sectionsArray_Mouse[parseInt(Y/fontHeight)]=this.section;
            this.sectionsArray_Keyboard.push(this.section);
            this.section.sectionsIndex_Keyboard=this.sectionsArray_Keyboard.length-1;
            this.section.alpha=0.5;
            if(sel!=null){this.selector.y=this.section.y;this.selector.x=this.section.x;this.currentSection=this.section;this.section.alpha=1;}
            }
            
            this.add(this.section);
            if(alpha){this.section.alpha=alpha}
            return this.sectionText;
            
        };



Menu.prototype.switchState = function (state,snd) {
            //if(!fadeLock){if(snd){sounds.play(snd)};fadeOut.call(this,state,250);} 
            if(!fadeLock){if(snd){sounds.play(snd)};fadeOut.call(this,state,250);}        
        };


Menu.prototype.startGameCallback = function (section) {

            //this.switchState(saved.currentLevel,'select');
            this.switchState('CharacterSelect','select');
     
        };
Menu.prototype.startGameCallback1P = function (section) {
             gameMode='1 player';
             currentPlayer=1;
            //this.switchState(saved.currentLevel,'select');
            this.switchState('CharacterSelect','select');
     
        };
Menu.prototype.startGameCallback2P = function (section) {
            gameMode='2 players coop'; 
            if(maxNumberOfPlayers===2){maxNumberOfPlayers=4;};
            //this.switchState(saved.currentLevel,'select');
            this.switchState('CharacterSelect','select');
     
        };

Menu.prototype.optionsCallback = function (section) {
        previousState=game.state.current;
           this.switchState('OptionsMenuScreen','select');
     
        };

Menu.prototype.numberOfPlayersCallback = function (section) {
       
 if(randomizeNbrOfPlayers===true){maxNumberOfPlayers=0;};
        switch(maxNumberOfPlayers){
            case 0:randomizeNbrOfPlayers=false;if(gameMode==='2 players coop'){maxNumberOfPlayers=4;}else{maxNumberOfPlayers=2;};break;
            case 2:maxNumberOfPlayers=4;break;
            case 4:maxNumberOfPlayers=6;break;
            case 6:maxNumberOfPlayers=8;break;
            case 8:maxNumberOfPlayers=10;break;
            case 10:maxNumberOfPlayers=12;break;
            case 12:maxNumberOfPlayers=14;break;
            case 14:maxNumberOfPlayers=16;break;
            case 16:maxNumberOfPlayers=0;randomizeNbrOfPlayers=true;break;
        }



 if(randomizeNbrOfPlayers===true){section.textField.text='Number of Players:'+'random';}else{section.textField.text='Number of Players:'+maxNumberOfPlayers/2+' vs '+maxNumberOfPlayers/2;}


            
        };

Menu.prototype.teamTicketsCallback = function (section) {
         switch(tickets){
            case 64:tickets=0;break;
            default:tickets+=4;break;
           
        }
            team1Tickets=tickets;
            team2Tickets=tickets;
            section.textField.text='Team Tickets:'+tickets;
        };

Menu.prototype.roundDurationCallback = function (section) {

         switch(gameRoundDuration){
            case 420:gameRoundDuration=-30;break;
            default:gameRoundDuration+=30;break;
          
        }

            roundDuration=gameRoundDuration;
            section.textField.text='Round duration:'+durationToTextTime(gameRoundDuration);

        
        };

//var value = localStorage.getItem(key);
//localStorage.setItem(key, value);
Menu.prototype.gameModeCallback = function (section) {

        switch(gameMode){
            case '1 player': gameMode='2 players versus'; break;
            case '2 players versus': gameMode='2 players coop'; if(maxNumberOfPlayers===2){maxNumberOfPlayers=4;this.nbrOfPlayersSection.text='Number of Players:'+maxNumberOfPlayers/2+' vs '+maxNumberOfPlayers/2;};break;
            case '2 players coop':   gameMode='1 player';currentPlayer=1;break;
        }

            section.textField.text='Game mode:'+gameMode;
        };


Menu.prototype.setSoundCallback = function (section) {
game.sound.mute=false;
noMusic=false;



    switch(soundConfig){
        case'music on / fx on':  soundConfig='music off / fx on';noMusic=true;game.sound.stopAll();break;
        case'music off / fx on': soundConfig='music off / fx off';game.sound.mute=true;noMusic=true;game.sound.stopAll();break;
        case'music off / fx off':soundConfig='music on / fx on';musics.play('charSelectTheme');break;
    }
    section.textField.text='sound config:'+soundConfig;
//'music off / fx on'//'music off / fx off'  

        };


Menu.prototype.factorySettingsCallback = function (section) {
        maxNumberOfPlayers=defaultPlayersNbr;//16 max
        game.sound.mute=false;
        noMusic=true;
        soundConfig='music off / fx on';
       //musics.play('charSelectTheme');
        tickets=defaultTicketsNbr;
        team1Tickets=tickets;
        team2Tickets=tickets;
        gameRoundDuration=0;
        roundDuration=gameRoundDuration;
        gameMode='1 player';
        //setLocalStorage();
        this.switchState('reset');
        };


Menu.prototype.resetGameCallback = function (section) {

        //setLocalStorage();
        game.sound.stopAll();
        this.switchState('LogoScreen');
        };
Menu.prototype.exitCallback = function (section) {
            //game.sound.stopAll();
            setLocalStorage();
            this.switchState(previousState,'select');
           
        };




Game.DemoMode = function (game) { };
Game.DemoMode.prototype = {

    create: function () {
    
    initState.call(this);
    //background = game.add.tileSprite(0, 0, 1024*10, 512, "background");

   //this.flickeringTXT=addText.call(this,screenCenterX,fontHeight+stageHeight*0.5,'PRESS START',null,true);
    },

    update: function () {
    //if(game.input.activePointer.isDown){game.state.start('Levels');}
   //
    game.physics.arcade.overlap(players, solidLayer);
    game.physics.arcade.overlap(projectiles,players,projCollidePlayer);
    //game.physics.arcade.overlap(items, solidLayer);
   // game.physics.arcade.collide(players,players);
    
     
    //game.physics.arcade.overlap(projectiles, solidLayer,projCollideMap);
   
    //
   // wheelActions();
    if (game.time.time> update_Timeout) {
    //this.flickeringTXT.visible=!this.flickeringTXT.visible;
    if(game.input.activePointer.isDown || anyKeyDown){if(!fadeLock){fadeOut.call(this,'IntroScreen',800,false,true);}}
    UPDATE=true;
    update_Timeout= game.time.time+80; 
    //game.physics.arcade.overlap(projectiles, solidLayer,projCollideMap);
    game.physics.arcade.overlap(explosions,players,expCollidePlayer);
    
    //game.physics.arcade.collide(players,players);
    players.sort('y', Phaser.Group.SORT_ASCENDING); 
    spawnPlayers();
    }else{UPDATE=false;}



    }
};


Game.LevelEnd = function (game) { };
Game.LevelEnd.prototype = {

    create: function () {

    initState.call(this);



    },

    update: function () {

        //if(musics.charSelectTheme.volume>0){musics.charSelectTheme.volume-=0.002;}
         if((game.input.activePointer.isDown || anyKeyDown) && game.time.time>this.timeStamp+inputBlockDelay){
            
            if(!fadeLock){
                computeTopScore(memory.getMatchResults());

                if(currentLevel<totalNbrOfLevels){currentLevel+=1};
                if(victoryMessage==='team2 wins'){creditsP1-=1;}
                else if(gameMode==='2 players versus'){creditsP2-=1;}
                else if(gameMode==='2 players coop'){creditsP1-=1;creditsP2-=1;}

    
                    if(currentLevel>=totalNbrOfLevels){fadeOut.call(this,'GameEnd',800,false,true);}
                    else{   

                        if(gameMode==='1 player'){    
                            if(creditsP1<0){credTextP1.text='credits P1:0';fadeOut.call(this,'GameOver',800,false,true);}
                            else{credTextP1.text='credits P1:'+creditsP1;fadeOut.call(this,'CharacterSelect',800,false,true);}
                        }else{
                            
                            if(creditsP1<0){credTextP1.text='credits P1:0';}else{credTextP1.text='credits P1:'+creditsP1;}
                            if(creditsP2<0){credTextP2.text='credits P2:0';}else{credTextP2.text='credits P2:'+creditsP2;}

                            if(creditsP1<0 || creditsP2<0){fadeOut.call(this,'GameOver',800,false,true);}
                            else{fadeOut.call(this,'CharacterSelect',800,false,true);}

                        }
                    } 

            //if(victoryMessage==='defeat'){fadeOut.call(this,'Levels',800,false,true);} else {fadeOut.call(this,'Levels',800,false,true);}
            }
            
      
        }
         

    //game.state.start('Levels');
    }
};


//if(gameMode!=='1 player'){

Game.GameEnd = function (game) { };
Game.GameEnd.prototype = {

    create: function () {

    initState.call(this);
    this.ind=0;
    this.holdText=game.time.time+1500;


    this.black = game.add.graphics(0, 0);
        this.black.fixedToCamera=true; 
        this.black.beginFill(0x000000, 1);
        this.black.drawRect(0, 0,stageWidth, stageHeight);
        this.black.endFill();
    this.black.alpha=1;
    this.currentTween=game.add.tween(this.black).to({alpha:0}, 350, Phaser.Easing.Cubic.InOut, true, 0, 0, false);

     
    },

    update: function () {
          //if(game.time.time>this.timeStamp+800){
        if(game.time.time>this.holdText && this.ind<this.textCreditsArray.length-1){
            this.ind+=1;
            this._TEXT.text=this.textCreditsArray[this.ind];
            this.holdText=game.time.time+1500;


            this.black.alpha=1;
            this.currentTween.start();
            

        }else 


        if(this.ind>=this.textCreditsArray.length-1 && (game.input.activePointer.isDown || anyKeyDown) && game.time.time>this.timeStamp+inputBlockDelay){
          this.timeStamp=game.time.time+1000000000000;
          fadeOut.call(this,'LogoScreen',800,false,true);
        }

    }
};













Game.GameOver = function (game) { };
Game.GameOver.prototype = {

    create: function () {

    initState.call(this);
    },

    update: function () {
if( (game.time.time>  this.timeStamp+3000 && (anyKeyDown || game.input.activePointer.isDown) ) || !musics.gameOver.isPlaying){
          this.timeStamp=game.time.time+1000000000000;
          if(soundConfig==='music off / fx on' || soundConfig==='music off / fx off'){noMusic=true;}
          fadeOut.call(this,'IntroScreen',800,false,true);
            }

    }
};


Game.Levels = function (game) { };
Game.Levels.prototype = {

    create: function () {

    initState.call(this);
    
    //musics.play('charSelectTheme');
    //background = game.add.tileSprite(0, 0, 1024*10, 512, "background");


    },

    update: function () {
    //if(game.input.activePointer.isDown){game.state.start('Levels');}
   //
    game.physics.arcade.overlap(players, solidLayer);
    game.physics.arcade.overlap(projectiles,players,projCollidePlayer);
    //game.physics.arcade.overlap(items, solidLayer);
   // game.physics.arcade.collide(players, players);

    
    
   
    //
   // wheelActions();
    if (game.time.time> update_Timeout) {

    UPDATE=true;
    update_Timeout= game.time.time+80; 
   //game.physics.arcade.overlap(projectiles, solidLayer,projCollideMap);
    game.physics.arcade.overlap(explosions,players,expCollidePlayer);
    //game.physics.arcade.collide(players,players);
    players.sort('y', Phaser.Group.SORT_ASCENDING); 
    spawnPlayers();
    }else{UPDATE=false;}



    }


};

function wheelActions(){ 

var obj=playersArray[wheelPosition];
if(obj.isAlive){obj.wheelAction();};
if(wheelPosition>=playersArray.length-1){wheelPosition=0;}else{wheelPosition+=1;}
}



/*
    obj.firingRate=[1,1,1,1,0];
    obj.ammoClipNbr=3;
    obj.ammoClip=30;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=8;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=2000;
    obj.projLifeSpan=540;
    obj.projAllowGravit=false;
    obj.projImmovable=false;
    obj.projDamage=26;
    obj.projKnocksdown=false;
    obj.projExplode=false;
*/



function projCollideMap(proj,tile){
   // impactEmitter.forEachDead(callback, callbackContext, args)
    
    //proj.owner.impactEmitter.x = proj.x;
    //proj.owner.impactEmitter.y = proj.y;
    //proj.owner.impactEmitter.setXSpeed(proj.body.velocity.x);
    //proj.owner.bloodEmitter.setYSpeed(proj.body.velocity.y);
   //impactEmitter.forEachDead(emitterVelocityX, this, proj.body.velocity.x);
    //proj.owner.impactEmitter.start(true, 80, null, 5);
  if(proj.body.allowGravity===false){proj.kill();}else{sounds.play('cling');}
    
}
function projCollidePlayer(proj,player){
if( proj.team!==player.team &&  player.isAlive===true && (player.isShootable===true || proj.forceDamage===true)){
    player.life-=proj.damage;
    player.impact.reset(proj.body.x,proj.body.y);
    player.impact.play(proj.impactAnim,null,null,true);
    
    player.body.velocity.x = 500*proj.scale.x;
    player.body.velocity.y = -50;
    //player.impact.kill();
    
    //if(player.strikeProj){player.strikeProj.kill();player.strikeProj=null;}
        //player.impact.play('strike',null,null,true);
        //player.impact.reset(player.x,player.body.y);
     
    //else{player.impact.play('blood',null,null,true);player.impact.reset(proj.body.x,proj.body.y);}
/*
    player.bloodEmitter.x = proj.x;
    player.bloodEmitter.y = proj.y;
    player.bloodEmitter.setXSpeed(proj.body.velocity.x);
    player.bloodEmitter.setYSpeed(proj.body.velocity.y);
    //bloodEmitter.forEachDead(emitterVelocityX, this, proj.body.velocity.x);
    //player.bloodEmitter.start(true, 250, null, 5);
     */

   

    if(player.life<0){

        player.play('killed');
        proj.owner.score+=killValue;
        //if(player.isHuman===true){proj.owner.checkReload();}
        UI.updateKillLog(proj.owner.nick,player.nick);
        player.body.velocity.y = -350;
        player.life=0;
        player.isAlive=false;
                

    } else if(proj.knocksdown===true){player.body.velocity.y = -350;player.play('knockDown');}else{player.play('hurt');} 
    
    if(proj.explode===true){proj.blast();};
    if(proj.body.immovable===false){ proj.body.immovable=false;proj.kill(); }

    if(player.isHuman===true){UI.updateStats(player);UI['loadAnim'+player.p].play('hitLife');}
    sounds.play('hurt');
    }


    
}

function expCollidePlayer(exp,player){
if(player.isAlive===true && exp.owner.team!==player.team){
    player.life-=45;
    player.scale.x=-exp.scale.x;
    player.body.velocity.x = 500*exp.scale.x;
    if(player.body.blocked.down){player.body.y -= 20;player.y -= 20;};
    player.body.velocity.y = -750;

    
    sounds.play('hurt');
    if(player.life<0){exp.owner.score+=killValue;UI.updateKillLog(exp.owner.nick,player.nick);player.life=0;player.isAlive=false;player.play('killed');}else{player.play('knockDown');}
    if(player.isHuman===true){UI.updateStats(player);}
}

}
function itemCollidePlayer(player,item){
    if(player.isShootable===true){

        player.use(item);
        item.kill();
    }
}




function emitterVelocityX(particle,velocity){particle.body.velocity.x = velocity;}



var UI;
var players;
var projectiles;
var impacts;
var items;
var explosions;
var map;
var bloodEmitter;
var impactEmitter;
var UPDATE=true;
var update_Timeout=0;
var AI_Timeout=0;
var playersArray=[];
var gameMenu;

var gunArray=['machineGun','shotGun','sniper','sniper2','grenade','flame','rocket','lazer'];


function createMap(opacity){

var randLevel=Math.round( Math.random()*(totalNbrOfLevels-1)/2 );       
    if(game.state.current!=="DemoMode"){

    if(randomizeMaps){map = game.add.tilemap('level'+randomMapArray[currentLevel]);}else{map = game.add.tilemap('level'+currentLevel);}
        map.addTilesetImage('tile_LayerIMG',mapTextures[currentLevel]);
        map.addTilesetImage('solid_LayerIMG',mapTextures[currentLevel]);
    

    }else{
        map = game.add.tilemap('level'+randLevel);
        map.addTilesetImage('tile_LayerIMG',mapTextures[randLevel]);
        map.addTilesetImage('solid_LayerIMG',mapTextures[randLevel]);
    };
    //
    //layerBkg = map.createLayer('LayerBkgTiles');
    tileLayer = map.createLayer('tile_Layer');
    if(opacity){tileLayer.alpha=opacity;}
    solidLayer = map.createLayer('solid_Layer');
    solidLayer.visible=false;
    //map.setCollisionBetween(90, 99,true,solidLayer);
    map.setCollision(1, true, solidLayer, true);
    return tileLayer;
}

var airStrike=false;
var  airStrikeRate=[1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var  airStrikeInd=airStrikeRate.length;
var  airStrikeCaller=undefined;
var  airStrikeX=800;
var  airStrikeDirection=1;



function createWorld(){
if(randomizeNbrOfPlayers===true){
    maxNumberOfPlayers=Math.round(Math.random()*8)*2;
    if(maxNumberOfPlayers<4 && gameMode==='2 players coop'){maxNumberOfPlayers=4;}
    if(maxNumberOfPlayers<2){maxNumberOfPlayers=2;}
}

    computeTopScore(defaultPlayerList);

    playersNbrTeam1=Math.round(maxNumberOfPlayers/2);
    playersNbrTeam2=Math.round(maxNumberOfPlayers/2); 
    

    spawnPointTeam1=[];
    spawnPointTeam2=[];
    playersArray=[];

    
   
    spawnPointTeam1.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam1.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam1.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam1.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));

    spawnPointTeam2.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam2.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam2.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));
    spawnPointTeam2.push(new Phaser.Point(Math.round(Math.random()*game.world.width),80));

    UPDATE=false;
    update_Timeout=0;
    wheelPosition=0;
    game.time.reset();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 440*Scale;
    game.physics.arcade.TILE_BIAS = parseInt(16*Scale);
    if(skipQuadTree){game.physics.arcade.skipQuadTree = skipQuadTree;}
    //game.physics.arcade.skipQuadTree=true;
    
    createMap.call(this);
 


    //map.setCollision([1,2,3], true, solidLayer, true);
    
    
    players=game.add.group();
    items=game.add.group();
    projectiles=game.add.group();
    explosions=game.add.group();
    impacts=game.add.group();
    
    
    
    
   
    
     
    //solidLayer.resizeWorld();

var mapArray = solidLayer.getTiles(0, 0, game.world.width, game.world.height);

 for (var i = 0; i < mapArray.length; i++) {
     if ( mapArray[i].index === 1) {
        mapArray[i].setCollision(false, false, true, false); // left, right, top, bottom
    };
}

    UI = new UserInterface(game,0,0);
    game.add.existing(UI);
    
    
    for(var i=0;i<maxNumberOfPlayers;i++){
        var soldier;
  
    if(i===maxNumberOfPlayers-1){
        //soldier = new Player(game, Math.round(Math.random()*400)+400,32,'SoldierTeam1Human',1);
       soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam1Human',1);
         
        //soldier = new Player(game, Math.round(Math.random()*400)+400,32,'SoldierTeam1HumanAlt',1);

        if(game.state.current!="DemoMode"){
            //soldier.controls='mouseKeyboard';
            if(gameMode==='1 player'){soldier.controls='mouseKeyboard';}else{soldier.controls='mouse';};
            var _item = new Item(game,64+Math.round(Math.random()*(game.world.width-64)),0);items.add(_item);_item.kill();
            soldier.nick=player1Nick;
            soldier.isHuman=true;
            

    
            if(soldier.team==1){
            soldier.rep=game.add.image(-16*Scale,-24*Scale,'playerRepTeam2');
            
        }else{
            soldier.rep=game.add.image(-16*Scale,-24*Scale,'playerRepTeam1');


            }
            
            soldier.addChild(soldier.rep);
            soldier.bringToTop(); 

        } else{soldier.controls='botControls';soldier.nick="BotMaster";}   
        
        soldier.life=playerLife;
        if(chatEnabled){ UI.initChat(soldier);}else{UI.owner=soldier;}

        //setWeapon(soldier, gunArray[ Math.round(Math.random()* (gunArray.length-1)   )] );
        setWeapon(soldier, player1Gun);
        UI.updateStats(soldier);
       // setWeapon(soldier, 'machineGun' );

        

        //if(game.world.width>stageWidth+64 || game.world.height>stageHeight+64){game.camera.follow(soldier);}
   /*     
               case '1 player':             gameMode='2 players versus';break;
            case '2 players versus': gameMode='2 players coop';break;
            case '2 players coop':   gameMode='1 player';break;     
    */    
        
        soldier.team=1;
      
    }
     //else if(i===0){human.controls='mouse';}
     else{

        if(i%2!=0){ 

            if(gameMode==='2 players coop' && i===maxNumberOfPlayers-3 && game.state.current!=="DemoMode"){
            //soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam1Human',2);
           soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam1HumanAlt',2);
             
            soldier.nick=player2Nick;
            soldier.isHuman=true;
            var _item = new Item(game,64+Math.round(Math.random()*(game.world.width-64)),0);items.add(_item);_item.kill();



            soldier.rep=game.add.image(-16*Scale,-24*Scale,'playerRepAlt');
            soldier.addChild(soldier.rep);
            soldier.team=1; 
            soldier.controls='keyboard';
            soldier.life=playerLife;
            soldier.bringToTop();
               setWeapon(soldier, player2Gun );
               UI.updateStats(soldier);
            }else{
            soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam1',1);
             //soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam1Alt');
            soldier.team=1;
            soldier.nick=window['nickListTeam'+1][Math.round(i/2)];
            soldier.controls='botControls';
               setWeapon(soldier, gunArray[ Math.round(Math.random()* (gunArray.length-1)   )] );
            }
        }else{ 

            if(gameMode==='2 players versus' && i===maxNumberOfPlayers-2 && game.state.current!=="DemoMode"){
            //soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam2Human',2);
       
            soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam2Human',2);
            soldier.nick=player2Nick;
            soldier.isHuman=true;
            var _item = new Item(game,64+Math.round(Math.random()*(game.world.width-64)),0);items.add(_item);_item.kill();

            soldier.rep=game.add.image(-16*Scale,-24*Scale,'playerRepTeam2');
            soldier.addChild(soldier.rep);
            soldier.team=2; 
            soldier.controls='keyboard';
            soldier.life=playerLife;
               setWeapon(soldier, player2Gun );
               UI.updateStats(soldier);
            soldier.bringToTop();
            }else{
            soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam2',2);
            //soldier = new Player(game, Math.round(Math.random()*(game.world.width/2))+(game.world.width/2),32,'SoldierTeam2Alt');
            soldier.team=2;
            soldier.nick=window['nickListTeam'+2][Math.round(i/2)];
               setWeapon(soldier, gunArray[ Math.round(Math.random()* (gunArray.length-1)   )] );
            soldier.controls='botControls';
            }
        }
        
        
        soldier.kill();
        }


        players.add(soldier);
        playersArray[i]=soldier;
    
    }


    airStrike=false;
    airStrikeCaller=undefined;
   // gameMenu= new GameMenu(game,0,0);



    //bloodEmitter.start(true, 2000, null, 10);
/*
    impactEmitter = game.add.emitter(0, 0, 100);
    impactEmitter.makeParticles('');
    impactEmitter.gravity = 200;
*/
    //mpactEmitter.start(true, 2000, null, 10);


if(game.state.current==="DemoMode"){UI.statTxt1.visible=false;UI.statTxt1_Img.visible=false;};


    //this.spawnTimer = game.time.create(false);
    //this.spawnTimer.loop(800, spawnPlayers, this);
    //this.spawnTimer.start();
    //sounds.play('radioChatter');

}

var wheelPosition=0;
var itemDelayCounter=10;





function spawnPlayers(){ 

if(airStrike===true){
 
    if(airStrikeRate[airStrikeInd]===1){

var proj=projectiles.getFirstDead();

    if(proj){
            

            proj.owner=airStrikeCaller;
            proj.team=0;
           
            proj.reset(airStrikeX,50);
            airStrikeX+=100*airStrikeDirection;
            

            //proj.body.bounce.set(1);
            proj.body.velocity.x=1000*airStrikeDirection;
            proj.body.velocity.y=1000;
            proj.lifespan=220;
            proj.body.allowGravity=true;
            proj.body.immovable=true;
            proj.damage=32;
            proj.knocksdown=true;
            proj.forceDamage=false;
            proj.explode=true;
            
            // /this.projNbr=0;
            //this.bringToTop(); 
            proj.scale.x=airStrikeDirection;
            proj.play('airstrike');
            
        }
    }
       airStrikeInd-=1;
    if(airStrikeInd<=0){airStrikeInd=airStrikeRate.length;airStrike=false;}
}
    
    
    


if(itemDelayCounter<=0){
            var item=items.getFirstDead();
        if(item){
            item.reset(Math.round(Math.random()*stageWidth),0);
            //item.anims=['machineGun','shotGun','grenade','flame','lazer','medikit'];
            item.animations.stop(null, true);
            item.animName=item.anims[ Math.round(Math.random()*(item.anims.length-1)) ];
            item.play(item.animName,12,false,true);
            //
            //item.revive();
            }
    itemDelayCounter=100;
}else{itemDelayCounter-=1;}




var p=players.getFirstDead();

if(p && p.isHuman===false){
resurrectSoldier(p);
//p.x=window['spawnPointTeam'+p.team][nbr].x;
//p.y=window['spawnPointTeam'+p.team][nbr].y;
//p.body.x=window['spawnPointTeam'+p.team][nbr].x;
//p.body.y=window['spawnPointTeam'+p.team][nbr].y;

//p.body.velocity.x=0;p.body.velocity.y=0;

//p.nick=nickList[Math.round(Math.random()*nickList.length)];
//p.revive();

}
players.forEachDead(respawnPlayer,this);


//UI.updateChat('player1: who the fuck took the helicopter ? Anyone ?');
}

function respawnPlayer(obj){ 

if(obj.isHuman===true){


//obj.x=window['spawnPointTeam'+obj.team][nbr].x;
//obj.y=window['spawnPointTeam'+obj.team][nbr].y;
//obj.body.x=window['spawnPointTeam'+obj.team][nbr].x;
//obj.body.y=window['spawnPointTeam'+obj.team][nbr].y;

//obj.body.velocity.x=0;obj.body.velocity.y=0;
resurrectSoldier(obj);
UI.updateStats(obj);
UI['loadAnim'+obj.p].play('respawn');
//obj.revive();


}

}


function resurrectSoldier(obj){
var nbr=Math.floor( Math.random()*(window['spawnPointTeam'+obj.team].length-1) );

//reset

obj.x=window['spawnPointTeam'+obj.team][nbr].x;
obj.y=window['spawnPointTeam'+obj.team][nbr].y;
obj.body.x=window['spawnPointTeam'+obj.team][nbr].x;
obj.body.y=window['spawnPointTeam'+obj.team][nbr].y;

//obj._outOfBoundsFired = false;

//obj.reset(window['spawnPointTeam'+obj.team][nbr].x,window['spawnPointTeam'+obj.team][nbr].y);



//obj.fresh = true;
obj.exists = true;
obj.visible = true;
//obj.renderable = true;
obj.alive = true;
obj.health = 1;
obj.revive();
obj.resetParams();
obj.play('run');
}

function setWeapon(obj,projType) {



switch(projType){

    case "machineGun":
    obj.projType=projType;
    obj.firingRate=[1,1,1,1];
    obj.ammoClipNbr=2;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=30;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=4;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=1000;
    obj.projLifeSpan=680;
    obj.projAllowGravit=false;
    obj.projImmovable=false;
    obj.projDamage=26;
    obj.projKnocksdown=false;
    obj.projExplode=false;
    obj.projForceDamage=true;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[0]+obj.luck;
    break;

    case "shotGun":
    obj.projType=projType;
    obj.firingRate=[1,0,0];
    obj.ammoClipNbr=4;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=8;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=8;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=1000;
    obj.projLifeSpan=680;
    obj.projAllowGravit=false;
    obj.projImmovable=false;
    obj.projDamage=44;
    obj.projKnocksdown=true;
    obj.projExplode=false;
    obj.projForceDamage=true;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[1]+obj.luck;
    break;


    case "grenade":
    obj.projType=projType;
    obj.firingRate=[1,1,1,0,0,0];
    obj.ammoClipNbr=3;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=6;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=8;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=800;
    obj.projLifeSpan=450;
    obj.projAllowGravit=true;
    obj.projImmovable=false;
    obj.projDamage=18;
    obj.projKnocksdown=true;
    obj.projExplode=true;
    obj.projForceDamage=false;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[2]+obj.luck;
    break;




    case "sniper2":
    obj.projType=projType;
    obj.firingRate=[1,0,1,0,1,0];
    obj.ammoClipNbr=3;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=15;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=4;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=1400;
    obj.projLifeSpan=500;
    obj.projAllowGravit=false;
    obj.projImmovable=false;
    obj.projDamage=37;
    obj.projKnocksdown=false;
    obj.projExplode=false;
    obj.projForceDamage=true;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[3]+obj.luck;
    break;

    case "flame":
    obj.projType=projType;
    obj.firingRate=[1,1,1,1,1,1,1,1,1,1];
    obj.ammoClipNbr=3;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=10;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=4;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=2000;
    obj.projLifeSpan=160;
    obj.projAllowGravit=false;
    obj.projImmovable=true;
    obj.projDamage=14;
    obj.projKnocksdown=false;
    obj.projExplode=false;
    obj.projForceDamage=true;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[4]+obj.luck;
    break;




    case "rocket":
    obj.projType=projType;
    obj.firingRate=[1,0,0];
    obj.ammoClipNbr=1;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=4;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=12;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=1300;
    obj.projLifeSpan=450;
    obj.projAllowGravit=false;
    obj.projImmovable=true;
    obj.projDamage=75;
    obj.projKnocksdown=true;
    obj.projExplode=true;
    obj.projForceDamage=false;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[5]+obj.luck;
    break;


     case "sniper":
    obj.projType=projType;
    obj.firingRate=[1,0,0,0,0];
    obj.ammoClipNbr=2;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=5;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=8;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=1600;
    obj.projLifeSpan=400;
    obj.projAllowGravit=false;
    obj.projImmovable=true;
    obj.projDamage=100;
    obj.projKnocksdown=true;
    obj.projExplode=false;
    obj.projForceDamage=false;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[6]+obj.luck;
    break;  


    case "lazer":
    obj.projType=projType;
    obj.firingRate=[1,0,1];
    obj.ammoClipNbr=2;
    obj.ammoClipNbrMax=obj.ammoClipNbr;
    obj.ammoClip=15;
    obj.ammoClipMax=obj.ammoClip;
    obj.reloadTime=4;
    obj.reloading=0;
    obj.projNbr=0;

    obj.projBounce=1;
    obj.projVelocity=2000;
    obj.projLifeSpan=400;
    obj.projAllowGravit=false;
    obj.projImmovable=true;
    obj.projDamage=35;
    obj.projKnocksdown=false;
    obj.projExplode=false;
    obj.projForceDamage=false;
    obj.projImpactAnim='strike';
    obj.combatSkills=combatSkillsArray[7]+obj.luck;
    break;

    case "medikit":
    obj.life+=100;
    UI['loadAnim'+obj.p].play('heal');
    sounds.play('grabItem');
    break;

    case "ammo":
    obj.ammoClipNbr+=obj.ammoClipNbrMax;
    obj.ammoClip=obj.ammoClipMax;
    obj.reloading=0;
    UI['loadAnim'+obj.p].play('reload');
    sounds.play('grabItem');
    break;

    case "airstrike": 
    airStrikeCaller=obj;
    airStrikeDirection=obj.scale.x;
    if(airStrikeDirection>0){airStrikeX=0;}else{airStrikeX=800;}
    airStrike=true;
    sounds.play('airstrikeCall');
    break;
    
}

        
  


}






Projectile = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y,'projectiles');
    this.animations.add('strike',[0], 1, false);
    this.animations.add('machineGun',[1], 1, false);
    this.animations.add('flame',[2], 1, false);
    this.animations.add('grenade',[3], 1, false);
    this.animations.add('sniper',[6], 1, false);
    this.animations.add('lazer',[4],1, false);
    this.animations.add('rocket',[7],1, false);
    this.animations.add('sniper2',[8], 1, false);
    this.animations.add('shotGun',[5],1, false); 
    this.animations.add('airstrike',[9], 1, false);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(2*Scale, 2*Scale, 0, 0);
    this.anchor.setTo(0, 0.5);
    this.body.checkCollision.top=false;
    this.body.checkCollision.bottom=false;
    this.team=1;

    //this.body.bounce.set(1);
    this.body.velocity.x=1;
    this.lifespan=540;
    this.body.allowGravity=false;
    this.body.gravity.y =-1000;
    this.body.immovable=false;
    this.damage=26;
    this.knocksdown=false;
    this.explode=false;
    this.forceDamage=false;
    
    this.owner=undefined;
    this.events.onKilled.add( function(){ if(this.explode===true){  this.blast(); }; }, this );
    this.impactAnim='blood';
    projectiles.add(this);
    
    this.play('machineGun');
    

}


Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.blast = function() {
var exp=explosions.getFirstDead();
if(exp){
            exp.owner=this.owner;
            exp.reset(this.body.x,this.body.y);
            exp.scale.x=this.scale.x;
            exp.play('explode',30,false,true);
            sounds.play('explosion');
        }
}




Explosion = function (game, x, y) {
Phaser.Sprite.call(this, game, x, y,'explosions');
this.animations.add('explode',  [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 30, false);
game.physics.enable(this, Phaser.Physics.ARCADE);
this.enableBody = true;
this.body.immovable=true;
this.body.allowGravity=false;
this.body.setSize(16*Scale, 16*Scale, 0, 0);
this.anchor.setTo(0.5, 0.5);
this.owner=undefined;

explosions.add(this);

}


Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;









Impact = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y,'impactEffects');
    this.animations.add('strike',  [0,1,2,3], 0, false);
    this.animations.add('blood',    [4,5,6,7], 0, false);
   
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable=true;
    //this.body.bounce.set(1);
    this.body.allowGravity=false;
    this.body.immovable = true;
    this.body.setSize(2*Scale, 2*Scale, 0, 0);
    this.anchor.setTo(0, 0.5);

    this.kill();
    impacts.add(this);
}
Impact.prototype = Object.create(Phaser.Sprite.prototype);
Impact.prototype.constructor = Impact;







UserInterface = function (game,x,y,owner) {

    Phaser.Group.call(this, game);
    this.statTxt1 = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, fontStringLength, 0, 0);
    this.statTxt1.align='left';
    this.statTxt1.multiLine=true;
    this.statTxt1.text =''; 
    
    this.statTxt1_Img = game.add.image(0, 0, this.statTxt1);
    this.add(this.statTxt1_Img);
    this.statTxt1_Img.y=stageHeight-fontHeight*2;

if(gameMode!=='1 player'){

    this.statTxt2 = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, fontStringLength, 0, 0);
    this.statTxt2.align='left';
    this.statTxt2.multiLine=true;
    this.statTxt2.text =''; 
    
    this.statTxt2_Img = game.add.image(0, 0, this.statTxt2);
    this.add(this.statTxt2_Img);
    this.statTxt2_Img.y=stageHeight-fontHeight*2;
    this.statTxt2_Img.x=stageWidth-240;

}


    this.gameStatTxt = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, fontStringLength, 0, 0);
    this.updateGameStats();
    this.gameStatTxt_Img = game.add.image(0, 0, this.gameStatTxt);
    this.add(this.gameStatTxt_Img);
    this.gameStatTxt.align='right';

var tempSc1='';
var tempSc2='';
if(team1Tickets<10){tempSc1='0'};
if(team2Tickets<10){tempSc2='0'};
this.gameStatTxt.text ='team1:'+tempSc1+team1Tickets+'        '+'team2:'+tempSc2+team2Tickets;
    //this.gameStatTxt.text ='team1:'+team1Tickets+'        '+'team2:'+team2Tickets; 
    //this.gameStatTxt_Img.tint = Math.random() * 0xFFFFFF;
    this.gameStatTxt_Img.x=stageWidth-this.gameStatTxt_Img.width;
    //this.gameStatTxt.noFrame=true;
    this.gameTimeTxt = game.add.retroFont('gameFont1', fontHeight, fontHeight, fontString, fontStringLength, 0, 0);
    this.updateGameTime();
    this.gameTimeTxt_Img = game.add.image(0, 0, this.gameTimeTxt);
    this.add(this.gameTimeTxt_Img);
if(chatEnabled){ 
    this.chatTxt = game.add.retroFont('gameFont2', Math.round(fontHeight/2), Math.round(fontHeight/2), fontString, fontStringLength, 0, 0);
    this.chatTxt.multiLine=true;
    this.chatTxt_Img = game.add.image(0, 0, this.chatTxt);
    this.chatTxt_Img.y=16*Scale;
    this.chatTxt_Img.x=2*Scale;
    this.add(this.chatTxt_Img);

        this.chatStr= '                                     ';
        this.chatLength=this.chatStr.length;
        this.chatMaxChar=this.chatLength*10;
        this.defaultTextInput='TYPE YOUR TEXT...THEN PRESS ENTER';
        

    this.chatInputBoxTxt = game.add.retroFont('gameFont2', Math.round(fontHeight/2), Math.round(fontHeight/2), fontString, fontStringLength, 0, 0);
    this.chatInputBoxTxt.multiLine=true;
    this.chatInputBoxTxt_Img = game.add.image(0, 0, this.chatInputBoxTxt);
    this.chatInputBoxTxt_Img.y=64*Scale;
    this.chatInputBoxTxt_Img.x=8*Scale;
    this.chatInputBoxTxt.text=this.defaultTextInput;
    this.add(this.chatInputBoxTxt_Img);
    this.chatInputBoxTxt_Img.visible=false;

    game.input.keyboard.onDownCallback = function(e) {processKey(this);}
}    
    //this.chatTxt_Img.alpha=0.5;

    this.killLogTxt = game.add.retroFont('gameFont2', Math.round(fontHeight/2), Math.round(fontHeight/2), fontString, fontStringLength, 0, 0);
    this.killLogTxt.multiLine=true;
    this.killLogTxt_Img = game.add.image(0, 0, this.killLogTxt);
    this.killLogTxt_Img.y=-2*Scale;
    this.killLogTxt_Img.x=2*Scale;
    this.killLogTxt.text='';
    this.add(this.killLogTxt_Img);

    
    this.secRef=roundDuration;
    this.minRef=Math.round(this.secRef/60);
    this.curtime=this.secRef-Math.round(game.time.totalElapsedSeconds());
    this.minsLeft=Math.round(this.curtime/60);
    this.secsLeft=0;
    this.totalTime='00:00';
    this.gameTimeTxt.align='right';
    this.gameTimeTxt.text =this.totalTime;
    this.gameTimeTxt_Img.x=(stageWidth-this.gameStatTxt_Img.width/2)-this.gameTimeTxt_Img.width/2;
    this.updateGameTime();
    this.owner=null;
    this.fixedToCamera=true;
    keyCapture=false;

    this.loadAnim1 = game.add.sprite(0, 0,'loadAnim');
    this.loadAnim1.animations.add('load',[0,1,2,3,4,5,6,7], 24, false);
    this.loadAnim1.animations.add('hitLife',[8,9,10,11,12,13,14,15], 24, false);
    this.loadAnim1.animations.add('respawn',[16,17,18,19,20,21,22,23], 24, false);
    this.loadAnim1.animations.add('heal', [24,25,26,27,28,29,30,31], 24, false);
    this.loadAnim1.animations.add('reload',   [32,33,34,35,36,37,38,39], 24, false);
    
    this.loadAnim1.x=this.statTxt1_Img.x-4*Scale;
    this.loadAnim1.y=this.statTxt1_Img.y;
    this.add(this.loadAnim1);

    if(gameMode!=='1 player'){
    this.loadAnim2 = game.add.sprite(0, 0,'loadAnim');
    this.loadAnim2.animations.add('load',[0,1,2,3,4,5,6,7], 24, false);
    this.loadAnim2.animations.add('hitLife',[8,9,10,11,12,13,14,15], 24, false);
    this.loadAnim2.animations.add('respawn',[16,17,18,19,20,21,22,23], 24, false);
    this.loadAnim2.animations.add('heal', [24,25,26,27,28,29,30,31], 24, false);
    this.loadAnim2.animations.add('reload',   [32,33,34,35,36,37,38,39], 24, false);

    this.loadAnim2.x=this.statTxt2_Img.x-4*Scale;
    this.loadAnim2.y=this.statTxt2_Img.y;
    this.add(this.loadAnim2);

    }
    
}
UserInterface.prototype = Object.create(Phaser.Group.prototype);
UserInterface.prototype.constructor = UserInterface;

UserInterface.prototype.update = function() {
 
if(UPDATE===true){
     if(chatEnabled===true && this.chatTxt_Img.visible===true && this.chatTxt_Img.alpha>0.1){this.chatTxt_Img.alpha-=0.01;}else if(chatEnabled===true && this.chatTxt_Img.visible===true){this.chatTxt_Img.visible=false;this.chatTxt_Img.alpha=1;} 
    this.updateGameTime();
    if(this.killLogTxt_Img.visible===true && this.killLogTxt_Img.alpha>0.1){this.killLogTxt_Img.alpha-=0.01;}else if(this.killLogTxt_Img.visible===true){this.killLogTxt_Img.visible=false;this.killLogTxt_Img.alpha=1;} 
    
    }
}
var keyCapture=false;

function processKey() {
    if(UI.chatInputBoxTxt_Img.visible){
        if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            if(UI.chatInputBoxTxt.text!=UI.defaultTextInput){UI.updateChat(UI.chatInputBoxTxt.text);keyCapture=false;UI.chatInputBoxTxt_Img.visible=false;UI.chatInputBoxTxt.text=UI.defaultTextInput;}
        }else {keyCapture=true;}
    
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.K)){UI.chatInputBoxTxt.text=UI.defaultTextInput;UI.chatInputBoxTxt_Img.visible=true;}

    if(keyCapture){
        if(UI.chatInputBoxTxt.text===UI.defaultTextInput){UI.updateChatInput(String.fromCharCode(game.input.keyboard.event.keyCode));}
        else{UI.updateChatInput(String.fromCharCode(game.input.keyboard.event.keyCode),true);}    
    }
}


UserInterface.prototype.updateKillLog = function(p1Nick,p2Nick) {
if(this.killLogTxt.text.length<100){this.killLogTxt.text+='\n'+p1Nick+" killed "+p2Nick;}
else{var tempTxt=this.killLogTxt.text;this.killLogTxt.text=tempTxt.substring(31,this.killLogTxt.text.length);this.killLogTxt.text+='\n'+p1Nick+" killed "+p2Nick;}
this.killLogTxt_Img.visible=true;
this.killLogTxt_Img.alpha=1;

}

UserInterface.prototype.updateChatInput = function(str,add) {

    if(add){this.chatInputBoxTxt.text+=str;}else{this.chatInputBoxTxt.text=this.owner.nick+': '+str;}

}

UserInterface.prototype.initChat = function(obj) {
        this.owner=obj;
        this.defaultTextInput=this.owner.nick+': '+this.defaultTextInput;
        this.updateChat('-------------------------------------');
        this.updateChat('chatServ:          Welcome           ');
        this.updateChat('chatServ:    press k key to chat     ');
        this.updateChat('-------------------------------------');
}



UserInterface.prototype.updateChat = function(str,nick) {
if(str!=this.owner.nick){this.processString(str,nick);sounds.play('radioChatter');}
this.chatTxt_Img.visible=true;
this.chatTxt_Img.alpha=1;
}

UserInterface.prototype.processString = function(str,nick) {
var curStr='';

if(nick){curStr=this.chatStr.substring(0,this.chatLength-(nick.length+str.length));curStr=nick+': '+str+curStr;}else{curStr=this.chatStr.substring(0,this.chatLength-(str.length));curStr=str+curStr;}
var line=curStr;
if(curStr.length>this.chatLength){curStr=curStr.substring(0,this.chatLength);}

    this.chatTxt.text +=curStr+'\n';

curStr=this.chatTxt.text;

if(curStr.length>=this.chatMaxChar){
    var finalStr=curStr.substring(this.chatLength+1,curStr.length);
    this.chatTxt.text=finalStr;
}
return line;
}
UserInterface.prototype.updateStats = function(obj) {
this['statTxt'+obj.p].text='life: '+obj.life+'\n'+'ammo:'+' '+obj.ammoClip+'-'+obj.ammoClipMax+' x '+obj.ammoClipNbr;
}
UserInterface.prototype.updateGameStats = function() {
var tempSc1='';
var tempSc2='';
if(team1Tickets<10){tempSc1='0'};
if(team2Tickets<10){tempSc2='0'};
this.gameStatTxt.text ='team1:'+tempSc1+team1Tickets+'        '+'team2:'+tempSc2+team2Tickets; 
}
UserInterface.prototype.updateGameTime = function() {
    this.curtime=this.secRef-Math.round(game.time.totalElapsedSeconds());
    this.minsLeft=Math.ceil(this.curtime/60);
    this.secsLeft=(this.curtime-(60*(this.minsLeft-1)));
    if(this.secsLeft>9){this.totalTime=this.minsLeft+':'+this.secsLeft;}else{this.totalTime=this.minsLeft+':0'+this.secsLeft;}
    if(this.minsLeft>9){this.gameTimeTxt.text =''+this.totalTime;}else{this.gameTimeTxt.text ='0'+this.totalTime;}
    if(this.minsLeft<0){this.gameTimeTxt.text ='00:00';this.evalTimeVictory();}
  
}

UserInterface.prototype.updateTickets = function(nbr) {
if(nbr===1){team1Tickets-=1;}else{team2Tickets-=1;}
this.evalVictory();
this.updateGameStats();
}

UserInterface.prototype.evalVictory = function(nbr) {
if(team1Tickets<0){team1Tickets=0;if(this.owner.team===1){victoryMessage='team2 wins';}else{victoryMessage='team1 wins';};if(game.state.current!="DemoMode"){screenShot.call(this);switchState('LevelEnd');}else{fadeOut.call(this,'IntroScreen',800,false,true);}}
else
if(team2Tickets<0){team2Tickets=0;if(this.owner.team===1){victoryMessage='team1 wins';}else{victoryMessage='team2 wins';};if(game.state.current!="DemoMode"){screenShot.call(this);switchState('LevelEnd');}else{fadeOut.call(this,'IntroScreen',800,false,true);}}
}

UserInterface.prototype.evalTimeVictory = function() {
if(team1Tickets<=team2Tickets){ if(this.owner.team===1){victoryMessage='team2 wins';}else{victoryMessage='team1 wins';}; }
else{ if(this.owner.team===1){victoryMessage='team1 wins';}else{victoryMessage='team2 wins';}; }
if(game.state.current!="DemoMode"){screenShot.call(this);switchState('LevelEnd');}else{fadeOut.call(this,'IntroScreen',800,false,true);}
}



Item = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y,'items');

    
    //this.animations.add('airStrike',[35,36,37,38], 12, true);
    this.animations.add('ammo', [2,0,3,1,3,0,3,1,3,0,3,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,1,0,1,0,1,0,1,2,0,3,1,3,0,3,1,3,0,3], 12, false,true);
    this.animations.add('medikit',  [6,4,7,5,7,4,7,5,7,4,7,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,5,4,5,4,5,4,5,6,4,7,5,7,4,7,5,7,4,7], 12, false,true);
    this.animations.add('airstrike',[10,8,11,9,11,8,11,9,11,8,11,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,9,8,9,8,9,8,9,10,8,11,9,11,8,11,9,11,8,11], 12, false,true);
    //this.animations.add('cash',[45,46,47,48], 12, true);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.width=8*Scale;
    this.body.height=8*Scale;
    this.anchor.setTo(0.5, 0.85);
    //this.anims=['ammo','medikit','airstrike'];
    this.anims=['ammo','medikit','airstrike'];
    this.animName=this.anims[ Math.round(Math.random()* (this.anims.length-1) ) ];
    //this.play(this.animName);
    this.body.collideWorldBounds = true; 
    this.body.bounce.set(0.5,0.5);

}
Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;


GameMenu = function (game, x, y) {
Phaser.Group.call(this, game);
this.fixedToCamera=true;
        this.bkg = game.add.graphics(0, 0);
        this.bkg.beginFill(0x000000, 1);
        this.bkg.drawRect(0, 0,stageWidth/4, stageHeight/4);
        this.bkg.endFill();
        this.bkg.alpha = 0.5;
}
GameMenu.prototype = Object.create(Phaser.Group.prototype);
GameMenu.prototype.constructor = GameMenu;





Player = function (game, x, y,texture,p) {

    Phaser.Sprite.call(this, game, x, y,texture);
    this.animations.add('idle',[0], 0, false);
    this.animations.add('run',[3,4,5,6,1,2],12, true);
    this.animations.add('jump',[7,8],24, false);
    this.animations.add('freefall',[8,8,8],24, false);
    this.animations.add('endJump',[9,9,9],24, false);
    this.animations.add('hurt',[22,21],24, false);
    this.animations.add('crouch',[9,9,9],12, false);
    this.animations.add('killed',[22,18,19,20,20,20,20,20,20,20,20,20,27,20,27,20,27],12, false);

    this.animations.add('knockDown',[22,18,19,20,20,20],12, false);
    this.animations.add('highKick',[28,28,28,29,30],24,false);
    //this.animations.add('highKick',[30,31,32,33,9,7],12,false);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    for (var i=0;i<30;i++){var proj=new Projectile(game,x,y);proj.kill();}
    for (var i=0;i<3;i++){var explo=new Explosion(game,x,y);explo.kill();}
    this.impact=new Impact(game,x,y);
         
    if(p){this.p=p;}
    this.ray= new Phaser.Line(0, 0, 0, 0);
    this.enableBody = true;
    this.body.width=8*Scale;
    this.body.height=24*Scale;
    this.body.collideWorldBounds = true;  
    this.anchor.setTo(0.5, 0.84);
    this.body.allowGravity=true;
    this.body.acceleration.y=180*Scale;

    this.destX=this.x;
    this.destY=this.y;
    this.play('idle');
    this.controls='mouse';
    this.runSpeed=110*Scale;
    this.jumpSpeed=100*Scale;
    this.jumpForce=170*Scale;
    this.repJump=24*Scale;
    this.repCrouch=-20;
    this.repRun=8*Scale;
    this.openFire=false;
    this.Target=undefined;
    this.ammoClipNbr=3;
    this.ammoClip=30;
    this.ammoClipMax=this.ammoClip;
    this.ammoAltNbr=3;
    this.reloadTime=8;
    this.reloading=0;
    this.isAlive=true;
    this.isHuman=false;
    this.team=undefined;
    this.seekOffSet=24*Scale;

    this.crossDownLimit=Math.round(map.tileHeight*2.3);
    this.twiceTile=map.tileHeight*2;

    this.projImpactAnim='blood';
    this.projType='machineGun';
    this.altProj='grenade';
    this.life=playerLife;
    this.projNbr=0;
    this.firingRate=[1,1,1,1,0];
    //this.projOffSetX=8+8*Scale;
    this.projOffSetX=8+8*Scale;
    this.projOffSetY=5*Scale;
    this.score=0;

    this['projOffSetX_'+'idle']=8+8*Scale;
    this['projOffSetY_'+'idle']=5*Scale;

    this['projOffSetX_'+'run']=17*Scale;
    this['projOffSetY_'+'run']=8*Scale;

    this['projOffSetX_'+'jump']=16+10*Scale;
    this['projOffSetY_'+'jump']=5*Scale;

    this['projOffSetX_'+'freefall']=16+10*Scale;
    this['projOffSetY_'+'freefall']=5*Scale;

    this['projOffSetX_'+'endJump']=12+8*Scale;
    this['projOffSetY_'+'endJump']=12*Scale;

    this['projOffSetX_'+'crouch']=12+8*Scale;
    this['projOffSetY_'+'crouch']=12*Scale;

    this.bounceFxLimit=250;
    this.bounceFx=this.bounceFxLimit;

    //this.bloodEmitter = game.add.emitter(0, 0, 10);
    //this.bloodEmitter.makeParticles('blood');
    //this.bloodEmitter.gravity = 200;
    
   // this.impactEmitter = game.add.emitter(0, 0, 10);
   // this.impactEmitter.makeParticles('impact');
   // this.impactEmitter.gravity = 200;
    this.alive=true;

    this.targetDist=100000;
    this.isShootable=true;
    this.body.bounce.x=0.5;
    this.body.checkCollision.up = false;
    this.nick='undefined';
    this.doubleP=0;
    this.keyCapture=undefined;
    this.keydownDOWN=false;
    this.lastTimeDOWN=game.time.time;
    this.presscount = 0;
    this.strikeProj=null;
    this.luck=Math.round(Math.random()*32);
    this.combatSkills=combatSkillsArray[0]+this.luck;

}




Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {

    if(this.alive===true && UPDATE===true){

           
        
        
        this[this.controls]();
        this[this.animations.currentAnim.name]();//
        this.wheelAction();
        if(this.isHuman===true){game.physics.arcade.overlap(this,items,itemCollidePlayer);}
        

        
    }
 
    
}

Player.prototype.use = function(item) {
        setWeapon(this,item.animName);
        UI.updateStats(this);
        //window['player'+this.p+'Gun']=this.projType;

}


Player.prototype.wheelAction = function() {
        this.targetDist=100000;
        this.Target=undefined;
        //this.openFire=false;
        //this.projNbr=0;
        //if(this.openFire){this.projNbr=0;this.openFire=false;}
        players.forEachAlive(this.getClosestTarget,this);

    if(this.Target!==undefined){
        //if(this.body.y>this.Target.body.y-100 && this.body.y<this.Target.body.y+100){
        
        //this.openFire=false;

        //if(this.scale.x===1 && this.Target.x>this.x || this.scale.x===-1 && this.Target.x<=this.x){


            //if(this.Target.x>this.x){this.scale.x=1;}else{this.scale.x=-1;}



        this.openFire=true; 
        //}
    }

}


Player.prototype.resetParams = function() {
    this.setCollidable();
    this.body.collideWorldBounds = true;
    this.body.immovable=false;
    this.targetDist=100000;
    this.Target=undefined;
    this.openFire=false;
    this.projNbr=0;   
    this.isAlive=true;
    this.life=playerLife;
    setWeapon(this,this.projType);
    this.bounceFx=this.bounceFxLimit;

    this.isShootable=true;
    this.keydownDOWN=false;
    this.presscount = 0;
     this.lastTimeDOWN=game.time.time;
     this.downNOW=0;
     this.keyCapture=undefined;
    if(this.isHuman===true){UI['loadAnim'+this.p].animations.frame=this.reloading;UI.updateStats(this);}
}




Player.prototype.mouse=function (){
this.destX=game.input.worldX;
this.destY=game.input.worldY;
//if(game.input.activePointer.isDown){this.openFire=true;}
}








Player.prototype.keyboard=function (){

if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)===true){this.destX=this.x-this.repJump;this.destY=this.body.y;isMouse=false;}
    else
     if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)===true){this.destX=this.x+this.repJump;this.destY=this.body.y;isMouse=false;} 
 else
if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)===true){
            isMouse=false;

//this.destY=this.y+this.crossDownLimit;
this.destY=this.y+this.repCrouch;
if(this.keydownDOWN===false){
   
   
    this.presscount+=1;
    if(this.presscount>=1 && game.time.time-this.lastTimeDown<400){this.presscount=0;this.destY=this.y+this.crossDownLimit; this.keydownDOWN=false;}else{ this.destY=this.y+this.repCrouch; }
    
    this.keydownDOWN=true;
    this.lastTimeDown=game.time.time;

}






//this.destY=this.body.y+this.crossDownLimit;
            
            
}else{this.keydownDOWN=false;this.destX=this.x+2*this.scale.x;}
      



   
     



   if(game.input.keyboard.isDown(Phaser.Keyboard.UP)===true){
isMouse=false;

if(this.destY>=this.y+this.repCrouch){this.destY=this.body.y;}else{this.destY=this.y-this.repJump;}
    

}





        





        

        

            //if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){this.openFire=true;} 


//if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){this.openFire=true;} 
}

var isMouse=false;
Player.prototype.mouseKeyboard=function (){


this.keyboard();


if(game.input.activePointer.isDown){isMouse=true;}
if(isMouse){this.destX=game.input.worldX;this.destY=game.input.worldY;}

//if(game.input.activePointer.isDown){this.openFire=true;}
}
Player.prototype.botControls=function (){

if(this.Target!==undefined){
this.destX=this.Target.body.x;
this.destY=this.Target.body.y+this.seekOffSet;
}

}

Player.prototype.getClosestTarget = function(obj) {
if(obj.team!==this.team && obj.isAlive===true){

    //this.ray.setTo(this.x, this.body.y+map.tileHeight, obj.x, obj.body.y+map.tileHeight);
   //var dist=lineDistance(this.x, this.body.y+map.tileHeight, obj.x, obj.body.y+map.tileHeight);
this.evalRange(obj,game.physics.arcade.distanceBetween(this, obj));

}

}
    function lineDistance(point1x,point1y,point2x,point2y)
    {
    var xs = 0;
    var ys = 0;
     
    xs = point2x - point1x;
    xs = xs * xs;
     
    ys = point2y - point1y;
    ys = ys * ys;
     
    return Math.sqrt( xs + ys );
    }


Player.prototype.evalRange=function (obj,dist){
if (dist<this.targetDist) {

    if(this.y>obj.y-80 && this.y<obj.y+80){this.targetDist=dist;this.Target=obj;}
    else if(this.isHuman===false && this.Target===undefined){this.targetDist=dist;this.destX=obj.body.x;this.destY=obj.body.y+this.seekOffSet;}
     
     
     
    //if(!this.openFire){this.projNbr=0;}

        //if(obj.x<this.x){this.scale.x=-1}else{this.scale.x=1}
 

    };
}
 //if(!this.isHuman){if(this.x<this.Target.x-120){this.scale.x=1}else if(this.x>this.Target.x+120){this.scale.x=-1}}; 
//if(this.scale.x===1 && obj.x>this.x || this.scale.x===-1 && obj.x<=this.x){  
      //this.targetDist=dist;
      //this.Target=obj; 
      /*       
if(this.y>obj.y-100 && this.y<obj.y+100){ 

                    this.targetDist=dist;
                    this.Target=obj;                     
                   
                    if(!this.openFire){this.projNbr=0;}
                    this.openFire=true;
                    //obj.seekTarget=true;
                }
//}
*/
    

//if(this.Target===undefined || !this.Target.isAlive){ this.openFire=false;this.projNbr=0;};
 //if(this.Target===undefined || !this.Target.isAlive){this.targetDist=this.ray.length;this.Target=obj;this.openFire=false;}

Player.prototype.setProjOffSet=function (){
if(!this['projOffSetX_'+this.animations.currentAnim.name]){
    this.projOffSetX=this['projOffSetX_'+this.animations.currentAnim.name]=8+8*Scale;
    this.projOffSetY=this['projOffSetY_'+this.animations.currentAnim.name]=5*Scale; 
   }else{
    this.projOffSetX=this['projOffSetX_'+this.animations.currentAnim.name];
    this.projOffSetY=this['projOffSetY_'+this.animations.currentAnim.name]; 
   }
}

Player.prototype.weapon=function (){

    if(this.ammoClipNbr<=0){this.reloading=2;}else if(this.reloading>0){this.reloading-=1;}

  if(this.isHuman===true){UI['loadAnim'+this.p].animations.frame=this.reloading;};

if(this.Target!==undefined){ 

    if(this.targetDist<80){

        //if(this.Target.x>this.x){this.scale.x=1}else{this.scale.x=-1};
        //if(this.openFire){this.play('highKick');}
        if(this.y>=this.Target.y || this.body.blocked.down===false){this.fireProj('highKick',this.combatSkills>this.Target.combatSkills);}
        else if(this.reloading===0){this.fireWeapon();};
        



    //if(this.reloading===0){this.fireWeapon();}
// if(this.reloading===0){this.fireWeapon();};
    //this.fireProj();
    //


    }else if(this.reloading===0){this.fireWeapon();};
}else if(this.reloading===0){this.fireWeapon();}; 

//if(this.isHuman){this.openFire=true;this.fireWeapon();}
}


Player.prototype.closeCombat=function (){
//this.fireProj('highKick',this.life>=this.Target.life || this.firingRate[this.projNbr]===0);

}



Player.prototype.fireProj=function (anim,knockdown){


var proj=projectiles.getFirstDead();

    if(proj){
            if(this.Target && this.x<this.Target.x){this.scale.x=1}else if(this.Target){this.scale.x=-1};
            this.strikeProj=proj;
            proj.owner=this;
            proj.team=this.team;
            this.setProjOffSet();
            proj.reset(this.x,this.body.y+8);
            proj.scale.x=this.scale.x;

            //proj.body.bounce.set(1);
            proj.body.velocity.x=800*this.scale.x;
            proj.body.velocity.y=0;
            proj.lifespan=100;
            proj.body.allowGravity=false;
            proj.body.immovable=false;
            proj.damage=32;
            proj.knocksdown=knockdown;
            proj.forceDamage=true;
            proj.explode=false;
            // /this.projNbr=0;
            //this.bringToTop(); 
            this.body.velocity.x=350*this.scale.x;

            proj.play('strike');
            this.play(anim);
           

        }


}

Player.prototype.checkReload=function (){

this.ammoClip=this.ammoClipMax;
this.reloading=this.reloadTime;
if(this.isHuman===true){UI.updateStats(this);sounds.play('reload');} 
}
Player.prototype.fireWeapon=function (){

    
if(this.openFire===true){



    var proj=projectiles.getFirstDead();
    if(proj && this.firingRate[this.projNbr]===1){


    if(this.ammoClipNbr>0){


        if(this.ammoClip>0){
                proj.owner=this;
                proj.team=this.team;
                this.ammoClip-=1;

                this.setProjOffSet();
                proj.reset(this.x+this.projOffSetX*this.scale.x,this.body.y+this.projOffSetY);
                proj.scale.x=this.scale.x;

               //proj.body.bounce.set(this.projBounce);
                proj.body.velocity.x=this.projVelocity*this.scale.x;
                proj.body.velocity.y=0;
                proj.lifespan=this.projLifeSpan;
                
                proj.body.allowGravity=this.projAllowGravit;
                proj.body.immovable=this.projImmovable;
                proj.damage=this.projDamage;
                proj.knocksdown=this.projKnocksdown;
                proj.explode=this.projExplode;
                proj.impactAnim=this.projImpactAnim;
                proj.forceDamage=this.projForceDamage;
                proj.play(this.projType);
                sounds.play(this.projType);

            if(this.isHuman===true){UI.updateStats(this)};   
        }


        }else {this.ammoClipNbr=0;this.ammoClip=0;this.reloading=9;}

        }
        
        this.projNbr+=1;
         
 }
if(this.projNbr>this.firingRate.length){  
    this.projNbr=0;
    if(this.ammoClip<1){this.ammoClipNbr-=1;this.checkReload();}
    if(this.Target===undefined){this.openFire=false;} 
    }  
}
Player.prototype.altFire=function (proj){
if(this.ammoAltNbr>=1){
            this.ammoAltNbr-=1;
            proj.owner=this;
            proj.team=this.team;
            this.setProjOffSet();
            proj.reset(this.x+this.projOffSetX*this.scale.x,this.body.y+this.projOffSetY);
            proj.lifespan=proj.projLifeSpan;
            proj.scale.x=this.scale.x;
            proj.body.velocity.x=800*this.scale.x;
            proj.body.velocity.y=0;
            proj.knocksdown=true;
            proj.play(this.altProj);
            sounds.play(this.altProj);          
}


};


Player.prototype.idle=function (){
this.playerMoves();
this.weapon();
}

Player.prototype.run=function (){
this.playerMoves();
this.weapon();
}

Player.prototype.jump=function (){
if (this.x>this.destX+this.repRun){this.scale.x=-1;this.body.velocity.x = -this.jumpSpeed;}else if (this.x<this.destX-this.repRun){this.scale.x=1;this.body.velocity.x = this.jumpSpeed;}


//if (this.x-this.repRun>this.destX){this.body.velocity.x = -this.runSpeed;}else if (this.x+this.repRun<this.destX){this.body.velocity.x = this.runSpeed;}
//else{this.body.velocity.x = 0;};
this.body.velocity.y = -this.jumpForce;
this.weapon();
this.play('freefall');

//if(this.body.blocked.down){this.play('endJump');}
}

Player.prototype.freefall=function (){

if (this.x>this.destX+this.repRun){this.scale.x=-1;}else if (this.x<this.destX-this.repRun){this.scale.x=1;}
//else{this.body.velocity.x=0;}
//if (this.x-this.repRun>this.destX){this.body.velocity.x = -this.jumpSpeed;}else if (this.x+this.repRun<this.destX){this.body.velocity.x = this.jumpSpeed;}

//if (this.x-this.repRun>this.destX){this.body.velocity.x = -this.runSpeed;}else if (this.x+this.repRun<this.destX){this.body.velocity.x = this.runSpeed;}
//else{this.body.velocity.x = 0;};
if(this.body.checkCollision.down===false && this.animations.currentAnim.isFinished===true){this.setCollidable();}
if(this.body.blocked.down){this.setCollidable();this.play('endJump');}
this.weapon();
}

Player.prototype.endJump=function (){
//this.body.velocity.x=0;
//this.body.drag.x = 3600;
//this.body.drag.x = 550;

this.body.velocity.x=0;
if(this.animations.currentAnim.isFinished===true){
        this.destX=this.body.x+10*this.scale.x;
        this.destY=this.body.y;
        this.play('run');
    }
}



function tileAt(X,Y) { return map.getTileWorldXY(X,Y, map.tileWidth, map.tileHeight, solidLayer);}

Player.prototype.crouch=function (){
this.body.velocity.x=0;
this.isShootable=true;
//this.projNbr=0;
//if(!this.Target || !this.Target.isShootable){this.openFire=false;};


if(!this.body.blocked.down){this.play('freefall');}else{
if (this.x>this.destX+10){this.scale.x=-1;} else if (this.x<this.destX-10){this.scale.x=1;}
if (this.destY<this.y+this.repCrouch-10){this.play('run');}
if(this.destY>=this.body.y+this.crossDownLimit){this.checkCrossDown();} 
}
this.weapon();


if(this.animations.currentAnim.isFinished===true && this.keydownDOWN===true){this.presscount=1;}
}



Player.prototype.checkCrossDown=function (){
  //  if(tile===null){ 
    //tileAt(this.x, this.body.y+this.twiceTile) 
            this.body.velocity.y=this.jumpSpeed;
            this.setUncollidable();

            this.play('crouch');

//}


}



Player.prototype.setUntouchable=function (){

}

Player.prototype.setUncollidable=function (){
//this.body.checkCollision.up=false;
this.body.checkCollision.down=false;
this.body.checkCollision.left=false;
this.body.checkCollision.right=false;
this.isShootable=false;
}

Player.prototype.setCollidable=function (){
//this.body.checkCollision.up=true;
this.body.checkCollision.down=true;
this.body.checkCollision.left=true;
this.body.checkCollision.right=true;
this.isShootable=true;
}





Player.prototype.hurt=function (){


this.isShootable=false;
//this.body.velocity.x*=0.8;
this.body.drag.x = 550;
this.projNbr=0;
if(this.animations.currentAnim.isFinished===true){this.body.drag.x = 0;this.body.velocity.x=0;

        this.destX=this.body.x;
      this.destY=this.body.y;
    this.isShootable=true;this.play('run');
    }
}

Player.prototype.killed=function (){
this.body.drag.x = 550;

this.projNbr=0;
this.isAlive=false;
this.isShootable=false;






if(this.body.blocked.down===true){
    //this.body.drag.x = 750;
   
    if(this.animations.paused===true){this.animations.frame=20;this.animations.paused=false;}

    this.body.velocity.y=0;
    //this.body.collideWorldBounds=false;
    this.body.velocity.y = -this.bounceFx;
    this.bounceFx*=0.5;


    this.setUncollidable();



}else if(this.body.velocity.y<-100){this.animations.paused=true;this.animations.frame=18;}

 if(this.animations.currentAnim.isFinished===true){
    this.body.drag.x = 0;//this.body.collideWorldBounds = false;
    UI.updateTickets(this.team);
    this.kill();
}
    //var tf=this.animations.currentAnim.frame || -1;


}

Player.prototype.knockDown=function (){
this.body.drag.x = 550;
 
this.projNbr=0;

this.isShootable=false;

if(this.body.blocked.down===true){
    //this.body.drag.x = 750;
    if(this.animations.paused===true){this.animations.frame=20;this.animations.paused=false;}
    this.body.velocity.y=0;
    this.body.velocity.y = -this.bounceFx; this.bounceFx*=0.5;
    if(this.animations.currentAnim.isFinished===true){

        this.body.drag.x = 0;
        if(this.life>0){this.isShootable=true;this.play('endJump');}
        else{
            UI.updateTickets(this.team);
            this.isShootable=false;
            this.play('killed');
        }
    }
}else if(this.body.velocity.y<-100){this.animations.paused=true;this.animations.frame=18;}

}

Player.prototype.highKick=function (){
//this.body.drag.x = 1600;


this.isShootable=true;
this.body.velocity.x=0;
//this.body.drag.x = 1500;

    if(this.animations.currentAnim.isFinished===true){
        
       
       // this.destX=this.x+32*this.scale.x;
       this.destX=this.body.x+10*this.scale.x;
       this.play('crouch');
    }


    
}

Player.prototype.playerMoves=function (){
this.isShootable=true;

        if (this.x>this.destX+10){this.scale.x=-1;} else if (this.x<this.destX-10){this.scale.x=1;}

if(this.body.blocked.down===true){
        if(this.destY>this.y-this.repJump && this.destY<this.y+this.repCrouch){
            
            if (this.x-this.repRun>=this.destX){
                this.body.velocity.x = -this.runSpeed;
                this.play('run');          
                }else if (this.x+this.repRun<=this.destX){
                this.body.velocity.x = this.runSpeed;
                this.play('run'); 
                }else{
                this.body.velocity.x = 0;
                this.play('idle');
                }

        }else if(this.destY>=this.y+this.repCrouch) {
                //this.projNbr=0;
                
                this.play('crouch');
        }else if(this.destY<=this.y-this.repJump){
                //if(this.isHuman){this.play('jump');}else{this.body.velocity.x = 0;this.play('idle');}
                this.play('jump');
        }

    }else{this.body.velocity.x=this.runSpeed*this.scale.x;this.play('freefall');}//



}
/*
    }else if(this.destY<this.y-this.repJump){
        this.body.velocity.y = -this.jumpForce;
       this.play('jump');  
    }else{this.play('crouch');}
    */













function parseArray(A,align,maxsize){
var line_Size=30;


    if(align==='left'){
        for (var i=0;i<A.length;i++){
            A[i]=A[i].toString();
            A[i]=A[i].substring(0,11);
            var L=line_Size-A[i].length;
            
                if(L>0){
                    for (var j=0;j<L;j++){A[i]+=' ';}

                        
                }
            }
        }
        else
        if(align==='right'){
            
        for (var i=0;i<A.length;i++){
            var tempTxt='';
            A[i]=A[i].toString();
            A[i]=A[i].substring(0,maxsize);
            var L=line_Size-A[i].length;
            
                if(L>0){
                    for (var j=0;j<L;j++){tempTxt+=' '}
                }
            A[i]=tempTxt+A[i];
            
            }

        }
}

function evalScores(split,namesArray,scoreArray,maxsize) {
    this.HighScoresList=[];
    this.NamesList=[];
this.HighScoresList=scoreArray.slice(0, scoreArray.length);
this.NamesList=namesArray.slice(0, namesArray.length);
parseArray(this.NamesList,'left',maxsize);
parseArray(this.HighScoresList,'right',maxsize);
}








//(game,-180,fontHeight/2,true,8,true,2.5,8)
HighScorePanel = function (game, x, y,split,lineSize,altCol,spacing,maxsize) {
Phaser.Group.call(this, game);
this.deployStep=0;
this.repX=0;
this.repY=0;
//evalScores.call(this,lineSize,split,HighScoresNames,HighScores);


//scoreListTeam1
//nickListTeam1
        //P1portrait.loadTexture(texture);   
         

//0x006fe1 0xdd0000
this.colArrayRainbow=[0xff0000,0xfff000,0x00ff00,0x00ffff,0x0000ff,0xff00ff,0xffffff,0xff0000,0xfff000,0xffffff,0xff0000];
this.colArray=       [0xffffff,0xffffff,0xffcc33,0xff9900,0xff6600,0xff3300,0xdd0000,0xbb0000,0x770000,0x500000,0x500000];
this.colArrayTeam1=  [team1Color,team1Color,team1Color,team1Color,team1Color,team1Color,team1Color,team1Color,team1Color,team1Color,team1Color];
this.colArrayTeam2=  [team2Color,team2Color,team2Color,team2Color,team2Color,team2Color,team2Color,team2Color,team2Color,team2Color,team2Color];
this.membersNbr=10;
this.team=1;


if(split){
    if(altCol){this.colArray=this.colArrayTeam1;this.team=1;}
    else{this.colArray=this.colArrayTeam2;this.team=2;}
    this.membersNbr=window['nickListTeam'+this.team].length;
    evalScores.call(this,split,window['nickListTeam'+this.team],window['scoreListTeam'+this.team],maxsize);
}else{
    //this.membersNbr=HighScoresNames.length;
    this.membersNbr=10;
    evalScores.call(this,split,HighScoresNames,HighScores,maxsize);
}
            this.bkg = game.add.graphics( 0, 0 );
            this.bkg.beginFill('#333333', 1);
            var thisWidth=stageWidth;
            var thisHeight=stageHeight;

   if(split===false){
            this.bkg.bounds = new PIXI.Rectangle(0, 0, thisWidth, thisHeight);
            this.bkg.drawRect(0, 0, thisWidth, thisHeight);
            this.bkg.boundsPadding = 0;
            this.add(this.bkg);
    }
            this.fontScreen = game.add.graphics( 0, 0 );
            this.add(this.fontScreen);

            var colInt1=184608512;  
            var colInt2=Math.round(colInt1/11);
            this.margin=fontHeight/2;
            this.addSection(null,25,'WORLD TOP TEN',null,null,null,null,"gameFont1SansBIG",24);
            
            if(split){
                //this.fontScreen.getChildAt(0).visible=false;this.bkg.visible=false;
                this.fontScreen.getChildAt(0).visible=false;
            }
            else{this.fontScreen.getChildAt(0).x=stageWidth/2-(this.fontScreen.getChildAt(0).width/2)}
            
     
            if(spacing){this.YSpacing=spacing}


            this.maxSlotNbr=8;


if(split){
this.marginY=fontHeight*4;
            for (var i=0;i<this.maxSlotNbr;i++){
                if(i<this.membersNbr){ this.addSection(null,this.marginY+fontHeight*i*this.YSpacing,this.NamesList[i],this.HighScoresList[i],maxsize,2,true); }
                else { this.addSection(null,this.marginY+fontHeight*i*this.YSpacing,"---                           ","                             -",maxsize,0.5,null); }

                
            }
            this.membersNbr=this.maxSlotNbr;
            this.delayII=0;
            this.delay=0;
            this.subDelay=this.delayII;
            this.delayHidden=0;
            this.delayVisible=0; 

}else{
this.marginY=49+fontHeight*2;
            for (var i=0;i<this.membersNbr;i++){
             
                this.addSection(null,this.marginY+fontHeight*i*this.YSpacing,this.NamesList[i],this.HighScoresList[i],maxsize,1,true);
            
            }

            this.delayII=highScorePanelDelays;
            this.delay=highScorePanelDelays;
            this.subDelay=this.delayII;
            this.delayHidden=game.time.time+highScorePanelStartDelay;
            this.delayVisible=game.time.time+highScorePanelStartDelay;     
}
            
            this.ind_c=0; 



            this.deployStep=-1;
            this.fontScreen.alpha=0;

            this.fOut=true;
            this.fadeSpeed=0.02;         
            this.x=x;
            this.y=y;
            this.highlight1st=false;
            this.split=split;
     


           
};


HighScorePanel.prototype = Object.create(Phaser.Group.prototype);
HighScorePanel.prototype.constructor = HighScorePanel;



HighScorePanel.prototype.update = function() {
if(game.time.time> this.delayHidden){

this.delayHidden=game.time.time+this.delay;
if(!this.visible){this.deployStep=-1;this.delay=this.delayII;this.delayVisible=game.time.time+this.subDelay;}
    

}

else
if(game.time.time> this.delayVisible){
    
    this.delayVisible=game.time.time+this.subDelay;
    if(this.visible===true){this.deployStep=-1;this.delayHidden=game.time.time+this.delay;}



    
}


this.deploy();
};

HighScorePanel.prototype.initPanel = function(obj){
//obj.y=0;
obj.alpha=0;

};




HighScorePanel.prototype.deploy = function(){



if(this.ind_c<this.membersNbr){
  if(this.highlight1st===true){this.fontScreen.getChildAt(1).tint = this.colArrayRainbow[Math.round(this.ind_c)];}
  this.ind_c+=0.4;}else{this.ind_c=0;}

//if(Math.round(this.ind_c/2)%2===0){this.fontScreen.getChildAt(1).tint=0xffff00;}else{this.fontScreen.getChildAt(1).tint=0xffffff;};
//if(HighScoresNames.indexOf(playerNick)>-1){this.fontScreen.getChildAt(HighScoresNames.indexOf(playerNick)).tint=this.fontScreen.getChildAt(Math.round(this.ind_c)).tint;}
this.fontScreen.getChildAt(0).tint=this.fontScreen.getChildAt(Math.round(this.ind_c)).tint;
this.fontScreen.getChildAt(Math.round(this.ind_c)).tint=this.colArray[Math.round(this.ind_c)];

if (this.deployStep===-1){
this.fOut=!this.fOut;
this.deployStep=0.1;
    

for (var i=0;i<this.membersNbr+1;i++){
var OBJ=this.fontScreen.getChildAt(Math.round(i));

if(!this.fOut){OBJ.alpha=OBJ.maxAlpha;}else{OBJ.alpha=0;};
}

}else if(Math.round(this.deployStep)<this.membersNbr){
    this.deployStep+=this.fadeSpeed*10;

    //

    var OBJ=this.fontScreen.getChildAt(Math.round(this.deployStep));
//---                -
    if(this.split===true){
        //if(OBJ.isSomething){OBJ.alpha=2;}else {OBJ.textField.text="e";};//}
      OBJ.alpha=2;

        //else if(Math.round(this.deployStep<8)){OBJ.alpha=0.5}

    
    } else{

         if(Math.round(this.deployStep)<=10){OBJ.alpha=OBJ.maxAlpha;}
    }

    //OBJ.y=3*this.iStep+this.margin;
    if(this.fOut===true){if(this.fontScreen.alpha<=OBJ.maxAlpha-this.fadeSpeed*2){this.fontScreen.alpha+=this.fadeSpeed*2;}}else{if(this.fontScreen.alpha>0.1){this.fontScreen.alpha-=this.fadeSpeed;}};
    
if(this.fontScreen.alpha>=0.2 && this.fontScreen.alpha<=1){this.bkg.alpha=this.fontScreen.alpha-0.2}    
}



if(this.fontScreen.alpha<=0.1 && this.split===false){this.visible=false;}else{this.visible=true;}



};

//
HighScorePanel.prototype.addSection = function(X,Y,txt,score,maxsize,alpha,isSomething,Font,FontHeight){


            if(Font){this.sectionText = game.add.retroFont(Font,FontHeight,FontHeight, fontString, fontStringLength, 0, 0);}
                else{this.sectionText = game.add.retroFont('gameFont1Sans', Math.round(fontHeight), Math.round(fontHeight), fontString, fontStringLength, 0, 0);}

            
            this.sectionText.text=txt;

            if(score){
                this.sectionText.text+=''+score;
                //this.sectionText.text=txt_.replace(/   /g,' ');
                var txt_=this.sectionText.text;
                var redTxt='';
                redTxt=txt_.substring(0,11)+' '+txt_.substring(txt_.length-maxsize,txt_.length);
                this.sectionText.text=redTxt;
            };
    


            this.section = game.add.image(0, 0, this.sectionText);
            this.section.textField=this.sectionText;

                   this.section.x=X;
                 this.section.y=Y;
            if(X==null){this.section.x=parseInt(stageWidth/2) - parseInt( ((this.sectionText.text.length)*fontHeight)/2 );}
            else{this.section.x=X};
            if(Y==null){this.section.y=parseInt(stageHeight/2)-parseInt(fontHeight/2);}
            else{this.section.y=Y};
            this.section.maxAlpha=2;
            this.section.isSomething=isSomething;
            if(alpha){this.section.maxAlpha=alpha};
            this.fontScreen.addChild(this.section);
};






var game = new Phaser.Game(stageWidth, stageHeight, Phaser.CANVAS,'',null,false,false);

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('InitScreen', Game.InitScreen);
game.state.add('CopyrightScreen', Game.CopyrightScreen);
game.state.add('LogoScreen', Game.LogoScreen);
game.state.add('IntroScreen', Game.IntroScreen);

game.state.add('MainMenuScreen', Game.MainMenuScreen);
game.state.add('OptionsMenuScreen', Game.OptionsMenuScreen);
game.state.add('CharacterSelect', Game.CharacterSelect);
game.state.add('DemoMode', Game.DemoMode);
game.state.add('Levels', Game.Levels);
game.state.add('LevelEnd', Game.LevelEnd);
game.state.add('GameOver', Game.GameOver);
game.state.add('GameEnd', Game.GameEnd);


game.state.start('Boot');
