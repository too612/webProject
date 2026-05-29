export type AccountExpenseRow = {
  expenseDate?: string;
  category?: string;
  amount?: string | number;
  payee?: string;
  approver?: string;
  [key: string]: unknown;
};

type AccountExpenseColumn = {
  key: keyof AccountExpenseRow;
  label: string;
};

export const ACCOUNT_EXPENSE_COLUMNS: AccountExpenseColumn[] = [
  { key: 'expenseDate', label: '지출일' },
  { key: 'category', label: '구분' },
  { key: 'amount', label: '금액' },
  { key: 'payee', label: '지급처' },
  { key: 'approver', label: '결재자' },
];
