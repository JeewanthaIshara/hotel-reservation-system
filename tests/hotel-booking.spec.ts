import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Phase 3: Public Hotel Website & Search Tests", () => {
  
  test("should load the landing page and display core branding assets", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check main landing elements
    await expect(page.locator("text=AuraStay")).toBeVisible();
    await expect(page.locator("text=Experience Ultimate Luxury & Comfort")).toBeVisible();
    await expect(page.locator("text=Search Rooms")).toBeVisible();
  });

  test("should navigate to the rooms directory page and display listings", async ({ page }) => {
    await page.goto(`${BASE_URL}/rooms`);
    
    // Check directory page header
    await expect(page.locator("h1")).toContainText("Available Accommodations");
    
    // Ensure at least one room card has successfully rendered from the seed database
    const roomCards = page.locator(".border.rounded-xl");
    await expect(roomCards.first()).toBeVisible();
  });

  test("should protect the room details checkout action button from logged-out users", async ({ page }) => {
    await page.goto(`${BASE_URL}/rooms`);
    
    // Click the first "View Suite" button to enter the dynamic route
    await page.click("text=View Suite");
    
    // Check that a logged-out user is prompted to authenticate instead of checking out
    await expect(page.locator("text=Sign In to Complete Booking")).toBeVisible();
    
    // Ensure the protected checkout route button does not exist for anonymous visitors
    await expect(page.locator("text=Proceed to Checkout")).toBeHidden();
  });
});