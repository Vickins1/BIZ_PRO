import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
  FAB,
} from 'react-native-paper';
import { fetchItems, insertItem } from '../database/queries';

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

  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    try {
      const result = await fetchItems();
      setItems(result);
    } catch (error) {
      console.error('❌ Could not load items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async () => {
    try {
      setSubmitting(true);
      await insertItem(newName, parseInt(newQty), parseFloat(newPrice));
      setShowDialog(false);
      setNewName('');
      setNewQty('');
      setNewPrice('');
      loadItems(); // refresh list
    } catch (error) {
      console.error('❌ Error adding item:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
      ) : items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text>No inventory yet. Tap + to add items.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Add Inventory Item</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={newName}
              onChangeText={setNewName}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Quantity"
              value={newQty}
              onChangeText={setNewQty}
              keyboardType="numeric"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Price (KES)"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="decimal-pad"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button loading={submitting} onPress={handleAddItem}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowDialog(true)}
        label="Add Item"
      />
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: '#3f51b5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
