import { describe, expect, it } from "vitest";
import { countdownTo, getEventPhase, getRegistrationPhase, getLiveSchedule } from "./time";
import { calculateFee } from "./fee";
import { schedule } from "../data/event";

describe("event timing", () => {
  it("never returns negative countdown values", () => {
    expect(countdownTo("2026-09-19T08:40:00+08:00", Date.parse("2026-09-20T00:00:00+08:00"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    });
  });

  it("distinguishes before, during, and after phases", () => {
    const start = "2026-09-19T08:40:00+08:00";
    const end = "2026-09-19T20:00:00+08:00";
    expect(getEventPhase(start, end, Date.parse("2026-09-19T08:39:59+08:00"))).toBe("before");
    expect(getEventPhase(start, end, Date.parse("2026-09-19T10:00:00+08:00"))).toBe("during");
    expect(getEventPhase(start, end, Date.parse(end))).toBe("after");
  });

  it("marks the 72-hour registration window and closure", () => {
    const deadline = "2026-09-05T23:59:59+08:00";
    expect(getRegistrationPhase(deadline, Date.parse("2026-09-02T23:00:00+08:00"))).toBe("open");
    expect(getRegistrationPhase(deadline, Date.parse("2026-09-03T00:00:00+08:00"))).toBe("urgent");
    expect(getRegistrationPhase(deadline, Date.parse("2026-09-06T00:00:00+08:00"))).toBe("closed");
  });

  it("does not show live schedule on another Taipei date", () => {
    expect(getLiveSchedule("2026-09-19", schedule, new Date("2026-09-18T10:00:00+08:00"))).toEqual({ currentId: null, nextId: null });
  });
});

describe("fee calculation", () => {
  it("applies the member subsidy and free dinner", () => {
    expect(calculateFee({ member: true, transport: "self", training: true, dinner: true })).toBe(500);
    expect(calculateFee({ member: true, transport: "shuttle", training: true, dinner: true })).toBe(600);
    expect(calculateFee({ member: true, transport: "self", training: false, dinner: true })).toBe(0);
  });

  it("adds non-member activities and the shuttle fee", () => {
    expect(calculateFee({ member: false, transport: "self", training: true, dinner: true })).toBe(2000);
    expect(calculateFee({ member: false, transport: "shuttle", training: true, dinner: true })).toBe(2100);
  });
});
