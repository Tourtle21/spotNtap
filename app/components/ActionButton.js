import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.actions}>
        <TouchableOpacity onPress={this.props.onRestart} title="Play Again">
          <Text style={styles.actionButton}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actions: {
    width: '100%',
    paddingTop: 30
  },
  actionButton: {
    backgroundColor: 'transparent',
    fontSize: 20,
    fontWeight: '600',
    color: '#E3E3E3',
    textAlign: 'center'
  }
});
