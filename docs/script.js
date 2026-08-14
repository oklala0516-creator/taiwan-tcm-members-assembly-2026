const schedule=[
{time:"08:50–09:50",title:"高鐵接駁",venue:"桃園高鐵站 → 科達製藥",category:"交通",description:"接駁車預計行車約 40 分鐘；請搭乘者提早 10 分鐘集合，並留意主辦單位後續通知的集合出口與車牌。",note:"接駁需求與行李件數請於會前完成回報。"},
{time:"09:00–10:00",title:"科達場地佈置",venue:"科達製藥工廠",category:"會務",description:"工作人員完成報到桌、名牌、會議資料、導引指標與參訪分組用品配置。",note:"工作人員行程，與接駁及報到並行。"},
{time:"09:30–10:00",title:"會員報到",venue:"科達製藥工廠",category:"會務",description:"完成簽到、領取名牌與活動資料；如有飲食禁忌或行動協助需求，請於報到時再次確認。"},
{time:"10:00–12:00",title:"中藥材質量管理與源頭管理",venue:"科達製藥工廠・會議室",category:"參訪",description:"聚焦中藥材來源追溯、供應商管理、檢驗規格、風險辨識與產業實務交流，並保留綜合提問時間。"},
{time:"12:00–13:00",title:"午餐・便當",venue:"科達製藥・員工餐廳",category:"餐敘",description:"統一於員工餐廳用餐。請依現場標示入座，餐後協助垃圾分類並準時返回集合點。",note:"會議室不可飲食。"},
{time:"13:00–15:00",title:"參觀科達製藥",venue:"科達製藥工廠",category:"參訪",description:"依現場分組與導覽動線參觀，了解中藥製劑從原料、品管到製程管理的實務。請遵守廠區安全與攝影規範。",note:"建議穿著包覆性、好走的鞋款。"},
{time:"15:00–15:30",title:"移動至晚間會場",venue:"科達製藥 → Amour 阿沐",category:"交通",description:"搭乘遊覽車 1–2 台或自用汽車前往。請依工作人員分車，抵達後先確認返程方式與個人物品。"},
{time:"15:30–16:00",title:"理監事會議",venue:"Amour 阿沐婚宴會館",category:"會務",description:"理監事依通知席次入座，進行會前議案確認、程序協調及會員大會工作分工。",note:"非與會會員可於休息區稍候。"},
{time:"16:00–16:30",title:"會員大會場地佈置",venue:"Amour 阿沐婚宴會館",category:"會務",description:"完成簽到區、席次、提案資料、音響簡報與餐敘轉場確認。工作人員請依分工表就位。"},
{time:"16:30–18:00",title:"會員大會",venue:"Amour 阿沐婚宴會館",category:"會務",description:"進行會務報告、提案討論、意見交流與臨時動議。請會員準時入席並將手機調整為靜音。"},
{time:"18:00–20:00",title:"會員餐敘",venue:"Amour 阿沐婚宴會館",category:"餐敘",description:"以晚宴交流為一日活動收尾。席次與餐食安排以現場桌次表為準，敬請理性飲酒並預先安排安全返程。"}
];
let activeFilter="全部",expanded=2;
function renderSchedule(){
 const root=document.querySelector("#timeline");root.innerHTML="";
 schedule.forEach((item,index)=>{if(activeFilter!=="全部"&&item.category!==activeFilter)return;const article=document.createElement("article");article.className=`timeline-item ${expanded===index?"open":""}`;article.innerHTML=`<button aria-expanded="${expanded===index}"><time>${item.time}</time><span class="category category-${item.category}">${item.category}</span><span class="timeline-title"><b>${item.title}</b><small>${item.venue}</small></span><span class="expand-icon">＋</span></button>${expanded===index?`<div class="timeline-detail"><p>${item.description}</p>${item.note?`<p class="note">提醒｜${item.note}</p>`:""}</div>`:""}`;article.querySelector("button").addEventListener("click",()=>{expanded=expanded===index?null:index;renderSchedule()});root.appendChild(article)});
}
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===button));renderSchedule()}));
function updateCountdown(){const distance=new Date("2026-09-19T08:50:00+08:00").getTime()-Date.now();const box=document.querySelector("#countdown-values");if(distance<=0){document.querySelector("#countdown-label").textContent="活動日期";box.innerHTML="<strong>2026.09.19</strong>";return}const days=Math.floor(distance/86400000),hours=Math.floor(distance%86400000/3600000),minutes=Math.floor(distance%3600000/60000);box.innerHTML=`<b>${days}</b><small>天</small><b>${String(hours).padStart(2,"0")}</b><small>時</small><b>${String(minutes).padStart(2,"0")}</b><small>分</small>`}
function downloadCalendar(){const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//台灣中藥權益促進會//會員大會//ZH-TW","BEGIN:VEVENT","UID:20260919-member-assembly@tcm-rights.tw","DTSTART;TZID=Asia/Taipei:20260919T085000","DTEND;TZID=Asia/Taipei:20260919T200000","SUMMARY:台灣中藥權益促進會｜2026會員大會暨產業參訪","LOCATION:科達製藥股份有限公司／Amour阿沐婚宴會館","END:VEVENT","END:VCALENDAR"].join("\r\n");const url=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="台灣中藥權益促進會_2026會員大會.ics";a.click();URL.revokeObjectURL(url)}
document.querySelectorAll(".calendar-button").forEach(button=>button.addEventListener("click",downloadCalendar));document.querySelectorAll(".copy-address").forEach(button=>button.addEventListener("click",async()=>{await navigator.clipboard.writeText(button.dataset.address);const old=button.textContent;button.textContent="已複製";setTimeout(()=>button.textContent=old,1800)}));
renderSchedule();updateCountdown();setInterval(updateCountdown,60000);
