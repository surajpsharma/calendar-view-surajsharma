import { Suspense, useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import type { CalendarEvent } from './CalendarView.types';

const meta: Meta<typeof CalendarView> = {
  title: 'Calendar/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

const sampleEvents: CalendarEvent[] = [
  { id: 'evt-1', title: 'Team Standup', description: 'Daily sync with the team', startDate: new Date(2024, 0, 15, 9, 0), endDate: new Date(2024, 0, 15, 9, 30), color: '#3b82f6', category: 'Meeting' },
  { id: 'evt-2', title: 'Design Review', description: 'Review new component designs', startDate: new Date(2024, 0, 15, 14, 0), endDate: new Date(2024, 0, 15, 15, 30), color: '#10b981', category: 'Design' },
  { id: 'evt-3', title: 'Client Presentation', startDate: new Date(2024, 0, 16, 10, 0), endDate: new Date(2024, 0, 16, 11, 30), color: '#f59e0b', category: 'Meeting' },
  { id: 'evt-4', title: 'Development Sprint', description: 'Sprint planning and task assignment', startDate: new Date(2024, 0, 17, 9, 0), endDate: new Date(2024, 0, 17, 17, 0), color: '#8b5cf6', category: 'Work' },
];

// Generate large dataset (20+ events)
const generateLargeDataset = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];
  const categories = ['Meeting', 'Work', 'Personal', 'Design', 'Development'];
  const titles = [
    'Team Standup', 'Client Meeting', 'Design Review', 'Code Review', 'Sprint Planning',
    'Brainstorming', '1:1 Meeting', 'Presentation', 'Workshop', 'Training',
    'Lunch Break', 'Coffee Chat', 'Project Kickoff', 'Status Update', 'Demo',
  ];

  for (let day = 1; day <= 31; day++) {
    const eventsPerDay = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < eventsPerDay; i++) {
      const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
      const duration = Math.floor(Math.random() * 3) + 1; // 1-3 hours
      events.push({
        id: `evt-${day}-${i}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `Event on day ${day}`,
        startDate: new Date(2024, 0, day, hour, 0),
        endDate: new Date(2024, 0, day, hour + duration, 0),
        color: colors[Math.floor(Math.random() * colors.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
      });
    }
  }
  return events;
};

type Story = StoryObj<typeof CalendarView>;

interface StoryWrapperProps {
  initialView?: 'month' | 'week';
  initialDate?: Date;
  initialEvents?: CalendarEvent[];
}

function StoryWrapper({ initialView = 'month', initialDate = new Date(2024, 0, 15), initialEvents = sampleEvents }: StoryWrapperProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleAdd = useCallback((ev: CalendarEvent) => setEvents((e) => [...e, ev]), []);
  const handleUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => setEvents((e) => e.map(ev => ev.id === id ? { ...ev, ...updates } : ev)), []);
  const handleDelete = useCallback((id: string) => setEvents((e) => e.filter(ev => ev.id !== id)), []);

  return (
    <Suspense>
      <div className="p-4 min-h-screen bg-neutral-50">
        <CalendarView
          events={events}
          onEventAdd={handleAdd}
          onEventUpdate={handleUpdate}
          onEventDelete={handleDelete}
          initialView={initialView}
          initialDate={initialDate}
        />
      </div>
    </Suspense>
  );
}

export const Default: Story = {
  name: 'Default - Current Month with Sample Events',
  render: () => <StoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'The default calendar view showing the current month with a few sample events.',
      },
    },
  },
};

export const EmptyState: Story = {
  name: 'Empty - Calendar with No Events',
  render: () => <StoryWrapper initialEvents={[]} />,
  parameters: {
    docs: {
      description: {
        story: 'Calendar view with no events, demonstrating the empty state.',
      },
    },
  },
};

export const WeekView: Story = {
  name: 'Week View - Week View with Time Slots',
  render: () => <StoryWrapper initialView="week" />,
  parameters: {
    docs: {
      description: {
        story: 'Week view showing a 7-day horizontal layout with hourly time slots and event positioning.',
      },
    },
  },
};

export const LargeDataset: Story = {
  name: 'With Many Events - Month with 20+ Events',
  render: () => <StoryWrapper initialEvents={generateLargeDataset()} />,
  parameters: {
    docs: {
      description: {
        story: 'Calendar with a large dataset of 20+ events across the month, testing performance and layout.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  name: 'Interactive Demo - Fully Functional Event Management',
  render: () => <StoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive calendar. Click on any date to create a new event, or click on an existing event to edit or delete it.',
      },
    },
  },
};

export const MobileView: Story = {
  name: 'Mobile View - Responsive Layout',
  render: () => <StoryWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Calendar optimized for mobile devices with responsive layout adjustments.',
      },
    },
  },
};

export const Accessibility: Story = {
  name: 'Accessibility - Keyboard Navigation Demo',
  render: () => <StoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation. Use Tab to move between elements, Enter/Space to activate, Arrow keys to navigate the grid, and Escape to close modals.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
  },
};
