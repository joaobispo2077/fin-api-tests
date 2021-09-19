import faker from 'faker';

import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../AuthenticateUserUseCase';

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

    console.log('user is',user);

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
});
