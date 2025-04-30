import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
  Sales: undefined;
  Settings: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Welcome to BizPro</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Inventory')}
        style={styles.button}
      >
        Go to Inventory
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Sales')}
        style={styles.button}
      >
        Go to Sales
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Settings')}
        style={styles.button}
      >
        Settings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: '600',
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
});
