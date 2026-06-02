import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send } from 'lucide-react'

export function Chatbot({ onToggle }: { onToggle?: (open: boolean) => void }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: t('chatbot.welcome'), isUser: false }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, { text: input, isUser: true }])
    const userMessage = input
    setInput('')

    // Get data from localStorage
    const events = JSON.parse(localStorage.getItem('yomiuri-events') || '[]')
    const notes = JSON.parse(localStorage.getItem('yomiuri-notes') || '[]')

    // Simulate AI response based on keywords and data
    setTimeout(() => {
      let response = ''
      const lowerInput = userMessage.toLowerCase()

      if (lowerInput.includes('試験') || lowerInput.includes('exam') || lowerInput.includes('いつ試験')) {
        const exams = events.filter((e: any) => e.type === 'exam')
        if (exams.length > 0) {
          response = t('chatbot.examInfo') + exams.map((exam: any) => `${exam.date}: ${exam.title} (${exam.time})`).join(', ')
        } else {
          response = t('chatbot.noExams')
        }
      } else if (lowerInput.includes('イベント') || lowerInput.includes('event') || lowerInput.includes('スケジュール')) {
        const upcomingEvents = events.filter((e: any) => new Date(e.date) >= new Date())
        if (upcomingEvents.length > 0) {
          response = t('chatbot.upcomingEvents') + upcomingEvents.slice(0, 3).map((event: any) => `${event.date}: ${event.title}`).join(', ')
        } else {
          response = t('chatbot.noEvents')
        }
      } else if (lowerInput.includes('メモ') || lowerInput.includes('note')) {
        if (notes.length > 0) {
          response = t('chatbot.notesInfo') + notes.slice(0, 3).map((note: any) => note.title).join(', ')
        } else {
          response = t('chatbot.noNotes')
        }
      } else if (lowerInput.includes('天気') || lowerInput.includes('weather')) {
        response = t('chatbot.weatherResponse')
      } else if (lowerInput.includes('地図') || lowerInput.includes('map') || lowerInput.includes('maps')) {
        response = t('chatbot.mapResponse')
      } else if (lowerInput.includes('学校') || lowerInput.includes('school') || lowerInput.includes('schoolinfo')) {
        response = t('chatbot.schoolResponse')
      } else if (lowerInput.includes('こんにちは') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
        response = t('chatbot.greetingResponse')
      } else if (lowerInput.includes('ありがとう') || lowerInput.includes('thank')) {
        response = t('chatbot.thankResponse')
      } else if (lowerInput.includes('今日') || lowerInput.includes('today') || lowerInput.includes('今')) {
        const todayEvents = events.filter((e: any) => e.date === new Date().toISOString().split('T')[0])
        if (todayEvents.length > 0) {
          response = t('chatbot.todayEvents') + todayEvents.map((event: any) => `${event.title} (${event.time})`).join(', ')
        } else {
          response = t('chatbot.noTodayEvents')
        }
      } else if (lowerInput.includes('時間') || lowerInput.includes('time') || lowerInput.includes('何時')) {
        response = `現在の時間は ${new Date().toLocaleTimeString('ja-JP')} です。`
      } else {
        // General responses
        const generalResponses = [
          t('chatbot.general1'),
          t('chatbot.general2'),
          t('chatbot.general3'),
          t('chatbot.general4'),
          t('chatbot.general5'),
          t('chatbot.general6'),
        ]
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)]
      }

      setMessages(prev => [...prev, { text: response, isUser: false }])
    }, 1000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setIsOpen(false)
              onToggle?.(false)
            }}
          />
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col relative z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold">{t('chatbot.title')}</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                onToggle?.(false)
              }}
              className="hover:bg-white/20 rounded-full p-1"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
        </>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true)
            onToggle?.(true)
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="size-8" />
        </button>
      )}
    </div>
  )
}