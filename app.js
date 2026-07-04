/* ===== ClassMates — shared data layer =====
   Firebase config實際上放喺firebase-init.js。(呢度以前有個重複嘅firebaseConfig
   placeholder,同firebase-init.js嗰個撞名,兩個<script>共用global scope,
   令成個app.js一load就SyntaxError冧晒——已刪除。) */
const LS_KEY = "coachup_db_v1";
const SESSION_KEY = "coachup_session";
// 分類/地區/年齡層有更新時,將呢個數字加一,現有瀏覽器嘅cache就會自動refresh返呢幾part
const SEED_VERSION = 2;

/* ---------- demo/正式 開關 -----------
   main分支要set做false(正式,冇假資料/冇快速登入);
   demo分支set做true(保留假資料/快速登入,寫入獨立嘅demo_前綴collection,唔會撞正式資料)。 */
const IS_DEMO = true;
const FS_PREFIX = IS_DEMO ? "demo_" : "";

/* ---------- seed demo data ---------- */
function seedDB(){
  const cats = [
    {id:"water", name:"水上活動", em:"🏊", subs:["游水","滑水","獨木舟","風帆","水肺潛水","SUP直立板"]},
    {id:"ball",  name:"球類活動", em:"⚽", subs:["籃球","足球","美式足球","網球","羽毛球","乒乓球","排球","欖球","壁球"]},
    {id:"track", name:"田徑",    em:"🏃", subs:["跑步","跳遠","跳高","標槍","跨欄"]},
    {id:"music", name:"音樂",    em:"🎵", subs:["鋼琴","結他","鼓","聲樂","小提琴","色士風"]},
    {id:"tutor", name:"補習",    em:"📚", subs:["中文","英文","數學","科學","通識/公民科","專科補習"]},
    {id:"other", name:"其他",    em:"📦", subs:[]}
  ];
  const regions = ["中西區","灣仔","東區","南區","油尖旺","深水埗","九龍城","黃大仙","觀塘","荃灣","屯門","元朗","北區","大埔","沙田","西貢","葵青","離島"];
  const ageGroups = ["幼兒 4-6歲","兒童 7-12歲","青少年 13-17歲","成人 18-59歲","長者 60+"];

  // 正式環境:分類/地區/年齡層呢啲平台設定係真嘅,但唔要任何假教練/學員/預約身份資料
  if(!IS_DEMO){
    return {
      cats, regions, ageGroups,
      coaches:[], users:[], bookings:[], reviews:[], reports:[],
      settings:{ defaultConfirmMode:"manual" }
    };
  }

  const coaches = [
    {uid:"c1", name:"陳Sir", em:"🏀", cat:"ball", sub:"籃球", region:"觀塘", bio:"前甲一球員,專注青少年基本功訓練,10年教學經驗。", quals:["HKBA註冊教練","急救證書"], lessons:150, rating:4.8, ratingCount:23, bookingCount:31, approved:true, confirmMode:"default", featured:{pinned:true,pinOrder:1},
      fps:"9123 4567", payme:"@chansir",
      classes:[
        {id:"c1a", ageGroup:"兒童 7-12歲", rate:300, note:"主打初學者,細組教學", weekly:{5:["16:00","17:00"],6:["10:00","11:00","14:00"]}},
        {id:"c1b", ageGroup:"成人 18-59歲", rate:380, note:"技術提升/投籃修正", weekly:{2:["19:00","20:00"],4:["19:00","20:00"]}}
      ]},
    {uid:"c2", name:"Miss Wong", em:"🎹", cat:"music", sub:"鋼琴", region:"沙田", bio:"英國皇家音樂學院演奏級,專教ABRSM考級同樂理。", quals:["ABRSM演奏文憑","Trinity教學證書"], lessons:420, rating:4.9, ratingCount:57, bookingCount:64, approved:true, confirmMode:"manual", featured:{pinned:true,pinOrder:2},
      fps:"9876 1234", payme:"@misswongpiano",
      classes:[
        {id:"c2a", ageGroup:"幼兒 4-6歲", rate:280, note:"啟蒙班", weekly:{3:["15:00","16:00"],6:["09:00","10:00"]}},
        {id:"c2b", ageGroup:"兒童 7-12歲", rate:320, note:"考級專攻", weekly:{1:["16:00","17:00","18:00"],6:["11:00","14:00"]}}
      ]},
    {uid:"c3", name:"阿樂", em:"🏊", cat:"water", sub:"游水", region:"東區", bio:"泳天代表隊出身,專教自由式改良同轉身技巧。", quals:["香港游泳教師總會註冊","拯溺銅章"], lessons:88, rating:4.6, ratingCount:12, bookingCount:15, approved:true, confirmMode:"auto", featured:{pinned:false,pinOrder:0},
      fps:"9333 2211", payme:"@lokswim",
      classes:[
        {id:"c3a", ageGroup:"兒童 7-12歲", rate:250, note:"泳池:港島東", weekly:{0:["09:00","10:00"],6:["09:00","10:00","11:00"]}},
        {id:"c3b", ageGroup:"成人 18-59歲", rate:300, note:"成人怕水友善", weekly:{0:["11:00"],3:["19:00","20:00"]}}
      ]},
    {uid:"c4", name:"Ken教練", em:"🏃", cat:"track", sub:"跑步", region:"元朗", bio:"馬拉松PB 2:48,提供配速訓練同跑姿分析。", quals:["田總一級教練","NSCA-CPT"], lessons:60, rating:4.5, ratingCount:8, bookingCount:11, approved:true, confirmMode:"default", featured:{pinned:false,pinOrder:0},
      fps:"9555 8899", payme:"@kenrun",
      classes:[
        {id:"c4a", ageGroup:"成人 18-59歲", rate:350, note:"跑姿分析包video", weekly:{2:["07:00","19:00"],6:["07:00","08:00"]}}
      ]},
    {uid:"c5", name:"Yuki", em:"🧘", cat:"other", sub:"瑜伽", region:"灣仔", bio:"RYT-500認證,擅長伸展同體態調整,中英日語授課。", quals:["RYT-500","孕婦瑜伽認證"], lessons:210, rating:4.7, ratingCount:35, bookingCount:40, approved:true, confirmMode:"default", featured:{pinned:false,pinOrder:0},
      fps:"9222 7788", payme:"@yukiyoga",
      classes:[
        {id:"c5a", ageGroup:"成人 18-59歲", rate:320, note:"一對一/孕婦友善", weekly:{1:["10:00","11:00"],3:["10:00"],5:["18:00","19:00"]}},
        {id:"c5b", ageGroup:"長者 60+", rate:260, note:"椅子瑜伽", weekly:{2:["10:00","11:00"]}}
      ]},
    {uid:"c6", name:"David", em:"🎸", cat:"music", sub:"結他", region:"油尖旺", bio:"樂隊主音結他手,流行/木結他/電結他都教。", quals:["Rockschool Grade 8"], lessons:34, rating:4.3, ratingCount:6, bookingCount:7, approved:false, confirmMode:"default", featured:{pinned:false,pinOrder:0},
      fps:"9111 0000", payme:"@davidgtr",
      classes:[
        {id:"c6a", ageGroup:"青少年 13-17歲", rate:280, note:"", weekly:{6:["13:00","14:00","15:00"]}}
      ]}
  ];

  const users = [
    {uid:"s1", role:"student", name:"Tyson", email:"student@demo.com", pw:"1234", phone:"9000 0001", status:"active"},
    {uid:"c1", role:"coach", name:"陳Sir", email:"coach@demo.com", pw:"1234", phone:"9123 4567", status:"active"},
    {uid:"a1", role:"admin", name:"Admin", email:"admin@demo.com", pw:"1234", phone:"", status:"active"},
    ...coaches.filter(c=>c.uid!=="c1").map(c=>({uid:c.uid, role:"coach", name:c.name, email:c.uid+"@demo.com", pw:"1234", phone:c.fps, status:"active"}))
  ];

  const now = new Date();
  const d = (offset,h)=>{const t=new Date(now); t.setDate(t.getDate()+offset); t.setHours(h,0,0,0); return t.toISOString();};
  const proofPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const bookings = [
    {id:"b1", studentId:"s1", coachId:"c1", classId:"c1a", datetime:d(3,16), status:"pending_payment", studentName:"Tyson", phone:"9000 0001", studentAge:"9", notes:"仔仔第一次學", proof:"", createdAt:d(-1,10)},
    {id:"b2", studentId:"s1", coachId:"c3", classId:"c3b", datetime:d(5,19), status:"confirmed", studentName:"Tyson", phone:"9000 0001", studentAge:"", notes:"", proof:"", createdAt:d(-2,10)},
    {id:"b3", studentId:"s1", coachId:"c2", classId:"c2b", datetime:d(-7,16), status:"completed", studentName:"Tyson", phone:"9000 0001", studentAge:"8", notes:"", proof:"", createdAt:d(-14,10)},
    {id:"b4", studentId:"s1", coachId:"c1", classId:"c1b", datetime:d(4,19), status:"pending_verify", studentName:"Tyson", phone:"9000 0001", studentAge:"", notes:"想加強投籃", proof:proofPlaceholder, createdAt:d(-1,15)},
    {id:"b5", studentId:"s1", coachId:"c5", classId:"c5a", datetime:d(-3,10), status:"cancelled", studentName:"Tyson", phone:"9000 0001", studentAge:"", notes:"", proof:"", lateCancel:false, createdAt:d(-6,10)}
  ];
  const reviews = [
    {id:"r1", bookingId:"x", coachId:"c1", studentName:"家長Amy", stars:5, comment:"好有耐性,個仔學得好開心!", createdAt:d(-20,10)},
    {id:"r2", bookingId:"x", coachId:"c2", studentName:"Ken", stars:5, comment:"考三級一Take過,勁!", createdAt:d(-30,10)}
  ];
  const reports = [
    {id:"rp1", type:"cancel", desc:"教練臨開課前1小時話有事嚟唔到,冇提前通知。", reporterRole:"student", reporterName:"Tyson", reporterId:"s1", coachId:"c4", bookingId:"", status:"open", createdAt:d(-2,11)},
    {id:"rp2", type:"quality", desc:"教學內容同page度寫嘅唔太相符,想了解下。", reporterRole:"student", reporterName:"阿信", reporterId:"s2", coachId:"c6", bookingId:"", status:"open", createdAt:d(-1,20)},
    {id:"rp3", type:"payment", desc:"學員話已經轉數,但教練話未收到,後來核實係轉錯戶口,已補回。", reporterRole:"coach", reporterName:"阿樂", reporterId:"c3", coachId:"c3", bookingId:"", status:"resolved", createdAt:d(-10,9)}
  ];

  // 教練驗證(資歷已人手核實)獨立於approved(上架與否)
  coaches.forEach(c=>{ c.verified = ["c1","c2"].includes(c.uid); });

  return {
    cats, regions, ageGroups, coaches, users, bookings, reviews, reports,
    settings:{ defaultConfirmMode:"manual" } // manual=教練核實付款先確認 / auto=上傳咗即自動確認
  };
}

