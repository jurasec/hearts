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
    currentSpriteCard = null;


function preload() {
  // img = loadImage('images/C1.png');
  for(var i=0; i <13; i++){
    C[i] = {};
    C[i].name = 'C' + (i + 1);
    C[i].img = loadImage('images/C' + (i + 1) + '.png');
    D[i] = loadImage('images/D' + (i + 1) + '.png');
    S[i] = loadImage('images/S' + (i + 1) + '.png');
    H[i] = loadImage('images/H' + (i + 1) + '.png');
  }
}

function setup() {
  createCanvas(900,600);
  var s = createSprite( 900/2, 600/2, 80, 120);
  for( var i=0; i<13; i++){
    // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
    handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8) , offsetY , 0, 0);
    handSprites[ i ].addImage( C[ i ].img );
    handSprites[ i ].scale = scaleCard;
    handSprites[ i ].mouseActive = true;
    handSprites[ i ].debug = true;
    // console.log( handSprites[ i ] );
    handSprites[ i ].onMousePressed = function() {
      console.log( this );
      currentSpriteCard = this;
      this.velocity.x = (450 - this.position.x) / 50;
      this.velocity.y = (300 - this.position.y) / 50;
      // this.velocity.x = 450;
      // this.velocity.y = 300;
    }
  }
  
  // s.scale = 0.4;
  // console.log('w ', s.width, ' - h ', s.height);
}

function draw() {
  background(240);  

  if( currentSpriteCard && currentSpriteCard.position.y <= 300 ) {
    // currentSpriteCard.velocity.x = (450 - currentSpriteCard.position.x) / 50;
    // currentSpriteCard.velocity.y = (300 - currentSpriteCard.position.y) / 50;
    currentSpriteCard.velocity.x=0;
    currentSpriteCard.velocity.y=0;
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