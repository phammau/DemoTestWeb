import { test as base, expect} from '@playwright/test';
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

const test = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },
});

// test 1: dang nhap thanh cong
test('loginSuccess', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.inputUserName("phammau0502@gmail.com");
    await loginPage.inputPassword("05021997");
    await loginPage.clickButtonLogin();
    const homePage = new HomePage(page);
    expect(await homePage.isDisplayed()).toBeTruthy();
})

// test 2: dang nhap voi pass sai
test('loginWithIncorrectPassword', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.inputUserName("phammau0502@gmail.com");
    await loginPage.inputPassword("1111");
    await loginPage.clickButtonLogin();
    expect(await loginPage.getError(), "Thông tin đăng nhập không chính xác.");
})

// test 3: dang nhap voi user sai
test('loginWithIncorrectUser', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.inputUserName("ABC");
    await loginPage.inputPassword("05021997");
    await loginPage.clickButtonLogin();
    expect(await loginPage.getError(), "Thông tin đăng nhập không chính xác.");
})

// test 4: dang nhap voi pass va user trong
test('loginWithEmptyEmailAndPassword', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.clickButtonLogin();
    const message = await page.$eval('#customer_password', el => (el as HTMLInputElement).validationMessage);
    expect(message).toContain("Please fill out this field");
})

// test 5: dang nhap voi pass trong
test('loginWithEmptyPassword', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.inputUserName("phammau0502@gmail.com");
    await loginPage.clickButtonLogin();
    const message = await page.$eval('#customer_password', el => (el as HTMLInputElement).validationMessage);
    expect(message).toContain("Please fill out this field");
})

// test 6: dang nhap voi user trong
test('loginWithEmptyEmail', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.inputPassword("05021997");
    await loginPage.clickButtonLogin();
    const message = await page.$eval('#customer_email', el => (el as HTMLInputElement).validationMessage);
    expect(message).toContain("Please fill out this field");
})

// test 7: kiem tra trang thai quen pass thanh cong
test('checkForgotPasswordSuccess', async ({ loginPage, page }) => {
  await page.route('**/api/forgot-password', (route) => {
    const fakeResponse = {
      success: true,
      newPassword: '123456' // mat khau gia tra ve
    };
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakeResponse)
    });
  });

  await loginPage.clickButtonAcount();
  await loginPage.clickLoginMenuItem();
  await loginPage.clickForgetPassword();
  await loginPage.inputRecoverEmail('phammau0502@gmail.com');
  await loginPage.clickButtonRetrievePassword();
  const passwordValue = await loginPage.getPasswordFieldValue();
  expect(passwordValue).not.toBe('');
  expect(passwordValue).toBe('123456');
});

// test 8: lay lai pass voi email sai
test('forgotPasswordEmailNotFound', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.clickForgetPassword();
    await loginPage.inputRecoverEmail('phammau123456@gmail.com');
    await loginPage.clickButtonRetrievePassword();
    await loginPage.clickForgetPassword();
    expect(await loginPage.getEmailNotFoundMessage(), "Không tìm thấy tài khoản tương ứng với email này.");
})

// test 9: lay lai pass voi email trong
test('forgotPasswordEmailEmpty', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.clickForgetPassword();
    await loginPage.clickButtonRetrievePassword();
    const message = await page.$eval('#recover-email', el => (el as HTMLInputElement).validationMessage);
    expect(message, "Please fill out this field");
})

// test 10: lay lai pass voi email sai dinh dang
test('checkRecoverWithInvalidEmail', async ({ loginPage, page }) => {
    await loginPage.clickButtonAcount();
    await loginPage.clickLoginMenuItem();
    await loginPage.clickForgetPassword();
    await loginPage.clickButtonRetrievePassword();
     await loginPage.inputRecoverEmail('phammau0502gmail.com');
    const message = await page.$eval('#recover-email', el => (el as HTMLInputElement).validationMessage);
    expect(message, "Please include an '@' in the email address. 'phammau0502gmail.com' is missing an '@'.");
})