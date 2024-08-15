// puppeteer-script.js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://blsitalypakistan.com/account/login");

  // Auto-Login
  await page.type("#username", "your-username");
  await page.type("#password", "your-password");
  await page.click("#login-button");
  await page.waitForNavigation();

  // Auto Form Fill, Page Refresh, etc.
  // Implement additional bot logic here

  await browser.close();
})();
