import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { fetchSales } from '../database/queries';

type Sale = {
  id: number;
  item_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
};

export default function SalesScreen() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    try {
      const data = await fetchSales(); // resolves the promise
      setSales(data);
    } catch (err) {
      console.error('❌ Error fetching sales', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const renderItem = ({ item }: { item: Sale }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.item_name}</Text>
        <Text>Qty Sold: {item.quantity}</Text>
        <Text>Total: KES {item.total_price.toFixed(2)}</Text>
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
          data={sales}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

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
