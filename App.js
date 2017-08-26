import React from 'react';
import ActionButton from './app/components/ActionButton.js';
import Game from './app/components/Game.js';
import Scoreboard from './app/components/Scoreboard.js';
import { StyleSheet, View, Image } from 'react-native';

var _ = require('lodash');
var timer;

const allSymbols = [
  'ios-pizza',
  'ios-bug',
  'ios-disc',
  'ios-planet',
  'ios-football',
  'ios-paw',
  'ios-alarm',
  'ios-heart',
  'ios-home',
  'ios-star'
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.onPuzzleClick = this.onPuzzleClick.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.startNextRound = this.startNextRound.bind(this);

    this.state = {
      differentPuzzle: null,
      gameOver: false,
      puzzles: [],
      score: 0,
      time: 30
    };
  }

  componentDidMount() {
    this.startNextRound();
  }

  restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      const { time } = this.state;
      if (time - 1 == 0) {
        clearInterval(timer);
        this.setState({ gameOver: true });
      }
      this.setState({ time: time - 1 });
    }, 1000);
  }

  onRestart() {
    this.setState({ gameOver: false, score: 0, time: 30 });
    this.startNextRound();
  }

  onPuzzleClick(puzzle) {
    const { differentPuzzle, gameOver, score } = this.state;
    if (gameOver) return;
    if (puzzle == differentPuzzle) {
      this.setState({ score: score + 1 });
      this.startNextRound();
    } else {
      if (score - 2 <= 0) {
        this.setState({ score: 0 });
      } else {
        this.setState({ score: score - 2 });
      }
    }
  }

  generatePuzzle() {
    let puzzle = [];
    for (var i = 0; i < 9; i++) {
      randInd = Math.floor(Math.random() * allSymbols.length);
      puzzle.push(allSymbols[randInd]);
    }
    return puzzle;
  }

  generateDifferentPuzzle(repeatedPuzzle) {
    let differentPuzzle = _.clone(repeatedPuzzle);
    randomIndex1 = Math.floor(Math.random() * 9);
    randomIndex2 = Math.floor(Math.random() * 9);
    oldPiece = differentPuzzle[randomIndex1];
    differentPuzzle[randomIndex1] = differentPuzzle[randomIndex2];
    differentPuzzle[randomIndex2] = oldPiece;
    if (differentPuzzle[randomIndex1] == differentPuzzle[randomIndex2]) {
      differentPuzzle = this.generateDifferentPuzzle(repeatedPuzzle);
    }
    return differentPuzzle;
  }

  startNextRound() {
    this.restartTimer();
    let repeatedPuzzle = this.generatePuzzle();
    let differentPuzzle = this.generateDifferentPuzzle(repeatedPuzzle);
    let differentIndex = Math.floor(Math.random() * 4);
    let puzzles = [];
    for (var i = 0; i < 4; i++) {
      if (i == differentIndex) {
        puzzles.push(differentPuzzle);
      } else {
        puzzles.push(repeatedPuzzle);
      }
    }
    this.setState({ differentPuzzle, puzzles });
  }

  render() {
    return (
      <Image source={require('./app/images/bkgnd.png')} style={styles.backgroundImage}>
        <Scoreboard onGameOver={this.onGameOver} onTick={this.onTick} score={this.state.score} time={this.state.time} />
        <Game
          differentPuzzle={this.state.differentPuzzle}
          gameOver={this.state.gameOver}
          onPuzzleClick={this.onPuzzleClick}
          puzzles={this.state.puzzles}
        />
        <ActionButton onRestart={this.onRestart} />
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    paddingTop: 50
  }
});
