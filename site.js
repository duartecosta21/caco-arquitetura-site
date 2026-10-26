(function(){
var d=document,w=window,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var rm=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var desk=w.matchMedia('(min-width:981px)');
/* header + menu */
var hd=$('.hd'),mb=$('.mb'),nav=$('#nav');
function closeNav(){mb.setAttribute('aria-expanded','false');nav.classList.remove('open')}
mb.addEventListener('click',function(){var o=mb.getAttribute('aria-expanded')!=='true';mb.setAttribute('aria-expanded',o);nav.classList.toggle('open',o)});
$$('a',nav).forEach(function(a){a.addEventListener('click',closeNav)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav()});
/* reveals */
var rv=$$('.rv,.rc');
if('IntersectionObserver' in w&&!rm){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
 rv.forEach(function(el){io.observe(el)});
}else{rv.forEach(function(el){el.classList.add('in')})}
/* parallax leve (so desktop, sem movimento reduzido) */
var par=$$('[data-par]'),ticking=false;
function frame(){
 ticking=false;var vh=w.innerHeight,y=w.scrollY;
 hd.classList.toggle('sc',y>10);
 if(par.length&&desk.matches&&!rm){
  for(var i=0;i<par.length;i++){var el=par[i],r=el.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)continue;
   var k=parseFloat(el.getAttribute('data-par'))||.06,c=(r.top+r.height/2-vh/2);el.style.transform='translate3d(0,'+(-c*k).toFixed(1)+'px,0)'}
 }
 /* linha do processo */
 var tl=$('#tl');
 if(tl){var tr=tl.getBoundingClientRect(),p=(vh*.6-tr.top)/tr.height;p=Math.max(0,Math.min(1,p));tl.style.setProperty('--p',p.toFixed(3));
  $$('li',tl).forEach(function(li){var lr=li.getBoundingClientRect();li.classList.toggle('on',lr.top<vh*.62)})}
 /* botao fixo no celular */
 var fab=$('.fab'),hero=$('.hero'),ct=$('#contato');
 if(fab){var heroEnd=hero.offsetTop+hero.offsetHeight*.7,cr=ct.getBoundingClientRect();
  fab.classList.toggle('show',y>heroEnd&&!(cr.top<vh*.8))}
}
function req(){if(!ticking){ticking=true;w.requestAnimationFrame(frame)}}
w.addEventListener('scroll',req,{passive:true});w.addEventListener('resize',req);frame();
/* galeria: filtro */
var items=$$('.it'),fl=$$('.flt button');
fl.forEach(function(b){b.addEventListener('click',function(){
 fl.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
 var f=b.getAttribute('data-f'),n=0;
 items.forEach(function(it){var show=f==='todos'||it.getAttribute('data-c')===f;it.hidden=!show;
  if(show&&!rm){it.classList.remove('inn');void it.offsetWidth;it.style.animationDelay=(n++*0.04)+'s';it.classList.add('inn')}});
})});
/* lightbox */
var lb=$('#lb'),lbi=$('#lb-img',lb),lbc=$('#lb-cap',lb),cur=0,last=null;
function vis(){return items.filter(function(i){return!i.hidden})}
function show(n){var v=vis();if(!v.length)return;cur=(n+v.length)%v.length;var it=v[cur];
 lbi.src=it.getAttribute('data-full');lbi.alt=it.getAttribute('data-alt');
 lbc.textContent=it.getAttribute('data-cap')+' ('+it.getAttribute('data-k')+')';
 var f=lb.querySelector('figure');f.style.animation='none';void f.offsetWidth;f.style.animation=''}
function open(it){last=it;lb.classList.add('open');d.body.style.overflow='hidden';show(vis().indexOf(it));$('.lb-x',lb).focus()}
function close(){lb.classList.remove('open');d.body.style.overflow='';lbi.removeAttribute('src');if(last)last.focus()}
items.forEach(function(it){it.addEventListener('click',function(){open(it)})});
$('.lb-x',lb).addEventListener('click',close);$('.lb-p',lb).addEventListener('click',function(){show(cur-1)});$('.lb-n',lb).addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)close()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
 if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1);
 else if(e.key==='Tab'){var f=$$('button',lb),i=f.indexOf(d.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));sx=null});
/* antes e depois */
var ba=$('.ba-box');
$$('.seg button').forEach(function(b){b.addEventListener('click',function(){
 $$('.seg button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});ba.setAttribute('data-s',b.getAttribute('data-s'))})});
/* servicos: abas e pacotes */
var tabs=$$('[role=tab]'),pns=$$('.pn');
function selTab(t,focus){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});
 pns.forEach(function(p){var on=p.id===t.getAttribute('aria-controls');p.hidden=!on;if(on&&!rm){p.style.animation='none';void p.offsetWidth;p.style.animation='fadeup .6s both'}});if(focus)t.focus()}
tabs.forEach(function(t,i){t.addEventListener('click',function(){selTab(t)});
 t.addEventListener('keydown',function(e){var j=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:-1;if(j>=0){e.preventDefault();selTab(tabs[(j+tabs.length)%tabs.length],true)}})});
pns.forEach(function(p){var bs=$$('.pk button',p),inc=$('.inc',p),data=JSON.parse($('script[type="application/json"]',p).textContent);
 function pick(k){var o=data[k];bs.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-k')===k)});
  var h='<h3>'+o.t+'</h3><p class="sub">'+o.s+'</p><ul>'+o.i.map(function(x,n){var a=x.split('|');return'<li style="animation-delay:'+(rm?0:n*.04)+'s">'+a[0]+(a[1]?'<small>'+a[1]+'</small>':'')+'</li>'}).join('')+'</ul>';
  inc.innerHTML=h;if(!rm){inc.classList.remove('sw');void inc.offsetWidth;inc.classList.add('sw')}}
 bs.forEach(function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-k'))})});pick(bs[0].getAttribute('data-k'))});
/* formulario -> whatsapp (mensagem revisavel, nada e enviado pelo site) */
var f=$('#fm');
f.addEventListener('submit',function(e){e.preventDefault();
 var n=f.nome.value.trim(),t=(f.querySelector('input[name=tipo]:checked')||{}).value||'',l=f.local.value.trim();
 var m='Olá, Júnior! '+(n?'Meu nome é '+n+'. ':'')+'Vim pelo site da Caco Arquitetura'+(t?' e quero conversar sobre um projeto: '+t:' e quero conversar sobre um projeto')+'.'+(l?' Fica em '+l+'.':'');
 w.open('https://wa.me/'+f.getAttribute('data-wa')+'?text='+encodeURIComponent(m),'_blank','noopener')});
})();
