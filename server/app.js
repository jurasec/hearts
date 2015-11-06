var random = require("node-random");
// S, D, C, H
var deck = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12','S13',
            'D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13',
            'C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13',
            'H1','H2','H3','H4','H5','H6','H7','H8','H9','H10','H11','H12','H13'];

function createPack() {  
  var suits = new Array("H", "C", "S", "D");
  var pack = new Array();
  var n = 52;
  var index = n / suits.length;
  // console.log('index: ', index);

  var count = 0;
  for(i = 0; i <= 3; i++)
      for(j = 1; j <= index; j++){
          pack[count++] = suits[i] + j;
          // console.log('count: ', count, 'pack: ', pack[count-1]);
        }

  return pack;
}

 // Fisher-Yates algorithm.
function shufflePack(pack) {  
  var index = pack.length, j, temp;
  if (index === 0) return false;
  while ( --index ) {
     randomIndex = Math.floor(Math.random() * (index + 1));
     temp = pack[ index ];
     // tempj = pack[j];
     pack[ index ] = pack[ randomIndex ];
     pack[ randomIndex ] = temp;
   }
  return pack;
}


function drawCards(pack, amount, hand, initial) {  
  var cards = new Array();
  cards = pack.slice(0, amount);

  pack.splice(0, amount);

  if (!initial) {

    if(! (hand instanceof Array) )
      throw ("the object hand must be Array's type");

    hand.push.apply(hand, cards);
  }

  return cards;
}

function playCard( index, amount, hand) {  
  hand.splice(index, amount)
  return hand;
}
var hand1;
console.log( 'Creating and shuffling pack' );
var suffledPack = shufflePack( createPack() );
console.log( suffledPack );
console.log( 'pack length: ',suffledPack.length );
console.log( 'drawing 5 cards');
var hand = drawCards( suffledPack, 5, '', true);
console.log( 'pack ', suffledPack );
console.log( 'pack length: ',suffledPack.length );
console.log( 'my hand', hand );
console.log( 'drawing 1 card ', drawCards( suffledPack, 1, hand , false) );
console.log( 'my hand', hand );
console.log( 'playing the last card', playCard( -1, 1, hand) );
console.log( 'my hand', hand );
console.log( 'playing the second card', playCard( 1, 1, hand) );
console.log( 'my hand', hand );
console.log( 'pack length: ',suffledPack.length );


// console.log( 'suffledPack ', suffledPack );
// console.log( 'hand1 ', hand1 );
// console.log( 'drawing 5 cards ', drawCards( suffledPack, 5, hand1, false) );
// console.log( 'suffledPack ', suffledPack );
// console.log( 'hand1 ', hand1 );
// console.log( 'drawing 5 cards ', drawCards( suffledPack, 5, hand1, false) );
// console.log( 'suffledPack ', suffledPack );
// console.log( 'hand1 ', hand1 );


