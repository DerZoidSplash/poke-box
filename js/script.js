document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const sideDrawer = document.getElementById('side-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  // Toggle drawer open
  function openDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.add('active');
      drawerBackdrop.classList.add('active');
    }
  }

  // Toggle drawer close
  function closeDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.remove('active');
      drawerBackdrop.classList.remove('active');
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openDrawer);
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Setup Signature Bowl customization if arriving with ?signature=ID
  setupSignatureBowlPage();

  // Accordion & BYO Logic for Page 2
  setupAccordionLogic();

  // Reset stages scrollbar to the far left on page load
  const stagesScrollbar = document.querySelector('.stages-scrollbar');
  if (stagesScrollbar) {
    stagesScrollbar.scrollLeft = 0;
    // Also reset after a frame in case layout shifts it
    requestAnimationFrame(() => {
      stagesScrollbar.scrollLeft = 0;
    });
  }
  setupSizeSelectionHandler();
  setupMaxLimitCheckboxes();
  setupItemQuantitySteppers();
  setupPriceCalculation();
  setupQuantityCounter();
  setupOrderSummaryLogic();
  setupAddToCartLogic();
  setupCartLogic();

  // Fetch local JSON filler data for Menu page
  if (document.getElementById('signature-bowls-grid')) {
    fetch('js/data.json')
      .then(response => response.json())
      .then(data => {
        renderMenuContent(data);
      })
      .catch(error => {
        console.log('Error loading JSON data:', error);
      });
  }
});

// Signature Bowl Definitions
const SIGNATURE_BOWLS = {
  1: {
    id: 1,
    name: "Big Umami",
    priceRange: "$17.30 - $21.90",
    regularPrice: 17.30,
    largePrice: 21.90,
    image: "images/big-umami.png",
    description: "Salmon, Ahi Tuna, Avocado, Seaweed Salad, Sweet Onion, Green Onion, Cabbage, Tempura Bits, Furikake, House Shoyu & Waikiki Mayo Sauce",
    defaults: {
      protein: ["salmon", "ahi-tuna"],
      veggies: ["sweet-onion", "cabbage"],
      toppings: ["avocado", "seaweed-salad", "tempura-bits"],
      sauces: ["house-shoyu", "waikiki-mayonaise"],
      garnishes: ["furikake", "green-onion"]
    }
  },
  2: {
    id: 2,
    name: "The Poke Box",
    priceRange: "$17.30 - $21.90",
    regularPrice: 17.30,
    largePrice: 21.90,
    image: "images/the-poke-box.png",
    description: "Salmon, Ahi Tuna, Edamame, Cucumber, Red Onion, Seaweed Salad, Imitation Crab Salad, Egg, Furikake, House Shoyu & Roasted Sesame Sauce",
    defaults: {
      protein: ["salmon", "ahi-tuna"],
      veggies: ["edamame", "cucumber", "red-onion"],
      toppings: ["seaweed-salad", "imitation-crab-salad", "egg"],
      sauces: ["house-shoyu", "roasted-sesame"],
      garnishes: ["furikake"]
    }
  },
  3: {
    id: 3,
    name: "Rip Tide",
    priceRange: "$16.90 - $20.80",
    regularPrice: 16.90,
    largePrice: 20.80,
    image: "images/rip-tide.png",
    description: "Tempura Shrimp, Crab Salad, Caplin Fish Roe, Cabbage, Red Pepper, Cucumber, Green Onion, Sesame, Spicy Aioli & Waikiki Mayo Sauce",
    defaults: {
      protein: ["tempura-shrimp"],
      veggies: ["cabbage", "red-pepper", "cucumber"],
      toppings: ["imitation-crab-salad", "caplin-fish-roe"],
      sauces: ["spicy-aioli", "waikiki-mayonaise"],
      garnishes: ["sesame-seeds", "green-onion"]
    }
  },
  4: {
    id: 4,
    name: "California Dreaming",
    priceRange: "$15.70 - $19.50",
    regularPrice: 15.70,
    largePrice: 19.50,
    image: "images/california-dreaming.png",
    description: "Imitation Crab, Cucumber, Avocado, Edamame, Seaweed Salad, Caplin Fish Roe, Tempura Bits, Cabbage, Nori, Spicy Aioli & Tamari Glaze Sauce",
    defaults: {
      protein: ["imitation-crab"],
      veggies: ["cucumber", "edamame", "cabbage"],
      toppings: ["avocado", "seaweed-salad", "caplin-fish-roe", "tempura-bits", "dried-seaweed"],
      sauces: ["spicy-aioli", "tamari-glaze"],
      garnishes: []
    }
  },
  5: {
    id: 5,
    name: "Ruffled Up",
    priceRange: "$17.70 - $22.90",
    regularPrice: 17.70,
    largePrice: 22.90,
    image: "images/ruffled-up.png",
    description: "Smoked Duck, Tempura Shrimp, Egg, Sweet Onion, Cabbage, Cucumber, Mandarin Orange, Crispy Onion, Furikake, Cucumber Dill & Tamari Glaze Sauce",
    defaults: {
      protein: ["duck", "tempura-shrimp"],
      veggies: ["sweet-onion", "cabbage", "cucumber"],
      toppings: ["egg", "mandarin-orange"],
      sauces: ["cucumber-dill", "tamari-glaze"],
      garnishes: ["crispy-onion", "furikake"]
    }
  },
  6: {
    id: 6,
    name: "Garlic Koa",
    priceRange: "$16.90 - $20.80",
    regularPrice: 16.90,
    largePrice: 20.80,
    image: "images/garlic-koa.png",
    description: "Japanese Fried Chicken, Egg, Edamame, Green Onion, Sweet Corn, Cabbage, Pickled Ginger, Sesame, Togarashi, Nori, Garlic Aioli & House Shoyu Sauce",
    defaults: {
      protein: ["japanese-fried-chicken"],
      veggies: ["edamame", "sweet-corn", "cabbage"],
      toppings: ["egg", "dried-seaweed"],
      sauces: ["garlic-aioli", "house-shoyu"],
      garnishes: ["green-onion", "pickled-ginger", "sesame-seeds", "togarashi"]
    }
  }
};

let activeSignatureBowl = null;

function setupSignatureBowlPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const signatureParam = urlParams.get('signature');
  if (!signatureParam || !SIGNATURE_BOWLS[signatureParam]) return;

  activeSignatureBowl = SIGNATURE_BOWLS[signatureParam];

  // Update Page Title and Sticky Header
  document.title = `The Poké Box - ${activeSignatureBowl.name}`;

  const titleEl = document.querySelector('.byo-title');
  if (titleEl) titleEl.textContent = activeSignatureBowl.name;

  const subtitleEl = document.querySelector('.byo-subtitle');
  if (subtitleEl) subtitleEl.textContent = activeSignatureBowl.priceRange;

  const descEl = document.querySelector('.byo-desc');
  if (descEl) descEl.textContent = activeSignatureBowl.description;

  // Add (Optional) to section titles other than Size (step-1) and Base (step-2)
  const optionalSteps = [
    { id: 'step-3', baseText: 'Choose Protein (Optional)', tabText: '3. Protein' },
    { id: 'step-4', baseText: 'Add Veggies (Optional)', tabText: '4. Veggies' },
    { id: 'step-5', baseText: 'Add Toppings (Optional)', tabText: '5. Toppings' },
    { id: 'step-6', baseText: 'Add Sauce (Optional)', tabText: '6. Sauce' },
    { id: 'step-7', baseText: 'Add Garnish (Optional)', tabText: '7. Garnish' }
  ];

  optionalSteps.forEach(item => {
    const stepEl = document.getElementById(item.id);
    if (stepEl) {
      const stepTitleEl = stepEl.querySelector('.step-title');
      if (stepTitleEl) {
        stepTitleEl.innerHTML = item.baseText;
      }
    }
  });

  // Configure Size Select: No small bowl option, only Regular and Large
  const sizeSelect = document.getElementById('size-select');
  if (sizeSelect) {
    sizeSelect.innerHTML = `
      <option value="regular" data-price="$${activeSignatureBowl.regularPrice.toFixed(2)}" selected>Regular bowl - $${activeSignatureBowl.regularPrice.toFixed(2)}</option>
      <option value="large" data-price="$${activeSignatureBowl.largePrice.toFixed(2)}">Large bowl - $${activeSignatureBowl.largePrice.toFixed(2)}</option>
    `;
  }

  // Add Done button in Base subsection for signature bowls ONLY
  const step2Nav = document.querySelector('#step-2 .step-nav-buttons');
  if (step2Nav) {
    step2Nav.className = 'step-nav-buttons step-nav-buttons-stacked';
    step2Nav.innerHTML = `
      <button type="button" class="done-btn done-order-btn">Done</button>
      <div class="sig-base-info-note">
        <div>Click Done to head to the Order Summary.</div>
        <div>Click Next to add extra items to your bowl.</div>
        <div>Please note that adding extra items will cost extra.</div>
      </div>
      <div class="prev-next-row">
        <button type="button" class="prev-btn">Prev</button>
        <button type="button" class="done-btn next-btn">Next</button>
      </div>
    `;
  }

  // Pre-check default ingredients if NOT in edit mode (edit mode will restore its own selections)
  const isEdit = urlParams.get('edit') === '1';
  if (!isEdit && activeSignatureBowl.defaults) {
    const categories = ['protein', 'veggies', 'toppings', 'sauces', 'garnishes'];
    categories.forEach(cat => {
      const items = activeSignatureBowl.defaults[cat] || [];
      items.forEach(val => {
        const cb = document.querySelector(`input[name="${cat}"][value="${val}"]`);
        if (cb) {
          cb.checked = true;
          const row = cb.closest('.option-row');
          if (row) {
            const stepper = row.querySelector('.item-qty-stepper');
            const countEl = row.querySelector('.item-qty-count');
            if (stepper) stepper.classList.add('active');
            if (countEl) countEl.textContent = '1';
          }
        }
      });
    });
  }
}

function setupAccordionLogic() {
  const accordionSteps = document.querySelectorAll('.accordion-step');
  const stageTabs = document.querySelectorAll('.stage-tab');
  const scrollbar = document.querySelector('.stages-scrollbar');

  function updateActiveStage(stepId) {
    stageTabs.forEach(tab => {
      if (tab.getAttribute('data-step-target') === stepId) {
        tab.classList.add('active');
        // Scroll tab smoothly into view inside the horizontal scrollbar
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        tab.classList.remove('active');
      }
    });
  }

  function goToStep(targetStep) {
    if (!targetStep) return;

    // Collapse order summary if open
    const bottomBar = document.querySelector('.byo-bottom-bar');
    if (bottomBar && bottomBar.classList.contains('expanded')) {
      bottomBar.classList.remove('expanded');
      const textSpan = bottomBar.querySelector('.see-order-btn span:first-child');
      const chevron = bottomBar.querySelector('.chevron-up');
      if (textSpan) textSpan.textContent = 'See Order';
      if (chevron) chevron.innerHTML = '&#9650;';
    }

    // Collapse all steps
    accordionSteps.forEach(s => {
      s.classList.remove('open');
      const c = s.querySelector('.chevron-icon');
      if (c) c.innerHTML = '&#9660;';
    });

    // Open target step
    targetStep.classList.add('open');
    const chevron = targetStep.querySelector('.chevron-icon');
    if (chevron) chevron.innerHTML = '&#9650;';

    // Update active tab in horizontal scrollbar
    updateActiveStage(targetStep.id);

    // Reset scroll position to the very top immediately
    const mainContent = document.querySelector('.byo-content') || document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Handle stage tab clicks
  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-step-target');
      const targetStep = document.getElementById(targetId);
      if (targetStep) {
        goToStep(targetStep);
      }
    });
  });

  accordionSteps.forEach((step) => {
    const header = step.querySelector('.accordion-header');
    const nextBtn = step.querySelector('.next-btn') || step.querySelector('.done-btn:not(.done-order-btn)');
    const prevBtn = step.querySelector('.prev-btn');

    // Header click in stage mode ensures step remains active
    if (header) {
      header.addEventListener('click', () => {
        if (!step.classList.contains('open')) {
          goToStep(step);
        }
      });
    }

    // Next / Done button click: open next step
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextStep = step.nextElementSibling;
        if (nextStep && nextStep.classList.contains('accordion-step')) {
          goToStep(nextStep);
        }
      });
    }

    // Prev button click: open previous step
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevStep = step.previousElementSibling;
        if (prevStep && prevStep.classList.contains('accordion-step')) {
          goToStep(prevStep);
        }
      });
    }
  });
}

function getItemQty(cb) {
  const row = cb.closest('.option-row');
  if (row) {
    const countEl = row.querySelector('.item-qty-count');
    if (countEl) {
      return parseInt(countEl.textContent, 10) || 1;
    }
  }
  return 1;
}

function setupItemQuantitySteppers() {
  const optionRows = document.querySelectorAll('.option-row');
  optionRows.forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const stepper = row.querySelector('.item-qty-stepper');
    const minusBtn = row.querySelector('.item-minus');
    const plusBtn = row.querySelector('.item-plus');
    const countEl = row.querySelector('.item-qty-count');

    if (cb && stepper) {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          stepper.classList.add('active');
          if (countEl) countEl.textContent = '1';
          registerPortionAdd(cb.name, cb.value);
        } else {
          stepper.classList.remove('active');
          if (countEl) countEl.textContent = '1';
          // Remove all remaining portions for this unchecked item
          if (cb.name === 'veggies') {
            veggiePortionHistory = veggiePortionHistory.filter(v => v !== cb.value);
          } else if (cb.name === 'toppings') {
            toppingPortionHistory = toppingPortionHistory.filter(v => v !== cb.value);
          }
        }
        if (typeof updateProteinUI === 'function') updateProteinUI();
        if (typeof updateVeggieUI === 'function') updateVeggieUI();
        if (typeof updateToppingUI === 'function') updateToppingUI();
        calculateTotalPrice();
      });
    }

    if (minusBtn && countEl && cb) {
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        registerPortionRemove(cb.name, cb.value);
        let count = parseInt(countEl.textContent, 10) || 1;
        if (count > 1) {
          count--;
          countEl.textContent = count;
        } else {
          // decrementing 1 unchecks the item
          cb.checked = false;
          stepper.classList.remove('active');
          countEl.textContent = '1';
        }
        if (typeof updateProteinUI === 'function') updateProteinUI();
        if (typeof updateVeggieUI === 'function') updateVeggieUI();
        if (typeof updateToppingUI === 'function') updateToppingUI();
        calculateTotalPrice();
      });
    }

    if (plusBtn && countEl && cb) {
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let count = parseInt(countEl.textContent, 10) || 1;
        count++;
        countEl.textContent = count;
        registerPortionAdd(cb.name, cb.value);
        if (typeof updateProteinUI === 'function') updateProteinUI();
        if (typeof updateVeggieUI === 'function') updateVeggieUI();
        if (typeof updateToppingUI === 'function') updateToppingUI();
        calculateTotalPrice();
      });
    }
  });
}

function setupSizeSelectionHandler() {
  const sizeSelect = document.getElementById('size-select');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const desc = selectedOption.getAttribute('data-desc');

      if (desc) {
        const byoDesc = document.querySelector('.byo-desc');
        if (byoDesc) byoDesc.textContent = desc;
      }

      if (typeof updateProteinUI === 'function') updateProteinUI();
      if (typeof updateVeggieUI === 'function') updateVeggieUI();
      if (typeof updateToppingUI === 'function') updateToppingUI();
      calculateTotalPrice();
    });
  }
}

