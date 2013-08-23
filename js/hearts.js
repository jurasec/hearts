// var widthDevice = screen.width;
// var heightDevice = screen.height;

var widthDevice = window.innerWidth;
var heightDevice = window.innerHeight;

// ancho real de la carta (sin escalar)
var realCardWidth = 200;
// alto real de la carta (sin escalar)
var realCardHeight = 250;
// proporción de escalamiento
var scale = ( ( widthDevice / 15 ) * 1 ) / realCardWidth;
// ancho de la carta escalada
var widthCard = realCardWidth * scale;
// alto de la carta escalada
var heightCard = realCardHeight * scale;
// valor para ajustar algunos desplazamientos de las cartas
var offset = 0;
// valor temporal para restar el ancho de la barra de busqueda
var spaceToolBar= 215;
// valor del eje Y para saber donde debe dibujarse las cartas del jugador
var cardOffsetY = heightDevice - heightCard - spaceToolBar;
// contardo de turnos
var currentTurn = 1;

var jsonCards = 
[{"player1":["C1","C2","C9","C12","C13","D6","D12","D13","S10","S11","H2","H11","H12"]},{"player2":["C5","C8","D1","D3","D7","D8","D10","S3","S12","H3","H5","H7","H13"]},{"player3":["C6","D2","D4","D5","D11","S2","S5","S8","S9","S13","H1","H4","H9"]},{"player4":["C3","C4","C7","C10","C11","D9","S1","S4","S6","S7","H6","H8","H10"]}];
// var jsonDroppedCards = { turno1:"", turno2:"", turno3:"", turno4:"", turno5:"", turno6:"", turno7:"", turno8:"", turno9:"", turno10:"", turno11:"", turno12:"", turno13:""};


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

// objeto principal sobre el que se dibujan el resto de objetos
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

// gray box
var box = new collie.DisplayObject({
    width : widthDevice * 0.3,
    height : heightDevice * 0.3,
    x : ( widthDevice / 2 ) - ( ( widthDevice * 0.3 ) / 2 ),
    y : ( heightDevice / 2 ) - ( ( heightDevice * 0.3 ) / 2 ) - 40,
    backgroundColor : 'gray'
}).addTo(layer)

/* ****************************************************************************************************************************** */
// representa las cartas del jugador
var Deck = function(){
    this.cards = new Array();
}

Deck.prototype.addCard = function( card ){
    this.cards.push( card );
}

Deck.prototype.getCards = function( ){
    return this.cards;
}
/* ****************************************************************************************************************************** */

var playerDeck = new Deck();
// var oSelectedDisplayObject = null;
// var htStartPosition = {};
// var htSelectedDisplayObjectPosition = {};


function drawDeck(){
    var cardPosition = 1;
    var leftSideValue = -1;
    var rightSideValue = -1;
    var cardsPlayer = jsonCards[ 0 ].player1;
    var cardValue='';
    
    // $.each(jsonCards[0].player1, function( key , cardValue ){
    for(var i = 0; i < cardsPlayer.length; i++){

        cardValue = cardsPlayer[ i ];
        /**
         * se va comprando si existe una carta a la izquierda o la derecha, de existir se asocia, para tener estos
         * valores en cualquier momento.
         **/
        if(cardPosition == 0){
            leftSideValue = -1;
            rightSideValue = cardsPlayer[ i + 1 ]
        }
        else if( cardPosition == 13){
            leftSideValue = cardsPlayer[ i - 1 ];
            rightSideValue = -1;
        }
        else{
            leftSideValue = cardsPlayer[ i - 1 ];
            rightSideValue = cardsPlayer[ i + 1 ]
        }

        // se crea el objeto que representa una carta según sea cardValue.
        var tmpCard = new collie.DisplayObject({
            x: ( widthCard * ( cardPosition ) ) + offset,
            y: cardOffsetY,
            scaleX: scale,
            scaleY: scale,
            originX: 'left',
            originY: 'bottom',
            useEvent : true,
            backgroundImage: cardValue,
            cPosition: cardPosition - 1,
            leftSide: leftSideValue,
            rightSide: rightSideValue,
            dropped: false
            // velocityRotate: 50
        }).addTo( layer );

        cardPosition++;

        // se configuran las animaciones y la respuesta al evento click/touch
        var currentY = tmpCard.get( 'y' );
        tmpCard.attach({
            click: function ( oEvent ) {        
                collie.Timer.queue().
                    transition( oEvent.displayObject, 200, {                        
                        to: [ oEvent.displayObject.get( 'y' ) - 170, ( widthDevice / 2 ) - ( ( widthCard ) / 2 ) ],  // sinusoidal
                        effect: collie.Effect.easeOutBack, // sinusoidal easeIn, //collie.Effect.cubicBezier(0.16, 0.79, 0.92, 0.27),
                        set: [ 'y', 'x' ]
                    });
                
                // se envian las cartas siempre al frente de todas.
                oEvent.displayObject.set({
                        zIndex: 1
                    }
                );
                // indicamos que la carta ha sido jugada.
                oEvent.displayObject.set({
                    dropped: true
                });

                // jsonDroppedCards["turno"+currentTurn]= oEvent.displayObject.get('backgroundImage');
                currentTurn++;
                reAlign(oEvent.displayObject);                        
            }                        
        });

        playerDeck.addCard( tmpCard );
    // });
    }
}

