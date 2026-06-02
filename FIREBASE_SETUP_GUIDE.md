# Firebase Authentication セットアップガイド

このガイドは、Firebase Authentication を使用してメール・パスワードでのログイン機能を実装するための完全な手順です。初心者向けの詳しい説明を含んでいます。

---

## 📋 目次

1. [Firebase プロジェクトの作成](#firebase-プロジェクトの作成)
2. [Firebaseの初期設定](#firebaseの初期設定)
3. [アプリケーションの設定](#アプリケーションの設定)
4. [動作確認](#動作確認)
5. [コード説明](#コード説明)
6. [トラブルシューティング](#トラブルシューティング)

---

## Firebase プロジェクトの作成

### ステップ 1: Firebase コンソールにアクセス

1. [Firebase コンソール](https://console.firebase.google.com)を開く
2. Google アカウントでログイン（まだの場合は作成）

### ステップ 2: 新しいプロジェクトを作成

1. **プロジェクトを作成**をクリック
2. プロジェクト名を入力（例：`yomiuri-scholar-app`）
3. **続行**をクリック
4. Google アナリティクスは**有効にする**でもしなくても大丈夫（初心者は無効でOK）
5. **プロジェクト作成**をクリック

### ステップ 3: ウェブアプリを登録

1. プロジェクトが作成されたら、`</>` アイコン（ウェブアプリ）をクリック
2. アプリニックネームを入力（例：`React App`）
3. **ホスティングをセットアップします**はチェックしない
4. **アプリを登録**をクリック
5. Firebase SDK 設定情報が表示される

---

## Firebaseの初期設定

### ステップ 1: Authentication を有効にする

1. Firebase コンソールで、左メニューの**Authentication**をクリック
2. **Sign-in method**タブを開く
3. **メール/パスワード**を探して、クリック
4. **有効にする**をクリック
5. **保存**をクリック

### ステップ 2: SDK 設定情報を確認

1. プロジェクト設定に移動（左上の歯車アイコン → **プロジェクト設定**）
2. **全般**タブ内の**マイアプリ**セクションをスクロール
3. **SDK 設定とその他**をクリック
4. **構成**が選択されている状態で、以下の情報をコピー：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "xxx",
  appId: "1:xxx:web:xxx"
};
```

---

## アプリケーションの設定

### ステップ 1: パッケージをインストール

```bash
npm install firebase
```

### ステップ 2: 環境変数を設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=1:xxx:web:xxx
```

### ステップ 3: ファイル構成

すでに以下のファイルが作成されています：

```
src/
  firebase/
    config.ts           ← Firebase 初期化設定
  app/
    contexts/
      AuthContext.tsx   ← ログイン状態管理
    components/
      AuthPage.tsx      ← ログイン/新規登録画面
      Dashboard.tsx     ← ダッシュボード（ログアウト機能付き）
      App.tsx           ← メインアプリ（AuthProvider でラップ）
  main.tsx              ← 更新済み（AuthProvider を追加）
```

---

## 動作確認

### ステップ 1: 開発サーバーを起動

```bash
npm run dev
```

### ステップ 2: テスト

1. ブラウザで `http://localhost:5173` を開く
2. **新規登録**タブをクリック
3. テストメールアドレス（例：`test@example.com`）とパスワードを入力
4. **新規登録**ボタンをクリック
5. ダッシュボードが表示されたら成功！

### ステップ 3: ログアウトテスト

1. サイドバーの**ログアウト**ボタンをクリック
2. ログイン画面に戻ることを確認

---

## コード説明

### 1. Firebase 設定ファイル（`src/firebase/config.ts`）

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Firebase から取得した設定情報
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**何をしているか：**
- Firebase を初期化して、認証機能を使える状態にします
- `auth` オブジェクトをエクスポートして、アプリ全体から使用可能にします

---

### 2. Authentication Context（`src/app/contexts/AuthContext.tsx`）

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase の認証状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 新規登録
  const signup = async (email: string, password: string) => {
    // ...
  };

  // ログイン
  const login = async (email: string, password: string) => {
    // ...
  };

  // ログアウト
  const logout = async () => {
    // ...
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**何をしているか：**
- **ユーザーのログイン状態をアプリ全体で管理**
- Firebase の認証状態を常に監視
- ログイン、新規登録、ログアウト機能を提供
- エラーを日本語に翻訳

**使用方法：**
```typescript
const { user, loading, login, signup, logout, error } = useAuth();

// user: ログインしているユーザー情報（null ならログインしていない）
// loading: 初期化中かどうか
// login: ログイン関数
// signup: 新規登録関数
// logout: ログアウト関数
// error: エラーメッセージ
```

---

### 3. ログイン/新規登録ページ（`src/app/components/AuthPage.tsx`）

```typescript
export function AuthPage() {
  const { login, signup, error, clearError } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // ログイン成功
    } catch (err) {
      // エラーは useAuth の error に設定済み
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      // 新規登録成功
    } catch (err) {
      // エラーは useAuth の error に設定済み
    }
  };

  return (
    <div className="login-form">
      {/* フォーム UI */}
    </div>
  );
}
```

**何をしているか：**
- ログイン/新規登録画面を表示
- メールアドレスとパスワードの入力値を検証
- Firebase の login/signup 関数を呼び出す
- エラーメッセージを表示

---

### 4. アプリケーション（`src/app/App.tsx`）

```typescript
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      {user ? <Dashboard /> : <AuthPage />}
    </div>
  );
}

// main.tsx で AuthProvider でラップ
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

**何をしているか：**
- `user` があれば **Dashboard** を表示（ログイン後の画面）
- `user` がなければ **AuthPage** を表示（ログイン画面）
- 自動的にログイン状態が切り替わる

---

## トラブルシューティング

### ❌ エラー: `VITE_FIREBASE_API_KEY is not defined`

**原因：** `.env.local` ファイルが正しく作成されていない

**解決方法：**
1. プロジェクトルートに `.env.local` ファイルが存在することを確認
2. ファイルの内容が正しいことを確認
3. VS Code の **Explorer** で `.env.local` を見つけて確認

```env
VITE_FIREBASE_API_KEY=AIzaSy... # これが必要
```

---

### ❌ エラー: `auth/weak-password`

**原因：** パスワードが 6 文字未満

**解決方法：** 6 文字以上のパスワードを入力

---

### ❌ エラー: `auth/email-already-in-use`

**原因：** そのメールアドレスは既に登録済み

**解決方法：** 別のメールアドレスを使用するか、Firebase コンソールでユーザーを削除

---

### ❌ エラー: `auth/user-not-found`

**原因：** 登録されていないメールアドレスでログインしようとした

**解決方法：** 先に新規登録してからログインするか、メールアドレスを確認

---

### ❌ エラー: `auth/wrong-password`

**原因：** パスワードが間違っている

**解決方法：** パスワードを確認してもう一度入力

---

### 🔄 ログイン状態がリロード後に消える

**原因：** Firefox やプライベートブラウジングモードで `localStorage` が無効

**解決方法：**
- 通常のブラウジングモードを使用
- または、ログイン状態を `sessionStorage` で管理するように変更

---

## セキュリティ注意事項

⚠️ **重要:**

1. **API キーを公開しない**
   - `.env.local` ファイルを **絶対に Git にコミットしないこと**
   - `.gitignore` に `.env.local` が追加されているか確認

2. **本番環境での設定**
   - 本番環境では Environment Variables を使用
   - Vercel / Netlify などのホスティングサービスの設定画面で環境変数を設定

3. **Firebase Security Rules**
   - デフォルトではログインユーザーのデータしかアクセスできません
   - 必要に応じてセキュリティルールをカスタマイズ

---

## 次のステップ

### できるようになったこと

✅ メール・パスワードでログイン/新規登録  
✅ ユーザーのログイン状態を管理  
✅ ログアウト機能  
✅ エラーハンドリング  

### 拡張アイデア

- **Google ログイン**を追加
- **メール検証**を追加
- **パスワードリセット**機能を追加
- **プロフィール編集**機能
- **ユーザーデータベース（Firestore）** に連携

---

## 参考リンク

- [Firebase 公式ドキュメント](https://firebase.google.com/docs/web/setup?hl=ja)
- [Firebase Authentication](https://firebase.google.com/docs/auth?hl=ja)
- [Vite 環境変数](https://ja.vitejs.dev/guide/env-and-modes.html)

---

ご質問があれば、お気軽にお聞きください！
