import { useState, useEffect } from 'react'
import { Dashboard } from './components/Dashboard'
import { AuthPage } from './components/AuthPage'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Chatbot } from './components/Chatbot'
import { useAuth } from './contexts/AuthContext'

export default function App() {
  const { user, loading } = useAuth()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Firebase 認証の初期化中はローディング画面を表示
  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="size-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[var(--theme-bg-from)] to-[var(--theme-bg-to)]">
      <Chatbot onToggle={setIsChatOpen} />
      {!isChatOpen && <LanguageSwitcher />}
      {user ? (
        <Dashboard />
      ) : (
        <AuthPage />
      )}
    </div>
  )
}