function updateProteinUI() {
  const proteinStep = document.getElementById('step-3');
  if (proteinStep) {
    const proteinCheckboxes = proteinStep.querySelectorAll('input[type="checkbox"]');
    const isSig = !!activeSignatureBowl;
    const defaultProteins = (isSig && activeSignatureBowl.defaults && activeSignatureBowl.defaults.protein) || [];

    proteinCheckboxes.forEach(cb => {
      const span = cb.nextElementSibling;
      if (!span) return;

      let baseName = span.getAttribute('data-base-name');
      if (!baseName) {
        baseName = span.textContent.split(' - ')[0].trim();
        span.setAttribute('data-base-name', baseName);
      }

      const unitExtra = parseFloat(cb.getAttribute('data-extra')) || 0;
      const unitExtraStr = `$${unitExtra.toFixed(2)}`;

      if (cb.checked) {
        const qty = getItemQty(cb);
        let chargeableQty = qty;
        if (isSig && defaultProteins.includes(cb.value)) {
          chargeableQty = Math.max(0, qty - 1);
        }

        if (chargeableQty > 0) {
          const totalCost = (unitExtra * chargeableQty).toFixed(2);
          span.innerHTML = `${baseName} <span style="color: #666; font-size: 0.9em; font-weight: normal;">(+ $${totalCost})</span>`;
        } else {
          span.textContent = baseName;
        }
      } else {
        span.textContent = `${baseName} - ${unitExtraStr}`;
      }
    });
  }
}

// Global portion history queues: each portion added pushes that item's value onto the queue.
// When an item's count decreases or it is unchecked, its most recent entry is removed.
let veggiePortionHistory = [];
let toppingPortionHistory = [];

function registerPortionAdd(category, itemValue) {
  if (category === 'veggies') {
    veggiePortionHistory.push(itemValue);
  } else if (category === 'toppings') {
    toppingPortionHistory.push(itemValue);
  }
}

function registerPortionRemove(category, itemValue) {
  const history = category === 'veggies' ? veggiePortionHistory : toppingPortionHistory;
  const lastIdx = history.lastIndexOf(itemValue);
  if (lastIdx !== -1) {
    history.splice(lastIdx, 1);
  }
}

function syncPortionHistory(category, checkboxes) {
  const history = category === 'veggies' ? veggiePortionHistory : toppingPortionHistory;
  const targetCounts = {};
  checkboxes.forEach(cb => {
    if (cb.checked) {
      targetCounts[cb.value] = getItemQty(cb);
    }
  });

  // Remove entries from history that exceed current counts or are unchecked
  const currentCounts = {};
  for (let i = history.length - 1; i >= 0; i--) {
    const val = history[i];
    const maxAllowed = targetCounts[val] || 0;
    const currentSoFar = currentCounts[val] || 0;
    if (currentSoFar >= maxAllowed) {
      history.splice(i, 1);
    } else {
      currentCounts[val] = currentSoFar + 1;
    }
  }

  // Add any missing portions if needed
  Object.keys(targetCounts).forEach(val => {
    const needed = targetCounts[val] - (currentCounts[val] || 0);
    for (let j = 0; j < needed; j++) {
      history.push(val);
    }
  });
}

function updateVeggieUI() {
  const sizeSelect = document.getElementById('size-select');
  let sizeValue = '';
  if (sizeSelect && sizeSelect.selectedIndex >= 0) {
    sizeValue = sizeSelect.value;
  }

  const isSig = !!activeSignatureBowl;
  let freeVeggiesCount = 0;
  let limitText = "";
  if (!isSig) {
    if (sizeValue === 'small') { freeVeggiesCount = 2; limitText = "(Comes with 2)"; }
    else if (sizeValue === 'regular') { freeVeggiesCount = 3; limitText = "(Comes with 3)"; }
    else if (sizeValue === 'large') { freeVeggiesCount = 4; limitText = "(Comes with 4)"; }
  }

  const limitTextSpan = document.querySelector('.veggie-limit-text');
  if (limitTextSpan) limitTextSpan.textContent = limitText;

  const veggieStep = document.getElementById('step-4');
  if (veggieStep) {
    const veggieCheckboxes = Array.from(veggieStep.querySelectorAll('input[type="checkbox"]'));
    syncPortionHistory('veggies', veggieCheckboxes);

    let totalVeggiePortions = veggiePortionHistory.length;

    // For signature bowls: default included veggies are free for 1 portion; extra portions or added veggies cost +$1.30
    const extraCounts = {};
    if (isSig) {
      const defaultVeggies = (activeSignatureBowl && activeSignatureBowl.defaults && activeSignatureBowl.defaults.veggies) || [];
      veggieCheckboxes.forEach(cb => {
        if (cb.checked) {
          const qty = getItemQty(cb);
          if (defaultVeggies.includes(cb.value)) {
            if (qty > 1) {
              extraCounts[cb.value] = qty - 1;
            }
          } else {
            extraCounts[cb.value] = qty;
          }
        }
      });
    } else {
      for (let i = freeVeggiesCount; i < veggiePortionHistory.length; i++) {
        const val = veggiePortionHistory[i];
        extraCounts[val] = (extraCounts[val] || 0) + 1;
      }
    }

    veggieCheckboxes.forEach(cb => {
      const span = cb.nextElementSibling;
      if (!span) return;

      let baseText = span.getAttribute('data-base-text');
      if (!baseText) {
        baseText = span.textContent.replace(/ - \$\d+\.\d+/, '');
        span.setAttribute('data-base-text', baseText);
      }

      if (cb.checked) {
        const extraPortions = extraCounts[cb.value] || 0;
        if (extraPortions > 0) {
          span.innerHTML = `${baseText} <span style="color: #666; font-size: 0.9em; font-weight: normal;">(+ $${(extraPortions * 1.30).toFixed(2)})</span>`;
        } else {
          span.textContent = baseText;
        }
      } else {
        // Unselected options: always show price on signature bowls, or when free limit reached on BYO
        if (isSig || (freeVeggiesCount > 0 && totalVeggiePortions >= freeVeggiesCount)) {
          span.textContent = baseText + ' - $1.30';
        } else {
          span.textContent = baseText;
        }
      }
    });
  }
}

function updateToppingUI() {
  const sizeSelect = document.getElementById('size-select');
  let sizeValue = '';
  if (sizeSelect && sizeSelect.selectedIndex >= 0) {
    sizeValue = sizeSelect.value;
  }

  const isSig = !!activeSignatureBowl;
  let freeToppingsCount = 0;
  let limitText = "";
  if (!isSig) {
    if (sizeValue === 'small') { freeToppingsCount = 1; limitText = "(Comes with 1)"; }
    else if (sizeValue === 'regular') { freeToppingsCount = 2; limitText = "(Comes with 2)"; }
    else if (sizeValue === 'large') { freeToppingsCount = 3; limitText = "(Comes with 3)"; }
  }

  const limitTextSpan = document.querySelector('.topping-limit-text');
  if (limitTextSpan) limitTextSpan.textContent = limitText;

  const toppingStep = document.getElementById('step-5');
  if (toppingStep) {
    const toppingCheckboxes = Array.from(toppingStep.querySelectorAll('input[type="checkbox"]'));
    syncPortionHistory('toppings', toppingCheckboxes);

    let totalToppingPortions = toppingPortionHistory.length;

    // For signature bowls: default included toppings are free for 1 portion; extra portions or added toppings cost +$2.30
    const extraCounts = {};
    if (isSig) {
      const defaultToppings = (activeSignatureBowl && activeSignatureBowl.defaults && activeSignatureBowl.defaults.toppings) || [];
      toppingCheckboxes.forEach(cb => {
        if (cb.checked) {
          const qty = getItemQty(cb);
          if (defaultToppings.includes(cb.value)) {
            if (qty > 1) {
              extraCounts[cb.value] = qty - 1;
            }
          } else {
            extraCounts[cb.value] = qty;
          }
        }
      });
    } else {
      for (let i = freeToppingsCount; i < toppingPortionHistory.length; i++) {
        const val = toppingPortionHistory[i];
        extraCounts[val] = (extraCounts[val] || 0) + 1;
      }
    }

    toppingCheckboxes.forEach(cb => {
      const span = cb.nextElementSibling;
      if (!span) return;

      let baseText = span.getAttribute('data-base-text');
      if (!baseText) {
        baseText = span.textContent.replace(/ - \$\d+\.\d+/, '');
        span.setAttribute('data-base-text', baseText);
      }

      if (cb.checked) {
        const extraPortions = extraCounts[cb.value] || 0;
        if (extraPortions > 0) {
          span.innerHTML = `${baseText} <span style="color: #666; font-size: 0.9em; font-weight: normal;">(+ $${(extraPortions * 2.30).toFixed(2)})</span>`;
        } else {
          span.textContent = baseText;
        }
      } else {
        // Unselected options: always show price on signature bowls, or when free limit reached on BYO
        if (isSig || (freeToppingsCount > 0 && totalToppingPortions >= freeToppingsCount)) {
          span.textContent = baseText + ' - $2.30';
        } else {
          span.textContent = baseText;
        }
      }
    });
  }
}

