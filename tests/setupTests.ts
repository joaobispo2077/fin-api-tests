import { app } from "../src/app";
import supertest from 'supertest';

beforeAll(async () => {
  console.log('setupTests');
  global.testRequest = supertest(app);

});

afterAll(async () => {
  console.log('teardownTests');
});
