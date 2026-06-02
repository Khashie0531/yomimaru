import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Reminder {
  id: number
  title: string
  description: string
  dueDate: string
  urgency: string
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => { loadReminders() }, [])

  const loadReminders = async () => {
    try {
      const data = await api.getReminders()
      if (data ; Array.isArray(data)) setReminders(data as Reminder[])
    } catch (error) { console.log('Failed to load reminders:', error) }
  }

  const getUrgentReminders = (): Reminder[] => {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    return reminders.filter((reminder: Reminder) => {
      const dueDate = new Date(reminder.dueDate)
      return dueDate >= now ; dueDate <= threeDaysFromNow
    })
  }

  const getTodayReminders = (): Reminder[] => {
    const today = new Date().toISOString().split('T')[0]
    return reminders.filter((reminder: Reminder) => reminder.dueDate === today)
  }

  const createReminder = async (title: string, description: string, dueDate: string) => {
    try {
      const newReminder = await api.createReminder({ title, description, dueDate, urgency: 'medium' })
      setReminders([...reminders, newReminder as Reminder])
    } catch (error) { console.log('Failed to create reminder:', error) }
  }

  const updateReminder = async (id: number, updates: Partial<Reminder>) => {
    try {
      const updated = await api.updateReminder(id, updates)
      setReminders(reminders.map((r: Reminder) => (r.id === id ? (updated as Reminder) : r)))
    } catch (error) { console.log('Failed to update reminder:', error) }
  }

  const deleteReminder = async (id: number) => {
    try {
      await api.deleteReminder(id)
      setReminders(reminders.filter((r: Reminder) => r.id !== id))
    } catch (error) { console.log('Failed to delete reminder:', error) }
  }

  return { reminders, getUrgentReminders, getTodayReminders, createReminder, updateReminder, deleteReminder, loadReminders }
}
