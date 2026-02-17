/**
 * Firebase Authentication を使用した
 * ログイン / 新規登録ページ
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export function AuthPage() {
  const { login, signup, error, clearError } = useAuth();

  // 新規登録 / ログインモードの切り替え
  const [isSignup, setIsSignup] = useState(false);
  
  // フォーム入力
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI 状態
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // エラー/成功メッセージ
  const [successMessage, setSuccessMessage] = useState('');

  // フォーム入力値の検証
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isPasswordMatching = !isSignup || password === confirmPassword;
  const isFormValid = isEmailValid && isPasswordValid && isPasswordMatching;

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await login(email, password);
      setSuccessMessage('ログインしました！');
      // フォームをリセット
      setEmail('');
      setPassword('');
    } catch (err) {
      // エラーは useAuth の error に設定済み
      console.error('ログイン失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  // 新規登録処理
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await signup(email, password);
      setSuccessMessage('登録完了しました！');
      // フォームをリセット
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // ログインモードに切り替え
      setTimeout(() => {
        setIsSignup(false);
      }, 1500);
    } catch (err) {
      // エラーは useAuth の error に設定済み
      console.error('登録失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  // モード切り替え時のクリア処理
  const handleModeSwitch = (newMode: boolean) => {
    setIsSignup(newMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSuccessMessage('');
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ / タイトル */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4">
            <LogIn className="size-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">学習アプリ</h1>
          <p className="text-gray-600">Firebase Authentication で安全にログイン</p>
        </div>

        {/* カード */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* タブ */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleModeSwitch(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                !isSignup
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <LogIn className="size-5" />
              ログイン
            </button>
            <button
              onClick={() => handleModeSwitch(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                isSignup
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="size-5" />
              新規登録
            </button>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* 成功メッセージ */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {/* メールアドレス入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 size-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
              {email && !isEmailValid && (
                <p className="text-red-500 text-xs mt-1">有効なメールアドレスを入力してください</p>
              )}
            </div>

            {/* パスワード入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 size-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上のパスワード"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {password && !isPasswordValid && (
                <p className="text-red-500 text-xs mt-1">パスワードは6文字以上である必要があります</p>
              )}
            </div>

            {/* 確認用パスワード入力（新規登録のみ） */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード確認
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 size-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="パスワードをもう一度入力"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {confirmPassword && !isPasswordMatching && (
                  <p className="text-red-500 text-xs mt-1">パスワードが一致しません</p>
                )}
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  処理中...
                </>
              ) : isSignup ? (
                <>
                  <UserPlus className="size-5" />
                  新規登録
                </>
              ) : (
                <>
                  <LogIn className="size-5" />
                  ログイン
                </>
              )}
            </button>
          </form>
        </div>

        {/* フッターテキスト */}
        <p className="text-center text-gray-600 text-sm mt-6">
          このアプリは Firebase Authentication で保護されています。
          <br />
          あなたのデータは安全に管理されます。
        </p>
      </div>
    </div>
  );
}
