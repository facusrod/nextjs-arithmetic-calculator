import OperationService, { IOperationResult, OperationType } from '@/lib/service/operation';
import session from '@/middlewares/session';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest & { userId?: number }, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    const { operand1, operand2, operation } = req.body;

    // Validations
    if (!operation) {
      return res.status(400).json({ message: "operation is required" });
    }

    if (operation !== OperationType.RANDOM_STRING) {
      if (operand1 == null || operand1 == undefined) {
        return res.status(400).json({ message: "operand1 is required" });
      }

      if (operand1 == null || operand1 == undefined && operation !== OperationType.SQUARE_ROOT) {
        return res.status(400).json({ message: "operand2 is required" });
      }
    }

    let operationResult: IOperationResult;

    try {
        switch ((operation as string).toUpperCase()) {
        case OperationType.ADDITION:
            operationResult = await OperationService.add(userId, operand1, operand2);
            break;
        case OperationType.SUBSTRACTION:
            operationResult = await OperationService.substract(userId, operand1, operand2);
            break;
        case OperationType.MULTIPLICATION:
            operationResult = await OperationService.multiply(userId, operand1, operand2);
            break;
        case OperationType.DIVISION:
            operationResult = await OperationService.divide(userId, operand1, operand2);
            break;
        case OperationType.SQUARE_ROOT:
            operationResult = await OperationService.squareRoot(userId, operand1);
            break;
        case OperationType.RANDOM_STRING:
            operationResult = await OperationService.randomString(userId);
            break;
        default:
            return res.status(400).json({ message: "Invalid Operation Type" });
        }

        if ('error' in operationResult) {
            return res.status(400).json({ message: operationResult.error });
        }

        return res.status(200).json(operationResult.data);
    } catch (err: any) {
        return res.status(500).json({ message: `Operation Server Error: ${err.message}`});
    }
};

export default session(handler);