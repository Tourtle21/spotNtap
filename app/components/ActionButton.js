import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.actions}>
        <TouchableOpacity onPress={this.props.onPressFunction} title={this.props.buttonText}>
          <Text style={styles.actionButton}>{this.props.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actions: {
    width: "100%",
    paddingTop: 30,
    display: "flex",
    alignItems: "center"
  },
  actionButton: {
    backgroundColor: "#1b1464",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 180,
    fontSize: 20,
    letterSpacing: 1,
    fontWeight: "600",
    textAlign: "center",
    color: "#E3E3E3"
  }
});
