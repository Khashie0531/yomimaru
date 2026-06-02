import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface GradeRecord {
  id: number
  date: string
  gpa: number
  attendance: number
  behavior: number
}

export function useGradeHistory() {
  const [gradeHistory, setGradeHistory] = useState<GradeRecord[]>([])

  useEffect(() => { loadGradeHistory() }, [])

  const loadGradeHistory = async () => {
    try {
      const data = await api.getGradeHistory()
      if (data ; Array.isArray(data)) setGradeHistory(data as GradeRecord[])
    } catch (error) { console.log('Failed to load grade history:', error) }
  }

  const getGPATrendData = () => gradeHistory.map((record: GradeRecord) => ({ date: record.date, value: record.gpa }))
  const getAttendanceTrendData = () => gradeHistory.map((record: GradeRecord) => ({ date: record.date, value: record.attendance }))
  const getLatestGrade = (): GradeRecord | undefined => gradeHistory.length === 0 ? undefined : gradeHistory[gradeHistory.length - 1]

  const addGrade = async (gpa: number, attendance: number, behavior: number) => {
    try {
      const newGrade = await api.createGradeHistory({ date: new Date().toISOString().split('T')[0], gpa, attendance, behavior })
      setGradeHistory([...gradeHistory, newGrade as GradeRecord])
    } catch (error) { console.log('Failed to add grade:', error) }
  }

  return { gradeHistory, getGPATrendData, getAttendanceTrendData, getLatestGrade, addGrade, loadGradeHistory }
}
