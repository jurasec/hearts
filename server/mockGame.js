var TableGame = require('./game.js'),
    Bot = require('./bot.js');


var nextHand = true;
var game;

while(  nextHand ){

  game = new TableGame();
  bot1 = new Bot( game.addPlayer( 1, 'player1' ), game );
  bot2 = new Bot( game.addPlayer( 2, 'player2' ), game );
  bot3 = new Bot( game.addPlayer( 3, 'player3' ), game );
  bot4 = new Bot( game.addPlayer( 4, 'player4' ), game );

  while(game.cardsPlayed<52){
    bot1.playCard();
    bot2.playCard();
    bot3.playCard();
    bot4.playCard();
  }


  for( var i in game.getPlayers() ){
    // console.log( player );
    console.log('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );
    // logger.debug('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );

    if( game.getPlayers()[ i ].getPoints() == 26 ) {
      nextHand=false;
    }
  }
}


// var p = new Player(1);
// console.log(p);
// p.setNickName( 'jurasec' );
// console.log(p);


// var hand1;
// console.log( 'Creating game and shuffling deck' );
// var game = new TableGame();
// console.log( game.getDeck() );
// console.log( 'deck length: ', game.getDeck().length );
// console.log( 'ingresa un jugador1');
// console.log( game.addPlayer( '1', 'player1' ) );
// console.log( 'ingresa un jugador2');
// console.log( game.addPlayer( '2', 'player2' ) );


// bot1 = new Bot( game.addPlayer( 1, 'player1' ), game );
// bot2 = new Bot( game.addPlayer( 2, 'player2' ), game );
// bot3 = new Bot( game.addPlayer( 3, 'player3' ), game );
// bot4 = new Bot( game.addPlayer( 4, 'player4' ), game );

// console.log('Players');
// console.log(game.getPlayers());

// console.log(' ================== Hands ==================  ');
// console.log('player 1 [', bot1.getPlayerHand().toString(), ']' );
// console.log('player 2 [', bot2.getPlayerHand().toString(), ']' );
// console.log('player 3 [', bot3.getPlayerHand().toString(), ']' );
// console.log('player 4 [', bot4.getPlayerHand().toString(), ']' );


// logger.debug(' ================== Hands ==================  ');
// logger.debug('player 1 [', bot1.getPlayerHand().toString(), ']' );
// logger.debug('player 2 [', bot2.getPlayerHand().toString(), ']' );
// logger.debug('player 3 [', bot3.getPlayerHand().toString(), ']' );
// logger.debug('player 4 [', bot4.getPlayerHand().toString(), ']' );


// for( var i in game.getPlayers() ){
//   // console.log( player );
//   console.log('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );
//   logger.debug('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );  
// }


// console.log( 'ingresa un jugador3');
// console.log( game.addPlayer( '3', 'player3' ) );
// console.log( 'ingresa un jugador4');
// console.log( game.addPlayer( '4', 'player4' ) );
// console.log( 'player 1 => ', game.getPlayer('1') );
// console.log( 'player 2 => ', game.getPlayer('2') );
// console.log( 'player 3 => ', game.getPlayer('3') );
// console.log( 'player 4 => ', game.getPlayer('4') );
// console.log( 'players => ', game.getPlayers() );
// var hand = game.drawCards( game.getDeck(), 5, '', true);
// console.log( 'deck length: ', game.getDeck().length );
// console.log( 'deck ', game.getDeck() );
// console.log( 'my hand', hand );
// console.log( 'drawing 1 card ', game.drawCards( game.getDeck(), 1, hand , false) );
// console.log( 'my hand', hand );
// console.log( 'deck length: ', game.getDeck().length );
  // var hand = game.getPlayer('1').getHand();
  // console.log( 'playing the last card', game.playCard( -1, 1, hand) );
  // console.log( 'playing the last card again', game.playCard( -1, 1, hand) );
  // console.log( 'my hand', game.getPlayer('1').getHand() );
// console.log( 'my hand', hand );
// console.log( 'pack length: ',game.getDeck().length );
