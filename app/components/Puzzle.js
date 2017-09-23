import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../Constants.js'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
var _ = require('lodash');

const pageWidth = Dimensions.get('window').width;

export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);
  }

  innerBoxStyle(height) {
    return {
      flexBasis: height,
      height: height,
      backgroundColor: '#EEEEEE',
      borderWidth: 1,
      borderColor: '#1B1464',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  iconStyle(fontSize) {
    return {
      fontSize: fontSize,
      backgroundColor: 'transparent',
      color: '#1B1464'
    }
  }

  renderPuzzle(puzzle) {
    var height = '100%';
    var fontSize = 120;
    switch (this.props.difficulty) {
      case Constants.NORMAL:
        height = '50%';
        fontSize = 75;
        break;
      case Constants.HARD:
        height = '33.33%';
        fontSize = 40;
        break;
      case Constants.EXPERT:
        height = '25%';
        fontSize = 28;
        break;
      case Constants.INSANE:
        height = '20%';
        fontSize = 22;
        break;
      default:
        break;
    }
    return _.map(puzzle, (icon, index) => {
      return (
        <View key={index} style={this.innerBoxStyle(height)}>
          <Ionicons name={icon} style={this.iconStyle(fontSize)} />
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
});
