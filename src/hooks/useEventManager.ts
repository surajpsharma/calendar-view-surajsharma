import { useCallback, useMemo, useState } from 'react';
import type { CalendarEvent } from '../components/Calendar/CalendarView.types';

export const useEventManager = (initial: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initial);

  const add = useCallback((ev: CalendarEvent) => setEvents((e) => [...e, ev]), []);
  const update = useCallback((id: string, updates: Partial<CalendarEvent>) => setEvents((e) => e.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev))), []);
  const remove = useCallback((id: string) => setEvents((e) => e.filter((ev) => ev.id !== id)), []);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of events) {
      const key = new Date(evt.startDate.getFullYear(), evt.startDate.getMonth(), evt.startDate.getDate()).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(evt);
    }
    return map;
  }, [events]);

  return { events, add, update, remove, byDay };
};
