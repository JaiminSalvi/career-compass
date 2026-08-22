const state={data:null,all:[],govCategory:"all",privateCategory:"all",sort:"match"};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const savedKey="careerCompassSaved", statusKey="careerCompassStatus";
let saved=new Set(JSON.parse(localStorage.getItem(savedKey)||"[]"));

function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function formatDate(v){if(!v)return"Not announced"; const d=new Date(v);return isNaN(d)?"Not announced":d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});}
function daysLeft(v){if(!v)return null;const a=new Date(v);a.setHours(23,59,59,999);return Math.ceil((a-Date.now())/86400000);}
function eligibilityClass(v){return v==="eligible"?"eligible":v==="not_eligible"?"urgent":"check";}
function eligibilityText(v){return v==="eligible"?"Eligible":v==="not_eligible"?"Not Eligible":"Check Eligibility";}
function deadlineLabel(o){const d=daysLeft(o.applicationDeadline);if(d===null)return"Date to be announced";if(d<0)return"Closed";if(d===0)return"Closes today";return d<=3?`${d} day${d===1?"":"s"} left`:d<=7?`${d} days left`:`${d} days remaining`;}
function isGov(o){return o.type==="government_exam"||o.type==="government_job";}
function isPrivate(o){return !isGov(o);}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800);}
function persist(){localStorage.setItem(savedKey,JSON.stringify([...saved]));}

function card(o){
 const isSaved=saved.has(o.id), d=daysLeft(o.applicationDeadline);
 return `<article class="opportunity-card">
 <div class="card-head"><div><h3 class="card-title">${escapeHtml(o.title)}</h3><p class="org">${escapeHtml(o.organization)}</p></div>
 <button class="bookmark ${isSaved?"saved":""}" onclick="toggleSave('${o.id}')" title="Save">${isSaved?"★":"☆"}</button></div>
 <div class="badges"><span class="badge ${eligibilityClass(o.eligibilityStatus)}">${eligibilityText(o.eligibilityStatus)}</span>${d!==null&&d>=0&&d<=7?`<span class="badge ${d<=3?"urgent":"check"}">${deadlineLabel(o)}</span>`:""}<span class="badge">${escapeHtml(o.typeLabel||o.type)}</span></div>
 <div class="meta-line"><span>📍 ${escapeHtml((o.location||[]).join(", "))}</span><span class="match">${o.matchScore||0}% Match</span></div>
 <div class="meta-line"><span>📅 ${formatDate(o.applicationDeadline)}</span><span>${escapeHtml(o.status||"open")}</span></div>
 <div class="skills">${(o.skills||[]).slice(0,4).map(x=>`<span>${escapeHtml(x)}</span>`).join("")}</div>
 <div class="card-actions"><button class="primary" onclick="openDetails('${o.id}')">View Details</button>${o.applicationUrl?`<a class="secondary" href="${o.applicationUrl}" target="_blank" rel="noopener">Apply ↗</a>`:""}</div>
 </article>`}
