import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Hp/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5174');await page.evaluate(()=>document.fonts.ready);mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/technology-desktop.png'});
for(const width of [320,375,430,768,1024,1440]){await page.setViewportSize({width,height:1000});console.log(width,await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className).slice(0,15)})));}
await page.setViewportSize({width:375,height:1000});await page.screenshot({path:'test-results/technology-mobile.png'});console.log('errors',errors);await browser.close();
