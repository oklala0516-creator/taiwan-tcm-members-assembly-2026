import type { ScheduleItem } from "../data/event";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export type EventPhase = "before" | "during" | "after";
export type RegistrationPhase = "open" | "urgent" | "closed";

export const countdownTo = (targetIso: string, nowMs = Date.now()): CountdownParts => {
  const totalMs = Math.max(0, Date.parse(targetIso) - nowMs);
  return {
    days: Math.floor(totalMs / 86_400_000),
    hours: Math.floor((totalMs / 3_600_000) % 24),
    minutes: Math.floor((totalMs / 60_000) % 60),
    seconds: Math.floor((totalMs / 1_000) % 60),
    totalMs,
  };
};

export const getEventPhase = (startIso: string, endIso: string, nowMs = Date.now()): EventPhase => {
  if (nowMs < Date.parse(startIso)) return "before";
  if (nowMs < Date.parse(endIso)) return "during";
  return "after";
};

export const getRegistrationPhase = (deadlineIso: string, nowMs = Date.now()): RegistrationPhase => {
  const remaining = Date.parse(deadlineIso) - nowMs;
  if (remaining <= 0) return "closed";
  if (remaining <= 72 * 3_600_000) return "urgent";
  return "open";
};

const taipeiDateParts = (now: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

export const getLiveSchedule = (date: string, items: ScheduleItem[], now = new Date()) => {
  const taipei = taipeiDateParts(now);
  if (taipei.date !== date) return { currentId: null, nextId: null };
  let currentId: string | null = null;
  let nextId: string | null = null;
  for (const item of items) {
    const [startHour, startMinute] = item.start.split(":").map(Number);
    const [endHour, endMinute] = item.end.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    if (taipei.minutes >= start && taipei.minutes < end) currentId = item.id;
    if (taipei.minutes < start && nextId === null) nextId = item.id;
  }
  return { currentId, nextId };
};
