import { useState, useEffect } from 'react'
import { Book, Clock, User, GraduationCap, TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../hooks/useSchedule';

export function SchoolInfo() {
  const { t } = useTranslation()
  const { schedule: sharedSchedule } = useSchedule()

  const initialSchedule = sharedSchedule.length > 0 ? sharedSchedule : [
    { time: '5:00-6:30', monday: t('schoolInfo.delivery'), tuesday: t('schoolInfo.delivery'), wednesday: t('schoolInfo.delivery'), thursday: t('schoolInfo.delivery'), friday: t('schoolInfo.delivery') },
    { time: '9:00-10:30', monday: t('schoolInfo.english'), tuesday: '-', wednesday: '-', thursday: t('schoolInfo.english'), friday: '-' },
    { time: '10:00-11:30', monday: t('schoolInfo.economics'), tuesday: '-', wednesday: t('schoolInfo.economics'), thursday: '-', friday: '-' },
    { time: '13:00-14:30', monday: '-', tuesday: t('schoolInfo.literature'), wednesday: '-', thursday: t('schoolInfo.literature'), friday: '-' },
    { time: '15:00-16:30', monday: '-', tuesday: '-', wednesday: t('schoolInfo.management'), thursday: '-', friday: t('schoolInfo.management') },
    { time: '16:00-17:30', monday: t('schoolInfo.delivery'), tuesday: t('schoolInfo.delivery'), wednesday: t('schoolInfo.delivery'), thursday: t('schoolInfo.delivery'), friday: t('schoolInfo.delivery') },
  ]

  const [schedule, setSchedule] = useState(initialSchedule)
  
  // 共有スケジュールが変更されたときに更新
  useEffect(() => {
    if (sharedSchedule.length > 0) {
      setSchedule(sharedSchedule)
    }
  }, [sharedSchedule])
  const [upcomingEventsEditing, setUpcomingEventsEditing] = useState(false)
  const [careerSupportEditing, setCareerSupportEditing] = useState(false)
  const [academicPerformanceEditing, setAcademicPerformanceEditing] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const initialAcademicInfo = {
    gpa: '3.8',
    attendance: '95%',
    creditsCompleted: 45,
    totalCredits: 120,
  }
  
  const [academicInfo, setAcademicInfo] = useState(initialAcademicInfo)

  const startEdit = () => {
    setEditing(true)
  }
  
  const startEditUpcomingEvents = () => {
    setUpcomingEventsEditing(true)
  }
  
  const startEditCareerSupport = () => {
    setCareerSupportEditing(true)
  }
  
  const cancelEdit = () => {
    setSchedule(initialSchedule.map(s => ({ ...s })))
    setUpcomingEvents(initialUpcomingEvents.map(e => ({ ...e })))
    setCareerSupport({ ...initialCareerSupport })
    setEditing(false)
  }
  
  const cancelEditUpcomingEvents = () => {
    setUpcomingEvents(initialUpcomingEvents.map(e => ({ ...e })))
    setUpcomingEventsEditing(false)
  }
  
  const cancelEditCareerSupport = () => {
    setCareerSupport({ ...initialCareerSupport })
    setCareerSupportEditing(false)
  }
  
  const saveEdit = () => {
    setEditing(false)
  }
  
  const saveEditUpcomingEvents = () => {
    setUpcomingEventsEditing(false)
  }
  
  const saveEditCareerSupport = () => {
    setCareerSupportEditing(false)
  }
  
  const startEditAcademicPerformance = () => {
    setAcademicPerformanceEditing(true)
  }
  
  const cancelEditAcademicPerformance = () => {
    setAcademicInfo({ ...initialAcademicInfo })
    setAcademicPerformanceEditing(false)
  }
  
  const saveEditAcademicPerformance = () => {
    setAcademicPerformanceEditing(false)
  }
  
  const updateAcademicInfo = (field: string, value: string | number) => {
    setAcademicInfo(prev => ({ ...prev, [field]: value }))
  }

  const updateSchedule = (rowIndex: number, day: string, value: string) => {
    setSchedule(prev => prev.map((row, i) => i === rowIndex ? { ...row, [day]: value } : row))
  }

  const updateUpcomingEvent = (index: number, field: string, value: string) => {
    setUpcomingEvents(prev => prev.map((event, i) => i === index ? { ...event, [field]: value } : event))
  }

  const updateCareerSupport = (field: string, value: string | number) => {
    setCareerSupport(prev => ({ ...prev, [field]: value }))
  }

  const initialUpcomingEvents = [
    {
      type: 'exam',
      title: t('schoolInfo.advancedEconomicsMidterm'),
      date: '2026-01-20',
      time: '10:00 AM',
      location: 'Building A, Room 301',
    },
    {
      type: 'assignment',
      title: t('schoolInfo.businessManagementReport'),
      date: '2026-01-18',
      time: '11:59 PM',
      location: t('schoolInfo.onlineSubmission'),
    },
    {
      type: 'meeting',
      title: t('schoolInfo.careerCounselingSession'),
      date: '2026-01-22',
      time: '2:00 PM',
      location: t('schoolInfo.studentCenter') + ', Room 205',
    },
  ];

  const initialCareerSupport = {
    nextInternship: t('schoolInfo.yomiuriDigitalMediaDept'),
    applicationDeadline: '2026-02-15',
    resumeReviews: 3,
    interviewsScheduled: 2,
  };

  const [upcomingEvents, setUpcomingEvents] = useState(initialUpcomingEvents)
  const [careerSupport, setCareerSupport] = useState(initialCareerSupport)

  return (
    <div className="max-w-none md:max-w-7xl mx-auto">
      <h2 className="text-3xl mb-8">{t('schoolInfo.title')}</h2>

      {/* Scholarship Info Card */}
      <div className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-bg-to)] text-white rounded-xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="size-8" />
          <div>
            <h3 className="text-2xl">{t('schoolInfo.scholarshipInfo')}</h3>
            <p className="text-blue-100">{t('schoolInfo.programName')}</p>
          </div>
        </div>

      </div>

      {/* Academic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* GPA & Attendance */}
        <div className="bg-[var(--theme-card-bg)] rounded-xl p-6 shadow-sm border border-[var(--theme-card-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg flex items-center gap-2">
              <TrendingUp className="size-5 text-[var(--theme-primary)]" />
              {t('schoolInfo.academicPerformance')}
            </h3>
            <div>
              {academicPerformanceEditing ? (
                <>
                  <button onClick={saveEditAcademicPerformance} className="mr-2 px-3 py-1 rounded bg-[var(--theme-accent)] text-white">保存</button>
                  <button onClick={cancelEditAcademicPerformance} className="px-3 py-1 rounded border">キャンセル</button>
                </>
              ) : (
                <button onClick={startEditAcademicPerformance} className="px-3 py-1 rounded border">編集</button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('schoolInfo.gpa')}</span>
              {academicPerformanceEditing ? (
                <input type="text" value={academicInfo.gpa} onChange={(e) => updateAcademicInfo('gpa', e.target.value)} className="w-24 p-1 border rounded text-right text-2xl font-bold text-[var(--theme-primary)]" />
              ) : (
                <span className="text-2xl font-bold text-[var(--theme-primary)]">{academicInfo.gpa}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('schoolInfo.attendanceRate')}</span>
              {academicPerformanceEditing ? (
                <input type="text" value={academicInfo.attendance} onChange={(e) => updateAcademicInfo('attendance', e.target.value)} className="w-24 p-1 border rounded text-right text-2xl font-bold text-[var(--theme-success)]" />
              ) : (
                <span className="text-2xl font-bold text-[var(--theme-success)]">{academicInfo.attendance}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('schoolInfo.creditsCompleted')}</span>
              {academicPerformanceEditing ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={academicInfo.creditsCompleted} onChange={(e) => updateAcademicInfo('creditsCompleted', parseInt(e.target.value))} className="w-16 p-1 border rounded text-right font-semibold" />
                  <span>/</span>
                  <input type="number" value={academicInfo.totalCredits} onChange={(e) => updateAcademicInfo('totalCredits', parseInt(e.target.value))} className="w-16 p-1 border rounded text-right font-semibold" />
                </div>
              ) : (
                <span className="text-lg font-semibold">{academicInfo.creditsCompleted}/{academicInfo.totalCredits}</span>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-[var(--theme-card-bg)] rounded-xl p-6 shadow-sm border border-[var(--theme-card-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg flex items-center gap-2">
              <Calendar className="size-5 text-[var(--theme-primary)]" />
              {t('schoolInfo.upcomingEvents')}
            </h3>
            <div>
              {upcomingEventsEditing ? (
                <>
                  <button onClick={saveEditUpcomingEvents} className="mr-2 px-3 py-1 rounded bg-[var(--theme-accent)] text-white">保存</button>
                  <button onClick={cancelEditUpcomingEvents} className="px-3 py-1 rounded border">キャンセル</button>
                </>
              ) : (
                <button onClick={startEditUpcomingEvents} className="px-3 py-1 rounded border">編集</button>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--theme-bg-light)]">
                <div className={`p-2 rounded-lg ${
                  event.type === 'exam' ? 'bg-[var(--theme-error-light)]' :
                  event.type === 'assignment' ? 'bg-[var(--theme-warning-light)]' :
                  'bg-[var(--theme-info-light)]'
                }`}>
                  {event.type === 'exam' ? <Target className="size-4 text-[var(--theme-error)]" /> :
                   event.type === 'assignment' ? <Book className="size-4 text-[var(--theme-warning)]" /> :
                   <User className="size-4 text-[var(--theme-info)]" />}
                </div>
                <div className="flex-1">
                  {upcomingEventsEditing ? (
                    <>
                      <input value={event.title} onChange={(e) => updateUpcomingEvent(index, 'title', e.target.value)} className="w-full p-1 border rounded mb-1" />
                      <input value={event.date} onChange={(e) => updateUpcomingEvent(index, 'date', e.target.value)} className="w-full p-1 border rounded mb-1" />
                      <input value={event.time} onChange={(e) => updateUpcomingEvent(index, 'time', e.target.value)} className="w-full p-1 border rounded mb-1" />
                      <input value={event.location} onChange={(e) => updateUpcomingEvent(index, 'location', e.target.value)} className="w-full p-1 border rounded" />
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Support */}
      <div className="bg-[var(--theme-card-bg)] rounded-xl p-6 shadow-sm border border-[var(--theme-card-border)] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg flex items-center gap-2">
            <Award className="size-5 text-[var(--theme-primary)]" />
            {t('schoolInfo.careerSupport')}
          </h3>
          <div>
            {careerSupportEditing ? (
              <>
                <button onClick={saveEditCareerSupport} className="mr-2 px-3 py-1 rounded bg-[var(--theme-accent)] text-white">保存</button>
                <button onClick={cancelEditCareerSupport} className="px-3 py-1 rounded border">キャンセル</button>
              </>
            ) : (
              <button onClick={startEditCareerSupport} className="px-3 py-1 rounded border">編集</button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            {careerSupportEditing ? (
              <input type="number" value={careerSupport.resumeReviews} onChange={(e) => updateCareerSupport('resumeReviews', parseInt(e.target.value))} className="w-full p-1 border rounded text-center text-2xl font-bold text-[var(--theme-primary)]" />
            ) : (
              <p className="text-2xl font-bold text-[var(--theme-primary)]">{careerSupport.resumeReviews}</p>
            )}
            <p className="text-sm text-gray-600">{t('schoolInfo.resumeReviews')}</p>
          </div>
          <div className="text-center">
            {careerSupportEditing ? (
              <input type="number" value={careerSupport.interviewsScheduled} onChange={(e) => updateCareerSupport('interviewsScheduled', parseInt(e.target.value))} className="w-full p-1 border rounded text-center text-2xl font-bold text-[var(--theme-success)]" />
            ) : (
              <p className="text-2xl font-bold text-[var(--theme-success)]">{careerSupport.interviewsScheduled}</p>
            )}
            <p className="text-sm text-gray-600">{t('schoolInfo.interviewsScheduled')}</p>
          </div>
          <div className="text-center">
            {careerSupportEditing ? (
              <input value={careerSupport.nextInternship} onChange={(e) => updateCareerSupport('nextInternship', e.target.value)} className="w-full p-1 border rounded text-center text-lg font-semibold text-[var(--theme-warning)]" />
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-warning)]">{careerSupport.nextInternship}</p>
            )}
            <p className="text-sm text-gray-600">{t('schoolInfo.nextOpportunity')}</p>
          </div>
          <div className="text-center">
            {careerSupportEditing ? (
              <input value={careerSupport.applicationDeadline} onChange={(e) => updateCareerSupport('applicationDeadline', e.target.value)} className="w-full p-1 border rounded text-center text-lg font-semibold text-[var(--theme-error)]" />
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-error)]">{careerSupport.applicationDeadline}</p>
            )}
            <p className="text-sm text-gray-600">{t('schoolInfo.deadline')}</p>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Overview */}
      <div className="bg-[var(--theme-card-bg)] rounded-xl p-8 shadow-sm border border-[var(--theme-card-border)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl">{t('schoolInfo.weeklySchedule')}</h3>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">{t('schoolInfo.time')}</th>
                <th className="text-left p-4">{t('schoolInfo.monday')}</th>
                <th className="text-left p-4">{t('schoolInfo.tuesday')}</th>
                <th className="text-left p-4">{t('schoolInfo.wednesday')}</th>
                <th className="text-left p-4">{t('schoolInfo.thursday')}</th>
                <th className="text-left p-4">{t('schoolInfo.friday')}</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  <td className="p-4 text-sm text-gray-600">{editing ? <input value={row.time} onChange={(e) => updateSchedule(rowIndex, 'time', e.target.value)} className="w-full p-1 border rounded" /> : row.time}</td>
                  <td className="p-4">{editing ? <input value={row.monday} onChange={(e) => updateSchedule(rowIndex, 'monday', e.target.value)} className="w-full p-1 border rounded" /> : <span className="text-sm bg-[var(--theme-bg-light)] text-[var(--theme-primary)] px-2 py-1 rounded">{row.monday}</span>}</td>
                  <td className="p-4">{editing ? <input value={row.tuesday} onChange={(e) => updateSchedule(rowIndex, 'tuesday', e.target.value)} className="w-full p-1 border rounded" /> : row.tuesday === '-' ? '-' : <span className="text-sm bg-[var(--theme-bg-light)] text-[var(--theme-primary)] px-2 py-1 rounded">{row.tuesday}</span>}</td>
                  <td className="p-4">{editing ? <input value={row.wednesday} onChange={(e) => updateSchedule(rowIndex, 'wednesday', e.target.value)} className="w-full p-1 border rounded" /> : row.wednesday === '-' ? '-' : <span className="text-sm bg-[var(--theme-bg-light)] text-[var(--theme-primary)] px-2 py-1 rounded">{row.wednesday}</span>}</td>
                  <td className="p-4">{editing ? <input value={row.thursday} onChange={(e) => updateSchedule(rowIndex, 'thursday', e.target.value)} className="w-full p-1 border rounded" /> : row.thursday === '-' ? '-' : <span className="text-sm bg-[var(--theme-bg-light)] text-[var(--theme-primary)] px-2 py-1 rounded">{row.thursday}</span>}</td>
                  <td className="p-4">{editing ? <input value={row.friday} onChange={(e) => updateSchedule(rowIndex, 'friday', e.target.value)} className="w-full p-1 border rounded" /> : row.friday === '-' ? '-' : <span className="text-sm bg-[var(--theme-bg-light)] text-[var(--theme-primary)] px-2 py-1 rounded">{row.friday}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
