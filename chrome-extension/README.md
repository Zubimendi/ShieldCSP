# ShieldCSP Chrome Extension (Helper)

Minimal helper extension that sends the current browser tab to your ShieldCSP dashboard.

## What it does

- Reads the active tab URL.
- Lets you configure your ShieldCSP base URL (e.g. `https://shield-csp.vercel.app` or `http://localhost:3000`).
- One‑click:
  - **Open in Scanner** – opens `/scanner?url=<current-tab-url>` in a new tab.
  - **Dashboard** – opens `/dashboard` in a new tab.

All scanning / analysis still happens inside the main ShieldCSP app. The extension is just a shortcut.

## Install locally

1. Build/run the main ShieldCSP app (optional but recommended).
2. Open **Chrome → Extensions → Manage Extensions**.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `chrome-extension/` folder in this repo.

## Usage

1. Click the ShieldCSP icon in the Chrome toolbar.
2. Verify or change the **ShieldCSP URL** (defaults to `https://shield-csp.vercel.app`).
3. The **Page URL** is auto‑filled with the current tab URL; you can edit it if needed.
4. Click:
   - **Open in Scanner** to go directly to the scanner view with the URL pre‑filled.
   - **Dashboard** to jump to your main dashboard.

> Note: Make sure you are logged in to ShieldCSP in Chrome. The extension does not handle authentication; it simply opens the correct pages in your existing session.