function setupMaxLimitCheckboxes() {
  const maxLimitGroups = document.querySelectorAll('.max-limit-group');
  maxLimitGroups.forEach(group => {
    const max = parseInt(group.getAttribute('data-max'), 10) || 2;
    const checkboxes = group.querySelectorAll('input[type="checkbox"]');

    function updateLimitState() {
      const checkedCount = group.querySelectorAll('input[type="checkbox"]:checked').length;

      checkboxes.forEach(cb => {
        const label = cb.closest('.checkbox-label');
        if (checkedCount >= max && !cb.checked) {
          cb.disabled = true;
          if (label) label.classList.add('disabled');
        } else {
          cb.disabled = false;
          if (label) label.classList.remove('disabled');
        }
      });
    }

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateLimitState);
    });
  });
}

function setupPriceCalculation() {
  const proteinStep = document.getElementById('step-3');
  if (proteinStep) {
    const proteinCheckboxes = proteinStep.querySelectorAll('input[type="checkbox"]');
    proteinCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        updateProteinUI();
        calculateTotalPrice();
      });
    });
  }

  const veggieStep = document.getElementById('step-4');
  if (veggieStep) {
    const veggieCheckboxes = veggieStep.querySelectorAll('input[type="checkbox"]');
    veggieCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        updateVeggieUI();
        calculateTotalPrice();
      });
    });
  }

  const toppingStep = document.getElementById('step-5');
  if (toppingStep) {
    const toppingCheckboxes = toppingStep.querySelectorAll('input[type="checkbox"]');
    toppingCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        updateToppingUI();
        calculateTotalPrice();
      });
    });
  }

  updateProteinUI();
  updateVeggieUI();
  updateToppingUI();
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const sizeSelect = document.getElementById('size-select');
  let basePrice = 8.99;
  let sizeValue = '';

  const isSig = !!activeSignatureBowl;

  if (sizeSelect && sizeSelect.selectedIndex >= 0) {
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    sizeValue = sizeSelect.value;
    const priceAttr = selectedOption.getAttribute('data-price');
    if (priceAttr) {
      basePrice = parseFloat(priceAttr.replace('$', '')) || (isSig ? activeSignatureBowl.regularPrice : 8.99);
    }
  } else if (isSig) {
    basePrice = activeSignatureBowl.regularPrice;
  }

  let proteinExtra = 0;
  const checkedProteins = document.querySelectorAll('#step-3 input[type="checkbox"]:checked');
  const defaultProteins = (isSig && activeSignatureBowl.defaults && activeSignatureBowl.defaults.protein) || [];
  checkedProteins.forEach(cb => {
    const extraAttr = cb.getAttribute('data-extra');
    const qty = getItemQty(cb);
    if (extraAttr) {
      let chargeableQty = qty;
      if (isSig && defaultProteins.includes(cb.value)) {
        chargeableQty = Math.max(0, qty - 1);
      }
      proteinExtra += (parseFloat(extraAttr) || 0) * chargeableQty;
    }
  });

  let veggieExtra = 0;
  const checkedVeggies = document.querySelectorAll('#step-4 input[type="checkbox"]:checked');
  if (isSig) {
    const defaultVeggies = (activeSignatureBowl.defaults && activeSignatureBowl.defaults.veggies) || [];
    checkedVeggies.forEach(cb => {
      const qty = getItemQty(cb);
      if (defaultVeggies.includes(cb.value)) {
        if (qty > 1) {
          veggieExtra += (qty - 1) * 1.30;
        }
      } else {
        veggieExtra += qty * 1.30;
      }
    });
  } else {
    let freeVeggiesCount = 0;
    if (sizeValue === 'small') freeVeggiesCount = 2;
    else if (sizeValue === 'regular') freeVeggiesCount = 3;
    else if (sizeValue === 'large') freeVeggiesCount = 4;

    let totalVeggiePortions = 0;
    checkedVeggies.forEach(cb => {
      totalVeggiePortions += getItemQty(cb);
    });

    if (totalVeggiePortions > freeVeggiesCount) {
      veggieExtra = (totalVeggiePortions - freeVeggiesCount) * 1.30;
    }
  }

  let toppingExtra = 0;
  const checkedToppings = document.querySelectorAll('#step-5 input[type="checkbox"]:checked');
  if (isSig) {
    const defaultToppings = (activeSignatureBowl.defaults && activeSignatureBowl.defaults.toppings) || [];
    checkedToppings.forEach(cb => {
      const qty = getItemQty(cb);
      if (defaultToppings.includes(cb.value)) {
        if (qty > 1) {
          toppingExtra += (qty - 1) * 2.30;
        }
      } else {
        toppingExtra += qty * 2.30;
      }
    });
  } else {
    let freeToppingsCount = 0;
    if (sizeValue === 'small') freeToppingsCount = 1;
    else if (sizeValue === 'regular') freeToppingsCount = 2;
    else if (sizeValue === 'large') freeToppingsCount = 3;

    let totalToppingPortions = 0;
    checkedToppings.forEach(cb => {
      totalToppingPortions += getItemQty(cb);
    });

    if (totalToppingPortions > freeToppingsCount) {
      toppingExtra = (totalToppingPortions - freeToppingsCount) * 2.30;
    }
  }

  const qtyNum = document.querySelector('.qty-num');
  let quantity = 1;
  if (qtyNum) {
    quantity = parseInt(qtyNum.textContent, 10) || 1;
  }

  const total = (basePrice + proteinExtra + veggieExtra + toppingExtra) * quantity;
  const orderPrice = document.querySelector('.order-price');
  if (orderPrice) {
    orderPrice.textContent = `$${total.toFixed(2)}`;
  }

  // Update dynamic extra spending notes above prev/next buttons for each subsection
  updateExtraSpendingNotes({
    'step-1': { name: 'Size', extra: 0 },
    'step-2': { name: 'Base', extra: 0 },
    'step-3': { name: 'Protein', extra: proteinExtra },
    'step-4': { name: 'Veggies', extra: veggieExtra },
    'step-5': { name: 'Toppings', extra: toppingExtra },
    'step-6': { name: 'Sauces', extra: 0 },
    'step-7': { name: 'Garnish', extra: 0 }
  });
}

