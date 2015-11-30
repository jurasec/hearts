var C = {},
    D = {},
    S = {},
    H = {},
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
    initialPosition = null,

    newSprite = null,
    socket = null,


    positionTurn = {  // inicia a las 6:00 hacia la izquierda   
                      'turn3' : { 
                          x : canvasSize.w / 2,  // rect( x, y, 81, 100);
                          y : canvasSize.h / 2 - cardSize.h / 2 - 10
                      } ,
                      'turn4' : { 
                          x : canvasSize.w / 2 + cardSize.w / 2 + 20,   // rect( x + 40 + 10, y + 50, 81, 100);
                          y : canvasSize.h / 2
                      } ,
                      'turn1' : { 
                          x : canvasSize.w / 2,   // rect( x, y + 105, 81, 100);   6:00
                          y : canvasSize.h / 2 + cardSize.h / 2 + 10
                      },
                      'turn2' : { 
                          x : canvasSize.w / 2 - cardSize.w / 2 - 20,   // rect( x - 40,  y + 50, 81, 100); 
                          y : canvasSize.h / 2
                      } 
                  },

    x = canvasSize.w / 2 - 40, 
    y = canvasSize.h / 2 - 101,

    // initialPositions = { 'top' : { x: canvasSize.w / 2 , y:0, angle: 90, direction: 0}, 
    //                      'right' : { x: canvasSize.w, y: canvasSize.h / 2, angle: 180, direction: -1 }, 
    //                      'left': { x:0, y: canvasSize.h / 2, angle: 0, direction: 1} },

    initialPositions = { 'top' : { x: canvasSize.w / 2 , y: 0, 
                                   x2: canvasSize.w / 2, y2: canvasSize.h / 2 - cardSize.h / 2 - 10, 
                                   angle: 90, direction: 0}, 
                         'right' : { x: canvasSize.w, y: canvasSize.h / 2, 
                                     x2: canvasSize.w / 2 + cardSize.w / 2 + 20, y2: canvasSize.h / 2,
                                     angle: 180, direction: -1 }, 
                         'left': { x:0, y: canvasSize.h / 2, 
                                   x2: canvasSize.w / 2 - cardSize.w / 2 - 20, y2: canvasSize.h / 2,
                                   angle: 0, direction: 1} },

    cardsSpritesInRound = [],
    currentTurn = null,

    div = null,
    nickName = null,
    playerNumber = 0;

// consolelog();


function preload() {

  for( var i=0; i <13; i++ ) {
    C[i] = {};
    C[i].name = 'C' + (i + 1);
    C[i].img = loadImage('images/C' + (i + 1) + '.png');
    D[i] = {};
    D[i].name = 'D' + (i + 1);
    D[i].img = loadImage('images/D' + (i + 1) + '.png');
    S[i] = {};
    S[i].name = 'S' + (i + 1);
    S[i].img = loadImage('images/S' + (i + 1) + '.png');
    H[i] = {};
    H[i].name = 'H' + (i + 1);
    H[i].img = loadImage('images/H' + (i + 1) + '.png');
  }
}

function setup() {
  rectMode(CENTER);

  div = createDiv('');
  var label = createElement('label','Nickname: ');
  nickName = createInput('');
  var button = createButton('Entrar');

  button.mousePressed( buttonmMousePressedEvent );
  
  label.parent( div );
  nickName.parent( div );
  button.parent( div );

  createCanvas( canvasSize.w ,canvasSize.h );
  
  io.on('users', function( data ){
    console.log("Respuesta del server => " , data.info);
  });

  io.on('game:cardPlayed', function( data ){

    // esto no deberia de suceder
    if( data.lastTurn != playerNumber ) {//return;

      console.log('Es el turno del jugador -> ', data.turn, ' y esta jugando la carta -> ', data.card);
      $('#msgServer').html( 'Server: Es el turno del jugador -> ' + data.turn );
      
      currentTurn = 'turn'+data.lastTurn;

      var num = parseInt(data.card.substring(1));        

      var card = data.card[0] == 'H' ? H[ num - 1 ] : data.card[ 0 ] == 'D' ? D[ num - 1 ] : data.card[ 0 ] == 'S' ? S[ num - 1 ] : C[ num - 1 ];
      console.log('La carta jugada es ->  ', card, ' numero -> ', num, ' data.card[0] -> ', data.card[0]);
      console.log('Suit de la carta jugada ->  ', card);
      
      console.log('Getting initial and final position for currentTurn -> ', currentTurn, ' and playerNumber -> ', playerNumber);
      // console.log('Getting final position for currentTurn -> ', currentTurn, ' and playerNumber -> ', playerNumber);
      console.log('La posición inicial de la animación es (x, y) -> ',getInitialPositionTurn( data.lastTurn ).x , getInitialPositionTurn( data.lastTurn ).y );
      console.log('La posición final de la animación es (x, y) -> ',getFinallPositionTurn( data.lastTurn ).x , getFinallPositionTurn( data.lastTurn ).y );

      initialPosition = getInitialPositionTurn( data.lastTurn );

      newSprite = createSprite( initialPosition.x , initialPosition.y );
      newSprite.addImage( card.img );
      newSprite.scale = scaleCard;
      newSprite.mouseActive = true;
      newSprite.debug = true;
      newSprite.card = card.name;

      cardsSpritesInRound.push( newSprite );
    }

    if( data.roundFinished ){
      console.log('Dando un tiempo para animación final de ronda, jugador que come las cartas -> ', data.playerWhoEats);
      setTimeout( function(){
        console.log('Iniciando animación... ');
        for(var index=0; index < cardsSpritesInRound.length ; index++){
          cardsSpritesInRound[ index ].setSpeed( 20, 90);
        }
        cardsSpritesInRound = [];
      } , 5000);      
    }

  });

}

