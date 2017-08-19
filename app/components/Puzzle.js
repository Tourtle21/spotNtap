import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
var _ = require('lodash');

export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPuzzle(puzzle) {
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

  render() {
    const { puzzle } = this.props;
    return (
      <TouchableOpacity onPress={() => {this.props.onPuzzleClick(puzzle)}} style={styles.puzzleBox}>
        {this.renderPuzzle(puzzle)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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
  symbol: {
    fontSize: 40,
    backgroundColor: 'transparent'
  },
});
