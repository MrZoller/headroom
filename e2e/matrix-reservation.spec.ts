import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

test.use({ javaScriptEnabled: false });

function builtRoute(): string {
  const route = readdirSync(DIST, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'assets')
    .map((entry) => entry.name)
    .sort()
    .find((directory) => existsSync(join(DIST, directory, 'index.html')));

  if (!route) throw new Error('dist has no prerendered device route');
  return `/${route}/`;
}

test('the SSR Matrix reservation covers the coarse-pointer grid before hydration', async ({
  page,
}) => {
  await page.goto(builtRoute());

  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  await expect(page.getByRole('grid')).toHaveCount(0);

  const box = await page.locator('[data-matrix-reservation]').boundingBox();
  expect(box, 'the Matrix reservation has no layout box').not.toBeNull();
  expect(
    box!.height,
    'the Matrix reservation is shorter than the coarse-pointer grid'
  ).toBeGreaterThan(2830);
});
