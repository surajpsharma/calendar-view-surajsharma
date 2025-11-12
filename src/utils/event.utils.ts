export interface EventFormData {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

export const validateEvent = (data: EventFormData): Partial<Record<keyof EventFormData, string>> => {
  const errors: Partial<Record<keyof EventFormData, string>> = {};
  if (!data.title || data.title.trim().length === 0) errors.title = 'Title is required';
  if (data.title && data.title.length > 100) errors.title = 'Max 100 characters';
  if (data.description && data.description.length > 500) errors.description = 'Max 500 characters';
  if (!data.startDate) errors.startDate = 'Start is required';
  if (!data.endDate) errors.endDate = 'End is required';
  if (data.startDate && data.endDate && data.endDate <= data.startDate) errors.endDate = 'End must be after start';
  return errors;
};
