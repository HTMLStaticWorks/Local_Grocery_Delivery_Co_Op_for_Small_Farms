document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-sun"></i>');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-moon"></i>');
    }
    localStorage.setItem('theme', theme);
  }

  // Init Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  // --- RTL Toggle ---
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  function setRTL(isRtl) {
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
    localStorage.setItem('rtl', isRtl ? 'true' : 'false');
  }

  // Init RTL
  const savedRTL = localStorage.getItem('rtl');
  if (savedRTL === 'true') {
    setRTL(true);
  }

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      setRTL(!isRtl);
    });
  });

  // --- Mobile Drawer ---
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');

  function toggleDrawer() {
    if(!hamburger) return;
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleDrawer);
  }
  if (overlay) {
    overlay.addEventListener('click', toggleDrawer);
  }

  // Close drawer when link clicked
  const drawerLinks = document.querySelectorAll('.drawer-links a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(drawer.classList.contains('open')) {
        toggleDrawer();
      }
    });
  });

  // --- Auth State Simulation ---
  const authLinks = document.querySelectorAll('.auth-link');
  // Check if current page is login and they clicked login
  const loginForm = document.getElementById('loginForm');
  if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'dashboard.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    });
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  authLinks.forEach(link => {
    if (isLoggedIn) {
      link.textContent = 'Dashboard';
      link.href = 'dashboard.html';
    } else {
      link.textContent = 'Login';
      link.href = 'login.html';
    }
  });

  // Active Link Mapping
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(link => {
    if(link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // --- Navbar scroll state ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
          // Hand transitions back to the element's own hover styles once revealed
          el.addEventListener('transitionend', function done(e) {
            if (e.target !== el) return;
            el.classList.remove('reveal', 'is-visible');
            el.removeEventListener('transitionend', done);
          });
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // --- Count-up stats ---
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    animateNumber(el, 0, target, 1800, v => Math.round(v).toLocaleString() + suffix);
  });

  // --- FAQ accordion: keep one open at a time ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
    });
  });

  initBoxBuilder();
  initSeasonCalendar();
});

// Tween a number inside an element
function animateNumber(el, from, to, duration, format) {
  if (el._raf) cancelAnimationFrame(el._raf);
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = format(from + (to - from) * eased);
    if (t < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

function compactNumber(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : Math.round(n).toString();
}

// --- Interactive: Build Your Box (index.html) ---
function initBoxBuilder() {
  const builder = document.querySelector('[data-builder]');
  if (!builder) return;

  const produce = ['🥕', '🥬', '🍅', '🥔', '🍎', '🧅', '🥒', '🌽', '🫑', '🍐', '🥦', '🧄', '🍓', '🫐', '🍋', '🍠'];
  const $ = sel => builder.querySelector(sel);
  const greens = $('[data-greens]');
  const priceEl = $('[data-summary-price]');
  const itemsEl = $('[data-summary-items]');
  const milesEl = $('[data-summary-miles]');
  const farmersEl = $('[data-summary-farmers]');
  const visual = $('[data-box-visual]');
  let current = { price: 0, miles: 0, farmers: 0 };

  function update() {
    const size = $('input[name="boxSize"]:checked');
    const freq = $('input[name="frequency"]:checked');
    const addons = [...builder.querySelectorAll('[data-addon][aria-pressed="true"]')];
    const greenCount = parseInt(greens.value, 10);

    const addonTotal = addons.reduce((sum, a) => sum + parseFloat(a.dataset.price), 0);
    const subtotal = parseFloat(size.dataset.price) + greenCount * 3 + addonTotal;
    const discount = parseFloat(freq.dataset.discount);
    const price = subtotal * (1 - discount);
    const perYear = parseInt(freq.dataset.perYear, 10);
    const items = parseInt(size.dataset.items, 10) + greenCount + addons.length;
    const miles = items * 12 * perYear;
    const farmers = price * perYear * 0.8;

    // Text
    $('[data-summary-label]').textContent = size.dataset.label;
    $('[data-summary-freq]').textContent = freq.value === 'weekly' ? 'Weekly' : 'Every 2 weeks';
    $('[data-summary-sub]').textContent = discount > 0
      ? `You save $${(subtotal * discount).toFixed(2)} per box as a weekly member`
      : 'Switch to weekly to save 10% per box';
    $('[data-greens-label]').textContent = greenCount === 1 ? '1 bunch' : `${greenCount} bunches`;
    greens.style.setProperty('--fill', `${(greenCount / greens.max) * 100}%`);
    itemsEl.textContent = items;

    // Animated numbers
    animateNumber(priceEl, current.price, price, 600, v => v.toFixed(2));
    animateNumber(milesEl, current.miles, miles, 600, compactNumber);
    animateNumber(farmersEl, current.farmers, farmers, 600, compactNumber);
    current = { price, miles, farmers };

    // Box visual
    const emojis = produce.slice(0, parseInt(size.dataset.items, 10)).map(e => ({ e, extra: false }));
    for (let i = 0; i < greenCount; i++) emojis.push({ e: '🥬', extra: false });
    addons.forEach(a => emojis.push({ e: a.dataset.emoji, extra: true }));
    visual.innerHTML = emojis.map((item, i) =>
      `<span class="box-item${item.extra ? ' box-item--extra' : ''}" style="animation-delay:${i * 18}ms">${item.e}</span>`
    ).join('');
  }

  builder.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', update));
  greens.addEventListener('input', update);
  builder.querySelectorAll('[data-addon]').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    });
  });

  update();
}

