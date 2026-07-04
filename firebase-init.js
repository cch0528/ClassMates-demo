/* ===== Firebase 初始化 =====
   用 compat SDK(用<script>載入,唔使npm/bundler,適合純HTML項目) */
const firebaseConfig = {
  apiKey: "AIzaSyAPnAvTwNaJgCPsyg8dCzsRiKV-UddpcvM",
  authDomain: "classmates-61b19.firebaseapp.com",
  projectId: "classmates-61b19",
  storageBucket: "classmates-61b19.firebasestorage.app",
  messagingSenderId: "1085290223356",
  appId: "1:1085290223356:web:159bfd39e560c7f6d3a979",
  measurementId: "G-L7H3CZ5HGM"
};

firebase.initializeApp(firebaseConfig);
const fbAuth = firebase.auth();
const fbDB = firebase.firestore();
const fbStorage = firebase.storage();

/* Safari私密瀏覽/部分瀏覽器會限制IndexedDB,令Auth持久化靜靜地失敗。
   呢度強制set返persistence,唔得就跌落嚟用session-only,確保Auth call唔會卡死。 */
fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{
  fbAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(()=>{
    fbAuth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(()=>{});
  });
});

/* 攔截未被catch嘅promise rejection,確保任何靜默失敗都會彈出嚟等你睇到 */
window.addEventListener("unhandledrejection", e=>{
  console.error("未處理嘅錯誤:", e.reason);
  if(typeof toast==="function") toast("發生錯誤:"+(e.reason && (e.reason.message||e.reason.code||e.reason)));
});

/* ---------- Firestore 帳戶profile helpers ---------- */
async function fbCreateProfile(uid, data){
  await fbDB.collection("users").doc(uid).set({...data, createdAt:new Date().toISOString()});
}
async function fbGetProfile(uid){
  const snap = await fbDB.collection("users").doc(uid).get();
  return snap.exists ? snap.data() : null;
}
