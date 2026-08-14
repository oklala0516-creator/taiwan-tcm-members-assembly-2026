import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Sprout } from "lucide-react";
import { event } from "../data/event";
import { countdownTo, getEventPhase, getRegistrationPhase } from "../lib/time";

const units = [
  ["days", "天"],
  ["hours", "時"],
  ["minutes", "分"],
  ["seconds", "秒"],
] as const;

const twoDigits = (value: number) => String(value).padStart(2, "0");

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    const intervalId = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const eventPhase = getEventPhase(event.start, event.end, now);
  const registrationPhase = getRegistrationPhase(event.registrationDeadline, now);
  const eventTime = useMemo(() => countdownTo(event.start, now), [now]);
  const registrationTime = useMemo(() => countdownTo(event.registrationDeadline, now), [now]);

  return (
    <section className="countdown-wrap" aria-label="活動與報名倒數">
      <div className="countdown-card">
        {eventPhase === "before" && (
          <>
            <p className="eyebrow"><CalendarDays size={16} aria-hidden="true" /> 距離活動集合還有</p>
            <div className="countdown-grid" aria-hidden="true">
              {units.map(([key, label]) => (
                <div className={`countdown-unit${key === "seconds" ? " is-seconds" : ""}`} key={key}>
                  <strong>{key === "days" ? eventTime[key] : twoDigits(eventTime[key])}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <span className="sr-only" aria-live="polite">
              距離活動集合尚有 {eventTime.days} 天 {eventTime.hours} 時 {eventTime.minutes} 分
            </span>
          </>
        )}

        {eventPhase === "during" && (
          <div className="event-state">
            <p className="event-state-title"><span className="live-dot" />活動進行中</p>
            <p>歡迎來到一株藥材的品質旅程，請留意現場工作人員引導。</p>
            <div className="button-row">
              <a className="button button-primary" href="#schedule">查看目前行程</a>
              <a className="button button-secondary" href={event.locations.koda.mapUrl} target="_blank" rel="noreferrer">
                <MapPin size={18} aria-hidden="true" />開啟集合地點導航<span className="sr-only">（另開新視窗）</span>
              </a>
            </div>
          </div>
        )}

        {eventPhase === "after" && (
          <div className="event-state">
            <p className="event-state-title"><Sprout size={22} aria-hidden="true" />本次活動已圓滿結束</p>
            <p>感謝每一位參與教育訓練、參訪及會員大會的夥伴。</p>
          </div>
        )}
      </div>

      <div className={`registration-strip ${registrationPhase === "urgent" ? "is-urgent" : ""}`} aria-live="polite">
        <span className="registration-kicker">報名截止日</span>
        <strong>{registrationPhase === "closed" ? "線上報名已截止" : "9 月 5 日 23:59"}</strong>
        {registrationPhase === "closed" ? (
          <span>線上報名期限已截止，如需參加請聯絡主辦單位確認。</span>
        ) : (
          <span>
            請於截止前完成報名與繳費，剩餘 {registrationTime.days} 天 {twoDigits(registrationTime.hours)} 時 {twoDigits(registrationTime.minutes)} 分。
          </span>
        )}
      </div>
    </section>
  );
}
