// ============================================================
// DATA: Harga & Ketersediaan Item
// ============================================================

const itemPrices = {
    "Hydropack": 10000,
    "Tracking Pole": 10000,
    "Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)": 35000,
    "Tenda Kapasitas 4–5 (Tendaki Borneo 4)": 29000,
    "Tenda Kapasitas 4–5 (Wildshell Jayadipa)": 29000,
    "Carrier 60L (Arei Toba 60L)": 15000,
    "Kursi Lipat": 9000,
    "Meja Lipat": 9000,
    "Tripod Kecil": 8000,
    "Grill Pan": 10000,
    "Kompor Kecil": 9000,
    "Kompor Besar": 12000,
    "Cooking Set / Nesting 4 in 1": 13000,
    "Cooking Set / Nesting 3 in 1": 13000,
    "Tripod Besar": 15000,
    "Sleeping Bag Polar Biasa": 8000,
    "Sleeping Bag Polar Bulu": 10000,
    "Flysheet 3x4": 10000,
    "Kuas": 3000,
    "Bantal Tiup": 3000,
    "Matras Spon": 4000,
    "Lampu Tenda": 5000,
    "Headlamp Baterai": 5000,
    "Headlamp Charge": 5000,
    "Tiang Flysheet": 5000,
    "Capit": 3000,
    "Paket Hemat 1": 25000,
    "Paket Hemat 2": 30000,
    "Paket Hemat 3": 35000,
    "Paket Hemat 4": 40000,
    "Paket Hemat 5": 45000,
    "Paket Hemat 6": 65000
};

const itemAvailability = {
    "Lampu Tenda": 6,
    "Tracking Pole": 5,
    "Matras Spon": 6,
    "Kursi Lipat": 10,
    "Meja Lipat": 5,
    "Headlamp Baterai": 3,
    "Headlamp Charge": 4,
    "Cooking Set / Nesting 4 in 1": 3,
    "Cooking Set / Nesting 3 in 1": 3,
    "Kompor Kecil": 4,
    "Kompor Besar": 2,
    "Tripod Kecil": 2,
    "Tripod Besar": 2,
    "Kursi 2 in 1": 2,
    "Sleeping Bag Polar Biasa": 2,
    "Sleeping Bag Polar Bulu": 4,
    "Flysheet 3x4": 1,
    "Tiang Flysheet": 2,
    "Hydropack": 2,
    "Capit": 3,
    "Kuas": 3,
    "Carrier 60L (Arei Toba 60L)": 2,
    "Carrier 35L": 1,
    "Tenda Kapasitas 4–5 (Tendaki Borneo 4)": 3,
    "Tenda Kapasitas 4–5 (Wildshell Jayadipa)": 3,
    "Tenda Kapasitas 6–8 (Great Outdoors Drifter 4)": 1,
    "Grill Pan": 2,
    "Bantal Tiup": 6
};

const packagePrices = {
    "Paket Hemat 1 - Rp 25.000/hari": 25000,
    "Paket Hemat 2 - Rp 30.000/hari": 30000,
    "Paket Hemat 3 - Rp 35.000/hari": 35000,
    "Paket Hemat 4 - Rp 40.000/hari": 40000,
    "Paket Hemat 5 - Rp 45.000/hari": 45000,
    "Paket Hemat 6 - Rp 65.000/hari": 65000
};

/* =============================================================
   booking.js — Empyreal Outdoor

   FIX v2:
   • Total estimasi = 0  → updateTotal() di-expose ke window agar
     oninput="updateTotal(...)" di HTML bisa memanggil saat defer.
   • Keranjang tampil kosong → cartSummary diupdate dari array cart
     yang sama (satu sumber kebenaran).
   • Hapus blur overlay → panel ditutup klik di luar, tanpa overlay.
   ============================================================= */

const MAX_CART_UNIQUE_ITEMS = 99;
let cart = []; // [{ name, price, qty, maxQty }]

// Expose ke window — HTML pakai onclick/oninput inline (defer bisa telat)
window.changeQty      = changeQty;
window.addToCart      = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart      = clearCart;
window.updateTotal    = updateTotal;
window.switchTab      = switchTab;
window.scrollToBookingForm = scrollToBookingForm;

/* ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  ['tgl-satuan','tgl-paket'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('min', today);
  });
  initHamburger();
  initFadeUpObserver();
  initFloatingCart();
  initTabSwitch();
  initFormSubmit();
  initPhoneNumberValidation();
  initFadeInAnimations();
  initSmoothScrolling();
  renderCart();
});

/* ===== HAMBURGER ===== */
function initHamburger() {
  const h = document.getElementById('hamburger');
  const n = document.getElementById('mobileNav');
  if (!h || !n) return;
  h.addEventListener('click', () => { h.classList.toggle('open'); n.classList.toggle('open'); });
}

/* ===== FADE-UP ===== */
function initFadeUpObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* ===== TAB SWITCH ===== */
function initTabSwitch() {
  const ts = document.getElementById('tabSatuan');
  const tp = document.getElementById('tabPaket');
  if (ts) ts.addEventListener('click', () => switchTab('satuan'));
  if (tp) tp.addEventListener('click', () => switchTab('paket'));
}

function switchTab(tab) {
  const ss = document.getElementById('satuanSection');
  const ps = document.getElementById('paketSection');
  const ts = document.getElementById('tabSatuan');
  const tp = document.getElementById('tabPaket');
  if (ss) ss.style.display = tab === 'satuan' ? 'block' : 'none';
  if (ps) ps.style.display = tab === 'paket'  ? 'block' : 'none';
  if (ts) ts.classList.toggle('active', tab === 'satuan');
  if (tp) tp.classList.toggle('active', tab === 'paket');
  renderCart();
}

/* ===== QUANTITY +/- ===== */
function changeQty(btn, delta) {
  const ctrl  = btn.closest('.qty-ctrl');
  const input = ctrl.querySelector('.qty-input');
  const val   = parseInt(input.value) + delta;
  const min   = parseInt(input.min) || 1;
  const max   = parseInt(input.max) || 99;
  input.value = Math.min(Math.max(val, min), max);
}

/* ===== ADD TO CART ===== */
function addToCart(btn, name, price) {
  const card     = btn.closest('.price-card, .paket-card');
  const qtyInput = card ? card.querySelector('.qty-input') : null;
  const qty      = qtyInput ? parseInt(qtyInput.value) : 1;
  const maxQty   = qtyInput ? (parseInt(qtyInput.max) || 99) : 99;

  const existing = cart.find(i => i.name === name);
  if (existing) {
    const newQty = existing.qty + qty;
    if (newQty > existing.maxQty) {
      showToastWarning(name, existing.maxQty);
      existing.qty = existing.maxQty;
    } else {
      existing.qty = newQty;
    }
  } else {
    if (cart.length >= MAX_CART_UNIQUE_ITEMS) {
      showToastError('Maksimal ' + MAX_CART_UNIQUE_ITEMS + ' jenis produk di keranjang!');
      return;
    }
    cart.push({ name, price, qty: Math.min(qty, maxQty), maxQty });
  }

  btn.classList.add('added');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
  setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1800);

  renderCart();
  showToast(name, qty);
  openFloatingCart();
}

/* ===== REMOVE & CLEAR ===== */
function removeFromCart(idx) { cart.splice(idx, 1); renderCart(); }
function clearCart() { cart = []; renderCart(); }

