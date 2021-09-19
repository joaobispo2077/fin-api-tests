import faker from 'faker';

import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from '../IncorrectEmailOrPasswordError';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
const sutAuthenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);

describe('Use case - [AuthenticateUserUseCase]', () => {
  it('should be able to authenticate an user with correctly credentials', async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const createdUser = await createUserUseCase.execute(user);

    const auth = await sutAuthenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    const expectedAuthPayload = {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
      },
      token: expect.any(String)
    };

    expect(auth).toEqual(expect.objectContaining(expectedAuthPayload));
  });

  it('should not be able to authenticate an user with wrong credentials', async () => {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    await createUserUseCase.execute(user);

    await expect(sutAuthenticateUserUseCase.execute({
      email: user.email,
      password: user.password + 'wrong'
    })).rejects.toEqual(
      new IncorrectEmailOrPasswordError()
    );
  });
});
