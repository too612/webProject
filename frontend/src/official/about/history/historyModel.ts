export type HistoryEventItem = {
  date: string;
  description: string;
  images?: string[];
  imageIds?: (string | number)[];
};

export type HistoryTimelineItem = {
  year: string;
  events: HistoryEventItem[];
};

export type HistoryContent = {
  timeline: HistoryTimelineItem[];
};

export type HistoryEventRequest = {
  eventId?: number | null;
  date: string;
  description: string;
  images?: string[];
};

export type HistoryYearRequest = {
  historyId?: number | null;
  year: string;
  events: HistoryEventRequest[];
};

export type HistoryRequest = {
  timeline: HistoryYearRequest[];
  deletedFileIds?: (string | number)[];
};

export const EMPTY_HISTORY_REQUEST: HistoryRequest = {
  timeline: [],
  deletedFileIds: [],
};

export type HistoryRange = {
  key: string;
  label: string;
  matchYear: (year: number) => boolean;
};

export const toYearNumber = (value: string): number | null => {
  const yearText = value.replace(/\D/g, "").slice(0, 4);
  const year = Number(yearText);
  return Number.isFinite(year) && year > 0 ? year : null;
};

export function getHistoryRangeTabs(
  timeline: HistoryTimelineItem[],
  currentYear = new Date().getFullYear(),
): HistoryRange[] {
  const dataYears = timeline
    .map((item) => toYearNumber(item.year))
    .filter((year): year is number => year !== null);
  const latestYear = Math.max(currentYear, ...dataYears, 2020);
  const latestDecade = Math.floor(latestYear / 10) * 10;
  const decadeTabs: HistoryRange[] = [];

  for (let startYear = 1990; startYear <= latestDecade; startYear += 10) {
    const endYear = startYear + 9;
    const isCurrentDecade =
      startYear >= 2020 && currentYear >= startYear && currentYear <= endYear;
    decadeTabs.push({
      key: `${startYear}-${endYear}`,
      label: isCurrentDecade ? `${startYear}~현재` : `${startYear}~${endYear}`,
      matchYear: (year) => year >= startYear && year <= endYear,
    });
  }

  return [
    { key: "all", label: "전체", matchYear: () => true },
    ...decadeTabs.reverse(),
    {
      key: "1987-1989",
      label: "1987~1989",
      matchYear: (year) => year >= 1987 && year <= 1989,
    },
  ];
}
