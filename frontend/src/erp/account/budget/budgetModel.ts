export type AccountBudgetRow = {
  budgetYear?: string | number;
  category?: string;
  plannedAmount?: string | number;
  status?: string;
  description?: string;
  [key: string]: unknown;
};

type AccountBudgetColumn = {
  key: keyof AccountBudgetRow;
  label: string;
};

export const ACCOUNT_BUDGET_COLUMNS: AccountBudgetColumn[] = [
  { key: 'budgetYear', label: '년도' },
  { key: 'category', label: '항목' },
  { key: 'plannedAmount', label: '예산' },
  { key: 'status', label: '상태' },
  { key: 'description', label: '비고' },
];
