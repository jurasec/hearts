var logger = require('./logger.js');


function Room(){

}

function TableGame(){  

  this.createDeck = function() {
    
    var suits = ["H", "C", "S", "D"];
    var deck = [];
    var n = 52;
    var index = n / suits.length;

    var count = 0;
    for(i = 0; i <= 3; i++)
        for(j = 1; j <= index; j++){
            deck[count++] = suits[i] + j;
        }    

    return deck;
  }

  // Fisher-Yates algorithm.
  this.shuffleDeck = function ( deck ) {  
    var index = deck.length, j, tempCard;
    if (index === 0) return false;
    while ( --index ) {
       randomIndex = Math.floor(Math.random() * (index + 1));
       tempCard = deck[ index ];
       deck[ index ] = deck[ randomIndex ];
       deck[ randomIndex ] = tempCard;
     }
    return deck;
  }

  this.drawCards = function( deck, amount, hand, initialHand ) {  
    var cards = [];
    cards = deck.slice(0, amount);

    deck.splice(0, amount);

    if ( !initialHand ) {

      if( !(hand instanceof Array) )
        throw ("the object hand must be Array's type");

      hand.push.apply( hand, cards );
    }

    return cards;
  }

  // cuando un nuevo jugador se 'sienta' en la mesa, se le otorga su correspondiente mano inicial
  this.addPlayer = function( id, nick ){
    var player = new Player( id );
    player.setHand( this.drawCards( this.getDeck(), 13, '',  true ) );


    /* Verifica si tiene el 2 de treboles */
    // console.log('checking for C2 => ', this.mustLead( player.getHand() ));
    if( this.mustLead( player.getHand() ) ){
      this.playerLead = player.getID();
      console.log('player to lead => ', this.playerLead);
    }

    player.setNickName( nick );
    player.setNumber( Object.keys( this.players ).length==0 ? 1 : Object.keys( this.players ).length + 1 );
    this.players[ id ] = player;
    this.players[ id ].point = 0; // se agrega propiedad para llevar el contro de puntos obtenidos.
    // this.playersIDs.push( id ); // para mantener temporalmente el orden de turnos

    return player;
  }

  // this.playCard = function( index, amount, hand ) {  
  //   var card = hand.splice( index, amount )[0];

  //   if ( !this.isCardPlayable( card ).isCardPlayable ){
  //     return this.isCardPlayable( card );
  //   }

  //   this.setLastCardOnTable( card );        
  //   return hand;
  // }
  this.playCard = function( index, card, hand, player ) {  
    // 

    if ( !this.isCardPlayable( card, hand ).isCardPlayable ){
      // return this.isCardPlayable( card, hand );
      // return callback( this.isCardPlayable( card, hand ) );
      console.log( 'Carta [ ', card, ' ] NO jugable, causa => ', this.isCardPlayable( card, hand ).cause , ' -> del tipo => ', this.higherCardOnTurn);
      return false;
    }
    
    var cardSpliced = hand.splice( index, 1 )[0];

    this.cardsPlayed++;  

    if( cardSpliced[0] === 'H' ) this.heartsThisRound++;
    else if( cardSpliced === 'S13' ) this.heartsThisRound+=13;
    // console.log( 'card spliced => ', cardSpliced, ' must be equals to card param => ',  card );        


    //---------------------------> playerWhoEats Implementar, quien se come las cartas
    // if( this.saveFirstCard ){ //se guarda la primer carta de cada mano

    //   this.saveFirstCard = false;

    // }else

    console.log('|===> Carta jugada => ', card, ' Player => ', player.getID());
    logger.debug('-> No. ', this.cardsPlayed, ' -> Carta jugada => ', card, ' -> Player => ', player.getID());
    this.playerWhoEats = this.checkPlayerToEat( card, player );    
    if( this.cardsPlayed%4 == 0){ // al final de cada 4º turno, se verifica quien debe tomar las cartas y sumar puntos
      console.log('          ==============> El jugador que debe comer las cartas es => ', this.playerWhoEats);
      logger.debug('==> El jugador que debe comer las cartas es => ', this.playerWhoEats );
      this.saveFirstCard = true;
      this.setLastCardOnTable("");
      this.higherCardOnTurn = "";
      this.playerLead = this.playerWhoEats;      
      this.players[this.playerWhoEats].addPoints( this.heartsThisRound );
      console.log('Se han sumando ', this.heartsThisRound, ' puntos al jugador ', this.playerWhoEats);
      this.heartsThisRound = 0;
      var idPlayer = this.checkShootTheMoon();
      if( idPlayer )
        console.log(" SHOOOOOOOOOOOOOOOOOOOOTTTTTTIIIIIIIIIIINNNNNNNNNNNNGGGGGGGGGGGGGGG THE MOOOOOOONNNNNNN !!!!!!!!! => Player " , idPlayer);
      else console.log("There isn't shoting the moon :-[");
      

      console.log('---------------------------------------------------------------------------------------------------------------------------------');
    }else{
      this.playerLead = (this.playerLead) >= this.maxPlayers ? 1 : (this.playerLead + 1);
    }  

    this.setLastCardOnTable( card );
    // console.log('card lead => ', card, ' this.playerLead => ', this.playerLead, ' this.maxPlayers => ', this.maxPlayers);
    
    
    console.log("Siguiente turno para el jugador  => ", this.playerLead);

    // if( this.cardsPlayed == 52 ){
    //   this.cardsPlayed = 1;
    // }

    return true;
    // return callback( null, hand);
    // return hand;
  }

  this.isCardPlayable = function( card, hand ){

    var suitCardToPlay = card[0];
    // console.log('card', card);
    // console.log('card[0]', card[0]);
    // console.log('suitCardToPlay', suitCardToPlay);

    if( this.turn === 1 && card!='C2' ){
      return { isCardPlayable:false , cause: 'Debes elegir el 2 de treboles.'};
    }
    else if( this.turn === 1 && card=='C2' ){
      this.turn++;
      return { isCardPlayable:true , cause: 'La carta es jugable.'};
    }
    if( !this.heartsHaveBeenBroken && suitCardToPlay === 'H' && (this.cardsPlayed%4 == 0))
      return { isCardPlayable:false , cause: 'Aún no se han jugado corazones.'};    
    else if( this.isFreeSuit( hand ) ){
      this.turn++;
      console.log('|--------------------> This turn is free suit - card ', card, ' --- this.higherCardOnTurn ', this.higherCardOnTurn);

      if( suitCardToPlay==='H' )
        this.heartsHaveBeenBroken = true;

      return  { isCardPlayable:true , cause: 'La carta es jugable.'};
    }
    else if( this.higherCardOnTurn!="" && (this.higherCardOnTurn[0] !== suitCardToPlay) )
      return { isCardPlayable:false , cause: 'La carta debe de ser del mismo palo.', suit: suitCardToPlay};
    
    console.log({ isCardPlayable:true , cause: 'La carta es jugable.'});
    this.turn++;
    return { isCardPlayable:true , cause: 'La carta es jugable.'};
  }

  this.checkPlayerToEat = function( card, player ){    
    console.log( ' parseInt( card.substring(1) -> ', parseInt( card.substring(1) ), ' parseInt(this.higherCardOnTurn.substring(1)) -> ', parseInt(this.higherCardOnTurn.substring(1)));
    if( this.higherCardOnTurn === "" ){
      this.higherCardOnTurn = card;
      return player.getID();
    }
    else if( card[0] != this.higherCardOnTurn[0] ){
      // this.higherCardOnTurn = card;
      return this.playerWhoEats;
    } 
    else if( parseInt( card.substring(1) ) == 1 ){
      console.log('Se ha tirado una carta A');
      this.higherCardOnTurn = card;
      return player.getID(); // Carta juada un A
    }
    else if( parseInt(this.higherCardOnTurn.substring(1)) == 1){
      return this.playerWhoEats;
    }
    else if( parseInt( card.substring(1)) >  parseInt(this.higherCardOnTurn.substring(1)) ){
      this.higherCardOnTurn = card;
      return player.getID();
    }
    else return this.playerWhoEats;
  }

  this.isFreeSuit = function( hand ){
    // hand.forEach( function( card, key){
    //   if( this.getLastCardOnTable()[0] === card[0] )
    //     return false;      
    // });
    for(var index in hand){
      if( this.higherCardOnTurn[0] === hand[ index ][0] ) // se comprueba contra la carta más alta, para asegurar que debe tirar el mismo palo
        return false;      
    }
    // console.log('This turn is free suit');
    return true;
  } 


  this.checkShootTheMoon = function( player ){
    for(var index in this.players){
      if( this.players[ index ].points == 26){
        for(var index2 in this.players){
          this.players[ index ].points = 0;
          if( index == index2 ) {
            this.players[ index ].subtractPoints( 26 );
            continue;
          }
          else this.players[ index2 ].addPoints( 26 );
        }
        return index;
      }else return null;
    }
  }

  /**
    * Verifica si tiene el 2 de treboles
    */
  this.mustLead = function( hand ){
    // hand.forEach( function( card, key){
    //     console.log('mustLead - card => ', card);
    //     if( card === 'C2' ){
    //       console.log('C2 was found !!!');
    //       return true;
    //     }
    // });
    for( var index in hand){
      console.log('mustLead? card => ', hand[ index ]);
      if( hand[ index ] === 'C2' ){
        console.log('C2 was found !!!');
        return true;
      }
    }
    return false;
  }

  this.getPlayer = function( id ){
    return this.players[ id ];
  }

  this.removePlayer = function ( id ){
    delete this.players[ id ];
  }

  this.getPlayers = function(){
    return this.players;
  }

  this.setLastCardOnTable = function( card ){
    this.lastCardOnTable = card;
  }

  this.getLastCardOnTable = function(){
    return this.lastCardOnTable;
  }

  this.getPlayerToLead = function(){
    return this.playerLead;
  }

  this.getPlayerToPlay = function(){
    var currentPlayerTurn = this.playersIDs[ this.turn++ ];
    this.turn = this.turn === this.playersIDs.length ? 0 : this.turn;
    return currentPlayerTurn;
  }

  this.getDeck = function(){
    return this.deck;
  }

  // this.isCardPlayable = function( card ){

  //   var suitCardToPlay = card[0];
  //   console.log('card', card);
  //   console.log('card[0]', card[0]);
  //   console.log('suitCardToPlay', suitCardToPlay);

  //   if( this.turn === 1 && card!='C2' ){
  //     return { isCardPlayable:false , cause: 'Debes elegir el 2 de treboles'};
  //   }
  //   else if( !this.heartsHaveBeenBroken && suitCardToPlay === 'H')
  //     return { isCardPlayable:false , cause: 'Aún no se han jugado corazones.'};
  //   else if( this.lastCardOnTable!="" && (this.getLastCardOnTable()[0] !== suitCardToPlay) )
  //     return { isCardPlayable:false , cause: 'La carta debe de ser del mismo palo.'};
  //   console.log({ isCardPlayable:true , cause: 'La carta es jugable.'});
  //   return { isCardPlayable:true , cause: 'La carta es jugable.'};
  // }  


  this.handNumber = 1;
  this.turn = 1;
  this.playerLead = 1;
  this.deck = this.shuffleDeck( this.createDeck() );
  this.maxPlayers = 4;
  this.players = {};
  this.playersIDs = [];
  this.cardsPlayed = 0;
  this.playerWhoEats = 1;
  this.saveFirstCard = true;
  // this.playerToPlay = 1;
  this.lastCardOnTable = "";
  this.higherCardOnTurn = "";
  this.heartsHaveBeenBroken = false;
  this.heartsThisRound = 0;
  this.id = "";

}

