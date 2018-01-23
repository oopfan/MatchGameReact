var Game = React.createClass( {
  getInitialState: function() {
    return this.newGame();
  },

  render: function() {
    var cards = this.state.cards.map(function(card, cardIndex) {
      return <Card cardValue={card.cardValue} cardState={card.cardState} onCardClick={this.onCardClick.bind(this, cardIndex)} />;
    }, this);
    var game = <div className="row">{cards}</div>;
    return game;
  },

  onCardClick: function(cardIndex) {
    if (this.state.cards[cardIndex].cardState !== 'hidden') {
      return;
    }
    if (this.state.selected.length >= 2) {
      return;
    }

    var nextState = this.state;
    nextState.cards[cardIndex].cardState = 'selected';
    nextState.selected.push(cardIndex);
    this.setState(nextState);

    if (nextState.selected.length < 2) {
      return;
    }

    if (nextState.cards[nextState.selected[0]].cardValue === nextState.cards[nextState.selected[1]].cardValue) {
      nextState.cards[nextState.selected[0]].cardState = 'solved';
      nextState.cards[nextState.selected[1]].cardState = 'solved';
      nextState.selected = [];
      nextState.solved += 2;
      if (nextState.solved === 16) {
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

    var that = this;
    window.setTimeout(function() {
      nextState.cards[nextState.selected[0]].cardState = 'hidden';
      nextState.cards[nextState.selected[1]].cardState = 'hidden';
      nextState.selected = [];
      that.setState(nextState);
    }, 500);
  },

  onButtonClick: function(action) {
    if (action === 'new') {
      this.setState(this.newGame());
    } else {
      this.setState(this.restartGame());
    }
  },

  newGame: function() {
    return {
      cards: this.generateCards(),
      selected: [],
      solved: 0
    };
  },

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

  getRandomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
});

var Card = React.createClass( {
  render: function() {
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
    return (
      <div onClick={this.props.onCardClick} className="col-xs-3 col-sm-3 col-md-3 col-lg-3 card" style={style}>
        <span>{this.props.cardState === 'hidden' ? '' : this.props.cardValue}</span>
      </div>
    );
  }
});

var Button = React.createClass( {
  render: function() {
    return <button type="button" className="btn btn-default" onClick={this.onClick}>{this.props.text}</button>;
  },

  onClick: function() {
    gameRendered.onButtonClick(this.props.action);
  }
});

var gameRendered = ReactDOM.render(
  <Game />,
  document.getElementById('game')
);

ReactDOM.render(
  <Button text="New Game" action="new" />,
  document.getElementById('new-game-button')
);

ReactDOM.render(
  <Button text="Restart Game" action="restart" />,
  document.getElementById('restart-game-button')
);