/* ---------- DB helpers ---------- */
function loadDB(){
  let raw = localStorage.getItem(LS_KEY);
  if(!raw){ const db = seedDB(); db.seedVersion = SEED_VERSION; localStorage.setItem(LS_KEY, JSON.stringify(db)); return db; }
  let db = JSON.parse(raw);
  // 防禦性檢查:如果係舊版/唔完整嘅cache資料(冇cats/regions等),自動補返
  const needsBackfill = !db.cats || !db.cats.length || !db.regions || !db.ageGroups || !db.reports;
  const outdatedTaxonomy = db.seedVersion !== SEED_VERSION;
  if(needsBackfill || outdatedTaxonomy){
    const fresh = seedDB();
    db.cats = fresh.cats;
    db.regions = fresh.regions;
    db.ageGroups = fresh.ageGroups;
    db.reports = db.reports || [];
    db.settings = db.settings || fresh.settings;
    db.seedVersion = SEED_VERSION;
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  }
  return db;
}
function saveDB(db){ localStorage.setItem(LS_KEY, JSON.stringify(db)); }
function resetDB(){ localStorage.removeItem(LS_KEY); }

const DB = {
  get(){ return loadDB(); },
  update(fn){ const db = loadDB(); fn(db); saveDB(db); return db; },
  uid(){ return "id"+Math.random().toString(36).slice(2,9); }
};

