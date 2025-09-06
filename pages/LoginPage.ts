import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductPage } from "./ProductPage";

export class LoginPage extends BasePage {
    private readonly title: Locator;
    private readonly userName: Locator;
    private readonly passWord: Locator;
    private readonly loginBtn: Locator;
    private readonly forgetPassword: Locator;
    private readonly getPasswordBtn: Locator;
    private readonly acountBtn: Locator;
    private readonly loginMenuItem: Locator;
    private readonly error: Locator;
    private readonly recoverEmail: Locator;
    private readonly emailNotFoundMessage: Locator;
    private readonly products: Locator;
    private readonly home: Locator;
    
    constructor(page: Page) {
        super(page);   
        this.userName = page.locator("#customer_email");
        this.passWord = page.locator("#customer_password");
        this.title = page.locator("//a[@title='Sản Phẩm Bán Chạy']");
        this.loginBtn = page.locator("//input[@value='Đăng nhập']");
        this.acountBtn = page.locator("//a[@title='Tài khoản']");
        this.loginMenuItem = page.locator("//a[@title='Đăng nhập']");
        this.error = page.locator("//span[@style='color:red;']");
        this.forgetPassword = page.locator(".quenmk");
        this.recoverEmail = page.locator("#recover-email");
        this.getPasswordBtn = page.locator("//input[@value='Lấy lại mật khẩu']");
        this.emailNotFoundMessage = page.locator("//div[normalize-space(text())='Không tìm thấy tài khoản tương ứng với email này.']");
        this.products = page.locator("//div[@class='container']//div[@class='swiper_feature swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events']//form[@action='/cart/add']");
        this.home = page.locator("//a[@title='Trang Chủ']");
    }

    async goto() { await this.page.goto('/'); }
    async isDisplayed() {
        await this.title.scrollIntoViewIfNeeded();
        return await this.title.isVisible();
    }
    async inputUserName(name: string) { await this.userName.fill(name); }
    async inputPassword(pass: string) { await this.passWord.fill(pass); }
    async clickButtonLogin() { await this.loginBtn.click(); }
    async clickButtonAcount() { await this.acountBtn.click(); }
    async clickLoginMenuItem() { await this.loginMenuItem.click(); }
    async getError() { return (await this.error.textContent())?.trim(); }
    async clickForgetPassword() { await this.forgetPassword.click(); }
    async clickButtonRetrievePassword() { await this.getPasswordBtn.click(); }
    async inputRecoverEmail(email: string) { await this.recoverEmail.fill(email); }
    async getPasswordFieldValue() { await this.passWord.textContent(); }
    async getEmailNotFoundMessage() { return (await this.emailNotFoundMessage.textContent())?.trim(); }

    async getProductItems() {
        const elements = await this.products.all();
        return elements.map((_) => new ProductPage(this.page));
    }
    async clickHome() { await this.home.click(); }
}