function draw() {
  background(240);    

  var c = color(255, 204, 0);  // Define color 'c'
  fill(c);  // Use color variable 'c' as fill color
  //noStroke();  // Don't draw a stroke around shapes
  rect( positionTurn.turn1.x, positionTurn.turn1.y, cardSize.w, cardSize.w );
  c = color(255,0,0);  // Define color 'c'
  fill(c);  // Use color variable 'c' as fill color
  //noStroke();  // Don't draw a stroke around shapes
  rect( positionTurn.turn2.x, positionTurn.turn2.y, cardSize.w, cardSize.w );
  c = color(0,255,0);  // Define color 'c'
  fill(c);  // Use color variable 'c' as fill color
  //noStroke();  // Don't draw a stroke around shapes
  rect( positionTurn.turn3.x, positionTurn.turn3.y, cardSize.w, cardSize.w );
  c = color(0,0,255);  // Define color 'c'
  fill(c);  // Use color variable 'c' as fill color
  //noStroke();  // Don't draw a stroke around shapes
  rect( positionTurn.turn4.x, positionTurn.turn4.y, cardSize.w, cardSize.w );

  c = color(0,0,0);  // Define color 'c'
  fill(c);
  text( 'Point1( ' + positionTurn.turn1.x  + ', '  + positionTurn.turn1.y + ')', positionTurn.turn1.x - 50, positionTurn.turn1.y );
  text( 'Point2( ' + positionTurn.turn2.x  + ', '  + positionTurn.turn2.y + ')', positionTurn.turn2.x - 50, positionTurn.turn2.y );
  text( 'Point3( ' + positionTurn.turn3.x  + ', '  + positionTurn.turn3.y + ')', positionTurn.turn3.x - 50, positionTurn.turn3.y );
  text( 'Point4( ' + positionTurn.turn4.x  + ', '  + positionTurn.turn4.y + ')', positionTurn.turn4.x - 50, positionTurn.turn4.y );
  
  // stroke( 0 );
  line( 22, 510, 122 , 510 );
  
  line( canvasSize.w / 2, 0, canvasSize.w / 2 , canvasSize.h );
  line( 0, canvasSize.h / 2,  canvasSize.w , canvasSize.h / 2 );

  if( currentSpriteCard && !moveEnd ){
    // a = 180/pi * arctan((y2-y1)/(x2-x1))
    if( initialCardPosition.x > positionTurn.turn3.x  ){
      angle = 180/Math.PI * atan( ( initialCardPosition.y - positionTurn.turn3.y ) / ( initialCardPosition.x - positionTurn.turn3.x ) ) ;
      angle = -(90 + ( 90 - angle ));
      console.log( '1.- angle -> ', angle);
    }
    else
      angle = 180/Math.PI * atan( ( positionTurn.turn3.y - initialCardPosition.y ) / ( positionTurn.turn3.x - initialCardPosition.x ) );
    
    angle = angle > 1 ? angle * -1 : angle;
    console.log('2.- angle -> ' + angle);

    console.log('---> currentSpriteCard -> ');
    console.log( currentSpriteCard );

    currentSpriteCard.setSpeed( 50, angle );
    moveEnd = true;
  }
  
  // las coordenadas del turn1 es el spot que estaq justo en frente de cada jugador
  if( currentSpriteCard &&  currentSpriteCard.position.y <=  positionTurn.turn1.y  ) {
    console.log( currentSpriteCard);
    // console.log( 'ya valio' );
    // currentSpriteCard.velocity.x = (450 - currentSpriteCard.position.x) / 50;
    // currentSpriteCard.velocity.y = (300 - currentSpriteCard.position.y) / 50;
    text( 'Moving( ' + currentSpriteCard.position.x  + ', '  + currentSpriteCard.position.y + ')', 50, 400 );

    // se corrige la posición final
    currentSpriteCard.position.x = positionTurn.turn1.x;
    currentSpriteCard.position.y = positionTurn.turn1.y;

    currentSpriteCard.velocity.x=0;
    currentSpriteCard.velocity.y=0;
    currentSpriteCard = null;
    moveEnd = false;

    broadCastDrewCard( currentSpriteCard );

  }

  // if( newSprite && currentTurn == 'turn1') {
  //   newSprite.setSpeed( 20, 90); // top position
  // }else if( newSprite && currentTurn == 'turn2') {
  //   newSprite.setSpeed( 20, 180); // right position
  // }else if( newSprite && currentTurn == 'turn4') {
  //   newSprite.velocity.x = 20 ; // left position
  // }

  if( newSprite ){
    newSprite.setSpeed( 10, initialPosition.angle );
    console.log('El angulo de animación es  -> ', initialPosition.angle);
    text( 'Moving( ' + newSprite.position.x  + ', '  + newSprite.position.y + ')', 50, 370 );
  }

  if( newSprite &&  initialPosition.direction == 0 && newSprite.position.y >= initialPosition.y2 ) {
    console.log(' direction 0 -> ', initialPosition.direction );
    newSprite.velocity.x = 0;
    newSprite.velocity.y = 0;
    newSprite = null;

  }else if( newSprite &&  initialPosition.direction == 1 && newSprite.position.x >= initialPosition.x2 ){
    console.log(' direction 1 -> ', initialPosition.direction );
    newSprite.velocity.x = 0;
    newSprite.velocity.y = 0;
    newSprite = null;
  }else if( newSprite &&  initialPosition.direction == -1 && newSprite.position.x <= initialPosition.x2 ){
    console.log(' direction -1 -> ', initialPosition.direction );
    newSprite.velocity.x = 0;
    newSprite.velocity.y = 0;
    newSprite = null;
  }
  // if( newSprite &&  currentTurn == 'turn1' && newSprite.position.y  >= positionTurn.turn1.y ) {

    /* top position  */
  //   newSprite.velocity.x=0; 
  //   newSprite.velocity.y=0;    
  //   newSprite = null;
  // }

  // if( newSprite &&  currentTurn == 'turn2' && newSprite.position.x  <= positionTurn.turn2.x ) {

    /* right position  */
  //   newSprite.velocity.x=0; 
  //   newSprite.velocity.y=0;    
  //   newSprite = null;
  // }


  // if( newSprite &&  currentTurn == 'turn4' && newSprite.position.x  >= positionTurn.turn4.x ) {

    /* right position */
  //   newSprite.velocity.x=0; 
  //   newSprite.velocity.y=0;    
  //   newSprite = null;
  // }

  drawSprites();
}

