import axios from 'axios';
import OperationModel from '../model/operation';
import RecordModel from '../model/record';
import UserModel from '../model/user';

export enum OperationType {
    RANDOM_STRING = 'RANDOM_STRING',
    SQUARE_ROOT = 'SQUARE_ROOT',
    DIVISION = 'DIVISION',
    MULTIPLICATION = 'MULTIPLICATION',
    SUBSTRACTION = 'SUBSTRACTION',
    ADDITION = 'ADDITION'
}

export interface IOperationResult {
    data?: {
        result: number;
        user_balance: number;
    },
    error?: string
}

class OperationService {
    static async add(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.ADDITION);
        if (!operation) {
            throw new Error('Operation ADDITION not found');
        }

        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }
        const result = operand1 + operand2;
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);
        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }

    static async substract(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.SUBSTRACTION);
        if (!operation) {
            throw new Error('Operation SUBSTRACTION not found');
        }

        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }
        const result = operand1 - operand2;
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);
        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }

    static async multiply(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.MULTIPLICATION);
        if (!operation) {
            throw new Error('Operation MULTIPLICATION not found');
        }

        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }
        const result = operand1 * operand2;
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);
        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }

    static async divide(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.DIVISION);
        if (!operation) {
            throw new Error('Operation DIVISION not found');
        }
        
        if (operand2 === 0) {
            return {
                error: 'Error division by zero'
            }
        }

        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }
        const result = operand1 / operand2;
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);

        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }

    static async squareRoot(userId: number, operand1: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.SQUARE_ROOT);
        if (!operation) {
            throw new Error('Operation SQUARE_ROOT not found');
        }
        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }

        const result = Math.sqrt(operand1);
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);
        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }

    static async randomString(userId: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.RANDOM_STRING);
        if (!operation) {
            throw new Error(`Operation RANDOM_STRING not found`);
        }

        const user = await UserModel.getById(userId);
        if (user.user_balance <= 0) {
            return { error: 'Err. User balance must be greater than 0' }
        }
        const updatedBalance = user.user_balance - operation.cost;
        if (updatedBalance < 0) {
            return { error: `Err. Operation cost: ${operation.cost}. Your balance: ${user.user_balance}` }
        }

        const { data: result } = await axios.get(process.env.URL_RANDOM_STR_SERVICE as string);
        await RecordModel.insert(operation.id, user.id, operation.cost, updatedBalance, result);
        return {
            data: {
                result,
                user_balance: updatedBalance,
            }
        };
    }
}

export default OperationService;
