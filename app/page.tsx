"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "交通" | "參訪" | "會務" | "餐敘";
type ScheduleItem = { time: string; title: string; venue: string; category: Category; description: string; note?: string };

const schedule: ScheduleItem[] = [
  { time: "08:50–09:50", title: "高鐵接駁", venue: "桃園高鐵站 → 科達製藥", category: "交通", description: "接駁車預計行車約 40 分鐘；請搭乘者提早 10 分鐘集合，並留意主辦單位後續通知的集合出口與車牌。", note: "接駁需求與行李件數請於會前完成回報。" },
  { time: "09:00–10:00", title: "科達場地佈置", venue: "科達製藥工廠", category: "會務", description: "工作人員完成報到桌、名牌、會議資料、導引指標與參訪分組用品配置。", note: "工作人員行程，與接駁及報到並行。" },
  { time: "09:30–10:00", title: "會員報到", venue: "科達製藥工廠", category: "會務", description: "完成簽到、領取名牌與活動資料；如有飲食禁忌或行動協助需求，請於報到時再次確認。" },
  { time: "10:00–12:00", title: "中藥材質量管理與源頭管理", venue: "科達製藥工廠・會議室", category: "參訪", description: "聚焦中藥材來源追溯、供應商管理、檢驗規格、風險辨識與產業實務交流，並保留綜合提問時間。" },
  { time: "12:00–13:00", title: "午餐・便當", venue: "科達製藥・員工餐廳", category: "餐敘", description: "統一於員工餐廳用餐。請依現場標示入座，餐後協助垃圾分類並準時返回集合點。", note: "會議室不可飲食。" },
  { time: "13:00–15:00", title: "參觀科達製藥", venue: "科達製藥工廠", category: "參訪", description: "依現場分組與導覽動線參觀，了解中藥製劑從原料、品管到製程管理的實務。請遵守廠區安全與攝影規範。", note: "建議穿著包覆性、好走的鞋款。" },
  { time: "15:00–15:30", title: "移動至晚間會場", venue: "科達製藥 → Amour 阿沐", category: "交通", description: "搭乘遊覽車 1–2 台或自用汽車前往。請依工作人員分車，抵達後先確認返程方式與個人物品。" },
  { time: "15:30–16:00", title: "理監事會議", venue: "Amour 阿沐婚宴會館", category: "會務", description: "理監事依通知席次入座，進行會前議案確認、程序協調及會員大會工作分工。", note: "非與會會員可於休息區稍候。" },
  { time: "16:00–16:30", title: "會員大會場地佈置", venue: "Amour 阿沐婚宴會館", category: "會務", description: "完成簽到區、席次、提案資料、音響簡報與餐敘轉場確認。工作人員請依分工表就位。" },
  { time: "16:30–18:00", title: "會員大會", venue: "Amour 阿沐婚宴會館", category: "會務", description: "進行會務報告、提案討論、意見交流與臨時動議。請會員準時入席並將手機調整為靜音。" },
  { time: "18:00–20:00", title: "會員餐敘", venue: "Amour 阿沐婚宴會館", category: "餐敘", description: "以晚宴交流為一日活動收尾。席次與餐食安排以現場桌次表為準，敬請理性飲酒並預先安排安全返程。" },
];

const qualityFocus = [
  ["01", "來源可追溯", "從產地、採收、加工到入廠，建立可回溯的供應鏈資訊。"],
  ["02", "基原與性狀鑑別", "以專業鑑別與檢驗方法確認藥材身分，降低混誤用風險。"],
  ["03", "風險項目管理", "依藥材特性關注農藥、重金屬、真菌毒素與微生物等品質風險。"],
  ["04", "供應商評估", "透過規格、文件、稽核與持續溝通，建立穩定的合作關係。"],
  ["05", "製程與批次一致", "理解中藥製劑從原料到成品的管制節點與紀錄邏輯。"],
  ["06", "儲運與永續", "兼顧溫濕度、庫存管理、包材與產業長期韌性。"],
];

