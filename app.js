/* ============================================================
   CampusCart — app.js
   Integrated with Spring Boot Backend
   ============================================================ */

// ── STATE ───────────────────────────────────────────────────
let authState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
};

let allProducts = [];
let activeFilter = 'all';

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchProducts();
});

// ── UI UPDATES ───────────────────────────────────────────────
function updateUI() {
    const navAuth = document.getElementById('navAuth');
    if (authState.token) {
        navAuth.innerHTML = `
            <span class="hidden md:block text-sm text-slate-500 font-medium">Hi, ${authState.user.username || 'Student'}</span>
            <button onclick="handleLogout()" class="text-sm text-rose-600 hover:text-rose-800 font-semibold transition-colors">Logout</button>
        `;
    } else {
        navAuth.innerHTML = `
            <button onclick="openModal('login')" class="hidden md:block text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">Log in</button>
            <button onclick="openModal('signup')" class="bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">Get Started</button>
        `;
    }
}

// ── API ACTIONS ──────────────────────────────────────────────
async function fetchProducts() {
    const grid = document.getElementById('listingsGrid');
    grid.innerHTML = '<div class="col-span-4 text-center py-16 text-slate-400 text-sm italic">Loading products...</div>';
    
    try {
        const products = await api.products.getAll();
        allProducts = products;
        renderListings(products);
    } catch (error) {
        grid.innerHTML = '<div class="col-span-4 text-center py-16 text-rose-500 text-sm italic">Error loading products. Make sure the backend is running.</div>';
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await api.auth.login({ email, password });
        authState.token = data.token;
        authState.user = { id: data.userId, username: data.userName, tenantId: data.tenantId };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(authState.user));
        
        showToast('Successfully logged in!');
        closeModal();
        updateUI();
        fetchProducts(); 
    } catch (error) {
        showToast('Login failed: ' + error.message);
    }
}

async function handleSignup() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    let tenantCode = document.getElementById('regTenant').value;

    try {
        if (tenantCode === 'OTHER') {
            const newName = document.getElementById('newTenantName').value;
            const newCode = document.getElementById('newTenantCode').value;
            if (!newName || !newCode) throw new Error('Please fill in new college details');
            
            const newTenant = await api.tenants.create({ name: newName, code: newCode });
            tenantCode = newTenant.code;
            showToast('New college registered!');
        }

        const data = await api.auth.register({ name, email, password, tenantCode });
        authState.token = data.token;
        authState.user = { id: data.userId, username: data.userName, tenantId: data.tenantId };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(authState.user));
        
        showToast('Account created successfully!');
        closeModal();
        updateUI();
        fetchProducts();
    } catch (error) {
        showToast('Registration failed: ' + error.message);
    }
}

function handleLogout() {
    authState.token = null;
    authState.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUI();
    fetchProducts();
    showToast('Logged out');
}

async function handleCreateProduct() {
    if (!authState.token) {
        showToast('Please login to post a listing');
        openModal('login');
        return;
    }

    const title = document.getElementById('prodTitle').value;
    const category = document.getElementById('prodCat').value;
    const price = document.getElementById('prodPrice').value;
    const description = document.getElementById('prodDesc').value;
    const imageUrl = ''; 

    try {
        await api.products.create({ title, category, price, description, imageUrl });
        showToast('Listing posted successfully!');
        closeModal();
        fetchProducts();
    } catch (error) {
        showToast('Error: ' + error.message);
    }
}

// ── RENDER LISTINGS ──────────────────────────────────────────
function renderListings(data) {
    const grid = document.getElementById('listingsGrid');

    if (!data || !data.length) {
        grid.innerHTML = `<div class="col-span-4 text-center py-16 text-slate-400 text-sm italic">No listings found for your campus.</div>`;
        return;
    }

    grid.innerHTML = data.map(l => {
        const emoji = l.category === 'Books' ? '📚' : l.category === 'Electronics' ? '💻' : l.category === 'Notes' ? '📝' : '🛍️';
        const bg = l.category === 'Books' ? 'bg-blue-50' : l.category === 'Electronics' ? 'bg-green-50' : 'bg-amber-50';
        
        return `
        <div onclick="openListing(${l.id})" class="listing-card cursor-pointer">
          <div class="${bg} h-44 flex items-center justify-center relative rounded-t-2xl">
            <span class="text-6xl">${emoji}</span>
            <span class="absolute top-3 right-3 bg-slate-900 text-white font-mono-j text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg">${l.category}</span>
          </div>
          <div class="p-4">
            <h3 class="font-serif text-[15px] font-bold text-slate-900 mb-1 leading-snug">${l.title}</h3>
            <p class="text-xs text-slate-400 mb-3 leading-relaxed truncate">${l.description || 'No description'}</p>
            <div class="flex justify-between items-center">
              <span class="font-serif text-lg font-bold text-slate-900">₹${l.price}</span>
              <span class="text-xs text-slate-400">By ${l.sellerName}</span>
            </div>
          </div>
        </div>
      `}).join('');
}

