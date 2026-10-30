// Shared by every page: back-to-top, nav shadow, scroll reveal.
(function(){
  var top = document.querySelector('.totop');
  if (top) top.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  var nav = document.querySelector('.nav');
  function onScroll(){ if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile menu: a toggle button that opens the nav links as a panel.
  if (nav) {
    var list = nav.querySelector('ul'), fr = document.documentElement.lang !== 'en';
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'burger';
    btn.setAttribute('aria-expanded', 'false');
    list.id = list.id || 'nav-links';
    btn.setAttribute('aria-controls', list.id);
    btn.innerHTML = '<i aria-hidden="true"></i><span>Menu</span>';
    nav.querySelector('.wrap').insertBefore(btn, list);
    document.documentElement.classList.add('has-burger');
    function setOpen(o){ nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); btn.lastChild.textContent = o ? (fr ? 'Fermer' : 'Close') : 'Menu'; }
    btn.addEventListener('click', function(){ setOpen(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && nav.classList.contains('open')){ setOpen(false); btn.focus(); } });
    document.addEventListener('click', function(e){ if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
    list.addEventListener('click', function(e){ if (e.target.closest('a')) setOpen(false); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', function(m){ if (m.matches) setOpen(false); });
  }


  // Carousels: prev/next buttons + counter, driven by the scroll position.
  document.querySelectorAll('.carousel').forEach(function(c){
    var track = c.querySelector('.car-track'), n = track.children.length;
    var prev = c.querySelector('.prev'), next = c.querySelector('.next'), count = c.querySelector('.car-count');
    function idx(){ return Math.round(track.scrollLeft / track.clientWidth); }
    function update(){ var i = idx(); count.textContent = (i + 1) + ' / ' + n; prev.disabled = i === 0; next.disabled = i === n - 1; }
    function go(d){ track.scrollTo({left:(idx() + d) * track.clientWidth}); }
    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    track.addEventListener('keydown', function(e){ if (e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); } if (e.key === 'ArrowRight'){ e.preventDefault(); go(1); } });
    track.addEventListener('scroll', function(){ window.requestAnimationFrame(update); }, {passive:true});
    update();
  });

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Groups whose children appear one after another.
  var groups = ['.sec-head', '.case', '.next-card', '.fv-head', '.stats', '.feat', '.fv-grid', '.duo', '.apps', '.addie', '.timeline', '.story', '.skills', '.contact', '.foot-top'];
  var items = [];
  groups.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(g){
      var kids = g.matches('.stats,.feat,.fv-grid,.duo,.apps,.addie,.timeline,.skills,.foot-top') ? g.children : [g];
      Array.prototype.forEach.call(kids, function(el, i){
        el.classList.add('rv');
        el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms');
        items.push(el);
      });
    });
  });

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
  items.forEach(function(el){ io.observe(el); });
})();
