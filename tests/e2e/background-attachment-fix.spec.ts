import { test, expect } from '@playwright/test';

test.describe('Background Fixed on All Screen Sizes', () => {
  test('mobile viewport should use fixed attachment', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bgAttachment = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundAttachment;
    });
    
    expect(bgAttachment).toBe('fixed');
    console.log('✓ Mobile (375px): background-attachment is "fixed"');
  });

  test('tablet viewport should use fixed attachment', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bgAttachment = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundAttachment;
    });
    
    expect(bgAttachment).toBe('fixed');
    console.log('✓ Tablet (767px): background-attachment is "fixed"');
  });

  test('desktop viewport should use fixed attachment', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bgAttachment = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundAttachment;
    });
    
    expect(bgAttachment).toBe('fixed');
    console.log('✓ Desktop (1920px): background-attachment is "fixed"');
  });
});
