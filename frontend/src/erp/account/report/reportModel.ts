export type AccountReportItem = {
  category?: string;
  transType?: string;
  amount?: number | string;
  transDate?: string;
  [key: string]: unknown;
};

export type AccountReportData = {
  income: number;
  expense: number;
  balance: number;
  items: AccountReportItem[];
};

export const CURRENT_YEAR = String(new Date().getFullYear());
export const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, '0');

export const EMPTY_ACCOUNT_REPORT_DATA: AccountReportData = {
  income: 0,
  expense: 0,
  balance: 0,
  items: [],
};
