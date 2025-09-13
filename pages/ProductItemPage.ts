import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductItemPage extends BasePage {
    private readonly addToCartBtn: Locator;
    private readonly _image: Locator;
    private readonly _name: Locator;
    private readonly _price: Locator;
    private readonly cartIcon: Locator;
    private readonly _quantity: Locator;
    private readonly increase: Locator;
    private readonly decrease: Locator;

    constructor(page: Page) {
        super(page);
        this._image = page.locator("//a[@class='swiper-slide swiper-slide-active']//img[@class='img-responsive mx-auto d-block swiper-lazy swiper-lazy-loaded']");
        this._name = page.locator("//h1[@class='title-product']");
        this._price = page.locator("//div[@class='price-box clearfix']");
        this.addToCartBtn = page.locator("//div[@class='btn-mua button_actions clearfix']");
        this.cartIcon = page.locator("//span[@class='count_item count_item_pr']");
        this._quantity = page.locator("#qtym");
        this.increase = page.locator("//button[@class='btn_num num_2 button button_qty']");
        this.decrease = page.locator("//button[@class='btn_num num_1 button button_qty']");
    }
    
    async getImage() { await this._image.getAttribute("src"); }
    async getName() {
        await this._name.waitFor({ state: "visible" });
        await this._name.textContent();
    }
    async getPrice() {
        const price = (await this._price.textContent())?.replace(/[^\d]/g, "") ?? "0";
        return Number(price);
    }
    async clickAddToCart() { await this.addToCartBtn.click(); }
    async getCartCount() {
        await this.cartIcon.waitFor({ state: "visible" });
        const count = await this.cartIcon.textContent();
        return count ? Number(count) : 0;
    }
    async clickIncrease() { await this.increase.click(); }
    async clickDecrease() { await this.decrease.click(); }
    async getQuantity() {
        await this._quantity.waitFor({ state: "visible" });
        const quantity = await this._quantity.inputValue(); // dung inputValue  vi nam trong the input
        return quantity ? Number(quantity) : 0;
    }
}