// function Table(){

// }

function Player( id ){

  this.id = id;
  this.number = 0;
  this.nick = '';
  this.hand = [];
  this.points = 0;

  this.getID = function(){
    return this.id;
  }

  this.setNickName = function( nick ){
    this.nick = nick;
  }

  this.getNickName = function(){
    return this.nick;
  }

  this.setNumber = function( number ){
    this.number = number;
  }

  this.getNumber = function(){
    return this.number;
  }

  this.setHand = function( hand ){
    this.hand = hand;
  }

  this.getHand = function( ){
    return this.hand;
  }

  this.setPoints = function( points ){
    this.points = points;
  }

  this.addPoints = function( points ){
    this.points += points;
  }

  this.subtractPoints = function( points ){
    this.points -= points;
  }

  this.getPoints = function(){
    return this.points;
  }
}

function Bot( player, game ){

  this.player = player;
  this.game = game;

  this.isMyTurn = function(){
      console.log('Bot -> ', this.player.getID() , ' ask, is my turn?', this.player.getID()==this.game.getPlayerToLead());

      if( this.game.getPlayerToLead() == this.player.getID() ){
        console.log( 'Turn of player ', this.player.getID() );
        return true;
      }
      return false;
  }

  this.playCard = function(){

    if( this.isMyTurn() )

      // this.player.getHand().forEach( function( card, key ){
      //     if( !game.playCard( key, card, this.player.getHand()) )
      //       return true;
      // });
      for(var index in this.player.getHand() ){
       console.log( 'Carta a probar index ', index, this.player.getHand()[ index ] ,' --- Hand => ', this.player.getHand().toString() );
       if( game.playCard( index, this.player.getHand()[ index ], this.player.getHand(), this.player ) ){
          // console.log('Cartas restantes del jugador ', this.player.getID(),' => [', this.player.getHand().toString(), ']');
          return true;
        }
      }

      return false;      
  }

  this.getHand = function(){
    console.log( 'hand of ', this.player.getNickName(), ' => ', this.player.getHand() );
  }

  this.getPlayerHand = function(){
    return this.player.getHand();
  }

}


