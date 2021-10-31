import { createConnection, getConnection } from "typeorm";

export const connect = async () => await createConnection();

export const close = async () => {
  await getConnection().close();
};
