// /pages/HomePage.js
import * as chai from "chai";
import {remote} from "webdriverio";

export class HomePage {
    constructor(page) {
        this.page = page;
        this.Manage_page_url ="https://my-stage.tractive.com/#/settings/user-profile/profile";
        this.pageTitleOptions = [
            'Welcome to the Tractive Web App | Activate Tracker | Sign in',
            'Tractive GPS - Sign In - Find your lost dog and cat',
        ];
        this.Manage_page_title ="Tractive GPS - Login Details - Find your lost dog and cat";
        this.signOutButton = "//div[@class='sign-out-container']//tgps-sidebar-action-item[@class='ng-scope ng-isolate-scope']";
        this.checkBox_selectDevice = "//div[@class='tcommon-check__mask']";
        this.signoutAction = "//button[@class='tcommon-button tcommon-button--primary']";
        this.signOut_btn = "//tcommon-button[@class='ng-scope ng-isolate-scope']//button[@class='tcommon-button tcommon-button--primary']";
        this.userProfile ="//tcommon-tile[@ui-sref='^.userProfile.profile']";
        this.loginDetails = "//li[normalize-space()='Login Details']";
        this.EditEmailId="//span[@ng-click='tgpsAccountPage.emailEditModeActive = true;tgpsAccountPage.accountForm.$setDirty();']";
        this.EditPassword ="//span[@ng-click='tgpsAccountPage.passwordEditModeActive = true;tgpsAccountPage.accountForm.$setDirty();']" ;
    }

    async setCookies() {
        await this.page.context().addCookies([{
            name: 'interview',
            value: '7lBPV9iik6r9MNE5dKw9nzF9CstdlEJl',
            domain: '.tractive.com',
            path: '/'
        }]);
        console.log('Cookies set successfully.');
    }

    async navigateToHomePage() {
        try {
            await this.page.goto('https://my-stage.tractive.com/#/', { timeout: 45000 });
            await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
            console.log('Navigated to home page successfully.');
        } catch (error) {
            console.error('Error navigating to home page:', error.message);
            throw error;
        }
    }
    async verifyUrl_ManagePage() {
        const currentUrl = await browser.getUrl(); // Get the current URL
        chai.assert.strictEqual(
            currentUrl,
            this.Manage_page_url,
            'The current URL does not match the expected URL.'
        );
    }

    async verifyManagePageTitle() {
        try {
            this.timeout(30000);
            const title = await this.page.title();
            console.log('Actual Page Title:', title);

            const isTitleValid = this.Manage_page_title.some(expectedTitle =>
                title.includes(expectedTitle)
            );

            if (!isTitleValid) {
                throw new Error(`Expected page title to include one of ${JSON.stringify(this.Manage_page_title)}, but found "${title}"`);
            }

            console.log('Page title verified successfully.');
        } catch (error) {
            console.error('Error verifying page title:', error.message);
            throw error;
        }
    }
    async verifyPageTitle() {
        try {
            this.timeout(30000);
            const title = await this.page.title();
            console.log('Actual Page Title:', title);

            const isTitleValid = this.pageTitleOptions.some(expectedTitle =>
                title.includes(expectedTitle)
            );

            if (!isTitleValid) {
                throw new Error(`Expected page title to include one of ${JSON.stringify(this.pageTitleOptions)}, but found "${title}"`);
            }

            console.log('Page title verified successfully.');
        } catch (error) {
            console.error('Error verifying page title:', error.message);
            throw error;
        }
    }


    async signOut() {
        try {
            console.log('Attempting to sign out...');
            // Wait for the "Sign Out" button to be visible
            await this.page. waitForSelector(this.signOutButton, { timeout: 15000 });

            // Click the "Sign Out" button
            await this.page.click(this.signOutButton);
            await this.page.click(this.checkBox_selectDevice);
            await this.page.click(this.signoutAction);
            await this.page.click(this.signOut_btn);

            // Wait for the sign-out process to complete (e.g., navigation to sign-in page)
            await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
            console.log('Successfully signed out.');
        } catch (error) {
            console.error('Error during sign out:', error.message);
            throw error;
        }
    }
    async clickUserProfile() {
        try {
            console.log('Clicking on the user profile...');
            await this.page.waitForSelector(this.userProfile, {timeout: 15000});
            await this.page.click(this.userProfile);
            console.log('User profile clicked successfully.');
        } catch (error) {
            console.error('Error clicking on user profile:', error.message);
            throw error;
        }
    }
    async LoginDetails() {
        try {
            console.log('Clicking on the user profile...');
            await this.page.waitForSelector(this.loginDetails
                , {timeout: 15000});
            await this.page.click(this.loginDetails);

        } catch (error) {
            console.error('Error clicking on user profile:', error.message);
            throw error;
        }
    }

    timeout(number) {
        
    }
}
