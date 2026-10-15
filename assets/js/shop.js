// --- Shop / Grocery page (shop.html) ---
(function () {
  const shop = document.querySelector('[data-shop]');
  if (!shop) return;

  const FREE_DELIVERY_AT = 35;
  const DELIVERY_FEE = 4.99;
  const CART_KEY = 'farmcircle-cart';

  const FARMS = {
    'green-valley': 'Green Valley Acres',
    'sunrise': 'Sunrise Orchard',
    'urban-roots': 'Urban Roots Co.'
  };

  const CATEGORIES = [
    { id: 'all', name: 'All Products', icon: 'ph-basket' },
    { id: 'roots', name: 'Root Vegetables', img: 'assets/images/produce-organic-carrots.jpg' },
    { id: 'vegetables', name: 'Seasonal Vegetables', img: 'assets/images/produce-cauliflower-head.jpg' },
    { id: 'fruit', name: 'Orchard Fruit', img: 'assets/images/produce-fuji-apples.jpg' },
    { id: 'alliums', name: 'Mushrooms', img: 'assets/images/box-item-cremini-mushrooms.jpg' }
  ];

  // stock: number available this week (0 = sold out, <= 5 = low)
  const PRODUCTS = [
    { id: 'heirloom-potatoes', name: 'Heirloom Potatoes', cat: 'roots', farm: 'green-valley', price: 4.5, unit: '2 lb bag', stock: 40, best: true, img: 'assets/images/box-item-heirloom-potatoes.jpg', desc: 'A colorful mix of waxy and floury heirloom varieties. Great roasted whole or smashed with butter and herbs.', harvest: 'Dug Tuesday', practice: 'Regenerative, no synthetic pesticides', storage: 'Cool, dark place for up to 3 weeks' },
    { id: 'organic-carrots', name: 'Organic Carrots', cat: 'roots', farm: 'green-valley', price: 3.75, unit: '1 bunch', stock: 32, best: true, img: 'assets/images/box-item-organic-carrots.jpg', desc: 'Sweet, crunchy carrots with their tops on. Eat the greens too, they make a bright pesto.', harvest: 'Pulled Wednesday', practice: 'Certified organic', storage: 'Remove tops, refrigerate up to 2 weeks' },
    { id: 'rainbow-carrots', name: 'Rainbow Carrots', cat: 'roots', farm: 'green-valley', price: 4.25, unit: '1 bunch', stock: 4, isNew: true, img: 'assets/images/dash-swap-rainbow-carrots.jpg', desc: 'Purple, yellow and white carrots with an earthy sweetness. Beautiful raw in salads or glazed.', harvest: 'Pulled Wednesday', practice: 'Certified organic', storage: 'Remove tops, refrigerate up to 2 weeks' },
    { id: 'red-beets', name: 'Red Beets', cat: 'roots', farm: 'green-valley', price: 3.5, unit: '1 bunch', stock: 18, img: 'assets/images/box-item-red-beets.jpg', desc: 'Deep red beets with tender greens attached. Roast, pickle or grate raw into slaw.', harvest: 'Pulled Tuesday', practice: 'Regenerative, no synthetic pesticides', storage: 'Refrigerate roots and greens separately' },
    { id: 'yukon-gold', name: 'Yukon Gold Potatoes', cat: 'roots', farm: 'green-valley', price: 4, unit: '2 lb bag', stock: 26, isNew: true, img: 'assets/images/dash-add-yukon-gold-potatoes.jpg', desc: 'Buttery, golden-fleshed potatoes that make the creamiest mash you will ever eat.', harvest: 'Dug Monday', practice: 'Regenerative, no synthetic pesticides', storage: 'Cool, dark place for up to 3 weeks' },
    { id: 'heirloom-tomatoes', name: 'Heirloom Tomatoes', cat: 'vegetables', farm: 'green-valley', price: 5.5, unit: '1 lb', stock: 3, img: 'assets/images/dash-swap-heirloom-tomatoes.jpg', desc: 'The last of the season. Juicy, mixed heirloom varieties, perfect sliced with salt and olive oil.', harvest: 'Picked Wednesday', practice: 'Regenerative, no synthetic pesticides', storage: 'Room temperature, eat within 4 days' },
    { id: 'cauliflower', name: 'Cauliflower', cat: 'vegetables', farm: 'urban-roots', price: 4.75, unit: '1 head', stock: 22, best: true, img: 'assets/images/box-item-cauliflower-head.jpg', desc: 'Dense, snowy-white heads with a mild, nutty flavor. Roast at high heat until golden.', harvest: 'Cut Tuesday', practice: 'Pesticide-free, grown under cover', storage: 'Refrigerate loosely wrapped up to 1 week' },
    { id: 'sugar-pie-pumpkin', name: 'Sugar Pie Pumpkin', cat: 'vegetables', farm: 'green-valley', price: 5, unit: '1 pumpkin (~3 lb)', stock: 30, isNew: true, img: 'assets/images/dash-add-sugar-pie-pumpkin.jpg', desc: 'This week\'s seasonal highlight. Sweet, dense flesh that is made for pies, soups and roasting.', harvest: 'Cured 10 days in the barn', practice: 'Regenerative, no synthetic pesticides', storage: 'Cool, dry place for up to 2 months' },
    { id: 'microgreens', name: 'Mixed Microgreens', cat: 'vegetables', farm: 'urban-roots', price: 4.5, unit: '4 oz clamshell', stock: 15, best: true, img: 'assets/images/farm-microgreens-growing.jpg', desc: 'Pea shoots, radish and sunflower greens. Packed with flavor and nutrients, cut the morning of delivery.', harvest: 'Cut delivery morning', practice: 'Pesticide-free, indoor grown', storage: 'Refrigerate, eat within 5 days' },
    { id: 'fuji-apples', name: 'Fuji Apples', cat: 'fruit', farm: 'sunrise', price: 6, unit: '3 lb bag', stock: 45, best: true, img: 'assets/images/box-item-fuji-apples.jpg', desc: 'Crisp, honey-sweet apples straight from the orchard. A lunchbox favorite.', harvest: 'Picked Monday', practice: 'Integrated pest management', storage: 'Refrigerate for up to 4 weeks' },
    { id: 'orchard-mix', name: 'Orchard Apple Mix', cat: 'fruit', farm: 'sunrise', price: 8.5, unit: '5 lb bag', stock: 12, isNew: true, img: 'assets/images/farm2-orchard-apples.jpg', desc: 'A rotating mix of four orchard varieties for baking, snacking and sauce.', harvest: 'Picked Monday', practice: 'Integrated pest management', storage: 'Refrigerate for up to 4 weeks' },
    { id: 'cremini-mushrooms', name: 'Cremini Mushrooms', cat: 'alliums', farm: 'urban-roots', price: 5.25, unit: '8 oz', stock: 5, img: 'assets/images/box-item-cremini-mushrooms.jpg', desc: 'Meaty, earthy brown mushrooms grown on local hardwood. Sauté hot in butter.', harvest: 'Picked Wednesday', practice: 'Grown on recycled hardwood', storage: 'Paper bag in the fridge, up to 1 week' },
  ];

  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const money = n => '$' + n.toFixed(2);
  const stockState = p => (p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'in');
  const stockLabel = p => ({ in: 'In stock', low: `Only ${p.stock} left`, out: 'Sold out' })[stockState(p)];
  const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || '';

  // --- State ---
  const params = new URLSearchParams(location.search);
  const state = {
    cat: CATEGORIES.some(c => c.id === params.get('cat')) ? params.get('cat') : 'all',
    farm: FARMS[params.get('farm')] ? params.get('farm') : 'all',
    q: '',
    sort: 'featured',
    inStock: false,
    spotlight: 'sugar-pie-pumpkin'
  };

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { cart = {}; }
  // Drop anything no longer sold
  Object.keys(cart).forEach(id => { if (!byId[id] || byId[id].stock === 0) delete cart[id]; });

  const $ = sel => shop.ownerDocument.querySelector(sel);
  const $$ = sel => [...shop.ownerDocument.querySelectorAll(sel)];

  // --- Rendering ---
  function flagsHTML(p) {
    const flags = [];
    if (p.best) flags.push('<span class="badge badge-gold"><i class="ph-fill ph-star"></i> Best seller</span>');
    if (p.isNew) flags.push('<span class="badge badge-secondary">New</span>');
    return flags.length ? `<div class="product-flags">${flags.join('')}</div>` : '';
  }

  function cardHTML(p) {
    const out = p.stock === 0;
    return `
      <article class="product-card${out ? ' is-out' : ''}">
        <button type="button" class="product-card-media" data-details="${p.id}" aria-label="View details for ${p.name}">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${flagsHTML(p)}
        </button>
        <div class="product-card-body">
          <span class="product-farm"><i class="ph ph-map-pin"></i> ${FARMS[p.farm]}</span>
          <h3><button type="button" data-details="${p.id}">${p.name}</button></h3>
          <span class="product-unit">${p.unit}</span>
          <span class="stock-status ${stockState(p)}">${stockLabel(p)}</span>
          <div class="product-card-foot">
            <span class="product-price">${money(p.price)}</span>
            ${out
              ? '<button type="button" class="btn btn-secondary btn-sm" disabled>Sold out</button>'
              : `<button type="button" class="btn btn-primary btn-sm" data-add="${p.id}"><i class="ph ph-plus"></i> Add to Cart</button>`}
          </div>
        </div>
      </article>`;
  }

  function detailHTML(p, headingTag) {
    const out = p.stock === 0;
    return `
      <div class="product-detail-media">
        <img src="${p.img}" alt="${p.name}">
        ${flagsHTML(p)}
      </div>
      <div class="product-detail-info">
        <span class="eyebrow">${catName(p.cat)}</span>
        <${headingTag}>${p.name}</${headingTag}>
        <div class="product-detail-price"><strong>${money(p.price)}</strong><span>/ ${p.unit}</span></div>
        <span class="stock-status ${stockState(p)}">${stockLabel(p)}</span>
        <p>${p.desc}</p>
        <ul class="detail-facts">
          <li><i class="ph ph-barn"></i><div><strong>Farm</strong>${FARMS[p.farm]}</div></li>
          <li><i class="ph ph-calendar-check"></i><div><strong>Harvest</strong>${p.harvest}</div></li>
          <li><i class="ph ph-leaf"></i><div><strong>Growing</strong>${p.practice}</div></li>
          <li><i class="ph ph-snowflake"></i><div><strong>Storage</strong>${p.storage}</div></li>
        </ul>
        <div class="detail-actions" data-detail-actions="${p.id}">
          ${out
            ? '<button type="button" class="btn btn-secondary" disabled>Sold out, back next harvest</button>'
            : `<div class="qty-stepper">
                <button type="button" aria-label="Decrease quantity" data-qty-step="-1"><i class="ph ph-minus"></i></button>
                <output data-qty>1</output>
                <button type="button" aria-label="Increase quantity" data-qty-step="1"><i class="ph ph-plus"></i></button>
              </div>
              <button type="button" class="btn btn-primary" data-add-qty="${p.id}"><i class="ph ph-shopping-cart-simple"></i> Add to Cart</button>`}
        </div>
      </div>`;
  }

  function renderCategories() {
    const counts = id => (id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === id).length);
    $('[data-category-grid]').innerHTML = CATEGORIES.map(c => `
      <button type="button" class="category-tile" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">
        <span class="category-thumb">${c.img ? `<img src="${c.img}" alt="" loading="lazy">` : `<i class="ph ${c.icon}"></i>`}</span>
        <strong>${c.name}</strong>
        <small>${counts(c.id)} products</small>
      </button>`).join('');
    $('[data-category-chips]').innerHTML = CATEGORIES.map(c =>
      `<button type="button" class="shop-chip" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${c.id === 'all' ? 'All' : c.name}</button>`).join('');
  }

  function renderFarmFilter() {
    const select = $('[data-filter-farm]');
    select.insertAdjacentHTML('beforeend', Object.entries(FARMS).map(([id, name]) => `<option value="${id}">${name}</option>`).join(''));
    select.value = state.farm;
  }

  function renderProducts() {
    const q = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter(p =>
      (state.cat === 'all' || p.cat === state.cat) &&
      (state.farm === 'all' || p.farm === state.farm) &&
      (!state.inStock || p.stock > 0) &&
      (!q || (p.name + ' ' + FARMS[p.farm] + ' ' + catName(p.cat)).toLowerCase().includes(q)));

    if (state.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'featured') list = [...list].sort((a, b) => (b.stock > 0) - (a.stock > 0));

    $('[data-product-grid]').innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="shop-empty"><i class="ph ph-magnifying-glass"></i><h3>No products match</h3>
           <p>Try another category or clear your filters.</p>
           <button type="button" class="btn btn-secondary" data-clear-filters style="margin-block-start: var(--space-4);">Clear filters</button></div>`;
    $('[data-results-count]').textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;

    $$('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)));
  }

  function renderCollections() {
    $('[data-best-grid]').innerHTML = PRODUCTS.filter(p => p.best).slice(0, 3).map(cardHTML).join('');
    $('[data-new-grid]').innerHTML = PRODUCTS.filter(p => p.isNew).slice(0, 3).map(cardHTML).join('');
  }

  function renderSpotlight() {
    $('[data-spotlight]').innerHTML = detailHTML(byId[state.spotlight], 'h3');
  }

  // --- Cart ---
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + byId[id].price * qty, 0);

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
  }

  function addToCart(id, qty = 1) {
    const p = byId[id];
    if (!p || p.stock === 0) return;
    cart[id] = Math.min((cart[id] || 0) + qty, p.stock);
    saveCart();
    renderCart();
    toast(`<i class="ph-fill ph-check-circle"></i> ${qty > 1 ? qty + ' × ' : ''}${p.name} added to cart`);
    const fab = $('.cart-fab');
    fab.classList.remove('bump');
    void fab.offsetWidth;
    fab.classList.add('bump');
  }

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id];
    else cart[id] = Math.min(qty, byId[id].stock);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = cartCount();
    $$('[data-cart-count]').forEach(el => { el.textContent = count; });

    const body = $('[data-cart-body]');
    const foot = $('[data-cart-foot]');
    const ids = Object.keys(cart);

    if (!ids.length) {
      body.innerHTML = `<div class="cart-empty"><i class="ph ph-shopping-cart-simple"></i><h3>Your cart is empty</h3>
        <p>Add fresh produce from our partner farms to get started.</p>
        <button type="button" class="btn btn-primary" data-cart-shop>Shop Local Groceries</button></div>`;
      foot.hidden = true;
      return;
    }

    foot.hidden = false;
    body.innerHTML = ids.map(id => {
      const p = byId[id];
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="">
          <div>
            <h4>${p.name}</h4>
            <small>${p.unit} · ${FARMS[p.farm]}</small>
            <div class="qty-stepper qty-stepper--sm">
              <button type="button" aria-label="Decrease ${p.name}" data-cart-step="-1" data-id="${id}"><i class="ph ph-minus"></i></button>
              <output>${cart[id]}</output>
              <button type="button" aria-label="Increase ${p.name}" data-cart-step="1" data-id="${id}"><i class="ph ph-plus"></i></button>
            </div>
          </div>
          <div class="cart-item-side">
            <strong>${money(p.price * cart[id])}</strong>
            <button type="button" class="cart-remove" data-cart-remove="${id}">Remove</button>
          </div>
        </div>`;
    }).join('');

    const subtotal = cartSubtotal();
    const delivery = subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
    $('[data-cart-subtotal]').textContent = money(subtotal);
    $('[data-cart-delivery]').textContent = delivery ? money(delivery) : 'Free';
    $('[data-cart-total]').textContent = money(subtotal + delivery);
    $('[data-cart-free-note]').textContent = delivery
      ? `Add ${money(FREE_DELIVERY_AT - subtotal)} more for free delivery.`
      : 'You\'ve unlocked free delivery!';
    $('[data-cart-progress]').style.width = Math.min(subtotal / FREE_DELIVERY_AT * 100, 100) + '%';
  }

  const drawer = $('[data-cart-drawer]');
  const overlay = $('.cart-overlay');
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.modal-close').focus();
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function checkout() {
    const count = cartCount();
    cart = {};
    saveCart();
    renderCart();
    $('[data-cart-body]').innerHTML = `<div class="cart-empty"><i class="ph-fill ph-check-circle"></i><h3>Order placed!</h3>
      <p>${count} item${count === 1 ? '' : 's'} will be harvested for your next delivery. A confirmation email is on its way.</p>
      <button type="button" class="btn btn-primary" data-cart-shop>Keep Shopping</button></div>`;
  }

  // --- Details modal ---
  const modal = $('[data-product-modal]');

  function openDetails(id) {
    $('[data-modal-body]').innerHTML = detailHTML(byId[id], 'h2');
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // Fallback: show in the spotlight section
      state.spotlight = id;
      renderSpotlight();
      $('#product-details').scrollIntoView({ behavior: 'smooth' });
    }
  }

  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

  // --- Toast ---
  let toastTimer;
  function toast(html) {
    const el = $('[data-toast]');
    el.innerHTML = html;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  // --- Order cutoff countdown (Mon + Thu at 8 PM) ---
  function nextCutoff(now) {
    const options = [1, 4].map(day => {
      const d = new Date(now);
      d.setHours(20, 0, 0, 0);
      d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7));
      if (d <= now) d.setDate(d.getDate() + 7);
      return { date: d, delivery: day === 1 ? 'Wednesday' : 'Saturday', day: day === 1 ? 'Monday' : 'Thursday' };
    });
    return options.sort((a, b) => a.date - b.date)[0];
  }

  function renderCutoff() {
    const now = new Date();
    const next = nextCutoff(now);
    const mins = Math.floor((next.date - now) / 60000);
    const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
    $('[data-cutoff-countdown]').textContent = (d ? d + 'd ' : '') + h + 'h ' + m + 'm';
    $('[data-cutoff-label]').textContent = `Order by ${next.day} 8 PM for ${next.delivery} delivery.`;
  }

  // --- Events ---
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;

    if (t.dataset.cat) {
      state.cat = t.dataset.cat;
      renderProducts();
      if (t.classList.contains('category-tile')) $('#products').scrollIntoView({ behavior: 'smooth' });
    } else if (t.dataset.add) {
      addToCart(t.dataset.add);
    } else if (t.dataset.details) {
      openDetails(t.dataset.details);
    } else if (t.dataset.qtyStep) {
      const out = t.closest('.qty-stepper').querySelector('[data-qty]');
      const id = t.closest('[data-detail-actions]').dataset.detailActions;
      out.textContent = Math.max(1, Math.min(byId[id].stock, +out.textContent + +t.dataset.qtyStep));
    } else if (t.dataset.addQty) {
      const qty = +t.closest('[data-detail-actions]').querySelector('[data-qty]').textContent;
      addToCart(t.dataset.addQty, qty);
      if (modal.open) modal.close();
    } else if (t.hasAttribute('data-cart-open')) {
      openCart();
    } else if (t.hasAttribute('data-cart-close')) {
      closeCart();
    } else if (t.dataset.cartStep) {
      setQty(t.dataset.id, (cart[t.dataset.id] || 0) + +t.dataset.cartStep);
    } else if (t.dataset.cartRemove) {
      setQty(t.dataset.cartRemove, 0);
    } else if (t.hasAttribute('data-cart-shop')) {
      closeCart();
      $('#products').scrollIntoView({ behavior: 'smooth' });
    } else if (t.hasAttribute('data-checkout')) {
      checkout();
    } else if (t.hasAttribute('data-modal-close')) {
      modal.close();
    } else if (t.hasAttribute('data-clear-filters')) {
      Object.assign(state, { cat: 'all', farm: 'all', q: '', inStock: false });
      $('[data-filter-search]').value = '';
      $('[data-filter-farm]').value = 'all';
      $('[data-filter-stock]').checked = false;
      renderProducts();
    }
  });

  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });

  $('[data-filter-search]').addEventListener('input', e => { state.q = e.target.value; renderProducts(); });
  $('[data-filter-farm]').addEventListener('change', e => { state.farm = e.target.value; renderProducts(); });
  $('[data-filter-sort]').addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });
  $('[data-filter-stock]').addEventListener('change', e => { state.inStock = e.target.checked; renderProducts(); });

  // --- Init ---
  renderCategories();
  renderFarmFilter();
  renderProducts();
  renderCollections();
  renderSpotlight();
  renderCart();
  renderCutoff();
  setInterval(renderCutoff, 30000);

  if (params.has('cat') || params.has('farm')) {
    requestAnimationFrame(() => $('#products').scrollIntoView());
  }
})();
