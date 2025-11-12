import React, { useMemo } from 'react';
import type { CalendarEvent } from './CalendarView.types';
import { getCalendarGrid, isSameMonth, isToday as isTodayFn } from '../../utils/date.utils';
import { CalendarCell } from './CalendarCell';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onSelectDate: (d: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({ date, events, onSelectDate, onEventClick }) => {
  const days = useMemo(() => getCalendarGrid(date), [date]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of events) {
      const key = new Date(evt.startDate.getFullYear(), evt.startDate.getMonth(), evt.startDate.getDate()).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(evt);
    }
    return map;
  }, [events]);

  const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div role="grid" aria-label={`Calendar for ${monthName}`}>
      {/* Month/Year header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">{monthName}</h2>
      </div>
      
      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-px bg-neutral-200 mb-px">
        {DAY_NAMES.map((dayName) => (
          <div key={dayName} className="bg-neutral-50 py-2 text-center text-sm font-medium text-neutral-700">
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-neutral-200">
        {days.map((d: Date) => {
          const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
          const list = eventsByDay.get(key) ?? [];
          const isToday = isTodayFn(d);
          const inMonth = isSameMonth(d, date);
          return (
            <CalendarCell
              key={key}
              date={d}
              events={list}
              isToday={isToday}
              isSelected={false}
              muted={!inMonth}
              onClick={onSelectDate}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};
