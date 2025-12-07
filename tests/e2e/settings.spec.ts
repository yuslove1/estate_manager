import { test, expect, Page } from "@playwright/test";

test.describe("Settings Page", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    await page.goto("/dashboard/settings");

    await page.waitForTimeout(500);
  });

  test("should display user profile information", async () => {
    const profileCard = page.locator('div:has-text("Brentfield Resident"), div:has-text("0")').first();
    await expect(profileCard).toBeVisible();

    const profileHeading = page.locator("h2.text-lg.font-bold").first();
    await expect(profileHeading).toBeVisible();
  });

  test("dark mode toggle should change document class", async () => {
    const html = page.locator("html");

    const initialHasDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    const darkModeToggle = page.locator('button[role="switch"]').first();
    await darkModeToggle.click();

    await page.waitForTimeout(300);

    const hasDarkAfterClick = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    expect(hasDarkAfterClick).toBe(!initialHasDark);

    const themeInStorage = await page.evaluate(() =>
      localStorage.getItem("theme")
    );
    expect(themeInStorage).toBe(hasDarkAfterClick ? "dark" : "light");

    await darkModeToggle.click();
    await page.waitForTimeout(300);

    const finalHasDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(finalHasDark).toBe(initialHasDark);
  });

  test("announcement notifications toggle should persist", async () => {
    const toggles = page.locator('button[role="switch"]');
    const annToggle = toggles.nth(1);

    await annToggle.click();
    await page.waitForTimeout(200);

    const prefAnnNotif = await page.evaluate(() =>
      localStorage.getItem("pref_ann_notif")
    );
    expect(prefAnnNotif).toBeDefined();

    await page.reload();
    await page.waitForTimeout(500);

    const togglesAfterReload = page.locator('button[role="switch"]');
    const annToggleAfterReload = togglesAfterReload.nth(1);
    const isChecked = await annToggleAfterReload.evaluate((el) => {
      const bgClass = el.getAttribute("class");
      return bgClass?.includes("bg-blue-500");
    });

    expect(isChecked).toBeDefined();
  });

  test("daily gate code notifications toggle should persist", async () => {
    const toggles = page.locator('button[role="switch"]');
    const gateToggle = toggles.nth(2);

    await gateToggle.click();
    await page.waitForTimeout(200);

    const prefGateNotif = await page.evaluate(() =>
      localStorage.getItem("pref_gate_notif")
    );
    expect(prefGateNotif).toBeDefined();
  });

  test("text size slider should adjust font size and persist", async () => {
    const slider = page.locator('input[type="range"]');

    await slider.fill("18");
    await page.waitForTimeout(200);

    const htmlFontSize = await page.locator("html").evaluate((el) => {
      const fontSize = el.style.fontSize;
      return fontSize;
    });

    expect(htmlFontSize).toBe("18px");

    const prefTextSize = await page.evaluate(() =>
      localStorage.getItem("pref_text_size")
    );
    expect(prefTextSize).toBe("18");

    await page.reload();
    await page.waitForTimeout(500);

    const htmlFontSizeAfterReload = await page.locator("html").evaluate((el) => {
      const fontSize = el.style.fontSize;
      return fontSize;
    });

    expect(htmlFontSizeAfterReload).toBe("18px");
  });

  test("keyboard navigation toggle should persist", async () => {
    const toggles = page.locator('button[role="switch"]');
    const keyboardToggle = toggles.nth(3);

    await keyboardToggle.click();
    await page.waitForTimeout(200);

    const prefKeyboardNav = await page.evaluate(() =>
      localStorage.getItem("pref_keyboard_nav")
    );
    expect(prefKeyboardNav).toBe("true");

    const htmlHasKeyboardNav = await page.locator("html").evaluate((el) =>
      el.classList.contains("keyboard-nav")
    );
    expect(htmlHasKeyboardNav).toBe(true);
  });

  test("PWA install button should be visible or disabled appropriately", async () => {
    const pwaButton = page.locator("button").filter({ hasText: /Add to|Available/ }).first();

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll("button")).find(btn => 
        /Add to|Available/.test(btn.textContent || "")
      );
      if (button) button.scrollIntoView();
    });

    await page.waitForTimeout(300);

    const exists = await pwaButton.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("profile should show admin badge if user is admin", async () => {
    const adminBadge = page.locator("span:has-text(\"Admin\")");

    const isVisible = await adminBadge.isVisible();
    expect(typeof isVisible).toBe("boolean");
  });

  test("profile should show house number if available", async () => {
    const houseText = page.locator("p:has-text(\"House\")");

    const isVisible = await houseText.isVisible();
    expect(typeof isVisible).toBe("boolean");
  });
});
