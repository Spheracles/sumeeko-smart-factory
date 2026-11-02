import { baseFactory, simulateWeek, evaluatePhoenix, PHOENIX_OPTIONS, applyEffect } from '../src/sim';
const b = simulateWeek(baseFactory());
console.log('BASE good', b.goodTotal|0, 'otif', b.otif.toFixed(3), 'oee', b.oee.toFixed(3), 'bott', b.bottleneck, 'ppm', b.ppm|0, 'cost/u', b.costPerGood.toFixed(2), 'kWh/u', b.energyPerUnit.toFixed(3), 'lead', b.leadDays.toFixed(2), 'fat', b.fatigue);
console.log(b.stations.map(s=>`${s.id}:${s.load.toFixed(2)}/${s.oee.toFixed(2)}`).join(' '));
// optical-only improvement should not help much
const o = simulateWeek(applyEffect(baseFactory(), {st:{optical:{machines:1}}}));
console.log('optical x2 good', o.goodTotal|0);
const t = simulateWeek(applyEffect(baseFactory(), {st:{thread:{machines:1}}}));
console.log('thread x2 good', t.goodTotal|0, 'bott', t.bottleneck);
const e0 = evaluatePhoenix([]);
console.log('PHX base', e0.before.goodTotal|0, e0.before.otif.toFixed(3), e0.before.oee.toFixed(3), e0.before.costPerGood.toFixed(2), e0.before.ppm|0, e0.before.bottleneck);
const sets = [['smed','tpm','source','balance','heatBatch','energy','safety','data'], ['newRoller','safety'], ['vision','tpm','safety'], ['overtime','safety'], ['smed','tpm','source','safety','heatBatch','energy','supplier','data','balance']];
for (const s of sets){ const e=evaluatePhoenix(s); console.log(s.join(','), 'pass',e.passed, e.targets.map(x=>(x.ok?'✓':'✗')+x.id+':'+x.val).join(' '), 'roi', e.roi.toFixed(2), 'score', e.score, 'bott', e.after.bottleneck);}
// brute force count feasible combos
let feas=0, n=0; const ids=PHOENIX_OPTIONS.map(o=>o.id);
for(let m=0;m<(1<<ids.length);m++){ const s=ids.filter((_,i)=>m&(1<<i)); if(s.length>9) continue; n++; const e=evaluatePhoenix(s); if(e.passed===7){feas++; if(feas<4) console.log('FEAS', s.join(','));}}
console.log('feasible', feas, 'of', n);
