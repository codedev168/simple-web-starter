document.getElementById('ping')?.addEventListener('click',function(){
  const out=document.getElementById('out');
  out.textContent = 'Pong! ' + new Date().toLocaleTimeString();
  console.log('Simple Web Starter: ping -> pong');
});
