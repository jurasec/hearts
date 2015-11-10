function Player( id, nick, socketId ){

  this.id = id;
  this.socketId = socketId;
  this.number = 0;
  this.nick = nick;
  this.hand = [];
  this.points = 0;

  this.getID = function(){
    return this.id;
  }

  this.setSocketID = function( socketId ){
    this.socketId = socketId;
  }

  this.getSocketID = function(){
    return this.socketId;
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

module.exports = Player;