    document.querySelectorAll('a.navlink[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', id);
      });
    });


    function setCollapsed(targetSel, collapsed) {
      const el = document.querySelector(targetSel);
      if (!el) return;
      el.classList.toggle('hidden', collapsed);
    }

    function syncToggleLabel(btn) {
      const el = document.querySelector(btn.dataset.target);
      if (!el) return;
      btn.textContent = el.classList.contains('hidden') ? 'Розгорнути' : 'Згорнути';
    }

    document.querySelectorAll('.toggleBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const el = document.querySelector(btn.dataset.target);
        if (!el) return;
        el.classList.toggle('hidden');
        syncToggleLabel(btn);
      });
    });

  
    document.querySelectorAll('section[data-accordion="true"]').forEach(sec => {
      const header = sec.querySelector('.toggleBtn')?.closest('div');
      const btn = sec.querySelector('.toggleBtn');
      if (!header || !btn) return;

      header.classList.add('cursor-pointer', 'select-none');
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      const trigger = () => btn.click();
      header.addEventListener('click', trigger);
      header.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          trigger();
        }
      });
    });

    document.getElementById('collapseAll').addEventListener('click', () => {
      ['#senseText', '#minesText', '#entitiesText'].forEach(sel => setCollapsed(sel, true));
      document.querySelectorAll('.toggleBtn').forEach(btn => btn.textContent = 'Розгорнути');
    });

    document.getElementById('expandAll').addEventListener('click', () => {
      ['#senseText', '#minesText', '#entitiesText'].forEach(sel => setCollapsed(sel, false));
 
      document.querySelectorAll('.toggleBtn').forEach(btn => {
        const el = document.querySelector(btn.dataset.target);
        btn.textContent = (el && el.classList.contains('hidden')) ? 'Розгорнути' : 'Згорнути';
      });
    });

   
    const themeBtn = document.getElementById('themeBtn');
    const key = 'doorsTheme';

    function applyTheme(mode) {
      if (mode === 'light') {
        document.body.className = 'min-h-dvh bg-slate-50 text-slate-900';
        document.documentElement.style.colorScheme = 'light';
       
        document.querySelectorAll('.bg-slate-950').forEach(el => el.classList.replace('bg-slate-950', 'bg-white'));
        document.querySelectorAll('.border-white/10').forEach(el => {
          el.classList.remove('border-white/10');
          el.classList.add('border-black/10');
        });
        document.querySelectorAll('.text-slate-300').forEach(el => el.classList.replace('text-slate-300', 'text-slate-600'));
        document.querySelectorAll('.text-slate-400').forEach(el => el.classList.replace('text-slate-400', 'text-slate-500'));
        document.querySelectorAll('.text-slate-100, .text-slate-100/90, .text-slate-200, .text-slate-200/90').forEach(el => {
          el.classList.forEach(c => {
            if (c.startsWith('text-slate-1') || c.startsWith('text-slate-2')) el.classList.remove(c);
          });
          el.classList.add('text-slate-800');
        });
        themeBtn.setAttribute('aria-pressed', 'true');
      } else {
        location.reload();
      }
    }

    const saved = localStorage.getItem(key);
    if (saved === 'light') applyTheme('light');

    themeBtn.addEventListener('click', () => {
      const isLight = localStorage.getItem(key) === 'light';
      if (isLight) {
        localStorage.setItem(key, 'dark');
        location.reload();
      } else {
        localStorage.setItem(key, 'light');
        applyTheme('light');
      }
    });

  
    const topBtn = document.getElementById('topBtn');
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

   
    const onScroll = () => {
      if (window.scrollY > 600) topBtn.classList.remove('hidden');
      else topBtn.classList.add('hidden');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    
    (function initMiniRun(){
      const maxDoors = 200;
      let doors = 0;

      const doorCountEl = document.getElementById('doorCount');
      const barEl = document.getElementById('doorBar');
      const logEl = document.getElementById('runLog');
      const nextBtn = document.getElementById('nextDoorBtn');
      const eventBtn = document.getElementById('randomEventBtn');
      const resetBtn = document.getElementById('resetRunBtn');

      if (!doorCountEl || !barEl || !logEl || !nextBtn || !eventBtn || !resetBtn) return;

      const update = (msg) => {
        doorCountEl.textContent = String(doors);
        const pct = Math.max(0, Math.min(100, (doors / maxDoors) * 100));
        barEl.style.width = pct + '%';
        if (msg) logEl.textContent = msg;
      };

      const openNext = () => {
        if (doors >= maxDoors) {
          update('Ти вже дійшов(ла) до 200 дверей!');
          return;
        }
        doors += 1;
        let msg = `Відкрито двері №${doors}.`;
        if (doors === 50) msg += ' Здається, стає небезпечно...';
        if (doors === 100) msg += ' Половина шляху пройдена!';
        if (doors === 150) msg += ' Увага: кімната 150!';
        if (doors === 200) msg = 'Вітаю! 200 дверей — втеча знайдена.';
        update(msg);
      };

      const randomEvent = () => {
        if (doors === 0) {
          update('Спочатку відкрий хоча б 1 двері.');
          return;
        }
        const events = [
          'Ти знайшов(ла) ключ у комоді.',
          'Ти сховався(лася) у шафі — небезпека минула.',
          'Світло мигнуло... будь обережним(ою).',
          'Ти підібрав(ла) ліхтарик — стало легше бачити.',
          'Чути дивні звуки в коридорі...',
        ];
        const monsters = [
          'Сік наближається! Біжи!',
          'Фігура десь поруч — не шуміти!',
          'Грамбли бояться світла — увімкни ліхтар!',
        ];

        const roll = Math.random();
        if (roll < 0.25) {
          update(monsters[Math.floor(Math.random() * monsters.length)]);
        } else {
          update(events[Math.floor(Math.random() * events.length)]);
        }
      };

      const reset = () => {
        doors = 0;
        update('Забіг скинуто. Натисни «Відкрити наступні двері», щоб почати.');
      };

      nextBtn.addEventListener('click', openNext);
      eventBtn.addEventListener('click', randomEvent);
      resetBtn.addEventListener('click', reset);

      update('Натисни «Відкрити наступні двері», щоб почати.');
    })();

   
    document.getElementById('year').textContent = new Date().getFullYear();
