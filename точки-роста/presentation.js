/* Рендерер слайдов и навигация — Точки роста */

function md(s, mode){
  if(!s) return '';
  var out = s.replace(/\{\{(.+?)\}\}/g, function(m, sym){
    var cls = 'mega-sym';
    if(sym === '+') cls += ' plus';
    else if(sym === '–' || sym === '-') cls += ' minus';
    else cls += ' emoji';
    return '<span class="'+cls+'">'+sym+'</span>';
  });
  // В заголовках **жирное** превращаем в маркерную обводку
  if(mode === 'head'){
    return out.replace(/\*\*(.+?)\*\*/g,'<span class="mark-ring">$1</span>');
  }
  return out.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
}

function renderBlock(b){
  switch(b.t){
    case 'badge':
      return '<div class="badge badge-'+(b.color||'dark')+'">'+md(b.v)+'</div>';
    case 'h1': return '<h1>'+md(b.v,'head')+'</h1><div class="divider"></div>';
    case 'h2': return '<h2>'+md(b.v,'head')+'</h2>';
    case 'h3': return '<h3>'+md(b.v)+'</h3>';
    case 'p': return '<p>'+md(b.v)+'</p>';
    case 'boldline': return '<div class="boldline"><strong>'+md(b.v)+'</strong></div>';
    case 'ctaButton': return '<div class="cta-pill">'+md(b.v)+'<span class="arrow">→</span></div>';
    case 'small': return '<p class="small">'+md(b.v)+'</p>';
    case 'divider': return '<div class="divider"></div>';

    case 'list':
      return '<ul class="items'+(b.bullet===false?' no-dot':'')+'">'
        +b.v.map(function(i){return '<li>'+md(i)+'</li>';}).join('')+'</ul>';

    case 'checklist':
      return '<div class="checklist">'+b.v.map(function(i){
        var sub = i.sub ? '<ul class="items" style="margin-top:7px;margin-bottom:0">'
          +i.sub.map(function(s){return '<li>'+md(s)+'</li>';}).join('')+'</ul>' : '';
        return '<div class="check-item"><div class="check-ico">✓</div>'
          +'<div class="check-text">'+md(i.text)+sub+'</div></div>';
      }).join('')+'</div>';

    case 'groups':
      return '<div class="groups-row">'+b.v.map(function(g){
        var sub = g.sub ? '<ul class="items" style="margin:0">'
          +g.sub.map(function(s){return '<li>'+md(s)+'</li>';}).join('')+'</ul>' : '';
        return '<div class="group-block"><div class="group-lead">'+md(g.lead)+'</div>'+sub+'</div>';
      }).join('')+'</div>';

    case 'numbered':
      return '<div class="num-list">'+b.v.map(function(i,idx){
        return '<div class="num-item"><div class="num-circle">'+(idx+1)+'</div>'
          +'<div class="num-text">'+md(i)+'</div></div>';
      }).join('')+'</div>';

    case 'quote':
      return '<div class="quote-block"><p>'+md(b.v)+'</p>'
        +(b.by?'<div class="by">— '+md(b.by)+'</div>':'')+'</div>';

    case 'result':
      return '<div class="result-block"><p>'+md(b.v)+'</p>'
        +(b.by?'<div class="by">'+md(b.by)+'</div>':'')+'</div>';

    case 'card':
      return '<div class="card-generic"><div class="label">'+md(b.label)+'</div>'
        +'<h3 style="margin-bottom:5px">'+md(b.title)+'</h3>'
        +'<p style="margin-bottom:0">'+md(b.v)+'</p></div>';

    case 'poll':
      return '<div class="tag-row">'+b.v.map(function(o){
        return '<span class="tag">'+md(o)+'</span>';
      }).join('')+'</div>';

    case 'price':
      var feats = '<ul class="items">'+b.features.map(function(f){
        return '<li>'+md(f)+'</li>';
      }).join('')+'</ul>';
      var strikeRows = b.rows.filter(function(r){return !r.final;});
      var finalRow = b.rows.filter(function(r){return r.final;})[0];
      var strikeHtml = strikeRows.map(function(r){
        return '<div class="price-strike">'+md(r.label)+': <s>'+md(r.val)+'</s></div>';
      }).join('');
      var finalHtml = finalRow
        ? '<div class="price-hero"><span class="price-hero-label">'+md(finalRow.label)+'</span>'
          +'<span class="price-hero-val">'+md(finalRow.val)+'</span></div>'
        : '';
      return '<div class="price-card"><div class="tier-name">'+md(b.name)+'</div>'
        +feats+'<div class="price-bottom">'+strikeHtml+finalHtml+'</div></div>';

    case 'illus':
      var illusStyle = b.size ? ' style="max-height:'+b.size+'"' : '';
      return '<div class="illus-wrap"><img class="illus-img"'+illusStyle+' src="'+b.v+'" alt=""></div>';

    case 'photos':
      var photoCls = 'slide-photo' + (b.contain ? ' photo-contain' : '');
      var photoStyle = (b.objPos||b.size)
        ? ' style="'+(b.size?'max-height:'+b.size+';':'')+(b.objPos?'object-position:'+b.objPos:'')+'"' : '';
      return '<div class="photo-row">'+b.v.map(function(src){
        return '<img class="'+photoCls+'"'+photoStyle+' src="'+src+'" alt="">';
      }).join('')+'</div>';

    case 'photocols':
      var colRight = '';
      if (b.tag) colRight += '<div class="badge">'+md(b.tag)+'</div>';
      if (b.h) colRight += '<h1 style="font-size:clamp(21px,2.5vw,36px)">'+md(b.h,'head')+'</h1>';
      if (b.p) colRight += '<p>'+md(b.p)+'</p>';
      if (b.list) colRight += '<ul class="items">'+b.list.map(function(item){
        return '<li>'+md(item)+'</li>';
      }).join('')+'</ul>';
      if (b.quote) colRight += '<div class="quote-block"><p>'+md(b.quote.v)+'</p>'
        +'<div class="by">— '+b.quote.by+'</div></div>';
      if (b.small) colRight += '<p class="small">'+md(b.small)+'</p>';
      var imgStyle = b.photoW ? ' style="width:'+b.photoW+'"' : '';
      var imgCls = 'photocols-img' + (b.imgContain ? ' img-contain' : '');
      var photocolsCls = 'photocols' + (b.photoRight ? ' photo-right' : '');
      var listStyle = b.fontSize ? ' style="font-size:'+b.fontSize+'"' : '';
      return '<div class="'+photocolsCls+'"><img class="'+imgCls+'"'+imgStyle+' src="'+b.photo+'" alt="">'
        +'<div class="photocols-list"'+listStyle+'>'+colRight+'</div></div>';

    case 'testimonial':
      return '<div class="testimonial-card"><div class="star">'+md(b.tag)+'</div>'
        +'<div class="name">'+md(b.name)+'</div><div class="meta">'+md(b.meta)+'</div>'
        +'<div class="quote-block" style="margin:0"><p>'+md(b.v)+'</p></div></div>';

    case 'segment':
      var bodyChips = b.body.split(/,\s*/).map(function(x){
        return '<span class="seg-chip body">'+md(x)+'</span>';
      }).join('');
      var psycheChips = b.psyche.split(/,\s*/).map(function(x){
        return '<span class="seg-chip psyche">'+md(x)+'</span>';
      }).join('');
      return '<div class="segment-card"><div class="big-num">'+md(b.num)+'</div><div class="card-body">'
        +'<h3>'+md(b.name.replace(/^\d+\.\s*/,''))+'</h3><p>'+md(b.cause)+'</p>'
        +'<div class="segment-two">'
          +'<div class="col"><h4>Тело</h4><div class="seg-chips">'+bodyChips+'</div></div>'
          +'<div class="col"><h4>Психика</h4><div class="seg-chips">'+psycheChips+'</div></div>'
        +'</div><p class="seg-resolve">'+md(b.resolve)+'</p></div></div>';

    case 'research':
      return '<div class="research-card"><div class="big-num">'+md(b.num)+'</div><div class="card-body">'
        +'<div class="cite">'+md(b.cite)+'</div><h4>'+md(b.title)+'</h4>'
        +'<p class="finding">'+md(b.v)+'</p><div class="doi">'+md(b.doi)+'</div></div></div>';

    case 'scientists':
      return '<div class="sci-row">'+b.v.map(function(s){
        var initials = s.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2);
        var imgHtml = s.img
          ? '<img src="'+s.img+'" alt="'+s.name+'" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'
            +'<div class="sci-init" style="display:none">'+initials+'</div>'
          : '<div class="sci-init">'+initials+'</div>';
        return '<div class="sci-card"><div class="sci-avatar">'+imgHtml+'</div>'
          +'<div class="sci-name">'+s.name+'</div><div class="sci-years">'+s.years+'</div></div>';
      }).join('')+'</div>';

    case 'qcards':
      return '<div class="qcard-row">'+b.v.map(function(item,i){
        return '<div class="qcard"><div class="qcard-left"><div class="qcard-num">'+(i+1)+'</div>'
          +'<div class="qcard-icon">'+item.icon+'</div></div>'
          +'<div class="qcard-text">'+md(item.q)+'</div></div>';
      }).join('')+'</div>';

    default: return '';
  }
}

