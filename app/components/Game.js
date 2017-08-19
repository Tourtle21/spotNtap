import React from 'react';
import Puzzle from './Puzzle';
import {
  StyleSheet,
  View,
} from 'react-native';
var _ = require('lodash');

export default class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPuzzles() {
    return _.map(this.props.puzzles, (puzzle, index) => {
      return (
        <Puzzle
          key={index}
          onPuzzleClick={this.props.onPuzzleClick}
          puzzle={puzzle}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.game}>
        {this.renderPuzzles()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  game: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
