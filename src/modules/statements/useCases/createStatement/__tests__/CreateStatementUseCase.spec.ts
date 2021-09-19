import faker from 'faker';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { ICreateStatementDTO } from '../ICreateStatementDTO';
import { CreateStatementUseCase } from '../CreateStatementUseCase';
import { OperationType } from '../../../entities/Statement';

const usersRepositoryInMemory = new InMemoryUsersRepository();
const statementsRepositoryInMemory = new InMemoryStatementsRepository();

const sutCreateStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);

const configMockHigherAmount = {
  'min': 1200,
  'max': 900
};

const configMockMediumAmount = {
  'min': 500,
  'max': 700
};

const configMockLowerAmount = {
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
      amount: faker.datatype.number(configMockMediumAmount),
      type: OperationType.DEPOSIT,
    };

    const statementResult = await sutCreateStatementUseCase.execute(statement);

    const expectedStatementResult = {
      ...statement,
      id: expect.any(String),
    };

    expect(statementResult).toEqual(expectedStatementResult);
  });
});
