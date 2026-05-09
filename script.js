// ============================================================
//  FOREVER FLOWERS — MAIN SCRIPT (v2 with Supabase)
//  Products now load from Supabase database.
//  Admin manages products from admin.html
// ============================================================

const WA_NUMBER = BUSINESS_CONFIG.whatsapp;

// ── LOADER ────────────────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hidden"), 900);
});

// ── DARK MODE ─────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const savedTheme  = localStorage.getItem("ff-theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("ff-theme", next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

// ── NAV ───────────────────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 60);
  document.getElementById("backToTop")?.classList.toggle("visible", window.scrollY > 400);
});

document.getElementById("menuBtn")?.addEventListener("click", () =>
  document.getElementById("mobileNav")?.classList.add("open"));
document.getElementById("closeMenu")?.addEventListener("click", () =>
  document.getElementById("mobileNav")?.classList.remove("open"));
document.querySelectorAll(".mob-link").forEach(l =>
  l.addEventListener("click", () => document.getElementById("mobileNav")?.classList.remove("open")));

document.getElementById("backToTop")?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }));

// ── WA HELPER ─────────────────────────────────────────────────
function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ── FORMAT ────────────────────────────────────────────────────
function formatPrice(n) {
  return "KSh " + Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getBadgeClass(badge) {
  return { Sale: "badge-sale", New: "badge-new", Popular: "badge-popular" }[badge] || "";
}

// ── LOAD PRODUCTS FROM SUPABASE ───────────────────────────────
let allProducts = [];

async function loadProductsFromDB() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">Loading products… 🌸</div>`;

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">Could not load products. Please try again.</div>`;
    return;
  }

  allProducts = data || [];
  renderProducts(allProducts);
}

// ── RENDER PRODUCTS ───────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem">No products found 🌸</div>`;
    return;
  }

  list.forEach(p => {
    const badge    = p.badge ? `<div class="product-badge ${getBadgeClass(p.badge)}">${p.badge}</div>` : "";
    const origPrice = p.original_price
      ? `<span class="price-original">${formatPrice(p.original_price)}</span>` : "";

    const priceInfo = p.original_price
      ? `${formatPrice(p.price)} (was ${formatPrice(p.original_price)})`
      : formatPrice(p.price);

    const waMsg = `Hello Forever Flowers! 🌸\n\nI am interested in:\n🌺 *${p.name}*\n💰 ${priceInfo}\n\nIs this available? Thank you!`;

    const card = document.createElement("div");
    card.className = "product-card reveal";
    card.dataset.category = p.category || "all";

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${p.image || ''}" alt="${p.name}" loading="lazy"
          onerror="this.src='https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=600'"/>
        ${badge}
        <div class="handmade-badge">✿ Handmade</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || ""}</div>
        <div class="product-price">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${origPrice}
        </div>
        <div class="product-actions">
          <button class="btn-add-cart" onclick='addToCart(${JSON.stringify({ id: p.id, name: p.name, price: p.price, image: p.image || "" })})'>
            🛒 Add to Cart
          </button>
          <a class="btn-inquire-sm" href="${waLink(waMsg)}" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>`;

    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

// ── PRODUCT FILTER ────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    renderProducts(f === "all" ? allProducts : allProducts.filter(p => (p.category || "all") === f));
  });
});

// ── TESTIMONIALS ──────────────────────────────────────────────
const testimonials = [
  { name: "Amina W. 🌸", text: "Forever Flowers made my anniversary unforgettable. The bouquet was even more beautiful in person!" },
  { name: "James K. 🌷", text: "Ordered for my mum's birthday and she cried happy tears. Fast delivery and stunning arrangement!" },
  { name: "Fatuma H. 🌺", text: "The lavender bouquet still looks gorgeous two weeks later. Will definitely order again!" },
  { name: "Brian O. 🌻", text: "Best flower shop in Nairobi. The custom bouquet was exactly what I described. Highly recommended!" }
];

function renderTestimonials() {
  const grid = document.getElementById("reviewsGrid");
  if (!grid) return;
  grid.innerHTML = testimonials.map(t => `
    <div class="review-card reveal">
      <div class="review-stars">★★★★★</div>
      <div class="review-text">${t.text}</div>
      <div class="review-name">${t.name}</div>
    </div>`).join("");
  document.querySelectorAll(".review-card.reveal").forEach(el => revealObserver.observe(el));
}

// ── BOUQUET BUILDER ───────────────────────────────────────────
document.getElementById("builderForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const checked = [...document.querySelectorAll(".flower-check:checked")].map(c => c.value);
  const name    = document.getElementById("builderName")?.value.trim();
  const date    = document.getElementById("builderDate")?.value;
  const notes   = document.getElementById("builderNotes")?.value.trim();

  if (checked.length === 0) { alert("Please select at least one flower 🌸"); return; }

  let msg = `Hello Forever Flowers! 🌸\n\nCustom Bouquet Request:\nFlowers: ${checked.join(", ")}\n`;
  if (name)  msg += `Name: ${name}\n`;
  if (date)  msg += `Date: ${date}\n`;
  if (notes) msg += `Notes: ${notes}\n`;
  msg += `\nPlease advise on pricing. Thank you!`;
  window.open(waLink(msg), "_blank");
});

// ── SPECIAL REQUEST ───────────────────────────────────────────
document.getElementById("specialForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name    = document.getElementById("spName")?.value.trim();
  const flowers = document.getElementById("spFlowers")?.value.trim();
  const date    = document.getElementById("spDate")?.value;
  const phone   = document.getElementById("spPhone")?.value.trim();

  let msg = `Hello Forever Flowers! 🌸\n\nSpecial Request:\n`;
  if (name)    msg += `Name: ${name}\n`;
  if (flowers) msg += `Flowers/occasion: ${flowers}\n`;
  if (date)    msg += `Date needed: ${date}\n`;
  if (phone)   msg += `My number: ${phone}\n`;
  window.open(waLink(msg), "_blank");
});

// ── CARE TABS ─────────────────────────────────────────────────
document.querySelectorAll(".care-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".care-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".care-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target)?.classList.add("active");
  });
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── INIT ──────────────────────────────────────────────────────
loadProductsFromDB();
renderTestimonials();
