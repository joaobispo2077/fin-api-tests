import faker from 'faker';

import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { CreateUserError } from "../CreateUserError";

const usersRepositoryInMemory = new InMemoryUsersRepository();
const sutCreateUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

describe('Use case - [CreateUserUseCase]', () => {
  it('should be able to create a new user', async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    console.log('user is ', user);

    const createdUser = await sutCreateUserUseCase.execute(user);

    const expectedUser = {
      id: expect.any(String),
      name: user.name,
      email: user.email,
      password: expect.any(String),
    };

    expect(createdUser).toEqual(expect.objectContaining(expectedUser));
  });

  it('should not be able to create a user with an email that already exists', async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    await sutCreateUserUseCase.execute(user);

    await expect(sutCreateUserUseCase.execute(user)).rejects.toEqual(
      new CreateUserError()
    );
  });
});
