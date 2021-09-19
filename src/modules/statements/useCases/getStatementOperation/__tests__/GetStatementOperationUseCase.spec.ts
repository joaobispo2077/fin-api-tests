

import faker from 'faker';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { OperationType } from '../../../entities/Statement';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../../createStatement/ICreateStatementDTO';
import { GetStatementOperationError } from '../GetStatementOperationError';
import { GetStatementOperationUseCase } from '../GetStatementOperationUseCase';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const statementsRepositoryInMemory = new InMemoryStatementsRepository();

const createStatementUseCase = new CreateStatementUseCase(
  usersRepositoryInMemory,
  statementsRepositoryInMemory
);

const sutGetStatementOperationUseCase = new GetStatementOperationUseCase(
  usersRepositoryInMemory,
  statementsRepositoryInMemory
);

describe('Use case - [GetStatementOperationUseCases]', () => {
  it('should be able to get statement by id and user id', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const statement: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number({
        'min': 50,
        'max': 250
      }),
      type: OperationType.DEPOSIT,
    };

    const createdStatement = await createStatementUseCase.execute(statement);

    const recoveredStatement = await sutGetStatementOperationUseCase.execute({
      statement_id: createdStatement.id as string,
      user_id: createdUser.id as string
    });

    expect(recoveredStatement).toEqual(createdStatement);
  });

  it('should not be able to get statement by id and user id if there is no statement', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    await expect(sutGetStatementOperationUseCase.execute({
      statement_id: faker.datatype.uuid(),
      user_id: createdUser.id as string
    }))
      .rejects
      .toEqual(new GetStatementOperationError.StatementNotFound());
  });


  it('should not be able to get statement by id and user id if there is no user', async () => {
    await expect(sutGetStatementOperationUseCase.execute({
      statement_id: faker.datatype.uuid(),
      user_id: faker.datatype.uuid()
    }))
      .rejects
      .toEqual(new GetStatementOperationError.UserNotFound());
  });
});
