import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  BookOpen,
  StickyNote,
  Cloud,
  Map,
  Menu,
  X,
  Newspaper,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

import { SchoolInfo } from './SchoolInfo'
import { Notes } from './Notes'
import { CalendarView } from './CalendarView'
import { Weather } from './Weather'
import { Maps } from './Maps'
import { Overview } from './Overview'
import { AccountProfile } from './AccountProfile'

type Page =
  | 'overview'
  | 'school'
  | 'notes'
  | 'calendar'
  | 'weather'
  | 'maps'
  | 'accountProfile'

export function Dashboard() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navigation = [
    { name: t('dashboard.overview'), icon: Newspaper, page: 'overview' },
    { name: t('dashboard.schoolInfo'), icon: BookOpen, page: 'school' },
    { name: t('dashboard.notes'), icon: StickyNote, page: 'notes' },
    { name: t('dashboard.calendar'), icon: Calendar, page: 'calendar' },
    { name: t('dashboard.weather'), icon: Cloud, page: 'weather' },
    { name: t('dashboard.maps'), icon: Map, page: 'maps' },
    { name: t('dashboard.account'), icon: User, page: 'accountProfile' },
  ] as { name: string; icon: any; page: Page }[]

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview onNavigate={setCurrentPage} />
      case 'school':
        return <SchoolInfo />
      case 'notes':
        return <Notes />
      case 'calendar':
        return <CalendarView />
      case 'weather':
        return <Weather />
      case 'maps':
        return <Maps sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      case 'accountProfile':
        return <AccountProfile />
      default:
        return <Overview onNavigate={setCurrentPage} />
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (err) {
      console.error('ログアウト失敗:', err)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-screen bg-[var(--theme-bg-primary)]">
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-500 ease-in-out bg-[var(--theme-primary)] text-white flex flex-col overflow-hidden md:relative fixed inset-0 md:inset-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50 md:z-auto`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-[var(--theme-sidebar-hover)]"
          >
            <X className="size-6" />
          </button>
        </div>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <Newspaper className="size-8" />
          <div>
            <h1 className="text-lg font-semibold transition-all duration-300">
              {sidebarOpen ? 'よみまる' : t('dashboard.yomiuriScholar')}
            </h1>
            {sidebarOpen && (
              <p className="text-xs text-blue-200">{t('dashboard.supportHub')}</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setCurrentPage(item.page)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                currentPage === item.page
                  ? 'bg-[var(--theme-sidebar-hover)]'
                  : 'hover:bg-[var(--theme-sidebar-hover)]'
              }`}
            >
              <item.icon className="size-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800 space-y-3">
          <div className="text-xs text-blue-200">
            {t('dashboard.scholarshipStudentDashboard')}
          </div>
          {user && (
            <div className="text-xs text-blue-300 truncate">
              {user.email}
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[var(--theme-bg-secondary)] border-b px-4 py-4 flex justify-between items-center lg:px-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-[var(--theme-accent-light)]"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('ja-JP')}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-12 md:px-16 lg:px-20">
          <div className="max-w-none md:max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

