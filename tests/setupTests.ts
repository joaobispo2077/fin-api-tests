import { app } from "../src/app";
import supertest from "supertest";
import { getConnection } from "typeorm";

beforeAll(async () => {
  console.log("setupTests");
  global.testRequest = supertest(app);
});

afterAll(async () => {
  console.log("teardownTests");
  const connection = getConnection();
  await connection.close();
});
