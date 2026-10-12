/**
 * LittleNest BD - Core Application Logic
 * Ultra-Clean, Frictionless 3-Field Checkout Flow
 * Meta Pixel Integration & Mobile First UX
 */

// Global State
let currentPackage = {
  quantity: 1,
  name: '১টি সম্পূর্ণ সেট (৬ পিস)',
  price: 1190,
  shipping: 70
};

let currentColor = 'স্কাই ব্লু';
let checkoutInitiated = false;

// Bengali Number Formatter
function toBanglaNumber(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bnDigits[d]);
}

// -------------------------------------------------------------
// 1. PACKAGE & COLOR SELECTORS
// -------------------------------------------------------------
window.selectCleanPackage = function(qty, price, shipping) {
  currentPackage.quantity = qty;
  currentPackage.price = price;
  currentPackage.shipping = shipping;
  currentPackage.name = qty === 2 ? '২টি সম্পূর্ণ সেট (১২ পিস)' : '১টি সম্পূর্ণ সেট (৬ পিস)';

  const card1 = document.getElementById('pkg-card-1');
  const card2 = document.getElementById('pkg-card-2');

  if (card1 && card2) {
    if (qty === 1) {
      card1.classList.add('selected');
      card2.classList.remove('selected');
    } else {
      card2.classList.add('selected');
      card1.classList.remove('selected');
    }
  }

  updateBillDisplay();
};

window.selectCleanColor = function(colorName, el) {
  currentColor = colorName;
  const pills = document.querySelectorAll('.color-clean-pill');
  pills.forEach(pill => pill.classList.remove('selected'));
  if (el) el.classList.add('selected');

  updateWhatsAppLink();
};

function updateBillDisplay() {
  const subtotalEl = document.getElementById('bill-subtotal-text');
  const shippingEl = document.getElementById('bill-shipping-text');
  const totalEl = document.getElementById('bill-total-text');
  const stickyNowEl = document.querySelector('.sticky-now');

  const total = currentPackage.price + currentPackage.shipping;

  if (subtotalEl) subtotalEl.textContent = `৳${toBanglaNumber(currentPackage.price)}`;
  if (shippingEl) {
    shippingEl.textContent = currentPackage.shipping === 0 
      ? 'ফ্রি ডেলিভারি 🎁' 
      : '৳৭০ (ঢাকার ভেতরে) / ৳১৩০ (বাইরে)';
  }
  if (totalEl) totalEl.textContent = `৳${toBanglaNumber(total)}`;
  if (stickyNowEl) stickyNowEl.textContent = `৳${toBanglaNumber(currentPackage.price)}`;

  updateWhatsAppLink();
}

function updateWhatsAppLink() {
  const waBtn = document.getElementById('btn-whatsapp-direct-order');
  if (!waBtn) return;

  const total = currentPackage.price + currentPackage.shipping;
  const msg = `আসসালামু আলাইকুম LittleNest BD, আমি সরাসরি হোয়াটসঅ্যাপে অর্ডার করতে চাই:\n\n📦 প্যাকেজ: ${currentPackage.name}\n🎨 পছন্দের কালার: ${currentColor}\n💰 মোট মূল্য: ৳${total} (ক্যাশ অন ডেলিভারি)\n\nআমার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা নিচে দিচ্ছি:`;

  waBtn.href = `https://wa.me/+8801XXXXXXXXX?text=${encodeURIComponent(msg)}`;
}

