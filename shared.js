/**
 * WellnessKit Hub — Shared JavaScript Library
 * Pure Vanilla JavaScript — Works natively with zero build tools or bundling.
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const THEME_STORAGE_KEY = 'wellnesskit_hub_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'dark'); // Default to dark navy

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);
  }

  function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;
    if (theme === 'light') {
      themeBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeBtn.setAttribute('title', 'Switch to Light Mode');
      themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateThemeIcon(nextTheme);
  };

  // --- Mobile Navigation Toggle ---
  function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('primary-nav-links');
    if (!mobileBtn || !navLinks) return;

    mobileBtn.addEventListener('click', function () {
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }

  // --- Toast Notifications ---
  window.showToast = function (message, duration = 3200) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  };

  // --- Copy to Clipboard ---
  window.copyResultToClipboard = function (text, successMsg = 'Result copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(successMsg);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  };

  function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      window.showToast(successMsg);
    } catch (err) {
      window.showToast('Unable to copy to clipboard.');
    }
    document.body.removeChild(textarea);
  }

  // --- Scientific Formula Knowledge Base (Verified Clinical Citations) ---
  const FORMULA_DATABASE = {
    bmi: {
      title: 'Body Mass Index (BMI) & WHO Classification',
      category: 'Body Composition',
      formulaText: 'BMI = Weight (kg) / [Height (m)]²  OR  BMI = 703 × Weight (lbs) / [Height (in)]²',
      citation: 'World Health Organization (WHO) Technical Report Series 854 (1995) & WHO Consultation on Obesity (2000).',
      explanation: `
        <p><strong>Clinical Background:</strong> Body Mass Index (BMI), originally formulated by Belgian mathematician Adolphe Quetelet in 1832 as the Quetelet Index, is an epidemiological metric designed to assess body mass normalized for stature.</p>
        <p style="margin-top: 10px;"><strong>WHO Reference Ranges:</strong></p>
        <ul style="margin: 8px 0 12px 20px;">
          <li><strong>Underweight:</strong> &lt; 18.5 kg/m²</li>
          <li><strong>Normal weight:</strong> 18.5 – 24.9 kg/m²</li>
          <li><strong>Overweight (Pre-obesity):</strong> 25.0 – 29.9 kg/m²</li>
          <li><strong>Obesity Class I:</strong> 30.0 – 34.9 kg/m²</li>
          <li><strong>Obesity Class II:</strong> 35.0 – 39.9 kg/m²</li>
          <li><strong>Obesity Class III:</strong> &ge; 40.0 kg/m²</li>
        </ul>
        <p><strong>Clinical Considerations & Limitations:</strong> BMI is a screening metric, not a direct measure of body adiposity. It does not differentiate between skeletal muscle mass, bone density, or subcutaneous vs. visceral adipose tissue. Muscular athletes may have a high BMI without excess adiposity.</p>
      `
    },
    calorie: {
      title: 'Total Daily Energy Expenditure (TDEE) & Mifflin-St Jeor',
      category: 'Metabolic & Nutrition',
      formulaText: 'Men: BMR = (10 × W_kg) + (6.25 × H_cm) - (5 × Age) + 5\nWomen: BMR = (10 × W_kg) + (6.25 × H_cm) - (5 × Age) - 161\nTDEE = BMR × Physical Activity Level (PAL)',
      citation: 'Mifflin MD, St Jeor ST, Hill JO, Scott BJ, Daugherty SA, Koh YH. "A new predictive equation for resting energy expenditure in healthy individuals." Am J Clin Nutr. 1990;51(2):241-247.',
      explanation: `
        <p><strong>Scientific Basis:</strong> The Mifflin-St Jeor equation was published in 1990 and validated in extensive multi-center clinical trials. The American Dietetic Association (now the Academy of Nutrition and Dietetics) systematic review identified it as the most reliable predictive equation for resting metabolic rate in both non-obese and obese adults.</p>
        <p style="margin-top: 10px;"><strong>Physical Activity Level (PAL) Multipliers:</strong></p>
        <ul style="margin: 8px 0 12px 20px;">
          <li><strong>Sedentary (1.20):</strong> Minimal daily activity, desk-based work.</li>
          <li><strong>Light Activity (1.375):</strong> Light exercise or sports 1 to 3 days weekly.</li>
          <li><strong>Moderate Activity (1.55):</strong> Moderate physical exercise 3 to 5 days weekly.</li>
          <li><strong>Very Active (1.725):</strong> Rigorous physical conditioning 6 to 7 days weekly.</li>
          <li><strong>Extra Active (1.90):</strong> Twice daily athletic training or physically demanding occupation.</li>
        </ul>
        <p><strong>Energy Balance:</strong> Weight stability requires energy parity. A 250–500 kcal daily deficit is historically considered a prudent guideline for gradual weight changes.</p>
      `
    },
    water: {
      title: 'Daily Hydration Requirements & Fluid Balance',
      category: 'Hydration Physiology',
      formulaText: 'Baseline = Weight (kg) × 35 ml  (or Weight in lbs × 0.5 fl oz)\nExercise Add-on = Duration (min) × 12 ml/min (~350 ml per 30 min)\nEnvironmental Heat/Humidity Adjustment = Baseline × 1.10–1.15',
      citation: 'American College of Sports Medicine (ACSM) Position Stand: Exercise and Fluid Replacement (2007) & National Academies of Sciences, Engineering, and Medicine (NASEM) Dietary Reference Intakes.',
      explanation: `
        <p><strong>Physiological Principles:</strong> Total body water accounts for approximately 55% to 65% of adult mass. Water loss occurs continuously through respiration, perspiration, urination, and metabolic processes.</p>
        <p style="margin-top: 10px;"><strong>Baseline Hydration Constants:</strong></p>
        <ul style="margin: 8px 0 12px 20px;">
          <li>Adult baseline metabolic requirement: 30 to 35 milliliters per kilogram of total body mass.</li>
          <li>Exercise sweat replacement: 400 to 800 ml per hour of sustained moderate physical exertion.</li>
          <li>Food contribution: Approximately 20% of daily hydration is derived from water content in whole foods (fruits, vegetables).</li>
        </ul>
        <p><strong>Pacing Recommendation:</strong> Consume water steadily throughout waking hours rather than in sudden large boluses to maintain optimal renal balance and cellular hydration.</p>
      `
    },
    sleep: {
      title: 'Ultradian Sleep Architecture & 90-Minute Cycles',
      category: 'Circadian Rest',
      formulaText: 'Target Bedtime = Wake Time - (Cycles × 90 min + 14 min Sleep Latency)\nIdeal Target: 5 Cycles (7.5 hours of sleep) or 6 Cycles (9.0 hours of sleep)',
      citation: 'Carskadon MA, Dement WC. Monitoring and evaluating sleep. Principles and Practice of Sleep Medicine. 5th ed. Elsevier Saunders; 2011.',
      explanation: `
        <p><strong>Sleep Cycle Physiology:</strong> Human nocturnal sleep is structured into ultradian cycles lasting approximately 90 minutes (ranging between 80 to 110 minutes in healthy adults). Each cycle traverses specific stages:</p>
        <ul style="margin: 8px 0 12px 20px;">
          <li><strong>N1 (Light Transition):</strong> Initial theta rhythm, gradual muscle relaxation.</li>
          <li><strong>N2 (Light Stable Sleep):</strong> Characterized by sleep spindles and K-complexes; memory consolidation.</li>
          <li><strong>N3 (Slow-Wave / Deep Sleep):</strong> Delta-wave dominance; somatic cellular repair, growth hormone secretion, immune consolidation.</li>
          <li><strong>REM (Rapid Eye Movement):</strong> High brain metabolic activity, dreaming, procedural and emotional memory synthesis.</li>
        </ul>
        <p><strong>Waking Mid-Cycle vs. Cycle Completion:</strong> Awakening at the termination of a 90-minute cycle (during light N1/N2 stage) minimizes sleep inertia, grogginess, and cognitive haze compared to waking during deep slow-wave N3 sleep.</p>
      `
    },
    bmr: {
      title: 'Basal Metabolic Rate (BMR) & Resting Metabolism',
      category: 'Metabolic Energy',
      formulaText: 'Men: BMR = 10 × W(kg) + 6.25 × H(cm) - 5 × Age(yr) + 5\nWomen: BMR = 10 × W(kg) + 6.25 × H(cm) - 5 × Age(yr) - 161',
      citation: 'Mifflin MD, St Jeor ST, Hill JO, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.',
      explanation: `
        <p><strong>Basal vs. Resting Metabolic Rate:</strong> BMR constitutes the minimum thermal and mechanical energy expenditure required to sustain vital organ life (cellular respiration, myocardial contraction, neural electrical activity, hepatic filtering, renal filtration) in a completely rested, post-absorptive, thermoneutral state.</p>
        <p style="margin-top: 10px;"><strong>Organ Contribution to Basal Metabolism:</strong></p>
        <ul style="margin: 8px 0 12px 20px;">
          <li>Liver: ~27% of basal energy expenditure</li>
          <li>Brain: ~19% of basal energy expenditure</li>
          <li>Skeletal Muscle: ~18% (at complete rest)</li>
          <li>Kidneys: ~10% of basal energy expenditure</li>
          <li>Heart: ~7% of basal energy expenditure</li>
          <li>Adipose and other tissues: ~19%</li>
        </ul>
        <p><strong>Age and Body Composition Impact:</strong> BMR decreases with advancing age due to gradual shifts in lean muscle tissue and cell mass. Resistance training and lean tissue preservation assist in sustaining resting metabolic rate over the lifespan.</p>
      `
    }
  };

  // --- Modal Management for Formula Explanations ---
  window.openFormulaModal = function (toolKey) {
    const data = FORMULA_DATABASE[toolKey];
    if (!data) return;

    let backdrop = document.getElementById('formula-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'formula-modal-backdrop';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <div>
              <span id="modal-category-badge" class="badge-category badge-bmi">Formula Reference</span>
              <h3 id="modal-title" class="modal-title" style="margin-top: 6px;">Formula Explanation</h3>
            </div>
            <button class="modal-close-btn" onclick="closeFormulaModal()">&times;</button>
          </div>
          <div class="modal-body" id="modal-body-content">
            <!-- Dynamic Content -->
          </div>
          <div class="modal-footer">
            <button id="ai-explain-btn" class="pill-btn" onclick="askAiToExplain('${toolKey}')">
              <span>✨ Ask AI for Deeper Scientific Insight</span>
            </button>
            <button class="pill-btn pill-btn-primary" onclick="closeFormulaModal()">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      // Close when clicking outside
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) window.closeFormulaModal();
      });
    }

    // Update contents
    document.getElementById('modal-title').innerText = data.title;
    const catBadge = document.getElementById('modal-category-badge');
    catBadge.innerText = data.category;
    catBadge.className = `badge-category badge-${toolKey}`;

    const body = document.getElementById('modal-body-content');
    body.innerHTML = `
      <div class="code-preview" style="margin-bottom: 16px;">
        <span class="label">Mathematical Formula</span>
        <div class="formula">${escapeHtml(data.formulaText)}</div>
      </div>
      <div style="margin-bottom: 16px;">
        ${data.explanation}
      </div>
      <div class="citation-box" style="margin-top: 14px; padding: 12px 16px;">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Verified Academic Citation</div>
        <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-secondary);">${escapeHtml(data.citation)}</div>
      </div>
      <div id="ai-explanation-container" style="display: none; margin-top: 16px; padding: 14px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-md);">
        <div style="font-size: 0.8rem; font-weight: 700; color: #60a5fa; margin-bottom: 6px;">✨ Scientific AI Explanation:</div>
        <div id="ai-explanation-text" style="font-size: 0.875rem; color: var(--text-primary); line-height: 1.55;"></div>
      </div>
    `;

    // Re-bind AI button
    const aiBtn = document.getElementById('ai-explain-btn');
    if (aiBtn) {
      aiBtn.onclick = () => window.askAiToExplain(toolKey);
    }

    backdrop.classList.add('open');
  };

  window.closeFormulaModal = function () {
    const backdrop = document.getElementById('formula-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  };

  // --- AI Explanation Integration (YMYL Compliant, Purely Educational) ---
  window.askAiToExplain = async function (toolKey) {
    const aiContainer = document.getElementById('ai-explanation-container');
    const aiText = document.getElementById('ai-explanation-text');
    const aiBtn = document.getElementById('ai-explain-btn');

    if (!aiContainer || !aiText) return;

    aiContainer.style.display = 'block';
    aiText.innerHTML = '<span style="color: var(--text-muted);">Generating scientific breakdown...</span>';
    if (aiBtn) aiBtn.disabled = true;

    try {
      // Calls server-side endpoint if available
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formulaKey: toolKey })
      });

      if (!res.ok) {
        throw new Error('Endpoint not reachable or running in static GitHub Pages mode.');
      }

      const data = await res.json();
      aiText.innerHTML = data.explanation || 'Detailed educational breakdown provided above.';
    } catch (err) {
      // Graceful offline fallback for static GitHub Pages
      aiText.innerHTML = `
        <p style="margin-bottom: 6px;"><em>(Static deployment mode active — displaying verified clinical reference)</em></p>
        <p>The <strong>${FORMULA_DATABASE[toolKey].title}</strong> is an established scientific benchmark documented by accredited public health bodies. It offers standardized estimation without diagnostic evaluation. For personalized nutritional or physiological prescriptions, consult a licensed healthcare practitioner.</p>
      `;
    } finally {
      if (aiBtn) aiBtn.disabled = false;
    }
  };

  // Utility to escape HTML
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Initialize on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMobileNav();
  });
})();
