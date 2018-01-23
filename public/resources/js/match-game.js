/*
  Game component.
*/
var Game = React.createClass( {
  /*
    Set the initial state to a new game.
  */
  getInitialState: function() {
    return this.newGame();
  },

  /*
    Render all cards in the game.
  */
  render: function() {
    // Create an array of JSX objects for each card.
    var cards = this.state.cards.map(function(card, cardIndex) {
      return (
        <Card key={cardIndex}
          cardValue={card.cardValue}
          cardState={card.cardState}
          onCardClick={this.onCardClick.bind(this, cardIndex)} />
      );
    }, this);
    // Create a JSX object for the game and add cards as children.
    var game = <div className="row">{cards}</div>;
    return game;
  },

  /*
    Flips over a given card and checks to see if two cards are flipped over.
    Updates styles on flipped cards depending whether they are a match or not.
  */
  onCardClick: function(cardIndex) {

    // Test if this card is already flipped
    if (this.state.cards[cardIndex].cardState !== 'hidden') {
      // Yes, so then return
      return;
    }

    // Prevent more than 2 flipped cards
    if (this.state.selected.length >= 2) {
      return;
    }

    // Show that this card is now selected
    var nextState = this.state;
    nextState.cards[cardIndex].cardState = 'selected';
    nextState.selected.push(cardIndex);
    this.setState(nextState);

    // Test if we have two selected cards
    if (nextState.selected.length < 2) {
      // No, so then return
      return;
    }

    // Test if both selected cards have the same value
    if (nextState.cards[nextState.selected[0]].cardValue === nextState.cards[nextState.selected[1]].cardValue) {
      // Yes they do, change colors to reflect this
      nextState.cards[nextState.selected[0]].cardState = 'solved';
      nextState.cards[nextState.selected[1]].cardState = 'solved';
      // Bump the total number of cards flipped
      nextState.solved += 2;
      nextState.selected = [];

      // Test if all cards flipped
      if (nextState.solved === 16) {
        // You are a winner!
        document.getElementById('you-won').style.display = 'flex';
        document.getElementById('match-game').style.opacity = '0.1';
        window.setTimeout(function() {
          document.getElementById('you-won').style.display = 'none';
          document.getElementById('match-game').style.opacity = '1';
        }, 2000);
      }
      this.setState(nextState);
      return;
    }

    // The cards have different values
    var that = this;
    window.setTimeout(function() {
      // Hide the cards after a half second delay
      nextState.cards[nextState.selected[0]].cardState = 'hidden';
      nextState.cards[nextState.selected[1]].cardState = 'hidden';
      nextState.selected = [];
      that.setState(nextState);
    }, 500);
  },

  /*
    Handle "New Game" and "Restart Game" button clicks.
  */
  onButtonClick: function(action) {
    if (action === 'new') {
      this.setState(this.newGame());
    } else {
      this.setState(this.restartGame());
    }
  },

  /*
    Generate game state for a new game.
  */
  newGame: function() {
    return {
      cards: this.generateCards(),
      selected: [],
      solved: 0
    };
  },

  /*
    Generate game state for the current game restarted.
  */
  restartGame: function() {
    var cards = this.state.cards;
    cards.forEach(function(card) {
      card.cardState = 'hidden';
    });
    return {
      cards: cards,
      selected: [],
      solved: 0
    };
  },

  /*
    Generates and returns an object containing matching card values
    with initial state of hidden.
  */
  generateCards: function() {
    var cardValues = this.generateCardValues();
    var cards = cardValues.map(function(cardValue) {
      return {
        cardValue: cardValue,
        cardState: 'hidden'
      }
    });
    return cards;
  },

  /*
    Generates and returns an array of matching card values.
  */
  generateCardValues: function() {
    var orderedCards = [];
    for (var i = 1; i <= 8; i++) {
      orderedCards.push(i);
      orderedCards.push(i);
    }
    var randomCards = [];
    while (orderedCards.length > 0) {
      var randomIndex = this.getRandomInt(0, orderedCards.length);
      randomCards.push(orderedCards[randomIndex]);
      orderedCards.splice(randomIndex, 1);
    }
    return randomCards;
  },

  /*
    Random integers given a range thanks to Mozilla
  */
  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
});

/*
  Card component.
*/
var Card = React.createClass( {
  render: function() {
    /*
      Set CSS properties for each of three states: hidden, selected, and solved.
    */
    var colors = [
      'hsl(25, 85%, 65%)',
      'hsl(55, 85%, 65%)',
      'hsl(90, 85%, 65%)',
      'hsl(160, 85%, 65%)',
      'hsl(220, 85%, 65%)',
      'hsl(265, 85%, 65%)',
      'hsl(310, 85%, 65%)',
      'hsl(360, 85%, 65%)',
    ];
    var style = {
      color: this.props.cardState === 'solved' ? 'rgb(204, 204, 204)' : 'rgb(255, 255, 255)',
      backgroundColor: this.props.cardState === 'solved' ? 'rgb(153, 153, 153)' : (this.props.cardState === 'selected' ? colors[this.props.cardValue - 1] : 'rgb(32, 64, 86)')
    }
    /*
      Create the JSX card object.
    */
    return (
      <div onClick={this.props.onCardClick} className="col-xs-3 col-sm-3 col-md-3 col-lg-3 card" style={style}>
        <span>{this.props.cardState === 'hidden' ? '' : this.props.cardValue}</span>
      </div>
    );
  }
});

/*
  Button component used for "New Game" and "Restart Game" buttons
*/
var Button = React.createClass( {
  render: function() {
    return <button type="button" className="btn btn-default" onClick={this.onClick}>{this.props.text}</button>;
  },

  onClick: function() {
    gameRendered.onButtonClick(this.props.action);
  }
});

/*
  Render the Game component.
*/
var gameRendered = ReactDOM.render(
  <Game />,
  document.getElementById('the-game')
);

/*
  Render the "New Game" button component.
*/
ReactDOM.render(
  <Button text="New Game" action="new" />,
  document.getElementById('new-game-button')
);

/*
  Render the "Restart Game" button component.
*/
ReactDOM.render(
  <Button text="Restart Game" action="restart" />,
  document.getElementById('restart-game-button')
);