// -------------------------------------------------------------
// 2. STREAMLINED 3-FIELD ORDER VALIDATION & SUBMISSION
// -------------------------------------------------------------
window.handleCleanOrderSubmit = function(e) {
  e.preventDefault();

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');
  const submitBtn = document.getElementById('btn-confirm-order');

  const nameFeedback = document.getElementById('name-feedback');
  const phoneFeedback = document.getElementById('phone-feedback');
  const addressFeedback = document.getElementById('address-feedback');

  // Reset errors
  [nameInput, phoneInput, addressInput].forEach(inp => {
    if (inp) inp.classList.remove('is-invalid');
  });
  [nameFeedback, phoneFeedback, addressFeedback].forEach(fb => {
    if (fb) fb.classList.remove('show');
  });

  let hasError = false;
  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const address = addressInput ? addressInput.value.trim() : '';

  // 1. Validate Name
  if (!name || name.length < 2) {
    if (nameInput) nameInput.classList.add('is-invalid');
    if (nameFeedback) nameFeedback.classList.add('show');
    if (!hasError && nameInput) nameInput.focus();
    hasError = true;
  }

  // 2. Validate Phone
  const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!phone || !phoneRegex.test(phone)) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    if (phoneFeedback) phoneFeedback.classList.add('show');
    if (!hasError && phoneInput) phoneInput.focus();
    hasError = true;
  }

  // 3. Validate Address
  if (!address || address.length < 5) {
    if (addressInput) addressInput.classList.add('is-invalid');
    if (addressFeedback) addressFeedback.classList.add('show');
    if (!hasError && addressInput) addressInput.focus();
    hasError = true;
  }

  if (hasError) return;

  // Processing state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ অর্ডার সম্পন্ন হচ্ছে...</span>';
  }

  const grandTotal = currentPackage.price + currentPackage.shipping;
  const orderId = 'LN-' + Math.floor(100000 + Math.random() * 900000);
  const orderTime = new Date().toLocaleString('bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const orderData = {
    orderId: orderId,
    customerName: name,
    customerPhone: phone,
    fullAddress: address,
    packageTitle: currentPackage.name,
    quantity: currentPackage.quantity,
    selectedColor: currentColor,
    shippingCost: currentPackage.shipping,
    totalPrice: grandTotal,
    orderDate: orderTime,
    timestamp: Date.now(),
    status: 'New'
  };

  // Save to LocalStorage
  saveOrderToStorage(orderData);

  // Trigger Facebook Pixel Purchase Event
  if (typeof trackPixelEvent === 'function') {
    trackPixelEvent('Purchase', {
      content_name: 'Silicone Baby Feeding Set',
      content_category: 'Baby Dining',
      content_ids: ['LN-SILICONE-SET'],
      content_type: 'product',
      value: grandTotal,
      currency: 'BDT',
      num_items: currentPackage.quantity
    });
  }

  // Render receipt and display modal
  showOrderSuccessModal(orderData);

  // Reset form
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (addressInput) addressInput.value = '';
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>🛒 এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>';
  }
};

// Also route legacy call if needed
window.handleOrderSubmit = window.handleCleanOrderSubmit;

// -------------------------------------------------------------
// 3. SUCCESS MODAL & RECEIPT DISPLAY
// -------------------------------------------------------------
function showOrderSuccessModal(order) {
  const modal = document.getElementById('success-modal');
  const details = document.getElementById('receipt-details');
  const waBtn = document.getElementById('btn-whatsapp-receipt');

  if (details) {
    details.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
        <span>অর্ডার আইডি:</span>
        <strong style="color: var(--primary);">#${order.orderId}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>গ্রাহকের নাম:</span>
        <strong>${order.customerName}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>মোবাইল নম্বর:</span>
        <strong>${order.customerPhone}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>ডেলিভারি ঠিকানা:</span>
        <strong style="text-align: right; max-width: 200px;">${order.fullAddress}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>প্যাকেজ:</span>
        <strong>${order.packageTitle} (${order.selectedColor})</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed #CBD5E1; padding-top: 6px; font-weight: 700; color: var(--text-main);">
        <span>সর্বমোট বিল:</span>
        <span style="color: var(--primary); font-size: 1.15rem;">৳${toBanglaNumber(order.totalPrice)}</span>
      </div>
    `;
  }

  if (waBtn) {
    const waText = encodeURIComponent(
      `হ্যালো LittleNest BD, আমি সিলিকন ফিডিং সেটের একটি অর্ডার করেছি।\nঅর্ডার আইডি: #${order.orderId}\nনাম: ${order.customerName}\nফোন: ${order.customerPhone}\nঠিকানা: ${order.fullAddress}\nপ্যাকেজ: ${order.packageTitle} (${order.selectedColor})\nমোট বিল: ৳${order.totalPrice}`
    );
    waBtn.href = `https://wa.me/+8801XXXXXXXXX?text=${waText}`;
  }

  if (modal) modal.classList.add('open');
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('success-modal');
  if (modal) modal.classList.remove('open');
};

