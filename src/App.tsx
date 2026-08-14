import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  BusFront,
  CameraOff,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  CupSoda,
  Download,
  ExternalLink,
  Factory,
  FileText,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Pause,
  Phone,
  Play,
  Route,
  ScrollText,
  Sprout,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { NavigationChooser } from "./components/NavigationChooser";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "./components/Countdown";
import { ScheduleTimeline } from "./components/ScheduleTimeline";
import { event } from "./data/event";
import { calculateFee } from "./lib/fee";
import { getRegistrationPhase } from "./lib/time";

const navItems = [
  ["intro", "活動介紹"],
  ["highlights", "參訪亮點"],
  ["schedule", "當日行程"],
  ["meeting", "會員大會"],
  ["transport", "交通方式"],
  ["downloads", "文件下載"],
] as const;

const journeys = [
  { number: "01", title: "源頭", subtitle: "產地・藥材・溯源", body: "從產地環境、品種與供應鏈開始理解藥材，讓每一步都有跡可循。", image: event.assets.originQuality, position: "18% center", alt: "藥材、產地標記與溯源研究筆記插畫" },
  { number: "02", title: "品質", subtitle: "辨識・檢驗・把關", body: "以專業辨識與檢驗建立標準，讓經驗與科學共同守住品質。", image: event.assets.originQuality, position: "82% center", alt: "藥用植物、檢驗器材與品質研究插畫" },
  { number: "03", title: "製程", subtitle: "設備・流程・標準化", body: "走進現代製藥現場，看藥材如何透過精密設備形成穩定製程。", image: event.assets.processLegacy, position: "18% center", alt: "現代中藥製程設備與標準化流程插畫" },
  { number: "04", title: "傳承", subtitle: "交流・知能・產業發展", body: "在學習與交流之間累積共同語言，讓專業成為中藥產業持續前進的力量。", image: event.assets.processLegacy, position: "82% center", alt: "不同世代中藥從業人員交流與傳承插畫" },
] as const;

