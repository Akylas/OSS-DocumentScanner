import { AppiumDriver, createDriver, SearchOptions, nsCapabilities } from 'nativescript-dev-appium';
import { assert } from 'chai';
const addContext = require('mochawesome/addContext');

describe('main test scenario', () => {
    let driver: AppiumDriver;

    before(async function() {
        try {
            nsCapabilities.testReporter.context = this;
            driver = await createDriver();
            console.log('before driver!');
        } catch (e) {
            console.log('before error', e);
        }
    });
    after(async function() {
        await driver.quit();
        console.log('Quit driver!');
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it('displays the pairing screen', async () => {
        const button = await driver.findElementByAccessibilityId('pair');
        // Image verification
        // await driver.driver.sleep(2500) // animation
        assert.isTrue(!!button);
    });

    /*
     *  Login
     */
    describe('go home', async () => {
        it('click to go home', async () => {
            const logoImg = await driver.findElementByAccessibilityId('pairingLogo');
            logoImg.hold(1000);
            await driver.driver.sleep(1000); // animation
            // check that we are home!
            const homeGrid = await driver.findElementByAccessibilityId('homeGrid');
            assert.isTrue(!!homeGrid);
        });
    });

    // const styleTypes = {
    //     "inline": "styleInline",
    //     "page": "stylePage",
    //     "app": "styleApp"
    // };

    // for (let styleType in styleTypes) {
    //     it(`should find an element with ${styleType} style applied`, async function () {
    //         const element = await driver.findElementByText(styleTypes[styleType]);
    //         driver.imageHelper.options.keepOriginalImageSize = false;
    //         driver.imageHelper.options.isDeviceSpecific = false;
    //         const result = await driver.compareElement(element, "style");
    //         assert.isTrue(result);
    //     });
    // }
});
