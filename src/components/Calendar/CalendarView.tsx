import React, { useMemo, useState, useCallback } from 'react';
import type { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { useCalendar } from '../../hooks/useCalendar';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const { currentDate, view, setView, goToNextMonth, goToPreviousMonth, goToToday } = useCalendar(initialDate, initialView);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedDate(undefined);
    setSelectedEvent(undefined);
  }, []);

  const handleSave = useCallback((eventData: CalendarEvent | Omit<CalendarEvent, 'id'>) => {
    if ('id' in eventData && selectedEvent) {
      onEventUpdate(eventData.id, eventData);
    } else {
      onEventAdd(eventData as CalendarEvent);
    }
  }, [selectedEvent, onEventAdd, onEventUpdate]);

  const viewNode = useMemo(() => {
    if (view === 'week') {
      return (
        <WeekView
          date={currentDate}
          events={events}
          onSelectDate={handleDateClick}
          onEventClick={handleEventClick}
          onEventUpdate={onEventUpdate}
        />
      );
    }
    return (
      <MonthView
        date={currentDate}
        events={events}
        onSelectDate={handleDateClick}
        onEventClick={handleEventClick}
      />
    );
  }, [view, currentDate, events, handleDateClick, handleEventClick, onEventUpdate]);

  return (
    <div className="w-full">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border" onClick={goToPreviousMonth} aria-label="Previous">Prev</button>
          <button className="px-3 py-1 rounded border" onClick={goToToday}>Today</button>
          <button className="px-3 py-1 rounded border" onClick={goToNextMonth} aria-label="Next">Next</button>
        </div>
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1 rounded border ${view==='month' ? 'bg-primary-500 text-white' : ''}`} onClick={() => setView('month')}>Month</button>
          <button className={`px-3 py-1 rounded border ${view==='week' ? 'bg-primary-500 text-white' : ''}`} onClick={() => setView('week')}>Week</button>
        </div>
      </header>
      {viewNode}
      
      <EventModal
        open={modalOpen}
        onClose={handleModalClose}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={handleSave}
        onDelete={onEventDelete}
      />
    </div>
  );
};
