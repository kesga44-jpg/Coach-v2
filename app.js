/* Football Coach v5.0 — standalone master build
   Single runtime. No dependency on earlier Coach versions or update scripts.
   Storage: footballCoachApp. One-time migration reads footballCoachDataV2 / footballCoachDataV1.
*/
const KEY="footballCoachApp", LEGACY=["footballCoachDataV2","footballCoachDataV1"];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const uid=()=>crypto.randomUUID?crypto.randomUUID():"id-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const fmt=d=>d?new Date(d+"T12:00:00").toLocaleDateString("nl-NL",{day:"numeric",month:"short",year:"numeric"}):"—";
const clone=o=>JSON.parse(JSON.stringify(o));
const emptyArr=k=>Array.isArray(data[k])?data[k]:[];

const STARTER_PLAYERS=[{"id": "p-1", "name": "Shawn Westerhout", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-2", "name": "Tobias van der Wouwer", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-3", "name": "Robin Driessen", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-4", "name": "Luuk Wubben", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-5", "name": "Senar Asan", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-6", "name": "Maxim Vels", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-7", "name": "Joey Spee", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-8", "name": "Sem van Lent", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-9", "name": "Daniel Lechner", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-10", "name": "Ryan Stoel", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-11", "name": "Daan van Dijk", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-12", "name": "Marcelino Hollenberg", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-13", "name": "Jason van Lijden", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-14", "name": "Manu Gangadin", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-15", "name": "Jason Schlee", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-16", "name": "Jayden Reuvers", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-17", "name": "Dean Raesen", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-18", "name": "Ruben Doornbos", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-19", "name": "Jairon Ignatia", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-20", "name": "Kai Meijboom", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-21", "name": "Clayveron Mathilde", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-22", "name": "Dani de Poorter", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-23", "name": "Olivier Dobbe", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-24", "name": "Shad Mostafa", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-25", "name": "Senn Krempel", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-26", "name": "Sem Overink", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-27", "name": "Luka Pronk", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-28", "name": "Sasha Bree", "position": "", "number": "", "selection": "Definitief", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-29", "name": "Mika Reuvers", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-30", "name": "Stein Heuvelman", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}, {"id": "p-31", "name": "Benjamin Hardy", "position": "", "number": "", "selection": "Overig", "active": true, "notes": "", "scores": {"technical": 0, "tactical": 0, "physical": 0, "mental": 0, "attitude": 0}, "developmentGoals": "", "availability": []}];
const defaults=()=>({
 version:5, meta:{updatedAt:new Date().toISOString()}, team:{name:"Full Speed O23",season:"2026/2027",trainingTime:"20:00",trainingDays:["Dinsdag","Donderdag"]},
 players:clone(STARTER_PLAYERS), trainings:[], exercises:[], matches:[], attendance:[], notes:[], documents:[], tactics:[], gameModel:{
   identity:"Verzorgd voetbal, hoge intensiteit en duidelijke afspraken",
   formation:"4-3-3", withBall:"4-3-3", withoutBall:"4-3-3", buildUp:"Opbouwen met rust, 6/8 beschikbaar en backs op tijd breed",
   pressing:"Hoge druk; spitsen sturen naar buiten; triggers: slechte aanname, terugspeelbal, pass naar back met gesloten lichaam",
   transition:"Na balverlies direct 5 seconden druk; daarna centrum dicht",
   restDefense:"3+1", principles:["Centrum dicht","Naar buiten","Aansluiten","Doorstappen","Rugdekking","Vijf seconden"],
   coachWords:["Centrum dicht","Naar buiten","Aansluiten","Doorstappen","Rugdekking","Vijf seconden"]
 }, settings:{formationOptions:["4-3-3","5-3-2","4-2-3-1","4-4-2"]},
 stats:{}, lastMigration:""
});
let data=loadData(), current="dashboard", currentMatchId=null, liveTimer=null, modalSaveFn=null;

function normalize(d){
 d=d&&typeof d==="object"?d:{};
 const x=defaults();
 for(const k of Object.keys(x)) if(d[k]!==undefined) x[k]=d[k];
 x.players=(x.players||[]).map(p=>({...p,id:p.id||uid(),availability:p.availability||[],scores:{technical:0,tactical:0,physical:0,mental:0,attitude:0,...(p.scores||{})}}));
 x.trainings=x.trainings||[];x.exercises=x.exercises||[];x.matches=x.matches||[];x.attendance=x.attendance||[];x.notes=x.notes||[];x.documents=x.documents||[];x.tactics=x.tactics||[];
 x.gameModel={...defaults().gameModel,...(x.gameModel||{})}; return x;
}
function migrateLegacy(raw){
 if(!raw) return null;
 const d=normalize(raw);
 d.lastMigration="migrated "+new Date().toISOString();
 return d;
}
function loadData(){
 try{const n=localStorage.getItem(KEY);if(n)return normalize(JSON.parse(n));}catch(e){}
 for(const k of LEGACY){try{const n=localStorage.getItem(k);if(n){const d=migrateLegacy(JSON.parse(n));localStorage.setItem(KEY,JSON.stringify(d));return d;}}catch(e){}}
 return defaults();
}
function save(){data.meta.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(data));$("#saveState").textContent="Lokaal opgeslagen";}

function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),2200);}
function modal(title,html,onSave){
 $("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;modalSaveFn=onSave;$("#modal").showModal();
}
$("#modalSave").addEventListener("click",e=>{e.preventDefault();if(modalSaveFn&&modalSaveFn()!==false){$("#modal").close();render();}});
$("#quickAdd").onclick=()=>modal("Snel toevoegen",`<div class="quick-grid"><button class="btn primary" data-q="training">Training</button><button class="btn primary" data-q="match">Wedstrijd</button><button class="btn primary" data-q="player">Speler</button><button class="btn primary" data-q="note">Notitie</button></div>`);
$("#modalBody").addEventListener("click",e=>{const b=e.target.closest("[data-q]");if(!b)return;$("#modal").close();openAdd(b.dataset.q)});

function field(label,html,cls=""){return `<label class="field ${cls}"><span>${esc(label)}</span>${html}</label>`}
function btn(text,cls="secondary",attrs=""){return `<button class="btn ${cls}" ${attrs}>${text}</button>`}
function card(title,body,actions=""){return `<section class="card"><div class="card-head"><div><p class="eyebrow">${esc(title)}</p></div><div>${actions}</div></div>${body}</section>`}

function nav(page){current=page==="more"?"settings":page;$$("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const names={dashboard:"Vandaag",players:"Teams & spelers",attendance:"Aanwezigheid",trainings:"Trainingen",exercises:"Oefeningen",matches:"Wedstrijden",tactics:"Tactiekbord",gamemodel:"Spelmodel",season:"Seizoen",stats:"Statistieken",notes:"Coachnotities",documents:"Bronnen",settings:"Instellingen"};$("#title").textContent=names[current]||"Vandaag";$("#eyebrow").textContent=`SEIZOEN ${data.team.season}`;render();}
$("#sideNav").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)nav(b.dataset.page)});
$("#bottomNav").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)nav(b.dataset.page)});
$("#teamSelect").onchange=e=>{data.team.name=e.target.value;save();render()};

