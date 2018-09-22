const puppeteer = require('puppeteer');

var browser;
var page;

async function loginToAdmin() {
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
    await page.goto(process.env.ADMIN_URL);
    
    var emailInput = 'div.form-group > input[type="email"]';
    var passwordInput = 'div.form-group > input[type="password"]';
    await page.waitForSelector(emailInput);
    await page.type(emailInput, process.env.MIRROR_EMAIL);
    await page.type(passwordInput, process.env.MIRROR_PASSWORD);
    
    await page.click('button.btn-primary[type="submit"]');
    return await page.waitForNavigation();
}

async function resetLockout() {
    await page.goto(process.env.ADMIN_URL);
    var resetCheckbox = 'input[name="reset_login_fails"]';
    await page.waitForSelector(resetCheckbox);
    await page.click(resetCheckbox);
    await page.click('button.btn-save[type="submit"]');

    browser.close();
}

module.exports = {loginToAdmin: loginToAdmin, resetLockout: resetLockout};