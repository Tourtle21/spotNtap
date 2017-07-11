import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const allSymbols = [
  '\u07f7',
  '\u2605',
  '\u265E',
  '\u262D',
  '\u221E',
  '\u266B',
  '\u2368'
];
const timesThrough = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var rightPuzzle = [];
var correct = -1;

export default class App extends React.Component {
  onPressTitle() {
    console.log('HI');
  }
  startGame() {}
  check() {
    console.log('HI');
  }
  mapThroughSmall(x) {
    for (var i = 0; i < 9; i++) {
      randInd = Math.floor(Math.random() * allSymbols.length);
      rightPuzzle.push(allSymbols[randInd]);
    }
    correct = Math.floor(Math.random() * 4);
    lists = [];
    function switchRandom(newArray) {
      randInd1 = Math.floor(Math.random() * 9);
      randInd2 = Math.floor(Math.random() * 9);
      oldPiece = newArray[randInd1];
      newArray[randInd1] = newArray[randInd2];
      newArray[randInd2] = oldPiece;
      if (newArray[randInd1] != newArray[randInd2]) {
        return newArray;
      } else {
        return switchRandom(newArray);
      }
    }
    for (var i = 0; i < 4; i++) {
      if (i != correct) {
        lists.push(rightPuzzle);
      } else {
        newArray = rightPuzzle.slice();
        lists.push(switchRandom(newArray));
      }
    }
    function getAll(y) {
      return (
        <View style={styles.smallInnerBox}>
          <Text style={styles.smallSymbol}>
            {y}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.choices}>
        <View onPress={this.check} style={styles.smallBox}>
          {lists[0].map(getAll)}
        </View>
        <View onPress={this.check} style={styles.smallBox}>
          {lists[1].map(getAll)}
        </View>
        <View onPress={this.check} style={styles.smallBox}>
          {lists[2].map(getAll)}
        </View>
        <View onPress={this.check} style={styles.smallBox}>
          {lists[3].map(getAll)}
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {/*<Text onPress={this.onPressTitle}>Hello World!</Text>*/}
        <Button onPress={this.startGame} title="Start" />
        {this.mapThroughSmall()}
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
