import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartItemPage extends BasePage{
    private readonly _name: Locator;
    private readonly _price: Locator;
    private readonly _image: Locator;
    private readonly removeBtn: Locator; 
    private readonly totalPrice: Locator;
    private readonly _quantity: Locator;
    
    constructor(page: Page, index: number) {
        super(page);
        this._name = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//a[@class='ajaxcart__product-name h4'])[" + (index+1) + "]");
        this._price = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//div[@class='grid__item one-half text-right cart_prices'])["+ (index * 2 + 1) +"]");
        this._image = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//a[@class='ajaxcart__product-image cart_image'])[" + (index + 1) + "]");
        this.removeBtn = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//a[@title='Xóa'])[" + (index + 1) + "]");
        this.totalPrice = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//div[@class='grid__item one-half text-right cart_prices'])[" + (index * 2 + 2) + "]");
        this._quantity = page.locator("(//div[@class='CartPageContainer']//div[@class='ajaxcart__product cart_product']//input[@class='ajaxcart__qty-num number-sidebar'])");
    }

    async getImage() { await this._image.getAttribute("src"); }
    async getName() { await this._name.textContent(); }
    async getPrice() {
        const price = (await this._price.textContent())?.replace(/[^\d]/g, "") ?? "0";
        return Number(price);
    }
    async removeCart() { await this.removeBtn.click(); }
    async getTotalPrice() {
        const price = (await this.totalPrice.textContent())?.replace(/[^\d]/g, "") ?? "0";
        return Number(price);
    }
    async getQuantity() {
        await this._quantity.waitFor({ state: "visible" });
        const quantity = await this._quantity.inputValue(); // dung inputValue  vi nam trong the input
        return quantity ? Number(quantity) : 0;
    }
}