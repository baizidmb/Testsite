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

// Address Selection State
let selectedDivision = '';
let selectedDistrict = '';
let selectedUpazila = '';
let detailAddress = '';

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

  recalculateShipping();
  updateAddressUI();
};

window.selectCleanColor = function(colorName, el) {
  currentColor = colorName;
  const swatches = document.querySelectorAll('.color-swatch-circle');
  swatches.forEach(swatch => swatch.classList.remove('selected'));
  if (el) el.classList.add('selected');

  const label = document.getElementById('selected-color-label');
  if (label) label.textContent = colorName;
};

function recalculateShipping() {
  if (currentPackage.quantity === 2) {
    currentPackage.shipping = 0;
  } else if (selectedDistrict === 'ঢাকা') {
    currentPackage.shipping = 70;
  } else if (selectedDistrict && selectedDistrict !== 'ঢাকা') {
    currentPackage.shipping = 130;
  } else {
    currentPackage.shipping = 70;
  }
  updateBillDisplay();
}

function updateBillDisplay() {
  const subtotalEl = document.getElementById('bill-subtotal-text');
  const shippingEl = document.getElementById('bill-shipping-text');
  const totalEl = document.getElementById('bill-total-text');
  const stickyNowEl = document.querySelector('.sticky-now');

  const total = currentPackage.price + currentPackage.shipping;

  if (subtotalEl) subtotalEl.textContent = `৳${toBanglaNumber(currentPackage.price)}`;
  if (shippingEl) {
    if (currentPackage.shipping === 0) {
      shippingEl.textContent = 'ফ্রি ডেলিভারি 🎁';
    } else if (selectedDistrict === 'ঢাকা') {
      shippingEl.textContent = '৳৭০ (ঢাকার ভেতরে)';
    } else if (selectedDistrict) {
      shippingEl.textContent = `৳${toBanglaNumber(currentPackage.shipping)} (${selectedDistrict} জেলা)`;
    } else {
      shippingEl.textContent = '৳৭০ (ঢাকার ভেতরে) / ৳১৩০ (বাইরে)';
    }
  }
  if (totalEl) totalEl.textContent = `৳${toBanglaNumber(total)}`;
  if (stickyNowEl) stickyNowEl.textContent = `৳${toBanglaNumber(total)}`;
}

// -------------------------------------------------------------
// 2. EASY & ELEGANT ADDRESS SELECTION LOGIC
// -------------------------------------------------------------
window.handleDivisionChange = function(divName) {
  selectedDivision = divName;
  selectedDistrict = '';
  selectedUpazila = '';

  populateDistricts(divName);

  // Reset Upazila selector
  const upazilaSelect = document.getElementById('addr-upazila');
  if (upazilaSelect) {
    upazilaSelect.innerHTML = '<option value="" disabled selected>আগে জেলা সিলেক্ট করুন</option>';
    upazilaSelect.disabled = true;
  }

  recalculateShipping();
  updateAddressUI();

  const distSelect = document.getElementById('addr-district');
  if (distSelect) {
    distSelect.focus();
    highlightElement(distSelect);
  }
};

window.handleDistrictChange = function(distName) {
  selectedDistrict = distName;
  selectedUpazila = '';

  populateUpazilas(distName);
  recalculateShipping();
  updateAddressUI();

  const upazilaSelect = document.getElementById('addr-upazila');
  if (upazilaSelect) {
    upazilaSelect.focus();
    highlightElement(upazilaSelect);
  }
};

window.handleUpazilaChange = function(upazilaName) {
  selectedUpazila = upazilaName;
  updateAddressUI();

  const detailInput = document.getElementById('addr-detail');
  if (detailInput) {
    detailInput.focus();
    highlightElement(detailInput);
  }
};

window.handleDetailAddressChange = function(val) {
  detailAddress = val.trim();
  updateAddressUI();
};

