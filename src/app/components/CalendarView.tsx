import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Plus, X, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'class' | 'delivery' | 'personal' | 'exam';
}

export function CalendarView() {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'personal' as Event['type'] });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('yomiuri-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Add some default events
      const defaultEvents: Event[] = [
        { id: '1', title: 'Morning Delivery', date: new Date().toISOString().split('T')[0], time: '05:00', type: 'delivery' },
        { id: '2', title: 'Economics Exam', date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '10:00', type: 'exam' },
        { id: '3', title: 'Study Group', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '14:00', type: 'personal' },
      ];
      setEvents(defaultEvents);
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('yomiuri-events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate.toISOString().split('T')[0],
      time: newEvent.time,
      type: newEvent.type,
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', time: '', type: 'personal' });
    setIsAddingEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const eventTypeColors: Record<Event['type'], string> = {
    class: 'bg-blue-500',
    delivery: 'bg-red-500',
    personal: 'bg-purple-500',
    exam: 'bg-orange-500',
  };

  const days = t('calendar.days', { returnObjects: true }) as string[];

  return (
    <div className="max-w-none md:max-w-7xl mx-auto">
      <h2 className="text-3xl mb-6">{t('calendar.title')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-[var(--theme-card-bg)] rounded-xl p-8 shadow-sm border border-[var(--theme-card-border)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {days.map(day => (
              <div key={day} className="text-center text-sm text-gray-600 py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = new Date().getDate() === day && 
                             new Date().getMonth() === currentDate.getMonth() &&
                             new Date().getFullYear() === currentDate.getFullYear();
              const isSelected = selectedDate?.getDate() === day &&
                                selectedDate?.getMonth() === currentDate.getMonth() &&
                                selectedDate?.getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isToday
                      ? 'bg-[var(--theme-bg-from)] border-blue-300'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm">{day}</div>
                  <div className="flex gap-2 mt-1 justify-center">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.type]}`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-[var(--theme-card-bg)] rounded-xl p-8 shadow-sm border border-[var(--theme-card-border)]">
          <h3 className="text-xl mb-6">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
              : t('calendar.selectDate')}
          </h3>

          {selectedDate && (
            <>
              <button
                onClick={() => setIsAddingEvent(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                <Plus className="size-4" />
                {t('calendar.addEvent')}
              </button>

              {isAddingEvent && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                  <input
                    type="text"
                    placeholder={t('calendar.eventTitle')}
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="personal">{t('calendar.personal')}</option>
                    <option value="class">{t('calendar.class')}</option>
                    <option value="delivery">{t('calendar.delivery')}</option>
                    <option value="exam">{t('calendar.exam')}</option>
                  </select>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddEvent}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('calendar.save')}
                    </button>
                    <button
                      onClick={() => setIsAddingEvent(false)}
                      className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t('calendar.cancel')}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {getEventsForSelectedDate().length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">{t('calendar.noEvents')}</p>
                ) : (
                  getEventsForSelectedDate().map(event => (
                    <div
                      key={event.id}
                      className="p-4 bg-gray-50 rounded-lg flex items-start justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full mt-1 ${eventTypeColors[event.type]}`} />
                        <div>
                          <p className="text-sm">{event.title}</p>
                          {event.time && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Clock className="size-3" />
                              {event.time}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="size-4 text-gray-600" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {!selectedDate && (
            <p className="text-sm text-gray-500 text-center py-8">
              {t('calendar.clickToView')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
