document.addEventListener('DOMContentLoaded', () => {
  // Initialize dashboard features
  initReadinessGauge();
  initSleepChartTooltips();
  initSmartRingHotspots();
  initLiveHeartRate();
  initAIAssistant();
  initNavigation();
});

/* ==========================================================================
   1. READINESS SCORE GAUGE ANIMATION
   ========================================================================== */
function initReadinessGauge() {
  const fillCircle = document.getElementById('readiness-gauge-fill');
  if (!fillCircle) return;
  
  // Set stroke dash offset to match the readiness score (87)
  const score = 87;
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.16
  
  // Dash offset calculations
  const offset = circumference - (score / 100) * circumference;
  
  // Animate with a slight timeout to let page render first
  setTimeout(() => {
    fillCircle.style.strokeDashoffset = offset;
  }, 300);
}

/* ==========================================================================
   2. SLEEP BAR CHART TOOLTIPS
   ========================================================================== */
function initSleepChartTooltips() {
  const chartBars = document.querySelectorAll('.stage-bar');
  const tooltip = document.getElementById('app-tooltip');
  
  if (!tooltip || chartBars.length === 0) return;
  
  chartBars.forEach(bar => {
    bar.addEventListener('mouseenter', (e) => {
      const tooltipText = bar.getAttribute('data-tooltip');
      tooltip.textContent = tooltipText;
      tooltip.classList.remove('hidden');
      positionTooltip(e, tooltip);
    });
    
    bar.addEventListener('mousemove', (e) => {
      positionTooltip(e, tooltip);
    });
    
    bar.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
  });
}

function positionTooltip(e, tooltipEl) {
  const x = e.clientX + 10;
  const y = e.clientY + 15;
  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top = `${y}px`;
}

/* ==========================================================================
   3. SMART RING HOTSPOTS INTERACTIVITY
   ========================================================================== */
function initSmartRingHotspots() {
  const hotspots = document.querySelectorAll('.ring-hotspot');
  const detailCard = document.getElementById('hotspot-detail-card');
  
  if (!detailCard || hotspots.length === 0) return;
  
  // Hover & Click states for hotspots
  hotspots.forEach(hotspot => {
    const showDetail = () => {
      const title = hotspot.getAttribute('data-title');
      const desc = hotspot.getAttribute('data-desc');
      
      detailCard.querySelector('.detail-title').textContent = title;
      detailCard.querySelector('.detail-description').textContent = desc;
      
      // Position card overlay close to the hotspot
      const parentRect = hotspot.parentElement.getBoundingClientRect();
      const hotspotLeft = hotspot.offsetLeft;
      const hotspotTop = hotspot.offsetTop;
      
      // Determine layout position based on coordinates
      let cardLeft = hotspotLeft + 40;
      let cardTop = hotspotTop - 40;
      
      // Keep card within container bounds
      if (cardLeft + 260 > parentRect.width) {
        cardLeft = hotspotLeft - 280; // place to the left
      }
      
      detailCard.style.left = `${cardLeft}px`;
      detailCard.style.top = `${cardTop}px`;
      detailCard.classList.remove('hidden');
    };
    
    const hideDetail = () => {
      detailCard.classList.add('hidden');
    };
    
    hotspot.addEventListener('mouseenter', showDetail);
    hotspot.addEventListener('mouseleave', hideDetail);
    hotspot.addEventListener('click', (e) => {
      e.stopPropagation();
      showDetail();
    });
  });
  
  // Close detail card if clicking anywhere else
  document.addEventListener('click', () => {
    detailCard.classList.add('hidden');
  });
}

/* ==========================================================================
   4. LIVE HEART RATE GRAPH SIMULATION
   ========================================================================== */
