import { test as base, expect} from '@playwright/test';
import { LoginPage } from "../pages/LoginPage";
import { ProductItemPage } from '../pages/ProductItemPage';
import { CartPage } from '../pages/CartPage';

const test = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },
});
// Backend khong ho tro nhieu user test, ep cac test nay chay theo thu tu, tranh conflict:
test.describe.serial('CartTest', () => {
    
// test 16 : them san pham vao gio hang
test('addToCart', async ({ loginPage, page }) => {
    let expectCount = 0;
    const products = await loginPage.getProductItems();
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        await item.clickProduct(i);
        const productItemPage = new ProductItemPage(page);
        await productItemPage.clickAddToCart();
        expectCount++;
        await page.waitForTimeout(300);
        expect(await productItemPage.getCartCount()).toBe(expectCount);
        await loginPage.clickHome();
    }
})

// test 17 : xoa san pham khoi gio hang
test('removeCart', async ({ loginPage, page }) => {
    let expectCount = 0;
    const products = await loginPage.getProductItems();
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        await item.clickProduct(i);
        const productItemPage = new ProductItemPage(page);
        await productItemPage.clickAddToCart();
        expectCount++;
        await page.goBack();
    }
    const cartPage = new CartPage(page);
    await cartPage.clickCart();
    const carts = await cartPage.getCartItems();
    for (let i = 0; i < carts.length; i++) {
        const carts = await cartPage.getCartItems();
        await carts[0].removeCart();
        expectCount--;
        expect(await cartPage.getCartCount()).toEqual(expectCount);
    }
})

// test 18 : kiem tra thong tin san pham trong gio hang
test('checkInformationProduct', async ({ loginPage, page }) => { 
    const products = await loginPage.getProductItems();
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        await item.clickProduct(i);
        const productItemPage = new ProductItemPage(page);
        const expectedName = await productItemPage.getName();
        const expectedPrice = await productItemPage.getPrice();
        const expectedImage = await productItemPage.getImage();

        await productItemPage.clickAddToCart();
        await page.waitForTimeout(1000);
        const cartPage = new CartPage(page);
        await cartPage.clickCart();
        await page.waitForTimeout(1000);
        const carts = await cartPage.getCartItems();

        const actualName = await carts[0].getName();
        const actualPrice = await carts[0].getPrice();
        const actualImage = await carts[0].getImage();

        expect(expectedName).toBe(actualName);
        expect(expectedPrice).toBe(actualPrice);
        expect(expectedImage).toBe(actualImage);

        await carts[0].removeCart();
        await loginPage.clickHome();
    }
})

// test 19 : tang so luong san pham 
test('checkIncreaseQuantityProduct', async ({ loginPage, page }) => { 
    const products = await loginPage.getProductItems();
    let quantity = 1;
    for (let i = 0; i < products.length; i++) {
        const element = products[i];
        await element.clickProduct(i);
        const productItemPage = new ProductItemPage(page);
        expect(await productItemPage.getQuantity()).toBe(quantity);
        for (let i = 0; i < 5; i++) {
            await productItemPage.clickIncrease();
            quantity++;
        }
        expect(await productItemPage.getQuantity()).toBe(quantity);
        await page.goBack();
        quantity = 1;
    }
}) 

// test 20 : kiem tra tong gia tien
    test('checkTotalPrice', async ({ loginPage, page }) => {
        const products = await loginPage.getProductItems();
        for (let i = 0; i < products.length; i++) {
            const element = products[i];
            await element.clickProduct(i);
            const productItemPage = new ProductItemPage(page);
            await productItemPage.clickAddToCart();
            await page.waitForTimeout(500);
            const cartPage = new CartPage(page);
            await cartPage.clickCart();
            await page.waitForTimeout(1000);

            const carts = await cartPage.getCartItems();
            const unitPrice = await carts[0].getPrice();
            const totalPrice = await carts[0].getTotalPrice();
            const quantity = await carts[0].getQuantity();

            expect(totalPrice).toBe((unitPrice * quantity));
            await carts[0].removeCart();
            await loginPage.clickHome();
        }
    });
 })
