// ============================================
// NAV THEME — switches to light text over dark sections
// ============================================
const navEl = document.querySelector('.nav');
const darkSections = document.querySelectorAll('.about');
const navThemeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navEl.classList.add('theme-dark');
    } else {
      navEl.classList.remove('theme-dark');
    }
  });
}, { rootMargin: '-40px 0px -85% 0px' });

darkSections.forEach(s => navThemeObserver.observe(s));

// ============================================
// PROGRESS RAIL — overall page scroll
// ============================================
const progressFill = document.getElementById('progressFill');
function updateProgress(){
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressFill.style.width = pct + '%';
}

// ============================================
// TIMELINE SPINE FILL — draws as you scroll through projects
// ============================================
const spineFill = document.getElementById('spineFill');
const timeline = document.querySelector('.timeline');
function updateSpine(){
  if(!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const totalHeight = rect.height;

  // how far the viewport center has progressed through the timeline
  const start = rect.top - viewportH * 0.5;
  const progressed = Math.min(Math.max(-start, 0), totalHeight);
  const pct = totalHeight > 0 ? (progressed / totalHeight) * 100 : 0;
  spineFill.style.height = pct + '%';
}

// ============================================
// ACTIVE PROJECT DOT
// ============================================
const projects = document.querySelectorAll('.project');
function updateActiveProject(){
  const centerY = window.innerHeight * 0.5;
  let closest = null;
  let closestDist = Infinity;
  projects.forEach(p => {
    const r = p.getBoundingClientRect();
    const pCenter = r.top + r.height/2;
    const dist = Math.abs(pCenter - centerY);
    if(dist < closestDist){
      closestDist = dist;
      closest = p;
    }
  });
  projects.forEach(p => p.classList.remove('is-active'));
  if(closest) closest.classList.add('is-active');
}

// ============================================
// SCROLL LOOP (rAF-throttled)
// ============================================
let ticking = false;
function onScroll(){
  if(!ticking){
    requestAnimationFrame(() => {
      updateProgress();
      updateSpine();
      updateActiveProject();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('resize', onScroll);
onScroll();

// ============================================
// REVEAL ON VIEW — IntersectionObserver
// ============================================
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.05, rootMargin:'0px 0px -10% 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// also reveal project text/media blocks as they scroll in
document.querySelectorAll('.project-text, .project-media').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)`;
});

const projectBlockObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      projectBlockObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.2, rootMargin:'0px 0px -60px 0px' });

document.querySelectorAll('.project-text').forEach(el => projectBlockObserver.observe(el));
document.querySelectorAll('.project-media').forEach((el, i) => {
  el.style.transitionDelay = '0.12s';
  projectBlockObserver.observe(el);
});

document.querySelectorAll('.about-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
  projectBlockObserver.observe(el);
});

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });
}

// ============================================
// TILT EFFECT — subtle 3D tilt on project media blocks
// ============================================
const tiltTargets = document.querySelectorAll('.project-media > .img-block, .project-media > .type-block, .project-media > .data-block');
const MAX_TILT = 6;

tiltTargets.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * MAX_TILT * 2;
    const tiltY = (x - 0.5) * MAX_TILT * 2;
    el.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.015)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// ============================================
// LINK REVEAL — tarjeta interactiva que se abre antes de salir al link
// ============================================
document.querySelectorAll('.link-reveal').forEach(card => {
  const trigger = card.querySelector('.link-reveal-trigger');
  trigger.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    // cierra las demás tarjetas abiertas para mantener una sola expandida a la vez
    document.querySelectorAll('.link-reveal.is-open').forEach(other => {
      if(other !== card) other.classList.remove('is-open');
    });
    card.classList.toggle('is-open', !wasOpen);
  });
});