// --- Interactive: Seasonal Harvest Calendar (home2.html) ---
function initSeasonCalendar() {
  const cal = document.querySelector('[data-season-calendar]');
  if (!cal) return;

  const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const seasons = {
    spring: {
      title: 'Tender & green',
      desc: 'The first shoots of the year. Crisp, delicate and full of life after the long winter.',
      img: 'assets/images/season-spring.jpg',
      months: [2, 3, 4],
      produce: [
        { emoji: '🌱', name: 'Pea Shoots', farm: 'Urban Roots Co.', peak: 92, note: 'Grown in living soil trays and cut the morning of delivery for maximum sweetness.' },
        { emoji: '🥬', name: 'Butter Lettuce', farm: 'Green Valley Acres', peak: 85, note: 'Cool nights keep the leaves soft and buttery. Best eaten within 4 days.' },
        { emoji: '🍓', name: 'Early Strawberries', farm: 'Sunrise Orchard', peak: 64, note: 'Hoop-house berries arrive late May, small but intensely fragrant.' },
        { emoji: '🧅', name: 'Spring Onions', farm: 'Green Valley Acres', peak: 88, note: 'Pulled young for a mild bite. Grill whole with olive oil and sea salt.' },
        { emoji: '🥦', name: 'Broccolini', farm: 'Green Valley Acres', peak: 76, note: 'Harvested by hand every other day while the florets are still tight.' },
        { emoji: '🌿', name: 'Fresh Mint', farm: 'Urban Roots Co.', peak: 80, note: 'Vertical-farmed and bundled with roots attached so it keeps for a week.' }
      ]
    },
    summer: {
      title: 'Sun-ripened abundance',
      desc: 'Long days mean peak sugar. Our boxes are at their most colorful and generous.',
      img: 'assets/images/season-summer.jpg',
      months: [5, 6, 7],
      produce: [
        { emoji: '🍅', name: 'Heirloom Tomatoes', farm: 'Green Valley Acres', peak: 98, note: 'Twelve varieties, vine-ripened and never refrigerated to protect flavor.' },
        { emoji: '🌽', name: 'Sweet Corn', farm: 'Green Valley Acres', peak: 94, note: 'Picked before dawn when the sugar content is highest.' },
        { emoji: '🫐', name: 'Blueberries', farm: 'Sunrise Orchard', peak: 90, note: 'Hand-picked by the Lawson family, 1-pint punnets in compostable cartons.' },
        { emoji: '🥒', name: 'Cucumbers', farm: 'Urban Roots Co.', peak: 86, note: 'Thin-skinned Persian cucumbers, no waxing, no peeling needed.' },
        { emoji: '🫑', name: 'Bell Peppers', farm: 'Green Valley Acres', peak: 72, note: 'Left on the plant until fully red for double the vitamin C.' },
        { emoji: '🍑', name: 'Peaches', farm: 'Sunrise Orchard', peak: 88, note: 'Tree-ripened, so handle gently. They ripen fully on your counter in a day.' }
      ]
    },
    autumn: {
      title: 'Harvest season',
      desc: 'Orchards are heavy and root cellars are filling. Warm, hearty and deeply flavorful.',
      img: 'assets/images/season-autumn.jpg',
      months: [8, 9, 10],
      produce: [
        { emoji: '🍎', name: 'Fuji Apples', farm: 'Sunrise Orchard', peak: 96, note: 'Picked at full color from 60-year-old trees. Crisp, honey-sweet and great for pies.' },
        { emoji: '🎃', name: 'Butternut Squash', farm: 'Green Valley Acres', peak: 90, note: 'Cured for two weeks in the sun so the flesh turns dense and nutty.' },
        { emoji: '🍐', name: 'Bosc Pears', farm: 'Sunrise Orchard', peak: 84, note: 'Firm when they arrive. Leave them out 2–3 days for buttery texture.' },
        { emoji: '🥔', name: 'Heirloom Potatoes', farm: 'Green Valley Acres', peak: 88, note: 'A mix of purple, fingerling and gold varieties, dug and dried on the farm.' },
        { emoji: '🍠', name: 'Sweet Potatoes', farm: 'Green Valley Acres', peak: 78, note: 'Sweetness develops in storage, so they only get better through the season.' },
        { emoji: '🥬', name: 'Curly Kale', farm: 'Urban Roots Co.', peak: 82, note: 'A light frost converts starches to sugar, so autumn kale is the sweetest.' }
      ]
    },
    winter: {
      title: 'Roots & storage crops',
      desc: 'Cellar-kept roots, greenhouse greens and citrus from partner growers keep boxes vibrant.',
      img: 'assets/images/season-winter.jpg',
      months: [11, 0, 1],
      produce: [
        { emoji: '🥕', name: 'Storage Carrots', farm: 'Green Valley Acres', peak: 86, note: 'Stored in sand at 34°F, which makes them sweeter than summer carrots.' },
        { emoji: '🧄', name: 'Hardneck Garlic', farm: 'Green Valley Acres', peak: 80, note: 'Braided and cured since August. Bold, spicy and long-keeping.' },
        { emoji: '🍋', name: 'Meyer Lemons', farm: 'Partner grove', peak: 92, note: 'Sourced from a co-op partner grove to brighten winter boxes.' },
        { emoji: '🌿', name: 'Microgreens', farm: 'Urban Roots Co.', peak: 95, note: 'Indoor-grown year round, harvested 10 days after sowing.' },
        { emoji: '🥬', name: 'Winter Cabbage', farm: 'Green Valley Acres', peak: 74, note: 'Dense, frost-hardy heads that are perfect for slaws and slow braises.' },
        { emoji: '🧅', name: 'Yellow Onions', farm: 'Green Valley Acres', peak: 70, note: 'Cured storage onions that keep for months in a cool, dark place.' }
      ]
    }
  };

  const tabs = [...cal.querySelectorAll('.season-tab')];
  const hero = cal.querySelector('[data-season-hero]');
  const heroImg = cal.querySelector('[data-season-img]');
  const grid = cal.querySelector('[data-season-grid]');
  const monthsEl = cal.querySelector('[data-season-months]');

  // Mark the current season
  const m = new Date().getMonth();
  const nowSeason = m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'autumn' : 'winter';
  const nowTab = tabs.find(t => t.dataset.season === nowSeason);
  if (nowTab) nowTab.insertAdjacentHTML('beforeend', '<span class="now-dot" title="In season now"></span>');

  function renderDetail(item) {
    let detail = grid.querySelector('.produce-detail');
    if (!detail) {
      detail = document.createElement('div');
      detail.className = 'produce-detail';
      grid.appendChild(detail);
    }
    detail.innerHTML = `
      <span class="produce-detail-emoji">${item.emoji}</span>
      <div class="produce-detail-text">
        <strong>${item.name} · ${item.farm}</strong>
        <p>${item.note}</p>
      </div>
      <a href="this-weeks-box.html" class="btn btn-primary">Add to my box <i class="ph ph-plus"></i></a>`;
  }

  function selectSeason(key, focus) {
    const s = seasons[key];
    tabs.forEach(t => {
      const on = t.dataset.season === key;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });

    hero.classList.add('is-switching');
    setTimeout(() => {
      heroImg.src = s.img;
      heroImg.alt = `${key} harvest`;
      hero.classList.remove('is-switching');
    }, 250);
    cal.querySelector('[data-season-title]').textContent = s.title;
    cal.querySelector('[data-season-desc]').textContent = s.desc;
    monthsEl.innerHTML = monthNames.map((n, i) => `<span class="${s.months.includes(i) ? 'on' : ''}">${n}</span>`).join('');

    grid.innerHTML = s.produce.map((p, i) => `
      <button type="button" class="produce-tile" aria-pressed="${i === 0}" data-index="${i}" style="animation-delay:${i * 60}ms">
        <span class="produce-emoji">${p.emoji}</span>
        <span class="produce-name">${p.name}</span>
        <span class="farm">${p.farm}</span>
        <span class="peak">
          <span class="peak-bar"><span data-peak="${p.peak}"></span></span>
          <small><span>Peak freshness</span><span>${p.peak}%</span></small>
        </span>
      </button>`).join('');

    // Animate bars after paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      grid.querySelectorAll('[data-peak]').forEach(bar => { bar.style.width = bar.dataset.peak + '%'; });
    }));

    grid.querySelectorAll('.produce-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        grid.querySelectorAll('.produce-tile').forEach(t => t.setAttribute('aria-pressed', 'false'));
        tile.setAttribute('aria-pressed', 'true');
        renderDetail(s.produce[tile.dataset.index]);
      });
    });
    renderDetail(s.produce[0]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectSeason(tab.dataset.season));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const dir = (e.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl') ? 1 : -1;
      selectSeason(tabs[(i + dir + tabs.length) % tabs.length].dataset.season, true);
    });
  });

  selectSeason(nowSeason);
}