function initLiveHeartRate() {
  const hrValText = document.getElementById('live-heart-rate');
  const heartPath = document.getElementById('heart-rate-path');
  
  if (!hrValText || !heartPath) return;
  
  let currentBPM = 71;
  
  // Helper to simulate heart rate fluctuation
  setInterval(() => {
    const delta = Math.floor(Math.random() * 5) - 2; // fluctuate -2 to +2
    currentBPM = Math.max(60, Math.min(100, currentBPM + delta));
    hrValText.textContent = currentBPM;
  }, 3000);
  
  // Simulate graph scroll effect
  let points = [
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, // baseline
    10, 30, 20, 20, 20, 20,                 // heartbeat
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    5, 35, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20
  ];
  
  function updateGraph() {
    // Shift points list left and push a new point
    points.shift();
    
    // Periodically inject a heartbeat spike
    const lastHeartbeatIdx = points.length - 8;
    const isSpikePhase = Math.random() < 0.15;
    
    if (isSpikePhase && points[points.length - 1] === 20 && points[points.length - 2] === 20) {
      // Inject QRS spike sequence
      points.push(10);
      points.push(35);
      points.push(15);
      points.push(20);
    } else {
      points.push(20);
    }
    
    // Rebuild SVG path definition
    let d = "M 0 20";
    const segmentWidth = 200 / (points.length - 1);
    
    for (let i = 1; i < points.length; i++) {
      d += ` L ${i * segmentWidth} ${points[i]}`;
    }
    
    heartPath.setAttribute('d', d);
    requestAnimationFrame(updateGraph);
  }
  
  // Run scroll simulation at a moderate speed
  let frameCount = 0;
  function animate() {
    frameCount++;
    if (frameCount % 6 === 0) { // throttle speed
      updateGraph();
    }
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   5. AI ASSISTANT CHAT INTERACTIONS
   ========================================================================== */
function initAIAssistant() {
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('btn-ai-send');
  const statusText = document.getElementById('ai-status-text');
  const messageText = document.getElementById('ai-message-text');
  const aiBlob = document.getElementById('ai-blob');
  
  if (!chatInput || !sendBtn || !statusText || !messageText) return;
  
  const handleQuery = () => {
    const query = chatInput.value.trim().toLowerCase();
    if (!query) return;
    
    chatInput.value = '';
    
    // Set AI status to thinking & speed up animations
    statusText.textContent = 'Analyzing';
    statusText.style.color = 'var(--color-accent)';
    messageText.textContent = '"Reviewing health data logs..."';
    aiBlob.style.animationDuration = '2s, 10s'; // floating speeds up, spinning speeds up
    
    // Mock Response Generator based on query keywords
    let response = "I am Aura, your wellness assistant. Ask me about your sleep, readiness, calories, active goals, or smart ring specifications.";
    
    if (query.includes('sleep') || query.includes('uxla') || query.includes('tun')) {
      response = "Last night you had 1h 18m of deep sleep. To optimize tonight's sleep phase, avoid heavy meals within 3 hours of bedtime.";
    } else if (query.includes('readiness') || query.includes('charchoq') || query.includes('tiklanish')) {
      response = "Your readiness is 87 (Optimal). HRV and body temp trends indicate your nervous system is primed for high-intensity training today.";
    } else if (query.includes('goal') || query.includes('kaloriya') || query.includes('cal') || query.includes('kcal')) {
      response = "You completed 338 kcal (67.6% of your 500 kcal daily goal). A 15-minute jog will push you over the completion line!";
    } else if (query.includes('ring') || query.includes('uzuk') || query.includes('spec')) {
      response = "Aura Ring incorporates 3 optical LEDs, a skin temperature sensor, BLE 5.0, and 7-day battery inside aerospace-grade titanium.";
    } else if (query.includes('salom') || query.includes('hello') || query.includes('hi')) {
      response = "Hello John! How can I help you optimize your recovery, sleep, or training metrics today?";
    }
    
    // Simulate thinking delay (1.5 seconds)
    setTimeout(() => {
      typeResponse(response, messageText, () => {
        // Restore active listening state
        statusText.textContent = 'Listening';
        statusText.style.color = 'var(--color-orange)';
        aiBlob.style.animationDuration = '6s, 25s';
      });
    }, 1500);
  };
  
  sendBtn.addEventListener('click', handleQuery);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  });
}

// Typing text animation helper
function typeResponse(text, element, callback) {
  element.textContent = '"';
  let i = 0;
  
  function typeChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, 25); // typing speed
    } else {
      element.textContent += '"';
      if (callback) callback();
    }
  }
  
  typeChar();
}

/* ==========================================================================
   6. NAVIGATION ACTIVE SWITCHER
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const headerLinks = document.querySelectorAll('.header-nav-link');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.classList.contains('nav-item-btn')) return; // ignore support icon
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
  
  headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      headerLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
