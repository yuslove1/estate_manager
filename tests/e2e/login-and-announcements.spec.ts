import { test, expect, Page } from "@playwright/test";

test.describe("Login Page Dark Mode & Announcements Modal", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("/auth/login");
    await page.waitForTimeout(500);
  });

  test("dark mode toggle should be visible on login page", async () => {
    const darkModeToggleSection = page.locator("div").filter({ hasText: /^Dark Mode$/ });
    await expect(darkModeToggleSection).toBeVisible();
  });

  test("dark mode toggle should switch between light and dark mode", async () => {
    const html = page.locator("html");
    const darkModeButton = page.locator("button[aria-label='Toggle dark mode']");

    const initialHasDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    await darkModeButton.click();
    await page.waitForTimeout(500);

    const hasDarkAfterClick = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    expect(hasDarkAfterClick).toBe(!initialHasDark);
  });

  test("dark mode preference should persist in localStorage", async () => {
    const darkModeButton = page.locator("button[aria-label='Toggle dark mode']");

    await darkModeButton.click();
    await page.waitForTimeout(500);

    const themeInStorage = await page.evaluate(() =>
      localStorage.getItem("theme")
    );

    const html = page.locator("html");
    const hasDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    expect(themeInStorage).toBe(hasDark ? "dark" : "light");
  });

  test("login card should have proper dark mode styles", async () => {
    const darkModeButton = page.locator("button[aria-label='Toggle dark mode']");
    const loginCard = page.locator("div[class*='rounded-3xl'][class*='max-w-md'][class*='p-8']");

    await darkModeButton.click();
    await page.waitForTimeout(500);

    const classes = await loginCard.evaluate((el) => el.className);
    expect(classes).toContain("dark:bg-neutral-800");
  });

  test("dark mode toggle button should have proper styling", async () => {
    const darkModeButton = page.locator("button[aria-label='Toggle dark mode']");

    const isVisible = await darkModeButton.isVisible();
    expect(isVisible).toBe(true);
  });
});

test.describe("Announcement Modal Positioning & Visibility", () => {
  let page: Page;

  test.beforeEach(async ({ browser, context }) => {
    page = await browser.newPage();
    await context.addCookies([
      {
        name: "verified_phone",
        value: "08012345678",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/dashboard/announcements");
    await page.waitForTimeout(1000);
  });

  test("announcement modal should open when clicking an announcement card", async () => {
    const firstAnnouncementCard = page.locator("[data-testid], div").filter({ hasText: /Read More/ }).first();
    const count = await firstAnnouncementCard.count();

    if (count > 0) {
      await firstAnnouncementCard.click();
      await page.waitForTimeout(300);

      const modal = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
      await expect(modal).toBeVisible();
    }
  });

  test("modal should be properly positioned on mobile viewport", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    const firstAnnouncementCard = page.locator("button, div[role='button']").filter({ hasText: /created_at|created/ }).first();
    const count = await firstAnnouncementCard.count();

    if (count > 0) {
      const announcements = page.locator("div").filter({ hasText: /created/ });
      const announcementCount = await announcements.count();

      if (announcementCount > 0) {
        await announcements.first().click();
        await page.waitForTimeout(300);

        const modal = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
        const isVisible = await modal.isVisible();
        expect(isVisible).toBe(true);

        const boundingBox = await modal.boundingBox();
        if (boundingBox) {
          expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(812);
        }
      }
    }
  });

  test("modal should be centered on desktop viewport", async () => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      await announcements.first().click();
      await page.waitForTimeout(300);

      const modal = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
      const boundingBox = await modal.boundingBox();

      if (boundingBox) {
        const viewportWidth = 1280;
        const centerX = viewportWidth / 2;
        const modalCenterX = boundingBox.x + boundingBox.width / 2;
        expect(Math.abs(modalCenterX - centerX)).toBeLessThan(100);
      }
    }
  });

  test("modal text should be readable in dark mode", async () => {
    await page.evaluate(() => {
      const theme = localStorage.getItem("theme");
      if (theme !== "dark") {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      }
    });
    await page.waitForTimeout(300);

    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      await announcements.first().click();
      await page.waitForTimeout(300);

      const modalTitle = page.locator("h2").filter({ hasText: /^(?!Edit)/ }).first();
      const modalMessage = page.locator("p").filter({ hasText: /^[^Date]/ }).first();

      const titleClasses = await modalTitle.evaluate((el) => el.className);
      const messageClasses = await modalMessage.evaluate((el) => el.className);

      expect(titleClasses).toContain("dark:text-white");
      expect(messageClasses).toContain("dark:text-neutral-");
    }
  });

  test("modal should have proper dark mode styling", async () => {
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);

    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      await announcements.first().click();
      await page.waitForTimeout(300);

      const modalContainer = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
      const classes = await modalContainer.evaluate((el) => el.className);

      expect(classes).toContain("dark:bg-neutral-800");
    }
  });

  test("modal close button should be visible and functional", async () => {
    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      await announcements.first().click();
      await page.waitForTimeout(300);

      const closeButton = page.locator("button").filter({ hasText: /^X$/ }).first();
      await expect(closeButton).toBeVisible();

      await closeButton.click();
      await page.waitForTimeout(300);

      const modal = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
      const isVisible = await modal.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    }
  });

  test("modal should not overflow on mobile views with long text", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      await announcements.first().click();
      await page.waitForTimeout(300);

      const modal = page.locator("div").filter({ hasText: /^X$/ }).first().locator("..").first();
      const boundingBox = await modal.boundingBox();

      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(375);
        expect(boundingBox.height).toBeLessThanOrEqual(812);
      }
    }
  });

  test("bottom navigation should be hidden when modal is open", async () => {
    const announcements = page.locator("div").filter({ hasText: /created/ });
    const announcementCount = await announcements.count();

    if (announcementCount > 0) {
      const bottomNav = page.locator('nav[role="navigation"]');
      
      const isVisibleBeforeModal = await bottomNav.isVisible().catch(() => false);
      expect(isVisibleBeforeModal).toBe(true);

      await announcements.first().click();
      await page.waitForTimeout(500);

      const isVisibleDuringModal = await bottomNav.isVisible().catch(() => false);
      expect(isVisibleDuringModal).toBe(false);

      const closeButton = page.locator("button").filter({ hasText: /^X$/ }).first();
      await closeButton.click();
      await page.waitForTimeout(300);

      const isVisibleAfterModal = await bottomNav.isVisible().catch(() => false);
      expect(isVisibleAfterModal).toBe(true);
    }
  });
});
