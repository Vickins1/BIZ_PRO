import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Card, Text, ActivityIndicator, Button, Title } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchSales, initSalesTable, insertSale } from '../database/queries';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [error, setError] = useState('');

  const loadSales = async () => {
    try {
      await initSalesTable();
      const data = await fetchSales();
      setSales(data);
    } catch (err) {
      console.error('❌ Error fetching sales', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async () => {
    try {
      const qty = parseInt(quantity);
      const price = parseFloat(totalPrice);
      if (!itemName.trim()) {
        setError('Item name is required');
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        setError('Quantity must be a positive integer');
        return;
      }
      if (isNaN(price) || price < 0) {
        setError('Total price must be a valid number');
        return;
      }

      await insertSale(itemName, qty, price);
      setItemName('');
      setQuantity('');
      setTotalPrice('');
      setError('');
      setModalVisible(false);
      await loadSales(); // Refresh sales list
    } catch (err) {
      setError('Failed to add sale. Please try again.');
      console.error('❌ Error adding sale', err);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const renderItem = ({ item }: { item: Sale }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.detail}>Quantity Sold: {item.quantity}</Text>
        <Text style={styles.detail}>Total: KES {item.total_price.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Sales Records</Title>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Sale</Text>
        </TouchableOpacity>
      </View>

      {/* Sales List */}
      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#008080" style={styles.loader} />
      ) : sales.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="info-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>No sales recorded yet.</Text>
        </View>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Sale Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Sale</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Total Price (KES)"
            value={totalPrice}
            onChangeText={setTotalPrice}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              onPress={handleAddSale}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              Add Sale
            </Button>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#008080',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemName: {
    color: '#333',
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#008080',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#008080',
  },
  buttonLabel: {
    fontSize: 16,
  },
});