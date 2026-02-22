// patch-autosave.js
// Replaces PracticeSession and TestMode functions with auto-save versions
const fs = require('fs');
const path = '/Users/lukemccarthy/pantherprep/public/index.html';

let html = fs.readFileSync(path, 'utf8');

// ── REPLACE PracticeSession ──
const oldPractice = `function PracticeSession({test,domain,onFinish,onBack,uid,user}){
const qs=useMemo(()=>{let p=QS.filter(q=>q.test===test);if(domain!=='all')p=p.filter(q=>q.domain===domain);return shuffle(p)},[test,domain]);
const[idx,setIdx]=useState(0);const[res,setRes]=useState([]);const[sessionXP,setSessionXP]=useState(0);const[xpFlash,setXpFlash]=useState(0);
const[levelModal,setLevelModal]=useState(null);const[badgeModal,setBadgeModal]=useState(null);`;

const newPractice = `function PracticeSession({test,domain,onFinish,onBack,uid,user}){
const sessionKey='practice_'+test+'_'+domain;
const[restored,setRestored]=useState(false);
const[savedQIds,setSavedQIds]=useState(null);
const qs=useMemo(()=>{if(savedQIds)return getQsFromIds(savedQIds);let p=QS.filter(q=>q.test===test);if(domain!=='all')p=p.filter(q=>q.domain===domain);return shuffle(p)},[test,domain,savedQIds]);
const[idx,setIdx]=useState(0);const[res,setRes]=useState([]);const[sessionXP,setSessionXP]=useState(0);const[xpFlash,setXpFlash]=useState(0);
const[levelModal,setLevelModal]=useState(null);const[badgeModal,setBadgeModal]=useState(null);
useEffect(()=>{if(!uid||restored)return;loadProgress(uid,sessionKey).then(d=>{if(d&&d.qIds&&d.idx<d.qIds.length){setSavedQIds(d.qIds);setIdx(d.idx||0);setRes(d.res||[]);setSessionXP(d.sessionXP||0)}setRestored(true)}).catch(()=>setRestored(true))},[uid]);
useEffect(()=>{if(!restored||!uid||idx>=qs.length)return;saveProgress(uid,sessionKey,{qIds:qs.map(q=>q.id),idx,res,sessionXP,test,domain,mode:'practice'})},[idx,res,restored]);`;

// ── Find and replace the old finish/record block to add clearProgress ──
const oldFinishPractice = `if(uid){const s=getUserStats(uid);const{stats:ns,newBadges}=recordSession(s,test,domain==='all'?'Mixed':domain,c,qs.length,false);setUserStats(uid,ns);
saveSessionToFirestore(uid,user?.displayName,user?.email,test,domain==='all'?'Mixed':domain,c,qs.length,false)}`;

const newFinishPractice = `if(uid){const s=getUserStats(uid);const{stats:ns,newBadges}=recordSession(s,test,domain==='all'?'Mixed':domain,c,qs.length,false);setUserStats(uid,ns);
saveSessionToFirestore(uid,user?.displayName,user?.email,test,domain==='all'?'Mixed':domain,c,qs.length,false);clearProgress(uid,sessionKey)}`;


// ── REPLACE TestMode ──
const oldTest = `function TestMode({test,onFinish,uid,user}){
const info=TESTS[test];
const qs=useMemo(()=>shuffle(QS.filter(q=>q.test===test)).slice(0,20),[test]);
const[ci,setCi]=useState(0);const[ans,setAns]=useState({});const[flags,setFlags]=useState(new Set());const[tl,setTl]=useState(info.mins*60);const[fin,setFin]=useState(false);const tr=useRef(null);
useEffect(()=>{tr.current=setInterval(()=>setTl(p=>{if(p<=1){clearInterval(tr.current);setFin(true);return 0}return p-1}),1000);return()=>clearInterval(tr.current)},[]);
const finish=()=>{clearInterval(tr.current);setFin(true)};`;

