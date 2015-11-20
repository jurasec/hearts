var express = require('express.io'),
    path = require('path'),
    TableGame = require('./game.js'),    
    Bot = require('./bot.js'),
    logger = require('./logger.js'),
    app = express(),
    tableGame = new TableGame();    


  // console.log(tableGame);
  // console.log(bots);

var status = '';
var players = {};

app.http().io();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/',  function(req, res){
  res.render('index', { title: '- Inicio -' });
});


app.io.on('connection', function (socket){
  console.log(socket.id);  
});

app.io.route('game', {

  players: function( req ){
    var playersList = {};

    for (var key in players) {
      if (players.hasOwnProperty(key)) {
        // console.log(key + " -> " + players[key].getNickName());
        playersList[ key ] = { nickName:players[ key ].getNickName() };
      }
    }
    // console.log( players );
    console.log( playersList );
    req.io.respond(playersList);
  },

  join: function( req ){
    // console.log( tableGame );
    if( tableGame.getConnectedPlayers() < 4 ){
      var player = tableGame.addPlayer( req.data.nick, req.socket.io );  
      console.log( 'Player [ ', player.getID(), ' - ', player.getNickName(), '] agregado, socket id -> ', req.socket.id );
      req.io.respond({ 'joined' : true, playerID: player.getID(), hand: player.getHand() });
      
      players[ req.socket.id ] = player ; // Agregamos el jugador al objeto Players, para poder acceder de manera rápida
      
      if( tableGame.getConnectedPlayers() == 4 ) {
        app.io.broadcast( 'game:status', { status: 'Jugadores listos: [' + tableGame.getConnectedPlayers() + '] Mesa lista para iniciar.' } );
        app.io.broadcast( 'game:currentTurn', { turn : tableGame.getPlayerToLead() } ); 
      }
      else app.io.broadcast( 'game:status', { status : 'Jugadores listos: [' + tableGame.getConnectedPlayers() + ']' } );
    
    }else{
      console.log( 'Mesa llena ' );
      
      req.io.respond({joined: false});
    }    
  },

  playCard: function( req ){
    console.log(req.socket.id);
    var player = players[ req.socket.id ];
    var card = req.data.card;
    console.log('Juagador intentando tirar una carta -> ', player);
    console.log('Turno del jugador -> ' , tableGame.getPlayerToLead());

    if( tableGame.getPlayerToLead() == player.getID() ){
      var statusCardPlayed = tableGame.playCard( player.getHand().indexOf( card ) , card, player.getHand(), player );
      
      if( statusCardPlayed.isCardPlayable ) // Se actuliza el turno
        app.io.broadcast( 'game:currentTurn', { turn : tableGame.getPlayerToLead() } ); 
      
      console.log( 'Estatus de la carta jugadoa: ', statusCardPlayed.cause );
        // req.io.respond( { msg: statusCardPlayed.cause } );
      // }else{
      req.io.respond( { msg : statusCardPlayed.cause, isCardPlayable: statusCardPlayed.isCardPlayable } );
      // }
    }else{
      req.io.respond( {msg : 'No es tu turno'} );
    }
  }

});
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express.io server listening on port ' + server.address().port);
});