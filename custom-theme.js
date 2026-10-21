/* Theme Studio: saved on this browser, across every page */
(()=>{
 const KEY='learninghub-custom-accent';
 const presets=[['Ocean','#397eaa'],['Emerald','#15876e'],['Violet','#7951b7'],['Rose','#be547b'],['Amber','#b46b13'],['Slate','#475569']];
 function valid(v){return /^#[0-9a-fA-F]{6}$/.test(v||'')}
 function shade(hex,amount){const n=parseInt(hex.slice(1),16);let rgb=[(n>>16)&255,(n>>8)&255,n&255].map(x=>Math.max(0,Math.min(255,Math.round(x*amount))));return '#'+rgb.map(x=>x.toString(16).padStart(2,'0')).join('')}
 function apply(v){if(!valid(v))return;document.documentElement.style.setProperty('--user-accent',v);document.documentElement.style.setProperty('--user-dark',shade(v,.58));document.documentElement.style.setProperty('--user-soft',shade(v,1.15));}
 let saved;try{saved=localStorage.getItem(KEY)}catch(e){}apply(valid(saved)?saved:'#397eaa');
 document.addEventListener('DOMContentLoaded',()=>{
 const trigger=document.createElement('button');trigger.className='theme-studio-trigger';trigger.type='button';trigger.textContent='🎨 Change colors';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','theme-studio');
 const panel=document.createElement('section');panel.id='theme-studio';panel.className='theme-studio';panel.hidden=true;panel.setAttribute('aria-label','Website color settings');
 const h=document.createElement('h3');h.textContent='Make it yours';panel.appendChild(h);
 const p=document.createElement('p');p.textContent='Choose a style that feels right for you. Your colors stay saved on this device.';panel.appendChild(p);
 const swatches=document.createElement('div');swatches.className='theme-presets';presets.forEach(([name,color])=>{const b=document.createElement('button');b.type='button';b.className='theme-swatch';b.title=name;b.setAttribute('aria-label',name+' color theme');b.style.background=color;b.addEventListener('click',()=>save(color));swatches.appendChild(b)});panel.appendChild(swatches);
 const label=document.createElement('label');label.textContent='Choose any color';const input=document.createElement('input');input.type='color';input.value=valid(saved)?saved:'#397eaa';input.setAttribute('aria-label','Custom accent color');input.addEventListener('input',()=>save(input.value));label.appendChild(input);panel.appendChild(label);
 const actions=document.createElement('div');actions.className='theme-studio-actions';const reset=document.createElement('button');reset.textContent='Reset default';reset.type='button';reset.addEventListener('click',()=>save('#397eaa'));const close=document.createElement('button');close.textContent='Done';close.type='button';close.addEventListener('click',()=>toggle(false));actions.append(reset,close);panel.appendChild(actions);
 function save(color){apply(color);input.value=color;try{localStorage.setItem(KEY,color)}catch(e){}}
 function toggle(open){panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open))}
 trigger.addEventListener('click',()=>toggle(panel.hidden));document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
 document.body.append(panel,trigger);
 });
})();
