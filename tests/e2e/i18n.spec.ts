import { expect, test } from '@playwright/test';

test('es homepage shows Spanish about copy', async ({ page }) => {
  await page.goto('/es/');
  await expect(
    page.getByText('Este sitio es donde escribo sobre código', { exact: false }),
  ).toBeVisible();

  // Wordmark title should translate too.
  await expect(page.locator('.wordmark-title')).toContainText('¡Hola, soy Sterling!');

  // Empty-locale callout should look intentional (border + background), not like normal text.
  await expect(page.locator('[data-no-posts]')).toBeVisible();
  const callout = page.locator('[data-no-posts]');
  await expect
    .poll(async () => {
      return await callout.evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          borderTopWidth: s.borderTopWidth,
          borderTopStyle: s.borderTopStyle,
          backgroundColor: s.backgroundColor,
          display: s.display,
          justifyContent: s.justifyContent,
        };
      });
    })
    .toMatchObject({
      borderTopStyle: 'solid',
      display: 'flex',
      justifyContent: 'center',
    });
});

test('language toggle keeps you on contact page', async ({ page }) => {
  await page.goto('/en/contact/');
  // open language menu (button has aria-label)
  await page.getByRole('button', { name: 'Choose language' }).click();
  await page.getByRole('menuitem', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/contact\/$/);

  // Control chrome should be translated on the destination page too.
  await expect(page.locator('[data-language-button]')).toHaveAttribute('aria-label', 'Elegir idioma');
  // On the contact page the contact icon is disabled and should explain why.
  await expect(page.locator('.contact-icon-link')).toHaveAttribute(
    'data-tooltip',
    'Ya estás en la página de contacto',
  );

  // On a normal page, the contact icon should be enabled and labeled "Contacto".
  await page.goto('/es/');
  await expect(page.locator('.contact-icon-link')).toHaveAttribute('data-tooltip', 'Contacto');
});

