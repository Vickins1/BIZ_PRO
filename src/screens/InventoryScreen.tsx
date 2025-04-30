import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { fetchItems } from '../database/queries';

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
};

const InventoryScreen = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const result = fetchItems(); // synchronous
      setItems(await result);
    } catch (error) {
      console.error('❌ Could not load items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text>Qty: {item.quantity}</Text>
        <Text>Price: KES {item.price.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
});
