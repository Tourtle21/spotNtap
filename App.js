import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionButton from './app/components/ActionButton.js';
import Game from './app/components/Game.js';
import Scoreboard from './app/components/Scoreboard.js';
import { AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

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
      difficulty: 1,
      gameOver: false,
      highScore: 0,
      page: 'menu',
      puzzles: [],
      score: 0,
      time: 30
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('highScore').then((value) => {
      this.setState({ highScore: Number(value) || 0 });
    }).done();
  }

  restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      const { highScore, score, time } = this.state;
      if (time - 1 == 0) {
        clearInterval(timer);
        let newHighScore = score > highScore ? score : highScore;
        AsyncStorage.setItem('highScore', highScore.toString());
        this.setState({ gameOver: true, highScore: newHighScore });
      }
      this.setState({ time: time - 1 });
    }, 1000);
  }

  onRestart() {
    this.setState({ gameOver: false, page: 'game', score: 0, time: 30 });
    this.restartTimer();
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
    for (var i = 0; i < this.state.difficulty; i++) {
      randInd = Math.floor(Math.random() * allSymbols.length);
      puzzle.push(allSymbols[randInd]);
    }
    return puzzle;
  }

  generateDifferentPuzzle(repeatedPuzzle) {
    var differentPuzzle = _.clone(repeatedPuzzle);
    if (this.state.difficulty == 1) {
      let remainingSymbols = _.without(allSymbols, repeatedPuzzle[0]);
      differentPuzzle = [remainingSymbols[Math.floor(Math.random() * remainingSymbols.length)]];
    } else {
      var randomIndex1 = Math.floor(Math.random() * this.state.difficulty);
      var randomIndex2 = Math.floor(Math.random() * this.state.difficulty);
      var oldPiece = differentPuzzle[randomIndex1];
      differentPuzzle[randomIndex1] = differentPuzzle[randomIndex2];
      differentPuzzle[randomIndex2] = oldPiece;
      if (differentPuzzle[randomIndex1] == differentPuzzle[randomIndex2]) {
        differentPuzzle = this.generateDifferentPuzzle(repeatedPuzzle);
      }
    }
    return differentPuzzle;
  }

  startNextRound() {
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

  changeDifficulty(difficulty) {
    this.setState({ difficulty });
  }

  renderPage() {
    const { difficulty } = this.state;
    if (this.state.page == 'menu') {
      return (
        <View style={styles.menu}>
          <View style={styles.logoWrapper}>
            <Image source={require('./app/images/Spot&TapLogo.png')} style={styles.logo} />
          </View>
          <TouchableOpacity onPress={() => {this.changeDifficulty(1)}} title='Easy'>
            <Text style={difficulty == 1 ? styles.selectedDifficulty : styles.difficulty}>
              Easy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.changeDifficulty(4)}} title='Normal'>
            <Text style={difficulty == 4 ? styles.selectedDifficulty : styles.difficulty}>
              Normal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.changeDifficulty(9)}} title='Hard'>
            <Text style={difficulty == 9 ? styles.selectedDifficulty : styles.difficulty}>
              Hard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onRestart} title='Start Game'>
            <Ionicons name={'ios-play'} style={styles.startButton} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View>
        <Scoreboard onGameOver={this.onGameOver} onTick={this.onTick} score={this.state.score} time={this.state.time} />
        <Game
          differentPuzzle={this.state.differentPuzzle}
          difficulty={this.state.difficulty}
          gameOver={this.state.gameOver}
          onPuzzleClick={this.onPuzzleClick}
          puzzles={this.state.puzzles}
        />
        <ActionButton onRestart={this.onRestart} />
        <Text style={styles.highScore}>High Score: {this.state.highScore}</Text>
      </View>
    );
  }

  render() {
    return (
      <Image source={require('./app/images/bkgnd.png')} style={styles.backgroundImage}>
        {this.renderPage()}
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
  },
  difficulty: {
    color: '#888888',
    fontSize: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  highScore: {
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: '600',
    color: '#E3E3E3',
    textAlign: 'center',
    paddingTop: 20
  },
  menu: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 50,
  },
  selectedDifficulty: {
    color: '#E3E3E3',
    fontSize: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  startButton: {
    color: '#E3E3E3',
    fontSize: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#DDAA00'
  },
  logo: {
    maxWidth: '100%'
  },
  logoWrapper: {
    width: 300
  }
});