// -------------------------------------------------------------
// 4. STORAGE & ADMIN OPERATIONS
// -------------------------------------------------------------
function saveOrderToStorage(order) {
  try {
    const existing = JSON.parse(localStorage.getItem('littlenest_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('littlenest_orders', JSON.stringify(existing));
    renderAdminOrders();
  } catch (err) {
    console.error('Failed to save order to localStorage:', err);
  }
}

function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  const countEl = document.getElementById('admin-orders-count');
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem('littlenest_orders') || '[]');
  if (countEl) countEl.textContent = toBanglaNumber(orders.length);

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 24px;">এখনও কোনো অর্ডার আসেনি।</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(ord => `
    <tr>
      <td><strong>#${ord.orderId}</strong><br><small style="color: #64748B;">${ord.orderDate}</small></td>
      <td>${ord.customerName}<br><a href="tel:${ord.customerPhone}" style="color: var(--primary); font-weight: 600;">${ord.customerPhone}</a></td>
      <td style="max-width: 180px; word-break: break-word;">${ord.fullAddress}</td>
      <td>${ord.packageTitle}<br><span style="font-size: 0.76rem; color: #475569;">${ord.selectedColor}</span></td>
      <td><strong>৳${toBanglaNumber(ord.totalPrice)}</strong></td>
      <td><span style="background: #ECFDF5; color: #059669; padding: 2px 8px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700;">${ord.status || 'New'}</span></td>
    </tr>
  `).join('');
}

window.exportOrdersToCSV = function() {
  const orders = JSON.parse(localStorage.getItem('littlenest_orders') || '[]');
  if (orders.length === 0) {
    alert('কোনো অর্ডার ডেটা নেই!');
    return;
  }

  const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Package', 'Color', 'Total Price', 'Status'];
  const rows = orders.map(o => [
    o.orderId,
    `"${o.orderDate}"`,
    `"${o.customerName}"`,
    `"${o.customerPhone}"`,
    `"${(o.fullAddress || '').replace(/"/g, '""')}"`,
    `"${o.packageTitle}"`,
    `"${o.selectedColor}"`,
    o.totalPrice,
    o.status || 'New'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.clearAllOrders = function() {
  if (confirm('আপনি কি নিশ্চিত যে সকল অর্ডার ইতিহাস মুছে ফেলতে চান?')) {
    localStorage.removeItem('littlenest_orders');
    renderAdminOrders();
  }
};

// -------------------------------------------------------------
// 5. FAQ ACCORDION LOGIC
// -------------------------------------------------------------
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-clean-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-clean-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// -------------------------------------------------------------
// 6. POLICY MODALS
// -------------------------------------------------------------
const policyTexts = {
  refund: `
    <h2>🔄 রিটার্ন ও রিপ্লেসমেন্ট পলিসি</h2>
    <p>আমাদের কাছে গ্রাহকের শতভাগ সন্তুষ্টিই প্রথম অগ্রাধিকার। আপনি যেন নিশ্চিন্তে কেনাকাটা করতে পারেন, সেজন্য রয়েছে সহজ ৭ দিনের রিটার্ন ও ফ্রি এক্সচেঞ্জ সুবিধা।</p>
    <h3>শর্তাবলী:</h3>
    <ul>
      <li>ডেলিভারি পাওয়ার পর পার্সেল খুলে ডেলিভারি ম্যানের সামনেই চেক করে নিতে পারবেন।</li>
      <li>যদি কোনো ত্রুটি (যেমন: ফেটে যাওয়া, কাটা বা কালার ভুল) পাওয়া যায়, সাথে সাথে হটলাইনে কল দিন বা হোয়াটসঅ্যাপে জানান।</li>
      <li>আমরা সম্পূর্ণ ফ্রিতে আপনাকে দ্রুত নতুন প্রোডাক্ট রিপ্লেস করে দেব। কোনো অতিরিক্ত চার্জ দিতে হবে না।</li>
      <li>অভিযোগ জানাতে হটলাইন: (+৯৭১৫৬৭৮১৩২০৩) অথবা হোয়াটসঅ্যাপ: (+৮৮০১XXXXXXXXX)।</li>
    </ul>
  `,
  privacy: `
    <h2>🔒 প্রাইভেসি পলিসি (Privacy Policy)</h2>
    <p>আপনার ব্যক্তিগত তথ্যের নিরাপত্তা রক্ষা করা আমাদের পবিত্র দায়িত্ব। আমরা কখনোই গ্রাহকের ব্যক্তিগত তথ্য কারো সাথে শেয়ার বা বিক্রি করি না।</p>
    <h3>তথ্য ব্যবহারের নীতিমালা:</h3>
    <ul>
      <li>আপনার নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা শুধুমাত্র পণ্য পৌঁছে দেওয়া এবং কুরিয়ার আপডেটের জন্য ব্যবহৃত হয়।</li>
      <li>আমাদের ওয়েবসাইটে মেটা পিক্সেলের স্ট্যান্ডার্ড কুকিজ ব্যবহৃত হয় যাতে গ্রাহকদের জন্য কেনাকাটার অভিজ্ঞতা আরও উন্নত করা যায়।</li>
    </ul>
  `,
  terms: `
    <h2>🚚 ডেলিভারি ও সাধারণ শর্তাবলী</h2>
    <p>LittleNest BD-তে কেনাকাটা করার আগে নিয়মাবলী জেনে নিন:</p>
    <ul>
      <li><strong>ক্যাশ অন ডেলিভারি:</strong> কোনো পণ্যের জন্যই কোনো প্রকার অগ্রিম টাকা দিতে হয় না। পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানকে টাকা পরিশোধ করবেন।</li>
      <li><strong>ডেলিভারি সময়সীমা:</strong> ঢাকার ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ দিনের মধ্যে হোম ডেলিভারি পৌঁছে যায়।</li>
      <li><strong>২টি সেটে ফ্রি ডেলিভারি:</strong> যেকোনো ২টি সেট অর্ডার করলে সারা বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি!</li>
    </ul>
  `
};

