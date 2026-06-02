import express from 'express';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { initializeDatabase } from './db.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

// ミドルウェア
app.use(cors());
app.use(express.json());

// ログイン・登録のレート制限（ブルートフォース対策）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 15分内に5回までのリクエストに制限
  message: 'Too many authentication attempts, please try again later',
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// データベース初期化
initializeDatabase();

// ======================
// ユーティリティ関数
// ======================

// メールアドレスの形式検証
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// パスワード強度チェック
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return errors;
}

// ======================
// 認証ミドルウェア
// ======================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ======================
// Authentication Routes
// ======================
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 必須フィールドの確認
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ユーザー名の長さチェック
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    // メールアドレスの形式チェック
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // パスワード強度チェック
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ error: 'Password does not meet requirements', details: passwordErrors });
    }

    // ユーザー名またはメールアドレスが既に登録されているか確認
    const existingUser = db.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).get(username, email);

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already registered' });
    }

    // パスワードをハッシュ化（salt rounds: 12）
    const hashedPassword = bcryptjs.hashSync(password, 12);
    
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, email, hashedPassword);

    // JWTトークン生成
    const token = jwt.sign(
      { id: result.lastInsertRowid, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // リフレッシュトークン生成
    const refreshToken = jwt.sign(
      { id: result.lastInsertRowid },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      username,
      email,
      token,
      refreshToken,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    // ユーザー名またはメールアドレスでユーザーを検索
    const user = db.prepare(
      'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?'
    ).get(username, username);

    // ユーザーが存在しないか、パスワードが一致しない場合
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // JWTトークン生成
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // リフレッシュトークン生成
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token,
      refreshToken,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// ======================
// Token Refresh Route
// ======================
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }

      // ユーザー情報を取得
      const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(decoded.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 新しいアクセストークンを生成
      const newToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token: newToken,
        message: 'Token refreshed successfully'
      });
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'An error occurred during token refresh' });
  }
});

// ======================
// Schedule Routes
// ======================
app.get('/api/schedule', authenticateToken, (req, res) => {
  try {
    const schedule = db.prepare('SELECT * FROM schedule WHERE user_id = ? ORDER BY time').all(req.user.id);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/schedule', authenticateToken, (req, res) => {
  try {
    const { time, monday, tuesday, wednesday, thursday, friday } = req.body;
    const stmt = db.prepare(
      'INSERT INTO schedule (user_id, time, monday, tuesday, wednesday, thursday, friday) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, time, monday, tuesday, wednesday, thursday, friday);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/schedule/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { time, monday, tuesday, wednesday, thursday, friday } = req.body;
    const stmt = db.prepare(
      'UPDATE schedule SET time = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(time, monday, tuesday, wednesday, thursday, friday, id, req.user.id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/schedule/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM schedule WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Academic Info Routes
// ======================
app.get('/api/academic-info', authenticateToken, (req, res) => {
  try {
    const info = db.prepare('SELECT * FROM academic_info WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(req.user.id);
    if (!info) {
      return res.json({ gpa: '3.8', attendance: '95%', credits_completed: 45, total_credits: 120 });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/academic-info', authenticateToken, (req, res) => {
  try {
    const { gpa, attendance, credits_completed, total_credits } = req.body;
    const stmt = db.prepare(
      'INSERT INTO academic_info (user_id, gpa, attendance, credits_completed, total_credits) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, gpa, attendance, credits_completed, total_credits);

    // 履歴にも記録
    db.prepare('INSERT INTO grade_history (user_id, gpa, attendance) VALUES (?, ?, ?)').run(
      req.user.id,
      gpa,
      attendance
    );

    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/academic-info/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { gpa, attendance, credits_completed, total_credits } = req.body;
    const stmt = db.prepare(
      'UPDATE academic_info SET gpa = ?, attendance = ?, credits_completed = ?, total_credits = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(gpa, attendance, credits_completed, total_credits, id, req.user.id);

    // 履歴にも記録
    db.prepare('INSERT INTO grade_history (user_id, gpa, attendance) VALUES (?, ?, ?)').run(
      req.user.id,
      gpa,
      attendance
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Grade History Routes
// ======================
app.get('/api/grade-history', authenticateToken, (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM grade_history WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 12').all(req.user.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Upcoming Events Routes
// ======================
app.get('/api/upcoming-events', authenticateToken, (req, res) => {
  try {
    const events = db.prepare('SELECT * FROM upcoming_events WHERE user_id = ? ORDER BY date').all(req.user.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upcoming-events', authenticateToken, (req, res) => {
  try {
    const { type, title, date, time, location } = req.body;
    const stmt = db.prepare(
      'INSERT INTO upcoming_events (user_id, type, title, date, time, location) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, type, title, date, time, location);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/upcoming-events/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, date, time, location } = req.body;
    const stmt = db.prepare(
      'UPDATE upcoming_events SET type = ?, title = ?, date = ?, time = ?, location = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(type, title, date, time, location, id, req.user.id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/upcoming-events/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM upcoming_events WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Career Support Routes
// ======================
app.get('/api/career-support', authenticateToken, (req, res) => {
  try {
    const support = db.prepare('SELECT * FROM career_support WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(req.user.id);
    if (!support) {
      return res.json({
        next_internship: 'Yomiuri Digital Media Dept',
        application_deadline: '2026-02-15',
        resume_reviews: 3,
        interviews_scheduled: 2,
      });
    }
    res.json(support);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-support', authenticateToken, (req, res) => {
  try {
    const { next_internship, application_deadline, resume_reviews, interviews_scheduled } = req.body;
    const stmt = db.prepare(
      'INSERT INTO career_support (user_id, next_internship, application_deadline, resume_reviews, interviews_scheduled) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, next_internship, application_deadline, resume_reviews, interviews_scheduled);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/career-support/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { next_internship, application_deadline, resume_reviews, interviews_scheduled } = req.body;
    const stmt = db.prepare(
      'UPDATE career_support SET next_internship = ?, application_deadline = ?, resume_reviews = ?, interviews_scheduled = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(next_internship, application_deadline, resume_reviews, interviews_scheduled, id, req.user.id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Notes Routes
// ======================
app.get('/api/notes', authenticateToken, (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC').all(req.user.id);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', authenticateToken, (req, res) => {
  try {
    const { title, content, tags, color } = req.body;
    const stmt = db.prepare(
      'INSERT INTO notes (user_id, title, content, tags, color) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, title, content, tags, color || '#ffffff');
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notes/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, color } = req.body;
    const stmt = db.prepare(
      'UPDATE notes SET title = ?, content = ?, tags = ?, color = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(title, content, tags, color, id, req.user.id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================
// Reminders Routes
// ======================
app.get('/api/reminders', authenticateToken, (req, res) => {
  try {
    const reminders = db.prepare('SELECT * FROM reminders WHERE user_id = ? ORDER BY due_date').all(req.user.id);
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reminders', authenticateToken, (req, res) => {
  try {
    const { title, description, due_date, due_time, reminder_type } = req.body;
    const stmt = db.prepare(
      'INSERT INTO reminders (user_id, title, description, due_date, due_time, reminder_type) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, title, description, due_date, due_time, reminder_type);
    res.json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reminders/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, due_time, reminder_type, is_completed } = req.body;
    const stmt = db.prepare(
      'UPDATE reminders SET title = ?, description = ?, due_date = ?, due_time = ?, reminder_type = ?, is_completed = ? WHERE id = ? AND user_id = ?'
    );
    stmt.run(title, description, due_date, due_time, reminder_type, is_completed, id, req.user.id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reminders/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reminders WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
