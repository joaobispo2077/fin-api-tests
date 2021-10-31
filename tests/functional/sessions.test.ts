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
});
