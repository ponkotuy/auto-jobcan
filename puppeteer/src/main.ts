import puppeteer, { PuppeteerLaunchOptions } from "puppeteer";

const EMAIL = "";

(async () => {
  const page = await launch();

  // top
  await Promise.all([
    page.click("span.google__span"),
    page.waitForNavigation({waitUntil: 'load'})
  ]);

  // google auth
  await page.type("#identifierId", EMAIL);
  const [element] = await page.$x("//span[contains(text(), '次へ')]");
  await element.focus();
  await page.keyboard.press('Enter');
})();

async function launch() {
  const settings: PuppeteerLaunchOptions = {
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1024,800', '--lang=ja']
  };
  const browser = await puppeteer.launch(settings);
  const page = (await browser.pages())[0];
  await Promise.all([
    page.goto("https://id.jobcan.jp/users/sign_in?app_key=atd&redirect_to=https://ssl.jobcan.jp/jbcoauth/callback&lang=ja"),
    page.waitForNavigation({waitUntil: 'load'}),
  ]);
  return page;
}