function renderSlide(s, idx){
  var cls = 'slide';
  if(s.bg==='cta') cls+=' cta-slide';
  else if(s.bg==='orange') cls+=' surf-c';
  else if(s.bg==='case') cls+=' surf-b';
  else if(idx%2===1) cls+=' surf-b';
  if(s.center) cls+=' center-slide';

  var head = '<div class="hd">'
    +'<div class="hd-num">'+(idx+1)+'</div>'
    +'<div class="hd-chip">'+s.sec+'</div>'
    +'<div class="brand">Точки роста · МИОТ</div>'
  +'</div>';

  var body = '<div class="scroll-content'+(s.center?' center':'')+'">'
    + s.blocks.map(renderBlock).join('')
  +'</div>';

  var bar = '<div class="progress-bar"><i id="progress-'+idx+'"></i></div>';

  return '<div class="'+cls+'" data-slide="'+(idx+1)+'">'+head+body+bar+'</div>';
}

// ── Сборка сцены ──
var stage = document.getElementById('stage');
stage.innerHTML = SLIDES.map(renderSlide).join('');

// ── Меню ──
var menuList = document.getElementById('menuList');
var lastSec = null;
var menuHtml = '';
SLIDES.forEach(function(s, idx){
  if(s.sec !== lastSec){
    menuHtml += '<div class="menu-sec">'+s.sec+'</div>';
    lastSec = s.sec;
  }
  menuHtml += '<div class="menu-item" data-idx="'+idx+'" onclick="goTo('+(idx+1)+');closeMenu()">'
    +'<div class="menu-num">'+(idx+1)+'</div>'
    +'<div class="menu-label">'+s.nav+'</div>'
  +'</div>';
});
menuList.innerHTML = menuHtml;

