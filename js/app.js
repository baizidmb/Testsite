/**
 * Baby Silicone Feeder Store - Core Application Logic
 * 100% Mobile & Touch Optimized, Real-time Validation & High Conversion Funnel
 * With Bangladesh 64 Districts & Upazilas Integration & Smart Shipping
 */

// State variables
let currentPackage = {
  id: 1,
  name: '১টি সম্পূর্ণ সেট (৬ পিস)',
  price: 1190,
  quantity: 1,
  unitPrice: 1190,
  isFreeShipping: false
};

let currentColor = 'স্কাই ব্লু (Sky Blue)';
let currentDivision = '';
let currentDistrict = '';
let currentUpazila = '';
let currentVillage = '';
let currentStreet = '';
let currentShippingArea = 'dhaka'; // 'dhaka' or 'outside'
let currentShippingCost = 70;
let currentCouponDiscount = 0;
let appliedCouponCode = '';
let checkoutInitiated = false;

// Bengali Number Formatter
function toBanglaNumber(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bnDigits[d]);
}

// -------------------------------------------------------------
// 1. TOUCH-SWIPE & INTERACTIVE PRODUCT GALLERY
// -------------------------------------------------------------
const galleryImages = [
  'images/product-main.jpg',
  'images/product-bowl.jpg',
  'images/product-plate.jpg',
  'images/product-bib.jpg',
  'images/product-cup.jpg',
  'images/product-fork-spoon.jpg'
];

let currentSlideIndex = 0;

function initGallery() {
  const mainImgWrapper = document.getElementById('main-product-img-wrapper');
  const mainImg = document.getElementById('main-product-img');
  const thumbs = document.querySelectorAll('.thumb-item');
  const dots = document.querySelectorAll('.gallery-dot');
  const counterEl = document.getElementById('curr-slide-num');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');

  function setSlide(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    currentSlideIndex = index;

    // Transition image
    if (mainImg) {
      mainImg.style.opacity = '0.4';
      mainImg.src = galleryImages[currentSlideIndex];
      setTimeout(() => {
        mainImg.style.opacity = '1';
      }, 120);
    }

    // Update Counter
    if (counterEl) {
      counterEl.textContent = toBanglaNumber(currentSlideIndex + 1);
    }

    // Update Thumbnails
    thumbs.forEach((thumb, idx) => {
      if (idx === currentSlideIndex) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });

    // Update Dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  // Thumbnails click
  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => setSlide(idx));
  });

  // Dots click
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => setSlide(idx));
  });

  // Next / Prev buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      setSlide(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      setSlide(currentSlideIndex + 1);
    });
  }

  // Mobile Touch Swipe Handling
  if (mainImgWrapper) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    mainImgWrapper.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainImgWrapper.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          setSlide(currentSlideIndex + 1);
        } else {
          setSlide(currentSlideIndex - 1);
        }
      }
    }
  }
}

// -------------------------------------------------------------
// 2. COUNTDOWN TIMER
// -------------------------------------------------------------
function initCountdown() {
  const timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  let totalSeconds = 8 * 3600 + 45 * 60 + 12;

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 12 * 3600;
    }
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = n => (n < 10 ? '0' + n : n);
    const timeStr = `${pad(h)}:${pad(m)}:${pad(s)}`;
    timerEl.textContent = toBanglaNumber(timeStr);
  }, 1000);
}

// -------------------------------------------------------------
// 3. COLOR SELECTION & SYNC
// -------------------------------------------------------------
function initColorSync() {
  const heroSwatches = document.querySelectorAll('#hero-color-swatches .color-swatch-btn');
  const formSwatches = document.querySelectorAll('.color-choice-group .color-option-btn');
  const heroColorText = document.getElementById('selected-color-hero-text');
  const summaryColorText = document.getElementById('summary-color-name');
  const summaryMetaColor = document.getElementById('summary-meta-color');

  heroSwatches.forEach(btn => {
    btn.addEventListener('click', function () {
      heroSwatches.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const color = this.getAttribute('data-color');
      setColor(color);
    });
  });

  window.selectFormColor = function (element) {
    formSwatches.forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
    const color = element.getAttribute('data-color');
    setColor(color);
  };

  function setColor(color) {
    currentColor = color;
    if (heroColorText) heroColorText.textContent = color;
    if (summaryColorText) summaryColorText.textContent = color;
    if (summaryMetaColor) summaryMetaColor.textContent = `🎨 ${color.split(' ')[0]}`;

    // Sync hero swatches
    heroSwatches.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-color') === color);
    });

    // Sync form swatches
    formSwatches.forEach(b => {
      b.classList.toggle('selected', b.getAttribute('data-color') === color);
    });

    updateWhatsAppDirectLink();

    if (window.PixelTracker) {
      PixelTracker.trackAddToCart({
        name: `সিলিকন ফিডিং সেট - ${color}`,
        price: currentPackage.price,
        quantity: currentPackage.quantity
      });
    }
  }
}

