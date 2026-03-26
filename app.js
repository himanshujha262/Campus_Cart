/* ============================================================
   CampusCart — app.js
   All interactivity: listings, modals, chat, toast, nav
   ============================================================ */

/* ── HERO SEARCH → redirects to listings section ────────────── */
function heroSearchRedirect() {
  const q = document.getElementById('heroSearch').value.trim();
  if (q) {
    document.getElementById('searchInput').value = q;
    filterListings();
  }
  document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
}

/* ── DATA ───────────────────────────────────────────────────── */
const listings = [
  { id:1, title:'Engineering Mathematics Vol.2',          cat:'books',       emoji:'📗', bg:'bg-blue-50',   price:'₹180', seller:'Rahul K.',  college:'IIT', desc:'Used once, no highlights. Perfect condition.' },
  { id:2, title:'MacBook Charger 60W',                    cat:'electronics', emoji:'⚡', bg:'bg-green-50',  price:'₹650', seller:'Priya S.',  college:'NIT', desc:'Original Apple charger, works perfectly.' },
  { id:3, title:'Data Structures Notes (Handwritten)',    cat:'notes',       emoji:'📝', bg:'bg-yellow-50', price:'₹120', seller:'Aman T.',   college:'IIT', desc:'Full semester notes with diagrams.' },
  { id:4, title:'Casio Scientific Calculator',            cat:'electronics', emoji:'🔢', bg:'bg-green-50',  price:'₹350', seller:'Sneha R.',  college:'VIT', desc:'FX-991ES Plus, barely used with case.' },
  { id:5, title:'Introduction to Algorithms (CLRS)',      cat:'books',       emoji:'📘', bg:'bg-blue-50',   price:'₹400', seller:'Dev M.',    college:'IIT', desc:'3rd edition, minor pencil marks only.' },
  { id:6, title:'Desk Lamp (LED)',                        cat:'essentials',  emoji:'💡', bg:'bg-red-50',    price:'₹220', seller:'Anjali P.', college:'NIT', desc:'USB-powered, adjustable brightness.' },
  { id:7, title:'Organic Chemistry by Morrison',          cat:'books',       emoji:'📙', bg:'bg-blue-50',   price:'₹300', seller:'Kiran B.', college:'IIT', desc:'Good condition, some highlighting.' },
  { id:8, title:'Laptop Backpack',                        cat:'essentials',  emoji:'🎒', bg:'bg-red-50',    price:'₹450', seller:'Rohan V.', college:'VIT', desc:'15.6 inch fit, minimal use, black.' },
  { id:9, title:'Arduino Uno Kit',                        cat:'electronics', emoji:'🤖', bg:'bg-green-50',  price:'₹520', seller:'Nikhil D.',college:'IIT', desc:'Complete kit with sensors, last semester.' },
];

let activeFilter = 'all';

