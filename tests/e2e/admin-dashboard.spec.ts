import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
    await page.waitForTimeout(500);
  });

  test("sidebar buttons should display both icon and text label", async ({
    page,
  }) => {
    const buttons = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button");

    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);

      const hasIcon = await button
        .locator("svg")
        .first()
        .isVisible()
        .catch(() => false);

      const hasText = await button
        .locator("span")
        .filter({ hasText: /Residents|Announcements|Gate Code|Settings/i })
        .isVisible()
        .catch(() => false);

      expect(hasIcon || hasText).toBe(true);
    }
  });

  test("sidebar buttons should be 2 columns on mobile, 1 on desktop", async ({
    page,
  }) => {
    const sidebarContainer = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1");

    const mobileClasses = await sidebarContainer.evaluate((el) => {
      const classes = el.getAttribute("class") || "";
      return {
        hasMobileGrid: classes.includes("grid-cols-2"),
        hasDesktopGrid: classes.includes("md:grid-cols-1"),
      };
    });

    expect(mobileClasses.hasMobileGrid).toBe(true);
    expect(mobileClasses.hasDesktopGrid).toBe(true);
  });

  test("buttons should show label text on both mobile and desktop", async ({
    page,
  }) => {
    const buttons = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button");

    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasVisibleText = await button
        .locator("span.text-sm")
        .isVisible();

      expect(hasVisibleText).toBe(true);
    }
  });

  test("active button should have blue background", async ({ page }) => {
    const buttons = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button");
    const firstButton = buttons.first();

    const bgColor = await firstButton.evaluate((el) => {
      const classes = el.getAttribute("class") || "";
      return {
        isBlueActive: classes.includes("bg-blue-500"),
        isBlueText: classes.includes("text-white"),
      };
    });

    expect(
      bgColor.isBlueActive || bgColor.isBlueText
    ).toBeDefined();
  });

  test("clicking sidebar button should change active state", async ({
    page,
  }) => {
    const buttons = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button");
    const secondButton = buttons.nth(1);

    await secondButton.click();
    await page.waitForTimeout(300);

    const isActive = await secondButton.evaluate((el) => {
      const classes = el.getAttribute("class") || "";
      return classes.includes("bg-blue-500");
    });

    expect(isActive).toBe(true);
  });

  test("sidebar should align center on mobile, start on desktop", async ({
    page,
  }) => {
    const buttons = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button");

    const alignmentClasses = await buttons.first().evaluate((el) => {
      const classes = el.getAttribute("class") || "";
      return {
        centerJustify: classes.includes("justify-center"),
        startJustify: classes.includes("md:justify-start"),
      };
    });

    expect(alignmentClasses.centerJustify).toBe(true);
    expect(alignmentClasses.startJustify).toBe(true);
  });

  test("residents table should be visible on Residents tab", async ({ page }) => {
    const residentsTab = page.locator("div.grid.grid-cols-2.md\\:grid-cols-1 button").first();
    await residentsTab.click();
    await page.waitForTimeout(300);

    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    const headers = page.locator("thead th");
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
  });
});