/* ===== RENDER CART ===== */
function renderCart() {
  const container   = document.getElementById('cartItems');
  const countEl     = document.getElementById('cartCount');
  const totalDayEl  = document.getElementById('cartTotalPerDay');
  const badgeEl     = document.getElementById('floatingCartBadge');

  const totalQty    = cart.reduce((s, i) => s + i.qty, 0);
  const totalPerDay = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (badgeEl) { badgeEl.textContent = totalQty; badgeEl.style.display = totalQty > 0 ? 'flex' : 'none'; }
  if (countEl) countEl.textContent = totalQty;
  if (totalDayEl) totalDayEl.textContent = formatRp(totalPerDay);

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = '<div class="cart-empty"><i class="fas fa-cart-shopping"></i>Keranjang masih kosong.<br>Tambahkan peralatan dari daftar.</div>';
    } else {
      let html = '<div class="cart-items">';
      cart.forEach((item, idx) => {
        html += '<div class="cart-item">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-qty">\xd7' + item.qty + '</div>' +
          '<div class="cart-item-price">' + formatRp(item.price * item.qty) + '</div>' +
          '<button class="cart-item-del" onclick="removeFromCart(' + idx + ')" title="Hapus"><i class="fas fa-times"></i></button>' +
          '</div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }
  }

  // Update ringkasan di form booking
  updateCartSummaryForm();
  // Update total estimasi
  updateTotal('satuan');
  updateTotal('paket');
}

/* ===== CART SUMMARY IN FORM ===== */
function updateCartSummaryForm() {
  ['Satuan','Paket'].forEach(type => {
    const el = document.getElementById('cartSummary' + type);
    if (!el) return;
    if (cart.length === 0) {
      el.innerHTML = '<div class="cart-sum-empty">Belum ada barang. Tambahkan dari daftar di atas.</div>';
      return;
    }
    el.innerHTML = cart.map(item =>
      '<div class="cart-sum-item"><span>' + item.name + ' \xd7' + item.qty + '</span>' +
      '<span>' + formatRp(item.price * item.qty) + '/hari</span></div>'
    ).join('');
  });
}

/* ===== UPDATE TOTAL ESTIMASI ===== */
function updateTotal(type) {
  const lamaEl  = document.getElementById('lama-' + type);
  const totalEl = document.getElementById('total' + (type === 'satuan' ? 'Satuan' : 'Paket'));
  if (!lamaEl || !totalEl) return;

  const lama = parseInt(lamaEl.value);
  const perDay = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  if (!lama || lama <= 0) {
    totalEl.textContent = "Pilih lama sewa"; // Jangan tampilin Rp 0 biar gak bingung
    return;
  }

  totalEl.textContent = formatRp(perDay * lama);
}

/* ===== FORMAT RUPIAH ===== */
function formatRp(num) { return 'Rp ' + num.toLocaleString('id-ID'); }

/* ===== TOAST ===== */
function showToast(name, qty) { _toast('Berhasil ditambahkan!', name + ' \xd7' + qty + ' masuk ke keranjang.', ''); }
function showToastWarning(name, max) { _toast('Stok terbatas!', name + ' sudah maksimum (' + max + ' unit).', 'toast-warning'); }
function showToastError(msg) { _toast('Tidak dapat ditambahkan', msg, 'toast-error'); }
function showToast(name, qty) {
  _toast('Berhasil ditambahkan!', name + ' ×' + qty + ' masuk ke keranjang.');
}

function showToastWarning(name, max) {
  _toast('Stok terbatas!', name + ' sudah maksimum (' + max + ' unit).', 'toast-warning');
}

function showToastError(msg) {
  _toast('Tidak dapat ditambahkan', msg, 'toast-error');
}

function showToast(name, qty) {
  safeToast('Berhasil ditambahkan!', name + ' ×' + qty + ' masuk ke keranjang.');
}
function showToastWarning(name, max) {
  safeToast('Stok terbatas!', name + ' sudah maksimum (' + max + ' unit).', 'toast-warning');
}
function showToastError(msg) {
  safeToast('Tidak dapat ditambahkan', msg, 'toast-error');
}

function safeToast(title, body, className) {
  // Hindari error total – jika toast gagal, diamkan saja
  try {
    const toastEl = document.getElementById('toast');
    if (!toastEl) return;

    const titleEl = document.getElementById('toastTitle');
    const bodyEl = document.getElementById('toastBody');
    if (titleEl) titleEl.innerText = title;
    if (bodyEl) bodyEl.innerText = body;

    // Reset class dengan aman (tanpa menghapus semua class)
    toastEl.style.display = 'flex';
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateY(0)';

    // Jika mau tambah class khusus (warning/error) – amankan
    if (className) {
      toastEl.classList.add(className);
    }

    // Hapus timeout sebelumnya
    if (toastEl._hideTimeout) clearTimeout(toastEl._hideTimeout);
    toastEl._hideTimeout = setTimeout(() => {
      try {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(100px)';
        if (className) toastEl.classList.remove(className);
        setTimeout(() => {
          if (toastEl) toastEl.style.display = 'none';
        }, 400);
      } catch(e) {}
    }, 3000);
  } catch (err) {
    // Jangan biarkan error mengganggu aplikasi utama
    console.warn('Toast gagal ditampilkan:', err);
  }
}

/* ============================================================= */
/*  FLOATING CART — tanpa overlay blur                            */
/* ============================================================= */
function initFloatingCart() {
  injectFloatingCartHTML();
  injectFloatingCartStyles();

  const trigger = document.getElementById('floatingCartTrigger');
  const close   = document.getElementById('floatingCartClose');

  if (trigger) trigger.addEventListener('click', e => { e.stopPropagation(); toggleFloatingCart(); });
  if (close)   close.addEventListener('click',   e => { e.stopPropagation(); closeFloatingCart(); });

  // Klik di luar panel → tutup
  document.addEventListener('click', e => {
    const panel   = document.getElementById('floatingCartPanel');
    const trigger = document.getElementById('floatingCartTrigger');
    if (!panel || !panel.classList.contains('open')) return;
    if (!panel.contains(e.target) && trigger && !trigger.contains(e.target)) closeFloatingCart();
  });

  renderCart();
}

function injectFloatingCartHTML() {
  if (document.getElementById('floatingCartTrigger')) return;
  const html = '' +
    '<button id="floatingCartTrigger" class="fc-trigger" aria-label="Buka keranjang sewa">' +
      '<i class="fas fa-shopping-cart"></i>' +
      '<span id="floatingCartBadge" class="fc-badge" style="display:none;">0</span>' +
    '</button>' +
    '<div id="floatingCartPanel" class="fc-panel" role="dialog" aria-label="Keranjang Sewa">' +
      '<div class="fc-handle-bar"></div>' +
      '<div class="fc-panel-header">' +
        '<div class="fc-panel-header-left">' +
          '<i class="fas fa-shopping-cart" style="color:var(--sky);"></i>' +
          '<h3 class="fc-panel-title">Keranjang Sewa</h3>' +
          '<div class="cart-count" id="cartCount">0</div>' +
        '</div>' +
        '<button id="floatingCartClose" class="fc-close-btn"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="fc-panel-body">' +
        '<div id="cartItems">' +
          '<div class="cart-empty"><i class="fas fa-cart-shopping"></i>Keranjang masih kosong.<br>Tambahkan peralatan dari daftar.</div>' +
        '</div>' +
      '</div>' +
      '<div class="fc-panel-footer">' +
        '<hr class="cart-divider">' +
        '<div class="cart-total-row">' +
          '<span class="cart-total-label">Total per hari</span>' +
          '<span class="cart-total-val" id="cartTotalPerDay">Rp 0</span>' +
        '</div>' +
        '<div class="cart-note">*Total akhir = total/hari \xd7 lama sewa</div>' +
        '<button class="fc-clear-btn" onclick="clearCart()"><i class="fas fa-trash-alt"></i> Hapus Semua</button>' +
        '<button class="fc-booking-btn" onclick="scrollToBookingForm()"><i class="fas fa-arrow-down"></i> Booking Sekarang</button>' +
      '</div>' +
    '</div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

function injectFloatingCartStyles() {
  if (document.getElementById('floatingCartStyles')) return;
  const css = `
    .fc-trigger{position:fixed;bottom:28px;right:28px;z-index:1200;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--blue-deep),var(--blue));border:none;cursor:pointer;box-shadow:0 6px 24px rgba(14,165,233,.45),0 2px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#fff;transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
    .fc-trigger:hover{transform:scale(1.1);box-shadow:0 10px 32px rgba(14,165,233,.55)}
    .fc-trigger:active{transform:scale(.95)}
    .fc-badge{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;background:#EF4444;color:#fff;font-size:.68rem;font-weight:800;border-radius:100px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:'Plus Jakarta Sans',sans-serif;line-height:1}
    .fc-panel{position:fixed;bottom:96px;right:16px;z-index:1200;width:340px;max-height:70vh;background:var(--white);border-radius:20px;border:1.5px solid var(--gray-200);box-shadow:0 16px 48px rgba(14,165,233,.2),0 4px 16px rgba(0,0,0,.12);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .25s ease,transform .25s cubic-bezier(.34,1.56,.64,1);transform-origin:bottom right}
    .fc-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all}
    .fc-handle-bar{width:36px;height:4px;background:var(--gray-200);border-radius:2px;margin:10px auto 0;flex-shrink:0}
    .fc-panel-header{padding:14px 18px;background:linear-gradient(135deg,var(--navy),var(--blue-deep));display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
    .fc-panel-header-left{display:flex;align-items:center;gap:10px}
    .fc-panel-title{font-family:'Poppins',sans-serif;color:#fff;font-size:1rem;font-weight:800}
    .fc-close-btn{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:background .2s}
    .fc-close-btn:hover{background:rgba(255,255,255,.3)}
    .fc-panel-body{flex:1;overflow-y:auto;padding:14px 16px 4px;min-height:80px}
    .fc-panel-body::-webkit-scrollbar{width:4px}
    .fc-panel-body::-webkit-scrollbar-track{background:var(--gray-100);border-radius:4px}
    .fc-panel-body::-webkit-scrollbar-thumb{background:var(--sky-mid);border-radius:4px}
    .fc-panel-footer{padding:0 16px 16px;flex-shrink:0}
    .fc-clear-btn{display:flex;align-items:center;gap:6px;width:100%;justify-content:center;padding:9px;margin-top:8px;border-radius:8px;background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;font-size:.8rem;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:background .2s}
    .fc-clear-btn:hover{background:#FEE2E2}
    .fc-booking-btn{display:flex;align-items:center;gap:6px;width:100%;justify-content:center;padding:11px;margin-top:8px;border-radius:8px;background:linear-gradient(135deg,var(--blue-deep),var(--blue));color:#fff;border:none;font-size:.875rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;transition:opacity .2s,transform .2s;box-shadow:0 4px 14px rgba(14,165,233,.35)}
    .fc-booking-btn:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 6px 20px rgba(14,165,233,.45)}
    .fc-booking-btn:active{transform:translateY(0)}
    .toast.toast-warning .toast-icon{background:#F59E0B}
    .toast.toast-error   .toast-icon{background:#EF4444}
    .sidebar{display:none!important}
    .main-layout{grid-template-columns:1fr!important}
    @media(max-width:480px){.fc-panel{width:calc(100vw - 24px);right:12px;bottom:90px}.fc-trigger{bottom:20px;right:20px;width:52px;height:52px}}
  `;
  const style = document.createElement('style');
  style.id = 'floatingCartStyles';
  style.textContent = css;
  document.head.appendChild(style);
}

function openFloatingCart()  { document.getElementById('floatingCartPanel')?.classList.add('open'); }
function closeFloatingCart() { document.getElementById('floatingCartPanel')?.classList.remove('open'); }
function toggleFloatingCart() {
  const p = document.getElementById('floatingCartPanel');
  if (!p) return;
  p.classList.contains('open') ? closeFloatingCart() : openFloatingCart();
}

function scrollToBookingForm() {
  closeFloatingCart();
  // Scroll ke form yang aktif sesuai tab
  const satuanVisible = document.getElementById('satuanSection')?.style.display !== 'none';
  const targetId = satuanVisible ? 'formSatuanCard' : 'formPaketCard';
  const el = document.getElementById(targetId) || document.querySelector('.booking-card');
  if (el) {
    const offset = 90; // kompensasi navbar sticky
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ============================================================= */
/*  FORM SUBMIT                                                   */
/* ============================================================= */
function initFormSubmit() {
  document.getElementById('bookingFormSatuan')?.addEventListener('submit', e => { e.preventDefault(); submitBooking('satuan'); });
  document.getElementById('bookingFormPaket')?.addEventListener('submit',  e => { e.preventDefault(); submitBooking('paket'); });
}

function submitBooking(type) {
  const s    = type;
  const g    = id => document.getElementById(id)?.value?.trim() ?? '';
  const nama = g('nama-'+s), wa = g('wa-'+s), alamat = g('alamat-'+s),
        dest = g('dest-'+s), jam = g('jam-'+s),
        tgl  = document.getElementById('tgl-'+s)?.value ?? '',
        lama = document.getElementById('lama-'+s)?.value ?? '0';

  if (cart.length === 0) { alert('Keranjang masih kosong! Tambahkan peralatan terlebih dahulu.'); return; }

  const lamaInt  = parseInt(lama) || 0;
  if (lamaInt <= 0) { alert('Mohon isi lama sewa terlebih dahulu.'); return; }

  const itemList = cart.map(i => '\u2022 ' + i.name + ' \xd7' + i.qty + ' (' + formatRp(i.price * i.qty) + '/hari)').join('\n');
  const perDay   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = formatRp(perDay * lamaInt);
  const tipe     = type === 'satuan' ? 'Sewa Satuan' : 'Paket Hemat';

  const msg = encodeURIComponent(
    'Halo Empyreal Outdoor, saya ingin booking peralatan:\n\n' +
    '\ud83d\udccb *FORM BOOKING \u2014 ' + tipe.toUpperCase() + '*\n' +
    '\ud83d\udc64 Nama: ' + nama + '\n\ud83d\udcf1 WhatsApp: ' + wa +
    '\n\ud83c\udfe0 Alamat: ' + alamat + '\n\ud83c\udfd4\ufe0f Destinasi: ' + dest +
    '\n\ud83d\udcc5 Tanggal Sewa: ' + tgl + '\n\u23f0 Jam Pengambilan: ' + jam +
    '\n\ud83d\udcc6 Lama Sewa: ' + lama + ' hari\n\n' +
    '\ud83c\udf92 *Barang yang Disewa:*\n' + itemList + '\n\n' +
    '\ud83d\udcb0 *Total Estimasi: ' + total + '*\n\nMohon dikonfirmasi ketersediaannya. Terima kasih!'
  );

  window.open('https://wa.me/6282139024372?text=' + msg, '_blank');

  const items    = cart.map(i => ({ barang: i.name, jumlah: String(i.qty) }));
  const totalRaw = perDay * lamaInt;
  sendDataToGoogleAppsScript(nama, wa, alamat, dest, jam, items, lamaInt, tgl, totalRaw, tipe);
}

/* ============================================================= */
/*  GOOGLE APPS SCRIPT                                            */
/* ============================================================= */
function sendDataToGoogleAppsScript(nama, whatsapp, alamat, destinasi, jamAmbil, items, lama, tanggal, total, type) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwd7Mecm2SFDGDX6u72J5k_kT8M8GM3OCNjxvvPCIQppH-w6P8ygkzCSjpnYhqtbP-3/exec';
  const fd = new FormData();
  fd.append('name',           nama);
  fd.append('contact_number', whatsapp);
  fd.append('alamat',         alamat);
  fd.append('destinasi',      destinasi);
  fd.append('jam_ambil',      jamAmbil);
  fd.append('lama_sewa',      lama);
  fd.append('rental_date',    tanggal);
  fd.append('price',          total);
  fd.append('type',           type);
  fd.append('items',          items.map(i => i.barang + ' (' + i.jumlah + ' unit)').join(', '));
  fd.append('timestamp',      new Date().toISOString().slice(0,19).replace('T',' '));
  fetch(scriptURL, { method:'POST', body:fd })
    .then(r => { if (r.ok) { console.log('Terkirim ke GAS'); alert('Pesanan berhasil dikirim! Kami akan segera menghubungi Anda melalui WhatsApp.'); } else throw new Error(); })
    .catch(() => alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.'));
}

// ============================================================
// PHONE NUMBER VALIDATION
// ============================================================

function initPhoneNumberValidation() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            let pastedData = (e.clipboardData || window.clipboardData).getData('text');
            pastedData = pastedData.replace(/\D/g, '');
            document.execCommand('insertText', false, pastedData);
        });
    });
}

