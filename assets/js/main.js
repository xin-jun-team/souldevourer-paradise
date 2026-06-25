'use strict';

/* ═══════════════════════════════════════════════════
   解放雙手天堂 — Main JS v2
   ═══════════════════════════════════════════════════ */

/* ─────────────────────────────────
   手機選單 Toggle
───────────────────────────────── */
(function () {
  const toggle    = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;
  toggle.addEventListener('click', () => mobileNav.classList.toggle('is-open'));
})();

/* ─────────────────────────────────
   服務專區 下拉選單（點擊式）
───────────────────────────────── */
(function () {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown__toggle');
    const menu   = dropdown.querySelector('.nav-dropdown__menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.contains('is-open');
      // 先關閉所有下拉
      document.querySelectorAll('.nav-dropdown__menu').forEach(function (m) { m.classList.remove('is-open'); });
      document.querySelectorAll('.nav-dropdown__toggle').forEach(function (t) { t.classList.remove('is-active'); });
      // 切換當前
      if (!isOpen) {
        menu.classList.add('is-open');
        toggle.classList.add('is-active');
      }
    });
  });

  // 點擊其他地方關閉
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dropdown__menu').forEach(function (m) { m.classList.remove('is-open'); });
    document.querySelectorAll('.nav-dropdown__toggle').forEach(function (t) { t.classList.remove('is-active'); });
  });
})();

/* ─────────────────────────────────
   新手專區 Tab 切換
───────────────────────────────── */
(function () {
  const tabs   = document.querySelectorAll('.newbie-tab');
  const panels = document.querySelectorAll('.newbie-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('is-active');
    });
  });
})();

