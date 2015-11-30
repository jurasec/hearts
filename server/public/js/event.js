$(document).ready(function(){

  window.io = io.connect();

  var cards="";
  
  io.on('connect', function(){    
    io.emit('game:players', function( data ){  // se pide la lista de jugadores
      console.log( data );

      var jugadores = '';

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // console.log(key + " -> " + data[key].nickName);
          jugadores += '<div> ' + data[ key ].nickName + '</div>'
        }
      }

      $('#jugadores').html( jugadores );

    });
  }); 

  io.on('users', function( data ){
    console.log("Respuesta del server => " , data.info);

    // $('.user').remove();
    // for( i=0; i<data.users.length; i++){
    //   console.log( data.users[i]);
    //   $('#users').append("<p class='user'>"+data.users[i]+"</p>");
    // }
  });

  io.on('game:status', function( data ){
    console.log('status -> ', data.status);
    $('#status').html( '<h2>Estatus: ' + data.status + '</h2>');
  });

  // io.on('game:currentTurn', function( data ){
  //   console.log('Es el turno del jugador -> ', data.turn);
  //   $('#msgServer').html( 'Server: Es el turno del jugador -> ' + data.turn );
  // });



  /*** Eventos de objetos html ***/
  $('#join').click( function(){
    var nick = $('#nick').val() || 'Player anonymous';

    io.emit('game:join', {nick: nick}, function( data ){

      if( data.joined ){
        var cards = '';
        // for(var index in data.hand){
        //   cards += '<div><input type=\'checkbox\' class=\'group1\'  value= ' +data.hand[ index ] + '>' + data.hand[ index ] + '</input></div>';
        // }        

        // cards += '<button id=\'playCard\'> Jugar carta seleccionada </button>';

        // $('#nickname').html('<h3> Nick: ' + nick + ' PlayerID: [ ' + data.playerID + ']</h3>');
        // console.log('aaaaaaa');
        $('canvas').css('display', 'inline');

        // $('#cards').html( cards );

        // $('input[type="checkbox"]').change( function() {
        //   // console.log( 'selected box' );
        //   // $(this).siblings('input[type="checkbox"]').not(this).prop('checked', false);
        //   $('input[type="checkbox"]').not(this).prop("checked", false);
        // });

        // $('#playCard').click( function(){
        //   // var cardSelected =  $('input[type="checkbox"]').siblings(':checked').val() ;
        //   var cardSelected = $('input[type="checkbox"]:checked').val();
        //   console.log('Carta seleccionada: ', cardSelected);

        //   io.emit('game:playCard', { card: cardSelected}, function( data ){
        //     $('#msgServer').html('Server: ' + data.msg);
        //     if( data.isCardPlayable ){

        //       $('input[type="checkbox"]:checked').parent().fadeOut( "slow", function() {
        //         $(this).remove();
        //       });
        //     }

        //   });
        // });
        

        $('#jugadores').append( '<div> ' + nick + '</div>' );

      }else{
        $('#msgServer').text('Mesa llena :-[');
      }

      console.log( data.joined )
    });
  });
  

});