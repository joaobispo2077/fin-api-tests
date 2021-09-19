

import faker from 'faker';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { OperationType } from '../../../entities/Statement';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../../createStatement/ICreateStatementDTO';
import { GetBalanceError } from '../GetBalanceError';
import { GetBalanceUseCase } from '../GetBalanceUseCase';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const statementsRepositoryInMemory = new InMemoryStatementsRepository();

const createStatementUseCase = new CreateStatementUseCase(
  usersRepositoryInMemory,
  statementsRepositoryInMemory
);

const sutGetBalanceUseCase = new GetBalanceUseCase(
  statementsRepositoryInMemory,
  usersRepositoryInMemory
);

describe('Use case - [GetBalanceUseCase]', () => {
  it('should be able to get balance from user with some statements', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const randomListSize = Array
      .from(Array(faker.datatype.number({
          'min': 3,
          'max': 6
      }))
      .keys());

    const statements: ICreateStatementDTO[] = randomListSize.map(() => ({
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number({
        'min': 50,
        'max': 250
      }),
      type: OperationType.DEPOSIT,
    }));

    const createdStatements = await Promise.all(
      statements.map(async statement => await createStatementUseCase.execute(statement))
    );

    const expectedBalanceResponse = {
      statement: createdStatements,
      balance: expect.any(Number)
    };

    const balance = await sutGetBalanceUseCase.execute({ user_id: createdUser.id as string });
    expect(balance).toEqual(expect.objectContaining(expectedBalanceResponse));
  });

  it('should not be able to get balance from user that not exists', async () => {

    await expect(sutGetBalanceUseCase.execute({ user_id: faker.datatype.uuid() }))
      .rejects
      .toEqual(new GetBalanceError());
  });
});
