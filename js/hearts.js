// var widthDevice = screen.width;
// var heightDevice = screen.height;

var widthDevice = window.innerWidth;
var heightDevice = window.innerHeight;

var realCardWidth = 200;
var realCardHeight = 250;
var scale = ((widthDevice/15) * 1) / realCardWidth;
var widthCard = realCardWidth * scale;
var heightCard = realCardHeight * scale;
var offset = 0;
var spaceToolBar=215;
var cardOffsetY = heightDevice - heightCard - spaceToolBar;
var cardPosition = 1;

console.log("Card width: "+widthCard);
console.log("Car height: "+heightCard);

/**
    breaks = 320, 480, 720, 768, 900, 1024, 1200
    200px = 100%
    96px  =
    screen.width = 1440
    widthCard = 100
    height = 125
    
**/

var layer = new collie.Layer({
    width: widthDevice,
    height: heightDevice
});

// Load the 52 images 
collie.ImageManager.add({
    C1: "images/C1.png",
    C2: "images/C2.png",
    C3: "images/C3.png",
    C4: "images/C4.png",
    C5: "images/C5.png",
    C6: "images/C6.png",
    C7: "images/C7.png",
    C8: "images/C8.png",
    C9: "images/C9.png",
    C10: "images/C10.png",
    C11: "images/C11.png",
    C12: "images/C12.png",
    C13: "images/C13.png",
    D1: "images/D1.png",
    D2: "images/D2.png",
    D3: "images/D3.png",
    D4: "images/D4.png",
    D5: "images/D5.png",
    D6: "images/D6.png",
    D7: "images/D7.png",
    D8: "images/D8.png",
    D9: "images/D9.png",
    D10: "images/D10.png",
    D11: "images/D11.png",
    D12: "images/D12.png",
    D13: "images/D13.png",
    S1: "images/S1.png",
    S2: "images/S2.png",
    S3: "images/S3.png",
    S4: "images/S4.png",
    S5: "images/S5.png",
    S6: "images/S6.png",
    S7: "images/S7.png",
    S8: "images/S8.png",
    S9: "images/S9.png",
    S10: "images/S10.png",
    S11: "images/S11.png",
    S12: "images/S12.png",
    S13: "images/S13.png",
    H1: "images/H1.png",
    H2: "images/H2.png",
    H3: "images/H3.png",
    H4: "images/H4.png",
    H5: "images/H5.png",
    H6: "images/H6.png",
    H7: "images/H7.png",
    H8: "images/H8.png",
    H9: "images/H9.png",
    H10: "images/H10.png",
    H11: "images/H11.png",
    H12: "images/H12.png",
    H13: "images/H13.png",
    cBack: "images/back_.png",
    cBackHorizontal: "images/backHorizontal.png"
    // spriteClubs: "images/spritesClubs.png"
}, function(){ console.log("Imagen cargada 1.");});

var box = new collie.DisplayObject({
    width : widthDevice * 0.3,
    height : heightDevice * 0.3,
    x : (widthDevice/2) - ((widthDevice * 0.3)/2),
    y : (heightDevice/2) - ((heightDevice * 0.3)/2),
    backgroundColor : 'gray'
}).addTo(layer)

var jsonCards = 
[{"player1":["C1","C2","C9","C12","C13","D6","D12","D13","S10","S11","H2","H11","H12"]},{"player2":["C5","C8","D1","D3","D7","D8","D10","S3","S12","H3","H5","H7","H13"]},{"player3":["C6","D2","D4","D5","D11","S2","S5","S8","S9","S13","H1","H4","H9"]},{"player4":["C3","C4","C7","C10","C11","D9","S1","S4","S6","S7","H6","H8","H10"]}];
// console.log(cards);
var Deck = function(){
    this.cards = new Array();
}

Deck.prototype.addCard = function( card ){
    this.cards.push( card );
}
var playerDeck = new Deck();
var oSelectedDisplayObject = null;
var htStartPosition = {};
var htSelectedDisplayObjectPosition = {};