// ── Навигация ──
var slideEls = document.querySelectorAll('.slide');
var menuItems = document.querySelectorAll('.menu-item');
var total = slideEls.length;
var current = 1;

function fitContent(slide){
  var sc = slide.querySelector('.scroll-content');
  if(!sc) return;
  sc.style.transform = '';
  sc.style.transformOrigin = 'top left';
  sc.style.width = '';
  if(sc.scrollHeight > sc.clientHeight + 8){
    var ratio = sc.clientHeight / sc.scrollHeight;
    var minScale = window.innerWidth <= 900 ? 0.45 : 0.48;
    var scale = Math.max(ratio, minScale);
    sc.style.transform = 'scale('+scale.toFixed(3)+')';
    sc.style.width = (100/scale).toFixed(1)+'%';
  }
}

function goTo(n){
  if(n < 1 || n > total) return;
  slideEls[current-1].classList.remove('active');
  slideEls[current-1].classList.add('exit-left');
  setTimeout(function(){ slideEls[current-1].classList.remove('exit-left'); }, 400);
  menuItems[current-1].classList.remove('active');
  current = n;
  slideEls[current-1].classList.add('active');
  menuItems[current-1].classList.add('active');
  menuItems[current-1].scrollIntoView({block:'nearest', behavior:'smooth'});
  document.getElementById('menuCounter').textContent = current + ' / ' + total;
  document.getElementById('prev').disabled = current === 1;
  document.getElementById('next').disabled = current === total;
  fitContent(slideEls[current-1]);
  var pct = (current/total*100).toFixed(1);
  var prog = slideEls[current-1].querySelector('.progress-bar i');
  if(prog) prog.style.width = pct + '%';
}
function nextSlide(){ goTo(current+1); }
function prevSlide(){ goTo(current-1); }

function openMenu(){ document.getElementById('menuBackdrop').classList.add('open'); }
function closeMenu(){ document.getElementById('menuBackdrop').classList.remove('open'); }
document.getElementById('menuToggle').addEventListener('click', function(){
  document.getElementById('menuBackdrop').classList.toggle('open');
});
document.getElementById('menuBackdrop').addEventListener('click', function(e){
  if(e.target === this) closeMenu();
});

document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){ closeMenu(); return; }
  if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){ e.preventDefault(); nextSlide(); }
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){ e.preventDefault(); prevSlide(); }
});

var tx = 0;
stage.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
stage.addEventListener('touchend', function(e){
  var dx = tx - e.changedTouches[0].clientX;
  if(Math.abs(dx) > 40){ dx > 0 ? nextSlide() : prevSlide(); }
}, {passive:true});

slideEls.forEach(function(s){ fitContent(s); });
goTo(1);

var resizeTimer;
window.addEventListener('resize', function(){
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    var sc = slideEls[current-1].querySelector('.scroll-content');
    if(sc){ sc.style.transform=''; sc.style.width=''; }
    fitContent(slideEls[current-1]);
  }, 120);
});