function updateExtraSpendingNotes(extraMap) {
  Object.keys(extraMap).forEach(stepId => {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;

    const navButtons = stepEl.querySelector('.step-nav-buttons');
    if (!navButtons) return;

    let noteEl = stepEl.querySelector('.extra-spent-note');
    if (!noteEl) {
      noteEl = document.createElement('div');
      noteEl.className = 'extra-spent-note';
      navButtons.parentNode.insertBefore(noteEl, navButtons);
    }

    const { name, extra } = extraMap[stepId];
    if (extra > 0) {
      noteEl.textContent = `You have spent $${extra.toFixed(2)} extra on ${name}`;
      noteEl.style.display = 'block';
    } else {
      noteEl.textContent = '';
      noteEl.style.display = 'none';
    }
  });
}

function setupQuantityCounter() {
  const minusBtn = document.querySelector('.minus-btn');
  const plusBtn = document.querySelector('.plus-btn');
  const qtyNum = document.querySelector('.qty-num');

  if (minusBtn && plusBtn && qtyNum) {
    minusBtn.addEventListener('click', () => {
      let qty = parseInt(qtyNum.textContent, 10);
      if (qty > 1) {
        qty--;
        qtyNum.textContent = qty;
        calculateTotalPrice();
      }
    });

    plusBtn.addEventListener('click', () => {
      let qty = parseInt(qtyNum.textContent, 10);
      qty++;
      qtyNum.textContent = qty;
      calculateTotalPrice();
    });
  }
}

function setupOrderSummaryLogic() {
  const seeOrderRow = document.querySelector('.see-order-row');
  const bottomBar = document.querySelector('.byo-bottom-bar');
  const summaryContent = document.querySelector('.order-summary-content');

  if (!seeOrderRow || !bottomBar || !summaryContent) return;

  summaryContent.addEventListener('click', (e) => {
    // Bowl overall quantity +/- in summary
    if (e.target.classList.contains('summary-minus-btn')) {
      const mainMinusBtn = document.querySelector('.minus-btn:not(.summary-minus-btn)');
      if (mainMinusBtn) {
        mainMinusBtn.click();
        populateOrderSummary(summaryContent);
      }
      return;
    }

    if (e.target.classList.contains('summary-plus-btn')) {
      const mainPlusBtn = document.querySelector('.plus-btn:not(.summary-plus-btn)');
      if (mainPlusBtn) {
        mainPlusBtn.click();
        populateOrderSummary(summaryContent);
      }
      return;
    }

    // Per-item stepper in summary
    if (e.target.classList.contains('summary-item-minus')) {
      const item = e.target.closest('.summary-item');
      if (!item) return;
      const name = item.getAttribute('data-input-name');
      const val = item.getAttribute('data-input-value');
      const row = document.querySelector(`.option-row:has(input[name="${name}"][value="${val}"])`);
      if (row) {
        const rowMinus = row.querySelector('.item-minus');
        if (rowMinus) {
          rowMinus.click();
          populateOrderSummary(summaryContent);
        }
      }
      return;
    }

    if (e.target.classList.contains('summary-item-plus')) {
      const item = e.target.closest('.summary-item');
      if (!item) return;
      const name = item.getAttribute('data-input-name');
      const val = item.getAttribute('data-input-value');
      const row = document.querySelector(`.option-row:has(input[name="${name}"][value="${val}"])`);
      if (row) {
        const rowPlus = row.querySelector('.item-plus');
        if (rowPlus) {
          rowPlus.click();
          populateOrderSummary(summaryContent);
        }
      }
      return;
    }

    // Toggle item selection when clicking on the checkbox or label
    const contentTarget = e.target.closest('.summary-item-content');
    if (!contentTarget) return;

    const item = contentTarget.closest('.summary-item');
    if (!item || !item.hasAttribute('data-input-name')) return;

    const name = item.getAttribute('data-input-name');
    const val = item.getAttribute('data-input-value');
    const originalCb = document.querySelector(`input[name="${name}"][value="${val}"]`);

    if (originalCb) {
      originalCb.checked = !originalCb.checked;
      originalCb.dispatchEvent(new Event('change'));

      const box = item.querySelector('.summary-item-box');
      if (originalCb.checked) {
        box.innerHTML = '&#10003;';
        box.classList.add('checked');
        box.classList.remove('unchecked');
        item.classList.remove('deselected');
      } else {
        box.innerHTML = '';
        box.classList.remove('checked');
        box.classList.add('unchecked');
        item.classList.add('deselected');

        // Move to bottom of the section
        const section = item.closest('.summary-section');
        section.appendChild(item);
      }
      populateOrderSummary(summaryContent);
    }
  });

  summaryContent.addEventListener('change', (e) => {
    if (e.target.classList.contains('summary-size-select')) {
      const mainSizeSelect = document.getElementById('size-select');
      if (mainSizeSelect) {
        mainSizeSelect.value = e.target.value;
        mainSizeSelect.dispatchEvent(new Event('change'));
        populateOrderSummary(summaryContent);
      }
    }
  });

  function openOrderSummary() {
    const isExpanded = bottomBar.classList.contains('expanded');
    const textSpan = bottomBar.querySelector('.see-order-btn span:first-child');
    const chevron = bottomBar.querySelector('.chevron-up');

    if (!isExpanded) {
      bottomBar.classList.add('expanded');
      if (textSpan) textSpan.textContent = 'Order Summary';
      if (chevron) chevron.innerHTML = '&#9660;';
      populateOrderSummary(summaryContent);
    }
    // Smooth scroll down to order summary so user immediately sees the opened summary
    bottomBar.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  // Handle Done buttons (Base and Garnish sections) that open the order summary
  const doneOrderBtns = document.querySelectorAll('.done-order-btn');
  doneOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openOrderSummary();
    });
  });

  seeOrderRow.addEventListener('click', () => {
    const isExpanded = bottomBar.classList.contains('expanded');
    const textSpan = bottomBar.querySelector('.see-order-btn span:first-child');
    const chevron = bottomBar.querySelector('.chevron-up');

    if (isExpanded) {
      bottomBar.classList.remove('expanded');
      if (textSpan) textSpan.textContent = 'See Order';
      if (chevron) chevron.innerHTML = '&#9650;';
    } else {
      bottomBar.classList.add('expanded');
      if (textSpan) textSpan.textContent = 'Order Summary';
      if (chevron) chevron.innerHTML = '&#9660;';
      populateOrderSummary(summaryContent);
    }
  });

  function closeOrderSummary() {
    const isExpanded = bottomBar.classList.contains('expanded');
    if (isExpanded) {
      bottomBar.classList.remove('expanded');
      const textSpan = bottomBar.querySelector('.see-order-btn span:first-child');
      const chevron = bottomBar.querySelector('.chevron-up');
      if (textSpan) textSpan.textContent = 'See Order';
      if (chevron) chevron.innerHTML = '&#9650;';
    }
  }

  // Collapse order summary if someone clicks on any subsection or stage
  const subsections = document.querySelectorAll(
    '.stage-tab, .accordion-header, .accordion-step, .prev-btn, .next-btn'
  );
  subsections.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.done-order-btn')) return;
      closeOrderSummary();
    });
  });
}