// var p = new Player(1);
// console.log(p);
// p.setNickName( 'jurasec' );
// console.log(p);


// var hand1;
console.log( 'Creating game and shuffling deck' );
var game = new TableGame();
// console.log( game.getDeck() );
console.log( 'deck length: ', game.getDeck().length );
// console.log( 'ingresa un jugador1');
// console.log( game.addPlayer( '1', 'player1' ) );
// console.log( 'ingresa un jugador2');
// console.log( game.addPlayer( '2', 'player2' ) );


bot1 = new Bot( game.addPlayer( 1, 'player1' ), game );
bot2 = new Bot( game.addPlayer( 2, 'player2' ), game );
bot3 = new Bot( game.addPlayer( 3, 'player3' ), game );
bot4 = new Bot( game.addPlayer( 4, 'player4' ), game );

console.log('Players');
console.log(game.getPlayers());

console.log(' ================== Hands ==================  ');
console.log('player 1 [', bot1.getPlayerHand().toString(), ']' );
console.log('player 2 [', bot2.getPlayerHand().toString(), ']' );
console.log('player 3 [', bot3.getPlayerHand().toString(), ']' );
console.log('player 4 [', bot4.getPlayerHand().toString(), ']' );


logger.debug(' ================== Hands ==================  ');
logger.debug('player 1 [', bot1.getPlayerHand().toString(), ']' );
logger.debug('player 2 [', bot2.getPlayerHand().toString(), ']' );
logger.debug('player 3 [', bot3.getPlayerHand().toString(), ']' );
logger.debug('player 4 [', bot4.getPlayerHand().toString(), ']' );


while(game.cardsPlayed<52){
  bot1.playCard();
  bot2.playCard();
  bot3.playCard();
  bot4.playCard();
}

console.log('------- oooooooooooooo Juego terminado!!! oooooooooooooo -------');
logger.debug('------- oooooooooooooo Juego terminado!!! oooooooooooooo -------');
console.log('Resultado final');
logger.debug('Resultado final');
for( var i in game.getPlayers() ){
  // console.log( player );
  console.log('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );
  logger.debug('Points Player ', game.getPlayers()[ i ].getID(), ' => ', game.getPlayers()[ i ].getPoints() );
}

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