// Generic form validation logic
function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Check all required inputs
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        showError(input, 'This field is required');
        isValid = false;
      } else {
        clearError(input);
      }
    });

    // Check email
    const emails = form.querySelectorAll('input[type="email"]');
    emails.forEach(email => {
      if (email.value && !/\S+@\S+\.\S+/.test(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      }
    });

    // Check passwords match
    const password = form.querySelector('input[name="password"]');
    const confirm = form.querySelector('input[name="confirmPassword"]');
    if (password && confirm) {
      if (password.value !== confirm.value) {
        showError(confirm, 'Passwords do not match');
        isValid = false;
      }
    }
    
    // Check Terms checkbox
    const terms = form.querySelector('input[name="terms"]');
    if (terms && !terms.checked) {
      showError(terms, 'You must accept the terms');
      isValid = false;
    }

    if (isValid) {
      // Simulate success
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Success!';
      btn.style.backgroundColor = 'var(--color-success)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        if(formId !== 'loginForm') form.reset();
      }, 3000);
    }
  });
}

function showError(input, message) {
  input.classList.add('error');
  let errorDiv = input.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('form-error')) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }
  errorDiv.textContent = message;
}

function clearError(input) {
  input.classList.remove('error');
  const errorDiv = input.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('form-error')) {
    errorDiv.remove();
  }
}

// Password show/hide toggles (login / register)
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const input = toggle.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    toggle.innerHTML = `<i class="ph ph-eye${show ? '-slash' : ''}"></i>`;
  });
});
