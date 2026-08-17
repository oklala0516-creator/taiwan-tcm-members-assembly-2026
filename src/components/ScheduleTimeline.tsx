import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpenCheck, BusFront, CarFront, ChevronDown, ClipboardCheck, Clock3, Factory, Gift, Gavel, MapPin, PartyPopper, TrainFront, UsersRound, UtensilsCrossed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { event, schedule } from "../data/event";
import { getLiveSchedule } from "../lib/time";

const scheduleEffects = {
  arrival: { Icon: BusFront, label: "接駁車出發", motion: { x: [-18, 0, 8, 0], rotate: [0, -3, 2, 0] } },
  checkin: { Icon: Gift, label: "領取伴手禮", motion: { rotate: [0, -10, 10, -5, 0], y: [0, -8, 0], scale: [1, 1.16, 1] } },
  training: { Icon: BookOpenCheck, label: "教育訓練", motion: { rotateY: [-38, 0, 18, 0], scale: [0.9, 1.12, 1] } },
  lunch: { Icon: UtensilsCrossed, label: "午餐時間", motion: { rotate: [0, -11, 11, 0], y: [0, -7, 0] } },
  visit: { Icon: Factory, label: "製藥廠區參訪", motion: { scale: [0.82, 1.14, 1], rotate: [0, 5, -4, 0] } },
  transfer: { Icon: CarFront, label: "前往阿沐餐廳", motion: { x: [-20, 10, 0], rotate: [0, -4, 3, 0] } },
  "meeting-checkin": { Icon: ClipboardCheck, label: "會員大會報到", motion: { scale: [0.78, 1.16, 1], rotate: [-5, 5, 0] } },
  board: { Icon: Gavel, label: "理監事會議", motion: { rotate: [-20, 13, -9, 0], y: [0, -5, 0] } },
  assembly: { Icon: UsersRound, label: "會員大會", motion: { scale: [0.72, 1.2, 1], y: [8, -4, 0] } },
  dinner: { Icon: PartyPopper, label: "餐敘聯誼", motion: { rotate: [-12, 12, -5, 0], scale: [0.82, 1.18, 1] } },
  return: { Icon: TrainFront, label: "返回桃園高鐵站", motion: { x: [20, 0, -8, 0], rotate: [0, 3, -2, 0] } },
};

function ScheduleEffect({ itemId, reducedMotion }: { itemId: string; reducedMotion: boolean | null }) {
  const effect = scheduleEffects[itemId as keyof typeof scheduleEffects];
  if (!effect) return null;
  const Icon = effect.Icon;

  return (
    <motion.div
      className={`schedule-effect schedule-effect-${itemId}`}
      role="img"
      aria-label={effect.label}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.55, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 17, delay: reducedMotion ? 0 : 0.06 }}
    >
      <motion.span
        className="schedule-effect-icon"
        aria-hidden="true"
        animate={reducedMotion ? {} : effect.motion}
        transition={{ duration: 0.86, delay: 0.12 }}
      ><Icon size={42} strokeWidth={2.35} /></motion.span>
    </motion.div>
  );
}
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
                  <ScheduleEffect itemId={item.id} reducedMotion={reducedMotion} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