function reAlign( cardDropped ){
    var deck = playerDeck.getCards();
    var posXRef = cardDropped.get( 'x' );
    // for(var i = 0; i < playerDeck.getCards().length; i++){
        // console.log("carta ["+(i+1)+"]: "+ deck[i].get("backgroundImage"));
    // }
    console.log('leftSide: '+cardDropped.get( 'leftSide' )+', rightSide: '+cardDropped.get( 'rightSide' ));
    if( cardDropped.get( 'leftSide' ) == -1 || cardDropped.get( 'rightSide' ) == -1) {
        console.log('no se hace nada.');
        return;
    }
    else{
        console.log('dropped: ['+cardDropped.get('dropped')+'] se recorren las cartas de la izquierda a derecha, inicia con: '+( cardDropped.get('cPosition') - 1) );
        // recorre las cartas que estan a la izquierda de la carta elegida
        for( var i = ( cardDropped.get( 'cPosition' ) - 1 ) ; i >= 0 ; i--){
            if( !deck[ i ].get( 'dropped' ) ){
                console.log('moviendo carta en posicion: '+ i);
                console.log('moviendo: '+deck[ i ].get( 'backgroundImage' ) );
                collie.Timer.queue().
                        transition( deck[ i ], 200, {
                            to: deck[ i ].get( 'x' ) + ( widthCard / 2 ),
                            effect: collie.Effect.easeOutBack, // sinusoidal easeIn, //collie.Effect.cubicBezier(0.16, 0.79, 0.92, 0.27),
                            set: 'x'
                        });
            }
        }

        console.log('se recorren las cartas de la derecha a la izquierda, inicia con: '+( cardDropped.get('cPosition') + 1 ));
        // recorre las cartas que estan a la derecha de la carta elegida
        for( var i = ( cardDropped.get( 'cPosition' ) + 1 ) ; i <=   12 ; i++){
            if( !deck[ i ].get( 'dropped' ) ){
                console.log('moviendo carta en posicion: '+ i);
                // console.log('moviendo: '+deck[ i ].get('backgroundImage'));
                collie.Timer.queue().
                        transition( deck[ i ], 200, {
                            to: deck[ i ].get( 'x' ) - ( widthCard / 2 ),
                            effect: collie.Effect.easeOutBack, // sinusoidal easeIn, //collie.Effect.cubicBezier(0.16, 0.79, 0.92, 0.27),
                            set: 'x'
                        });
            }
        }
    }


}

// dibuja las cartas del openente
function drawDecksVsPlayers(){
    var posX = 10;
    var posY = 0;
    var cardPosition = 1;
    var position = 1;
    var cardOffsetY = ( heightDevice / 2 ) - 360;
    console.log("heightDevice: "+heightDevice+", cardOffsetY: "+cardOffsetY);
    // console.log(cardOffsetY+(heightCard*(cardPosition+(position++))));
    //cardOffsetY+(heightCard*(cardPosition+(position++)))

    // player left
    for(var i = 0; i < 13 ; i++){    
        cardOffsetY+= 30;
        // console.log("cardOffsetY: "+cardOffsetY);
        var tmpCard = new collie.DisplayObject({
            x: 0, 
            y: cardOffsetY,
            scaleX: scale,
            scaleY: scale,
             originX: 'center',
            // originY: 'left',
            backgroundImage: 'cBackHorizontal'
            // velocityRotate: 50
        }).addTo( layer );
    }

    // player top
    var noCards = 13;
    var spotLength = ( heightDevice / 3 ) * 2;
    posX=( widthDevice / 2 ) - ( spotLength / 2 );
    var offset = spotLength / noCards;
    
    for(var i = 0; i < 13 ; i++){    
        posX+= offset;
        // console.log("cardOffsetY: "+cardOffsetY);
        var tmpCard = new collie.DisplayObject({
            x: posX, 
            y: 10,
            scaleX: scale,
            scaleY: scale,
            originX: 'left',
            originY: 'top',
            backgroundImage: 'cBack'
            // velocityRotate: 50
        }).addTo(layer);
    }

    // player right
    var cardOffsetY = ( heightDevice / 2 ) - 360;    
    for(var i = 0; i < 13 ; i++){    
        cardOffsetY+= 30;
        // console.log("cardOffsetY: "+cardOffsetY);
        var tmpCard = new collie.DisplayObject({
            x: widthDevice - widthCard - 160, 
            y: cardOffsetY,
            scaleX:scale,
            scaleY:scale,
             originX: 'center',
            // originY: 'left',
            backgroundImage: 'cBackHorizontal'
            // velocityRotate: 50
        }).addTo( layer );
    }
}



// Attach animation for all layer
layer.attach({
     // mousemove : function (oEvent) {
     //            console.log("moving...");
     //            console.log(oEvent);
     //            if (oEvent.displayObject) {
     //                console.log("over card...");
     //                oEvent.displayObject.set({
     //                    scaleX : oEvent.displayObject.get("scale") * 1.2,
     //                    scaleY : oEvent.displayObject.get("scale") * 1.2
     //                });
     //                oSelectedDisplayObject = oEvent.displayObject;
     //                htStartPosition = {
     //                    x : oEvent.x,
     //                    y : oEvent.y 
     //                };
     //                htSelectedDisplayObjectPosition = {
     //                    x : oSelectedDisplayObject.get("x"),
     //                    y : oSelectedDisplayObject.get("y")
     //                };
     //            }
     //        }
});



/* ----------------------------------------------------------------------------------------------------------------*/

collie.Renderer.addLayer( layer );
collie.Renderer.load( document.getElementById( 'container' ) );
collie.Renderer.start();
drawDeck();
// drawDecksVsPlayers();
/* ----------------------------------------------------------------------------------------------------------------*/

window.onresize = function( event ) {
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

  canvas.setAttribute( 'width', width );
  canvas.setAttribute( 'height', height );

  // reDraw( );
}