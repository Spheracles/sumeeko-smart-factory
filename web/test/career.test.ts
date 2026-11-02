import { newGame, applyEff, gainSkills, promotionCheck } from '../src/state';
import { CHAPTERS, CAREERS } from '../src/data';
for (const score of [60, 75, 90]) {
let g:any = newGame({name:'t',look:0,coat:'#3a7bd5',edu:'fresh',talent:'hands',aspiration:'ai'}, 'story');
let trainWeeks=0; const log:string[]=[];
for (const ch of CHAPTERS.slice(0,14)) {
  // ensure pos
  let guard=0;
  while (g.pos < ch.requiredPos && guard++<60) {
    const pc = promotionCheck(g, g.pos+1);
    if (pc.ok) { g.pos++; g.freePts+=2; continue; }
    // spend free points on first missing skill, else train
    const miss = pc.items.find(i=>!i.ok)!;
    const m = Object.entries(CAREERS[g.pos+1].req.skills||{}).find(([k,v])=>g.skills[k]<(v as number));
    if (m && g.freePts>0) { g.freePts--; g.skills[m[0]]+=3; continue; }
    if (m) { g.skills[m[0]]+=5; trainWeeks+=2; continue; }
    const t = Object.entries(CAREERS[g.pos+1].req.trust||{}).find(([k,v])=>g.trust[k]<(v as number));
    if (t || miss.label.includes('平均信任')) { const k = t? t[0] : Object.entries(g.trust).sort((a:any,b:any)=>a[1]-b[1])[0][0]; g.trust[k]+=4; trainWeeks+=2; continue; }
    log.push(`STUCK ch${ch.id} need ${miss.label}`); break;
  }
  if (g.pos < ch.requiredPos) { log.push('FAIL at '+ch.id); break; }
  g = applyEff(g, ch.dilemma.options[0].effect);
  g.funds += ch.reward.funds; g.freePts += 1;
  for (const [k,v] of Object.entries(ch.reward.trust)) g.trust[k]+=v;
  g.skills = gainSkills(g, ch.reward.xp, 0.5+score/200);
  if (ch.id===11) g.skills = gainSkills(g, {it:12, sys:3}, score/100); // 3 AI projects
  if (ch.reward.cert) g.certs.push(ch.reward.cert);
  if (ch.game==='survival') g = applyEff(g, {trust:{it:3,quality:1,mgmt:3}});
  g.done[ch.id]={score, best:score, tries:1};
  if (ch.reward.promoteTo!==undefined) while (g.pos<ch.reward.promoteTo && promotionCheck(g,g.pos+1).ok) { g.pos++; g.freePts+=2; }
}
// final
let guard=0; while (g.pos<9 && guard++<80){ const pc=promotionCheck(g,g.pos+1); if(pc.ok){g.pos++;continue;} const m=Object.entries(CAREERS[g.pos+1].req.skills||{}).find(([k,v])=>g.skills[k]<(v as number)); if(m){ if(g.freePts>0){g.freePts--;g.skills[m[0]]+=3;} else {g.skills[m[0]]+=5;trainWeeks+=2;} continue;} const k=Object.entries(g.trust).sort((a:any,b:any)=>a[1]-b[1])[0][0]; g.trust[k]+=4; trainWeeks+=2; }
console.log('score',score,'pos',g.pos,'trainWeeks',trainWeeks,'skills',JSON.stringify(g.skills),'trust',JSON.stringify(g.trust), log.join(';'));
}
