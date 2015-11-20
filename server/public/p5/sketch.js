var C = {},
    D = [],
    S = [],
    H = [],
    handSprites = [],
    initialOffsetX = 100,
    offsetY = 510
    realWidthCard = 200,
    scaleCard = 0.4,
    offset = 700 / 13,
    canvasSize = { w : 900, h : 600 },
    cardSize = { w : 80, h : 100 },
    currentSpriteCard = null,
    angle = 0.0,
    moveEnd = false,
    depth = 1,
    initialCardPosition = { x:0,y:0},


    positionTurn = { 
                      'turn1' : { 
                          x : canvasSize.w / 2,  // rect( x, y, 81, 100);
                          y : canvasSize.h / 2 - cardSize.h / 2 - 10
                      } ,
                      'turn2' : { 
                          x : canvasSize.w / 2 + cardSize.w / 2 + 20,   // rect( x + 40 + 10, y + 50, 81, 100);
                          y : canvasSize.h / 2
                      } ,
                      'turn3' : { 
                          x : canvasSize.w / 2,   // rect( x, y + 105, 81, 100);
                          y : canvasSize.h / 2 + cardSize.h / 2 + 10
                      },
                      'turn4' : { 
                          x : canvasSize.w / 2 - cardSize.w / 2 - 20,   // rect( x - 40,  y + 50, 81, 100); 
                          y : canvasSize.h / 2
                      } 
                  };

    x = canvasSize.w / 2 - 40, 
    y = canvasSize.h / 2 - 101;

// consolelog();


function preload() {
  // img = loadImage('images/C1.png');
  for( var i=0; i <13; i++ ) {
    C[i] = {};
    C[i].name = 'C' + (i + 1);
    C[i].img = loadImage('images/C' + (i + 1) + '.png');
    D[i] = loadImage('images/D' + (i + 1) + '.png');
    S[i] = loadImage('images/S' + (i + 1) + '.png');
    H[i] = loadImage('images/H' + (i + 1) + '.png');
  }
}

function setup() {
  rectMode(CENTER);
  createCanvas( canvasSize.w ,canvasSize.h );
  // var s = createSprite( 900/2, 600/2, 80, 120);
  for( var i=0; i<13; i++){
    // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
    handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ) , offsetY , 0, 0 );
    handSprites[ i ].addImage( C[ i ].img );
    handSprites[ i ].scale = scaleCard;
    handSprites[ i ].mouseActive = true;
    handSprites[ i ].debug = true;
    handSprites[ i ].card = C[ i ].name;
    // console.log( handSprites[ i ] );
    handSprites[ i ].onMousePressed = function() {
      console.log( 'Carta ' , this.card );      
      currentSpriteCard = this;
      this.depth = depth++;
      // this.velocity.x = (450 - this.position.x) / 50;
      // this.velocity.y = (300 - this.position.y) / 50;
      initialCardPosition.x = this.position.x;
      initialCardPosition.y = this.position.y;
      // console.log( 'Card(x,y) -> (', initialCardPosition.x ,', ' , initialCardPosition.y, ') - P(x,y) -> (',positionTurn.turn3.x,',', positionTurn.turn3.y );
      // this.velocity.x = 450;
      // this.velocity.y = 300;
    }
  }

  // ellipse(50, 50, 80, 80);
  // line( 10, 10, 100, 200);  
  
  // s.scale = 0.4;
  // console.log('w ', s.width, ' - h ', s.height);
}

function draw() {
  background(240);    

  rect( positionTurn.turn1.x, positionTurn.turn1.y, cardSize.w, cardSize.w );
  rect( positionTurn.turn2.x, positionTurn.turn2.y, cardSize.w, cardSize.w );
  rect( positionTurn.turn3.x, positionTurn.turn3.y, cardSize.w, cardSize.w );
  rect( positionTurn.turn4.x, positionTurn.turn4.y, cardSize.w, cardSize.w );

  text( 'Point1( ' + positionTurn.turn3.x  + ', '  + positionTurn.turn3.y + ')', positionTurn.turn3.x - 50, positionTurn.turn3.y );
  
  line( 22, 510, 122 , 510 );
  
  line( canvasSize.w / 2, 0, canvasSize.w / 2 , canvasSize.h );
  line( 0, canvasSize.h / 2,  canvasSize.w , canvasSize.h / 2 );

  if( currentSpriteCard && !moveEnd ){
    // a = 180/pi * arctan((y2-y1)/(x2-x1))
    if( initialCardPosition.x > positionTurn.turn3.x  ){
      angle = 180/Math.PI * atan( ( initialCardPosition.y - positionTurn.turn3.y) / ( initialCardPosition.x - positionTurn.turn3.x) ) ;
      angle = -(90 + ( 90 - angle ));
      console.log( '1.- angle -> ', angle);
    }
    else
      angle = 180/Math.PI * atan( ( positionTurn.turn3.y - initialCardPosition.y ) / ( positionTurn.turn3.x - initialCardPosition.x) );
    
    angle = angle > 1 ? angle * -1 : angle;
    console.log('2.- angle -> ' + angle);
    currentSpriteCard.setSpeed( 50, angle);
    moveEnd = true;
  }
  
  if( currentSpriteCard &&  currentSpriteCard.position.y <= ( positionTurn.turn3.y ) ) {
    // currentSpriteCard.velocity.x = (450 - currentSpriteCard.position.x) / 50;
    // currentSpriteCard.velocity.y = (300 - currentSpriteCard.position.y) / 50;
    text( 'Moving( ' + currentSpriteCard.position.x  + ', '  + currentSpriteCard.position.y + ')', 50, 400 );

    // se corrige la posición final
    currentSpriteCard.position.x = positionTurn.turn3.x;
    currentSpriteCard.position.y = positionTurn.turn3.y;

    currentSpriteCard.velocity.x=0;
    currentSpriteCard.velocity.y=0;
    currentSpriteCard = null;
    moveEnd = false;
  }
  // else if( currentSpriteCard && currentSpriteCard.position.y >= 300 )
  // {
  //   currentSpriteCard.velocity.x=0;
  //   currentSpriteCard.velocity.y=0;
  // }

  // for( var i=0; i<13; i++){
  //   if( handSprites[ i ].overlapPoint( mouseX, mouseY ) ){
  //     console.log('Mouse into');
  //   }
  // }

  // if( mouseIsPressed ) console.log(' mouse pressed');

  drawSprites();
}

function mousePressed( button ){

// function mousePressed ( button ){
  // console.log( button );
}