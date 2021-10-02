import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { sender_id } = request.params;

    const splittedPath = request.originalUrl
      .replace(`/${sender_id}`, "")
      .split("/");
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    if (type === OperationType.TRANSFER) {
      await createStatement.execute({
        user_id: sender_id,
        sender_id: user_id,
        type: OperationType.DEPOSIT,
        amount,
        description,
      });
    }

    return response.status(201).json(statement);
  }
}
