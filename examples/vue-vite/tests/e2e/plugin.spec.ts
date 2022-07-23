import { test, expect } from "@playwright/test";
import {
  NOTIFY_CLASS_NAME,
  INJECT_STYLE_FILE_NAME,
  INJECT_SCRIPT_FILE_NAME,
  JSON_FILE_NAME,
} from "@plugin-web-update-notify/core";

test.describe("test @plugin-web-update-notify/vite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("page access", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4173/");
  });
  test("script and css file inject success", async ({ page }) => {
    const scriptTag = page.locator(
      `script[src="${INJECT_SCRIPT_FILE_NAME}.js"]`
    );
    expect(await scriptTag.count()).toEqual(1);

    const cssTag = page.locator(`link[href="${INJECT_STYLE_FILE_NAME}.css"]`);
    expect(await cssTag.count()).toEqual(1);
  });

  test("notify anchor element should exist", async ({ page }) => {
    const anchor = page.locator(`.${NOTIFY_CLASS_NAME}`);
    expect(await anchor.count()).toEqual(1);
  });

  test(`should has a ${JSON_FILE_NAME}.json file`, async ({
    page,
    request,
  }) => {
    const jsonFileRes = await request.get(`${JSON_FILE_NAME}.json`);
    expect(jsonFileRes.ok()).toBeTruthy();

    const res = await jsonFileRes.json();
    expect(res).toHaveProperty("version");
    expect(typeof res?.version).toBe("string");
  });

  test("don't show notify when hash is the same", async ({ page }) => {
    const notifyContent = page.locator(
      `[data-cy="notify-content"]`
    );
    expect(await notifyContent.count()).toEqual(0);
  });

  test("should show a notify after system update", async ({ page }) => {
    // change the hash to force the notify
    await page.route(`**/${JSON_FILE_NAME}.json?*`, async (route) => {
      // Fetch original response.
      const response = await page.request.fetch(route.request());
      // Add a prefix to the title.
      const body = await response.json();
      body.version = "1234567";
      route.fulfill({
        response,
        body: JSON.stringify(body),
        status: 200,
      });
    });
    await page.reload();
    const notifyContent = page.locator(
      `[data-cy="notify-content"]`
    );
    expect(await notifyContent.innerHTML()).toContain("system update");
    expect(await notifyContent.innerHTML()).toContain("refresh");
  });
});
