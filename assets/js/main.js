/* 智影 Insai InVision — 交互脚本 v2 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 导航吸顶 ---------- */
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
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Hero 视差 ---------- */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroImg.style.transform = 'scale(1.04) translate3d(0,' + (y * 0.14) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 功能分类：点击定位 + 滚动联动 ---------- */
  var capBtns = Array.prototype.slice.call(document.querySelectorAll('.cap__nav button'));
  var groups = capBtns.map(function (b) { return document.getElementById(b.dataset.target); });

  function setActive(idx) {
    capBtns.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); });
  }

  capBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      var g = groups[i];
      if (!g) return;
      var top = g.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      setActive(i);
    });
  });

  if ('IntersectionObserver' in window && groups.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = groups.indexOf(e.target);
        if (idx > -1) setActive(idx);
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    groups.forEach(function (g) { if (g) spy.observe(g); });
  }

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll('.metric b[data-count]');
  var runCount = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var start = performance.now();
    var dur = 1200;
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- FAQ：同时只展开一个 ---------- */
  var faqs = document.querySelectorAll('.faq__list details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 平滑锚点（补偿吸顶导航） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
