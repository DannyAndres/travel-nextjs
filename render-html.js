const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, '/coverage/lcov-report/index.html'));
    await page.screenshot({ path: path.join(__dirname, '/screenshot.png') });
    await browser.close();
}

run();