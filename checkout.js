// ============================================================
//  FOREVER FLOWERS — CART & CHECKOUT
//  Handles: cart state, checkout modal, M-Pesa via Paystack,
//           Pay on Delivery, order saving to Supabase
// ============================================================

let cart = JSON.parse(localStorage.getItem("ff_cart") || "[]");

// ── CART HELPERS ──────────────────────────────────────────────
function saveCart() {
  localStorage.setItem("ff_cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showCartToast(product.name);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCartItems(); }
}

function clearCart() {
  cart = [];
  saveCart();
}

function formatKSh(n) {
  return "KSh " + Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function cartSubtotal() {
  return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}

// ── CART SIDEBAR ──────────────────────────────────────────────
function openCart() {
  renderCartItems();
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function renderCartItems() {
  const el  = document.getElementById("cartItemsList");
  const sub = cartSubtotal();

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty"><div style="font-size:3rem">🌸</div><p>Your cart is empty</p><p style="font-size:0.85rem;opacity:0.7">Add some beautiful flowers!</p></div>`;
    document.getElementById("cartCheckoutBtn").style.display = "none";
    document.getElementById("cartTotal").style.display = "none";
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.style.display='none'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatKSh(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="qty-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
      <div class="cart-item-total">${formatKSh(item.price * item.qty)}</div>
    </div>`).join("");

  document.getElementById("cartSubtotal").textContent = formatKSh(sub);
  document.getElementById("cartTotal").style.display = "block";
  document.getElementById("cartCheckoutBtn").style.display = "block";
}

// ── CHECKOUT MODAL ────────────────────────────────────────────
let checkoutStep = 1;
let deliveryType = "delivery";

function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  checkoutStep = 1;
  deliveryType = "delivery";
  showStep(1);
  updateOrderSummary();
  document.getElementById("checkoutModal").classList.add("open");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("open");
}

function showStep(step) {
  checkoutStep = step;
  document.querySelectorAll(".checkout-step").forEach((el, i) => {
    el.style.display = (i + 1 === step) ? "block" : "none";
  });
  document.querySelectorAll(".step-dot").forEach((el, i) => {
    el.classList.toggle("active", i + 1 <= step);
  });
}

function setDelivery(type) {
  deliveryType = type;
  document.getElementById("deliveryBtn").classList.toggle("active", type === "delivery");
  document.getElementById("pickupBtn").classList.toggle("active",   type === "pickup");
  document.getElementById("locationGroup").style.display = type === "delivery" ? "block" : "none";
  updateOrderSummary();
}

function updateOrderSummary() {
  const sub  = cartSubtotal();
  const fee  = (deliveryType === "delivery" && sub < BUSINESS_CONFIG.freeDeliveryAt) ? BUSINESS_CONFIG.deliveryFee : 0;
  const total = sub + fee;

  const el = document.getElementById("orderSummary");
  el.innerHTML = `
    ${cart.map(i => `
      <div class="summary-row">
        <span>${i.name} × ${i.qty}</span>
        <span>${formatKSh(i.price * i.qty)}</span>
      </div>`).join("")}
    <div class="summary-row" style="border-top:1px solid rgba(92,61,46,0.1);margin-top:0.5rem;padding-top:0.5rem">
      <span>Subtotal</span><span>${formatKSh(sub)}</span>
    </div>
    ${deliveryType === "delivery" ? `
    <div class="summary-row">
      <span>Delivery Fee</span>
      <span>${fee === 0 ? '<span style="color:var(--sage)">FREE 🎉</span>' : formatKSh(fee)}</span>
    </div>` : ""}
    <div class="summary-row summary-total">
      <span>TOTAL</span><span>${formatKSh(total)}</span>
    </div>`;

  // Store fee + total for payment
  window._checkoutFee   = fee;
  window._checkoutTotal = total;
}

function nextStep() {
  if (checkoutStep === 1) {
    const name  = document.getElementById("chkName").value.trim();
    const phone = document.getElementById("chkPhone").value.trim();
    if (!name || !phone) {
      alert("Please enter your name and phone number."); return;
    }
    if (deliveryType === "delivery" && !document.getElementById("chkLocation").value.trim()) {
      alert("Please enter your delivery location."); return;
    }
  }
  if (checkoutStep < 2) {
    updateOrderSummary();
    showStep(checkoutStep + 1);
  }
}

function prevStep() {
  if (checkoutStep > 1) showStep(checkoutStep - 1);
}

// ── PAYSTACK M-PESA ───────────────────────────────────────────
function payWithMpesa() {
  // ── Kept synchronous so browser does NOT block the popup ──
  const name     = document.getElementById("chkName").value.trim();
  const phone    = document.getElementById("chkPhone").value.trim();
  const location = document.getElementById("chkLocation")?.value.trim() || "";
  const email    = document.getElementById("chkEmail")?.value.trim() ||
                   (phone.replace(/\s/g, "") + "@foreverflowers.co.ke");

  if (!name || !phone) {
    alert("Please enter your name and phone number first.");
    return;
  }

  // ── Format phone to Kenyan international format 254XXXXXXXXX ──
  let formattedPhone = phone.replace(/\s|-/g, ""); // remove spaces and dashes
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "254" + formattedPhone.slice(1); // 0712... → 254712...
  } else if (formattedPhone.startsWith("+")) {
    formattedPhone = formattedPhone.slice(1); // +254... → 254...
  }
  // Already 254... stays as is

  const amount = Math.round((window._checkoutTotal || 0) * 100); // Paystack uses kobo (KES cents)
  const ref    = "FF-" + Date.now();

  if (amount < 100) {
    alert("Order total is too low. Minimum is KSh 1.");
    return;
  }

  // ── Open Paystack popup synchronously (must not be inside await) ──
  const handler = PaystackPop.setup({
    key:      PAYSTACK_PUBLIC_KEY,
    email:    email,
    amount:   amount,
    currency: "KES",
    ref:      ref,
    // No "channels" filter — lets Paystack show M-Pesa + card options
    // Paystack Kenya automatically shows M-Pesa STK push
    metadata: {
      custom_fields: [
        { display_name: "Customer Name",  variable_name: "customer_name",  value: name           },
        { display_name: "Phone",          variable_name: "phone_number",   value: formattedPhone },
        { display_name: "Delivery",       variable_name: "delivery_type",  value: deliveryType   },
        { display_name: "Location",       variable_name: "location",       value: location       },
      ]
    },
    callback: function(response) {
      // Payment successful — save order then show confirmation
      saveOrder({
        name, phone: formattedPhone, location,
        paymentMethod: "mpesa",
        paystackRef:   response.reference,
        paymentStatus: "pending",
      }).then(() => {
        showConfirmation("mpesa", response.reference);
      });
    },
    onClose: function() {
      // Customer closed the popup without paying — do nothing
      console.log("Paystack popup closed by user");
    }
  });

  handler.openIframe();
}

// ── PAY ON DELIVERY ───────────────────────────────────────────
async function payOnDelivery() {
  const name     = document.getElementById("chkName").value.trim();
  const phone    = document.getElementById("chkPhone").value.trim();
  const location = document.getElementById("chkLocation")?.value.trim() || "";

  if (!name || !phone) { alert("Please complete your details first."); return; }
  if (deliveryType === "delivery" && !location) { alert("Please enter your delivery location."); return; }

  // Show loading state on the button
  const podOption = document.getElementById("podOption");
  const podArrow  = document.getElementById("podArrow");
  if (podArrow) podArrow.textContent = "...";
  if (podOption) podOption.style.pointerEvents = "none";

  await saveOrder({ name, phone, location, paymentMethod: "pod", paymentStatus: "pod" });
  showConfirmation("pod");

  // Restore
  if (podArrow)  podArrow.textContent = "→";
  if (podOption) podOption.style.pointerEvents = "auto";
}

// ── SAVE ORDER TO SUPABASE ────────────────────────────────────
async function saveOrder({ name, phone, location, paymentMethod, paystackRef, paymentStatus }) {
  const orderItems = cart.map(i => ({
    id:    i.id,
    name:  i.name,
    price: i.price,
    qty:   i.qty,
  }));

  const { error } = await supabaseClient.from("orders").insert([{
    customer_name:    name,
    customer_phone:   phone,
    items:            JSON.stringify(orderItems),
    total:            window._checkoutTotal,
    delivery_fee:     window._checkoutFee,
    delivery_type:    deliveryType,
    location:         location,
    payment_method:   paymentMethod,
    payment_status:   paymentStatus,
    paystack_ref:     paystackRef || null,
  }]);

  if (error) {
    console.error("Order save error:", error);
  }

  clearCart();
}

// ── CONFIRMATION ──────────────────────────────────────────────
function showConfirmation(method, ref) {
  closeCheckout();
  const isPod = method === "pod";
  document.getElementById("confirmModal").classList.add("open");
  document.getElementById("confirmContent").innerHTML = `
    <div class="confirm-icon">${isPod ? "📦" : "✅"}</div>
    <h2>${isPod ? "Order Placed!" : "Payment Received!"}</h2>
    <p>${isPod
      ? "Your order has been placed. Our team will confirm via WhatsApp and arrange delivery."
      : "Your M-Pesa payment is being confirmed. You'll receive an SMS and WhatsApp message shortly."
    }</p>
    ${ref ? `<p style="font-size:0.82rem;color:var(--muted)">Reference: ${ref}</p>` : ""}
    <a href="https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(`Hello Forever Flowers! I just placed an order. My name is ${document.getElementById("chkName")?.value || ""} — can you confirm?`)}"
       target="_blank" class="btn-confirm-wa">
       📞 Confirm on WhatsApp
    </a>`;
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.remove("open");
}

// ── CART TOAST ────────────────────────────────────────────────
function showCartToast(name) {
  const t = document.getElementById("cartToast");
  t.textContent = `🌸 ${name} added to cart!`;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  setDelivery("delivery");
});