function populateOrderSummary(container) {
  let html = '';

  const isSig = !!activeSignatureBowl;

  // Size
  const sizeSelect = document.getElementById('size-select');
  const sizeValue = sizeSelect ? sizeSelect.value : '';

  if (isSig) {
    const isRegular = (sizeValue === 'regular' || !sizeValue) ? 'selected' : '';
    const isLarge = sizeValue === 'large' ? 'selected' : '';
    html += `
      <div class="summary-section">
        <div class="summary-title">Size</div>
        <select class="custom-select summary-size-select" style="margin-top: 4px;">
          <option value="regular" ${isRegular}>Regular bowl - $${activeSignatureBowl.regularPrice.toFixed(2)}</option>
          <option value="large" ${isLarge}>Large bowl - $${activeSignatureBowl.largePrice.toFixed(2)}</option>
        </select>
      </div>
    `;
  } else {
    const isSmall = sizeValue === 'small' ? 'selected' : '';
    const isRegular = sizeValue === 'regular' ? 'selected' : '';
    const isLarge = sizeValue === 'large' ? 'selected' : '';
    const isNone = (!isSmall && !isRegular && !isLarge) ? 'selected' : '';

    html += `
      <div class="summary-section">
        <div class="summary-title">Size</div>
        <select class="custom-select summary-size-select" style="margin-top: 4px;">
          <option value="" disabled ${isNone}>Select one</option>
          <option value="small" ${isSmall}>Small bowl - $8.99</option>
          <option value="regular" ${isRegular}>Regular bowl - $10.99</option>
          <option value="large" ${isLarge}>Large bowl - $13.29</option>
        </select>
      </div>
    `;
  }

  let freeVeggiesCount = 0;
  let freeToppingsCount = 0;
  if (!isSig) {
    if (sizeValue === 'small') { freeVeggiesCount = 2; freeToppingsCount = 1; }
    else if (sizeValue === 'regular') { freeVeggiesCount = 3; freeToppingsCount = 2; }
    else if (sizeValue === 'large') { freeVeggiesCount = 4; freeToppingsCount = 3; }
  }

  // Helper to generate sections
  const generateSection = (title, nameAttr, supportsQty = false) => {
    let checked = Array.from(document.querySelectorAll(`input[name="${nameAttr}"]:checked`));
    let sectionHtml = `<div class="summary-section"><div class="summary-title">${title}</div>`;

    if (checked.length === 0) {
      sectionHtml += `<div class="summary-item empty-text">None selected</div>`;
    } else {
      // Calculate extra counts
      const extraCounts = {};
      if (isSig) {
        const defaultItems = (activeSignatureBowl.defaults && activeSignatureBowl.defaults[nameAttr]) || [];
        checked.forEach(cb => {
          const qty = getItemQty(cb);
          if (defaultItems.includes(cb.value)) {
            if (qty > 1) {
              extraCounts[cb.value] = qty - 1;
            }
          } else {
            extraCounts[cb.value] = qty;
          }
        });
      } else {
        if (nameAttr === 'veggies') {
          for (let i = freeVeggiesCount; i < veggiePortionHistory.length; i++) {
            const val = veggiePortionHistory[i];
            extraCounts[val] = (extraCounts[val] || 0) + 1;
          }
        } else if (nameAttr === 'toppings') {
          for (let i = freeToppingsCount; i < toppingPortionHistory.length; i++) {
            const val = toppingPortionHistory[i];
            extraCounts[val] = (extraCounts[val] || 0) + 1;
          }
        }
      }

      checked.forEach((cb) => {
        let labelText = cb.value;
        if (cb.nextElementSibling) {
          if (nameAttr === 'protein') {
            labelText = cb.nextElementSibling.getAttribute('data-base-name') || cb.nextElementSibling.textContent.split(' - ')[0].trim();
          } else {
            labelText = cb.nextElementSibling.getAttribute('data-base-text') || cb.nextElementSibling.textContent.replace(/ - \$\d+\.\d+/, '').split(' (+')[0].trim();
          }
        }

        const qty = getItemQty(cb);

        if (nameAttr === 'veggies') {
          const extra = extraCounts[cb.value] || 0;
          if (extra > 0) {
            labelText += ` <span style="color: #666; font-size: 0.9em;">(+ $${(extra * 1.30).toFixed(2)})</span>`;
          }
        } else if (nameAttr === 'toppings') {
          const extra = extraCounts[cb.value] || 0;
          if (extra > 0) {
            labelText += ` <span style="color: #666; font-size: 0.9em;">(+ $${(extra * 2.30).toFixed(2)})</span>`;
          }
        } else if (nameAttr === 'protein') {
          const extraPrice = cb.getAttribute('data-extra');
          if (extraPrice) {
            let chargeableQty = qty;
            if (isSig) {
              const defaultProteins = (activeSignatureBowl.defaults && activeSignatureBowl.defaults.protein) || [];
              if (defaultProteins.includes(cb.value)) {
                chargeableQty = Math.max(0, qty - 1);
              }
            }
            if (chargeableQty > 0) {
              const totalProteinPrice = (parseFloat(extraPrice) * chargeableQty).toFixed(2);
              labelText += ` <span style="color: #666; font-size: 0.9em;">(+ $${totalProteinPrice})</span>`;
            }
          }
        }

        const stepperHtml = supportsQty ? `
          <div class="summary-item-stepper">
            <button type="button" class="item-qty-btn summary-item-minus" aria-label="Decrease quantity">-</button>
            <span class="item-qty-count">${qty}</span>
            <button type="button" class="item-qty-btn summary-item-plus" aria-label="Increase quantity">+</button>
          </div>
        ` : '';

        sectionHtml += `
          <div class="summary-item" data-input-name="${nameAttr}" data-input-value="${cb.value}">
            <div class="summary-item-content" style="cursor: pointer;">
              <div class="summary-item-box checked">&#10003;</div>
              <span>${labelText}</span>
            </div>
            ${stepperHtml}
          </div>
        `;
      });
    }
    sectionHtml += `</div>`;
    return sectionHtml;
  };

  html += generateSection('Base', 'base', false);
  html += generateSection('Proteins', 'protein', true);
  html += generateSection('Veggies', 'veggies', true);
  html += generateSection('Toppings', 'toppings', true);
  html += generateSection('Sauces', 'sauces', false);
  html += generateSection('Garnishes', 'garnishes', false);

  const qtyNum = document.querySelector('.qty-num');
  const currentQty = qtyNum ? parseInt(qtyNum.textContent, 10) || 1 : 1;

  html += `
    <div class="summary-section">
      <div class="summary-title">Quantity</div>
      <div class="summary-item qty-counter" style="margin-top: 0; justify-content: flex-start; padding: 0;">
        <button type="button" class="qty-btn summary-minus-btn" aria-label="Decrease quantity">-</button>
        <span class="qty-num summary-qty-num">${currentQty}</span>
        <button type="button" class="qty-btn summary-plus-btn" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="order-summary-inner">${html}</div>`;
}

