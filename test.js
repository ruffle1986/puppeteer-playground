const p = require('puppeteer');
const assert = require('assert');
const url = 'http://localhost:8082';

(async () => {

  let browser;
  let page;
  beforeEach(async () => {
    try {
      browser = await p.launch(process.env.DEBUG ? {
        headless: true,
        slowMo: 100,
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
      } : undefined);
      page = await browser.newPage();
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(async () => {
    if (!process.env.DEBUG) {
      await browser.close();
    }
  });

  describe('root', async () => {
    test('click', async () => {
      await page.goto(url);
      await page.click('.my-button');
      const actual = await page.evaluate(() => document.querySelector('.my-message').textContent);
      assert.equal(actual, 'Peace!');
    });
    test('focus', async () => {

      const getActual = async () => {
        return await page.evaluate(() => document.querySelector('.my-message').textContent);
      };

      await page.goto(url);
      const input = await page.$('input[type="text"]');
      assert.equal(await getActual(), 'None');
      await input.focus();
      assert.equal(await getActual(), 'Focused!');
      await page.click('body');
      assert.equal(await getActual(), 'None');
    });
  });

})();

