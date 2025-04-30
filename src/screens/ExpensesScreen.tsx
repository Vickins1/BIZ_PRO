import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Card, Text, ActivityIndicator, Button, Title } from 'react-native-paper';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { fetchExpenses, initExpensesTable, insertExpense } from '../database/queries';

type Expense = {
  id: number;
  description: string;
  amount: number;
  created_at: string;
};

export default function ExpensesScreen() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    try {
      await initExpensesTable();
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('❌ Error fetching expenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      const amt = parseFloat(amount);
      if (!description.trim()) {
        setError(t('errors.descriptionRequired'));
        return;
      }
      if (isNaN(amt) || amt < 0) {
        setError(t('errors.amountInvalid'));
        return;
      }

      await insertExpense(description, amt);
      setDescription('');
      setAmount('');
      setError('');
      setModalVisible(false);
      await loadExpenses();
    } catch (err) {
      setError(t('errors.addExpenseFailed'));
      console.error('❌ Error adding expense', err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const renderItem = ({ item }: { item: Expense }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.description}>{item.description}</Text>
        <Text style={styles.detail}>{t('expenses.amount')}: KES {item.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>{t('expenses.title')}</Title>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>{t('expenses.addExpense')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#008080" style={styles.loader} />
      ) : expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="info-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>{t('expenses.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('expenses.addExpense')}</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder={t('expenses.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder={t('expenses.amountPlaceholder')}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              onPress={handleAddExpense}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              {t('expenses.addExpense')}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
            >
              {t('common.cancel')}
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
  description: {
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