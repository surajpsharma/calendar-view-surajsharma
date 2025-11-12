import React, { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent } from './CalendarView.types';
import { Button } from '../primitives/Button';
import { format } from 'date-fns';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  selectedDate?: Date;
  onSave: (data: CalendarEvent | Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const EVENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
];

const CATEGORIES = ['Meeting', 'Work', 'Personal', 'Design', 'Development'];

export const EventModal: React.FC<EventModalProps> = ({ open, onClose, event, selectedDate, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState(EVENT_COLORS[0].value);
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setStartDate(format(event.startDate, 'yyyy-MM-dd'));
        setStartTime(format(event.startDate, 'HH:mm'));
        setEndDate(format(event.endDate, 'yyyy-MM-dd'));
        setEndTime(format(event.endDate, 'HH:mm'));
        setColor(event.color || EVENT_COLORS[0].value);
        setCategory(event.category || '');
      } else {
        const date = selectedDate || new Date();
        setTitle('');
        setDescription('');
        setStartDate(format(date, 'yyyy-MM-dd'));
        setStartTime('09:00');
        setEndDate(format(date, 'yyyy-MM-dd'));
        setEndTime('10:00');
        setColor(EVENT_COLORS[0].value);
        setCategory('');
      }
      setErrors({});
    }
  }, [open, event, selectedDate]);

  const handleSave = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 100) newErrors.title = 'Title must be 100 characters or less';
    if (description.length > 500) newErrors.description = 'Description must be 500 characters or less';
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (end <= start) newErrors.endDate = 'End date/time must be after start date/time';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const eventData = {
      ...(event?.id ? { id: event.id } : { id: `evt-${Date.now()}` }),
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: start,
      endDate: end,
      color,
      category: category || undefined,
    };
    
    onSave(eventData);
    onClose();
  }, [title, description, startDate, startTime, endDate, endTime, color, category, event, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (event && onDelete && confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  }, [event, onDelete, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title" 
        aria-describedby="modal-description"
        className="bg-white rounded-xl shadow-modal w-full max-w-lg p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-1 text-neutral-900">
          {event ? 'Edit Event' : 'Create Event'}
        </h2>
        <p id="modal-description" className="text-sm text-neutral-600 mb-6">
          {event ? 'Update event details below' : 'Fill in the event details below'}
        </p>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-neutral-700 mb-1">
              Title <span className="text-error-500">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Event title"
              autoFocus
            />
            {errors.title && <p className="mt-1 text-sm text-error-500">{errors.title}</p>}
            <p className="mt-1 text-xs text-neutral-500">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="event-description" className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Event description"
            />
            {errors.description && <p className="mt-1 text-sm text-error-500">{errors.description}</p>}
            <p className="mt-1 text-xs text-neutral-500">{description.length}/500</p>
          </div>

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-neutral-700 mb-1">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-neutral-700 mb-1">
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-neutral-700 mb-1">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-neutral-700 mb-1">
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          {errors.endDate && <p className="text-sm text-error-500">{errors.endDate}</p>}

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Color</label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    color === c.value ? 'ring-2 ring-neutral-900 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={`Color ${c.name}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="event-category" className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <div>
            {event && onDelete && (
              <Button variant="ghost" onClick={handleDelete} className="text-error-600 hover:bg-error-50">
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
