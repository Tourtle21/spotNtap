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

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.onPuzzleClick = this.onPuzzleClick.bind(this);
    this.startNextRound = this.startNextRound.bind(this);

    this.state = {
      differentPuzzle: null,
      puzzles: [],
    }
  }

  componentDidMount() {
    this.startNextRound();
  }

  onPuzzleClick(puzzle) {
    if (puzzle == this.state.differentPuzzle) {
      this.startNextRound();
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
    return _.map(puzzle, (icon) => {
      return(
        <View style={styles.smallInnerBox}>
          <Text style={styles.smallSymbol}>
            {icon}
          </Text>
        </View>
      );
    });
  }

  renderPuzzles() {
    return _.map(this.state.puzzles, (puzzle) => {
      return (
        <TouchableOpacity onPress={() => {this.onPuzzleClick(puzzle)}} style={styles.smallBox}>
          {this.renderIcons(puzzle)}
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.startNextRound} title="Start" />
        <View style={styles.choices}>
          {this.renderPuzzles()}
        </View>
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
  mainBox: {
    height: 300,
    width: 300,
    backgroundColor: 'blue',
    display: 'flex',
    flexWrap: 'wrap'
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallInnerBox: {
    height: 25,
    width: 25,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallBox: {
    height: 75,
    width: 75,
    backgroundColor: 'blue',
    display: 'flex',
    flexWrap: 'wrap',
    margin: 10
  },
  symbol: {
    fontSize: 70,
    backgroundColor: 'transparent'
  },
  smallSymbol: {
    fontSize: 17.5,
    backgroundColor: 'transparent'
  },
  choices: {
    display: 'flex',
    flexDirection: 'row'
  }
});