/* ─────────────────────────────────
   Hero 粒子特效（金色塵埃浮動）
───────────────────────────────── */
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // 粒子：噬魂三色 —— 紫魂靈氣 + 血紅火星 + 金色餘燼
  function createParticle() {
    const size = Math.random() * 2.4 + 0.3;
    const type = Math.random(); // 0-0.5=紫魂, 0.5-0.8=血紅, 0.8-1=金燼
    let r, g, b;
    if (type < 0.5) {
      // 靈魂紫：從底部緩慢飄升，如被吞噬的靈魂
      r = Math.floor(Math.random() * 60 + 100);
      g = 0;
      b = Math.floor(Math.random() * 80 + 160);
    } else if (type < 0.8) {
      // 血紅火星：快速上升消逝
      r = Math.floor(Math.random() * 60 + 180);
      g = Math.floor(Math.random() * 20);
      b = 0;
    } else {
      // 金色餘燼：緩慢漂浮
      r = Math.floor(Math.random() * 30 + 200);
      g = Math.floor(Math.random() * 50 + 140);
      b = Math.floor(Math.random() * 10);
    }
    return {
      x:        Math.random() * W,
      y:        H + Math.random() * 60,
      size,
      speedX:   (Math.random() - 0.5) * 0.55,
      speedY:   -(Math.random() * 0.65 + 0.15),
      alpha:    Math.random() * 0.45 + 0.1,
      alphaDir: -(Math.random() * 0.003 + 0.001),
      r, g, b,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += p.alphaDir;

      if (p.alpha <= 0.05) { p.alphaDir =  0.004; }
      if (p.alpha >= 0.65) { p.alphaDir = -0.004; }
      // 消逝後重生於底部
      if (p.alpha <= 0 || p.y < -8 || p.x < -8 || p.x > W + 8) {
        Object.assign(p, createParticle());
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ─────────────────────────────────
   職業輪播
───────────────────────────────── */
(function () {
  const carousel = document.getElementById('class-carousel');
  if (!carousel) return;

  const slides  = carousel.querySelectorAll('.class-slide');
  const thumbs  = carousel.querySelectorAll('.class-thumb');
  const prevBtn = carousel.querySelector('.carousel-btn--prev');
  const nextBtn = carousel.querySelector('.carousel-btn--next');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;
  const AUTO_MS = 5200;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    thumbs[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    thumbs[current].classList.add('is-active');
    // 僅橫向捲動縮圖列，不影響頁面位置
    const activeThumb = thumbs[current];
    if (activeThumb) {
      activeThumb.parentElement.scrollLeft =
        activeThumb.offsetLeft - activeThumb.parentElement.offsetWidth / 2 + activeThumb.offsetWidth / 2;
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      goTo(parseInt(thumb.dataset.index, 10));
      startAuto();
    });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // 拖曳 / 觸控
  let dragX = null;
  carousel.addEventListener('mousedown', e => { dragX = e.clientX; });
  carousel.addEventListener('mouseup',   e => {
    if (dragX === null) return;
    if (Math.abs(e.clientX - dragX) > 48) { goTo(e.clientX < dragX ? current + 1 : current - 1); startAuto(); }
    dragX = null;
  });
  carousel.addEventListener('touchstart', e => { dragX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    if (dragX === null) return;
    const d = e.changedTouches[0].clientX - dragX;
    if (Math.abs(d) > 48) { goTo(d < 0 ? current + 1 : current - 1); startAuto(); }
    dragX = null;
  });

  startAuto();
})();

/* ─────────────────────────────────
   活動預告輪播
───────────────────────────────── */
(function () {
  const carousel = document.getElementById('ev-carousel');
  if (!carousel) return;

  const slides  = carousel.querySelectorAll('.ev-slide');
  const dots    = carousel.querySelectorAll('.ev-dot');
  const prevBtn = carousel.querySelector('.ev-arrow--prev');
  const nextBtn = carousel.querySelector('.ev-arrow--next');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;
  const AUTO_MS = 4000;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current] && dots[current].classList.add('is-active');
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // 觸控 / 拖曳
  let dragX = null;
  carousel.addEventListener('mousedown',  e => { dragX = e.clientX; });
  carousel.addEventListener('mouseup',    e => {
    if (dragX === null) return;
    if (Math.abs(e.clientX - dragX) > 48) { goTo(e.clientX < dragX ? current + 1 : current - 1); startAuto(); }
    dragX = null;
  });
  carousel.addEventListener('touchstart', e => { dragX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    if (dragX === null) return;
    const d = e.changedTouches[0].clientX - dragX;
    if (Math.abs(d) > 48) { goTo(d < 0 ? current + 1 : current - 1); startAuto(); }
    dragX = null;
  });

  startAuto();
})();

/* ─────────────────────────────────
   載入首頁 JSON 資料
───────────────────────────────── */
async function loadHomeData() {
  const annGrid    = document.getElementById('ann-grid');
  const updateList = document.getElementById('update-list');

  try {
    const res  = await fetch('data/home.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    // 公告
    if (annGrid) {
      const items = (data.announcements || []).slice(0, 6);
      annGrid.innerHTML = items.length
        ? items.map(item => `
          <a href="${esc(item.url || '#')}" class="ann-card">
            <div class="ann-card__meta">
              <span class="ann-card__tag">${esc(item.tag || '公告')}</span>
              <span class="ann-card__date">${esc(item.date || '')}</span>
            </div>
            <div class="ann-card__title">${esc(item.title || '')}</div>
          </a>`).join('')
        : '<div class="data-loading">暫無公告</div>';
    }

    // 更新歷程
    if (updateList) {
      const items = (data.updates || []).slice(0, 8);
      updateList.innerHTML = items.length
        ? items.map(item => `
          <div class="update-item">
            <span class="update-item__date">${esc(item.date || '')}</span>
            <span class="update-item__title">${esc(item.title || '')}</span>
            <span class="update-item__tag">${esc(item.tag || '更新')}</span>
          </div>`).join('')
        : '<div class="data-loading">暫無更新記錄</div>';
    }

  } catch (err) {
    if (annGrid)    annGrid.innerHTML    = '<div class="data-loading">公告資料載入失敗</div>';
    if (updateList) updateList.innerHTML = '<div class="data-loading">更新資料載入失敗</div>';
    console.warn('[loadHomeData]', err);
  }
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.addEventListener('DOMContentLoaded', loadHomeData);

/* ─────────────────────────────────
   全站搜尋系統
───────────────────────────────── */
(function () {
  var searchData = [
    // { title:'龍珠系統', path:'pages/feature-dragon-ball.html', keywords:'龍珠 龍族之血 神龍之羽 神龍錢包 缺角的羽毛 強化 1星 2星 3星 4星 5星 6星 7星 飛龍 dragon ball' },
    { title:'轉生系統', path:'pages/feature-reborn.html', keywords:'轉生 1轉 2轉 3轉 劍術領域 魔幻深淵 海王 神射手 魔導師 劍盾師 魔劍師 波賽頓 精靈祝福 源力動能 金剛不壞 逍遙劍仙 轉生證明 菜蟲' },
    // { title:'BOSS 裝備', path:'pages/feature-boss-gear.html', keywords:'BOSS 哈們 龍王敖丙 千手觀音 喬巴 毒蟲 水龍 聖靈 賊鹿 套裝 伏爾甘 女神的眼淚' },
    { title:'噬魂魔核', path:'pages/feature-soul-core.html', keywords:'噬魂魔核 碎片 合成 核心材料 soul core' },
    { title:'王族專屬裝備', path:'pages/feature-royal-gear.html', keywords:'王族 魅力王族 專屬 royal' },
    { title:'職業特殊技能', path:'pages/feature-skills.html', keywords:'技能 王者之劍 霸體 狂襲 精靈之暈 力場 復仇 衝暈' },
    { title:'每日任務', path:'pages/feature-daily-quest.html', keywords:'每日任務 噬魂禮盒 噬魂棒棒糖 兌換 騎士洞穴 古魯丁 龍之谷 精靈墓穴 地底湖 烽火戰場 支配之塔' },
    { title:'寵物系統', path:'pages/feature-pet.html', keywords:'寵物 進化 捕捉 寵物之島 項圈' },
    { title:'威望系統', path:'pages/feature-prestige.html', keywords:'威望 稱號 積分 擊殺 掠奪' },
    { title:'在線獎勵', path:'pages/feature-online-reward.html', keywords:'在線 福袋 獎勵 經驗藥水 變身卡 娃娃卡 噬魂鑽' },
    { title:'地圖介紹', path:'pages/feature-maps.html', keywords:'地圖 地監 古魯丁 奇岩 海音 傲慢之塔 精靈墓穴 夢幻之島 支配之塔 烽火戰場' },
    { title:'變身介紹', path:'pages/feature-transform.html', keywords:'變身 變身石 攻速 施法 一般 高級 稀有 英雄 傳說 神話 合成 升階' },
    { title:'娃娃介紹', path:'pages/feature-dolls.html', keywords:'娃娃 娃娃石 收藏 被動 合成 升階' },
    { title:'武器介紹', path:'pages/items-weapons.html', keywords:'武器 單手劍 雙手劍 弓 矛 法杖 雙刀 修練者 超特製 戰神 英雄 死亡騎士 風刃 冥皇 強化珠 屬性 魔武' },
    { title:'防具介紹', path:'pages/items-armor.html', keywords:'防具 頭盔 盔甲 手套 長靴 斗篷 盾牌 內衣 脛甲 項鍊 腰帶 戒指 耳環 武官 迅捷 神官 死亡騎士 守護者 惡魔 真冥皇 火焰之影 艾歐丁' },
    { title:'活動資訊', path:'pages/events.html', keywords:'活動 LINE 禮包 新手 BOSS挑戰' },
    { title:'遊戲下載', path:'pages/download.html', keywords:'下載 安裝 登入器 系統需求' },
    { title:'版本設定', path:'pages/version.html', keywords:'版本 倍率 經驗 掉落 金幣 多開 萬能藥' },
    { title:'贊助說明', path:'pages/sponsor.html', keywords:'贊助 藍鑽 儲值' },
    { title:'遊戲規章', path:'pages/rules.html', keywords:'規則 規章 禁止 外掛 處罰' },
    { title:'免責聲明', path:'pages/disclaimer.html', keywords:'免責 聲明' },
    { title:'遊戲特色總覽', path:'pages/features-overview.html', keywords:'特色 系統 介紹 總覽' },
    { title:'裝備道具總覽', path:'pages/items-overview.html', keywords:'裝備 道具 總覽' },
    { title:'BOSS 介紹', path:'pages/boss-guide.html', keywords:'BOSS 收藏 時刻表 掉落 烽火 死亡騎士 食人花 底比斯 沙蟲 提卡爾 杰弗雷庫' },
    { title:'推文推廣', path:'pages/promote.html', keywords:'推文 推廣 推廣幣 推廣大使 直播 兌換 社團' },
    { title:'轉職服務', path:'pages/class-change.html', keywords:'轉職 簡易轉職 完整轉職 職業 轉換 技能 裝備' },
    { title:'紅利幣', path:'pages/feature-bonus-coin.html', keywords:'紅利 VIP 馬德里 商城 萬能藥 不朽 體力恢復劑 永久名譽 永久巧克力' },
    { title:'累計贊助禮包', path:'pages/event-sponsor-gift.html', keywords:'贊助 禮包 累計 噬魂同歡慶 噬魂崛起 噬魂征途 噬魂霸主 噬魂之父 噬魂至尊 傳說變身 傳說娃娃' },
  ];

  // 判斷是否在 pages/ 子目錄
  var inSub = location.pathname.indexOf('/pages/') !== -1;
  var prefix = inSub ? '' : '';

  // 建立 overlay DOM
  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML =
    '<button class="search-overlay__close" id="search-close">&times;</button>' +
    '<div class="search-overlay__box">' + '<div class="search-overlay__label">◈ 噬魂天堂 · 全站搜尋</div>' +
      '<input type="text" class="search-overlay__input" id="search-input" placeholder="搜尋系統、裝備、技能...">' +
      '<div class="search-overlay__results" id="search-results"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  // 開關搜尋
  function openSearch() { overlay.classList.add('is-open'); setTimeout(function(){ document.getElementById('search-input').focus(); }, 100); }
  function closeSearch() { overlay.classList.remove('is-open'); document.getElementById('search-input').value = ''; document.getElementById('search-results').innerHTML = ''; }

  document.getElementById('search-close').addEventListener('click', closeSearch);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeSearch(); });

  // 綁定所有搜尋按鈕
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.search-toggle');
    if (btn) { e.preventDefault(); openSearch(); }
  });

  // 搜尋邏輯
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');

  input.addEventListener('input', function() {
    var q = this.value.trim().toLowerCase();
    resultsEl.innerHTML = '';
    if (q.length < 1) return;

    var matches = searchData.filter(function(item) {
      return item.title.toLowerCase().indexOf(q) !== -1 || item.keywords.toLowerCase().indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      resultsEl.innerHTML = '<div class="search-no-result">找不到「' + q + '」相關內容</div>';
      return;
    }

    var basePath = inSub ? '' : 'pages/';
    // 如果在首頁，路徑要加 pages/；如果在 pages/ 裡，直接用檔名
    matches.forEach(function(item) {
      var href = inSub ? item.path.replace('pages/', '') : item.path;
      var a = document.createElement('a');
      a.className = 'search-result';
      a.href = href;

      // 高亮匹配的關鍵字
      var kwArr = item.keywords.split(' ');
      var matched = kwArr.filter(function(kw) { return kw.toLowerCase().indexOf(q) !== -1; }).slice(0, 5);

      a.innerHTML =
        '<div class="search-result__title">' + item.title + '</div>' +
        '<div class="search-result__path">' + item.path + '</div>' +
        (matched.length ? '<div class="search-result__match">相關：' + matched.map(function(m){ return '<mark>' + m + '</mark>'; }).join(' ') + '</div>' : '');

      resultsEl.appendChild(a);
    });
  });
})();