function renderStats(){
 const all=state.all, open=all.filter(o=>o.status!=="closed"), gov=open.filter(isGov), priv=open.filter(isPrivate), closing=open.filter(o=>{const d=daysLeft(o.applicationDeadline);return d!==null&&d>=0&&d<=7});
 $("#stats").innerHTML=[
 ["✨","New Opportunities",open.length,"Matching your profile"],
 ["🏛","Government Exams",gov.length,"Open or upcoming"],
 ["💼","Private Jobs",priv.length,"Relevant opportunities"],
 ["⏰","Closing Soon",closing.length,"Within 7 days"]
 ].map(x=>`<div class="stat"><div class="stat-top"><span>${x[1]}</span><span class="stat-icon">${x[0]}</span></div><strong>${x[2]}</strong><p>${x[3]}</p></div>`).join("");
}
function filtered(type,category="all"){
 const q=$("#searchInput").value.trim().toLowerCase();
 let arr=state.all.filter(o=>type==="gov"?isGov(o):type==="private"?isPrivate(o):true);
 if(category!=="all")arr=arr.filter(o=>[...(o.category||[]),...(o.location||[])].some(x=>x.toLowerCase()===category.toLowerCase()));
 if(q)arr=arr.filter(o=>JSON.stringify(o).toLowerCase().includes(q));
 return arr.filter(o=>o.status!=="closed");
}
function render(){
 renderStats();
 const closing=state.all.filter(o=>{const d=daysLeft(o.applicationDeadline);return o.status!=="closed"&&d!==null&&d>=0&&d<=15}).sort((a,b)=>daysLeft(a.applicationDeadline)-daysLeft(b.applicationDeadline)).slice(0,6);
 $("#closingSoon").innerHTML=closing.length?closing.map(card).join(""):`<div class="empty">No closing deadlines in the current data.</div>`;
 let best=[...state.all].filter(o=>o.status!=="closed").sort((a,b)=>state.sort==="deadline"?(daysLeft(a.applicationDeadline)||99999)-(daysLeft(b.applicationDeadline)||99999):b.matchScore-a.matchScore).slice(0,6);
 $("#bestMatches").innerHTML=best.map(card).join("");
 const gov=filtered("gov",state.govCategory); $("#governmentGrid").innerHTML=gov.length?gov.map(card).join(""):`<div class="empty">No opportunities match this filter.</div>`;
 const priv=filtered("private",state.privateCategory); $("#privateGrid").innerHTML=priv.length?priv.map(card).join(""):`<div class="empty">No opportunities match this filter.</div>`;
 const savedJobs=state.all.filter(o=>saved.has(o.id)); $("#savedGrid").innerHTML=savedJobs.length?savedJobs.map(card).join(""):`<div class="empty">Nothing saved yet. Tap ☆ on an opportunity to create your shortlist.</div>`;
 lucide.createIcons();
}
window.toggleSave=id=>{saved.has(id)?saved.delete(id):saved.add(id);persist();render();toast(saved.has(id)?"Saved to your shortlist":"Removed from saved opportunities");}
window.openDetails=id=>{
 const o=state.all.find(x=>x.id===id);if(!o)return;
 $("#modalContent").innerHTML=`<p class="eyebrow">${escapeHtml((o.category||[]).join(" • "))}</p><h2>${escapeHtml(o.title)}</h2><p class="org">${escapeHtml(o.organization)}</p>
 <div class="badges"><span class="badge ${eligibilityClass(o.eligibilityStatus)}">${eligibilityText(o.eligibilityStatus)}</span><span class="badge">${o.matchScore}% Profile Match</span></div>
 <div class="detail-grid">
 <div class="detail"><small>Qualification</small><strong>${escapeHtml(o.qualification||"Check notification")}</strong></div>
 <div class="detail"><small>Application deadline</small><strong>${formatDate(o.applicationDeadline)}</strong></div>
 <div class="detail"><small>Age requirement</small><strong>${escapeHtml(o.ageRequirement||"Check notification")}</strong></div>
 <div class="detail"><small>Location</small><strong>${escapeHtml((o.location||[]).join(", "))}</strong></div>
 </div>
 <div class="explain"><strong>Why this matches your profile</strong><ul>${(o.eligibilityExplanation||["Review the official notification for final eligibility."]).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
 <p class="org" style="margin-top:18px">Source: ${escapeHtml(o.sourceName||"Not specified")} • Last verified: ${formatDate(o.lastVerifiedAt)}</p>
 <div class="modal-links"><button class="primary" onclick="toggleSave('${o.id}')">${saved.has(o.id)?"Remove Saved":"Save Opportunity"}</button>${o.notificationUrl?`<a class="secondary" href="${o.notificationUrl}" target="_blank" rel="noopener">Official Notification ↗</a>`:""}${o.applicationUrl?`<a class="primary" href="${o.applicationUrl}" target="_blank" rel="noopener">Apply Now ↗</a>`:`<button class="secondary" disabled>Application link unavailable</button>`}</div>`;
 $("#modalBackdrop").classList.remove("hidden");lucide.createIcons();
}
async function refreshOpportunities(){
 const btns=[$("#refreshBtn"),$("#heroRefresh")];btns.forEach(b=>{b.disabled=true;b.classList.add("loading")});
 try{const res=await fetch(`data/jobs.json?t=${Date.now()}`,{cache:"no-store"});if(!res.ok)throw new Error("Could not load data");state.data=await res.json();state.all=state.data.opportunities||[];$("#lastUpdated").textContent=`Last updated ${new Date(state.data.lastUpdated).toLocaleString()}`;render();toast("✓ Latest opportunity data loaded successfully");}
 catch(e){console.error(e);toast("Unable to refresh. Please try again.");}
 finally{btns.forEach(b=>{b.disabled=false;b.classList.remove("loading")})}
}
function init(){
 const h=new Date().getHours();$("#greeting").textContent=h<12?"Morning":h<18?"Afternoon":"Evening";
 const theme=localStorage.getItem("careerCompassTheme");if(theme==="dark")document.body.classList.add("dark");
 $("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("careerCompassTheme",document.body.classList.contains("dark")?"dark":"light");lucide.createIcons();};
 $("#refreshBtn").onclick=refreshOpportunities;$("#heroRefresh").onclick=refreshOpportunities;
 $("#searchInput").oninput=render;$("#sortSelect").onchange=e=>{state.sort=e.target.value;render()};
 $$("#govTabs .filter-chip").forEach(b=>b.onclick=()=>{$$("#govTabs .filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.govCategory=b.dataset.category;render()});
 $$("#privateTabs .filter-chip").forEach(b=>b.onclick=()=>{$$("#privateTabs .filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.privateCategory=b.dataset.category;render()});
 $("#modalClose").onclick=()=>$("#modalBackdrop").classList.add("hidden");$("#modalBackdrop").onclick=e=>{if(e.target===$("#modalBackdrop"))$("#modalBackdrop").classList.add("hidden")};
 $("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
 refreshOpportunities();
}
document.addEventListener("DOMContentLoaded",init);