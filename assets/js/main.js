/* 智影 Insai InVision — 交互脚本 */
(function () {
  'use strict';

  /* ---------- 导航吸顶态 ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 滚动揭示 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(i * 60, 180);
        setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 两种协作模式切换 ---------- */
  var tabs = document.querySelectorAll('.modes__tab');
  var panels = document.querySelectorAll('.mode-card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.dataset.mode;
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.dataset.panel === key);
      });
    });
  });

  /* ---------- 功能筛选 ---------- */
  var chips = document.querySelectorAll('.chip');
  var caps = document.querySelectorAll('.cap');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.dataset.filter;
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      caps.forEach(function (card) {
        var show = key === 'all' || card.dataset.cat === key;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.classList.add('is-in');
        }
      });
    });
  });

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll('.metric b[data-count]');
  var runCount = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var start = performance.now();
    var dur = 1100;
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- FAQ：手风琴（同时只展开一个） ---------- */
  var faqs = document.querySelectorAll('.faq__list details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 平滑锚点（补偿吸顶导航高度） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
