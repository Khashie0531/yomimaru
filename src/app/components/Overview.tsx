import { useState, useEffect } from 'react'
import { BookOpen, StickyNote, Calendar, Cloud, Map, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSchedule } from '../hooks/useSchedule'

type Page = 'overview' | 'school' | 'notes' | 'calendar' | 'weather' | 'maps'

interface OverviewProps {
  onNavigate: (page: Page) => void
}

export function Overview({ onNavigate }: OverviewProps) {
  const { t } = useTranslation()
  const { getTodaySchedule } = useSchedule()

  const quickLinks = [
    {
      name: t('overview.schoolInfo'),
      icon: BookOpen,
      page: 'school' as Page,
      color: 'bg-[var(--theme-chart-blue)]',
      description: t('overview.schoolInfoDesc'),
    },
    {
      name: t('overview.notes'),
      icon: StickyNote,
      page: 'notes' as Page,
      color: 'bg-[var(--theme-chart-yellow)]',
      description: t('overview.notesDesc'),
    },
    {
      name: t('overview.calendar'),
      icon: Calendar,
      page: 'calendar' as Page,
      color: 'bg-[var(--theme-chart-green)]',
      description: t('overview.calendarDesc'),
    },
    {
      name: t('overview.weather'),
      icon: Cloud,
      page: 'weather' as Page,
      color: 'bg-[var(--theme-chart-cyan)]',
      description: t('overview.weatherDesc'),
    },
    {
      name: t('overview.maps'),
      icon: Map,
      page: 'maps' as Page,
      color: 'bg-[var(--theme-chart-purple)]',
      description: t('overview.mapsDesc'),
    },
  ]

  const todaySchedule = getTodaySchedule()
  const initialTasks = todaySchedule.length > 0 ? todaySchedule : [
    { task: t('overview.morningDelivery'), time: '5:00 AM', completed: true },
    { task: t('overview.economicsLecture'), time: '10:00 AM', completed: false },
    { task: t('overview.studyGroup'), time: '2:00 PM', completed: false },
    { task: t('overview.eveningDelivery'), time: '4:00 PM', completed: false },
  ]

  const [tasks, setTasks] = useState(initialTasks)
  const [draft, setDraft] = useState(initialTasks)
  const [editing, setEditing] = useState(false)

  // 今日のスケジュールが変更されたときに tasks を更新
  useEffect(() => {
    if (todaySchedule.length > 0) {
      setTasks(todaySchedule)
      setDraft(todaySchedule)
    }
  }, [todaySchedule])

  const startEdit = () => {
    setDraft(tasks.map((t) => ({ ...t })))
    setEditing(true)
  }
  const cancelEdit = () => {
    setDraft(tasks.map((t) => ({ ...t })))
    setEditing(false)
  }
  const saveEdit = () => {
    setTasks(draft.map((d) => ({ ...d })))
    setEditing(false)
  }

  const updateDraft = (index: number, field: string, value: any) => {
    setDraft((prev) => {
      const copy = prev.map((p) => ({ ...p }))
      // @ts-ignore
      copy[index][field] = value
      return copy
    })
  }

  const toggleCompleted = (index: number) => {
    setTasks((prev) => prev.map((t, i) => i === index ? { ...t, completed: !t.completed } : t))
  }

  return (
    <div className="max-w-none md:max-w-7xl mx-auto space-y-8 px-6 sm:px-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white rounded-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl mb-1">{new Date().toLocaleDateString('ja-JP')}</h2>
        <p className="text-xs sm:text-sm text-blue-100">
          おかえりなさい
        </p>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-base sm:text-lg mb-4">{t('overview.quickAccess')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {quickLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className="bg-[var(--theme-card-bg)] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow text-left border border-[var(--theme-card-border)] active:scale-[0.98]"
            >
              <div
                className={`${link.color} w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center mb-3`}
              >
                <link.icon className="size-5 text-white" />
              </div>
              <h4 className="text-sm sm:text-base font-medium mb-1">
                {link.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                {link.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule & Stats */}
      <div>
        {/* Today */}
        <div className="bg-[var(--theme-card-bg)] rounded-xl p-6 sm:p-8 shadow-sm border border-[var(--theme-card-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg">{t('overview.todaySchedule')}</h3>
            <div>
              {editing ? (
                <>
                  <button onClick={saveEdit} className="mr-2 px-3 py-1 rounded bg-[var(--theme-accent)] text-white">保存</button>
                  <button onClick={cancelEdit} className="px-3 py-1 rounded border">キャンセル</button>
                </>
              ) : (
                <button onClick={startEdit} className="px-3 py-1 rounded border">編集</button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {(editing ? draft : tasks).map((item, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${item.completed ? 'bg-[var(--theme-success-light)]' : 'bg-[var(--theme-bg-secondary)]'}`} onClick={editing ? undefined : () => toggleCompleted(index)}>
                <CheckCircle className={`size-4 ${item.completed ? 'text-[var(--theme-success)]' : 'text-gray-300'}`} />
                <div className="flex-1">
                  {editing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input value={item.task} onChange={(e) => updateDraft(index, 'task', e.target.value)} className="col-span-2 p-2 rounded border" />
                      <input value={item.time} onChange={(e) => updateDraft(index, 'time', e.target.value)} className="p-2 rounded border" />
                      <label className="col-span-3 text-xs mt-1 inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!item.completed} onChange={(e) => updateDraft(index, 'completed', e.target.checked)} />
                        完了
                      </label>
                    </div>
                  ) : (
                    <>
                      <p className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.task}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  )
}
