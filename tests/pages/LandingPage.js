import { expect } from '@playwright/test';

export class LandingPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async isLoaded() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page.locator('body')).toContainText(/Bow-lletins/i);
  }
}