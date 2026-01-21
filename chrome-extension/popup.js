const DEFAULT_BACKEND = 'https://shield-csp.vercel.app';

function $(id) {
  return document.getElementById(id);
}

async function getActiveTabUrl() {
  return new Promise((resolve) => {
    if (!chrome.tabs) {
      resolve('');
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      resolve(tab?.url || '');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const backendInput = $('backendUrl');
  const pageInput = $('pageUrl');
  const openScannerBtn = $('openScanner');
  const openDashboardBtn = $('openDashboard');

  // Load saved backend URL if present
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['shieldcspBackendUrl'], (result) => {
      backendInput.value = result.shieldcspBackendUrl || DEFAULT_BACKEND;
    });
  } else {
    backendInput.value = DEFAULT_BACKEND;
  }

  // Prefill page URL from active tab
  const activeUrl = await getActiveTabUrl();
  if (activeUrl) {
    pageInput.value = activeUrl;
  }

  // Persist backend URL changes
  backendInput.addEventListener('change', () => {
    const value = backendInput.value.trim() || DEFAULT_BACKEND;
    backendInput.value = value;
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ shieldcspBackendUrl: value });
    }
  });

  openScannerBtn.addEventListener('click', () => {
    const backend = (backendInput.value || DEFAULT_BACKEND).replace(/\/+$/, '');
    const url = pageInput.value.trim();
    if (!url) return;

    const target = `${backend}/scanner?url=${encodeURIComponent(url)}`;
    chrome.tabs.create({ url: target });
  });

  openDashboardBtn.addEventListener('click', () => {
    const backend = (backendInput.value || DEFAULT_BACKEND).replace(/\/+$/, '');
    chrome.tabs.create({ url: `${backend}/dashboard` });
  });
});

