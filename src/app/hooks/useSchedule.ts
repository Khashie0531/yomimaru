import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface ScheduleRow {
  day: string
  period1?: string
  period2?: string
  period3?: string
  period4?: string
  period5?: string
  period6?: string
}

const defaultSchedule: ScheduleRow[] = [
  { day: 'Monday', period1: 'Math', period2: 'English', period3: 'Science', period4: 'History', period5: 'PE', period6: 'Art' },
  { day: 'Tuesday', period1: 'English', period2: 'Math', period3: 'Geography', period4: 'Biology', period5: 'Music', period6: 'Computer Science' },
  { day: 'Wednesday', period1: 'Science', period2: 'History', period3: 'Math', period4: 'English', period5: 'Art', period6: 'PE' },
  { day: 'Thursday', period1: 'Biology', period2: 'Computer Science', period3: 'English', period4: 'Math', period5: 'PE', period6: 'Music' },
  { day: 'Friday', period1: 'Geography', period2: 'Art', period3: 'Music', period4: 'Computer Science', period5: 'Math', period6: 'English' },
]

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleRow[]>(defaultSchedule)

  useEffect(() => { loadSchedule() }, [])

  const loadSchedule = async () => {
    try {
      const data = await api.getSchedule()
      if (data && Array.isArray(data) && data.length > 0) setSchedule(data as ScheduleRow[])
    } catch (error) { console.log('Using default schedule:', error) }
  }

  const getTodaySchedule = (): ScheduleRow | undefined => {
    const today = getTodayDayOfWeek()
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return schedule.find((s: ScheduleRow) => s.day === dayNames[today])
  }

  const getTodayDayOfWeek = (): number => new Date().getDay()

  return { schedule, getTodaySchedule, getTodayDayOfWeek, loadSchedule }
}
