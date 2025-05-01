import { test, expect } from '@playwright/test';

const BASE_URL = 'https://books.toscrape.com/';
const MIN_PRICE_BOUNDARY = 0.00;
const MAX_PRICE_BOUNDARY = 100.00;

test.describe('Books to Scrape - Boundary Value Analysis for Prices', () => {

  // Increase timeout for this specific test as it scrapes many pages
  test.setTimeout(120000); // Set timeout to 120 seconds (2 minutes)

  test('should find all book prices are within the £0.00 - £100.00 range', async ({ page }) => {
    let allPrices: number[] = [];
    let currentPageUrl = BASE_URL;
    let pagesScraped = 0; // Counter for scraped pages
    const maxPagesToScrape = 10; // Limit the number of pages

    console.log(`Starting scrape from: ${currentPageUrl}`);
    await page.goto(currentPageUrl);

    while (pagesScraped < maxPagesToScrape) {
      pagesScraped++;
      console.log(`Scraping page ${pagesScraped}...`);

      // Wait for the book elements to be present
      await page.waitForSelector('article.product_pod');

      // Locate price elements on the current page
      const priceElements = await page.locator('article.product_pod p.price_color').all();

      // Extract and clean prices
      for (const element of priceElements) {
        const priceText = await element.innerText();
        // Remove '£' and convert to number
        const price = parseFloat(priceText.replace('£', ''));
        if (!isNaN(price)) {
          allPrices.push(price);
        } else {
          console.warn(`Could not parse price: ${priceText}`);
        }
      }

      // Stop if we've reached the max pages
      if (pagesScraped >= maxPagesToScrape) {
        console.log(`Reached max pages limit (${maxPagesToScrape}).`);
        break;
      }

      // Find the 'next' button
      const nextButton = page.locator('li.next a');

      if (await nextButton.count() > 0) {
        const nextUrl = await nextButton.getAttribute('href');
        console.log(`Navigating to next page: ${nextUrl}`);
        await nextButton.click();
        // Wait for the URL to change or for a specific element on the next page
        await page.waitForURL(url => url.toString().includes('page-'));
        currentPageUrl = page.url(); // Update current URL for logging/debugging if needed
      } else {
        console.log('No more pages found.');
        break; // Exit loop if no 'next' button is found
      }
    }

    console.log(`Scraped a total of ${allPrices.length} prices.`);
    // Pass custom message to expect() itself
    expect(allPrices.length, 'Should have scraped at least one price.').toBeGreaterThan(0);

    // Perform Boundary Value Analysis validation
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    console.log(`Min price found: £${minPrice.toFixed(2)}`);
    console.log(`Max price found: £${maxPrice.toFixed(2)}`);

    // Pass custom message to expect() itself
    expect(minPrice, `Minimum price £${minPrice.toFixed(2)} should be >= £${MIN_PRICE_BOUNDARY.toFixed(2)}`).toBeGreaterThanOrEqual(MIN_PRICE_BOUNDARY);
    expect(maxPrice, `Maximum price £${maxPrice.toFixed(2)} should be <= £${MAX_PRICE_BOUNDARY.toFixed(2)}`).toBeLessThanOrEqual(MAX_PRICE_BOUNDARY);

    console.log(`Validation successful: All prices are between £${MIN_PRICE_BOUNDARY.toFixed(2)} and £${MAX_PRICE_BOUNDARY.toFixed(2)}.`);
  });

});
