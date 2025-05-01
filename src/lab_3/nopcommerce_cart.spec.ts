import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demo.nopcommerce.com/';
const USER_EMAIL = 'samibre121@gmail.com';
const USER_PASSWORD = 'lemmepasS1!';
const PRODUCT_URL = 'https://demo.nopcommerce.com/levis-511-jeans'; // $34.00
const PRODUCT_PRICE = 34.00;

// Define test cases based on the decision table (excluding coupon cases)
const testCases = [
  {
    rule: 3,
    description: 'Logged In, No Coupon, Cart >= $100',
    loggedIn: true,
    cartAmountTarget: 100, // Target >= 100
    expectedDiscountPercent: 5,
  },
  {
    rule: 4,
    description: 'Logged In, No Coupon, Cart < $100',
    loggedIn: true,
    cartAmountTarget: 50, // Target < 100
    expectedDiscountPercent: 0,
  },
  {
    rule: 7,
    description: 'Logged Out, No Coupon, Cart >= $100',
    loggedIn: false,
    cartAmountTarget: 100, // Target >= 100
    expectedDiscountPercent: 0,
  },
  {
    rule: 8,
    description: 'Logged Out, No Coupon, Cart < $100',
    loggedIn: false,
    cartAmountTarget: 50, // Target < 100
    expectedDiscountPercent: 0,
  },
];

test.describe('nopCommerce Cart - Decision Table Testing (No Coupon)', () => {

  // Function to add product(s) to meet cart total requirement
  async function setupCart(page, targetAmount) {
    await page.goto(PRODUCT_URL);
    const quantityInput = page.locator('#product_enteredQuantity_30');
    let quantity = 1;
    if (targetAmount >= 100) {
      quantity = Math.ceil(100 / PRODUCT_PRICE); // Calculate quantity needed for >= $100
    }
    await quantityInput.fill(quantity.toString());
    await page.locator('#add-to-cart-button-30').click();
    // Wait for the success notification bar to appear and disappear
    await expect(page.locator('#bar-notification')).toBeVisible();
    await expect(page.locator('#bar-notification')).toBeHidden({ timeout: 10000 });
  }

  // Function to perform login
  async function login(page) {
    await page.goto(`${BASE_URL}login`);
    await page.locator('#Email').fill(USER_EMAIL);
    await page.locator('#Password').fill(USER_PASSWORD);
    await page.locator('button:has-text("Log in")').click();
    await expect(page.locator('.ico-account')).toBeVisible(); // Wait for login confirmation
  }

  // Function to clear cart (best effort)
  async function clearCart(page) {
    await page.goto(`${BASE_URL}cart`);
    const removeCheckboxes = await page.locator('input[name="removefromcart"]').all();
    if (removeCheckboxes.length > 0) {
      for (const checkbox of removeCheckboxes) {
        await checkbox.check();
      }
      await page.locator('button[name="updatecart"]').click();
      await expect(page.locator('.order-summary-content')).toContainText('Your Shopping Cart is empty!');
    }
  }

  // Logout function
  async function logout(page) {
    // Check if logout link exists before clicking
    const logoutLink = page.locator('.ico-logout');
    if (await logoutLink.isVisible()) {
        await logoutLink.click();
        await expect(page.locator('.ico-login')).toBeVisible(); // Wait for logout confirmation
    }
  }

  // Run tests for each case defined above
  for (const tc of testCases) {
    test(`Rule ${tc.rule}: ${tc.description}`, async ({ page }) => {
      test.setTimeout(60000); // Increase timeout per test case

      // --- Setup Phase ---
      await page.goto(BASE_URL);
      // Ensure clean state: logout first, then clear cart
      await logout(page);
      await clearCart(page);

      if (tc.loggedIn) {
        await login(page);
      }

      await setupCart(page, tc.cartAmountTarget);

      // --- Action Phase ---
      await page.goto(`${BASE_URL}cart`);
      await expect(page.locator('.page-title h1')).toContainText('Shopping Cart');

      // --- Verification Phase ---
      // Get totals from the cart summary table
      const subTotalText = await page.locator('.cart-total .order-subtotal .value-summary').innerText();
      const orderTotalText = await page.locator('.cart-total .order-total .value-summary strong').innerText();

      // Clean and convert to numbers
      const subTotal = parseFloat(subTotalText.replace(/[^\d.-]/g, ''));
      const orderTotal = parseFloat(orderTotalText.replace(/[^\d.-]/g, ''));

      expect(subTotal).toBeGreaterThan(0); // Sanity check

      // Calculate actual discount amount and percentage
      const actualDiscountAmount = subTotal - orderTotal;
      const actualDiscountPercent = (actualDiscountAmount / subTotal) * 100;

      console.log(`Rule ${tc.rule}: Subtotal=${subTotal.toFixed(2)}, Order Total=${orderTotal.toFixed(2)}, Actual Discount=${actualDiscountAmount.toFixed(2)} (${actualDiscountPercent.toFixed(2)}%)`);

      // Assert the discount percentage (allow for small floating point differences)
      expect(actualDiscountPercent).toBeCloseTo(tc.expectedDiscountPercent, 1); // Check if close within 1 decimal place
    });
  }
});
