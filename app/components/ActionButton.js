import React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.actions}>
        <Button style={styles.actionButton} onPress={this.props.onRestart} title="Play Again" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actions: {
    height: 40,
    width: 320
  },
  actionButton: {
    backgroundColor: 'purple',
    borderColor: 'black',
    borderWidth: 1,
  }
});
