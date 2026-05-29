export type EventCalendarItem = {
	title?: string;
	eventDate?: string;
	location?: string;
	manager?: string;
	[key: string]: unknown;
};

export const EVENT_CALENDAR_CURRENT_YEAR = String(new Date().getFullYear());
export const EVENT_CALENDAR_CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, '0');

export const EVENT_CALENDAR_YEAR_OFFSETS = [0, 1, 2] as const;