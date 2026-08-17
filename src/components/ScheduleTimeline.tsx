import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Clock3, Gift, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { event, schedule } from "../data/event";
import { getLiveSchedule } from "../lib/time";

export function ScheduleTimeline() {
  const [openId, setOpenId] = useState<string>("arrival");
  const [now, setNow] = useState(() => new Date());
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setNow(new Date());
    const intervalId = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const live = useMemo(() => getLiveSchedule(event.date, schedule, now), [now]);

  return (
    <div className="timeline" role="list">
      {schedule.map((item, index) => {
        const isOpen = openId === item.id;
        const liveLabel = item.id === live.currentId ? "現在進行中" : item.id === live.nextId ? "下一個行程" : null;
        return (
          <motion.article
            className={`timeline-item${liveLabel ? " is-live" : ""}`}
            key={item.id}
            role="listitem"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.45, delay: reducedMotion ? 0 : Math.min(index * 0.04, 0.2) }}
          >
            <div className="timeline-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <button
              className="timeline-toggle"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`schedule-${item.id}`}
              onClick={() => setOpenId(isOpen ? "" : item.id)}
            >
              <span className="timeline-time"><Clock3 size={16} aria-hidden="true" />{item.start}～{item.end}</span>
              <span className="timeline-title-row">
                <strong>{item.title}</strong>
                <ChevronDown className={isOpen ? "rotate" : ""} size={20} aria-hidden="true" />
              </span>
              <span className="timeline-meta">
                {item.important && <span className="tag">重要時間</span>}
                {liveLabel && <span className="live-label">{liveLabel}</span>}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="timeline-detail"
                  id={`schedule-${item.id}`}
                  initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p><MapPin size={16} aria-hidden="true" />{item.place}</p>
                  <p>{item.detail}</p>
                  {item.id === "checkin" && (
                    <motion.div
                      className="gift-reveal"
                      role="img"
                      aria-label="伴手禮"
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.55, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 360, damping: 17, delay: reducedMotion ? 0 : 0.06 }}
                    >
                      <motion.span
                        className="gift-icon"
                        aria-hidden="true"
                        animate={reducedMotion ? {} : { rotate: [0, -10, 10, -5, 0], y: [0, -8, 0], scale: [1, 1.16, 1] }}
                        transition={{ duration: 0.82, delay: 0.12 }}
                      ><Gift size={42} strokeWidth={2.4} /></motion.span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
