/**
 * Extracts LeetCode session cookies via browser login.
 *
 * Usage:
 *   npx playwright install chromium   # first time only
 *   npx ts-node scripts/extract-cookies.ts [output-path]
 *
 * Default output: ./leetcode-cookies.json
 */

import { chromium } from 'playwright';
import { writeFileSync, chmodSync } from 'fs';
import { resolve } from 'path';

const LOGIN_URL = 'https://leetcode.com/accounts/login/';
const COOKIE_NAMES = ['LEETCODE_SESSION', 'csrftoken', 'cf_clearance'];
const POLL_INTERVAL_MS = 1000;
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

async function extractCookies(outputPath: string): Promise<void> {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(LOGIN_URL);
  console.log('\n  Log in to LeetCode in the browser window.');
  console.log('  The script will detect your session automatically.\n');

  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT_MS) {
    const cookies = await context.cookies('https://leetcode.com');
    const session = cookies.find((c) => c.name === 'LEETCODE_SESSION');

    if (session) {
      const extracted: Record<string, string> = {};
      for (const cookie of cookies) {
        if (COOKIE_NAMES.includes(cookie.name)) {
          extracted[cookie.name] = cookie.value;
        }
      }

      // Add metadata
      const sessionExpiry = new Date(session.expires * 1000).toISOString();
      const payload = { ...extracted, expires_at: sessionExpiry };

      const absPath = resolve(outputPath);
      writeFileSync(absPath, JSON.stringify(payload, null, 2) + '\n');
      chmodSync(absPath, 0o600);

      console.log(`Cookies saved to ${absPath} (permissions: 600)`);
      console.log(`Session expires: ${sessionExpiry}`);
      await browser.close();
      return;
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  await browser.close();
  console.error('Timed out waiting for login (5 minutes). No cookies saved.');
  process.exit(1);
}

const outputPath = process.argv[2] || './leetcode-cookies.json';
extractCookies(outputPath);
