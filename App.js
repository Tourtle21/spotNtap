import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
var _ = require('lodash');

const allSymbols = [
  '\u07f7',
  '\u2605',
  '\u265E',
  '\u262D',
  '\u221E',
  '\u266B',
  '\u2368'
];

var timer;

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.onPuzzleClick = this.onPuzzleClick.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.startNextRound = this.startNextRound.bind(this);

    this.state = {
      differentPuzzle: null,
      gameOver: false,
      puzzles: [],
      score: 0,
      time: 30,
    }
  }

  componentDidMount() {
    this.restartGame();
  }

  restartGame() {
    this.setState({gameOver: false, score: 0, time: 30});
    this.startNextRound();
  }

  onPuzzleClick(puzzle) {
    const { differentPuzzle, gameOver, score } = this.state;
    if (gameOver) return;
    if (puzzle == differentPuzzle) {
      this.setState({score: score + 1});
      this.startNextRound();
    } else {
      if (score - 2 <= 0) {
        this.setState({score: 0});
      } else {
        this.setState({score: score - 2});
      }
    }
  }

  restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      const { time } = this.state;
      if (time - 1 == 0) {
        clearInterval(timer);
        this.setState({gameOver: true});
      }
      this.setState({time: time - 1});
    }, 1000);
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

  renderIcons(puzzle) {
    return _.map(puzzle, (icon, index) => {
      return(
        <View key={index} style={styles.smallInnerBox}>
          <Text style={styles.symbol}>
            {icon}
          </Text>
        </View>
      );
    });
  }

  renderPuzzles() {
    return _.map(this.state.puzzles, (puzzle, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => {this.onPuzzleClick(puzzle)}} style={styles.puzzleBox}>
          {this.renderIcons(puzzle)}
        </TouchableOpacity>
      );
    });
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.score}>
          Time: {this.state.time}
        </Text>
        <Text style={styles.score}>
          Score: {this.state.score}
        </Text>
      </View>
    );
  }

  renderActions() {
    if (this.state.gameOver) {
      return (
        <View style={styles.actions}>
          <Button style={styles.actionButton} onPress={this.restartGame} title="Play Again" />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.choices}>
          {this.renderPuzzles()}
        </View>
        {this.renderActions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 50
  },
  smallInnerBox: {
    height: 50,
    width: 50,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  puzzleBox: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  symbol: {
    fontSize: 40,
    backgroundColor: 'transparent'
  },
  smallSymbol: {
    fontSize: 17.5,
    backgroundColor: 'transparent'
  },
  choices: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  header: {
    height: 40,
    width: 320,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    fontSize: 20
  },
  actions: {
    height: 40,
    width: 320
  },
  actionButton: {
    backgroundColor: 'purple',
    borderColor: 'black',
    borderWidth: 1,
  }
});
