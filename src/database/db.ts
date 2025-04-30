import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseAsync('bizpro.db');

export default db;