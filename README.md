# Calendar View Component

> A production-grade, fully interactive calendar component built with React, TypeScript, and Tailwind CSS.

## 🚀 Live Storybook

[Your Deployed Storybook URL] _(Deploy to Vercel/Netlify/Chromatic)_

## 📦 Installation

```bash
npm install
npm run storybook
```

## 🏗️ Architecture

This project follows a component-driven architecture with strict TypeScript types and utility-first Tailwind CSS styling.

### Project Structure

```
src/
├── components/
│   ├── Calendar/
│   │   ├── CalendarView.tsx         # Main component
│   │   ├── CalendarView.types.ts    # TypeScript definitions
│   │   ├── CalendarView.stories.tsx # Storybook stories
│   │   ├── MonthView.tsx            # Month grid view
│   │   ├── WeekView.tsx             # Week timeline view
│   │   ├── CalendarCell.tsx         # Individual day cell
│   │   └── EventModal.tsx           # Event create/edit modal
│   └── primitives/
│       ├── Button.tsx               # Reusable button
│       ├── Modal.tsx                # Base modal wrapper
│       └── Select.tsx               # Styled select input
├── hooks/
│   ├── useCalendar.ts               # Calendar state management
│   └── useEventManager.ts           # Event CRUD operations
└── utils/
    ├── date.utils.ts                # Date manipulation helpers
    └── event.utils.ts               # Event helper functions
```

## ✨ Features

### Core Features

- [x] **Month View** - 42-cell grid (6 weeks × 7 days) with complete weeks
- [x] **Week View** - 7-day horizontal layout with hourly time slots
- [x] **Event Management** - Create, edit, and delete events with full modal form
- [x] **Navigation** - Previous/Next month, Today button, Month/Week toggle
- [x] **Event Display** - Colored event badges with count indicators (>3 events)
- [x] **Interactive** - Click dates to create events, click events to edit
- [x] **Responsive Design** - Mobile, tablet, and desktop layouts
- [x] **Accessibility** - WCAG 2.1 AA compliant with keyboard navigation
- [x] **Performance** - React.memo, useMemo, useCallback optimizations

### Event Modal Features

- Title input (required, max 100 chars)
- Description textarea (optional, max 500 chars)
- Start date/time picker
- End date/time picker (validates after start time)
- Color picker (6 preset colors)
- Category dropdown (5 categories)
- Delete button (for existing events)
- Form validation with error messages

### Accessibility Features

- Keyboard navigation (Tab, Arrow keys, Enter, Escape)
- ARIA labels and roles
- Focus management
- Screen reader support
- Semantic HTML

## 📖 Storybook Stories

All required stories are implemented:

1. **Default** - Current month with sample events
2. **Empty State** - Calendar with no events
3. **Week View** - Week view with time slots
4. **Large Dataset** - Month with 20+ events (performance test)
5. **Interactive Demo** - Fully functional event management
6. **Mobile View** - Responsive layout demonstration
7. **Accessibility** - Keyboard navigation demonstration

## 🛠️ Technologies

- **React** (^19.2.0) - Component framework
- **TypeScript** (^5.9.3) - Type-safe development
- **Tailwind CSS** (^3.4.18) - Utility-first styling
- **Vite** - Build tooling
- **Storybook** (^10.0.6) - Component documentation
- **date-fns** (^4.1.0) - Date manipulation
- **clsx** (^2.1.1) - Conditional class management

## 🎨 Design System

### Color Palette

- **Primary**: Sky blue (#0ea5e9)
- **Neutral**: Zinc grays
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- Font: Inter (sans-serif)
- Base unit: 4px spacing scale

## 📜 Scripts

```bash
npm run dev              # Start Vite dev server
npm run storybook        # Start Storybook at port 6006
npm run build            # TypeScript + Vite production build
npm run build-storybook  # Build static Storybook
npm run typecheck        # Run TypeScript type checking
npm run lint             # Run ESLint
```

## 🎯 Usage Example

```tsx
import { CalendarView } from "./components/Calendar/CalendarView";
import type { CalendarEvent } from "./components/Calendar/CalendarView.types";

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const handleAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <CalendarView
      events={events}
      onEventAdd={handleAdd}
      onEventUpdate={handleUpdate}
      onEventDelete={handleDelete}
      initialView="month"
      initialDate={new Date()}
    />
  );
}
```

## ⌨️ Keyboard Navigation

- **Tab** - Move focus between interactive elements
- **Shift + Tab** - Move focus backwards
- **Enter / Space** - Activate focused element
- **Escape** - Close modal or cancel action
- **Arrow Keys** - Navigate calendar grid
- **Home / End** - Jump to first/last item

## 🎭 TypeScript

Strict mode enabled with:

- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

No `any` types used throughout the codebase.

## 📸 Preview
1
Default Currunt month in sample units
<img width="1920" height="1020" alt="Screenshot 2025-11-12 190435" src="https://github.com/user-attachments/assets/12ca1f21-1e81-4ee2-8b11-27623829c412" />

2 add event, delete event ,update event
<img width="1920" height="1020" alt="Screenshot 2025-11-12 191534" src="https://github.com/user-attachments/assets/9c3d2db1-763f-4266-aa60-d3dea62d321c" />

3 calendar with no event
<img width="1920" height="1020" alt="Screenshot 2025-11-12 191601" src="https://github.com/user-attachments/assets/7c5829e8-1609-42cf-ba55-6c182b6c3851" />

4 week view with time slot
<img width="1920" height="1020" alt="Screenshot 2025-11-12 191615" src="https://github.com/user-attachments/assets/38791de3-d13a-4e56-9667-12851e9e2be2" />

5 with many event

<img width="1920" height="1020" alt="Screenshot 2025-11-12 191717" src="https://github.com/user-attachments/assets/49921eef-e775-4981-98b5-8bd5b4e9302b" />

6
keyword nagivation demo

<img width="1920" height="1020" alt="Screenshot 2025-11-12 191913" src="https://github.com/user-attachments/assets/9bfdba3d-4d26-4399-807b-1f6b47e32ae4" />

## 📝 Notes

- **No external calendar libraries** - Built from scratch as per requirements
- **No UI component libraries** - All components custom-built
- **Performance optimized** - Handles 500+ events without lag
- **Tailwind configured** - Custom design tokens and animations
- **Production-ready** - Comprehensive error handling and validation

## 🚀 Deployment

To deploy Storybook:

```bash
npm run build-storybook
# Deploy the storybook-static folder to:
# - Vercel
# - Netlify
# - Chromatic
# - GitHub Pages
```

## 📄 License

This project was created as a hiring assignment for the Design System Component Library.

## 👤 Contact
surajsharma030805@gmail.com
surajpsharma

