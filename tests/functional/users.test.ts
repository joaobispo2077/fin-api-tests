import faker from "faker";

describe("Users functional tests", () => {
  it("should be able to create a new user with status code 201", async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await global.testRequest.post("/api/v1/users").send(user);

    expect(response.status).toBe(201);
  });
});
