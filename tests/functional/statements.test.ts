import faker from "faker";

describe("Statements functional tests", () => {
  it("should be able to deposit when user is authenticated", async () => {
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

    const depositPayload = {
      amount: faker.datatype.number({
        min: 10,
        max: 1000,
      }),
      description: faker.lorem.sentence(),
    };

    const depositResponse = await global.testRequest
      .post("/api/v1/statements/deposit")

      .set("Authorization", `Bearer ${token}`)
      .send(depositPayload);

    expect(depositResponse.status).toBe(201);
    expect(depositResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        type: "deposit",
        amount: expect.any(Number),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });

  it("should be able to get balance when user is authenticated", async () => {
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

    const depositPayload = {
      amount: faker.datatype.number({
        min: 10,
        max: 1000,
      }),
      description: faker.lorem.sentence(),
    };

    await global.testRequest
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send(depositPayload);

    const balanceResponse = await global.testRequest
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${token}`);

    expect(balanceResponse.status).toBe(200);
    expect(balanceResponse.body).toEqual(
      expect.objectContaining({
        balance: expect.any(Number),
        statement: expect.any(Array),
      })
    );
  });
});
