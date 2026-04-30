import { test } from '@playwright/test';
import { LandingPage } from './pages/LandingPage.js';
import { ExplorePage } from './pages/ExplorePage.js';
import { CreateFlyerPage } from './pages/CreateFlyerPage.js';

test('Landing page loads', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
  await landingPage.isLoaded();
});
test('Explore page loads', async ({ page }) => {
  const explorePage = new ExplorePage(page);
  await explorePage.goto();
  await explorePage.isLoaded();
});

test('Create flyer form works', async ({ page }) => {
  const createPage = new CreateFlyerPage(page);

  await createPage.goto();
  await createPage.isLoaded();

  await createPage.fillForm();
  await createPage.submit();

  await createPage.expectSuccess();
});

test('Categories page loads', async ({ page }) => {
  await page.goto('/categories');
});

test('Create flyer page loads', async ({ page }) => {
  await page.goto('/create-flyer');
});

test('Profile page loads', async ({ page }) => {
  await page.goto('/profile');
});