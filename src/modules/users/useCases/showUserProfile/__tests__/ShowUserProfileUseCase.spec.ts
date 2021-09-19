import faker from 'faker';

import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from '../ShowUserProfileError';
import { ShowUserProfileUseCase } from '../ShowUserProfileUseCase';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const sutShowUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);

describe('Use case - [ShowUserProfileUseCase]', () => {
  it('should be able to show user profile by user id', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const user = await sutShowUserProfileUseCase.execute(createdUser.id as string);

    const expectedUser = {
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
    };

    expect(user).toEqual(expect.objectContaining(expectedUser));
  });

  it('should not be able to show user profile by user id that not exists', async () => {
    await expect(sutShowUserProfileUseCase.execute(faker.datatype.uuid()))
      .rejects
      .toEqual(new ShowUserProfileError());
  });
});
