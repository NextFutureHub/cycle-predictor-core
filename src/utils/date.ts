import { ISODate } from "../types";

export const toDate = (d: ISODate): Date => new Date(d + "T00:00:00");

export const toISO = (d: Date): ISODate => {
  // Используем UTC компоненты, но сохраняем YYYY-MM-DD в локальном понимании.
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (d: ISODate, days: number): ISODate => {
  const base = toDate(d);
  base.setDate(base.getDate() + days);
  return toISO(base);
};

export const diffDays = (a: ISODate, b: ISODate): number => {
  const da = toDate(a);
  const db = toDate(b);
  const ms = db.getTime() - da.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

export const sortAsc = (dates: ISODate[]): ISODate[] =>
  [...dates].sort((a, b) => toDate(a).getTime() - toDate(b).getTime());
