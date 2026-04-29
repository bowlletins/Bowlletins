import { expect } from '@playwright/test';

export class ExplorePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/explore');
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(/explore/);
    await expect(this.page.getByText(/All Flyers/i)).toBeVisible();
  }
}