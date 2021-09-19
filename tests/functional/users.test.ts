describe('Users functional tests', () => {
  it('should create a user with status code 201', async () => {
    const response = await global.testRequest.get('/api/v1/profile');
    console.log(response.body);
    expect(null).toBe(201);
  });
});
