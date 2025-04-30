import { initInventoryTable, initSalesTable, initExpensesTable, openSecureDatabase } from './queries';

export const initializeDatabase = async (): Promise<void> => {
  try {
    const database = await openSecureDatabase();
    await database.withTransactionAsync(async () => {
      await initInventoryTable();
      await initSalesTable();
      await initExpensesTable();
    });
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error}`);
  }
};