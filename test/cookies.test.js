import cookie from '../src/cookies';

test('cookies secure when set to true', () => {
  cookie.set('CookieName', 'Value', 4 * 60, null, true, 'localhost');
  expect(document.cookie).toMatch(/Secure/);
});

test('cookies not secure when set to false', () => {
  cookie.set('CookieName', 'Value', 4 * 60, null, false, 'localhost');
  expect(document.cookie).not.toMatch(/Secure/);
});

test('cookies not secure when set to null', () => {
  cookie.set('CookieName', 'Value', 4 * 60, null, null, 'localhost');
  expect(document.cookie).not.toMatch(/Secure/);
});

test('same site settings for strict', () => {
  cookie.set('CookieName', 'Value', 4 * 60, 'Strict', null, 'localhost');
  expect(document.cookie).toMatch(/SameSite=Strict/);
});

test('setting both same site and secure works', () => {
  cookie.set('CookieName', 'Value', 4 * 60, 'Strict', true, 'localhost');
  expect(document.cookie).toMatch(/SameSite=Strict/);
  expect(document.cookie).toMatch(/Secure/);
});

test('domain is set when configured', () => {
  cookie.set('CookieName', 'Value', 4 * 60, null, null, 'example.net');
  expect(document.cookie).toMatch(/domain=example.net/);
});

test('domain is not set when not configured', () => {
  cookie.set('CookieName', 'Value', 4 * 60, null, null, null);
  expect(document.cookie).not.toMatch(/domain=/);
});
