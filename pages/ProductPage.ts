import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
    [x: string]: any;
    private readonly _image: Locator;
    private readonly _name: Locator;
    private readonly _price: Locator;

    constructor(page: Page) {
        super(page);
        this._image = page.locator("//div[@class='swiper_feature swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events']//a[@class='product_overlay_action']");
        this._name = page.locator("//div[@class='swiper_feature swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events']//h3[@class='product-name']");
        this._price = page.locator("//div[@class='swiper_feature swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events']//div[@class='price-box']");
    }
    async getImage() { await this._image.getAttribute("href"); }
    async getName() { await this._name.textContent(); }
    async getPrice() {
        const price = (await this._price.textContent())?.replace(/[^\d]/g, "") ?? "0";
        return Number(price);
    }

    async clickProduct(index: number) {
        const item = this._image.nth(index);
        await item.scrollIntoViewIfNeeded();
        const href = await item.getAttribute("href");// lay duong dan sp
        if (href) {
            await this.page.goto(href);// dieu huong trang chi tiet sp
        } else {
            throw new Error(`Không tìm thấy href cho product index: ${index}`);
        }
    }
}