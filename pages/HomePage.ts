import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage{
    private readonly title: Locator;
    private readonly acountBtn: Locator;
    private readonly logoutMenuItem: Locator;
    private readonly changePassword: Locator;
    private readonly oldPassword: Locator;
    private readonly newPassword: Locator;
    private readonly confirmPassword: Locator;
    private readonly changePasswordBtn: Locator;
    private readonly changePasswordSuccess: Locator;
    private readonly error: Locator;
    private readonly errorConfirm: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.locator("//h5[text()='Trang tài khoản']");
        this.acountBtn = page.locator("//a[@aria-label='Tài khoản']");
        this.logoutMenuItem = page.locator("//a[@title='Đăng xuất']");
        this.changePassword = page.locator("//a[text()='Đổi mật khẩu']");
        this.oldPassword = page.locator("#OldPass");
        this.newPassword = page.locator("#changePass");
        this.confirmPassword = page.locator("#confirmPass");
        this.changePasswordBtn = page.locator("//button[text()='Đặt lại mật khẩu']");
        this.changePasswordSuccess = page.locator("//span[text()='Đổi password thành công']");
        this.error = page.locator("//span[@style='color:red;']");
        this.errorConfirm = page.locator("//span[normalize-space(text())='Xác nhận mật khẩu không khớp']");
    }

    async isDisplayed() { return await this.title.isVisible(); }
    async clickButtonAcount() { await this.acountBtn.click(); }
    async clickLogoutMenuItem() { await this.logoutMenuItem.click(); }
    async clickChangePassword() { await this.changePassword.click(); }
    async inputOldPassword(pass: string) { await this.oldPassword.fill(pass); }
    async inputNewPassword(pass: string) { await this.newPassword.fill(pass); }
    async inputConfirmPassword(pass: string) { await this.confirmPassword.fill(pass); }
    async clickButtonChangePassword() { await this.changePasswordBtn.click(); }
    async checkSuccess() { return await this.changePasswordSuccess.isVisible(); }
    async getError() { return (await this.error.textContent())?.trim(); }
    async getErrorConfirm() { return (await this.errorConfirm.textContent())?.trim(); }
}