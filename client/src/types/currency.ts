export type Currency = {
  code: string;
  name: string;
};

export type RateResult = {
  from: string;
  to: string;
  rate: number;
  date: string;
};

export type HistoryPoint = {
  date: string;
  rate: number;
};