const filters = ["全部", "交通", "參訪", "會務", "餐敘"] as const;
function formatCountdown(target: Date) {
  const distance = target.getTime() - Date.now();
  if (distance <= 0) return null;
  return { days: Math.floor(distance / 86400000), hours: Math.floor((distance % 86400000) / 3600000), minutes: Math.floor((distance % 3600000) / 60000) };
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("全部");
  const [expanded, setExpanded] = useState<number | null>(2);
  const [countdown, setCountdown] = useState(() => formatCountdown(new Date("2026-09-19T08:50:00+08:00")));
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(formatCountdown(new Date("2026-09-19T08:50:00+08:00"))), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleSchedule = useMemo(() => schedule.map((item, index) => ({ item, index })).filter(({ item }) => activeFilter === "全部" || item.category === activeFilter), [activeFilter]);
  const copyAddress = async (label: string, address: string) => { await navigator.clipboard.writeText(address); setCopied(label); window.setTimeout(() => setCopied(null), 1800); };
  const downloadCalendar = () => {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//台灣中藥權益促進會//會員大會//ZH-TW", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:20260919-member-assembly@tcm-rights.tw", "DTSTAMP:20260814T000000Z", "DTSTART;TZID=Asia/Taipei:20260919T085000", "DTEND;TZID=Asia/Taipei:20260919T200000", "SUMMARY:台灣中藥權益促進會｜2026會員大會暨產業參訪", "LOCATION:科達製藥股份有限公司／Amour阿沐婚宴會館", "DESCRIPTION:上午科達製藥產業參訪，下午會員大會及餐敘。請以主辦單位最新通知為準。", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "台灣中藥權益促進會_2026會員大會.ics"; anchor.click(); URL.revokeObjectURL(url);
  };

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="回到頁首"><span className="brand-mark">藥</span><span>台灣中藥權益促進會</span></a>
      <nav aria-label="主要導覽"><a href="#about">活動主軸</a><a href="#schedule">一日行程</a><a href="#venues">交通場地</a><a href="#guide">行前須知</a></nav>
      <button className="header-cta" onClick={downloadCalendar}>加入行事曆</button>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">2026 ANNUAL GATHERING · TAOYUAN</p>
        <h1>守住每一味藥，<br /><em>連起產業的未來。</em></h1>
        <p className="hero-lead">會員大會暨中藥產業參訪</p>
        <p className="hero-summary">從藥材源頭、品質檢驗到現代製程，走進產業現場；再回到會員共同議事的桌前，把專業經驗轉化為下一步行動。</p>
        <div className="hero-meta" aria-label="活動基本資訊"><span><b>09.19</b> 週六</span><span>08:50 — 20:00</span><span>桃園・平鎮</span></div>
        <div className="hero-actions"><a className="primary-button" href="#schedule">查看完整行程 <span>↓</span></a><button className="text-button" onClick={downloadCalendar}>下載行事曆</button></div>
      </div>
      <div className="hero-visual">
        <img src="/hero-astragalus-v2.png" alt="黃耆原根與切片搭配現代品質檢驗設備" />
        <div className="photo-caption"><span>HERITAGE × SCIENCE</span><b>傳統本草，現代標準</b></div>
        <div className="countdown"><span>{countdown ? "距離活動還有" : "活動日期"}</span>{countdown ? <div><b>{countdown.days}</b><small>天</small><b>{String(countdown.hours).padStart(2, "0")}</b><small>時</small><b>{String(countdown.minutes).padStart(2, "0")}</b><small>分</small></div> : <strong>2026.09.19</strong>}</div>
      </div>
    </section>

    <div className="marquee" aria-hidden="true"><div>品質可追溯　·　專業可傳承　·　權益可共議　·　產業可永續　·　QUALITY WITH ORIGIN　·　</div></div>

    <section className="section about-section" id="about">
      <div className="about-intro">
        <p className="section-index">01 / WHY WE GATHER</p>
        <blockquote>品質，不只是一份檢驗報告。<br />它始於產地，也成於每一個人的專業判斷。</blockquote>
        <div><p>這不只是一趟工廠參訪，也是一場把「源頭管理、製程實務、產業權益」放在同一張桌上討論的年度聚會。</p><p>上午以現場觀察建立共同語言；下午透過會員大會凝聚問題、提案與行動方向，讓專業交流真正回到產業日常。</p></div>
      </div>
      <figure className="story-figure source-figure">
        <img src="/source-traceability.png" alt="朱紅線串連黃耆從產地、整理到原料驗收的旅程" />
        <figcaption><span>RAW MATERIAL CONTROL</span><b>原料驗收：外觀、規格與批次紀錄</b></figcaption>
      </figure>
      <div className="impact-grid">
        <article><span>01</span><h3>看見源頭</h3><p>理解藥材從產地、供應商到入廠前的品質管理思維。</p></article>
        <article><span>02</span><h3>走進製程</h3><p>把書面規範放進實際場域，看見品質如何被執行與記錄。</p></article>
        <article><span>03</span><h3>形成共識</h3><p>在會員大會中交換實務經驗，凝聚產業權益與共同倡議。</p></article>
      </div>
    </section>

    <section className="focus-section">
      <div className="focus-heading">
        <p className="section-index">02 / QUALITY FOCUS</p><h2>從源頭到成品，<br />我們關注什麼？</h2><p>專題交流將以實務管理為核心，協助會員建立一套更完整的品質觀察框架。</p>
        <figure className="focus-photo"><img src="/modern-production.png" alt="密閉製程設備化為山水長卷，金色流線通過各個品質節點" /><figcaption>PROCESS CONTROL · 製程管制</figcaption></figure>
      </div>
      <div className="focus-list">{qualityFocus.map(([no,title,desc]) => <article key={no}><span>{no}</span><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
    </section>

    <section className="section schedule-section" id="schedule">
      <div className="section-heading"><div><p className="section-index">03 / FULL DAY PROGRAM</p><h2>一日行程</h2></div><p>上午深入製藥現場，下午移動至會員大會。點選任一時段，可展開內容與注意事項。</p></div>
      <div className="filter-row" role="group" aria-label="篩選行程">{filters.map(filter => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div>
      <div className="timeline">{visibleSchedule.map(({ item, index }) => { const isOpen = expanded === index; return <article className={`timeline-item ${isOpen ? "open" : ""}`} key={`${item.time}-${item.title}`}>
        <button onClick={() => setExpanded(isOpen ? null : index)} aria-expanded={isOpen}><time>{item.time}</time><span className={`category category-${item.category}`}>{item.category}</span><span className="timeline-title"><b>{item.title}</b><small>{item.venue}</small></span><span className="expand-icon" aria-hidden="true">＋</span></button>
        {isOpen && <div className="timeline-detail"><p>{item.description}</p>{item.note && <p className="note">提醒｜{item.note}</p>}</div>}
      </article>; })}</div>
    </section>

    <section className="section venues-section" id="venues">
      <div className="section-heading light"><div><p className="section-index">04 / TWO VENUES · ONE PURPOSE</p><h2>場地與移動</h2></div><p>兩個場地皆位於桃園市平鎮區。自行開車者請預留停車、假日車流與兩地轉場時間。</p></div>
      <div className="venue-grid">
        <article className="venue-card"><div className="venue-number">A</div><p className="venue-time">09:00 — 15:00</p><h3>科達製藥股份有限公司</h3><p className="address">桃園市平鎮區工業三路 20-1 號</p><div className="venue-tags"><span>報到</span><span>專題交流</span><span>工廠參訪</span><span>午餐</span></div><div className="venue-actions"><a href="https://www.google.com/maps/search/?api=1&query=%E7%A7%91%E9%81%94%E8%A3%BD%E8%97%A5%20%E6%A1%83%E5%9C%92%E5%B8%82%E5%B9%B3%E9%8E%AE%E5%8D%80%E5%B7%A5%E6%A5%AD%E4%B8%89%E8%B7%AF20-1%E8%99%9F" target="_blank" rel="noreferrer">開啟地圖 ↗</a><button onClick={() => copyAddress("科達", "桃園市平鎮區工業三路20-1號")}>{copied === "科達" ? "已複製" : "複製地址"}</button></div></article>
        <div className="transfer-card"><span>15:00</span><div className="route-line"><i></i><b>約 30 分鐘</b><i></i></div><p>遊覽車 1–2 台<br />或自用汽車</p></div>
        <article className="venue-card"><div className="venue-number">B</div><p className="venue-time">15:30 — 20:00</p><h3>Amour 阿沐婚宴會館</h3><p className="address">桃園市平鎮區延平路二段 371 號</p><div className="venue-tags"><span>理監事會</span><span>會員大會</span><span>餐敘</span></div><div className="venue-actions"><a href="https://www.google.com/maps/search/?api=1&query=Amour%E9%98%BF%E6%B2%90%E5%A9%9A%E5%AE%B4%E6%9C%83%E9%A4%A8" target="_blank" rel="noreferrer">開啟地圖 ↗</a><button onClick={() => copyAddress("阿沐", "桃園市平鎮區延平路二段371號")}>{copied === "阿沐" ? "已複製" : "複製地址"}</button></div></article>
      </div>
      <div className="transport-note"><b>搭乘高鐵接駁</b><p>08:50 自桃園高鐵站出發，車程預估約 40 分鐘。確切集合出口、聯絡窗口與車牌將由主辦單位另行通知。</p><span>08:40 前抵達集合點</span></div>
    </section>

    <section className="assembly-section">
      <div className="assembly-copy">
        <p className="section-index">05 / MEMBERS IN ACTION</p><h2>讓會員大會，<br />成為行動的起點。</h2><p>下午會議不只是例行程序，而是協會梳理產業現況、承接會員聲音、確認下一階段工作方向的重要時刻。</p>
        <figure className="assembly-photo"><img src="/members-assembly.png" alt="會員圍桌共議，眾人的提案匯聚成一片銀杏葉" /><figcaption>MEMBERS IN ACTION · 讓專業意見成為共同方向</figcaption></figure>
      </div>
      <div className="assembly-steps"><article><b>01</b><div><h3>會務與工作報告</h3><p>回顧協會階段性工作、產業服務與重要議題進度。</p></div></article><article><b>02</b><div><h3>提案討論</h3><p>依正式議程進行說明、意見交換與表決程序。</p></div></article><article><b>03</b><div><h3>會員意見交流</h3><p>彙整第一線實務問題，辨識可共同推動的倡議方向。</p></div></article><article><b>04</b><div><h3>形成後續行動</h3><p>確認分工、追蹤節點與後續溝通方式，讓共識持續前進。</p></div></article></div>
    </section>

    <section className="section guide-section" id="guide">
      <div className="section-heading"><div><p className="section-index">06 / BEFORE YOU GO</p><h2>行前須知</h2></div><p>把一整天走得從容：建議於出發前一天，再確認接駁、服裝與個人需求。</p></div>
      <div className="guide-grid"><article><span>穿</span><h3>參訪服裝</h3><p>建議商務休閒穿著，選擇包覆性、防滑且適合久站步行的鞋款；依現場規定配戴參訪用品。</p></article><article><span>帶</span><h3>隨身物品</h3><p>請攜帶個人證件、環保水杯、常用藥品與輕便雨具；貴重物品請自行妥善保管。</p></article><article><span>守</span><h3>廠區規範</h3><p>依分組動線行進，不任意離隊或觸碰設備；攝影、錄影與飲食均以現場指示為準。</p></article><article><span>告</span><h3>特殊需求</h3><p>素食、過敏原、無障礙協助、接駁與攜伴需求，請在主辦單位指定期限前完成回報。</p></article></div>
      <div className="checklist"><div><span>□</span><p><b>確認接駁</b><br />集合出口與聯絡人</p></div><div><span>□</span><p><b>確認餐食</b><br />素食與過敏需求</p></div><div><span>□</span><p><b>確認返程</b><br />晚宴後交通安排</p></div><div><span>□</span><p><b>準時報到</b><br />09:30 前抵達會場</p></div></div>
    </section>

    <section className="faq-section"><div><p className="section-index">07 / QUICK ANSWERS</p><h2>常見問題</h2></div><div className="faq-list">
      <details><summary>可以自行開車嗎？<span>＋</span></summary><p>可以。請直接導航至科達製藥，下午依工作人員引導前往 Amour 阿沐；停車位置與費用以場地當日公告為準。</p></details>
      <details><summary>只參加會員大會，幾點到？<span>＋</span></summary><p>會員大會預計 16:30 開始，建議 16:15 前抵達 Amour 阿沐婚宴會館並完成簽到。</p></details>
      <details><summary>參訪期間可以拍照嗎？<span>＋</span></summary><p>廠區涉及製程與品質管理，請以現場開放區域及工作人員指示為準；未經同意請勿攝影或錄影。</p></details>
      <details><summary>行程可能調整嗎？<span>＋</span></summary><p>可能因交通、廠區作業或會務需要微調。最終集合資訊、分車與桌次以主辦單位會前通知為準。</p></details>
    </div></section>

    <section className="final-cta"><p>台灣中藥權益促進會 主辦</p><h2>專業相聚，<br />為產業多走一步。</h2><div><button className="primary-button light-button" onClick={downloadCalendar}>加入行事曆</button><button className="outline-button" onClick={() => window.print()}>列印行程</button></div><small>2026 年 9 月 19 日・桃園市平鎮區</small></section>
    <footer><span>台灣中藥權益促進會</span><p>活動資訊以主辦單位最新通知為準</p><a href="#top">回到頁首 ↑</a></footer>
  </main>;
}
