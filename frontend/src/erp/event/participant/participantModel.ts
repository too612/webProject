export type EventParticipantRow = {
  eventTitle?: string;
  memberName?: string;
  applyDate?: string;
  status?: string;
  [key: string]: unknown;
};

type EventParticipantColumn = {
  key: keyof EventParticipantRow;
  label: string;
};

export const EVENT_PARTICIPANT_COLUMNS: EventParticipantColumn[] = [
  { key: 'eventTitle', label: '행사명' },
  { key: 'memberName', label: '참가자' },
  { key: 'applyDate', label: '신청일' },
  { key: 'status', label: '상태' },
];