const newTest = `function TestMode({test,onFinish,uid,user}){
const info=TESTS[test];
const sessionKey='test_'+test;
const[restored,setRestored]=useState(false);
const[savedQIds,setSavedQIds]=useState(null);
const[savedState,setSavedState]=useState(null);
const qs=useMemo(()=>{if(savedQIds){var r=getQsFromIds(savedQIds);return r.length===savedQIds.length?r:shuffle(QS.filter(q=>q.test===test)).slice(0,20)}return shuffle(QS.filter(q=>q.test===test)).slice(0,20)},[test,savedQIds]);
const[ci,setCi]=useState(0);const[ans,setAns]=useState({});const[flags,setFlags]=useState(new Set());const[tl,setTl]=useState(info.mins*60);const[fin,setFin]=useState(false);const tr=useRef(null);
useEffect(()=>{if(!uid||restored)return;loadProgress(uid,sessionKey).then(d=>{if(d&&d.qIds&&!d.fin){setSavedQIds(d.qIds);setSavedState(d)}setRestored(true)}).catch(()=>setRestored(true))},[uid]);
useEffect(()=>{if(!savedState||!restored)return;setCi(savedState.ci||0);setAns(savedState.ans||{});setFlags(new Set(savedState.flags||[]));setTl(savedState.tl!=null?savedState.tl:info.mins*60);setSavedState(null)},[savedState,restored]);
useEffect(()=>{if(!restored)return;tr.current=setInterval(()=>setTl(p=>{if(p<=1){clearInterval(tr.current);setFin(true);return 0}return p-1}),1000);return()=>clearInterval(tr.current)},[restored]);
useEffect(()=>{if(!restored||!uid||fin)return;saveProgress(uid,sessionKey,{qIds:qs.map(q=>q.id),ci,ans,flags:[...flags],tl,fin:false,test,mode:'test'})},[ci,ans,flags,tl,restored]);
const finish=()=>{clearInterval(tr.current);setFin(true);if(uid)clearProgress(uid,sessionKey)};`;

// ── Also add clearProgress to test finish block ──
const oldFinishTest = `saveSessionToFirestore(uid,user?.displayName,user?.email,test,'Mixed',c,qs.length,true);saveQuestionResults(qResults)}`;
const newFinishTest = `saveSessionToFirestore(uid,user?.displayName,user?.email,test,'Mixed',c,qs.length,true);saveQuestionResults(qResults);clearProgress(uid,sessionKey)}`;


// ── Apply replacements ──
let count = 0;

if (html.includes(oldPractice)) {
  html = html.replace(oldPractice, newPractice);
  count++;
  console.log('✅ Replaced PracticeSession init');
} else {
  console.log('❌ Could not find PracticeSession init block');
}

if (html.includes(oldFinishPractice)) {
  html = html.replace(oldFinishPractice, newFinishPractice);
  count++;
  console.log('✅ Replaced PracticeSession finish block');
} else {
  console.log('❌ Could not find PracticeSession finish block');
}

if (html.includes(oldTest)) {
  html = html.replace(oldTest, newTest);
  count++;
  console.log('✅ Replaced TestMode init');
} else {
  console.log('❌ Could not find TestMode init block');
}

if (html.includes(oldFinishTest)) {
  html = html.replace(oldFinishTest, newFinishTest);
  count++;
  console.log('✅ Replaced TestMode finish block');
} else {
  console.log('❌ Could not find TestMode finish block');
}

if (count === 4) {
  // Backup first
  fs.writeFileSync(path + '.backup', fs.readFileSync(path));
  fs.writeFileSync(path, html);
  console.log('\n🎉 All 4 replacements successful! Backup saved as index.html.backup');
} else {
  console.log('\n⚠️  Only ' + count + '/4 replacements matched. File NOT modified.');
  console.log('Please share the mismatched sections so I can fix the search strings.');
}
