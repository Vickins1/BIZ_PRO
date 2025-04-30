import { db } from './db';

// INVENTORY INTERFACE
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
}

// SALES INTERFACE
export interface SaleItem {
  id: number;
  item_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

// INIT INVENTORY TABLE
export const initInventoryTable = async (): Promise<void> => {
  try {
    const database = await db;
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
        price REAL NOT NULL CHECK (price >= 0),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Inventory table initialized');
  } catch (error) {
    console.error('❌ Failed to initialize inventory table:', error);
    throw new Error(`Table initialization failed: ${error}`);
  }
};

// INSERT ITEM INTO INVENTORY
export const insertItem = async (
  name: string,
  quantity: number,
  price: number
): Promise<void> => {
  try {
    if (!name?.trim()) throw new Error('Item name is required');
    if (!Number.isInteger(quantity) || quantity < 0)
      throw new Error('Quantity must be a non-negative integer');
    if (typeof price !== 'number' || price < 0 || !Number.isFinite(price))
      throw new Error('Price must be a valid non-negative number');

    const database = await db;
    await database.withTransactionAsync(async () => {
      await database.runAsync(
        `INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?);`,
        [name.trim(), quantity, price]
      );
    });
    console.log('✅ Item inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert item:', error);
    throw new Error(`Item insertion failed: ${error}`);
  }
};

// FETCH INVENTORY ITEMS
export const fetchItems = async (): Promise<InventoryItem[]> => {
  try {
    const database = await db;
    let results: InventoryItem[] = [];
    await database.withTransactionAsync(async () => {
      const result = await database.getAllAsync(
        `SELECT * FROM inventory ORDER BY created_at DESC;`
      );
      results = result as InventoryItem[];
    });
    return results;
  } catch (error) {
    console.error('❌ Failed to fetch items:', error);
    throw new Error(`Item fetch failed: ${error}`);
  }
};

// INIT SALES TABLE
export const initSalesTable = async (): Promise<void> => {
  try {
    const database = await db;
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
        total_price REAL NOT NULL CHECK (total_price >= 0),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Sales table initialized');
  } catch (error) {
    console.error('❌ Failed to initialize sales table:', error);
    throw new Error(`Sales table initialization failed: ${error}`);
  }
};

// INSERT SALE
export const insertSale = async (
  item_name: string,
  quantity: number,
  total_price: number
): Promise<void> => {
  try {
    if (!item_name?.trim()) throw new Error('Item name is required');
    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new Error('Quantity must be a positive integer');
    if (typeof total_price !== 'number' || total_price < 0 || !Number.isFinite(total_price))
      throw new Error('Total price must be a valid non-negative number');

    const database = await db;
    await database.withTransactionAsync(async () => {
      await database.runAsync(
        `INSERT INTO sales (item_name, quantity, total_price) VALUES (?, ?, ?);`,
        [item_name.trim(), quantity, total_price]
      );
    });
    console.log('✅ Sale inserted successfully');
  } catch (error) {
    console.error('❌ Failed to insert sale:', error);
    throw new Error(`Sale insertion failed: ${error}`);
  }
};

// FETCH SALES DATA
export const fetchSales = async (): Promise<SaleItem[]> => {
  try {
    const database = await db;
    let results: SaleItem[] = [];
    await database.withTransactionAsync(async () => {
      const result = await database.getAllAsync(
        `SELECT * FROM sales ORDER BY created_at DESC;`
      );
      results = result as SaleItem[];
    });
    return results;
  } catch (error) {
    console.error('❌ Failed to fetch sales:', error);
    throw new Error(`Sales fetch failed: ${error}`);
  }
};