function buttonmMousePressedEvent(  ){
  console.log( 'nickname: ', nickName.value() );
  io.emit('game:join', { nick: nickName.value()}, function( data ){

      if( data.joined ){
        var cards = '';

        playerNumber = data.playerNumber;
        console.log('Player number -> ', playerNumber);


        $('canvas').css('display', 'inline');

      /**
      * Creación de los sprites para dibujar las cartas de la mano inicial
      **/
      for(var i in data.hand){
        var num = parseInt(data.hand[ i ].substring(1));
        i = parseInt(i);
          //console.log('i', i ,'Suit -> ', data.hand[i][0], ' - card ->', data.hand[i], ' - num -> ', num, ' - offset -> ', '');
          // console.log('initialOffset ', initialOffsetX, 'offset ', offset , '(i + 1) ', (i + 1), ' realWidthCard ', realWidthCard, ' scaleCard ', scaleCard, ' res -> '
            // , ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ));

        switch( data.hand[i][0] ){
          case 'H':
            console.log('creating sprite card -> ', H[ num - 1 ].name);
            // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
            handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ) , offsetY , 0, 0 );
            handSprites[ i ].addImage( H[ num - 1 ].img );
            handSprites[ i ].scale = scaleCard;
            handSprites[ i ].mouseActive = true;
            handSprites[ i ].debug = true;
            handSprites[ i ].card = H[ num -1 ].name;
            // console.log( handSprites[ i ] );
           
            break;
          case 'S':
            console.log('creating sprite card -> ', S[ num - 1 ].name);
            // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
            handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ) , offsetY , 0, 0 );
            handSprites[ i ].addImage( S[ num - 1 ].img );
            handSprites[ i ].scale = scaleCard;
            handSprites[ i ].mouseActive = true;
            handSprites[ i ].debug = true;
            handSprites[ i ].card = S[ num -1 ].name;
            // console.log( handSprites[ i ] );
           
            break;

          case 'D':
            console.log('creating sprite card -> ', D[ num - 1 ].name);
            // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
            handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ) , offsetY , 0, 0 );
            handSprites[ i ].addImage( D[ num - 1 ].img );
            handSprites[ i ].scale = scaleCard;
            handSprites[ i ].mouseActive = true;
            handSprites[ i ].debug = true;
            handSprites[ i ].card = D[ num -1 ].name;
            // console.log( handSprites[ i ] );
           
            break;
          case 'C':
            console.log('creating sprite card -> ', C[ num - 1 ].name);
            // console.log( 'offset: ' + (100 + ceil( offset * (i + 1) )) + ' - (realWidthCard * scaleCard) ' + (realWidthCard * scaleCard) );
            handSprites[ i ] = createSprite( ( initialOffsetX + ceil( offset * (i + 1) ) - (realWidthCard * scaleCard) / 2 + 8 ) , offsetY , 0, 0 );
            handSprites[ i ].addImage( C[ num - 1 ].img );
            handSprites[ i ].scale = scaleCard;
            handSprites[ i ].mouseActive = true;
            handSprites[ i ].debug = true;
            handSprites[ i ].card = C[ num -1 ].name;
            // console.log( handSprites[ i ] );
           
            break;



        }
      
        handSprites[ i ].onMousePressed = function() {
          console.log( 'Carta ' , this.card );                          

          initialCardPosition.x = this.position.x;
          initialCardPosition.y = this.position.y;
          var sprideCardTemp = this;

          io.emit('game:playCard', { card: this.card },function( data ){
            console.log( 'status ->', data.msg );
            $('#msgServer').html('Server: ' + data.msg);  // Actualiza el estatus del tipo
            if( data.isCardPlayable ){
              currentSpriteCard = sprideCardTemp;
              console.log('currentSpriteCard -> ');
              console.log( currentSpriteCard );
              this.depth = depth++;
              cardsSpritesInRound.push( newSprite );
            } else {
              // probablmente habria que actualizar algún estado
            }

          });
        }
      }
    

        

        $('#jugadores').append( '<div> ' + nickName.value() + '</div>' );

      }else{
        $('#msgServer').text('Mesa llena :-[');
      }

      div.remove()
      console.log( data.joined )
  });  
}

