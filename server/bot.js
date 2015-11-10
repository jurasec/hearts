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
       if( game.playCard( index, this.player.getHand()[ index ], this.player.getHand(), this.player ).isCardPlayable ){
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

  this.getPlayer = function(){
    return this.player;
  }

}

module.exports = Bot;