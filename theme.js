(function(){
  const KEY = 'learninghub-theme';
  const root = document.documentElement;
  function preferred(){
    try { const saved=localStorage.getItem(KEY); if(saved==='light'||saved==='dark') return saved; } catch(e) {}
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncButton(){
    const dark=root.dataset.theme==='dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
      btn.setAttribute('aria-pressed',String(dark));
      const icon=btn.querySelector('.theme-toggle-icon');
      const label=btn.querySelector('.theme-toggle-label');
      if(icon)icon.textContent=dark?'☀':'☾';
      if(label)label.textContent=dark?'Light mode':'Dark mode';
    });
  }
  root.dataset.theme=preferred();
  document.addEventListener('DOMContentLoaded',()=>{
    syncButton();
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
      const next=root.dataset.theme==='dark'?'light':'dark';
      root.dataset.theme=next;
      try{localStorage.setItem(KEY,next);}catch(e){}
      syncButton();
    }));
  });
  window.addEventListener('storage',e=>{if(e.key===KEY){root.dataset.theme=preferred();syncButton();}});
})();
