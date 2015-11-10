var logger = require('./logger.js'),
    Player = require('./player.js');

function TableGame() {  

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
  this.addPlayer = function( nick, socketId ){
    var id = Object.keys( this.players ).length + 1;
    console.log('ID ----------------- ', id);
    var player = new Player( id, nick, socketId );
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
    var status = this.isCardPlayable( card, hand );
    if ( !status.isCardPlayable ){
      // return this.isCardPlayable( card, hand );
      // return callback( this.isCardPlayable( card, hand ) );
      console.log( 'Carta [ ', card, ' ] NO jugable, causa => ', this.isCardPlayable( card, hand ).cause , ' -> del tipo => ', this.higherCardOnTurn);
      // return status;
    }else{
    
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
      if( this.cardsPlayed%4 == 0 ){ // al final de cada 4º turno, se verifica quien debe tomar las cartas y sumar puntos
        console.log('          ==============> El jugador que debe comer las cartas es => ', this.playerWhoEats);
        logger.debug('==> El jugador que debe comer las cartas es => ', this.playerWhoEats );
        this.saveFirstCard = true;
        this.setLastCardOnTable("");
        this.higherCardOnTurn = "";
        this.playerLead = this.playerWhoEats;      
        this.players[this.playerWhoEats].addPoints( this.heartsThisRound );
        console.log('Se han sumando ', this.heartsThisRound, ' puntos al jugador ', this.playerWhoEats);
        this.heartsThisRound = 0;

        if( this.cardsPlayed == 52 ){  //al final de la mano se verifica si alguien obtuvo los 26 puntos
          var idPlayer = this.checkShootTheMoon();
          if( idPlayer )
            console.log(" SHOOOOOOOOOOOOOOOOOOOOTTTTTTIIIIIIIIIIINNNNNNNNNNNNGGGGGGGGGGGGGGG THE MOOOOOOONNNNNNN !!!!!!!!! => Player " , idPlayer);
          else console.log("There isn't shoting the moon :-[");
        }
        

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
    }

    return status;
  }

  this.isCardPlayable = function( card, hand ){

    var suitCardToPlay = card[0];

    if( this.turn === 1 && card!='C2' ){
      return { isCardPlayable:false , cause: 'Debes elegir el 2 de treboles.'};
    }
    else if( this.turn === 1 && card=='C2' ){
      this.turn++;
      return { isCardPlayable:true , cause: 'La carta es jugable.'};
    }
    if( !this.heartsHaveBeenBroken && suitCardToPlay === 'H' && (this.cardsPlayed%4 == 0) ){
      if( this.isFreeSuit( hand ) ) // Si tiene puros corazones y es el primer turno, no lo dejaba tirar
        return { isCardPlayable:true , cause: 'La carta es jugable.'};    
      else
        return { isCardPlayable:false , cause: 'Aún no se han jugado corazones.'};    
    }
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

  // Comprueba si puede tirar cualquier palo, tomando en cuenta que no puede abrir con corazones si tiene cartas de otro palo
  this.isFreeSuit = function( hand ){
    // hand.forEach( function( card, key){
    //   if( this.getLastCardOnTable()[0] === card[0] )
    //     return false;      
    // });
    for(var index in hand){
      /* se comprueba contra la carta más alta, para asegurar que debe tirar el mismo palo,
       * si es un inicio de vuelta, tambien se comprueba que no abra con un carta de corazones
      */
      if( this.higherCardOnTurn[0] === hand[ index ][0]  || ( this.cardsPlayed%4 == 0 && hand[ index ][0] != 'H' )){ 

        // if( ( this.cardsPlayed%4 == 0 && hand[ index ][0] != 'H' ) ) console.log('No puedes abrir con corazones.');

        return false;      
      }
    }

    // console.log('This turn is free suit');
    return true;
  } 


  this.checkShootTheMoon = function( ){    

    for(var index in this.players){
      console.log( 'Revisando puntos para shoot the moon -> player ', this.players[ index ].getID(), ' - puntos -> ', this.players[ index ].points );
    }


    for(var index in this.players){
      // console.log( 'Revisando puntos para shoot the moon -> player ', this.players[ index ].getID(), ' - puntos -> ', this.players[ index ].points );
      if( this.players[ index ].points == 26){
        for(var index2 in this.players){
          // this.players[ index ].points = 0;
          if( index == index2 ) {
            console.log('se restan 26 puntos al jugador ', this.players[ index ].getID() );
            this.players[ index ].subtractPoints( 26 );
            continue;
          }
          else {
            console.log('se suman 26 puntos al jugador ', this.players[ index2 ].getID() );
            this.players[ index2 ].addPoints( 26 );
          }
        }
        return this.players[ index ].getID();        
      }
    }
    return null;
  }

  /**
    * Verifica si tiene el 2 de treboles
    */
  this.mustLead = function( hand ){

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

  // this.getPlayerToPlay = function(){
  //   var currentPlayerTurn = this.playersIDs[ this.turn++ ];
  //   this.turn = this.turn === this.playersIDs.length ? 0 : this.turn;
  //   return currentPlayerTurn;
  // }

  this.getDeck = function(){
    return this.deck;
  }

  this.getConnectedPlayers = function(){
    return Object.keys( this.players ).length;
  }

  this.handNumber = 1;
  this.turn = 1;  
  this.deck = this.shuffleDeck( this.createDeck() );
  this.maxPlayers = 4;
  this.players = {};
  // this.playersIDs = [];
  this.cardsPlayed = 0;
  this.playerLead = 1;
  this.playerWhoEats = 1;
  this.saveFirstCard = true;
  // this.playerToPlay = 1;
  this.lastCardOnTable = "";
  this.higherCardOnTurn = "";
  this.heartsHaveBeenBroken = false;
  this.heartsThisRound = 0;
  this.id = "";

}

module.exports = TableGame;