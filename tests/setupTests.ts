import { App } from "../src/app";
import supertest from "supertest";

let app: App;
beforeAll(async () => {
  console.log("setupTests");
  app = new App();
  await app.init();

  global.testRequest = supertest(app.getApp());
});

afterAll(async () => {
  console.log("teardownTests");
  await app.close();
});