// ============================================================
// PARSE & VALIDATE FLEXIBLE TIME
// ============================================================

function parseFlexibleTime(timeInput) {
    const cleanTime = timeInput.replace(/[^0-9]/g, '');
    if (cleanTime.length === 3) {
        return { hours: parseInt(cleanTime.substring(0, 1)), minutes: parseInt(cleanTime.substring(1, 3)), isValid: true };
    } else if (cleanTime.length === 4) {
        return { hours: parseInt(cleanTime.substring(0, 2)), minutes: parseInt(cleanTime.substring(2, 4)), isValid: true };
    } else if (cleanTime.length === 1 || cleanTime.length === 2) {
        return { hours: parseInt(cleanTime.substring(0, 2)), minutes: 0, isValid: true };
    }
    return { hours: 0, minutes: 0, isValid: false };
}

function validateFlexibleTime(timeInput) {
    const parsed = parseFlexibleTime(timeInput);
    if (!parsed.isValid) return false;
    if (parsed.hours < 0 || parsed.hours > 23 || parsed.minutes < 0 || parsed.minutes > 59) return false;
    return true;
}

// ============================================================
// SMOOTH SCROLLING
// ============================================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

// ============================================================
// SHOW NOTIFICATION (popup soft setelah add to cart)
// ============================================================

function showNotification(message, itemName, itemPrice, itemType) {
    const existingNotification = document.getElementById('cart-notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button id="langsung-booking" class="btn-primary">Langsung Booking</button>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    const langsungBookingBtn = notification.querySelector('#langsung-booking');
    if (langsungBookingBtn) {
        langsungBookingBtn.addEventListener('click', function() {
            const bookingSection = document.getElementById('booking');
            if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
            notification.classList.remove('show');
            setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
        });
    }

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }, 3000);
}

// ============================================================
// FADE-IN ANIMATIONS (versi lengkap dengan fallback scroll)
// ============================================================

function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('appear');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(element => observer.observe(element));

    function checkFadeElements() {
        fadeElements.forEach(el => {
            if (el.classList.contains('appear')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < (window.innerHeight || document.documentElement.clientHeight) - 50 && rect.bottom > 50) {
                el.classList.add('appear');
            }
        });
    }
    setTimeout(checkFadeElements, 250);
    window.addEventListener('scroll', checkFadeElements, { passive: true });
    window.addEventListener('resize', checkFadeElements);
}
