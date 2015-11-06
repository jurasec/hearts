

function Bot( player ){

  this.player = player;

  this.checkTurn = function(){

  }

  this.playCard = function(){

  }

  this.getHand = function(){
    console.log( 'hand of ', this.player.getNickName(), ' => ', this.player.getHand() );
  }

}