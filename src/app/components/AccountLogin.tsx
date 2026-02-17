import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react'
import { api, setAuthToken, setRefreshToken } from '../../api/client'

type Props = {
  onLogin: () => void
}

export function AccountLogin({ onLogin }: Props) {
  const { t } = useTranslation()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.login(username || email, password)
      if (result.token) {
        setAuthToken(result.token)
        if (result.refreshToken) {
          setRefreshToken(result.refreshToken)
        }
        localStorage.setItem('loggedIn', 'true')
        onLogin()
      } else {
        setError(result.error || t('accountLogin.error'))
      }
    } catch (err: any) {
      setError(err.message || t('accountLogin.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // フロントエンド検証
    if (!username || !email || !password || !confirmPassword) {
      setError('全てのフィールドを入力してください')
      return
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (username.length < 3 || username.length > 30) {
      setError('ユーザー名は3〜30文字である必要があります')
      return
    }

    setLoading(true)

    try {
      const result = await api.register(username, email, password)
      if (result.token) {
        setAuthToken(result.token)
        if (result.refreshToken) {
          setRefreshToken(result.refreshToken)
        }
        localStorage.setItem('loggedIn', 'true')
        onLogin()
      } else {
        setError(result.error || '登録に失敗しました')
      }
    } catch (err: any) {
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl px-8 py-12"
      >
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-white">
            {isRegister ? '新規登録' : t('accountLogin.title')}
          </h1>
          <p className="mt-4 text-sm text-blue-200">
            {isRegister ? '新しいアカウントを作成します' : t('accountLogin.subtitle')}
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-6 p-3 text-sm text-red-300 bg-red-500/20 rounded-lg text-center">
            {error}
          </p>
        )}

        {/* Username (Register only) */}
        {isRegister && (
          <div className="mb-6">
            <label className="text-xs text-blue-200 mb-2 block">
              ユーザー名
            </label>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <UserPlus className="size-4 text-blue-300" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none text-sm"
                placeholder="ユーザー名を入力"
              />
            </div>
          </div>
        )}

        {/* Email or Username */}
        <div className="mb-6">
          <label className="text-xs text-blue-200 mb-2 block">
            {isRegister ? 'メールアドレス' : t('accountLogin.email')}
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <Mail className="size-4 text-blue-300" />
            <input
              type={isRegister ? 'email' : 'text'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none text-sm"
              placeholder={isRegister ? 'メールアドレスを入力' : t('accountLogin.emailPlaceholder')}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-xs text-blue-200 mb-3 block">
            {t('accountLogin.password')}
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <Lock className="size-4 text-blue-300" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none text-sm"
              placeholder={t('accountLogin.passwordPlaceholder')}
            />
          </div>
        </div>

        {/* Confirm Password (Register only) */}
        {isRegister && (
          <div className="mb-10">
            <label className="text-xs text-blue-200 mb-3 block">
              パスワード確認
            </label>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <Lock className="size-4 text-blue-300" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none text-sm"
                placeholder="パスワードを再入力"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mb-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <LogIn className="size-5" />
          {loading ? '処理中...' : isRegister ? '登録する' : t('accountLogin.login')}
        </button>

        {/* Toggle Register/Login */}
        <button
          type="button"
          onClick={handleToggleMode}
          className="w-full py-2 text-sm text-blue-200 hover:text-white transition"
        >
          {isRegister ? 'ログインの方はこちら' : '新規登録の方はこちら'}
        </button>
      </form>
    </div>
  )
}
