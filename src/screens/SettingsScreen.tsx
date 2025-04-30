import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Switch, List, Divider, Button } from 'react-native-paper';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    // TODO: integrate with global theme later
  };

  const confirmReset = () => {
    Alert.alert(
      'Confirm Reset',
      'This will delete all inventory and sales data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => console.log('Reset confirmed') }, // TODO: Hook into database reset
      ]
    );
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>

        <View style={styles.row}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        <Divider />

        <Button
          mode="contained-tonal"
          onPress={confirmReset}
          style={styles.resetBtn}
        >
          Reset App Data
        </Button>

        <Divider />

        <Text style={styles.versionText}>
          Version: {Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetBtn: {
    marginTop: 16,
  },
  versionText: {
    marginTop: 32,
    textAlign: 'center',
    color: 'gray',
  },
});
