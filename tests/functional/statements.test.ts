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

  it("should be able to withdraw when user is authenticated and has sufficient amount", async () => {
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
        min: 900,
        max: 1000,
      }),
      description: faker.lorem.sentence(),
    };

    await global.testRequest
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send(depositPayload);

    const withdrawPayload = {
      amount: faker.datatype.number({
        min: 20,
        max: 50,
      }),
      description: faker.lorem.sentence(),
    };

    const withdrawResponse = await global.testRequest
      .post("/api/v1/statements/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send(withdrawPayload);

    expect(withdrawResponse.status).toBe(201);
    expect(withdrawResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        type: "withdraw",
        amount: expect.any(Number),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });

  it("should be able to get statement detail when user is authenticated", async () => {
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

    const statementResponse = await global.testRequest
      .get(`/api/v1/statements/${depositResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(statementResponse.status).toBe(200);
    expect(statementResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        type: "deposit",
        amount: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });

  it("should be able to transfer amount to other users when user is authenticated", async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const otherUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await global.testRequest.post("/api/v1/users").send(user);
    await global.testRequest.post("/api/v1/users").send(otherUser);

    const responseAuthOtherUser = await global.testRequest
      .post("/api/v1/sessions")
      .send(otherUser);

    const { token: tokenFromOtherUser } = responseAuthOtherUser.body;

    const profileResponseFromOtherUser = await global.testRequest
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${tokenFromOtherUser}`);

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

    const transferPayload = {
      amount: faker.datatype.number({
        min: 10,
        max: 40,
      }),
      description: faker.lorem.sentence(),
    };

    const statementResponse = await global.testRequest
      .post(
        `/api/v1/statements/transfer/${profileResponseFromOtherUser.body.id}`
      )
      .set("Authorization", `Bearer ${token}`)
      .send(transferPayload);

    expect(statementResponse.status).toBe(201);
    expect(statementResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        sender_id: expect.any(String),
        type: "transfer",
        amount: expect.any(Number),
        description: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });
});
