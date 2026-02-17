import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'scholar.db');

const db = new Database(dbPath);

// テーブルの初期化
export function initializeDatabase() {
  // ユーザーテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // スケジュールテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      time TEXT NOT NULL,
      monday TEXT,
      tuesday TEXT,
      wednesday TEXT,
      thursday TEXT,
      friday TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // アカデミック情報テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      gpa TEXT NOT NULL,
      attendance TEXT NOT NULL,
      credits_completed INTEGER NOT NULL,
      total_credits INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 成績履歴テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS grade_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      gpa TEXT NOT NULL,
      attendance TEXT NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 予定イベントテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS upcoming_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // キャリアサポートテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS career_support (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      next_internship TEXT NOT NULL,
      application_deadline TEXT NOT NULL,
      resume_reviews INTEGER NOT NULL,
      interviews_scheduled INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // メモテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      tags TEXT,
      color TEXT DEFAULT '#ffffff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // リマインダー・通知テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      due_time TEXT,
      reminder_type TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

export default db;
