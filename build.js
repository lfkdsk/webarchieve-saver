const puppeteer = require('puppeteer');
const fs = require('fs');

function generateNameFromUrl(url) {
    // Replace useless chareacters with UNDERSCORE
    uniqueName = url.replace("://", "_").replace(".", "_").replace("/", "_");
    // Replace last UNDERSCORE with a DOT
    uniqueName = uniqueName.substring(0, uniqueName.lastIndexOf('_'))
        + "." + uniqueName.substring(uniqueName.lastIndexOf('_') + 1, uniqueName.length);
    return uniqueName;
}


(async () => {
    const path = require('path')
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({
        width: 2560,
        height: 1440,
    });
    const all = JSON.parse(fs.readFileSync('./README.json'));
    console.log(all)
    for (var i of all) {
        await page.goto(
            i,
            { waitUntil: 'networkidle0' },
        );
        const newName = generateNameFromUrl(i);
        await page.screenshot({ path: path.resolve(newName + '.png'), fullPage: true});
        await page.waitForTimeout(2000);
        await page.goto(
            'https://web.archive.org/save/',
            { waitUntil: 'domcontentloaded' }
        );
        await page.focus("#web-save-url-input");
        await page.keyboard.type(i);
        await page.click("input[value='SAVE PAGE']");
        await page.waitForTimeout(3000);
    }

    console.log('Complete');
    await browser.close();
})();