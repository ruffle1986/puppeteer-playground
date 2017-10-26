const p = require('puppeteer');
const assert = require('assert');
const url = 'http://localhost:8082';

(async () => {

  let browser;
  let page;
  beforeAll(async () => {
    try {
      browser = await p.launch();
      page = await browser.newPage();
    } catch (e) {
      console.error(e);
    }
  });

  afterAll(() => {
    browser.close();
  });

  describe('root', () => {
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

