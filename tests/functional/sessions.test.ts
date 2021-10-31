import faker from "faker";

describe("Sessions functional tests", () => {
  it("should be able to authenticate a user with correct credentials", async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await global.testRequest.post("/api/v1/users").send(user);

    const response = await global.testRequest
      .post("/api/v1/sessions")
      .send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  it("should not be able to authenticate a user with wrong credentials", async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userWithWrongCredentials = Object.assign({}, user, {
      password: faker.internet.password(),
    });

    await global.testRequest.post("/api/v1/users").send(user);

    const response = await global.testRequest
      .post("/api/v1/sessions")
      .send(userWithWrongCredentials);

    expect(response.status).toBe(401);
  });

  it("should be able to recover user profile data when user is authenticated", async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await global.testRequest.post("/api/v1/users").send(user);

    const response = await global.testRequest
      .post("/api/v1/sessions")
      .send(user);

    const { token } = response.body;

    const profileResponse = await global.testRequest
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty("id");
    expect(profileResponse.body.email).toBe(user.email);
  });
});
