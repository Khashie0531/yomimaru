/**
 * Authentication Context
 * 
 * ユーザーのログイン状態を管理するコンテキストです。
 * アプリ全体でユーザー情報やログイン状態にアクセスできます。
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { auth } from '../../firebase/config';

// Context の型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Context を作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider コンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase のログイン状態を監視
  useEffect(() => {
    // ローカルストレージに保存する設定
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // 失敗する場合もあるので無視
    });

    // 認証状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  // 新規登録
  const signup = async (email: string, password: string) => {
    setError(null);
    try {
      console.log('📝 新規登録試行:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ 新規登録成功:', result.user.email);
    } catch (err) {
      console.error('❌ 新規登録失敗エラー:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  // ログイン
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      console.log('🔐 ログイン試行:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ ログイン成功:', result.user.email);
    } catch (err) {
      console.error('❌ ログイン失敗エラー:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  // ログアウト
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  // エラーをクリア
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Context を使用するカスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth は AuthProvider の内側で使用する必要があります');
  }
  return context;
}

/**
 * Firebase エラーを日本語メッセージに変換
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;

    // Firebase のエラーコードをチェック
    if (message.includes('auth/weak-password')) {
      return 'パスワードは6文字以上である必要があります';
    }
    if (message.includes('auth/email-already-in-use')) {
      return 'このメールアドレスは既に登録済みです';
    }
    if (message.includes('auth/invalid-email')) {
      return 'メールアドレスの形式が正しくありません';
    }
    if (message.includes('auth/user-not-found')) {
      return 'このメールアドレスは登録されていません';
    }
    if (message.includes('auth/wrong-password')) {
      return 'パスワードが間違っています';
    }
    if (message.includes('auth/invalid-credential')) {
      return 'メールアドレスまたはパスワードが正しくありません';
    }
    if (message.includes('auth/too-many-requests')) {
      return 'ログイン試行回数が多すぎます。後でもう一度お試しください';
    }
  }

  return '認証エラーが発生しました。もう一度お試しください';
}
