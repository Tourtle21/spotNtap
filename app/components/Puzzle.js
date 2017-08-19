import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
var _ = require('lodash');

const pageWidth = Dimensions.get('window').width;

export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPuzzle(puzzle) {
    return _.map(puzzle, (icon, index) => {
      return (
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
      <TouchableOpacity
        onPress={() => {
          this.props.onPuzzleClick(puzzle);
        }}
        style={styles.puzzleBox}
      >
        {this.renderPuzzle(puzzle)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  puzzleBox: {
    height: pageWidth * 0.5,
    width: pageWidth * 0.5,
    backgroundColor: 'transparent',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  smallInnerBox: {
    flexBasis: '33%',
    height: 'auto',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  symbol: {
    fontSize: 40,
    backgroundColor: 'transparent',
    color: '#1B1464'
  }
});
