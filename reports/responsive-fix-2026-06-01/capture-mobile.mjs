import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outputDir = new URL('./assets/', import.meta.url);
const port = 9333 + Math.floor(Math.random() * 1000);
const userDataDir = await mkdtemp(path.join(tmpdir(), 'portfolio-cdp-'));

await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank',
], {
  stdio: ['ignore', 'ignore', 'pipe'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function waitForChrome() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      await fetchJson(`http://127.0.0.1:${port}/json/version`);
      return;
    } catch {
      await sleep(100);
    }
  }
  throw new Error('Chrome remote debugging endpoint did not start');
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolve(message.result ?? {});
        return;
      }
      if (message.method && this.events.has(message.method)) {
        for (const resolve of this.events.get(message.method)) resolve(message.params ?? {});
        this.events.delete(message.method);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  waitFor(method, timeout = 10_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeout);
      const wrappedResolve = (params) => {
        clearTimeout(timer);
        resolve(params);
      };
      const listeners = this.events.get(method) ?? [];
      listeners.push(wrappedResolve);
      this.events.set(method, listeners);
    });
  }
}

async function createPage(width, height) {
  const page = await fetchJson(
    `http://127.0.0.1:${port}/json/new?about:blank`,
    { method: 'PUT' }
  );
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await cdp.send('Emulation.setUserAgentOverride', {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const loaded = cdp.waitFor('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
  await loaded;
  await sleep(700);
  return cdp;
}

async function screenshot(cdp, name) {
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(new URL(name, outputDir), Buffer.from(result.data, 'base64'));
}

async function clickByHeading(cdp, text) {
  await cdp.send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `
      (async () => {
        const target = Array.from(document.querySelectorAll('h3'))
          .find((el) => el.textContent.trim() === ${JSON.stringify(text)});
        if (!target) throw new Error('heading not found');
        target.scrollIntoView({ block: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 250));
        target.click();
        await new Promise((resolve) => setTimeout(resolve, 700));
      })()
    `,
  });
}

async function clickPreviewCenter(cdp) {
  await cdp.send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `
      (async () => {
        const modal = document.querySelector('[class*="max-w-6xl"]');
        const target =
          modal?.querySelector('[class*="cursor-pointer"][class*="shadow-xl"]') ??
          modal?.querySelector('[class*="cursor-pointer"]') ??
          modal;
        if (!target) throw new Error('preview target not found');
        target.click();
        await new Promise((resolve) => setTimeout(resolve, 700));
      })()
    `,
  });
}

try {
  await waitForChrome();

  const home390 = await createPage(390, 844);
  await screenshot(home390, 'mobile-390-home-after.png');

  const home360 = await createPage(360, 740);
  await screenshot(home360, 'small-mobile-360-home-after.png');

  const modal = await createPage(390, 844);
  await clickByHeading(modal, 'Swifty-law');
  await screenshot(modal, 'mobile-390-swifty-modal-top-after.png');
  await modal.send('Runtime.evaluate', {
    awaitPromise: true,
    expression: `
      (async () => {
        const scrollBox = document.querySelector('[class*="max-w-6xl"]');
        scrollBox.scrollTop = 520;
        await new Promise((resolve) => setTimeout(resolve, 300));
      })()
    `,
  });
  await screenshot(modal, 'mobile-390-swifty-modal-scrolled-after.png');

  const presentation = await createPage(360, 740);
  await clickByHeading(presentation, 'Easy Contract Viewer');
  await clickPreviewCenter(presentation);
  await screenshot(presentation, 'small-mobile-360-easy-presentation-after.png');
} finally {
  chrome.kill('SIGTERM');
  await sleep(500);
  await rm(userDataDir, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 200,
  }).catch(() => {});
}
