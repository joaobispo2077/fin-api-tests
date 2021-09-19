import faker from 'faker';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { ICreateStatementDTO } from '../ICreateStatementDTO';
import { CreateStatementUseCase } from '../CreateStatementUseCase';
import { OperationType } from '../../../entities/Statement';
import { rejects } from 'assert';
import { CreateStatementError } from '../CreateStatementError';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const statementsRepositoryInMemory = new InMemoryStatementsRepository();

const sutCreateStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

const higherAmount = {
  'min': 1200,
  'max': 900
};

const mediumAmount = {
  'min': 500,
  'max': 700
};

const lowerAmount = {
  'min': 2,
  'max': 50
};

describe('Use case - [CreateStatementUseCase]', () => {
  it('should be able to create a deposit statement', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const statement: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number(mediumAmount),
      type: OperationType.DEPOSIT,
    };

    const statementResult = await sutCreateStatementUseCase.execute(statement);

    const expectedStatementResult = {
      ...statement,
      id: expect.any(String),
    };

    expect(statementResult).toEqual(expectedStatementResult);
  });

  it('should be able to create a withdraw statement if have sufficient amount', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const statementDeposit: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number(mediumAmount),
      type: OperationType.DEPOSIT,
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number(lowerAmount),
      type: OperationType.WITHDRAW,
    };

    await sutCreateStatementUseCase.execute(statementDeposit);

    const statementWidthdrawResult = await sutCreateStatementUseCase.execute(statementWithdraw);

    const expectedStatementResult = {
      ...statementWidthdrawResult,
      id: expect.any(String),
    };

    expect(statementWidthdrawResult).toEqual(expectedStatementResult);
  });

  it('should not be able to create a withdraw statement if there is no sufficient amount', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const statementDeposit: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number(lowerAmount),
      type: OperationType.DEPOSIT,
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: createdUser.id as string,
      description: faker.lorem.words(),
      amount: faker.datatype.number(higherAmount),
      type: OperationType.WITHDRAW,
    };

    await sutCreateStatementUseCase.execute(statementDeposit);

    await expect(sutCreateStatementUseCase.execute(statementWithdraw))
      .rejects
      .toEqual(new CreateStatementError.InsufficientFunds());
  });

  it('should not be able to create a statement if user provided not exists', async () => {
    const userIdNotExists = faker.datatype.uuid();

    const statementDeposit: ICreateStatementDTO = {
      user_id: userIdNotExists,
      description: faker.lorem.words(),
      amount: faker.datatype.number(lowerAmount),
      type: OperationType.DEPOSIT,
    };

    const statementWithdraw: ICreateStatementDTO = {
      user_id: userIdNotExists,
      description: faker.lorem.words(),
      amount: faker.datatype.number(higherAmount),
      type: OperationType.WITHDRAW,
    };

    await expect(sutCreateStatementUseCase.execute(statementDeposit))
      .rejects
      .toEqual(new CreateStatementError.UserNotFound());

    await expect(sutCreateStatementUseCase.execute(statementWithdraw))
      .rejects
      .toEqual(new CreateStatementError.UserNotFound());
  });
});
