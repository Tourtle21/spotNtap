import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
          <Ionicons name={icon} style={styles.icon} />
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
    flexBasis: '33.33%',
    height: '33.33%',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#1B1464',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 40,
    backgroundColor: 'transparent',
    color: '#1B1464'
  }
});
