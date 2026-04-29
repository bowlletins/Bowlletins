import { expect } from '@playwright/test';

export class CreateFlyerPage {
  constructor(page) {
    this.page = page;
  }

async login() {
  await this.page.goto('/auth/signin');

  await this.page.getByRole('textbox').first().fill('admin@foo.com');
  await this.page.getByRole('textbox').nth(1).fill('changeme');

  await this.page.getByRole('button', { name: /signin/i }).click();

  await expect(this.page).not.toHaveURL(/error=CredentialsSignin/);
}

async goto() {
  await this.page.goto('/create-flyer');
  await this.page.waitForLoadState('networkidle');

  console.log('CREATE FLYER URL:', this.page.url());
  console.log(await this.page.locator('body').innerText());
}

async isLoaded() {
  await expect(this.page.getByTestId('create-flyer-form')).toBeVisible({
    timeout: 15000,
  });
}

async fillForm() {
  await this.page.locator('[name="title"]').fill('Playwright Test Flyer');
  await this.page.locator('textarea[name="description"]').fill('This is a test flyer created by Playwright.');
  await this.page.locator('[name="category"]').selectOption('Events');
  await this.page.locator('[name="date"]').fill('2026-05-01');
  await this.page.locator('[name="location"]').fill('UH Manoa Campus');
  await this.page.locator('[name="contactInfo"]').fill('test@hawaii.edu');
}

  async submit() {
    await this.page.getByRole('button', { name: /Post Flyer|Create|Post|Submit/i }).click();
  }

async expectSuccess() {
  await expect(this.page).toHaveURL('/');
}
}