/* ---------- session ---------- */
// Demo分支先skip login,方便一撳就睇login打後嘅畫面;正式分支(IS_DEMO=false)一定要行返真login。
const DEV_SKIP_LOGIN = IS_DEMO;
const DEV_DEMO_USER = { student:{uid:"s1", name:"Tyson"}, coach:{uid:"c1", name:"陳Sir"}, admin:{uid:"a1", name:"Admin"} };
const Session = {
  set(u){ localStorage.setItem(SESSION_KEY, JSON.stringify(u)); },
  get(){ const r = localStorage.getItem(SESSION_KEY); return r?JSON.parse(r):null; },
  clear(){ localStorage.removeItem(SESSION_KEY); }
};
function requireRole(role){
  let u = Session.get();
  if(DEV_SKIP_LOGIN && (!u || u.role!==role)){
    u = {...DEV_DEMO_USER[role], role};
    Session.set(u);
  }
  if(!u || u.role!==role){ location.href = "index.html"; return null; }
  return u;
}
function logout(){ Session.clear(); location.href="index.html"; }

/* ---------- shared utils ---------- */
function toast(msg){
  let t = document.querySelector(".toast");
  if(!t){ t=document.createElement("div"); t.className="toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._tm); t._tm = setTimeout(()=>t.classList.remove("on"), 2200);
}
function starsStr(r){ return "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r)); }
function fmtDT(iso){
  const d = new Date(iso);
  const w = ["日","一","二","三","四","五","六"][d.getDay()];
  return `${d.getMonth()+1}月${d.getDate()}日(${w}) ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function statusLabel(s){
  return {pending_payment:"🟡 待付款", pending_verify:"🟠 待核實付款", confirmed:"🟢 已確認",
          completed:"⚪ 已完成", cancelled:"🔴 已取消", pending_approval:"🟣 待審批"}[s]||s;
}
function effectiveConfirmMode(coach, db){
  return coach.confirmMode==="default" ? db.settings.defaultConfirmMode : coach.confirmMode;
}
/* featured排序: pinned先按pinOrder,其餘 rating*0.7 + normalized bookingCount*0.3 */
function featuredCoaches(db){
  const ap = db.coaches.filter(c=>c.approved);
  const maxB = Math.max(1, ...ap.map(c=>c.bookingCount||0));
  const pinned = ap.filter(c=>c.featured&&c.featured.pinned).sort((a,b)=>a.featured.pinOrder-b.featured.pinOrder);
  const rest = ap.filter(c=>!(c.featured&&c.featured.pinned))
    .map(c=>({c, s:(c.rating||0)*0.7 + ((c.bookingCount||0)/maxB*5)*0.3}))
    .sort((a,b)=>b.s-a.s).map(x=>x.c);
  return [...pinned, ...rest];
}
/* 由weekly availability產生未來14日slots,扣走已book */
function slotsForClass(coach, cls, db){
  const out = [];
  const booked = new Set(db.bookings
    .filter(b=>b.coachId===coach.uid && b.classId===cls.id && !["cancelled"].includes(b.status))
    .map(b=>new Date(b.datetime).toISOString().slice(0,13)));
  for(let i=0;i<14;i++){
    const d = new Date(); d.setDate(d.getDate()+i); d.setHours(0,0,0,0);
    const times = (cls.weekly[d.getDay()]||[]);
    if(!times.length) continue;
    out.push({date:new Date(d), slots: times.map(t=>{
      const dt = new Date(d); const [h,m]=t.split(":"); dt.setHours(+h,+m,0,0);
      return {time:t, iso:dt.toISOString(), taken: booked.has(dt.toISOString().slice(0,13)) || dt < new Date()};
    })});
  }
  return out;
}

/* ===== Firestore即時同步(教練+預約 — 平台嘅核心交易資料) =====
   分類/地區/年齡層/平台設定 暫時仍用local(admin改得少,遲啲先遷移)。
   運作方式:onSnapshot實時聽Firestore,寫落local cache畀舊有同步UI code繼續用;
   任何mutation完成後,call FS.pushCoach/pushBooking 寫返上Firestore,
   咁樣其他裝置嘅onSnapshot就會收到更新。 */
const FS = {
  async pushCoach(c){
    if(!c) return;
    try{ await fbDB.collection(FS_PREFIX+"coaches").doc(c.uid).set(c); }
    catch(e){ console.warn("Firestore教練同步失敗", e); }
  },
  async pushBooking(b){
    if(!b) return;
    try{ await fbDB.collection(FS_PREFIX+"bookings").doc(b.id).set(b); }
    catch(e){ console.warn("Firestore預約同步失敗", e); }
  },
  async deleteCoach(uid){
    try{ await fbDB.collection(FS_PREFIX+"coaches").doc(uid).delete(); }
    catch(e){ console.warn("Firestore教練刪除失敗", e); }
  },
  async seedIfEmpty(){
    if(!IS_DEMO) return; // 正式環境唔會自動seed假教練/假預約落Firestore
    try{
      const snap = await fbDB.collection(FS_PREFIX+"coaches").limit(1).get();
      if(!snap.empty) return;
      const db = DB.get();
      const batch = fbDB.batch();
      db.coaches.forEach(c=> batch.set(fbDB.collection(FS_PREFIX+"coaches").doc(c.uid), c));
      db.bookings.forEach(b=> batch.set(fbDB.collection(FS_PREFIX+"bookings").doc(b.id), b));
      await batch.commit();
    }catch(e){ console.warn("Firestore初始化種子資料失敗(可能未開Firestore/未登入)", e); }
  },
  initSync(onChange){
    try{
      fbDB.collection(FS_PREFIX+"coaches").onSnapshot(snap=>{
        const coaches = snap.docs.map(d=>d.data());
        if(coaches.length){ DB.update(db=>{ db.coaches = coaches; }); onChange && onChange(); }
      }, e=>console.warn("coaches同步錯誤", e));
      fbDB.collection(FS_PREFIX+"bookings").onSnapshot(snap=>{
        const bookings = snap.docs.map(d=>d.data());
        DB.update(db=>{ db.bookings = bookings; });
        onChange && onChange();
      }, e=>console.warn("bookings同步錯誤", e));
    }catch(e){ console.warn("Firestore initSync失敗", e); }
  }
};
