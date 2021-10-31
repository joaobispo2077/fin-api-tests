import { App } from "./app";

(async () => {
  const app = new App();
  await app.init();
  app.start();
})();