function render(){
 const pages={dashboard:renderDashboard,players:renderPlayers,attendance:renderAttendance,trainings:renderTrainings,exercises:renderExercises,matches:renderMatches,tactics:renderTactics,gamemodel:renderGameModel,season:renderSeason,stats:renderStats,notes:renderNotes,documents:renderDocuments,settings:renderSettings};
 $("#app").innerHTML=(pages[current]||renderDashboard)();
 bindPage();
 $("#teamSelect").innerHTML=`<option>${esc(data.team.name)}</option>`;
}

function bindPage(){
 $$("[data-action]").forEach(b=>b.onclick=()=>handleAction(b.dataset.action,b.dataset.id||"",b));
 $$("[data-edit]").forEach(b=>b.onclick=()=>openEdit(b.dataset.edit,b.dataset.id));
 $$("[data-delete]").forEach(b=>b.onclick=()=>deleteItem(b.dataset.delete,b.dataset.id));
 $$("[data-page-link]").forEach(b=>b.onclick=()=>nav(b.dataset.pageLink));
}
function confirmDelete(label){return confirm(`Weet je zeker dat je ${label} wilt verwijderen?\n\nDit kan niet automatisch worden teruggedraaid. Maak eventueel eerst een backup.`)}
function deleteItem(type,id){
 const labels={training:"deze training",match:"deze wedstrijd",player:"deze speler",exercise:"deze oefening",note:"deze notitie",document:"deze bron",tactic:"deze tactiek"};
 if(!confirmDelete(labels[type]||"dit item"))return;
 const map={training:"trainings",match:"matches",player:"players",exercise:"exercises",note:"notes",document:"documents",tactic:"tactics"};
 if(type==="player"){data.players=data.players.filter(x=>x.id!==id);data.attendance=data.attendance.filter(x=>x.playerId!==id)}
 else if(map[type]) data[map[type]]=data[map[type]].filter(x=>x.id!==id);
 save();render();toast("Verwijderd");
}
function handleAction(action,id,el){
 if(action==="attendance"){const date=el.dataset.date||today(),status=el.dataset.status;let a=data.attendance.find(x=>x.playerId===id&&x.date===date);if(!a){a={id:uid(),playerId:id,date};data.attendance.push(a)}a.status=status;save();render();}
 if(action==="toggleDoc"){}
 if(action==="matchPDF") generateMatchPDF(id);
 if(action==="shareMatch") generateMatchPDF(id,true);
 if(action==="startLive") startLive(id);
 if(action==="stopLive") stopLive(id);
 if(action==="event") addMatchEvent(id,el.dataset.event);
 if(action==="openMatch") {currentMatchId=id;current="matchDetail";renderMatchDetail(id)}
}
function renderMatchDetail(id){
 const m=data.matches.find(x=>x.id===id);if(!m){nav("matches");return}
 $("#app").innerHTML=matchDetail(m);bindPage();bindMatchDetail(m);
}
function bindMatchDetail(m){
 $$("[data-back]").forEach(b=>b.onclick=()=>nav("matches"));
 $$("[data-action]").forEach(b=>b.onclick=()=>handleAction(b.dataset.action,b.dataset.id||m.id,b));
 const form=$("#matchSave");if(form)form.onsubmit=e=>{e.preventDefault();m.scoreHome=+$("#mh").value||0;m.scoreAway=+$("#ma").value||0;m.notes=$("#matchNotes").value;m.motm=$("#motm").value;m.evaluation=$("#matchEval").value;save();renderMatchDetail(m.id);toast("Wedstrijd opgeslagen")};
 $$("[data-lineup]").forEach(c=>c.onchange=()=>{const p=m.playerStats.find(x=>x.playerId===c.dataset.lineup);if(p)p.selected=c.checked;save()});
}
function matchDetail(m){
 const ps=data.players.filter(p=>p.active);
 const stats=m.playerStats||[];
 const rows=ps.map(p=>{let st=stats.find(x=>x.playerId===p.id);if(!st){st={playerId:p.id,selected:false,starter:false,minutes:0,position:p.position||"",goals:0,assists:0,rpe:""};stats.push(st)}return '<div class="list-row"><label><input type="checkbox" data-lineup="'+p.id+'" '+(st.selected?"checked":"")+'> '+esc(p.name)+'</label><select data-pos="'+p.id+'"><option>'+esc(st.position||"")+'</option><option>GK</option><option>RB</option><option>RCV</option><option>LCV</option><option>LB</option><option>6</option><option>8</option><option>10</option><option>RW</option><option>LW</option><option>9</option></select><input class="mini" type="number" min="0" max="120" value="'+(st.minutes||0)+'" data-min="'+p.id+'" title="Minuten"></div>'}).join("");
 const eventBtns=["goal","card","sub","injury","note"].map(e=>btn(e,"ghost",'type="button" data-action="event" data-id="'+m.id+'" data-event="'+e+'"')).join("");
 const lineup='<div class="line-list">'+rows+'</div>';
 const motm='<select id="motm"><option></option>'+ps.map(p=>'<option value="'+esc(p.id)+'" '+(m.motm===p.id?"selected":"")+'>'+esc(p.name)+'</option>').join("")+'</select>';
 return '<div class="toolbar"><div>'+btn("← Wedstrijden","ghost",'data-back')+'</div><div class="toolbar-right">'+btn("PDF / Boeken","primary",'data-action="matchPDF" data-id="'+m.id+'"')+btn("Delen","secondary",'data-action="shareMatch" data-id="'+m.id+'"')+'</div></div>'+
 card("Wedstrijd",'<form id="matchSave"><div class="form-grid">'+field("Tegenstander",'<input id="op" value="'+esc(m.opponent)+'" disabled>')+field("Datum",'<input value="'+esc(m.date)+'" disabled>')+'</div><div class="match-score"><input id="mh" class="score-input" type="number" value="'+(m.scoreHome??0)+'"><b>–</b><input id="ma" class="score-input" type="number" value="'+(m.scoreAway??0)+'"></div><div class="button-row">'+btn("Start live","secondary",'type="button" data-action="startLive" data-id="'+m.id+'"')+btn("Stop live","secondary",'type="button" data-action="stopLive" data-id="'+m.id+'"')+' <strong id="liveClock">'+(m.live?.running?Math.floor((m.live.elapsed||0)/60)+":"+String((m.live.elapsed||0)%60).padStart(2,"0"):"00:00")+'</strong></div><div class="event-buttons">'+eventBtns+'</div><h3>Opstelling & minuten</h3>'+lineup+field("MOTM",motm)+field("Wedstrijdevaluatie",'<textarea id="matchEval">'+esc(m.evaluation||"")+'</textarea>')+field("Notities",'<textarea id="matchNotes">'+esc(m.notes||"")+'</textarea>'+btn("Wedstrijd opslaan","primary"))+'</form>')+
 card("Gebeurtenissen",(m.events||[]).length?'<div class="timeline">'+m.events.map(e=>'<div><strong>'+esc(e.type)+'</strong><span>'+fmt(e.atDate||m.date)+' '+esc(e.text||"")+'</span></div>').join("")+'</div>':"<p class='muted'>Nog geen gebeurtenissen</p>");
}
function addMatchEvent(id,type){const m=data.matches.find(x=>x.id===id);if(!m)return;const text=prompt(`Notitie voor ${type}?`,"");if(text===null)return;m.events.push({id:uid(),type,text,minute:m.live?.elapsed||0,atDate:today()});save();renderMatchDetail(id)}
function startLive(id){const m=data.matches.find(x=>x.id===id);if(!m)return;m.live=m.live||{running:false,elapsed:0};m.live.running=true;m.live.startedAt=Date.now();save();renderMatchDetail(id);clearInterval(liveTimer);liveTimer=setInterval(()=>{if(m.live?.running){m.live.elapsed=Math.floor((Date.now()-m.live.startedAt)/1000)+m.live.base;const el=$("#liveClock");if(el)el.textContent=`${Math.floor(m.live.elapsed/60)}:${String(m.live.elapsed%60).padStart(2,"0")}`}},1000)}
function stopLive(id){const m=data.matches.find(x=>x.id===id);if(!m?.live)return;m.live.base=m.live.elapsed||0;m.live.running=false;save();clearInterval(liveTimer);renderMatchDetail(id)}
function generateMatchPDF(id,share=false){
 const m=data.matches.find(x=>x.id===id);if(!m)return;
 const {jsPDF}=window.jspdf||{}; if(!jsPDF){window.print();return}
 const doc=new jsPDF({unit:"mm",format:"a4"});
 const ps=data.players.filter(p=>m.playerStats?.find(s=>s.playerId===p.id&&s.selected));
 doc.setFontSize(18);doc.text(`${data.team.name} — Wedstrijdblad`,14,16);
 doc.setFontSize(10);doc.text(`${fmt(m.date)} · ${m.opponent} · ${m.location||""}`,14,23);
 doc.setFontSize(22);doc.text(`${m.scoreHome??0} – ${m.scoreAway??0}`,14,34);
 doc.setFontSize(10);let y=43;doc.text("Opstelling",14,y);y+=6;
 ps.forEach((p,i)=>{if(y>285)return;const s=m.playerStats.find(x=>x.playerId===p.id);doc.text(`${i+1}. ${p.name}  ${s.position||""}  ${s.minutes||0} min`,16,y);y+=5});
 y=Math.min(y+4,275);doc.text(`MOTM: ${data.players.find(p=>p.id===m.motm)?.name||"—"}`,14,y);y+=7;
 const wrap=doc.splitTextToSize(`Evaluatie: ${m.evaluation||"—"}`,180);doc.text(wrap,14,y);y+=wrap.length*4.5+5;
 const notes=doc.splitTextToSize(`Notities: ${m.notes||"—"}`,180);doc.text(notes,14,y);
 doc.setFontSize(7);doc.text("Football Coach · Full Speed O23 · éénpagina wedstrijdblad",14,291);
 const blob=doc.output("blob"),file=new File([blob],`wedstrijd-${(m.opponent||"wedstrijd").replace(/[^a-z0-9]+/gi,"-")}.pdf`,{type:"application/pdf"});
 if(share&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({title:"Wedstrijdblad",files:[file]}).catch(()=>{});return}
 doc.save(file.name);
}
function openAdd(type){
 if(type==="training") return openTraining();
 if(type==="match") return openMatch();
 if(type==="player") return openPlayer();
 if(type==="note") return openNote();
 if(type==="exercise") return openExercise();
}
function openPlayer(existing){
 const p=existing||{id:uid(),name:"",position:"",number:"",selection:"Definitief",active:true,notes:"",developmentGoals:"",scores:{technical:0,tactical:0,physical:0,mental:0,attitude:0},availability:[]};
 modal(existing?"Speler bewerken":"Nieuwe speler",`<div class="form-grid">${field("Naam",`<input id="f-name" required value="${esc(p.name)}"`)}${field("Positie",`<input id="f-pos" value="${esc(p.position)}"`)}${field("Rugnummer",`<input id="f-num" value="${esc(p.number)}"`)}${field("Selectie",`<select id="f-sel"><option>Definitief</option><option>Twijfel</option><option>Overig</option></select>`)}${field("Ontwikkeldoel",`<textarea id="f-goal">${esc(p.developmentGoals)}</textarea>`)}${field("Notities",`<textarea id="f-notes">${esc(p.notes)}</textarea>`)}</div>`,()=>{p.name=$("#f-name").value.trim();if(!p.name)return false;p.position=$("#f-pos").value;p.number=$("#f-num").value;p.selection=$("#f-sel").value;p.developmentGoals=$("#f-goal").value;p.notes=$("#f-notes").value;if(!existing)data.players.push(p);save();toast("Speler opgeslagen")});
}
function openTraining(existing){
 const t=existing||{id:uid(),date:today(),title:"",theme:"",goal:"",duration:90,intensity:"Middel",rpe:"",wellness:{pain:0,soreness:0,fatigue:0,motivation:5},evaluation:"",nextStep:"",parts:[]};
 modal(existing?"Training bewerken":"Nieuwe training",`<div class="form-grid">${field("Datum",`<input id="f-date" type="date" value="${t.date}">`)}${field("Titel",`<input id="f-title" value="${esc(t.title)}">`)}${field("Thema",`<input id="f-theme" value="${esc(t.theme)}" placeholder="Centrum dicht / pressing / opbouw">`)}${field("Doel",`<textarea id="f-goal">${esc(t.goal)}</textarea>`)}${field("Duur (min)",`<input id="f-duration" type="number" value="${t.duration}">`)}${field("RPE",`<input id="f-rpe" type="number" min="1" max="10" value="${t.rpe||""}">`)}${field("Evaluatie",`<textarea id="f-eval">${esc(t.evaluation)}</textarea>`)}${field("Volgende stap",`<textarea id="f-next">${esc(t.nextStep)}</textarea>`)}</div>`,()=>{Object.assign(t,{date:$("#f-date").value,title:$("#f-title").value,theme:$("#f-theme").value,goal:$("#f-goal").value,duration:+$("#f-duration").value||0,rpe:+$("#f-rpe").value||0,evaluation:$("#f-eval").value,nextStep:$("#f-next").value});if(!existing)data.trainings.push(t);save();toast("Training opgeslagen")});
}
function openMatch(existing){
 const m=existing||{id:uid(),date:today(),opponent:"",location:"",competition:"",scoreHome:0,scoreAway:0,formation:"4-3-3",events:[],playerStats:[],evaluation:"",notes:"",motm:"",live:{running:false,elapsed:0,base:0}};
 modal(existing?"Wedstrijd bewerken":"Nieuwe wedstrijd",`<div class="form-grid">${field("Datum",`<input id="f-date" type="date" value="${m.date}">`)}${field("Tegenstander",`<input id="f-opponent" value="${esc(m.opponent)}">`)}${field("Locatie",`<input id="f-location" value="${esc(m.location)}">`)}${field("Competitie",`<input id="f-comp" value="${esc(m.competition)}">`)}${field("Formatie",`<select id="f-formation">${data.settings.formationOptions.map(x=>`<option ${x===m.formation?"selected":""}>${x}</option>`).join("")}</select>`)}</div>`,()=>{Object.assign(m,{date:$("#f-date").value,opponent:$("#f-opponent").value,location:$("#f-location").value,competition:$("#f-comp").value,formation:$("#f-formation").value});if(!existing)data.matches.push(m);save();toast("Wedstrijd opgeslagen")});
}
function openExercise(existing){
 const x=existing||{id:uid(),name:"",duration:10,intensity:"Middel",tags:"",description:"",coachPoints:""};
 modal(existing?"Oefening bewerken":"Nieuwe oefening",`<div class="form-grid">${field("Naam",`<input id="f-name" value="${esc(x.name)}">`)}${field("Duur",`<input id="f-duration" type="number" value="${x.duration}">`)}${field("Intensiteit",`<select id="f-intensity"><option>Laag</option><option>Middel</option><option>Hoog</option></select>`)}${field("Tags",`<input id="f-tags" value="${esc(x.tags)}">`)}${field("Beschrijving",`<textarea id="f-description">${esc(x.description)}</textarea>`)}${field("Coachpunten",`<textarea id="f-points">${esc(x.coachPoints)}</textarea>`)}</div>`,()=>{Object.assign(x,{name:$("#f-name").value,duration:+$("#f-duration").value||0,intensity:$("#f-intensity").value,tags:$("#f-tags").value,description:$("#f-description").value,coachPoints:$("#f-points").value});if(!existing)data.exercises.push(x);save();toast("Oefening opgeslagen")});
}
function openNote(existing){
 const n=existing||{id:uid(),date:today(),title:"",text:"",theme:""};
 modal(existing?"Notitie bewerken":"Nieuwe coachnotitie",`<div class="form-grid">${field("Datum",`<input id="f-date" type="date" value="${n.date}">`)}${field("Titel",`<input id="f-title" value="${esc(n.title)}">`)}${field("Thema",`<input id="f-theme" value="${esc(n.theme)}">`)}${field("Notitie",`<textarea id="f-text">${esc(n.text)}</textarea>`)}</div>`,()=>{Object.assign(n,{date:$("#f-date").value,title:$("#f-title").value,theme:$("#f-theme").value,text:$("#f-text").value});if(!existing)data.notes.push(n);save();toast("Notitie opgeslagen")});
}
function edit(type,id){const map={player:"players",training:"trainings",match:"matches",exercise:"exercises",note:"notes"};const x=data[map[type]]?.find(a=>a.id===id);if(!x)return;if(type==="player")openPlayer(x);if(type==="training")openTraining(x);if(type==="match")openMatch(x);if(type==="exercise")openExercise(x);if(type==="note")openNote(x)}

