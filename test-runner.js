#!/usr/bin/env node
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import assert from 'assert';

const scriptPath = path.resolve('dist/script.js');
const code = fs.readFileSync(scriptPath, 'utf8');

let passed = 0, failed = 0;
function test(name, fn){
  try{
    fn();
    console.log('✓', name);
    passed++;
  }catch(err){
    failed++;
    console.error('✗', name);
    console.error(err && err.stack || err);
  }
}

// Tests

test('clicking ping updates #out and logs', ()=>{
  const handlers = {};
  const out = { textContent: '' };
  const ping = { addEventListener: (ev, handler)=>{ handlers[ev]=handler; } };
  const consoleLogs = [];
  const sandbox = {
    document: { getElementById: id => id==='ping'? ping : id==='out'? out : undefined },
    console: { log: (...args)=> consoleLogs.push(args.join(' ')) },
    Date: class extends Date { toLocaleTimeString(){ return '12:34:56'; } },
    window: {}
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: scriptPath });
  const handler = handlers['click'];
  if(!handler) throw new Error('no click handler registered');
  handler();
  assert.strictEqual(out.textContent, 'Pong! 12:34:56');
  if(!consoleLogs.some(s=>s.includes('ping -> pong'))) throw new Error('expected console log');
});

test('no #ping element does not throw', ()=>{
  const out = { textContent: ''};
  const sandbox = {
    document: { getElementById: id => id==='out'? out : undefined },
    console: { log: ()=>{} },
    Date: class extends Date { toLocaleTimeString(){ return '00:00:00'; } },
    window: {}
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: scriptPath });
});

console.log(`${passed} passed, ${failed} failed`);
if(failed>0) process.exitCode=1;
