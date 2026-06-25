const { expect, test } = require('@playwright/test');

async function openStory(page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('/index.html');
  await page.waitForFunction(() => {
    const sc = window.SugarCube;
    return sc && sc.State && sc.Story && sc.Engine && sc.setup;
  });
}

test.describe('Wolf story smoke QA', () => {
  test('starts at the title screen without runtime error text', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await openStory(page);

    await expect(page.locator('.title-screen')).toBeVisible();
    await expect(page.locator('.title-logo')).toContainText('WOLF');
    await expect(page.locator('.title-menu')).toContainText('처음부터');
    await expect(page.locator('body')).not.toContainText('An error has occurred');
    await expect(page.locator('body')).not.toContainText('Attempted to assign to readonly property');
    expect(pageErrors).toEqual([]);
  });

  test('uses the current ending grade display names in story data', async ({ page }) => {
    await openStory(page);

    const storyText = await page.locator('tw-storydata').textContent();

    expect(storyText).toContain('Day End');
    expect(storyText).toContain('Bad End');
    expect(storyText).toContain('True End');
    expect(storyText).toContain('Broken End');
    expect(storyText).toContain('Shura End');
    expect(storyText).not.toContain('Normal End');
    expect(storyText).not.toContain('Worst End');
    expect(storyText).not.toMatch(/\[End\./);
  });

  test('opens the recordbook overlay with updated ending grade names', async ({ page }) => {
    await openStory(page);

    await page.evaluate(() => {
      window.SugarCube.Engine.play('Temple');
    });
    await page.waitForFunction(() => window.SugarCube.State.passage === 'Temple');

    await page.evaluate(() => {
      const v = window.SugarCube.State.variables;
      v.debugMode = true;
      v.recordBookUnlocked = true;
      v.badEndFirstDeathSeen = true;
      v.endingHanbeiQuietDaySeen = true;
      v.endingHanbeiWorstSeen = true;
      v.endingKuroWorstSeen = true;
      v.endingGenichiroWorstSeen = true;
      v.shuraEndingSeen = true;
      window.SugarCube.setup.openRecordBookOverlay('endings');
    });

    await expect(page.locator('.recordbook-panel')).toBeVisible();
    await expect(page.locator('.recordbook-title')).toContainText('기록장');
    await expect(page.locator('.recordbook-tabs')).toContainText('엔딩');
    await expect(page.locator('.recordbook-content')).toContainText('Day End');
    await expect(page.locator('.recordbook-content')).toContainText('Broken End');
    await expect(page.locator('.recordbook-content')).toContainText('Shura End');
    await expect(page.locator('.recordbook-content')).not.toContainText('Worst End');
    await expect(page.locator('.recordbook-content')).not.toContainText('Normal End');
  });

  test('records the first death bad end without markEndingSeen macro errors', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await openStory(page);

    await page.evaluate(() => {
      window.SugarCube.Engine.play('BadEnd_FirstDeath');
    });
    await page.waitForFunction(() => window.SugarCube.State.passage === 'BadEnd_FirstDeath');

    const passage = page.locator('#passages');

    await expect(passage).toContainText('[Bad End. 첫 번째 죽음]');
    await expect(passage).not.toContainText('cannot execute macro');
    await expect(passage).not.toContainText('endingSeenBoolMap');
    await expect(passage).not.toContainText('An error has occurred');

    const endingMeta = await page.evaluate(() => {
      const v = window.SugarCube.State.variables;
      const stored = JSON.parse(window.localStorage.getItem('wolf.endingMeta.v1') || '{}');

      return {
        stateSeen: !!(v.endingSeenBoolMap && v.endingSeenBoolMap.badend_first_death),
        totalUniqueEndingsSeen: v.totalUniqueEndingsSeen,
        persistentSeen: !!(stored.seen && stored.seen.badend_first_death)
      };
    });

    expect(endingMeta.stateSeen).toBe(true);
    expect(endingMeta.totalUniqueEndingsSeen).toBeGreaterThanOrEqual(1);
    expect(endingMeta.persistentSeen).toBe(true);
    expect(pageErrors).toEqual([]);
  });
});