// ── SEARCH + FILTER ──────────────────────────────────────────
function filterListings() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = (allProducts || []).filter(l => {
        const matchCat = activeFilter === 'all' || l.category.toLowerCase() === activeFilter.toLowerCase();
        const matchQ = !q || l.title.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q));
        return matchCat && matchQ;
    });
    renderListings(filtered);
}

function setFilter(cat, btn) {
    activeFilter = cat;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active-pill'));
    if (btn) btn.classList.add('active-pill');
    filterListings();
}

function heroSearchRedirect() {
    const q = document.getElementById('heroSearch').value.trim();
    if (q) {
        document.getElementById('searchInput').value = q;
        filterListings();
    }
    document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
}

// ── MODAL TEMPLATES ──────────────────────────────────────────
const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm bg-slate-50 focus:bg-white focus:border-slate-400 transition-colors font-sans';

async function openModal(type) {
    if (type === 'signup') {
        const tenants = await api.tenants.getAll();
        document.getElementById('modalContent').innerHTML = signupTemplate(tenants);
    } else {
        document.getElementById('modalContent').innerHTML = modalTemplates[type] || '';
    }
    showOverlay();
}

function handleTenantChange(val) {
    const otherDiv = document.getElementById('otherCollegeFields');
    if (val === 'OTHER') {
        otherDiv.classList.remove('hidden');
    } else {
        otherDiv.classList.add('hidden');
    }
}

const signupTemplate = (tenants) => `
    <h3 class="font-serif text-2xl font-bold text-slate-900 mb-1">Create Account</h3>
    <p class="text-sm text-slate-500 mb-7">Select your college to join the campus community.</p>
    <div class="space-y-4">
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input type="text" id="regName" placeholder="Your name" class="${inputCls}"/>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input type="email" id="regEmail" placeholder="you@university.edu" class="${inputCls}"/>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Select College</label>
            <select id="regTenant" onchange="handleTenantChange(this.value)" class="${inputCls}">
                ${tenants.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
                <option value="OTHER">+ Add My College</option>
            </select>
        </div>
        <div id="otherCollegeFields" class="hidden space-y-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p class="text-[10px] uppercase font-bold text-amber-600 tracking-wider">New College Details</p>
            <input type="text" id="newTenantName" placeholder="Full College Name" class="${inputCls}"/>
            <input type="text" id="newTenantCode" placeholder="Code (e.g. SHARDA)" class="${inputCls}"/>
        </div>
        <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <input type="password" id="regPassword" placeholder="••••••••" class="${inputCls}"/>
        </div>
        <button onclick="handleSignup()" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors mt-2">
            Create Account →
        </button>
        <p class="text-center text-xs text-slate-400">
            Already have an account? <a href="#" onclick="openModal('login'); return false" class="text-blue-500 font-semibold">Log in</a>
        </p>
    </div>
`;

const modalTemplates = {
    notice: `
        <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <h3 class="font-serif text-2xl font-bold text-slate-900">Announcements</h3>
        </div>
        <p class="text-sm text-slate-500 mb-6">Stay updated with the latest from CampusCart.</p>
        <div class="space-y-4">
            <div class="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                <p class="text-[10px] font-mono-j text-blue-500 font-bold tracking-widest uppercase mb-1">NEW FEATURE</p>
                <h4 class="font-serif font-bold text-slate-900 text-base mb-1">Marketplace is Live! 🚀</h4>
                <p class="text-xs text-slate-600 leading-relaxed">You can now post listings and browse items from your fellow college students safely. Make sure you use your verified college email.</p>
            </div>
            <div class="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                <p class="text-[10px] font-mono-j text-emerald-500 font-bold tracking-widest uppercase mb-1">COMMUNITY</p>
                <h4 class="font-serif font-bold text-slate-900 text-base mb-1">Welcome to CampusCart</h4>
                <p class="text-xs text-slate-600 leading-relaxed">A peer-to-peer ecosystem designed to make student life affordable and convenient.</p>
            </div>
        </div>
        <button onclick="closeModal()" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors mt-6">
            Got it
        </button>`,

    login: `
        <h3 class="font-serif text-2xl font-bold text-slate-900 mb-1">Welcome Back</h3>
        <p class="text-sm text-slate-500 mb-7">Sign in to your CampusCart account.</p>
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" id="loginEmail" placeholder="you@university.edu" class="${inputCls}"/>
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <input type="password" id="loginPassword" placeholder="••••••••" class="${inputCls}"/>
            </div>
            <button onclick="handleLogin()" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors mt-2">
                Log In →
            </button>
            <p class="text-center text-xs text-slate-400">
                New here? <a href="#" onclick="openModal('signup'); return false" class="text-blue-500 font-semibold">Create account</a>
            </p>
        </div>`,

    sell: `
        <h3 class="font-serif text-2xl font-bold text-slate-900 mb-1">Post a Listing</h3>
        <p class="text-sm text-slate-500 mb-7">List your item for sale on your campus.</p>
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Product Title</label>
                <input type="text" id="prodTitle" placeholder="e.g. Scientific Calculator" class="${inputCls}"/>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                    <select id="prodCat" class="${inputCls}">
                        <option>Books</option>
                        <option>Electronics</option>
                        <option>Notes</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Price (₹)</label>
                    <input type="number" id="prodPrice" placeholder="500" class="${inputCls}"/>
                </div>
            </div>
            <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea id="prodDesc" placeholder="Condition, usage, why selling..." rows="3" class="${inputCls} resize-none"></textarea>
            </div>
            <button onclick="handleCreateProduct()" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors mt-2">
                Post Now →
            </button>
        </div>`,
};

