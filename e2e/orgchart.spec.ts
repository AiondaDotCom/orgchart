import { test, expect } from '@playwright/test';

test.describe('OrgChart Application', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the org chart to load (GraphQL data)
    await page.waitForSelector('text=John Doe', { timeout: 10000 });
  });

  test('page loads and shows the Aionda logo', async ({ page }) => {
    const logo = page.locator('img[alt*="Aionda"], img[src*="logo"]');
    await expect(logo).toBeVisible();
  });

  test('CEO card is visible', async ({ page }) => {
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.getByText('CEO', { exact: true })).toBeVisible();
  });

  test('JARVIS Chief Strategy Officer is visible', async ({ page }) => {
    await expect(page.locator('text=JARVIS')).toBeVisible();
    await expect(page.locator('text=Chief Strategy Officer')).toBeVisible();
  });

  test('all departments are displayed', async ({ page }) => {
    const departments = ['RESEARCH', 'DEVELOPMENT', 'CONTENT', 'CREATIVE', 'PRODUCT', 'SALES'];
    for (const dept of departments) {
      // Department names might be uppercased or title-cased
      await expect(page.locator(`text=${dept}`).first()).toBeVisible();
    }
  });

  test('AI agents are shown with their skills', async ({ page }) => {
    // ATLAS in Research
    await expect(page.getByText('ATLAS', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Senior Research Analyst').first()).toBeVisible();

    // CLAWD in Development
    await expect(page.getByText('CLAWD', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Senior Developer').first()).toBeVisible();
  });

  test('employee cards show status indicators', async ({ page }) => {
    // Status dots should be present (small colored circles)
    const statusDots = page.locator('[style*="border-radius: 50%"][style*="background-color"]');
    const count = await statusDots.count();
    expect(count).toBeGreaterThan(0);
  });

  test('employee cards show type badges (AI/Human)', async ({ page }) => {
    // AI badges
    const aiBadges = page.locator('text=AI');
    const aiCount = await aiBadges.count();
    expect(aiCount).toBeGreaterThan(0);

    // Human badge for CEO
    const humanBadges = page.locator('text=Human');
    const humanCount = await humanBadges.count();
    expect(humanCount).toBeGreaterThan(0);
  });

  test('council members are displayed', async ({ page }) => {
    await expect(page.locator('text=GROWTH').first()).toBeVisible();
    await expect(page.locator('text=RETENTION').first()).toBeVisible();
    await expect(page.locator('text=SKEPTIC').first()).toBeVisible();
  });

  test('ORACLE consultant is visible', async ({ page }) => {
    await expect(page.locator('text=ORACLE').first()).toBeVisible();
  });

  test('clicking + button opens add employee modal', async ({ page }) => {
    // Find the floating action button (+ button)
    const fab = page.locator('button').filter({ has: page.locator('svg') }).last();
    await fab.click();

    // Modal should open with form fields
    await expect(page.locator('text=Add Employee')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('add employee modal has all form fields', async ({ page }) => {
    // Open modal
    const fab = page.locator('button').filter({ has: page.locator('svg') }).last();
    await fab.click();
    await expect(page.locator('text=Add Employee')).toBeVisible({ timeout: 3000 });

    // Check form fields exist
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Title")')).toBeVisible();
    await expect(page.locator('label:has-text("Type")')).toBeVisible();
    await expect(page.locator('label:has-text("Department")')).toBeVisible();
  });

  test('can close the add employee modal', async ({ page }) => {
    const fab = page.locator('button').filter({ has: page.locator('svg') }).last();
    await fab.click();
    await expect(page.locator('text=Add Employee')).toBeVisible({ timeout: 3000 });

    // Click Cancel or X button
    const cancelBtn = page.locator('button:has-text("Cancel")');
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(page.locator('text=Add Employee')).not.toBeVisible({ timeout: 3000 });
  });

  test('clicking chat icon opens chat panel', async ({ page }) => {
    // Click on an employee card (e.g., JARVIS)
    const jarvisCard = page.locator('text=JARVIS').first();
    await jarvisCard.click();

    // Chat panel should appear with employee name
    await expect(page.locator('text=Message JARVIS').or(page.locator('text=Start a conversation with JARVIS'))).toBeVisible({ timeout: 3000 });
  });

  test('responsive layout - departments stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    // Page should still render
    await expect(page.locator('text=John Doe')).toBeVisible();
    // Departments should still be visible
    await expect(page.locator('text=RESEARCH').first()).toBeVisible();
  });

  test('adding a new employee via the form', async ({ page }) => {
    // Open modal
    const fab = page.locator('button').filter({ has: page.locator('svg') }).last();
    await fab.click();
    await expect(page.locator('text=Add Employee')).toBeVisible({ timeout: 3000 });

    // Fill the form
    const nameInput = page.locator('input').first();
    await nameInput.fill('TESTBOT');

    const titleInput = page.locator('input').nth(1);
    await titleInput.fill('Test Agent');

    // Submit
    const submitBtn = page.locator('button:has-text("Create Employee")');
    await submitBtn.click();

    // New employee should appear in the org chart
    await expect(page.locator('text=TESTBOT')).toBeVisible({ timeout: 5000 });
  });

  test('Creative department shows PIXEL, NOVA, VIBE', async ({ page }) => {
    await expect(page.getByText('PIXEL', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('NOVA', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('VIBE', { exact: true }).first()).toBeVisible();
  });

  test('Sales department shows SAGE and CLOSER', async ({ page }) => {
    await expect(page.getByText('SAGE', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('CLOSER', { exact: true }).first()).toBeVisible();
  });

});
