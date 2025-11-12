import React, { useCallback, useMemo } from 'react';
import type { CalendarEvent } from './CalendarView.types';

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  muted?: boolean;
  onClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({ date, events, isToday, isSelected, muted, onClick, onEventClick }) => {
  const handleClick = useCallback(() => onClick(date), [date, onClick]);
  const firstThree = useMemo(() => events.slice(0, 3), [events]);

  const label = `${date.toDateString()}. ${events.length} events.`;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(date);
    }
  }, [date, onClick]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`border h-32 p-2 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 focus-visible:outline-offset-2 ${muted ? 'bg-neutral-50 text-neutral-500' : 'bg-white'} hover:bg-neutral-50`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${isToday ? 'text-primary-700' : 'text-neutral-900'}`}>{date.getDate()}</span>
        {isToday && (
          <span className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">
            {date.getDate()}
          </span>
        )}
      </div>
      <div className="space-y-1 overflow-hidden">
        {firstThree.map((evt) => (
          <div
            key={evt.id}
            className="text-xs px-2 py-1 rounded truncate"
            style={{ backgroundColor: evt.color ?? '#e4e4e7' }}
            onClick={(e) => { e.stopPropagation(); onEventClick?.(evt); }}
          >
            {evt.title}
          </div>
        ))}
        {events.length > 3 && (
          <button className="text-xs text-primary-600 hover:underline">+{events.length - 3} more</button>
        )}
      </div>
    </div>
  );
});
