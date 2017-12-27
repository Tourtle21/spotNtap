import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { score, time, incorrect} = this.props;
    return (
      <View style={styles.scoreboard}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#E3E3E3', width: '50%', textAlign: 'center', backgroundColor: incorrect}}>
          Time: {time}
        </Text>
        <Text style={styles.score}>
          Score: {score}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scoreboard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 30
  },
  time: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E3E3E3',
    backgroundColor: 'transparent',
    width: '50%',
    textAlign: 'center'
  },
  score: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E3E3E3',
    backgroundColor: 'transparent',
    width: '50%',
    textAlign: 'center'
  }
});