// ── MODAL CONTROLS ───────────────────────────────────────────
function openListing(id) {
    const l = allProducts.find(x => x.id === id);
    if (!l) return;

    const emoji = l.category === 'Books' ? '📚' : l.category === 'Electronics' ? '💻' : l.category === 'Notes' ? '📝' : '🛍️';
    const bg = l.category === 'Books' ? 'bg-blue-50' : l.category === 'Electronics' ? 'bg-green-50' : 'bg-amber-50';

    document.getElementById('modalContent').innerHTML = `
        <div class="${bg} rounded-xl flex items-center justify-center text-7xl h-40 mb-6">${emoji}</div>
        <p class="text-[10px] tracking-widest uppercase mb-2 text-blue-500 font-bold">${l.category}</p>
        <h3 class="text-2xl font-bold text-slate-900 mb-2">${l.title}</h3>
        <p class="text-sm text-slate-500 mb-6 leading-relaxed">${l.description || 'No description provided.'}</p>
        <div class="flex justify-between items-center mb-6">
            <span class="text-3xl font-bold text-slate-900">₹${l.price}</span>
            <span class="text-sm text-slate-500">Seller: <strong class="text-slate-900">${l.sellerName}</strong></span>
        </div>
        ${authState.user && authState.user.id === l.sellerId ? 
            `<button onclick="handleDeleteProduct(${l.id})" class="w-full bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-700 transition-colors">Delete Listing</button>` :
            `<button onclick="showToast('Contact ${l.sellerName} at campus!'); closeModal()" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">I'm Interested</button>`
        }
    `;
    showOverlay();
}

async function handleDeleteProduct(id) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
        await api.products.delete(id);
        showToast('Listing deleted');
        closeModal();
        fetchProducts();
    } catch (error) {
        showToast('Delete failed: ' + error.message);
    }
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

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none'), 3000);
}

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CHAT WIDGET ──────────────────────────────────────────────
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // Removed for GitHub push protection

let chatOpen = false;
function toggleChat() {
    chatOpen = !chatOpen;
    const cw = document.getElementById('chatWindow');
    const dot = document.getElementById('chatDot');
    
    if (chatOpen) {
        cw.classList.remove('opacity-0', 'translate-y-8', 'scale-95', 'invisible');
        if(dot) dot.classList.add('opacity-0');
    } else {
        cw.classList.add('opacity-0', 'translate-y-8', 'scale-95', 'invisible');
    }
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    appendChatMessage('user', text);
    input.value = '';
    
    appendTypingIndicator();
    
    try {
        if (GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
            throw new Error("Please add your Gemini API Key at the top of the Chat Widget section in app.js.");
        }
        
        const promptContext = "You are a friendly, concise AI assistant for CampusCart, a peer to peer marketplace for college students. Keep responses brief, engaging, and directly answer questions. User says: " + text;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: promptContext }] }]
            })
        });
        
        const data = await response.json();
        removeTypingIndicator();
        
        if (data.error) throw new Error(data.error.message);
        
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't understand that.";
        
        appendChatMessage('bot', botReply);
        
    } catch(err) {
        removeTypingIndicator();
        appendChatMessage('bot', "⚠️ " + err.message);
    }
}

function appendChatMessage(sender, textStr) {
    const body = document.getElementById('chatBody');
    const isBot = sender === 'bot';
    
    // Safely encode text to prevent HTML injection and preserve new lines
    const textNode = document.createElement('div');
    textNode.textContent = textStr;
    const safeText = textNode.innerHTML.replace(/\n/g, '<br/>');
    
    const wrap = document.createElement('div');
    wrap.className = `flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`;
    
    if (isBot) {
        wrap.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">bot</div>
            <div class="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">${safeText}</div>
        `;
    } else {
        wrap.innerHTML = `
            <div class="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed text-sm">${safeText}</div>
        `;
    }
    
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
}

function appendTypingIndicator() {
    const body = document.getElementById('chatBody');
    const wrap = document.createElement('div');
    wrap.id = "typingIndicator";
    wrap.className = "flex gap-2.5";
    wrap.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">bot</div>
        <div class="bg-slate-100 px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1 max-w-[85%]">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
    `;
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
}

function removeTypingIndicator() {
    const ind = document.getElementById('typingIndicator');
    if (ind) ind.remove();
}