function populateDistricts(divName, preSelectDistrict = '') {
  const distSelect = document.getElementById('addr-district');
  if (!distSelect) return;

  distSelect.innerHTML = '<option value="" disabled selected>জেলা বেছে নিন</option>';
  distSelect.disabled = false;

  let districts = [];
  if (window.BD_GEO && typeof window.BD_GEO.getDistricts === 'function') {
    districts = window.BD_GEO.getDistricts(divName);
  }

  districts.forEach(dist => {
    const opt = document.createElement('option');
    opt.value = dist;
    opt.textContent = dist;
    if (dist === preSelectDistrict) {
      opt.selected = true;
      selectedDistrict = dist;
    }
    distSelect.appendChild(opt);
  });
}

function populateUpazilas(distName, preSelectUpazila = '') {
  const upazilaSelect = document.getElementById('addr-upazila');
  if (!upazilaSelect) return;

  upazilaSelect.innerHTML = '<option value="" disabled selected>থানা / উপজেলা বেছে নিন</option>';
  upazilaSelect.disabled = false;

  let upazilas = [];
  if (window.BD_GEO && typeof window.BD_GEO.getUpazilas === 'function') {
    upazilas = window.BD_GEO.getUpazilas(distName);
  }

  upazilas.forEach(upz => {
    const opt = document.createElement('option');
    opt.value = upz;
    opt.textContent = upz;
    if (upz === preSelectUpazila) {
      opt.selected = true;
      selectedUpazila = upz;
    }
    upazilaSelect.appendChild(opt);
  });
}

function highlightElement(el) {
  if (!el) return;
  el.classList.remove('is-highlighted');
  void el.offsetWidth; // trigger reflow
  el.classList.add('is-highlighted');
  setTimeout(() => el.classList.remove('is-highlighted'), 1200);
}

function updateAddressUI() {
  const statusPill = document.getElementById('address-status-pill');
  const statusText = document.getElementById('status-pill-text');
  const previewStrip = document.getElementById('addr-confirmed-strip');
  const destinationText = document.getElementById('strip-destination-text');
  const shippingBadge = document.getElementById('strip-shipping-badge');

  const hasArea = selectedDivision && selectedDistrict;
  const isComplete = hasArea && selectedUpazila && detailAddress.length >= 3;

  if (statusPill && statusText) {
    if (isComplete) {
      statusPill.classList.add('ready');
      statusText.textContent = 'ঠিকানা প্রস্তুত ✓';
    } else if (hasArea) {
      statusPill.classList.remove('ready');
      statusText.textContent = `${selectedDistrict} জেলা নির্বাচিত`;
    } else {
      statusPill.classList.remove('ready');
      statusText.textContent = 'এলাকা বেছে নিন';
    }
  }

  if (previewStrip && destinationText && shippingBadge) {
    if (hasArea) {
      previewStrip.style.display = 'flex';
      let path = `${selectedDivision} > ${selectedDistrict}`;
      if (selectedUpazila) path += ` > ${selectedUpazila}`;
      if (detailAddress) path = `${detailAddress}, ${path}`;
      destinationText.textContent = path;

      const fee = currentPackage.shipping === 0 
        ? 'ডেলিভারি চার্জ: ফ্রি! 🎁' 
        : `ডেলিভারি চার্জ: ৳${toBanglaNumber(currentPackage.shipping)}`;
      shippingBadge.textContent = fee;
    } else {
      previewStrip.style.display = 'none';
    }
  }
}