function mousePressed() {
  //I create a sprite at mouse position
  // newSprite = createSprite( initialPositions.top.x , initialPositions.top.y );
  // newSprite = createSprite( initialPositions.right.x , initialPositions.right.y );
  // newSprite = createSprite( initialPositions.left.x , initialPositions.left.y );
  // newSprite.addImage( D[ 0 ].img );
  // newSprite.scale = scaleCard;
  // newSprite.mouseActive = true;
  // newSprite.debug = true;
  // newSprite.card = D[ 0 ].name;
}

function broadCastDrewCard( currentSpriteCard ){
  io.emit('');
}


// obtiene la posición inicial para la animación de la carta tirada por otro jugador.
function getInitialPositionTurn( currentTurn ){
  
  switch( currentTurn ){
    case 1: 
        switch( playerNumber ){
          case 2: return initialPositions.right;
          case 3: return initialPositions.top;
          case 4: return  initialPositions.left;
        }
      break;
    case 2: 
      switch( playerNumber ){
          case 1: return initialPositions.left;
          case 3: return initialPositions.right;
          case 4: return  initialPositions.top;
        }
      break;
    case 3: 
      switch( playerNumber ){
          case 1: return initialPositions.top;
          case 2: return initialPositions.left;
          case 4: return  initialPositions.right;
        }
      break;
    case 4: 
      switch( playerNumber ){
          case 1: return initialPositions.right;
          case 2: return initialPositions.top;
          case 3: return  initialPositions.left;
        }
      break;
  }
}

// obtiene la posición final para la animación de la carta tirada por otro jugador.
function getFinallPositionTurn( currentTurn ){

  // console.log('getting final position for currentTurn -> ', currentTurn, ' and playerNumber -> ', playerNumber);
  switch( currentTurn ){
    case 1: 
        switch( playerNumber ){
          case 2: return positionTurn.turn4;
          case 3: return positionTurn.turn3;
          case 4: return  positionTurn.turn2;
        }
      break;
    case 2: 
      switch( playerNumber ){
          case 1: return positionTurn.turn2;
          case 3: return positionTurn.turn4;
          case 4: return  positionTurn.turn3;
        }
      break;
    case 3: 
      switch( playerNumber ){
          case 1: return positionTurn.turn3;
          case 2: return positionTurn.turn2;
          case 4: return  positionTurn.turn4;
        }
      break;
    case 4: 
      switch( playerNumber ){
          case 1: return positionTurn.turn4;
          case 2: return positionTurn.turn3;
          case 3: return  positionTurn.turn2;
        }
      break;
  }

}