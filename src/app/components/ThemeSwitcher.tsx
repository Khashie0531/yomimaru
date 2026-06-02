import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Palette, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const [currentTheme, setCurrentTheme] = useState('blue')

  const themes = [
    {
      name: 'blue',
      color: '#3B82F6',
      bgFrom: '#3B82F6',
      bgTo: '#9333EA',
      buttonPrimary: '#3B82F6',
      buttonHover: '#2563EB',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#3B82F6',
      accentLight: 'rgba(59, 130, 246, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#3B82F6',
      sidebarHover: 'rgba(59, 130, 246, 0.8)',
      gradientFrom: '#3B82F6',
      gradientTo: '#9333EA',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'purple',
      color: '#8B5CF6',
      bgFrom: '#8B5CF6',
      bgTo: '#EC4899',
      buttonPrimary: '#8B5CF6',
      buttonHover: '#7C3AED',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#8B5CF6',
      accentLight: 'rgba(139, 92, 246, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#8B5CF6',
      sidebarHover: 'rgba(139, 92, 246, 0.8)',
      gradientFrom: '#8B5CF6',
      gradientTo: '#EC4899',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'green',
      color: '#10B981',
      bgFrom: '#10B981',
      bgTo: '#14B8A6',
      buttonPrimary: '#10B981',
      buttonHover: '#059669',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#10B981',
      accentLight: 'rgba(16, 185, 129, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#10B981',
      sidebarHover: 'rgba(16, 185, 129, 0.8)',
      gradientFrom: '#10B981',
      gradientTo: '#14B8A6',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'pink',
      color: '#EC4899',
      bgFrom: '#EC4899',
      bgTo: '#F43F5E',
      buttonPrimary: '#EC4899',
      buttonHover: '#DB2777',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#EC4899',
      accentLight: 'rgba(236, 72, 153, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#EC4899',
      sidebarHover: 'rgba(236, 72, 153, 0.8)',
      gradientFrom: '#EC4899',
      gradientTo: '#F43F5E',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'red',
      color: '#EF4444',
      bgFrom: '#EF4444',
      bgTo: '#F97316',
      buttonPrimary: '#EF4444',
      buttonHover: '#DC2626',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#EF4444',
      accentLight: 'rgba(239, 68, 68, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#EF4444',
      sidebarHover: 'rgba(239, 68, 68, 0.8)',
      gradientFrom: '#EF4444',
      gradientTo: '#F97316',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'orange',
      color: '#F97316',
      bgFrom: '#F97316',
      bgTo: '#EAB308',
      buttonPrimary: '#F97316',
      buttonHover: '#EA580C',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#F97316',
      accentLight: 'rgba(249, 115, 22, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#F97316',
      sidebarHover: 'rgba(249, 115, 22, 0.8)',
      gradientFrom: '#F97316',
      gradientTo: '#EAB308',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'yellow',
      color: '#EAB308',
      bgFrom: '#EAB308',
      bgTo: '#F97316',
      buttonPrimary: '#EAB308',
      buttonHover: '#CA8A04',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#EAB308',
      accentLight: 'rgba(234, 179, 8, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#EAB308',
      sidebarHover: 'rgba(234, 179, 8, 0.8)',
      gradientFrom: '#EAB308',
      gradientTo: '#F97316',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
    {
      name: 'gray',
      color: '#6B7280',
      bgFrom: '#6B7280',
      bgTo: '#475569',
      buttonPrimary: '#6B7280',
      buttonHover: '#4B5563',
      cardBg: '#FFFFFF',
      cardBorder: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      accent: '#6B7280',
      accentLight: 'rgba(107, 114, 128, 0.1)',
      success: '#10B981',
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      sidebarBg: '#6B7280',
      sidebarHover: 'rgba(107, 114, 128, 0.8)',
      gradientFrom: '#6B7280',
      gradientTo: '#475569',
      bgPrimary: '#F9FAFB',
      bgSecondary: '#FFFFFF'
    },
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
      document.documentElement.style.setProperty('--theme-bg-light', theme.accentLight)
      document.documentElement.style.setProperty('--theme-text', theme.textPrimary)

      // Button colors
      document.documentElement.style.setProperty('--theme-button-primary', theme.buttonPrimary)
      document.documentElement.style.setProperty('--theme-button-hover', theme.buttonHover)

      // Card and surface colors
      document.documentElement.style.setProperty('--theme-card-bg', theme.cardBg)
      document.documentElement.style.setProperty('--theme-card-border', theme.cardBorder)

      // Text colors
      document.documentElement.style.setProperty('--theme-text-primary', theme.textPrimary)
      document.documentElement.style.setProperty('--theme-text-secondary', theme.textSecondary)
      document.documentElement.style.setProperty('--theme-text-muted', theme.textMuted)

      // Accent colors
      document.documentElement.style.setProperty('--theme-accent', theme.accent)
      document.documentElement.style.setProperty('--theme-accent-light', theme.accentLight)

      // Status colors
      document.documentElement.style.setProperty('--theme-success', theme.success)
      document.documentElement.style.setProperty('--theme-success-light', theme.successLight)
      document.documentElement.style.setProperty('--theme-warning', theme.warning)
      document.documentElement.style.setProperty('--theme-warning-light', theme.warningLight)
      document.documentElement.style.setProperty('--theme-error', theme.error)
      document.documentElement.style.setProperty('--theme-error-light', theme.errorLight)

      // Sidebar colors
      document.documentElement.style.setProperty('--theme-sidebar-bg', theme.sidebarBg)
      document.documentElement.style.setProperty('--theme-sidebar-hover', theme.sidebarHover)

      // Gradient colors
      document.documentElement.style.setProperty('--theme-gradient-from', theme.gradientFrom)
      document.documentElement.style.setProperty('--theme-gradient-to', theme.gradientTo)

      // Background colors
      document.documentElement.style.setProperty('--theme-bg-primary', theme.bgPrimary)
      document.documentElement.style.setProperty('--theme-bg-secondary', theme.bgSecondary)
    }
  }

  const changeTheme = (themeName: string) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    localStorage.setItem('yomiuri-theme', themeName)
  }

  const getThemeClasses = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)
    return theme ? `bg-[${theme.color}]` : 'bg-[#3B82F6]'
  }

  return (
    <div className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`flex items-center gap-1 md:gap-2 bg-gradient-to-r ${getThemeClasses(currentTheme)} backdrop-blur-2xl border-2 border-white rounded-xl px-3 py-3 md:px-4 md:py-4 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all`}>
            <Palette className="size-6 md:size-8 text-white" />
            <span className="text-xs md:text-sm font-semibold">{t('theme.title', 'テーマ')}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/95 backdrop-blur-2xl border-2 border-white shadow-lg p-3">
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => changeTheme(theme.name)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  currentTheme === theme.name ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              >
                {currentTheme === theme.name && <Check className="size-4 text-white mx-auto" />}
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
              {t('theme.reset', 'クリア')}
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}