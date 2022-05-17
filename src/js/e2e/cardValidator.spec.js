import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);


describe('CardValidator tests', () => {
    let browser = null;
    let page = null;
    let server = null;
    const baseURL = 'http://localhost:9000';

    beforeAll(async() => {
        server = fork(`${__dirname}/e2e.server.js`);
        await new Promise((resolve, reject) => {
            server.on('error', reject);
            server.on('message', (message) => {
                if(message === 'ok') {
                    resolve();
                }
            })
        })

        browser = await puppeteer.launch({
            headless: false,
            slowMo: 200,
        })

        page = await browser.newPage();
    })

    afterAll(async () => {
        await browser.close();
        server.kill();
    })

    test('Card is valid', async () => {
        await page.goto(baseURL);
        const validateBtn = await page.$('#validate');
        const input = await page.$('[data-cw-widget="input"]');
        await input.type('4960148480544151');
        await validateBtn.click();
        await page.waitForFunction(()=>{
            if( document.querySelector('.cw-widget_hitn').textContent === 'This card is valid' ) return true;
        });
    })

    test('Card is not valid', async () => {
        await page.goto(baseURL);
        const validateBtn = await page.$('#validate');
        const input = await page.$('[data-cw-widget="input"]');
        await input.type('5312372126540222');
        await validateBtn.click();
        await page.waitForFunction(()=>{
            if( document.querySelector('.cw-widget_hitn').textContent === 'This card is not valid' ) return true;
        });
    })

    test('Entered not only numbers', async () => {
        await page.goto(baseURL);
        const validateBtn = await page.$('#validate');
        const input = await page.$('[data-cw-widget="input"]');
        await input.type('3e629w1217g58343');
        await validateBtn.click();
        await page.waitForFunction(()=>{
            if( document.querySelector('.cw-widget_hitn').textContent === 'Please, enter only numbers' ) return true;
        });
    })
})