/* ── RENDER LISTINGS ────────────────────────────────────────── */
function renderListings(data) {
  const grid = document.getElementById('listingsGrid');

  if (!data.length) {
    grid.innerHTML = `<div class="col-span-4 text-center py-16 text-slate-400 text-sm">No listings found. Try a different search.</div>`;
    return;
  }

  grid.innerHTML = data.map(l => `
    <div onclick="openListing(${l.id})" class="listing-card">
      <div class="${l.bg} h-44 flex items-center justify-center relative rounded-t-2xl">
        <span class="text-6xl">${l.emoji}</span>
        <span class="absolute top-3 left-3 bg-white text-slate-600 font-mono-j text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg border border-slate-200">${l.college}</span>
        <span class="absolute top-3 right-3 bg-slate-900 text-white font-mono-j text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg">${l.cat}</span>
      </div>
      <div class="p-4">
        <h3 class="font-serif text-[15px] font-bold text-slate-900 mb-1 leading-snug">${l.title}</h3>
        <p class="text-xs text-slate-400 mb-3 leading-relaxed">${l.desc}</p>
        <div class="flex justify-between items-center">
          <span class="font-serif text-lg font-bold text-slate-900">${l.price}</span>
          <span class="text-xs text-slate-400">${l.seller}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── FILTER PILLS ───────────────────────────────────────────── */
function setFilter(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active-pill'));
  if (btn) btn.classList.add('active-pill');
  filterListings();
}

/* ── SEARCH + FILTER ────────────────────────────────────────── */
function filterListings() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderListings(
    listings.filter(l => {
      const matchCat = activeFilter === 'all' || l.cat === activeFilter;
      const matchQ   = !q || l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    })
  );
}

/* ── LISTING DETAIL MODAL ───────────────────────────────────── */
function openListing(id) {
  const l = listings.find(x => x.id === id);
  if (!l) return;

  document.getElementById('modalContent').innerHTML = `
    <div class="${l.bg} rounded-xl flex items-center justify-center text-7xl h-40 mb-6">${l.emoji}</div>
    <p class="font-mono-custom text-[10px] tracking-widest uppercase mb-2" style="color:#3b9ede">${l.cat} · ${l.college}</p>
    <h3 class="font-display text-2xl font-bold text-slate-900 mb-2">${l.title}</h3>
    <p class="text-sm text-slate-500 mb-6 leading-relaxed">${l.desc}</p>
    <div class="flex justify-between items-center mb-6">
      <span class="font-display text-3xl font-bold text-blue-600">${l.price}</span>
      <span class="text-sm text-slate-500">Seller: <strong class="text-slate-900">${l.seller}</strong></span>
    </div>
    <button
      onclick="showToast('Message sent to ${l.seller}!'); closeModal()"
      class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors font-display">
      💬 Message Seller
    </button>
  `;
  showOverlay();
}

/* ── MODAL TEMPLATES ────────────────────────────────────────── */
const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm bg-slate-50 focus:bg-white focus:border-slate-400 transition-colors font-sans';

const modalTemplates = {

  signup: `
    <h3 class="font-serif text-2xl font-bold text-slate-900 mb-1">Create Account</h3>
    <p class="text-sm text-slate-500 mb-7">Use your college email to get verified instantly.</p>
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
        <input type="text" placeholder="Your name" class="${inputCls}"/>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">College Email</label>
        <input type="email" placeholder="you@college.edu.in" class="${inputCls}"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
          <input type="password" placeholder="••••••••" class="${inputCls}"/>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Confirm</label>
          <input type="password" placeholder="••••••••" class="${inputCls}"/>
        </div>
      </div>
      <button
        onclick="showToast('Account created! Check your email.'); closeModal()"
        class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors font-display mt-2">
        Create Account →
      </button>
      <p class="text-center text-xs text-slate-400">
        Already have an account?
        <a href="#" onclick="openModal('login'); return false" style="color:#3b9ede" class="font-semibold">Log in</a>
      </p>
    </div>`,

  login: `
    <h3 class="font-display text-2xl font-bold text-slate-900 mb-1">Welcome Back</h3>
    <p class="text-sm text-slate-500 mb-7">Sign in to your CampusCart account.</p>
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">College Email</label>
        <input type="email" placeholder="you@college.edu.in" class="${inputCls}"/>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
        <input type="password" placeholder="••••••••" class="${inputCls}"/>
      </div>
      <button
        onclick="showToast('Logged in successfully!'); closeModal()"
        class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors font-display mt-2">
        Log In →
      </button>
      <p class="text-center text-xs text-slate-400">
        New here?
        <a href="#" onclick="openModal('signup'); return false" style="color:#3b9ede" class="font-semibold">Create account</a>
      </p>
    </div>`,

  sell: `
    <h3 class="font-display text-2xl font-bold text-slate-900 mb-1">Post a Listing</h3>
    <p class="text-sm text-slate-500 mb-7">Sell your stuff to campus students.</p>
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
        <input type="text" placeholder="e.g. Engineering Mathematics Vol 1" class="${inputCls}"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
          <select class="${inputCls}">
            <option>Books</option>
            <option>Electronics</option>
            <option>Notes</option>
            <option>Essentials</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Price (₹)</label>
          <input type="number" placeholder="250" class="${inputCls}"/>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
        <textarea placeholder="Condition, edition, details…" rows="3" class="${inputCls} resize-none"></textarea>
      </div>
      <button
        onclick="showToast('Listing posted successfully!'); closeModal()"
        class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors font-display mt-2">
        Post Listing →
      </button>
    </div>`,
};

/* ── MODAL CONTROLS ─────────────────────────────────────────── */
function openModal(type) {
  document.getElementById('modalContent').innerHTML = modalTemplates[type] || '';
  showOverlay();
}

function showOverlay() {
  document.getElementById('modalOverlay').classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('modalBox').classList.remove('translate-y-5');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('modalBox').classList.add('translate-y-5');
}

function closeOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ── CHAT ───────────────────────────────────────────────────── */
const chatReplies = [
  'Post a listing by clicking "+ Post a Listing" above.',
  'Your college email auto-verifies your campus identity.',
  'Search by keyword or filter by category to find items.',
  'All chats are real-time and private between buyer and seller.',
  'Mark your listing as Sold once the deal is done.',
  'We support all colleges — just use your institutional email.',
];

function initChat() {
  const box = document.getElementById('chatMessages');
  box.innerHTML = `
    <div class="bubble-in bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] self-start shadow-sm">
      👋 Hi! Welcome to CampusCart.
    </div>
    <div class="bubble-in bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] self-start shadow-sm" style="animation-delay:.2s">
      How can I help you today?
    </div>
  `;
}

function toggleChat() {
  const panel = document.getElementById('chatPanel');
  const isOpen = !panel.classList.contains('opacity-0');
  if (isOpen) {
    panel.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
    panel.classList.remove('scale-100');
  } else {
    panel.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
    panel.classList.add('scale-100');
  }
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;

  const box = document.getElementById('chatMessages');
  box.innerHTML += `
    <div class="bubble-in text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm"
         style="background:#1d4ed8; align-self:flex-end">
      ${msg}
    </div>
  `;
  inp.value = '';
  box.scrollTop = box.scrollHeight;

  setTimeout(() => {
    const reply = chatReplies[Math.floor(Math.random() * chatReplies.length)];
    box.innerHTML += `
      <div class="bubble-in bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
        ${reply}
      </div>
    `;
    box.scrollTop = box.scrollHeight;
  }, 750);
}

/* ── TOAST ──────────────────────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none'), 3000);
}

/* ── MOBILE MENU ────────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── INIT ───────────────────────────────────────────────────── */
renderListings(listings);
initChat();
