import { test as base, expect } from '@playwright/test';
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

const test = base.extend<{ loginPage: LoginPage, homePage: HomePage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.clickButtonAcount();
        await loginPage.clickLoginMenuItem();
        await loginPage.inputUserName("phammau0502@gmail.com");
        await loginPage.inputPassword("05021997");
        await loginPage.clickButtonLogin();
        await use(loginPage);
    },
    homePage: async ({ loginPage, page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
});

// test 11: dang xuat sau khi dang nhap thanh cong
test('logoutAfterSuccessfulLogin', async ({ loginPage, homePage, page }) => {
    await homePage.clickButtonAcount();
    await homePage.clickLogoutMenuItem();
    expect(await loginPage.isDisplayed()).toBeTruthy();
})

// test 12: doi pass thanh cong
test('checkChangePasswordSuccess', async ({ homePage, page }) => {
    await homePage.clickChangePassword();
    await homePage.inputOldPassword("05021997");
    await homePage.inputNewPassword("05021997");
    await homePage.inputConfirmPassword("05021997");
    await homePage.clickButtonChangePassword();
    expect(await homePage.checkSuccess()).toBeTruthy();
})

// test 13: doi pass  voi pass moi sai
test('checkChangeWithIncorrectPassword', async ({ homePage, page }) => {
    await homePage.clickChangePassword();
    await homePage.inputOldPassword("521997");
    await homePage.inputNewPassword("05021997");
    await homePage.inputConfirmPassword("05021997");
    await homePage.clickButtonChangePassword();
    expect(await homePage.getError(),"Mật khẩu không đúng");
})

// test 14: doi pass voi pass qua ngan
test('checkChangeWithPasswordLength', async ({ homePage, page }) => {
    await homePage.clickChangePassword();
    await homePage.inputOldPassword("05021997");
    await homePage.inputNewPassword("123");
    await homePage.inputConfirmPassword("123");
    await homePage.clickButtonChangePassword();
    expect(await homePage.getError(), "Mật khẩu mới dài từ 6 đến 50 ký tự");
})

// test 15: doi pass voi xac nhan pass khong khop
test('checkPasswordMismatch', async ({ homePage, page }) => {
    await homePage.clickChangePassword();
    await homePage.inputOldPassword("05021997");
    await homePage.inputNewPassword("12356");
    await homePage.inputConfirmPassword("abc");
    await homePage.clickButtonChangePassword();
    expect(await homePage.getErrorConfirm(), "Xác nhận mật khẩu không khớp");
})