function drawDeck(){
    var position=0;
    $.each(jsonCards[0].player1, function( key , cardValue ){
        console.log( key +" -> " + cardValue); 

        var tmpCard = new collie.DisplayObject({
            x: (widthCard*(cardPosition+(position++)))+offset,
            y: cardOffsetY,
            scaleX:scale,
            scaleY:scale,
            originX: 'left',
            originY: 'bottom',
            useEvent : true,
            backgroundImage: cardValue
            // velocityRotate: 50
        }).addTo(layer);

        // Animations
        var currentY = tmpCard.get("y");
        tmpCard.attach({
            mousedown : function (oEvent) {
                // console.log("[displayobject] mousedown");
                // if (oEvent.displayObject) {
                //     console.log("over card...");
                //     oSelectedDisplayObject = oEvent.displayObject;
                //     console.log(oSelectedDisplayObject.get("scaleX"));
                //     oEvent.displayObject.set({
                //         scaleX : oEvent.displayObject.get("scaleX") * 1.2,
                //         scaleY : oEvent.displayObject.get("scaleY") * 1.2
                //     });
                //     console.log(oSelectedDisplayObject.get("scaleX"));
                //     // oSelectedDisplayObject = oEvent.displayobjectplayObject;
                //     htStartPosition = {
                //         x : oEvent.x,
                //         y : oEvent.y 
                //     };
                //     htSelectedDisplayObjectPosition = {
                //         x : oSelectedDisplayObject.get("x"),
                //         y : oSelectedDisplayObject.get("y")
                //     };
                // }
            },
            mouseup : function (oEvent) {
                // if (oSelectedDisplayObject !== null) {
                //     console.log("regresando valores");
                //     oEvent.displayObject.set({
                //         scaleX : oSelectedDisplayObject.get("scaleX") / 1.2,
                //         scaleY : oSelectedDisplayObject.get("scaleY") / 1.2
                //     });
                //     oSelectedDisplayObject = null;
                //     htSelectedDisplayObjectPosition = htStartPosition = {};
                    
                //     layer.removeChild(oEvent.displayObject);
                //     layer.addChild(oEvent.displayObject);
                // }
            },
            mousemove : function (oEvent) {
                console.log("moving...");
                console.log(oEvent);
                if (oEvent.displayObject) {
                    console.log("over card...");
                    oEvent.displayObject.set({
                        scaleX : oEvent.displayObject.get("scale") * 1.2,
                        scaleY : oEvent.displayObject.get("scale") * 1.2
                    });
                    oSelectedDisplayObject = oEvent.displayObject;
                    htStartPosition = {
                        x : oEvent.x,
                        y : oEvent.y 
                    };
                    htSelectedDisplayObjectPosition = {
                        x : oSelectedDisplayObject.get("x"),
                        y : oSelectedDisplayObject.get("y")
                    };
                }
            },         
            click: function (oEvent) {
                // Perform specific motion
                var nScale = Math.random()*0.4+0.6; 
                // console.log(oEvent.displayObject);           
                collie.Timer.queue().
                    transition( tmpCard, 200, {
                        to: [oEvent.displayObject.get("y") - 140, (widthDevice/2) - ((widthCard)/2)],             // sinusoidal
                        effect: collie.Effect.easeOutBack, // sinusoidal easeIn, //collie.Effect.cubicBezier(0.16, 0.79, 0.92, 0.27),
                        set: ["y","x"]
                    });
                        // .
                        // transition(cQ, 400, {
                        //     to: currentX,
                        //     effect: collie.Effect.easeIn,
                        //     set: "x"
                        // });
                // oEvent.displayObject.set({
                //     angle : 45, //Math.random() * 360 | 0, 
                //     scaleY : nScale,
                //     scale : nScale
                // });
            }                        
        });

        playerDeck.addCard(tmpCard);
    });
}


function drawDecksVsPlayers(){
    var posX=10;
    var posY=0;
    var cardPosition=1;
    var position=1;
    var cardOffsetY = (heightDevice/2) - (heightCard*13);
    console.log(cardOffsetY+(heightCard*(cardPosition+(position++))));
    //cardOffsetY+(heightCard*(cardPosition+(position++)))
    // player left
    for(var i = 0; i < 13 ; i++){
        var tmpCard = new collie.DisplayObject({
            x: posX, 
            y: cardOffsetY+(heightCard*(cardPosition+(position++))),
            scaleX:scale,
            scaleY:scale,
            originX: 'left',
            originY: 'bottom',
            useEvent : true,
            backgroundImage: 'cBackHorizontal'
            // velocityRotate: 50
        }).addTo(layer);
    }
}




// Attach animation for all layer
layer.attach({

});


collie.Renderer.addLayer(layer);
collie.Renderer.load(document.getElementById("container"));
collie.Renderer.start();
drawDeck();
// drawDecksVsPlayers();






window.onresize = function(event) {
  width = window.innerWidth
  height = window.innerHeight

  // x = (width * (x/prevWidth));
  // y = (height * (y/prevHeight));
  x = width * 0.2;
  y = height * 0.2;
  rectWidth = width * 0.5;
  rectHeight = height * 0.5;

  prevWidth = width;
  prevHeight = height;

  canvas.setAttribute('width',width);  
  canvas.setAttribute('height',height);

  draw( );
}