window.openPolicyModal = function(type) {
  const modal = document.getElementById('policy-modal');
  const content = document.getElementById('policy-content-area');
  if (modal && content && policyTexts[type]) {
    content.innerHTML = policyTexts[type];
    modal.classList.add('open');
  }
};

window.closePolicyModal = function() {
  const modal = document.getElementById('policy-modal');
  if (modal) modal.classList.remove('open');
};

// -------------------------------------------------------------
// 7. ADMIN MODAL & PIXEL SETTINGS
// -------------------------------------------------------------
window.openAdminModal = function() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.add('open');
    renderAdminOrders();
    const input = document.getElementById('admin-pixel-input');
    if (input) {
      input.value = localStorage.getItem('facebook_pixel_id') || '';
    }
  }
};

window.closeAdminModal = function() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
};

window.savePixelSettings = function() {
  const input = document.getElementById('admin-pixel-input');
  const msg = document.getElementById('pixel-status-msg');
  if (!input) return;

  const pixelId = input.value.trim();
  if (pixelId) {
    localStorage.setItem('facebook_pixel_id', pixelId);
    if (typeof initMetaPixel === 'function') {
      initMetaPixel(pixelId);
    }
    if (msg) {
      msg.textContent = '✅ Facebook Pixel ID সফলভাবে সেভ হয়েছে!';
      msg.style.color = '#059669';
    }
  } else {
    localStorage.removeItem('facebook_pixel_id');
    if (msg) {
      msg.textContent = 'পিক্সেল আইডি রিমুভ করা হয়েছে।';
      msg.style.color = '#DC2626';
    }
  }
};

// -------------------------------------------------------------
// 8. SCROLL OBSERVERS & SMOOTH NAVIGATION
// -------------------------------------------------------------
function setupScrollObservers() {
  const orderSection = document.getElementById('order-section');
  const stickyBar = document.getElementById('mobile-sticky-bar');

  // Auto-hide sticky mobile bar when viewing the order section
  if (orderSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.classList.add('in-checkout-view');
        } else {
          document.body.classList.remove('in-checkout-view');
        }
      });
    }, { threshold: 0.15 });

    observer.observe(orderSection);
  }

  // Smooth jump to order form from buttons
  const orderJumpBtns = [
    document.getElementById('btn-hero-order'),
    document.getElementById('btn-sticky-order'),
    document.querySelector('.btn-header-order')
  ];

  orderJumpBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const nameInput = document.getElementById('cust-name');
            if (nameInput) nameInput.focus();
          }, 350);
        }

        // Fire InitiateCheckout pixel event
        if (!checkoutInitiated && typeof trackPixelEvent === 'function') {
          checkoutInitiated = true;
          trackPixelEvent('InitiateCheckout', {
            content_name: 'Silicone Baby Feeding Set',
            value: currentPackage.price,
            currency: 'BDT'
          });
        }
      });
    }
  });
}

// -------------------------------------------------------------
// 9. APP INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  updateBillDisplay();
  setupScrollObservers();
  renderAdminOrders();

  // Fire ViewContent Pixel event
  if (typeof trackPixelEvent === 'function') {
    trackPixelEvent('ViewContent', {
      content_name: 'Silicone Baby Feeding Set',
      content_category: 'Baby Dining',
      content_ids: ['LN-SILICONE-SET'],
      content_type: 'product',
      value: 1190,
      currency: 'BDT'
    });
  }
});