// -------------------------------------------------------------
// 3. STREAMLINED ORDER VALIDATION & SUBMISSION
// -------------------------------------------------------------
window.handleCleanOrderSubmit = function(e) {
  e.preventDefault();

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const divSelect = document.getElementById('addr-division');
  const distSelect = document.getElementById('addr-district');
  const upzSelect = document.getElementById('addr-upazila');
  const detailInput = document.getElementById('addr-detail');
  const submitBtn = document.getElementById('btn-confirm-order');

  const nameFeedback = document.getElementById('name-feedback');
  const phoneFeedback = document.getElementById('phone-feedback');
  const addressFeedback = document.getElementById('address-feedback');

  // Reset errors
  [nameInput, phoneInput, divSelect, distSelect, upzSelect, detailInput].forEach(inp => {
    if (inp) inp.classList.remove('is-invalid');
  });
  [nameFeedback, phoneFeedback, addressFeedback].forEach(fb => {
    if (fb) fb.classList.remove('show');
  });

  let hasError = false;
  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const detail = detailInput ? detailInput.value.trim() : '';

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

  // 3. Validate Address Cascades
  if (!selectedDivision || !selectedDistrict || !selectedUpazila || !detail || detail.length < 3) {
    if (addressFeedback) {
      addressFeedback.textContent = 'অনুগ্রহ করে বিভাগ, জেলা, থানা এবং বিস্তারিত ঠিকানা সঠিকভাবে লিখুন';
      addressFeedback.classList.add('show');
    }

    if (!selectedDivision && divSelect) {
      divSelect.classList.add('is-invalid');
      if (!hasError) divSelect.focus();
    } else if (!selectedDistrict && distSelect) {
      distSelect.classList.add('is-invalid');
      if (!hasError) distSelect.focus();
    } else if (!selectedUpazila && upzSelect) {
      upzSelect.classList.add('is-invalid');
      if (!hasError) upzSelect.focus();
    } else if ((!detail || detail.length < 3) && detailInput) {
      detailInput.classList.add('is-invalid');
      if (!hasError) detailInput.focus();
    }
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

  const fullAddress = `${detail}, ${selectedUpazila}, ${selectedDistrict}, ${selectedDivision}`;

  const orderData = {
    orderId: orderId,
    customerName: name,
    customerPhone: phone,
    fullAddress: fullAddress,
    division: selectedDivision,
    district: selectedDistrict,
    upazila: selectedUpazila,
    detailAddress: detail,
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

  // Reset form inputs & address state
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (detailInput) detailInput.value = '';
  detailAddress = '';

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>🛒 এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>';
  }
};

// Route legacy call if needed
window.handleOrderSubmit = window.handleCleanOrderSubmit;

// -------------------------------------------------------------
// 4. SUCCESS MODAL & RECEIPT DISPLAY
// -------------------------------------------------------------
function showOrderSuccessModal(order) {
  const modal = document.getElementById('success-modal');
  const details = document.getElementById('receipt-details');

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
        <strong style="text-align: right; max-width: 220px;">${order.fullAddress}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>প্যাকেজ:</span>
        <strong>${order.packageTitle} (${order.selectedColor})</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>ডেলিভারি চার্জ:</span>
        <strong style="color: ${order.shippingCost === 0 ? '#059669' : '#0F172A'};">
          ${order.shippingCost === 0 ? 'ফ্রি ডেলিভারি 🎁' : `৳${toBanglaNumber(order.shippingCost)}`}
        </strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed #CBD5E1; padding-top: 6px; font-weight: 700; color: var(--text-main);">
        <span>সর্বমোট বিল:</span>
        <span style="color: var(--primary); font-size: 1.15rem;">৳${toBanglaNumber(order.totalPrice)}</span>
      </div>
    `;
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
// 6. POLICY MODALS & CENTRALIZED CONFIG SYNC
// -------------------------------------------------------------
function getPolicyRefundText() {
  const cfg = (typeof window !== 'undefined' && window.SITE_CONFIG) ? window.SITE_CONFIG : {
    WHATSAPP_NUMBER: "971567813203",
    HOTLINE_DISPLAY: "+971567813203"
  };
  const hotlineBn = toBanglaNumber(cfg.HOTLINE_DISPLAY);
  const waBn = toBanglaNumber('+' + cfg.WHATSAPP_NUMBER);

  return `
    <h2>🔄 রিটার্ন ও রিপ্লেসমেন্ট পলিসি</h2>
    <p>আমাদের কাছে গ্রাহকের শতভাগ সন্তুষ্টিই প্রথম অগ্রাধিকার। আপনি যেন নিশ্চিন্তে কেনাকাটা করতে পারেন, সেজন্য রয়েছে সহজ ৭ দিনের রিটার্ন ও ফ্রি এক্সচেঞ্জ সুবিধা।</p>
    <h3>শর্তাবলী:</h3>
    <ul>
      <li>ডেলিভারি পাওয়ার পর পার্সেল খুলে ডেলিভারি ম্যানের সামনেই চেক করে নিতে পারবেন।</li>
      <li>যদি কোনো ত্রুটি (যেমন: ফেটে যাওয়া, কাটা বা কালার ভুল) পাওয়া যায়, সাথে সাথে হটলাইনে কল দিন বা হোয়াটসঅ্যাপে জানান।</li>
      <li>আমরা সম্পূর্ণ ফ্রিতে আপনাকে দ্রুত নতুন প্রোডাক্ট রিপ্লেস করে দেব। কোনো অতিরিক্ত চার্জ দিতে হবে না।</li>
      <li>অভিযোগ জানাতে হটলাইন: (${hotlineBn}) অথবা হোয়াটসঅ্যাপ: (${waBn})।</li>
    </ul>
  `;
}

const policyTexts = {
  refund: '', // Dynamically generated by getPolicyRefundText()
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
  if (modal && content) {
    if (type === 'refund') {
      content.innerHTML = getPolicyRefundText();
    } else if (policyTexts[type]) {
      content.innerHTML = policyTexts[type];
    }
    modal.classList.add('open');
  }
};

function applySiteConfig() {
  const cfg = (typeof window !== 'undefined' && window.SITE_CONFIG) ? window.SITE_CONFIG : {
    WHATSAPP_NUMBER: "971567813203",
    HOTLINE_DISPLAY: "+971567813203",
    PIXEL_ID: ""
  };

  const rawHotline = cfg.HOTLINE_DISPLAY.replace(/[^0-9+]/g, '');
  const rawWaNumber = cfg.WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  const waDisplay = '+' + rawWaNumber;

  const hotlineBn = toBanglaNumber(cfg.HOTLINE_DISPLAY);
  const waBn = toBanglaNumber(waDisplay);

  // 1. Header Call Link
  const headerCall = document.getElementById('btn-header-call') || document.querySelector('.btn-header-call');
  if (headerCall) {
    headerCall.href = `tel:${rawHotline}`;
  }

  // 2. Footer Hotline Link
  const footerHotline = document.getElementById('footer-hotline-link');
  if (footerHotline) {
    footerHotline.href = `tel:${rawHotline}`;
    footerHotline.textContent = hotlineBn;
  }

  // 3. Footer WhatsApp Link
  const footerWa = document.getElementById('footer-whatsapp-link');
  if (footerWa) {
    footerWa.href = `https://wa.me/${rawWaNumber}`;
    footerWa.textContent = waBn;
  }

  // 4. Floating WhatsApp Widget
  const floatingWa = document.getElementById('floating-wa-btn');
  if (floatingWa) {
    floatingWa.href = `https://wa.me/${rawWaNumber}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি সিলিকন ফিডিং সেট সম্পর্কে জানতে চাই।')}`;
  }

  // 5. Success Modal Hotline
  const modalHotline = document.getElementById('modal-hotline-link');
  if (modalHotline) {
    modalHotline.href = `tel:${rawHotline}`;
    modalHotline.textContent = hotlineBn;
  }

  // 6. Generic Span and Link classes
  document.querySelectorAll('.config-hotline-bn').forEach(el => el.textContent = hotlineBn);
  document.querySelectorAll('.config-whatsapp-bn').forEach(el => el.textContent = waBn);
  document.querySelectorAll('.config-hotline-raw').forEach(el => el.textContent = cfg.HOTLINE_DISPLAY);
  document.querySelectorAll('.config-whatsapp-raw').forEach(el => el.textContent = waDisplay);
  document.querySelectorAll('.config-hotline-link').forEach(el => el.href = `tel:${rawHotline}`);
  document.querySelectorAll('.config-whatsapp-link').forEach(el => el.href = `https://wa.me/${rawWaNumber}`);
}

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
  applySiteConfig();
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
