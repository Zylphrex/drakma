export type Activity = {
  account: number;
  activty_number: number;
  date: string;
  description: string;
  withdrawl: number;
  deposit: number;
  balance: number;
};

export type ActivityStat = {
  period: number;
  period_date: string;
  period_deposit: number;
  period_withdrawl: number;
  period_balance: number;
};
