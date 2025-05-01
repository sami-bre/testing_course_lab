import { test, expect } from '@playwright/test';

const REQRES_BASE_URL = 'https://reqres.in';
// Store your API key securely (e.g., environment variable)
// REPLACE 'YOUR_API_KEY_PLACEHOLDER' if not using env var.
const REQRES_API_KEY = 'reqres-free-v1';

test.describe('Reqres API Registration - Equivalence Partitioning', () => {

  // TC1: Valid Email + Valid Password
  test('should register successfully with valid credentials', async ({ request }) => {
    const response = await request.post(`${REQRES_BASE_URL}/api/register`, {
      headers: {
        'x-api-key': `${REQRES_API_KEY}`
      },
      data: {
        email: 'eve.holt@reqres.in', // Known user for success
        password: 'pistol'
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('token');
  });

  // TC5: Valid Email + Invalid Password (Missing)
  test('should fail registration with missing password', async ({ request }) => {
    const response = await request.post(`${REQRES_BASE_URL}/api/register`, {
      headers: {
        'x-api-key': `${REQRES_API_KEY}`
      },
      data: {
        email: 'eve.holt@reqres.in'
        // password missing
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Missing password');
  });

  // TC4: Invalid Email (Missing) + Valid Password
   test('should fail registration with missing email', async ({ request }) => {
    const response = await request.post(`${REQRES_BASE_URL}/api/register`, {
      headers: {
        'x-api-key': `${REQRES_API_KEY}`
      },
      data: {
         // email missing
         password: 'somepassword'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
     // Reqres might have a specific error message, adjust if needed
    expect(body).toHaveProperty('error'); // Check if error property exists
    // Example: expect(body.error).toContain('email');
  });

  // Example for I1 (Malformed Email)
  test('should fail registration with malformed email', async ({ request }) => {
    const response = await request.post(`${REQRES_BASE_URL}/api/register`, {
      headers: {
        'x-api-key': `${REQRES_API_KEY}`
      },
      data: {
        email: 'eve.holt@', // Malformed
        password: 'somepassword'
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error'); // Check for an error message
  });

});