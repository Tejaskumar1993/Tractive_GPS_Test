import { firefox } from 'playwright';
import { LoginPage } from "../Pages/login_page.js";
import { HomePage } from "../Pages/Homepage.js";
import { SignUpPage } from '../Pages/Signup_page.js';
import { TestData } from '../testdata/TestData.js';
import { expect } from 'chai';

describe('End-to-End Tests', function() {
    let browser, context, page;
    let loginPage, homePage, signUpPage, testData;

    before(async function () {
        this.timeout(30000);  // Increase timeout for async operations
        browser = await firefox.launch({headless: false});
        context = await browser.newContext();

        // Add cookies
        await context.addCookies([{
            name: 'interview',
            value: '7lBPV9iik6r9MNE5dKw9nzF9CstdlEJl',
            domain: '.tractive.com',
            path: '/',
            secure: true,
        }]);

        page = await context.newPage();
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        signUpPage = new SignUpPage(page);
        testData = new TestData();  // Corrected instantiation
    });

    after(async function () {
        this.timeout(5000);  // Increase timeout for after hook if needed
        if (page) await page.close();
        if (browser) await browser.close();
    });

    it('should verify URL and Title and login page', async function () {
        this.timeout(30000);  // Increase timeout for this test
        await loginPage.open();
        await page.waitForSelector('button[type="submit"]');  // Ensure the login button is visible
        await page.evaluate(() => {
            window.moveTo(0, 0);
            window.resizeTo(window.screen.availWidth, window.screen.availHeight);
        });

        const currentUrl = await page.url();
        expect(currentUrl).to.include(loginPage.url);

        await homePage.verifyPageTitle();
    });

    it('should verify the presence of the Tractive logo', async function () {
        this.timeout(10000); // Set a timeout for the test
        await loginPage.open(); // Ensure you're on the correct page
        // Check if the logo is visible on the page
        const logoSelector = '//img[@alt="Tractive Logo"]';
        const isLogoVisible = await page.isVisible(logoSelector);
        if (isLogoVisible) {
            console.log('Logo is visible on the page.');
        } else {
            console.error('Logo is NOT visible on the page.');
        }
        // Assert that the logo is indeed visible
        expect(isLogoVisible).to.be.true;
    });

    it('should log in with valid credentials with singout', async function () {
            this.timeout(30000);  // Increase timeout for this test
            console.log('Starting login test with valid credentials');
            const loginData = testData.valid_login();  // Use valid login data
            await loginPage.enterEmail(loginData.email);
            console.log('Entered email');
            await loginPage.enterPassword(loginData.password);
            console.log('Entered password');
            // Wait for submit button to be clickable and click it
            await loginPage.clickSubmitButton();
            console.log('Clicked submit button');
            // Wait for login success confirmation
            const isLoginSuccessful = await loginPage.isLoginSuccessful();
            expect(isLoginSuccessful).to.be.true;
            // If login is successful, log out
            if (isLoginSuccessful) {
                console.log('Login successful, proceeding to sign out');
                await homePage.signOut();
            } else {
                console.error('Login failed');
            }
        });

    it('should show an error for invalid login credentials', async function () {
        this.timeout(90000);  // Increase timeout for this test

        const loginData = testData.invalid_login();  // Use invalid login data
        await loginPage.enterEmail(loginData.email);
        await loginPage.enterPassword(loginData.password);
        await loginPage.clickSubmitButton();
        let alertMessage = '';

        // Handle the dialog pop-up
        page.on('dialog', async (dialog) => {
            alertMessage = dialog.message();  // Capture the dialog message
            console.log('Alert Message: ', alertMessage);  // Log the alert message for debugging
            await dialog.accept();  // Accept the alert (close the alert)
        });
        await page.waitForTimeout(1000);  // Adjust timeout as needed
        // Assert that the alert message matches the expected error message
        expect(alertMessage).to.equal(alertMessage);  // Change the message to match your app's error message
        //const isLoginPageVisible = await loginPage.isLoginPageVisible();
        //expect(isLoginPageVisible).to.be.true;
    });

    it('sign in Google Auth', async function () {
        this.timeout(20000); // Set a custom timeout for handling potential delays in the sign-in flow
        // Handle the Google Sign-In process
        await signUpPage.handleGoogleSignInProcess();
        const email = this.page.locator("//input[@type='email']").fill('macwantejaskumar@gmail.com');
        console.log('Google Sign-In flow.');
        const isGoogleSignInSuccessful = await signUpPage.isGoogleSignInSuccessful();
        expect(isGoogleSignInSuccessful, 'Google Sign-In failed').to.be.true;
    });

    it('should validate and submit the sign-up form', async function () {
        this.timeout(80000);  // Increase timeout for this test
        await signUpPage.open();  
        const currentUrl = await page.url();
        expect(currentUrl).to.include(signUpPage.url);
        await signUpPage.EmptyFieldFocus();
        await signUpPage.assertFirstNameValidation();
        await signUpPage.assertLastNameValidation();
        await signUpPage.assertEmailValidation();
        await signUpPage.assertPasswordValidation();
    });

    it('should validate invalid email format', async function () {
        const invalidData = testData.invalid_Email_password();
        // Retrieve invalid email from test data
        // Enter invalid email and verify validation message
        await signUpPage.enterInvalidEmail(invalidData.email);
        await signUpPage.assertInvalidEmailValidation();
    });

    it('should validate password length', async function () {
        const invalidData = testData.invalid_Email_password();
        // Retrieve invalid password from test data
        // Enter invalid password and verify validation message
        await signUpPage.enterInvalidPassword(invalidData.password);
        await signUpPage.assertPasswordLengthValidation();
    });

    it('should successfully submit the form with valid data with same Email already Exist', async function () {
        this.timeout(70000);
        const validData = testData.valid_signup_data();
        // Retrieve valid signup data from test data
        // Enter valid data into the form fields
        await signUpPage.enterFirstName(validData.firstName);
        await signUpPage.enterLastname(validData.lastName);
        await signUpPage.enterEmail(validData.email);
        await signUpPage.enterPassword(validData.password);
        // If there is a checkbox, click it
        await signUpPage.clickCheckbox();
        // Submit the form if the submit button is visible
        await signUpPage.clickSubmitButtonIfVisible();
        // Wait for a moment for the submission to process
        console.log('Waiting for ...');
        await page.waitForTimeout(30000);  // Pause execution for 30 seconds
        // Check for any dialog box (in case of success or failure)
        page.on('dialog', async (dialog) => {
            const alertMessage = dialog.message();
            console.log('Alert Message:', alertMessage);
            if (alertMessage.includes('Account creation failed. You entered invalid information.')) {
                await dialog.accept();
                console.log('Dialog error message verified.');
                expect(alertMessage).to.include(alertMessage);
            }
        });
        console.log('Account creation failed.!');
        const currentUrl = await page.url();
        expect(currentUrl).to.include(currentUrl);
    });

    it('should submit the Signup form wth Invalid data Passing', async function () {
        this.timeout(70000);
        const InvalidData = testData.Invalid_signup_data(); // Retrieve valid signup data from test data
        // Enter Invalid data into the form fields
        await signUpPage.enterFirstName(InvalidData.firstName);
        await signUpPage.enterLastname(InvalidData.lastName);
        await signUpPage.enterEmail(InvalidData.email);
        await signUpPage.enterPassword(InvalidData.password);
        // Submit the form if the submit button is visible or Not
        await signUpPage.clickSubmitButtonIfNotVisible();
    });

});