const highlights = [
  { icon: Microscope, title: "中藥材質量管理", body: "從辨識、規格到檢驗，理解品質判斷背後的專業基礎。", accent: "quality" },
  { icon: Route, title: "源頭管理與品質把關", body: "循著藥材從產地進場的路徑，建立可追溯的品質觀念。", accent: "origin" },
  { icon: Factory, title: "科達製藥廠區實地參訪", body: "走入現代製藥現場，觀察設備、流程與標準化製程。", accent: "process" },
  { icon: Users, title: "會員交流與產業傳承", body: "串聯不同世代的經驗，深化專業知能與產業夥伴關係。", accent: "legacy" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.3, 0.6] },
    );
    navItems.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="台灣中藥權益促進會活動首頁">
          <span className="brand-mark"><img src={event.assets.mark} width="52" height="52" alt="" /></span>
          <span className="brand-name">台灣中藥權益促進會</span>
        </a>
        <nav className="desktop-nav" aria-label="主要導覽">
          {navItems.map(([id, label]) => <a className={active === id ? "active" : ""} href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
          <span>{open ? "關閉" : "選單"}</span>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="手機導覽"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}<ChevronRight size={18} aria-hidden="true" /></a>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 34]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="hero-inner">
        <motion.div className="hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <div className="hero-brandline">
            <span className="hero-brandmark"><img src={event.assets.logo} width="1254" height="1254" alt="" /></span>
            <span><strong>{event.organizer}</strong><small>2026 INDUSTRY VISIT &amp; ANNUAL MEETING</small></span>
          </div>
          <p className="kicker"><span /> ROOT TO REMEDY・一株藥材的旅程</p>
          <h1 aria-label={event.headline}>
            <span className="title-line title-line-one">從一株藥材，</span>
            <span className="title-line title-line-two">看見品質的</span>
            <span className="title-line title-line-three"><em>每一道</em>堅持</span>
          </h1>
          <div className="hero-subtitle" aria-label="活動內容">
            <ol className="hero-program-list">
              <li><span aria-hidden="true">01</span><strong>中藥材質量管理與源頭管理教育訓練</strong></li>
              <li><span aria-hidden="true">02</span><strong>科達製藥參訪</strong></li>
              <li><span aria-hidden="true">03</span><strong>第三屆第二次會員大會</strong></li>
            </ol>
          </div>
          <div className="hero-tags" aria-label="活動摘要">
            <span>{event.dateLabel}</span><span>{event.venue}</span><span>教育訓練・製藥參訪・會員大會</span>
          </div>
          <div className="button-row hero-actions">
            <a className="button button-primary" href="#schedule">查看行程<ArrowDown size={18} aria-hidden="true" /></a>
            <a className="button button-secondary" href="#contact">聯絡主辦報名<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </motion.div>
        <motion.div className="hero-art" style={{ y: artY, opacity: artOpacity }}>
          <img src={event.assets.hero} width="1536" height="1024" alt="藥用植物由產地、品質檢驗走向現代製藥設備的旅程插畫" fetchPriority="high" />
          <div className="hero-art-caption" aria-hidden="true"><span>FROM SOURCE</span><strong>源頭 × 品質 × 製程</strong></div>
          <span className="hero-art-year" aria-hidden="true">2026</span>
          <motion.span className="floating-leaf leaf-one" animate={reducedMotion ? undefined : { y: [0, -8, 0], rotate: [-3, 2, -3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}><Leaf aria-hidden="true" /></motion.span>
          <motion.span className="floating-leaf leaf-two" animate={reducedMotion ? undefined : { y: [0, 10, 0], rotate: [3, -3, 3] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}><Sprout aria-hidden="true" /></motion.span>
        </motion.div>
      </div>
      <Countdown />
      <a className="scroll-cue" href="#intro"><span>向下閱讀</span><ArrowDown size={18} aria-hidden="true" /></a>
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function HerbJourney() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const showPrevious = () => setActive((current) => (current - 1 + journeys.length) % journeys.length);

  useEffect(() => {
    if (reducedMotion || !autoPlay || interactionPaused) return;
    const intervalId = window.setInterval(() => {
      setActive((current) => (current + 1) % journeys.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [autoPlay, interactionPaused, reducedMotion]);

  const showNext = () => setActive((current) => (current + 1) % journeys.length);
  return (
    <section className="section journey-section" aria-labelledby="journey-title">
      <div className="section-shell">
        <SectionHeading eyebrow="HERB JOURNEY" title="一株藥材的旅程" body="從自然產地走進現代製程，品質不是單一檢查，而是一段環環相扣的旅程。" />
        <div className="journey-layout">
          <div
            className="journey-visual"
            aria-live={autoPlay && !reducedMotion ? "off" : "polite"}
            onPointerEnter={() => setInteractionPaused(true)}
            onPointerLeave={() => setInteractionPaused(false)}
            onFocusCapture={() => setInteractionPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`${journeys[active].number}-${journeys[active].image}`}
                src={journeys[active].image}
                width={active < 2 ? 1400 : 1400}
                height={active < 2 ? 933 : 747}
                alt={journeys[active].alt}
                style={{ objectPosition: journeys[active].position }}
                loading="lazy"
                initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            <div className="journey-controls" aria-label="旅程圖片切換">
              <button type="button" onClick={showPrevious} aria-label="上一張"><ChevronLeft aria-hidden="true" /></button>
              <div className="journey-dots" role="group" aria-label="選擇旅程圖片">
                {journeys.map((item, index) => (
                  <button type="button" key={item.number} className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={`顯示第 ${index + 1} 張：${item.title}`} aria-pressed={active === index} />
                ))}
              </div>
              <button type="button" onClick={showNext} aria-label="下一張"><ChevronRight aria-hidden="true" /></button>
              <button type="button" onClick={() => setAutoPlay((value) => !value)} aria-label={autoPlay ? "暫停自動輪播" : "開始自動輪播"}>
                {autoPlay ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
            </div>
            <span className="journey-caption">{journeys[active].number} / 04 · {journeys[active].subtitle}</span>
          </div>
          <div className="journey-steps">
            {journeys.map((item, index) => (
              <motion.button
                className={`journey-step${active === index ? " active" : ""}`}
                type="button"
                key={item.number}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                onViewportEnter={() => setActive(index)}
                viewport={{ margin: "-35% 0px -45%" }}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="journey-number">{item.number}</span>
                <span><strong>{item.title}</strong><small>{item.subtitle}</small><span>{item.body}</span></span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TransportSelector({ onCopy }: { onCopy: (value: string, label: string) => void }) {
  const [mode, setMode] = useState<"shuttle" | "self">("shuttle");
  const details = mode === "shuttle"
    ? ["08:40 集合", "桃園高鐵站 5 號出口", "會員費用 600 元", "19:30～20:00 接駁返回桃園高鐵站"]
    : ["09:30 前於科達製藥報到", "會員費用 500 元", event.locations.koda.address, event.locations.amour.address];
  return (
    <div className="transport-card">
      <div className="segmented" role="group" aria-label="選擇交通方式">
        <button type="button" aria-pressed={mode === "shuttle"} onClick={() => setMode("shuttle")}><BusFront aria-hidden="true" />搭乘接駁車</button>
        <button type="button" aria-pressed={mode === "self"} onClick={() => setMode("self")}><MapPin aria-hidden="true" />自行前往</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={mode} className="transport-result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p className="transport-mode">{mode === "shuttle" ? "一起從高鐵站出發" : "依自己的步調前往"}</p>
          <ul>{details.map((detail) => <li key={detail}><Check size={17} aria-hidden="true" />{detail}</li>)}</ul>
          {mode === "shuttle" && <a className="text-link" href={event.locations.shuttle.mapUrl} target="_blank" rel="noreferrer">桃園高鐵站導航<ExternalLink size={15} aria-hidden="true" /><span className="sr-only">（另開新視窗）</span></a>}
        </motion.div>
      </AnimatePresence>
      <div className="location-grid">
        {[event.locations.koda, event.locations.amour].map((location) => (
          <article className="location-card" key={location.name}>
            <span className="location-icon"><MapPin aria-hidden="true" /></span>
            <div><h3>{location.name}</h3><p>{location.address}</p></div>
            <div className="mini-actions">
              <button type="button" onClick={() => onCopy(location.address, `${location.name}地址`)}><Clipboard size={15} aria-hidden="true" />複製地址</button>
              <a href={location.mapUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" />Google Maps<span className="sr-only">（另開新視窗）</span></a>
            </div>
          </article>
        ))}
      </div>
      <details className="train-note">
        <summary>高鐵班次參考</summary>
        <p>原始公文附有高鐵班次參考圖，為避免誤讀未另行轉錄。請以完整活動通知中的原圖與高鐵最新班表為準。</p>
        <a className="text-link" href={event.documents[0].path} target="_blank" rel="noreferrer">查看完整活動通知<ExternalLink size={15} aria-hidden="true" /></a>
      </details>
    </div>
  );
}

function FeeCalculator() {
  const [member, setMember] = useState(true);
  const [transport, setTransport] = useState<"self" | "shuttle">("shuttle");
  const [training, setTraining] = useState(true);
  const [dinner, setDinner] = useState(true);
  const total = calculateFee({ member, transport, training, dinner });
  return (
    <div className="fee-calculator">
      <fieldset>
        <legend>參加身分</legend>
        <div className="choice-row">
          <label><input type="radio" name="member" checked={member} onChange={() => setMember(true)} /><span>會員</span></label>
          <label><input type="radio" name="member" checked={!member} onChange={() => setMember(false)} /><span>非會員</span></label>
        </div>
      </fieldset>
      <fieldset>
        <legend>交通方式</legend>
        <div className="choice-row">
          <label><input type="radio" name="transport" checked={transport === "shuttle"} onChange={() => setTransport("shuttle")} /><span>接駁車</span></label>
          <label><input type="radio" name="transport" checked={transport === "self"} onChange={() => setTransport("self")} /><span>自行前往</span></label>
        </div>
        {!member && <p className="field-note">公文未列非會員接駁費用，請另向主辦單位確認。</p>}
      </fieldset>
      <fieldset>
        <legend>參加內容</legend>
        <div className="check-row">
          <label><input type="checkbox" checked={training} onChange={(e) => setTraining(e.target.checked)} disabled={member} /><span>教育訓練{!member && "・1,000 元"}{member && "・會員費用已含"}</span></label>
          <label><input type="checkbox" checked={dinner} onChange={(e) => setDinner(e.target.checked)} disabled={member} /><span>晚宴餐敘{!member && "・1,000 元"}{member && "・會員費用已含"}</span></label>
        </div>
      </fieldset>
      <div className="fee-result" aria-live="polite">
        <span>試算金額</span><strong>NT$ {total.toLocaleString("zh-TW")}</strong>
        <p>實際費用與參加資格以主辦單位確認為準。</p>
      </div>
      <p className="membership-note">會員可於教育訓練或會員大會報到時繳交常年會費 <strong>1,800 元</strong>。</p>
    </div>
  );
}

function App() {
  const [toast, setToast] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const registrationClosed = getRegistrationPhase(event.registrationDeadline) === "closed";

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast(`${label}已複製`);
    } catch {
      setToast(`請手動複製：${value}`);
    }
    window.setTimeout(() => setToast(""), 2200);
  };

  const reveal = reducedMotion ? {} : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-12%" }, transition: { duration: 0.55 } };

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />

        <section className="section intro-section" id="intro">
          <div className="section-shell intro-grid">
            <motion.div {...reveal}>
              <SectionHeading eyebrow="WHY WE GATHER" title="源頭把關，是中藥品質的第一步" />
              <p className="lead">每一味安心的藥材，都從源頭開始累積信任。這次活動從品質辨識與源頭管理出發，走進現代中藥製藥流程，讓從業夥伴在真實場域中理解檢驗、製程與標準化管理，並透過會員交流，深化專業知能、串連產業經驗，讓中藥的品質與傳承持續向前。</p>
            </motion.div>
            <motion.aside className="intro-note" {...reveal}>
              <span>09.19</span>
              <p>從一株藥材出發<br />讀懂每一道品質堅持</p>
              <Leaf aria-hidden="true" />
            </motion.aside>
          </div>
        </section>

        <HerbJourney />

        <section className="section highlights-section" id="highlights">
          <div className="section-shell">
            <SectionHeading eyebrow="VISIT HIGHLIGHTS" title="四個視角，看見品質全貌" body="從藥材本身、管理方法、製藥現場到產業交流，構成一日完整的學習路徑。" />
            <div className="highlight-grid">
              {highlights.map((item, index) => (
                <motion.article className={`highlight-card ${item.accent}`} key={item.title} {...reveal} transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.06 }}>
                  <span className="card-index">0{index + 1}</span><item.icon aria-hidden="true" />
                  <h3>{item.title}</h3><p>{item.body}</p>
                </motion.article>
              ))}
            </div>
            <motion.aside className="visit-rules" aria-labelledby="visit-rules-title" {...reveal}>
              <div className="visit-rules-heading">
                <p className="eyebrow">BEFORE YOU ENTER</p>
                <h3 id="visit-rules-title">進入廠區前，請先留意</h3>
              </div>
              <div className="visit-rules-grid">
                <article><span><CupSoda aria-hidden="true" /></span><div><strong>全廠區禁止飲食</strong><p>可攜帶個人隨身飲用水（不含手搖飲、咖啡等飲料）或藥品。</p></div></article>
                <article><span><CameraOff aria-hidden="true" /></span><div><strong>廠區內禁止拍照</strong><p>因涉及營業機密，廠區內會議室及參觀路線禁止拍照。</p></div></article>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="section speaker-section" aria-labelledby="speaker-title">
          <div className="section-shell speaker-layout">
            <motion.div {...reveal}>
              <p className="eyebrow">EDUCATION</p>
              <h2 id="speaker-title">讓品質管理，成為看得見的專業</h2>
              <p className="course-name">{event.course.name}</p>
              <dl className="speaker-meta">
                <div><dt>講師</dt><dd>{event.course.speaker}</dd></div>
                <div><dt>時間</dt><dd>{event.course.time}</dd></div>
                <div><dt>地點</dt><dd>{event.course.place}</dd></div>
              </dl>
            </motion.div>
          </div>
        </section>

        <section className="section schedule-section" id="schedule">
          <div className="section-shell schedule-layout">
            <div className="schedule-sticky"><SectionHeading eyebrow="DAY PLAN" title="一日行程，從學習走向交流" body="所有活動依時間完整排列；點選每個時段，可查看地點與當日提醒。" /></div>
            <ScheduleTimeline />
          </div>
        </section>

        <section className="section meeting-section" id="meeting">
          <div className="section-shell meeting-layout">
            <div className="meeting-content">
              <div className="reminder-card">
                <h3>重要提醒</h3>
                <ul>
                  <li>無法親自出席會員大會者，可填寫委託書。</li>
                  <li>每一會員僅能接受其他會員一人委託。</li>
                  <li>提案須於 9 月 5 日前回傳。</li>
                  <li>理事、監事請準時參加理監事會議。</li>
                  <li>會員大會為本會年度重要會議。</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section transport-section" id="transport">
          <div className="section-shell">
            <SectionHeading eyebrow="GETTING THERE" title="我怎麼前往？" body="選擇交通方式，快速看見集合時間、費用與導航資訊。" />
            <TransportSelector onCopy={copyText} />
          </div>
        </section>

        <section className="section fee-section" aria-labelledby="fee-title">
          <div className="section-shell fee-layout">
            <div><p className="eyebrow">FEE ESTIMATE</p><h2 id="fee-title">費用試算，一次看清楚</h2><p>依正式公文列示費用計算。會員費用依交通方式計價；非會員依參加內容計價。</p></div>
            <FeeCalculator />
          </div>
        </section>

        <section className="section downloads-section" id="downloads">
          <div className="section-shell">
            <SectionHeading eyebrow="DOCUMENTS" title="活動文件下載" body="完整公文與兩份會員大會表單皆保留原始版面，可直接查看或下載。" />
            <div className="document-grid">
              {event.documents.map((doc, index) => (
                <article className="document-card" key={doc.name}>
                  <span className="document-icon">{index === 0 ? <FileText aria-hidden="true" /> : index === 1 ? <Users aria-hidden="true" /> : <BookOpenCheck aria-hidden="true" />}</span>
                  <span className="file-type">PDF</span>
                  <h3>{doc.name}</h3><p>{doc.purpose}</p>
                  <div className="document-actions">
                    <a href={doc.path} target="_blank" rel="noreferrer">查看<span className="sr-only">{doc.name}（另開新視窗）</span><ExternalLink size={16} aria-hidden="true" /></a>
                    <a href={doc.path} download><Download size={16} aria-hidden="true" />下載<span className="sr-only">{doc.name}</span></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-shell contact-card">
            <div>
              <p className="eyebrow">CONTACT</p><h2>準備好一起出發了嗎？</h2>
              <p>{registrationClosed ? "線上報名期限已截止，如仍希望參加，請先聯絡主辦單位確認。" : "本次公文未提供可公開使用的線上報名網址，請直接聯絡主辦單位完成報名。"}</p>
            </div>
            <div className="contact-person"><span>聯絡人</span><strong>{event.contact.name}</strong></div>
            <div className="contact-actions">
              <a href={`tel:${event.contact.phoneHref}`}><Phone aria-hidden="true" /><span>撥打電話<small>{event.contact.phoneDisplay}</small></span></a>
              <a href={`mailto:${event.contact.email}`}><Mail aria-hidden="true" /><span>寄送 Email<small>{event.contact.email}</small></span></a>
              <button type="button" onClick={() => copyText(event.contact.lineId, "LINE ID")}><Clipboard aria-hidden="true" /><span>複製 LINE ID<small>{event.contact.lineId}</small></span></button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><img src={event.assets.mark} width="64" height="64" alt="" /><span><strong>{event.organizer}</strong><small>中藥品質・專業交流・產業傳承</small></span></div>
        <p>活動資訊以主辦單位最新通知為準。</p>
      </footer>

      <nav className="mobile-action-bar" aria-label="快速操作">
        <a href="#schedule"><ScrollText aria-hidden="true" /><span>行程</span></a>
        <button type="button" aria-haspopup="dialog" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(true)}><MapPin aria-hidden="true" /><span>導航</span></button>
        <a href="#contact"><Phone aria-hidden="true" /><span>{registrationClosed ? "聯絡主辦" : "報名／聯絡"}</span></a>
      </nav>

      <NavigationChooser open={navigationOpen} onClose={() => setNavigationOpen(false)} />

      <AnimatePresence>
        {toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}
      </AnimatePresence>
    </>
  );
}

export default App;
