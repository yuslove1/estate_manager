import { test } from '@playwright/test';

test('capture background clarity on mobile vs desktop', async ({ browser }) => {
  // Mobile viewport - 375px
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  const mobilePage = await mobileContext.newPage();
  
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForLoadState('networkidle');
  
  // Inject style to hide overlay
  await mobilePage.addStyleTag({
    content: `
      body::before {
        display: none !important;
      }
      body {
        background-attachment: scroll !important;
      }
    `,
  });
  
  await mobilePage.screenshot({ path: '/tmp/mobile-bg-clear.png' });
  console.log('Mobile 375px - background screenshot');
  
  // Log computed styles
  const bgInfo = await mobilePage.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    return {
      backgroundSize: style.backgroundSize,
      backgroundPosition: style.backgroundPosition,
      backgroundAttachment: style.backgroundAttachment,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });
  console.log('Mobile BG info:', bgInfo);
  
  await mobileContext.close();

  // Desktop viewport - 1920px
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const desktopPage = await desktopContext.newPage();
  
  await desktopPage.goto('http://localhost:3000');
  await desktopPage.waitForLoadState('networkidle');
  
  await desktopPage.addStyleTag({
    content: `
      body::before {
        display: none !important;
      }
      body {
        background-attachment: scroll !important;
      }
    `,
  });
  
  await desktopPage.screenshot({ path: '/tmp/desktop-bg-clear.png' });
  console.log('Desktop 1920px - background screenshot');
  
  const bgInfoDesktop = await desktopPage.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    return {
      backgroundSize: style.backgroundSize,
      backgroundPosition: style.backgroundPosition,
      backgroundAttachment: style.backgroundAttachment,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });
  console.log('Desktop BG info:', bgInfoDesktop);
  
  await desktopContext.close();
});
