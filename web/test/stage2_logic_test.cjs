const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sumeeko-stage2-'));
let count = 0;
try {
  cp.execFileSync('tsc', ['--target', 'ES2020', '--module', 'commonjs', '--skipLibCheck', '--outDir', tmp,
    path.join(root, 'src/app/appdata.ts'), path.join(root, 'src/app/navigation.ts')], {stdio:'pipe'});
  const data = require(path.join(tmp, 'appdata.js'));
  const nav = require(path.join(tmp, 'navigation.js'));
  const test=(name,condition)=>{assert.ok(condition,name);console.log('PASS',name);count++};
  const ids = ['T1','T2','T3','T4','T5'];
  test('Five distinct tasks are present', ids.every(id=>data.TASKS.find(t=>t.id===id)));
  for(const id of ids){
    const task=data.TASKS.find(t=>t.id===id), machine=data.MACHINES.find(m=>m.id===task.machine);
    const params=Object.fromEntries(machine.params.map(p=>[p.id,p.def]));
    test(`${id}: valid part in choices`,task.part.opts.includes(task.part.ok));
    test(`${id}: default params in safe bounds`,machine.params.every(p=>p.def>=p.safe[0]&&p.def<=p.safe[1]));
    test(`${id}: passing quality measurement in spec`,task.measure(params)>=task.spec.lo&&task.measure(params)<=task.spec.hi);
    test(`${id}: every abnormal check has corrective action`,task.checks.filter(c=>c.bad).every(c=>!!c.fix));
  }
  test('T4 AOI threshold and light pass leak gate',(()=>{const m=data.MACHINES.find(m=>m.id==='M06'), p=Object.fromEntries(m.params.map(x=>[x.id,x.def]));return p.th<=0.55&&p.lux>=65;})());
  test('Back task step 0 exits to parent',nav.previousTaskStep(0)===null);
  for (let step=1;step<=4;step++) test(`Back task step ${step}->${step-1}`, nav.previousTaskStep(step)===step-1);
  test('Back task result 5 exits without duplicate save',nav.previousTaskStep(5)===null);
  // Geometric collision check for on-canvas labels (short IDs only), world-space rectangles.
  const iso=(x,y)=>({x:400+(x-y)*150,y:120+(x+y)*82});
  const markers=[];
  for(const c of data.CELLS){
    const p=iso(c.x,c.y);
    markers.push({id:c.id,x:p.x-20,y:p.y+35,w:40,h:23});
    for(let k=0;k<c.machines.length;k++){
      const ox=c.machines.length>1?(k?40:-40):0;
      markers.push({id:c.machines[k],x:p.x+ox-24,y:p.y+3,w:48,h:22});
    }
  }
  const collides=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const collisions=[];
  for(let a=0;a<markers.length;a++) for(let b=a+1;b<markers.length;b++)if(collides(markers[a],markers[b]))collisions.push(`${markers[a].id}/${markers[b].id}`);
  test('No overlapping SVG ID markers',collisions.length===0);
  for(const [w,h] of [[320,568],[360,640],[390,844],[412,915],[915,412],[1024,768]]){
    const box=nav.factoryViewBox(w,h,1);
    const near=(x,y)=>x>=box.x&&x<=box.x+box.width&&y>=box.y&&y<=box.y+box.height;
    test(`${w}x${h} overview contains all 9 cells`,data.CELLS.every(c=>{const p=iso(c.x,c.y);return near(p.x-108,p.y-58)&&near(p.x+108,p.y+58)}));
    test(`${w}x${h} viewBox matches viewport aspect`,Math.abs(box.width/box.height-w/h)<1e-8);
  }
  console.log(`RESULT ${count}/${count} PASS`);
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
