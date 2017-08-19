import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { score, time } = this.props;
    return (
      <View style={styles.scoreboard}>
        <Text style={styles.score}>
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
    height: 40,
    width: 320,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    fontSize: 20
  }
});
