import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check, Palette } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [currentTheme, setCurrentTheme] = useState('blue')

  const themes = [
    { name: 'blue', color: '#3B82F6', bgFrom: '#3B82F6', bgTo: '#9333EA' },
    { name: 'purple', color: '#8B5CF6', bgFrom: '#8B5CF6', bgTo: '#EC4899' },
    { name: 'green', color: '#10B981', bgFrom: '#10B981', bgTo: '#14B8A6' },
    { name: 'pink', color: '#EC4899', bgFrom: '#EC4899', bgTo: '#F43F5E' },
    { name: 'red', color: '#EF4444', bgFrom: '#EF4444', bgTo: '#F97316' },
    { name: 'orange', color: '#F97316', bgFrom: '#F97316', bgTo: '#EAB308' },
    { name: 'yellow', color: '#EAB308', bgFrom: '#EAB308', bgTo: '#F97316' },
    { name: 'gray', color: '#6B7280', bgFrom: '#6B7280', bgTo: '#475569' },
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('yomiuri-theme') || 'blue'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)
    if (theme) {
      // Primary theme colors
      document.documentElement.style.setProperty('--theme-primary', theme.color)
      document.documentElement.style.setProperty('--theme-bg-from', theme.bgFrom)
      document.documentElement.style.setProperty('--theme-bg-to', theme.bgTo)
      document.documentElement.style.setProperty('--theme-bg-light', theme.color + '1A')
      document.documentElement.style.setProperty('--theme-text', '#FFFFFF')

      // Button colors
      document.documentElement.style.setProperty('--theme-button-primary', theme.color)
      document.documentElement.style.setProperty('--theme-button-hover', theme.color)

      // Card and surface colors
      document.documentElement.style.setProperty('--theme-card-bg', '#FFFFFF')
      document.documentElement.style.setProperty('--theme-card-border', '#E5E7EB')

      // Text colors
      document.documentElement.style.setProperty('--theme-text-primary', '#111827')
      document.documentElement.style.setProperty('--theme-text-secondary', '#6B7280')
      document.documentElement.style.setProperty('--theme-text-muted', '#9CA3AF')

      // Accent colors
      document.documentElement.style.setProperty('--theme-accent', theme.color)
      document.documentElement.style.setProperty('--theme-accent-light', theme.color + '1A')

      // Status colors
      document.documentElement.style.setProperty('--theme-success', '#10B981')
      document.documentElement.style.setProperty('--theme-success-light', '#10B9811A')
      document.documentElement.style.setProperty('--theme-warning', '#F59E0B')
      document.documentElement.style.setProperty('--theme-warning-light', '#F59E0B1A')
      document.documentElement.style.setProperty('--theme-error', '#EF4444')
      document.documentElement.style.setProperty('--theme-error-light', '#EF44441A')
      document.documentElement.style.setProperty('--theme-info', theme.color)
      document.documentElement.style.setProperty('--theme-info-light', theme.color + '1A')

      // Sidebar colors
      document.documentElement.style.setProperty('--theme-sidebar-bg', theme.color)
      document.documentElement.style.setProperty('--theme-sidebar-hover', theme.color + 'CC')

      // Gradient colors
      document.documentElement.style.setProperty('--theme-gradient-from', theme.bgFrom)
      document.documentElement.style.setProperty('--theme-gradient-to', theme.bgTo)

      // Background colors
      document.documentElement.style.setProperty('--theme-bg-primary', '#F9FAFB')
      document.documentElement.style.setProperty('--theme-bg-secondary', '#FFFFFF')

      // Chart colors
      document.documentElement.style.setProperty('--theme-chart-blue', '#3B82F6')
      document.documentElement.style.setProperty('--theme-chart-yellow', '#F59E0B')
      document.documentElement.style.setProperty('--theme-chart-green', '#10B981')
      document.documentElement.style.setProperty('--theme-chart-cyan', '#06B6D4')
      document.documentElement.style.setProperty('--theme-chart-purple', '#8B5CF6')
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const changeTheme = (themeName: string) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    localStorage.setItem('yomiuri-theme', themeName)
  }

  const languages = [
    { code: 'ja', name: '日本語' },
    { code: 'en', name: 'English' },
    { code: 'mn', name: 'Монгол' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'ne', name: 'नेपाली' },
    { code: 'zh', name: '中文' },
    { code: 'my', name: 'မြန်မာ' },
  ]

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-2xl border-2 border-white rounded-2xl px-6 py-4 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
            <Globe className="size-8 text-white" />
            <span className="text-lg font-semibold">言語</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/95 backdrop-blur-2xl border-2 border-white shadow-lg">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            >
              {i18n.language === lang.code && <Check className="size-4 text-blue-500" />}
              <span className={i18n.language === lang.code ? 'font-semibold text-blue-600' : ''}>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`flex items-center gap-2 bg-gradient-to-r ${currentTheme === 'blue' ? 'from-blue-500 to-purple-600' : currentTheme === 'purple' ? 'from-purple-500 to-pink-600' : currentTheme === 'green' ? 'from-green-500 to-teal-600' : currentTheme === 'pink' ? 'from-pink-500 to-rose-600' : currentTheme === 'red' ? 'from-red-500 to-orange-600' : currentTheme === 'orange' ? 'from-orange-500 to-yellow-600' : currentTheme === 'yellow' ? 'from-yellow-500 to-orange-600' : 'from-gray-500 to-slate-600'} backdrop-blur-2xl border-2 border-white rounded-2xl px-6 py-4 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all`}>
            <Palette className="size-8 text-white" />
            <span className="text-lg font-semibold">テーマ</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/95 backdrop-blur-2xl border-2 border-white shadow-lg p-3">
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => changeTheme(theme.name)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  currentTheme === theme.name ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              >
                {currentTheme === theme.name && <Check className="size-5 text-black mx-auto" />}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => changeTheme('blue')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              title="デフォルトに戻す"
            >
              <Palette className="size-4" />
              クリア
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}