import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

// components
import Root from "./src/main";


export default class MyApp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Root {...this.props}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },
});

AppRegistry.registerComponent('MyApp', () => MyApp);