// -------------------------------------------------------------
// 4. ANIMATED 4-STEP LOCATION WIZARD (DIVISION -> DISTRICT -> UPAZILA -> VILLAGE)
// -------------------------------------------------------------
function initLocationWizard() {
  const divContainer = document.getElementById('division-cards-container');
  if (!divContainer || !window.BD_GEO) return;

  const divisions = window.BD_GEO.getDivisions();
  divContainer.innerHTML = '';

  divisions.forEach(divName => {
    const icon = window.BD_GEO.icons ? (window.BD_GEO.icons[divName] || '📍') : '📍';
    const card = document.createElement('div');
    card.className = 'division-card';
    card.setAttribute('data-division', divName);
    card.innerHTML = `
      <span class="div-icon">${icon}</span>
      <span class="div-name">${divName}</span>
    `;
    card.addEventListener('click', () => selectDivision(divName));
    divContainer.appendChild(card);
  });

  // Breadcrumbs click jump handlers
  const crumbDiv = document.getElementById('crumb-division');
  const crumbDist = document.getElementById('crumb-district');
  const crumbUpz = document.getElementById('crumb-upazila');
  const crumbVil = document.getElementById('crumb-village');

  if (crumbDiv) {
    crumbDiv.style.cursor = 'pointer';
    crumbDiv.addEventListener('click', () => {
      document.getElementById('step-division-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  if (crumbDist) {
    crumbDist.style.cursor = 'pointer';
    crumbDist.addEventListener('click', () => {
      if (currentDivision) {
        document.getElementById('step-district-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
  if (crumbUpz) {
    crumbUpz.style.cursor = 'pointer';
    crumbUpz.addEventListener('click', () => {
      if (currentDistrict) {
        document.getElementById('step-upazila-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
  if (crumbVil) {
    crumbVil.style.cursor = 'pointer';
    crumbVil.addEventListener('click', () => {
      if (currentUpazila) {
        document.getElementById('step-village-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        document.getElementById('cust-village')?.focus();
      }
    });
  }
}

function selectDivision(divName) {
  currentDivision = divName;
  currentDistrict = '';
  currentUpazila = '';

  // Update division cards UI
  document.querySelectorAll('.division-card').forEach(c => {
    c.classList.toggle('selected', c.getAttribute('data-division') === divName);
  });

  // Clear errors
  const divFeedback = document.getElementById('division-feedback');
  if (divFeedback) divFeedback.className = 'field-feedback-msg';

  // Update Breadcrumbs
  updateBreadcrumbs(1);

  // Update live address badge
  updateLiveAddressBadge();

  // Populate District Pills
  const districtBox = document.getElementById('step-district-box');
  const distPillsContainer = document.getElementById('district-pills-container');
  const activeDivSpan = document.getElementById('active-div-name');

  if (activeDivSpan) activeDivSpan.textContent = divName;

  if (distPillsContainer && window.BD_GEO) {
    distPillsContainer.innerHTML = '';
    const districts = window.BD_GEO.getDistricts(divName);

    districts.forEach(dist => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'geo-pill-btn';
      btn.setAttribute('data-district', dist);
      btn.textContent = dist;
      btn.addEventListener('click', () => selectDistrict(dist));
      distPillsContainer.appendChild(btn);
    });
  }

  // Show district box, hide further steps
  if (districtBox) {
    districtBox.classList.add('visible');
    setTimeout(() => {
      districtBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  const upazilaBox = document.getElementById('step-upazila-box');
  if (upazilaBox) upazilaBox.classList.remove('visible');

  const villageBox = document.getElementById('step-village-box');
  if (villageBox) villageBox.classList.remove('visible');

  updateWhatsAppDirectLink();
}

function selectDistrict(distName) {
  currentDistrict = distName;
  currentUpazila = '';

  // Update district pills UI
  document.querySelectorAll('#district-pills-container .geo-pill-btn').forEach(b => {
    b.classList.toggle('selected', b.getAttribute('data-district') === distName);
  });

  // Clear errors
  const distFeedback = document.getElementById('district-feedback');
  if (distFeedback) distFeedback.className = 'field-feedback-msg';

  // Auto assign shipping: Dhaka vs Outside
  if (distName === 'ঢাকা') {
    selectShipping('dhaka', 70);
  } else {
    selectShipping('outside', 130);
  }

  // Update Breadcrumbs
  updateBreadcrumbs(2);

  // Update Live Address Badge
  updateLiveAddressBadge();

  // Update Summary badge
  const destBadge = document.getElementById('summary-meta-dest');
  if (destBadge) destBadge.textContent = `📍 ${distName}`;

  // Populate Upazilas
  const upazilaBox = document.getElementById('step-upazila-box');
  const upazilaContainer = document.getElementById('upazila-pills-container');
  const activeDistSpan = document.getElementById('active-dist-name');

  if (activeDistSpan) activeDistSpan.textContent = distName;

  if (upazilaContainer && window.BD_GEO) {
    upazilaContainer.innerHTML = '';
    const upazilas = window.BD_GEO.getUpazilas(distName);

    upazilas.forEach(upz => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'geo-pill-btn';
      btn.setAttribute('data-upazila', upz);
      btn.textContent = upz;
      btn.addEventListener('click', () => selectUpazila(upz));
      upazilaContainer.appendChild(btn);
    });
  }

  // Show upazila box, hide village box
  if (upazilaBox) {
    upazilaBox.classList.add('visible');
    setTimeout(() => {
      upazilaBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  const villageBox = document.getElementById('step-village-box');
  if (villageBox) villageBox.classList.remove('visible');

  updateWhatsAppDirectLink();
}

function selectUpazila(upzName) {
  currentUpazila = upzName;

  // Update upazila pills UI
  document.querySelectorAll('#upazila-pills-container .geo-pill-btn').forEach(b => {
    b.classList.toggle('selected', b.getAttribute('data-upazila') === upzName);
  });

  // Clear errors
  const upzFeedback = document.getElementById('upazila-feedback');
  if (upzFeedback) upzFeedback.className = 'field-feedback-msg';

  // Update Breadcrumbs
  updateBreadcrumbs(3);

  // Update Live Address Badge
  updateLiveAddressBadge();

  // Update Summary badge
  const destBadge = document.getElementById('summary-meta-dest');
  if (destBadge) destBadge.textContent = `📍 ${currentDistrict} > ${upzName}`;

  // Show Village box
  const villageBox = document.getElementById('step-village-box');
  if (villageBox) {
    villageBox.classList.add('visible');
    setTimeout(() => {
      villageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const vilInput = document.getElementById('cust-village');
      if (vilInput && !vilInput.value) vilInput.focus();
    }, 120);
  }

  updateWhatsAppDirectLink();
}

// Village quick helper chips
window.insertVillageChip = function(tag) {
  const vilInput = document.getElementById('cust-village');
  if (!vilInput) return;

  const currentVal = vilInput.value.trim();
  if (!currentVal) {
    vilInput.value = tag;
  } else if (!currentVal.includes(tag.trim())) {
    vilInput.value = `${currentVal}, ${tag}`;
  }
  vilInput.focus();
  vilInput.dispatchEvent(new Event('input'));
};

window.handleVillageInput = function(val) {
  currentVillage = val.trim();
  const feedback = document.getElementById('village-feedback');
  const inputEl = document.getElementById('cust-village');

  if (currentVillage.length >= 2) {
    if (inputEl) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
    }
    if (feedback) feedback.className = 'field-feedback-msg';
  }

  if (currentVillage.length >= 3) {
    updateBreadcrumbs(4);
  }

  updateLiveAddressBadge();
  updateWhatsAppDirectLink();
};

window.handleStreetInput = function(val) {
  currentStreet = val.trim();
  updateLiveAddressBadge();
  updateWhatsAppDirectLink();
};

function updateBreadcrumbs(stage) {
  const cDiv = document.getElementById('crumb-division');
  const cDist = document.getElementById('crumb-district');
  const cUpz = document.getElementById('crumb-upazila');
  const cVil = document.getElementById('crumb-village');

  // reset all
  [cDiv, cDist, cUpz, cVil].forEach(c => {
    if (c) c.className = 'location-crumb';
  });

  if (stage === 1) {
    if (cDiv) cDiv.className = 'location-crumb completed';
    if (cDist) cDist.className = 'location-crumb active';
  } else if (stage === 2) {
    if (cDiv) cDiv.className = 'location-crumb completed';
    if (cDist) cDist.className = 'location-crumb completed';
    if (cUpz) cUpz.className = 'location-crumb active';
  } else if (stage === 3) {
    if (cDiv) cDiv.className = 'location-crumb completed';
    if (cDist) cDist.className = 'location-crumb completed';
    if (cUpz) cUpz.className = 'location-crumb completed';
    if (cVil) cVil.className = 'location-crumb active';
  } else if (stage === 4) {
    if (cDiv) cDiv.className = 'location-crumb completed';
    if (cDist) cDist.className = 'location-crumb completed';
    if (cUpz) cUpz.className = 'location-crumb completed';
    if (cVil) cVil.className = 'location-crumb completed';
  } else {
    if (cDiv) cDiv.className = 'location-crumb active';
  }
}

function updateLiveAddressBadge() {
  const badgeText = document.getElementById('live-address-text');
  const badgeCard = document.getElementById('live-address-badge');
  if (!badgeText) return;

  let text = '';
  if (!currentDivision) {
    text = 'প্রথমে নিচের তালিকা থেকে আপনার বিভাগ বেছে নিন';
  } else if (!currentDistrict) {
    text = `${currentDivision} › জেলা বেছে নিন`;
  } else if (!currentUpazila) {
    text = `${currentDivision} › ${currentDistrict} › থানা/উপজেলা বেছে নিন`;
  } else {
    text = `${currentDistrict} › ${currentUpazila}`;
    if (currentVillage) {
      text += ` › ${currentVillage}`;
    }
    if (currentStreet) {
      text += ` (${currentStreet})`;
    }
  }

  badgeText.textContent = text;

  if (badgeCard) {
    badgeCard.classList.remove('highlight');
    void badgeCard.offsetWidth; // trigger reflow for animation
    badgeCard.classList.add('highlight');
  }
}

// -------------------------------------------------------------
// 5. PACKAGE SELECTION & QUANTITY SELECTOR
// -------------------------------------------------------------
function selectPackage(pkgId, price, isFreeShip) {
  currentPackage.id = pkgId;
  currentPackage.quantity = pkgId;
  currentPackage.unitPrice = pkgId === 1 ? 1190 : 1145;
  currentPackage.price = price;
  currentPackage.isFreeShipping = pkgId >= 2;
  currentPackage.name = pkgId === 1 ? '১টি সম্পূর্ণ সেট (৬ পিস)' : `${toBanglaNumber(pkgId)}টি সম্পূর্ণ সেট কম্বো`;

  const qtyDisplay = document.getElementById('order-qty-val');
  if (qtyDisplay) qtyDisplay.textContent = toBanglaNumber(pkgId);

  const summaryMetaQty = document.getElementById('summary-meta-qty');
  if (summaryMetaQty) summaryMetaQty.textContent = `📦 ${toBanglaNumber(pkgId)}টি সেট`;

  document.querySelectorAll('.package-card').forEach(card => card.classList.remove('selected'));
  const targetCard = document.getElementById(`pkg-card-${pkgId}`);
  if (targetCard) targetCard.classList.add('selected');

  updateOrderSummary();

  if (window.PixelTracker) {
    PixelTracker.trackAddToCart({
      name: currentPackage.name,
      price: currentPackage.price,
      quantity: pkgId
    });
  }
}

function adjustQty(delta) {
  let newQty = currentPackage.quantity + delta;
  if (newQty < 1) newQty = 1;
  if (newQty > 10) newQty = 10;

  currentPackage.quantity = newQty;

  if (newQty === 1) {
    currentPackage.price = 1190;
    currentPackage.isFreeShipping = false;
    currentPackage.name = '১টি সম্পূর্ণ সেট (৬ পিস)';
    document.querySelectorAll('.package-card').forEach(card => card.classList.remove('selected'));
    const singleCard = document.getElementById('pkg-card-1');
    if (singleCard) singleCard.classList.add('selected');
  } else if (newQty === 2) {
    currentPackage.price = 2290;
    currentPackage.isFreeShipping = true;
    currentPackage.name = '২টি সম্পূর্ণ সেট (১২ পিস)';
    document.querySelectorAll('.package-card').forEach(card => card.classList.remove('selected'));
    const doubleCard = document.getElementById('pkg-card-2');
    if (doubleCard) doubleCard.classList.add('selected');
  } else {
    currentPackage.price = 1100 * newQty;
    currentPackage.isFreeShipping = true;
    currentPackage.name = `${toBanglaNumber(newQty)}টি সম্পূর্ণ সেট ফ্যামিলি প্যাক`;
    document.querySelectorAll('.package-card').forEach(card => card.classList.remove('selected'));
  }

  const qtyDisplay = document.getElementById('order-qty-val');
  if (qtyDisplay) qtyDisplay.textContent = toBanglaNumber(newQty);

  const summaryMetaQty = document.getElementById('summary-meta-qty');
  if (summaryMetaQty) summaryMetaQty.textContent = `📦 ${toBanglaNumber(newQty)}টি সেট`;

  updateOrderSummary();
}

// -------------------------------------------------------------
// 6. SHIPPING AREA SELECTION
// -------------------------------------------------------------
function selectShipping(area, baseCost) {
  currentShippingArea = area;

  document.querySelectorAll('.shipping-card').forEach(card => card.classList.remove('selected'));
  const targetCard = document.getElementById(`ship-card-${area}`);
  if (targetCard) targetCard.classList.add('selected');

  updateOrderSummary();
}

// -------------------------------------------------------------
// 7. COUPON CODE LOGIC
// -------------------------------------------------------------
function toggleCouponBox() {
  const box = document.getElementById('coupon-input-group');
  if (!box) return;
  box.style.display = box.style.display === 'none' ? 'flex' : 'none';
  if (box.style.display === 'flex') {
    const input = document.getElementById('coupon-code-input');
    if (input) input.focus();
  }
}

function applyCouponCode() {
  const input = document.getElementById('coupon-code-input');
  const msgEl = document.getElementById('coupon-msg');
  if (!input) return;

  const code = input.value.trim().toUpperCase();

  if (code === 'BABY50') {
    currentCouponDiscount = 50;
    appliedCouponCode = code;
    if (msgEl) {
      msgEl.textContent = '🎉 অভিনন্দন! স্পেশাল কুপনে ৳৫০ ডিসকাউন্ট যুক্ত হয়েছে!';
      msgEl.className = 'coupon-feedback success';
    }
  } else if (code === 'FIRST100') {
    if (currentPackage.price >= 2000) {
      currentCouponDiscount = 100;
      appliedCouponCode = code;
      if (msgEl) {
        msgEl.textContent = '🎉 অভিনন্দন! মেগা কুপনে ৳১০০ ডিসকাউন্ট যুক্ত হয়েছে!';
        msgEl.className = 'coupon-feedback success';
      }
    } else {
      if (msgEl) {
        msgEl.textContent = '⚠️ এই কুপনটি ২ বা ততোধিক সেটের অর্ডারে প্রযোজ্য।';
        msgEl.className = 'coupon-feedback error';
      }
      return;
    }
  } else {
    currentCouponDiscount = 0;
    appliedCouponCode = '';
    if (msgEl) {
      msgEl.textContent = '❌ দুঃখিত, এই কুপন কোডটি সঠিক নয়। BABY50 ট্রাই করুন!';
      msgEl.className = 'coupon-feedback error';
    }
  }

  updateOrderSummary();
}

// -------------------------------------------------------------
// 8. UPDATE ORDER SUMMARY & WHATSAPP DIRECT LINK
// -------------------------------------------------------------
function updateOrderSummary() {
  const pkgNameEl = document.getElementById('summary-pkg-name');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  const freeShipTag = document.getElementById('free-shipping-tag');
  const couponRow = document.getElementById('coupon-discount-row');
  const couponDiscountEl = document.getElementById('summary-coupon-discount');

  const dhakaCostText = document.getElementById('ship-cost-dhaka-text');
  const outsideCostText = document.getElementById('ship-cost-outside-text');

  // Compute shipping
  let effectiveShipping = 0;
  if (!currentPackage.isFreeShipping) {
    effectiveShipping = currentShippingArea === 'dhaka' ? 70 : 130;
  }
  currentShippingCost = effectiveShipping;

  // Free shipping feedback
  if (currentPackage.isFreeShipping) {
    if (freeShipTag) freeShipTag.style.display = 'block';
    if (dhakaCostText) dhakaCostText.innerHTML = '<span style="color:#059669; font-weight:700;">ফ্রি (৳০)</span>';
    if (outsideCostText) outsideCostText.innerHTML = '<span style="color:#059669; font-weight:700;">ফ্রি (৳০)</span>';
  } else {
    if (freeShipTag) freeShipTag.style.display = 'none';
    if (dhakaCostText) dhakaCostText.textContent = '৳৭০';
    if (outsideCostText) outsideCostText.textContent = '৳১৩০';
  }

  // Coupon row
  if (currentCouponDiscount > 0) {
    if (couponRow) couponRow.style.display = 'flex';
    if (couponDiscountEl) couponDiscountEl.textContent = `-৳${toBanglaNumber(currentCouponDiscount)}`;
  } else {
    if (couponRow) couponRow.style.display = 'none';
  }

  const grandTotal = Math.max(0, currentPackage.price + effectiveShipping - currentCouponDiscount);

  if (pkgNameEl) pkgNameEl.textContent = currentPackage.name;
  if (subtotalEl) subtotalEl.textContent = `৳${toBanglaNumber(currentPackage.price)}`;
  if (shippingEl) {
    shippingEl.textContent = effectiveShipping === 0 ? 'ফ্রি (৳০)' : `৳${toBanglaNumber(effectiveShipping)}`;
    shippingEl.style.color = effectiveShipping === 0 ? '#059669' : 'inherit';
    shippingEl.style.fontWeight = effectiveShipping === 0 ? '700' : 'normal';
  }
  if (totalEl) totalEl.textContent = `৳${toBanglaNumber(grandTotal)}`;

  updateWhatsAppDirectLink();
}

function updateWhatsAppDirectLink() {
  const waBtn = document.getElementById('btn-whatsapp-direct-order');
  if (!waBtn) return;

  const grandTotal = Math.max(0, currentPackage.price + currentShippingCost - currentCouponDiscount);
  let locationParts = [];
  if (currentDistrict) locationParts.push(currentDistrict);
  if (currentUpazila) locationParts.push(currentUpazila);
  if (currentVillage) locationParts.push(currentVillage);
  const locationText = locationParts.length > 0 ? locationParts.join(' > ') : 'বাংলাদেশ';

  const message = `আসসালামু আলাইকুম LittleNest BD, আমি সরাসরি হোয়াটসঅ্যাপে অর্ডার কনফার্ম করতে চাই:\n\n📦 প্যাকেজ: ${currentPackage.name}\n🎨 পছন্দের কালার: ${currentColor}\n📍 ডেলিভারি এলাকা: ${locationText}\n💰 সর্বমোট প্রদেয় বিল: ৳${grandTotal}\n🚚 ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)\n\nআমার নাম, মোবাইল ও সম্পূর্ণ ঠিকানা নিচে দিচ্ছি:`;

  waBtn.href = `https://wa.me/8801700000000?text=${encodeURIComponent(message)}`;
}

// -------------------------------------------------------------
// 9. INLINE FORM VALIDATION & SUBMISSION
// -------------------------------------------------------------
function setupFormValidation() {
  const phoneInput = document.getElementById('cust-phone');
  const nameInput = document.getElementById('cust-name');
  const villageInput = document.getElementById('cust-village');

  const phoneFeedback = document.getElementById('phone-feedback');
  const nameFeedback = document.getElementById('name-feedback');
  const villageFeedback = document.getElementById('village-feedback');

  // Real-time phone check
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let cleanVal = this.value.replace(/[^0-9+]/g, '');
      this.value = cleanVal;

      const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
      if (phoneRegex.test(cleanVal)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        if (phoneFeedback) {
          phoneFeedback.textContent = '✅ মোবাইল নম্বরটি সঠিক হয়েছে';
          phoneFeedback.className = 'field-feedback-msg show-success';
        }
      } else {
        this.classList.remove('is-valid');
        if (cleanVal.length >= 11) {
          this.classList.add('is-invalid');
          if (phoneFeedback) {
            phoneFeedback.textContent = '⚠️ ১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
            phoneFeedback.className = 'field-feedback-msg show-error';
          }
        } else {
          if (phoneFeedback) phoneFeedback.className = 'field-feedback-msg';
        }
      }
    });
  }

  // Clear errors on input
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      if (this.value.trim().length >= 2) {
        this.classList.remove('is-invalid');
        if (nameFeedback) nameFeedback.className = 'field-feedback-msg';
      }
    });
  }

  if (villageInput) {
    villageInput.addEventListener('input', function () {
      if (this.value.trim().length >= 2) {
        this.classList.remove('is-invalid');
        if (villageFeedback) villageFeedback.className = 'field-feedback-msg';
      }
    });
  }
}

function handleOrderSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const villageInput = document.getElementById('cust-village');
  const streetInput = document.getElementById('cust-street');
  const noteInput = document.getElementById('cust-note');
  const submitBtn = document.getElementById('btn-confirm-order');

  const nameFeedback = document.getElementById('name-feedback');
  const phoneFeedback = document.getElementById('phone-feedback');
  const divisionFeedback = document.getElementById('division-feedback');
  const districtFeedback = document.getElementById('district-feedback');
  const upazilaFeedback = document.getElementById('upazila-feedback');
  const villageFeedback = document.getElementById('village-feedback');

  let hasError = false;

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const village = villageInput ? villageInput.value.trim() : currentVillage;
  const street = streetInput ? streetInput.value.trim() : currentStreet;
  const note = noteInput ? noteInput.value.trim() : '';

  // Validate Name
  if (!name || name.length < 2) {
    if (nameInput) nameInput.classList.add('is-invalid');
    if (nameFeedback) {
      nameFeedback.textContent = '⚠️ অনুগ্রহ করে আপনার পুরো নামটি লিখুন';
      nameFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError && nameInput) nameInput.focus();
    hasError = true;
  }

  // Validate Phone
  const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!phone || !phoneRegex.test(phone)) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    if (phoneFeedback) {
      phoneFeedback.textContent = '⚠️ অনুগ্রহ করে সচল ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
      phoneFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError && phoneInput) phoneInput.focus();
    hasError = true;
  }

  // Validate Division
  if (!currentDivision) {
    if (divisionFeedback) {
      divisionFeedback.textContent = '⚠️ অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন';
      divisionFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError) {
      document.getElementById('step-division-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    hasError = true;
  }

  // Validate District
  if (!currentDistrict) {
    if (districtFeedback) {
      districtFeedback.textContent = '⚠️ অনুগ্রহ করে আপনার জেলা নির্বাচন করুন';
      districtFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError) {
      document.getElementById('step-district-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    hasError = true;
  }

  // Validate Upazila
  if (!currentUpazila) {
    if (upazilaFeedback) {
      upazilaFeedback.textContent = '⚠️ অনুগ্রহ করে আপনার উপজেলা বা থানা নির্বাচন করুন';
      upazilaFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError) {
      document.getElementById('step-upazila-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    hasError = true;
  }

  // Validate Village
  if (!village || village.length < 2) {
    if (villageInput) villageInput.classList.add('is-invalid');
    if (villageFeedback) {
      villageFeedback.textContent = '⚠️ অনুগ্রহ করে আপনার গ্রাম, পাড়া বা এলাকার নাম লিখুন';
      villageFeedback.className = 'field-feedback-msg show-error';
    }
    if (!hasError && villageInput) villageInput.focus();
    hasError = true;
  }

  if (hasError) return;

  // Disable button while processing
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ অর্ডার কনফার্ম হচ্ছে...</span>';
  }

  const grandTotal = Math.max(0, currentPackage.price + currentShippingCost - currentCouponDiscount);
  const orderId = 'LN-' + Math.floor(100000 + Math.random() * 900000);
  const orderTime = new Date().toLocaleString('bn-BD', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const fullDeliveryAddress = `${village}${street ? ', ' + street : ''}, ${currentUpazila}, ${currentDistrict}, ${currentDivision}`;

  const orderData = {
    orderId: orderId,
    customerName: name,
    customerPhone: phone,
    division: currentDivision,
    district: currentDistrict,
    upazila: currentUpazila,
    village: village,
    street: street,
    detailedAddress: `${village}${street ? ', ' + street : ''}`,
    fullAddress: fullDeliveryAddress,
    specialNote: note,
    packageTitle: currentPackage.name,
    quantity: currentPackage.quantity,
    selectedColor: currentColor,
    shippingArea: currentShippingArea === 'dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে',
    shippingCost: currentShippingCost,
    subtotal: currentPackage.price,
    couponCode: appliedCouponCode,
    couponDiscount: currentCouponDiscount,
    totalPrice: grandTotal,
    orderDate: orderTime,
    timestamp: Date.now(),
    status: 'New'
  };

  // Save to LocalStorage
  saveOrderToStorage(orderData);

  // Trigger Facebook Pixel Purchase Event
  if (window.PixelTracker) {
    PixelTracker.trackPurchase(orderData);
  }

  // Show Success Modal
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🛒 অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>';
    }
    showSuccessReceipt(orderData);
    e.target.reset();

    // Reset location wizard state
    currentDivision = '';
    currentDistrict = '';
    currentUpazila = '';
    currentVillage = '';
    currentStreet = '';
    currentCouponDiscount = 0;
    appliedCouponCode = '';

    document.querySelectorAll('.division-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.geo-pill-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('step-district-box')?.classList.remove('visible');
    document.getElementById('step-upazila-box')?.classList.remove('visible');
    document.getElementById('step-village-box')?.classList.remove('visible');
    updateBreadcrumbs(0);
    updateLiveAddressBadge();

    document.querySelectorAll('.form-input, .form-textarea').forEach(el => {
      el.classList.remove('is-valid');
      el.classList.remove('is-invalid');
    });
  }, 350);
}

// Save order locally for store admin
function saveOrderToStorage(order) {
  try {
    const existing = JSON.parse(localStorage.getItem('babycare_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('babycare_orders', JSON.stringify(existing));
    renderAdminOrders();
  } catch (err) {
    console.error('Error saving order to storage', err);
  }
}

// Show receipt in modal
function showSuccessReceipt(order) {
  const receiptEl = document.getElementById('receipt-details');
  const modal = document.getElementById('success-modal');
  const waBtn = document.getElementById('btn-whatsapp-receipt');

  if (receiptEl) {
    receiptEl.innerHTML = `
      <div class="receipt-row">
        <span>অর্ডার আইডি:</span>
        <strong style="color: #0F172A; font-family: Inter;">#${order.orderId}</strong>
      </div>
      <div class="receipt-row">
        <span>গ্রাহকের নাম:</span>
        <span>${order.customerName}</span>
      </div>
      <div class="receipt-row">
        <span>মোবাইল নম্বর:</span>
        <span>${order.customerPhone}</span>
      </div>
      <div class="receipt-row">
        <span>বিভাগ ও জেলা:</span>
        <span>${order.division || ''} › ${order.district || ''}</span>
      </div>
      <div class="receipt-row">
        <span>থানা / উপজেলা:</span>
        <span>${order.upazila || ''}</span>
      </div>
      <div class="receipt-row">
        <span>গ্রাম / পাড়া / এলাকা:</span>
        <span>${order.village || order.detailedAddress || ''}</span>
      </div>
      ${order.street ? `
      <div class="receipt-row">
        <span>বাসা/রোড/ল্যান্ডমার্ক:</span>
        <span>${order.street}</span>
      </div>` : ''}
      ${order.specialNote ? `
      <div class="receipt-row">
        <span>বিশেষ অনুরোধ:</span>
        <span style="color: #64748B;">${order.specialNote}</span>
      </div>` : ''}
      <div class="receipt-row">
        <span>প্যাকেজ ও কালার:</span>
        <span>${order.packageTitle} (${order.selectedColor})</span>
      </div>
      ${order.couponDiscount > 0 ? `
      <div class="receipt-row" style="color:#059669; font-weight:600;">
        <span>কুপন ডিসকাউন্ট (${order.couponCode}):</span>
        <span>-৳${toBanglaNumber(order.couponDiscount)}</span>
      </div>` : ''}
      <div class="receipt-row">
        <span>ডেলিভারি চার্জ:</span>
        <span>${order.shippingCost === 0 ? 'ফ্রি (৳০)' : `৳${toBanglaNumber(order.shippingCost)}`}</span>
      </div>
      <div class="receipt-row bold">
        <span>সর্বমোট বিল (ক্যাশ অন ডেলিভারি):</span>
        <span>৳${toBanglaNumber(order.totalPrice)}</span>
      </div>
    `;
  }

  // Pre-fill WhatsApp message
  if (waBtn) {
    const waText = encodeURIComponent(
      `হ্যালো LittleNest BD, আমি সিলিকন ফিডিং সেটের একটি অর্ডার করেছি।\nঅর্ডার আইডি: #${order.orderId}\nনাম: ${order.customerName}\nফোন: ${order.customerPhone}\nঠিকানা: ${order.fullAddress}\nপ্যাকেজ: ${order.packageTitle} (${order.selectedColor})\nমোট বিল: ৳${order.totalPrice}`
    );
    waBtn.href = `https://wa.me/8801700000000?text=${waText}`;
  }

  if (modal) modal.classList.add('open');
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) modal.classList.remove('open');
}

// -------------------------------------------------------------
// 10. SOCIAL PROOF LIVE ORDER TICKER
// -------------------------------------------------------------
const realisticOrders = [
  { name: 'সালমা বেগম', location: 'উত্তরা, ঢাকা', package: '১টি বেবি ফিডিং সেট', color: 'পিঙ্ক', time: '২ মিনিট আগে' },
  { name: 'মোস্তাফিজুর রহমান', location: 'ধানমন্ডি, ঢাকা', package: '২টি কম্বো সেট (ফ্রি ডেলিভারি)', color: 'ব্লু', time: '৪ মিনিট আগে' },
  { name: 'তাসলিমা জাহান', location: 'পাঁচলাইশ, চট্টগ্রাম', package: '১টি বেবি ফিডিং সেট', color: 'ইয়েলো', time: '৬ মিনিট আগে' },
  { name: 'ফারজানা হক', location: 'উপশহর, সিলেট', package: '১টি বেবি ফিডিং সেট', color: 'গ্রিন', time: '৯ মিনিট আগে' },
  { name: 'কবির হোসেন', location: 'বোয়ালিয়া, রাজশাহী', package: '২টি কম্বো সেট', color: 'ব্লু + পিঙ্ক', time: '১১ মিনিট আগে' },
  { name: 'নাজমিন সুলতানা', location: 'খালিশপুর, খুলনা', package: '১টি বেবি ফিডিং সেট', color: 'পিঙ্ক', time: '১৪ মিনিট আগে' },
  { name: 'রোকসানা পারভীন', location: 'টঙ্গী, গাজীপুর', package: '১টি বেবি ফিডিং সেট', color: 'স্কাই ব্লু', time: '১৭ মিনিট আগে' }
];

let socialPopupIndex = 0;
let socialPopupInterval;

function initSocialPopup() {
  const popup = document.getElementById('social-proof-popup');
  const nameEl = document.getElementById('popup-customer-name');
  const itemEl = document.getElementById('popup-product-text');
  const timeEl = document.getElementById('popup-time-text');

  if (!popup) return;

  function showNextPopup() {
    const item = realisticOrders[socialPopupIndex % realisticOrders.length];
    socialPopupIndex++;

    if (nameEl) nameEl.textContent = `${item.name} (${item.location})`;
    if (itemEl) itemEl.textContent = `${item.package} অর্ডার করেছেন`;
    if (timeEl) timeEl.textContent = item.time;

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 5000);
  }

  setTimeout(() => {
    showNextPopup();
    socialPopupInterval = setInterval(showNextPopup, 18000);
  }, 4000);
}

function closeSocialPopup() {
  const popup = document.getElementById('social-proof-popup');
  if (popup) popup.classList.remove('show');
  clearInterval(socialPopupInterval);
}

// -------------------------------------------------------------
// 11. FAQ ACCORDION
// -------------------------------------------------------------
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
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
// 12. POLICY MODALS
// -------------------------------------------------------------
const policyTexts = {
  refund: `
    <h2>🔄 রিটার্ন ও রিফান্ড পলিসি</h2>
    <p>আমাদের কাছে গ্রাহকের ১০০% সন্তুষ্টিই প্রথম অগ্রাধিকার। আপনি যেন নিশ্চিন্তে কেনাকাটা করতে পারেন, সেজন্য আমাদের রয়েছে ৩ দিনের রিটার্ন ও ফ্রি রিপ্লেসমেন্ট সুবিধা।</p>
    <h3>শর্তাবলী:</h3>
    <ul>
      <li>ডেলিভারি পাওয়ার ৩ কার্যদিবসের মধ্যে পণ্যটিতে কোনো ত্রুটি (যেমন: কাটা, ছিঁড়া বা ডিফেক্ট) পাওয়া গেলে সাথে সাথে যোগাযোগ করুন।</li>
      <li>ভুল কালার বা ভিন্ন পণ্য চলে আসলে আমরা সম্পূর্ণ ফ্রিতে আপনাকে সঠিক পণ্য রিপ্লেস করে দেব।</li>
      <li>পণ্যটি অব্যবহৃত অবস্থায় মূল প্যাকেজিং সহ থাকতে হবে।</li>
      <li>অভিযোগ জানাতে আমাদের হটলাইন (+8801700000000) বা হোয়াটসঅ্যাপে ছবি/ভিডিও সহ মেসেজ দিন।</li>
    </ul>
  `,
  privacy: `
    <h2>🔒 প্রাইভেসি ও ডেটা পলিসি</h2>
    <p>আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করা আমাদের দায়িত্ব। আমরা কখনোই আপনার কোনো তথ্য তৃতীয় পক্ষের কাছে বিক্রয় বা হস্তান্তর করি না।</p>
    <h3>আমরা কী তথ্য সংগ্রহ করি?</h3>
    <ul>
      <li>অর্ডার ডেলিভারির জন্য আপনার নাম, সচল মোবাইল নম্বর এবং ডেলিভারির সঠিক জেলা, উপজেলা ও ঠিকানা।</li>
      <li>বিজ্ঞাপনের কার্যকারিতা পরিমাপ এবং অভিজ্ঞতা উন্নয়নের জন্য মেটা পিক্সেল (Meta Pixel) এর স্ট্যান্ডার্ড কুকিজ ব্যবহৃত হয়।</li>
      <li>আপনার ফোন নম্বরটি শুধুমাত্র ডেলিভারি কনফার্মেশন ও কুরিয়ার আপডেটের জন্য ব্যবহৃত হবে।</li>
    </ul>
  `,
  terms: `
    <h2>🚚 ডেলিভারি ও সাধারণ শর্তাবলী</h2>
    <p>LittleNest BD-তে অর্ডার করার পূর্বে অনুগ্রহ করে আমাদের ডেলিভারি সংক্রান্ত নিয়মাবলী জেনে নিন:</p>
    <ul>
      <li><strong>ক্যাশ অন ডেলিভারি:</strong> আমাদের কোনো পণ্যের জন্যই কোনো প্রকার অগ্রিম টাকা দিতে হয় না। আপনি পণ্য হাতে পেয়ে দেখে টাকা পরিশোধ করবেন।</li>
      <li><strong>ডেলিভারি সময়সীমা:</strong> ঢাকার ভেতরে ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে হোম ডেলিভারি করা হয়।</li>
      <li><strong>পার্সেল চেক করার নিয়ম:</strong> ডেলিভারি ম্যানের উপস্থিতিতে পার্সেল খুলে চেক করে নিতে অনুরোধ করা হচ্ছে।</li>
    </ul>
  `,
  about: `
    <h2>🍼 আমাদের সম্পর্কে (LittleNest BD)</h2>
    <p>LittleNest BD হলো শিশুদের স্বাস্থ্যসম্মত ও নিরাপদ খাদ্যগ্রহণ সামগ্রীর একটি বিশ্বস্ত প্রতিষ্ঠান। আমাদের লক্ষ্য প্রতিটি বাংলাদেশি মা-বাবার কাছে শিশুর উপযোগী আন্তর্জাতিক মানের ফুড গ্রেড সিলিকন সামগ্রী পৌঁছে দেওয়া।</p>
    <p>আমাদের সকল পণ্য FDA এবং LFGB সার্টিফাইড কারখানা থেকে সরাসরি আমদানিকৃত, যা ক্ষতিকর প্লাস্টিক, বিপিএ ও কেমিক্যালমুক্ত।</p>
  `
};

function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const content = document.getElementById('policy-content-area');
  if (modal && content && policyTexts[type]) {
    content.innerHTML = policyTexts[type];
    modal.classList.add('open');
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policy-modal');
  if (modal) modal.classList.remove('open');
}

// -------------------------------------------------------------
// 13. ADMIN DASHBOARD & FACEBOOK PIXEL SETTINGS
// -------------------------------------------------------------
function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  const pixelInput = document.getElementById('admin-pixel-input');
  const storedPixel = localStorage.getItem('fb_pixel_id') || '';

  if (pixelInput) pixelInput.value = storedPixel;
  renderAdminOrders();

  if (modal) modal.classList.add('open');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
}

function savePixelSettings() {
  const pixelInput = document.getElementById('admin-pixel-input');
  const statusEl = document.getElementById('pixel-status-msg');
  const val = pixelInput ? pixelInput.value.trim() : '';

  if (!val) {
    alert('দয়া করে একটি সঠিক Facebook Pixel ID দিন।');
    return;
  }

  localStorage.setItem('fb_pixel_id', val);
  window.FACEBOOK_PIXEL_ID = val;

  if (typeof initFacebookPixel === 'function') {
    initFacebookPixel(val);
  }

  if (statusEl) {
    statusEl.innerHTML = `<span style="color:#059669; font-weight:700;">✅ Facebook Pixel ID (${val}) সফলভাবে সেভ হয়েছে এবং সক্রিয় রয়েছে!</span>`;
  }
}

function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  const countEl = document.getElementById('admin-orders-count');
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem('babycare_orders') || '[]');
  if (countEl) countEl.textContent = toBanglaNumber(orders.length);

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #94A3B8; padding: 24px;">এখনও কোনো অর্ডার আসেনি।</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders
    .map(
      ord => `
      <tr>
        <td>
          <strong>#${ord.orderId}</strong><br>
          <small style="color: #64748B;">${ord.orderDate}</small>
        </td>
        <td>
          <strong>${ord.customerName}</strong><br>
          <a href="tel:${ord.customerPhone}" style="color: #0284C7; font-weight: 600;">📞 ${ord.customerPhone}</a>
        </td>
        <td style="max-width: 240px; font-size: 0.82rem;">
          <strong>${ord.division ? ord.division + ' › ' : ''}${ord.district || ''} › ${ord.upazila || ''}</strong><br>
          <span>${ord.village ? ord.village : ''}${ord.street ? ', ' + ord.street : ''}${!ord.village && ord.detailedAddress ? ord.detailedAddress : ''}</span>
          ${ord.specialNote ? `<br><small style="color:#E11D48;">নোট: ${ord.specialNote}</small>` : ''}
        </td>
        <td>
          ${ord.packageTitle}<br>
          <span style="font-size: 0.8rem; color: #E11D48; font-weight: 600;">${ord.selectedColor}</span>
        </td>
        <td>
          <strong style="color: #059669; font-family: Inter;">৳${ord.totalPrice}</strong>
          ${ord.couponDiscount ? `<br><small style="color:#10B981;">(ছাড় ৳${ord.couponDiscount})</small>` : ''}
        </td>
        <td>
          <span class="badge-order-status">${ord.status || 'New'}</span>
        </td>
      </tr>
    `
    )
    .join('');
}

function exportOrdersToCSV() {
  const orders = JSON.parse(localStorage.getItem('babycare_orders') || '[]');
  if (orders.length === 0) {
    alert('ডাউনলোড করার মতো কোনো অর্ডার পাওয়া যায়নি।');
    return;
  }

  const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Division', 'District', 'Upazila', 'Village', 'Street', 'Full Address', 'Delivery Note', 'Area', 'Package', 'Color', 'Subtotal', 'Shipping', 'Coupon', 'Total', 'Status'];
  const rows = orders.map(o => [
    `"${o.orderId}"`,
    `"${o.orderDate}"`,
    `"${o.customerName}"`,
    `"${o.customerPhone}"`,
    `"${o.division || ''}"`,
    `"${o.district || ''}"`,
    `"${o.upazila || ''}"`,
    `"${o.village || ''}"`,
    `"${o.street || ''}"`,
    `"${(o.fullAddress || o.detailedAddress || o.customerAddress || '').replace(/"/g, '""')}"`,
    `"${(o.specialNote || '').replace(/"/g, '""')}"`,
    `"${o.shippingArea}"`,
    `"${o.packageTitle}"`,
    `"${o.selectedColor}"`,
    o.subtotal,
    o.shippingCost,
    o.couponDiscount || 0,
    o.totalPrice,
    `"${o.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `LittleNest_Orders_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function clearAllOrders() {
  if (confirm('আপনি কি সত্যিই সমস্ত সংরক্ষিত অর্ডার মুছে ফেলতে চান?')) {
    localStorage.removeItem('babycare_orders');
    renderAdminOrders();
  }
}

// -------------------------------------------------------------
// 14. MOBILE STICKY ORDER BUTTON JUMP & FOCUS
// -------------------------------------------------------------
function setupMobileStickyJump() {
  const stickyBtn = document.getElementById('btn-sticky-order');
  const heroBtn = document.getElementById('btn-hero-order');

  function jumpToFormAndFocus(e) {
    e.preventDefault();
    const orderSection = document.getElementById('order-section');
    const nameInput = document.getElementById('cust-name');

    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 450);
  }

  if (stickyBtn) stickyBtn.addEventListener('click', jumpToFormAndFocus);
  if (heroBtn) heroBtn.addEventListener('click', jumpToFormAndFocus);
}

// -------------------------------------------------------------
// 15. TRACKING TRIGGERS ON FORM INTERACTION
// -------------------------------------------------------------
function initTrackingTriggers() {
  if (window.PixelTracker) {
    PixelTracker.trackViewContent({
      name: 'শিশুদের প্রিমিয়াম ফুড গ্রেড সিলিকন ফিডিং সেট (৬ পিস)',
      price: 1190
    });
  }

  const formInputs = document.querySelectorAll('#checkout-order-form input, #checkout-order-form textarea, #checkout-order-form select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (!checkoutInitiated && window.PixelTracker) {
        checkoutInitiated = true;
        PixelTracker.trackInitiateCheckout({
          total: currentPackage.price + currentShippingCost - currentCouponDiscount,
          num_items: currentPackage.quantity
        });
      }
    });
  });

  const callBtn = document.getElementById('btn-call-header');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      if (window.PixelTracker) PixelTracker.trackContact('Phone Call');
    });
  }

  const waFloating = document.getElementById('floating-wa-btn');
  if (waFloating) {
    waFloating.addEventListener('click', () => {
      if (window.PixelTracker) PixelTracker.trackContact('Floating WhatsApp');
    });
  }

  const waDirectOrder = document.getElementById('btn-whatsapp-direct-order');
  if (waDirectOrder) {
    waDirectOrder.addEventListener('click', () => {
      if (window.PixelTracker) PixelTracker.trackContact('Direct WhatsApp Order');
    });
  }
}

// -------------------------------------------------------------
// DOM READY INITIALIZER
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initCountdown();
  initColorSync();
  initLocationWizard();
  setupFormValidation();
  setupMobileStickyJump();
  initSocialPopup();
  initFAQ();
  initTrackingTriggers();
  updateOrderSummary();

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });
});