function renderDashboard(){
 const nextT=[...data.trainings].sort((a,b)=>a.date.localeCompare(b.date)).find(x=>x.date>=today()),nextM=[...data.matches].sort((a,b)=>a.date.localeCompare(b.date)).find(x=>x.date>=today());
 const present=data.players.filter(p=>attendanceFor(p.id,today())?.status==="Aanwezig").length;
 return `<div class="grid kpis"><div class="kpi"><span>Spelers</span><strong>${data.players.length}</strong><small>actief</small></div><div class="kpi"><span>Volgende training</span><strong>${nextT?fmt(nextT.date):"—"}</strong><small>${esc(nextT?.theme||"Nog plannen")}</small></div><div class="kpi"><span>Volgende wedstrijd</span><strong>${nextM?fmt(nextM.date):"—"}</strong><small>${esc(nextM?.opponent||"Nog plannen")}</small></div><div class="kpi"><span>Aanwezig vandaag</span><strong>${present}/${data.players.length}</strong><small>geregistreerd</small></div></div>
 ${card("Vandaag",`<div class="grid two"><div><h2>Dinsdag ontwikkelen · donderdag aanscherpen · zaterdag toetsen</h2><p class="muted">Kies per ontwikkelweek maximaal één hoofdprobleem. Gebruik voetbalacties en spelgedrag als belasting, niet losse fitnesscircuits.</p></div><div class="dark-box"><strong>Coachfocus</strong><p>Centrum dicht · naar buiten · aansluiten · doorstappen · rugdekking · vijf seconden.</p></div></div>`)}
 ${card("Snel naar",`<div class="button-row">${btn("＋ Training","primary",'data-action="newTraining"')} ${btn("＋ Wedstrijd","secondary",'data-action="newMatch"')} ${btn("＋ Speler","secondary",'data-action="newPlayer"')} ${btn("Wedstrijden","ghost",'data-page-link="matches"')}</div>`)}
 ${card("Recente evaluaties",data.trainings.slice(-3).reverse().map(t=>`<button class="list-row schedule-link" data-edit="training" data-id="${t.id}"><span><strong>${esc(t.theme||t.title||"Training")}</strong><small>${fmt(t.date)} · ${esc(t.nextStep||"Geen volgende stap")}</small></span><b>→</b></button>`).join("")||`<p class="muted">Nog geen trainingsevaluaties.</p>`)}
 `;
}
function attendanceFor(pid,date){return data.attendance.find(a=>a.playerId===pid&&a.date===date)}
function renderPlayers(){
 return `<div class="toolbar"><div><p class="muted">${data.players.length} spelers</p></div><div>${btn("＋ Speler","primary",'data-action="newPlayer"')}</div></div>
 ${card("Teams & spelers",`<div class="table-wrap"><table class="players-table"><thead><tr><th>Speler</th><th>Positie</th><th>Nr.</th><th>Selectie</th><th>Doel</th><th>Status</th><th></th></tr></thead><tbody>${data.players.map(p=>`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.position||"—")}</td><td>${esc(p.number||"—")}</td><td>${esc(p.selection)}</td><td>${esc(p.developmentGoals||"—")}</td><td>${p.active?"Actief":"Inactief"}</td><td class="row-actions">${btn("Open","ghost",'data-page-link="player"')} ${btn("Bewerken","ghost",`data-edit="player" data-id="${p.id}"`)} ${btn("Verwijderen","danger",`data-delete="player" data-id="${p.id}"`)}</td></tr>`).join("")}</tbody></table></div>`)}
 `;
}
function renderAttendance(){
 const d=today();return `<div class="toolbar"><div><p class="muted">${fmt(d)}</p></div></div>${card("Aanwezigheid",`<div class="line-list">${data.players.map(p=>{const a=attendanceFor(p.id,d),s=a?.status||"";return `<div class="list-row"><span><strong>${esc(p.name)}</strong><small>${esc(p.position||"")}</small></span><div class="seg">${["Aanwezig","Afwezig","Twijfel"].map(x=>`<button class="${s===x?"selected":""}" data-action="attendance" data-id="${p.id}" data-status="${x}" data-date="${d}">${x}</button>`).join("")}</div></div>`}).join("")}</div>`)}
 `;
}
function renderTrainings(){
 return `<div class="toolbar"><div><p class="muted">${data.trainings.length} trainingen</p></div><div>${btn("＋ Training","primary",'data-action="newTraining"')}</div></div>${card("Trainingen",data.trainings.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<div class="list-row"><span><strong>${esc(t.theme||t.title||"Training")}</strong><small>${fmt(t.date)} · ${t.duration||0} min · RPE ${t.rpe||"—"}</small></span><div class="row-actions">${btn("Bewerken","ghost",`data-edit="training" data-id="${t.id}"`)}${btn("Verwijderen","danger",`data-delete="training" data-id="${t.id}"`)}</div></div>`).join("")||`<p class="muted">Nog geen trainingen.</p>`)}
 `;
}
function renderExercises(){
 return `<div class="toolbar"><div><p class="muted">${data.exercises.length} oefeningen</p></div><div>${btn("＋ Oefening","primary",'data-action="newExercise"')}</div></div>${card("Oefeningen",`<div class="exercise-grid">${data.exercises.map(x=>`<article class="exercise-card"><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><small>${x.duration} min · ${esc(x.intensity)}</small><div class="footer">${btn("Bewerken","ghost",`data-edit="exercise" data-id="${x.id}"`)}${btn("Verwijderen","danger",`data-delete="exercise" data-id="${x.id}"`)}</div></article>`).join("")||`<p class="muted">Nog geen oefeningen.</p>`}</div>`)}
 `;
}
function renderMatches(){
 return `<div class="toolbar"><div><p class="muted">${data.matches.length} wedstrijden</p></div><div>${btn("＋ Wedstrijd","primary",'data-action="newMatch"')}</div></div>${card("Wedstrijden",data.matches.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<div class="list-row"><span><button class="link-button" data-action="openMatch" data-id="${m.id}"><strong>${esc(m.opponent||"Nieuwe wedstrijd")}</strong><small>${fmt(m.date)} · ${esc(m.competition||"")}</small></button></span><div class="row-actions">${btn("Open","ghost",`data-action="openMatch" data-id="${m.id}"`)}${btn("Bewerken","ghost",`data-edit="match" data-id="${m.id}"`)}${btn("PDF","secondary",`data-action="matchPDF" data-id="${m.id}"`)}${btn("Verwijderen","danger",`data-delete="match" data-id="${m.id}"`)}</div></div>`).join("")||`<p class="muted">Nog geen wedstrijden.</p>`)}
 `;
}
function renderTactics(){
 const tactics=data.tactics;return `<div class="toolbar"><div><p class="muted">4-3-3 · 5-3-2 · 4-2-3-1 · 4-4-2</p></div><div>${btn("＋ Tactiek","primary",'data-action="newTactic"')}</div></div>${card("Tactiekbord",`<div class="pitch-wrap"><div class="pitch" id="tacticPitch">${["GK","RB","RCV","LCV","LB","6","8","10","RW","9","LW"].map((p,i)=>`<div class="pitch-slot" style="left:${[50,82,62,38,18,50,68,32,82,50,18][i]}%;top:${[92,75,72,72,75,55,50,50,28,18,28][i]}%">${p}</div>`).join("")}</div><div>${tactics.map(t=>`<div class="list-row"><span><strong>${esc(t.title)}</strong><small>${esc(t.note||"")}</small></span>${btn("Verwijderen","danger",`data-delete="tactic" data-id="${t.id}"`)}</div>`).join("")||`<p class="muted">Maak tactische scenario's aan.</p>`}</div></div>`)}
 `;
}
function renderGameModel(){
 const g=data.gameModel;return card("Spelmodel",`<div class="form-grid">${field("Identiteit",`<textarea data-gm="identity">${esc(g.identity)}</textarea>`)}${field("Basisformatie",`<select data-gm="formation">${data.settings.formationOptions.map(x=>`<option ${x===g.formation?"selected":""}>${x}</option>`).join("")}</select>`)}${field("Opbouw",`<textarea data-gm="buildUp">${esc(g.buildUp)}</textarea>`)}${field("Pressing",`<textarea data-gm="pressing">${esc(g.pressing)}</textarea>`)}${field("Transitie na balverlies",`<textarea data-gm="transition">${esc(g.transition)}</textarea>`)}${field("Restverdediging",`<input data-gm="restDefense" value="${esc(g.restDefense)}">`)}</div><div class="button-row">${btn("Spelmodel opslaan","primary",'data-action="saveGM"')}</div><div class="tag-list">${g.coachWords.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div>`);
}
function renderSeason(){return card("Seizoen",`<div class="form-grid">${field("Team",`<input id="teamName" value="${esc(data.team.name)}">`)}${field("Seizoen",`<input id="season" value="${esc(data.team.season)}">`)}${field("Trainingstijd",`<input id="trainingTime" value="${esc(data.team.trainingTime)}">`)}</div><div class="button-row">${btn("Opslaan","primary",'data-action="saveSeason"')}</div>`)}
function renderStats(){
 const starts=data.matches.reduce((n,m)=>n+(m.playerStats||[]).filter(x=>x.selected).length,0),goals=data.matches.reduce((n,m)=>n+(m.scoreHome||0),0);
 return `${card("Statistieken",`<div class="grid kpis"><div class="kpi"><span>Wedstrijden</span><strong>${data.matches.length}</strong></div><div class="kpi"><span>Trainingen</span><strong>${data.trainings.length}</strong></div><div class="kpi"><span>Geselecteerde spelers</span><strong>${starts}</strong></div><div class="kpi"><span>Teamgoals</span><strong>${goals}</strong></div></div>`)}${card("Spelersontwikkeling",data.players.map(p=>`<div class="list-row"><span><strong>${esc(p.name)}</strong><small>${esc(p.position||"")}</small></span><span>${Object.values(p.scores||{}).reduce((a,b)=>a+Number(b||0),0)/5||0}/10</span></div>`).join(""))}`;
}
function renderNotes(){return `<div class="toolbar"><div></div><div>${btn("＋ Notitie","primary",'data-action="newNote"')}</div></div>${card("Coachnotities",data.notes.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(n=>`<div class="note-card"><div class="note-meta"><strong>${esc(n.title)}</strong><span class="tag">${fmt(n.date)}</span></div><p>${esc(n.text)}</p><div class="row-actions">${btn("Bewerken","ghost",`data-edit="note" data-id="${n.id}"`)}${btn("Verwijderen","danger",`data-delete="note" data-id="${n.id}"`)}</div></div>`).join("")||`<p class="muted">Nog geen notities.</p>`)}`;
}
function renderDocuments(){return card("Bronnen",`<p class="muted">Gebruik deze pagina voor bronlinks en coachdocumenten die je zelf aan de app toevoegt.</p><div class="button-row">${btn("＋ Bron","primary",'data-action="newDocument"')}</div>${data.documents.map(d=>`<div class="list-row"><span><strong>${esc(d.title)}</strong><small>${esc(d.url||d.note||"")}</small></span>${btn("Verwijderen","danger",`data-delete="document" data-id="${d.id}"`)}</div>`).join("")}`)}
function renderSettings(){return card("Instellingen",`<div class="button-row">${btn("Backup exporteren","primary",'data-action="export"')} ${btn("Backup importeren","secondary",'data-action="import"')} ${btn("Lokale data wissen","danger",'data-action="wipe"')}</div><p class="muted">Opslag: ${esc(KEY)}. Oude V1/V2-data wordt éénmalig gemigreerd naar deze opslag.</p>`)}
function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="football-coach-backup.json";a.click();URL.revokeObjectURL(a.href)}
function importData(){const i=document.createElement("input");i.type="file";i.accept=".json,application/json";i.onchange=async()=>{const f=i.files[0];if(!f)return;try{data=normalize(JSON.parse(await f.text()));save();render();toast("Backup geïmporteerd")}catch{toast("Backup is ongeldig")}};i.click()}
function wipe(){if(!confirm("Alle lokale Coach-data wissen?"))return;localStorage.removeItem(KEY);data=defaults();save();render()}
function saveSeason(){data.team.name=$("#teamName").value;data.team.season=$("#season").value;data.team.trainingTime=$("#trainingTime").value;save();render();toast("Seizoen opgeslagen")}
function saveGM(){for(const k of ["identity","formation","buildUp","pressing","transition","restDefense"]){const e=$(`[data-gm="${k}"]`);if(e)data.gameModel[k]=e.value}save();toast("Spelmodel opgeslagen")}
function newTactic(){data.tactics.push({id:uid(),title:"Nieuw scenario",note:"",formation:"4-3-3"});save();render()}
function newDocument(){const title=prompt("Titel");if(!title)return;const url=prompt("URL (optioneel)","");data.documents.push({id:uid(),title,url});save();render()}
function newExercise(){openExercise()}
function bindSpecialActions(){
 $$('[data-action="newTraining"]').forEach(b=>b.onclick=openTraining);
 $$('[data-action="newMatch"]').forEach(b=>b.onclick=openMatch);
 $$('[data-action="newPlayer"]').forEach(b=>b.onclick=openPlayer);
 $$('[data-action="newExercise"]').forEach(b=>b.onclick=openExercise);
 $$('[data-action="newNote"]').forEach(b=>b.onclick=openNote);
 $$('[data-action="newTactic"]').forEach(b=>b.onclick=newTactic);
 $$('[data-action="newDocument"]').forEach(b=>b.onclick=newDocument);
 $$('[data-action="saveSeason"]').forEach(b=>b.onclick=saveSeason);
 $$('[data-action="saveGM"]').forEach(b=>b.onclick=saveGM);
 $$('[data-action="export"]').forEach(b=>b.onclick=exportData);
 $$('[data-action="import"]').forEach(b=>b.onclick=importData);
 $$('[data-action="wipe"]').forEach(b=>b.onclick=wipe);
}
const oldBind=bindPage;bindPage=()=>{oldBind();bindSpecialActions();
 $$('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit,b.dataset.id));
 $$('[data-gm]').forEach(e=>e.onchange=()=>{data.gameModel[e.dataset.gm]=e.value});
 $$('[data-pos]').forEach(e=>e.onchange=()=>{const m=data.matches.find(x=>x.id===currentMatchId);const s=m?.playerStats.find(x=>x.playerId===e.dataset.pos);if(s)s.position=e.value;save()});
 $$('[data-min]').forEach(e=>e.onchange=()=>{const m=data.matches.find(x=>x.id===currentMatchId);const s=m?.playerStats.find(x=>x.playerId===e.dataset.min);if(s)s.minutes=+e.value||0;save()});
};

document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;const a=b.dataset.action;if(a==="newTraining")openTraining();else if(a==="newMatch")openMatch();else if(a==="newPlayer")openPlayer();else if(a==="newExercise")openExercise();else if(a==="newNote")openNote();else if(a==="newTactic")newTactic();else if(a==="newDocument")newDocument();else if(a==="saveSeason")saveSeason();else if(a==="saveGM")saveGM();else if(a==="export")exportData();else if(a==="import")importData();else if(a==="wipe")wipe();});
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