function setupAddToCartLogic() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn && document.getElementById('size-select')) {
    // If arriving in edit mode, load the saved cart configuration
    loadCartItemForEditing();

    const sizeSelectEl = document.getElementById('size-select');
    const errorBannerEl = document.getElementById('byo-error-msg');

    if (sizeSelectEl && errorBannerEl) {
      sizeSelectEl.addEventListener('change', () => {
        if (sizeSelectEl.value !== "") {
          const basesChecked = document.querySelectorAll(`input[name="base"]:checked`);
          if (basesChecked.length > 0) {
            errorBannerEl.style.display = 'none';
          }
        }
      });
    }

    const baseCheckboxes = document.querySelectorAll(`input[name="base"]`);
    baseCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (errorBannerEl && sizeSelectEl && sizeSelectEl.value !== "") {
          const basesChecked = document.querySelectorAll(`input[name="base"]:checked`);
          if (basesChecked.length > 0) {
            errorBannerEl.style.display = 'none';
          }
        }
      });
    });

    addToCartBtn.addEventListener('click', (e) => {
      const sizeSelect = document.getElementById('size-select');
      const basesChecked = document.querySelectorAll(`input[name="base"]:checked`);
      const errorBanner = document.getElementById('byo-error-msg');
      const hasSize = sizeSelect && sizeSelect.value !== "";
      const hasBase = basesChecked && basesChecked.length > 0;

      if (!hasSize || !hasBase) {
        e.preventDefault();
        let message = 'Please select a size and at least one base before adding to cart.';
        if (!hasSize && hasBase) {
          message = 'Please select a size before adding to cart.';
        } else if (hasSize && !hasBase) {
          message = 'Please select at least one base before adding to cart.';
        }

        if (errorBanner) {
          errorBanner.textContent = message;
          errorBanner.style.display = 'block';
        }
        return;
      }

      if (errorBanner) {
        errorBanner.style.display = 'none';
      }

      const sizeText = sizeSelect && sizeSelect.options[sizeSelect.selectedIndex] && !sizeSelect.options[sizeSelect.selectedIndex].disabled
        ? sizeSelect.options[sizeSelect.selectedIndex].text.split(' - ')[0]
        : 'Custom Bowl';

      const getCheckedNames = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(el => {
          const baseName = el.nextElementSibling.textContent.split(' - ')[0].trim();
          const qty = getItemQty(el);
          return qty > 1 ? `${baseName} x${qty}` : baseName;
        });

      const getCategorySelections = (name) => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(el => ({
          value: el.value,
          qty: getItemQty(el)
        }));

      const bases = getCheckedNames('base');
      const proteins = getCheckedNames('protein');
      const veggies = getCheckedNames('veggies');
      const toppings = getCheckedNames('toppings');
      const sauces = getCheckedNames('sauces');
      const garnishes = getCheckedNames('garnishes');

      const allItems = [...bases, ...proteins, ...veggies, ...toppings, ...sauces, ...garnishes];
      let desc = allItems.join(', ');

      const qtyNum = document.querySelector('.qty-num:not(.summary-qty-num)');
      const quantity = qtyNum ? parseInt(qtyNum.textContent, 10) || 1 : 1;

      const priceText = document.querySelector('.order-price').textContent.replace('$', '');
      const unitPrice = (parseFloat(priceText) / quantity).toFixed(2);

      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('id');

      let cartItems = [];
      const savedItems = sessionStorage.getItem('cartItems');
      if (savedItems) {
        try {
          cartItems = JSON.parse(savedItems) || [];
        } catch (err) {
          cartItems = [];
        }
      }

      const isSig = !!activeSignatureBowl;
      const bowlName = isSig ? activeSignatureBowl.name : 'Custom Bowl';
      const bowlImage = isSig ? activeSignatureBowl.image : 'images/byo.jpg';
      const itemTitle = isSig ? `${activeSignatureBowl.name} (${sizeText.replace(' bowl', '')})` : sizeText;

      const cartItem = {
        id: editId || 'item_' + Date.now(),
        signatureId: isSig ? activeSignatureBowl.id : null,
        title: itemTitle,
        image: bowlImage,
        desc: desc || (isSig ? activeSignatureBowl.description : 'Build Your Own Bowl'),
        price: unitPrice,
        quantity: quantity,
        details: {
          size: sizeSelect.value,
          base: getCategorySelections('base'),
          protein: getCategorySelections('protein'),
          veggies: getCategorySelections('veggies'),
          toppings: getCategorySelections('toppings'),
          sauces: getCategorySelections('sauces'),
          garnishes: getCategorySelections('garnishes'),
          veggiePortionHistory: [...veggiePortionHistory],
          toppingPortionHistory: [...toppingPortionHistory]
        }
      };

      if (editId) {
        const existingIdx = cartItems.findIndex(item => String(item.id) === String(editId));
        if (existingIdx !== -1) {
          cartItems[existingIdx] = cartItem;
        } else {
          cartItems.push(cartItem);
        }
      } else {
        cartItems.push(cartItem);
      }

      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
      window.location.href = 'cart.html?added=1';
    });
  }
}

function loadCartItemForEditing() {
  const urlParams = new URLSearchParams(window.location.search);
  const isEdit = urlParams.get('edit') === '1';
  if (!isEdit) return;

  const editId = urlParams.get('id');
  let cartData = null;

  const savedItems = sessionStorage.getItem('cartItems');
  if (savedItems) {
    try {
      const items = JSON.parse(savedItems);
      if (Array.isArray(items)) {
        cartData = editId ? items.find(item => String(item.id) === String(editId)) : items[0];
      }
    } catch (e) { }
  }

  // Fallback to old single cartItem if cartItems wasn't set yet
  if (!cartData) {
    const savedSingle = sessionStorage.getItem('cartItem');
    if (savedSingle) {
      try {
        cartData = JSON.parse(savedSingle);
      } catch (e) { }
    }
  }

  if (!cartData) return;

  // Update page header / add button to show editing context
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.textContent = 'Update Bowl in Cart';
  }

  // Restore quantity
  if (cartData.quantity) {
    const qtyNum = document.querySelector('.qty-num:not(.summary-qty-num)');
    if (qtyNum) qtyNum.textContent = cartData.quantity;
  }

  // If detailed selection exists
  if (cartData.details) {
    const details = cartData.details;

    // Restore size
    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect && details.size) {
      sizeSelect.value = details.size;
      sizeSelect.dispatchEvent(new Event('change'));
    }

    // Restore portion histories if saved
    if (Array.isArray(details.veggiePortionHistory)) {
      veggiePortionHistory = [...details.veggiePortionHistory];
    }
    if (Array.isArray(details.toppingPortionHistory)) {
      toppingPortionHistory = [...details.toppingPortionHistory];
    }

    // Helper to restore checkboxes and quantity steppers
    const restoreCategory = (categoryName, items) => {
      if (!Array.isArray(items)) return;
      items.forEach(item => {
        const cb = document.querySelector(`input[name="${categoryName}"][value="${item.value}"]`);
        if (cb) {
          cb.checked = true;
          const row = cb.closest('.option-row');
          if (row) {
            const stepper = row.querySelector('.item-qty-stepper');
            const countEl = row.querySelector('.item-qty-count');
            if (stepper) stepper.classList.add('active');
            if (countEl && item.qty) countEl.textContent = item.qty;
          }
          cb.dispatchEvent(new Event('change'));
        }
      });
    };

    restoreCategory('base', details.base);
    restoreCategory('protein', details.protein);
    restoreCategory('veggies', details.veggies);
    restoreCategory('toppings', details.toppings);
    restoreCategory('sauces', details.sauces);
    restoreCategory('garnishes', details.garnishes);
  }

  // Re-run UI updates and price recalculation
  if (typeof updateProteinUI === 'function') updateProteinUI();
  if (typeof updateVeggieUI === 'function') updateVeggieUI();
  if (typeof updateToppingUI === 'function') updateToppingUI();
  if (typeof calculateTotalPrice === 'function') calculateTotalPrice();
}

function renderMenuContent(data) {
  // Populate BYO Section text, price & image if available on index.html
  const byoCard = document.querySelector('.byo-card');
  if (byoCard && data.byo) {
    byoCard.innerHTML = `
      ${data.byo.image ?
        `<div class="bowl-img-wrapper"><img src="${data.byo.image}" alt="${data.byo.title}" class="bowl-img" onerror="this.parentElement.outerHTML='<div class=&quot;placeholder-box&quot;></div>'"></div>` :
        `<div class="placeholder-box" aria-label="${data.byo.title} Placeholder"></div>`
      }
      <div class="byo-card-details">
        ${data.byo.price ? `<div class="bowl-price">${data.byo.price}</div>` : ''}
        <p id="byo-text" class="lorem-text">${data.byo.description}</p>
        <span class="byo-cta-link">BUILD YOUR BOWL &rarr;</span>
      </div>
    `;
  }

  // Populate Signature Bowls Grid
  const bowlsGrid = document.getElementById('signature-bowls-grid');
  if (bowlsGrid && data.signatureBowls) {
    bowlsGrid.innerHTML = data.signatureBowls.map(bowl => `
      <a href="byo.html?signature=${bowl.id}" class="bowl-card-link">
        <div class="bowl-card">
          ${bowl.image ?
        `<div class="bowl-img-wrapper"><img src="${bowl.image}" alt="${bowl.name}" class="bowl-img" onerror="this.parentElement.outerHTML='<div class=&quot;placeholder-box&quot;></div>'"></div>` :
        `<div class="placeholder-box" aria-label="${bowl.name || 'Signature Bowl'} Placeholder"></div>`
      }
          <h3 class="bowl-name">${bowl.name || 'Signature Bowl'}</h3>
          ${bowl.price ? `<div class="bowl-price">${bowl.price}</div>` : ''}
          <p class="lorem-text">${bowl.description}</p>
        </div>
      </a>
    `).join('');
  }
}

