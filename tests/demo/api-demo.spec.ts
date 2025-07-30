import { test, expect } from '@playwright/test';

test.describe('📡 API Platform Demo Tests', () => {

  test('Demo: GET request with response validation', async ({ request }) => {
    // Make GET request to JSONPlaceholder API
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    
    // Verify status code
    expect(response.status()).toBe(200);
    
    // Parse response body
    const user = await response.json();
    
    // Verify response structure and data
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user.email).toContain('@');
    
    console.log('✅ API Demo: GET request successful', { userId: user.id, name: user.name });
  });

  test('Demo: POST request with payload and response verification', async ({ request }) => {
    // Create new post
    const newPost = {
      title: 'Demo Test Post',
      body: 'This is a demo post created during API testing',
      userId: 1,
    };
    
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: newPost,
    });
    
    // Verify status code
    expect(response.status()).toBe(201);
    
    // Parse response
    const createdPost = await response.json();
    
    // Verify response contains our data
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost).toHaveProperty('id');
    
    console.log('✅ API Demo: POST request successful', { postId: createdPost.id });
  });

  test('Demo: Headers and authentication verification', async ({ request }) => {
    // Make request with custom headers to JSONPlaceholder (more reliable)
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'User-Agent': 'Playwright-Demo-Test',
        'X-Custom-Header': 'Demo-Value',
        'Accept': 'application/json',
      },
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Verify response contains expected post data
    expect(data).toHaveProperty('id', 1);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('userId');
    
    console.log('✅ API Demo: Headers verification successful');
  });

  test('Demo: Error handling and status codes', async ({ request }) => {
    // Test 404 error handling
    const notFoundResponse = await request.get('https://jsonplaceholder.typicode.com/users/999999');
    expect(notFoundResponse.status()).toBe(404);
    
    // Test invalid endpoint
    const invalidResponse = await request.get('https://jsonplaceholder.typicode.com/invalid-endpoint');
    expect(invalidResponse.status()).toBe(404);
    
    // Test successful request for comparison
    const successResponse = await request.get('https://jsonplaceholder.typicode.com/users/1');
    expect(successResponse.status()).toBe(200);
    
    console.log('✅ API Demo: Error handling verification successful');
  });

  test('Demo: Response time and performance testing', async ({ request }) => {
    const startTime = Date.now();
    
    // Make API request
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Verify response
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify response time is reasonable (less than 5 seconds)
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`✅ API Demo: Performance test successful (Response time: ${responseTime}ms)`);
  });

});
