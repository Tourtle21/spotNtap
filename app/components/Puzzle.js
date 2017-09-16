import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
      case 4:
        height = '50%';
        fontSize = 75;
        break;
      case 9:
        height = '33.33%';
        fontSize = 40;
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