function setupCartLogic() {
  const cartContent = document.querySelector('.cart-content');
  if (!cartContent) return;

  const subtotalEl = document.getElementById('cart-subtotal');
  const hstEl = document.getElementById('cart-hst');
  const tipEl = document.getElementById('cart-tip');
  const totalEl = document.getElementById('cart-total');
  const emptyState = document.getElementById('empty-cart-state');
  const fullState = document.getElementById('full-cart-state');
  const bottomBar = document.getElementById('cart-bottom-bar');
  const cartCount = document.querySelector('.cart-count');
  const cartItemsList = document.getElementById('cart-items-list');
  const tipBtns = document.querySelectorAll('.tip-btn');

  let currentTipPercent = 15;

  let cartItems = [];
  const savedItems = sessionStorage.getItem('cartItems');
  if (savedItems) {
    try {
      cartItems = JSON.parse(savedItems) || [];
    } catch (e) {
      cartItems = [];
    }
  } else {
    // Check old single cartItem format if present
    const savedSingle = sessionStorage.getItem('cartItem');
    if (savedSingle) {
      try {
        const item = JSON.parse(savedSingle);
        if (item) {
          item.id = item.id || 'item_1';
          cartItems = [item];
          sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
      } catch (e) { }
    }
  }

  function renderCartItems() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    cartItems.forEach((item, index) => {
      const itemCard = document.createElement('div');
      itemCard.className = 'cart-item-card';
      itemCard.id = `cart-item-${item.id || index}`;

      const unitPrice = parseFloat(item.price) || 0;
      const itemSubtotal = (unitPrice * item.quantity).toFixed(2);

      const editUrl = item.signatureId
        ? `byo.html?signature=${encodeURIComponent(item.signatureId)}&edit=1&id=${encodeURIComponent(item.id)}`
        : `byo.html?edit=1&id=${encodeURIComponent(item.id)}`;
      const imgSrc = item.image || 'images/byo.jpg';

      itemCard.innerHTML = `
        <div class="cart-item-top" style="cursor: pointer;" onclick="window.location.href='${editUrl}'" title="Click to edit this bowl">
          <div class="cart-item-img" style="border-radius: 8px; overflow: hidden; border: 2px solid var(--color-black);">
            <img src="${imgSrc}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="cart-item-details">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h3 class="cart-item-title">${item.title}</h3>
              <span class="edit-link-badge" style="font-size: 0.8rem; font-weight: 600; text-decoration: underline; color: #555; cursor: pointer;">Edit</span>
            </div>
            <p class="cart-item-desc">${item.desc}</p>
          </div>
          <div class="cart-item-price" data-unit-price="${unitPrice}">$${itemSubtotal}</div>
        </div>
        <div class="cart-item-bottom">
          <div class="qty-counter cart-qty">
            <button type="button" class="qty-btn cart-minus-btn" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span class="qty-num cart-qty-num">${item.quantity}</span>
            <button type="button" class="qty-btn cart-plus-btn" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="trash-btn" data-id="${item.id}" aria-label="Remove item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      // Minus button
      const minusBtn = itemCard.querySelector('.cart-minus-btn');
      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          if (item.quantity > 1) {
            item.quantity--;
            saveAndRefresh();
          }
        });
      }

      // Plus button
      const plusBtn = itemCard.querySelector('.cart-plus-btn');
      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          item.quantity++;
          saveAndRefresh();
        });
      }

      // Trash button
      const trashBtn = itemCard.querySelector('.trash-btn');
      if (trashBtn) {
        trashBtn.addEventListener('click', () => {
          cartItems.splice(index, 1);
          saveAndRefresh();
        });
      }

      cartItemsList.appendChild(itemCard);
    });
  }

  function saveAndRefresh() {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
    updateCartMath();
  }

  function toggleCartDisplay() {
    const totalItemsCount = cartItems.reduce((acc, it) => acc + (it.quantity || 0), 0);
    if (cartItems.length === 0 || totalItemsCount === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (fullState) fullState.style.display = 'none';
      if (bottomBar) bottomBar.style.display = 'none';
      if (cartCount) cartCount.textContent = '0 items';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (fullState) fullState.style.display = 'block';
      if (bottomBar) bottomBar.style.display = 'block';
    }
  }

  function updateCartMath() {
    toggleCartDisplay();
    if (cartItems.length === 0) return;

    let subtotal = 0;
    let totalQuantity = 0;

    cartItems.forEach(item => {
      const unitPrice = parseFloat(item.price) || 0;
      subtotal += unitPrice * item.quantity;
      totalQuantity += item.quantity;
    });

    const hst = subtotal * 0.13;
    const tip = subtotal * (currentTipPercent / 100);
    const total = subtotal + hst + tip;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (hstEl) hstEl.textContent = `$${hst.toFixed(2)}`;
    if (tipEl) tipEl.textContent = `$${tip.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (cartCount) cartCount.textContent = `${totalQuantity} item${totalQuantity !== 1 ? 's' : ''}`;
  }

  renderCartItems();
  updateCartMath();

  const customTipBtn = document.querySelector('.tip-btn-custom');
  const customTipLabel = document.querySelector('.custom-tip-label');
  const customTipInput = document.querySelector('.custom-tip-input');

  function activateCustomInput() {
    if (!customTipInput || !customTipLabel || !customTipBtn) return;
    tipBtns.forEach(b => b.classList.remove('selected'));
    customTipBtn.classList.add('selected');
    customTipLabel.style.display = 'none';
    customTipInput.style.display = 'block';
    customTipInput.value = currentTipPercent ? currentTipPercent : '';
    customTipInput.focus();
    customTipInput.select();
  }

  function commitCustomTip() {
    if (!customTipInput || !customTipLabel || !customTipBtn) return;
    const val = customTipInput.value.trim();
    if (val !== '' && !isNaN(val) && parseFloat(val) >= 0) {
      currentTipPercent = Math.min(100, Math.max(0, parseFloat(val)));
      customTipLabel.textContent = `${currentTipPercent}%`;
    } else {
      if (customTipBtn.classList.contains('selected')) {
        currentTipPercent = 0;
        customTipLabel.textContent = '0%';
      } else {
        customTipLabel.textContent = 'Other';
      }
    }
    customTipInput.style.display = 'none';
    customTipLabel.style.display = 'inline';
    updateCartMath();
  }

  if (customTipInput) {
    customTipInput.addEventListener('input', () => {
      const val = customTipInput.value.trim();
      if (val !== '' && !isNaN(val) && parseFloat(val) >= 0) {
        currentTipPercent = Math.min(100, Math.max(0, parseFloat(val)));
        updateCartMath();
      }
    });

    customTipInput.addEventListener('blur', commitCustomTip);

    customTipInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        customTipInput.blur();
      }
    });
  }

  tipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tipVal = btn.getAttribute('data-tip');

      if (tipVal === 'other') {
        if (customTipInput && customTipInput.style.display === 'block') {
          return;
        }
        activateCustomInput();
      } else {
        tipBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentTipPercent = parseInt(tipVal, 10);

        if (customTipInput && customTipLabel) {
          customTipInput.style.display = 'none';
          customTipLabel.style.display = 'inline';
          customTipLabel.textContent = 'Other';
        }
        updateCartMath();
      }
    });
  });
}
