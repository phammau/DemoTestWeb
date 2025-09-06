import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartItemPage } from "./CartItemPage";

export class CartPage extends BasePage {
    private readonly cartItems: Locator;
    private readonly cartIcon: Locator;
    private readonly totalPrice: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator("//div[@class='CartPageContainer']//div[@class='ajaxcart__row']");
        this.cartIcon = page.locator("//div[@class='header-action-item header-action_cart']");
        this.totalPrice = page.locator("");
    }

    async getCartItems() {
        const elements = await this.cartItems.all();
        return elements.map((_, i) => new CartItemPage(this.page, i));
    }
    async getCartCount() {
        await this.cartIcon.waitFor({ state: "visible" });
        const text = await this.cartIcon.textContent();
        if (!text) return 0;
        const match = text.match(/\d+/); // lấy nhóm số đầu tiên
        return match ? Number(match[0]) : 0;
    }
    async clickCart() { await this.cartIcon.click(); }
}