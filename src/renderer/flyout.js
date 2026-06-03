const els = {
  loadingState: document.getElementById('loadingState'),
  usageContent: document.getElementById('usageContent'),
  sessionPct: document.getElementById('sessionPct'),
  sessionBar: document.getElementById('sessionBar'),
  sessionTimer: document.getElementById('sessionTimer'),
  sessionReset: document.getElementById('sessionReset'),
  weeklyPct: document.getElementById('weeklyPct'),
  weeklyBar: document.getElementById('weeklyBar'),
  weeklyTimer: document.getElementById('weeklyTimer'),
  weeklyReset: document.getElementById('weeklyReset'),
  accountInfo: document.getElementById('accountInfo'),
  accountName: document.getElementById('accountName'),
  refreshBtn: document.getElementById('refreshBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  expandBtn: document.getElementById('expandBtn')
};

let countdownInterval = null;
let sessionResetsAt = null;
let weeklyResetsAt = null;
let warnThreshold = 75;
let dangerThreshold = 90;
let timeFormat = '12h';

function applyThresholdClass(barEl, pct) {
  barEl.classList.remove('warning', 'danger');
  if (pct >= dangerThreshold) barEl.classList.add('danger');
  else if (pct >= warnThreshold) barEl.classList.add('warning');
}

function formatCountdown(resetsAt) {
  if (!resetsAt) return '--:--';
  const diff = new Date(resetsAt).getTime() - Date.now();
  if (diff <= 0) return '0:00';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

function formatResetTime(resetsAt, includeDate) {
  if (!resetsAt) return '--';
  const d = new Date(resetsAt);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtTime = () => {
    if (timeFormat === '24h') {
      return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    }
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2,'0');
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };
  if (includeDate) return `${months[d.getMonth()]} ${d.getDate()}, ${fmtTime()}`;
  return fmtTime();
}

function updateCountdowns() {
  els.sessionTimer.textContent = formatCountdown(sessionResetsAt);
  els.weeklyTimer.textContent = formatCountdown(weeklyResetsAt);
}

function renderUsage(data) {
  const sessionPct = Math.round(data.five_hour?.utilization || 0);
  const weeklyPct = Math.round(data.seven_day?.utilization || 0);
  sessionResetsAt = data.five_hour?.resets_at;
  weeklyResetsAt = data.seven_day?.resets_at;

  els.sessionPct.textContent = `${sessionPct}%`;
  els.sessionBar.style.width = `${Math.min(sessionPct, 100)}%`;
  applyThresholdClass(els.sessionBar, sessionPct);
  els.sessionReset.textContent = `Resets ${formatResetTime(sessionResetsAt, false)}`;

  els.weeklyPct.textContent = `${weeklyPct}%`;
  els.weeklyBar.style.width = `${Math.min(weeklyPct, 100)}%`;
  applyThresholdClass(els.weeklyBar, weeklyPct);
  els.weeklyReset.textContent = `Resets ${formatResetTime(weeklyResetsAt, true)}`;

  updateCountdowns();

  els.loadingState.style.display = 'none';
  els.usageContent.style.display = 'flex';
}

els.refreshBtn.addEventListener('click', () => window.flyoutAPI.requestRefresh());
els.settingsBtn.addEventListener('click', () => window.flyoutAPI.openSettings());
els.expandBtn.addEventListener('click', () => window.flyoutAPI.openWidget());

window.flyoutAPI.onUsageData((payload) => {
  if (payload.settings) {
    warnThreshold = payload.settings.warnThreshold || 75;
    dangerThreshold = payload.settings.dangerThreshold || 90;
    timeFormat = payload.settings.timeFormat || '12h';
  }
  if (payload.accountLabel) {
    els.accountName.textContent = payload.accountLabel;
    els.accountInfo.style.display = 'flex';
  }
  if (payload.usage) renderUsage(payload.usage);
});

window.flyoutAPI.onThemeChanged((theme) => {
  document.body.classList.remove('theme-light');
  if (theme === 'light') document.body.classList.add('theme-light');
});

window.flyoutAPI.getInitialState().then((state) => {
  if (state.theme === 'light') document.body.classList.add('theme-light');
  warnThreshold = state.settings?.warnThreshold || 75;
  dangerThreshold = state.settings?.dangerThreshold || 90;
  timeFormat = state.settings?.timeFormat || '12h';
  if (state.usage) renderUsage(state.usage);
  if (state.accountLabel) {
    els.accountName.textContent = state.accountLabel;
    els.accountInfo.style.display = 'flex';
  }
});

countdownInterval = setInterval(updateCountdowns, 30000);
