import Database from 'better-sqlite3';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const db = new Database('local.db');

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
}

export function createUser(user: User) {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
  const result = stmt.run(user.email, hashedPassword, user.name || null);
  return result.lastInsertRowid;
}

export function validateUser(email: string, password: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name };
}

export function saveTransaction(userId: number, transaction: any) {
  const stmt = db.prepare(
    'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  return stmt.run(
    userId,
    transaction.type,
    transaction.amount,
    transaction.category,
    transaction.description,
    transaction.date.toISOString()
  );
}

export function getTransactions(userId: number) {
  const stmt = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC');
  const rows = stmt.all(userId);
  return rows.map((row: any) => ({
    ...row,
    date: new Date(row.date),
  }));
}