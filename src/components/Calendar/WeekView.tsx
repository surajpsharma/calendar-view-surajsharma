import React, { useMemo } from 'react';
import type { CalendarEvent } from './CalendarView.types';
import { isSameDay } from '../../utils/date.utils';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onSelectDate: (d: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeekView: React.FC<WeekViewProps> = ({ date, events, onEventClick }) => {
  const weekDays = useMemo(() => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(d);
      dayDate.setDate(d.getDate() + i);
      return dayDate;
    });
  }, [date]);

  const eventsByDayAndHour = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of events) {
      for (const day of weekDays) {
        if (isSameDay(evt.startDate, day)) {
          const hour = evt.startDate.getHours();
          const key = `${day.toDateString()}-${hour}`;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(evt);
        }
      }
    }
    return map;
  }, [events, weekDays]);

  const formatTime = (hour: number) => {
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  };

  const getEventStyle = (evt: CalendarEvent) => {
    const startHour = evt.startDate.getHours();
    const startMin = evt.startDate.getMinutes();
    const endHour = evt.endDate.getHours();
    const endMin = evt.endDate.getMinutes();
    
    const topPercent = (startMin / 60) * 100;
    const durationHours = (endHour - startHour) + ((endMin - startMin) / 60);
    const heightRem = durationHours * 4; // 4rem per hour
    
    return {
      top: `${topPercent}%`,
      height: `${heightRem}rem`,
      backgroundColor: evt.color || '#e4e4e7',
    };
  };

  return (
    <div role="grid" aria-label="Week view" className="border rounded-lg bg-white overflow-auto">
      {/* Week header */}
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="grid grid-cols-8 gap-px bg-neutral-200">
          <div className="bg-neutral-50 p-2"></div>
          {weekDays.map((day, idx) => (
            <div key={day.toDateString()} className="bg-neutral-50 p-2 text-center">
              <div className="text-xs font-medium text-neutral-600">{DAY_NAMES[idx]}</div>
              <div className="text-lg font-semibold text-neutral-900">{day.getDate()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time grid */}
      <div className="relative">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-neutral-200" style={{ height: '4rem' }}>
            {/* Time label */}
            <div className="p-2 text-xs text-neutral-600 text-right pr-3">
              {formatTime(hour)}
            </div>
            
            {/* Day columns */}
            {weekDays.map((day) => {
              const key = `${day.toDateString()}-${hour}`;
              const eventsInSlot = eventsByDayAndHour.get(key) || [];
              
              return (
                <div
                  key={key}
                  className="border-l border-neutral-200 relative hover:bg-neutral-50 cursor-pointer"
                >
                  {eventsInSlot.map((evt) => (
                    <div
                      key={evt.id}
                      className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-xs font-medium text-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      style={getEventStyle(evt)}
                      onClick={() => onEventClick?.(evt)}
                      title={`${evt.title} (${evt.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${evt.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                    >
                      <div className="font-semibold truncate">{evt.title}</div>
                      <div className="text-xs opacity-90 truncate">
                        {evt.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
