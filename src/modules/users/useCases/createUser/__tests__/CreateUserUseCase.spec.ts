import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../CreateUserUseCase";
import faker from 'faker';

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
});
