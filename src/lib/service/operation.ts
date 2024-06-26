import axios from 'axios';
import OperationModel from '../model/operation';
import RecordModel, { TransactionError } from '../model/record';
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
        try {
            const result = operand1 + operand2;
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);
            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
    }

    static async substract(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.SUBSTRACTION);
        if (!operation) {
            throw new Error('Operation SUBSTRACTION not found');
        }

        try {
            const result = operand1 - operand2;
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);
            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
    }

    static async multiply(userId: number, operand1: number, operand2: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.MULTIPLICATION);
        if (!operation) {
            throw new Error('Operation MULTIPLICATION not found');
        }

        try {
            const result = operand1 * operand2;
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);
            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };   
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
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

        try {
            const result = operand1 / operand2;
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);
    
            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };  
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
    }

    static async squareRoot(userId: number, operand1: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.SQUARE_ROOT);
        if (!operation) {
            throw new Error('Operation SQUARE_ROOT not found');
        }

        if (operand1 < 0) {
            return { error: 'Err. Square root of a negative number' };
        }

        try {
            const result = Math.sqrt(operand1);
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);

            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
    }

    static async randomString(userId: number): Promise<IOperationResult> {
        const operation = await OperationModel.findByType(OperationType.RANDOM_STRING);
        if (!operation) {
            throw new Error(`Operation RANDOM_STRING not found`);
        }

        try {
            const { data: result } = await axios.get(process.env.URL_RANDOM_STR_SERVICE as string);
            const newBalance = await RecordModel.insert(operation.id, userId, operation.cost, result);
            return {
                data: {
                    result,
                    user_balance: newBalance,
                }
            };
        } catch (err) {
            if (err instanceof TransactionError) {
                return {
                    error: err.message
                }
            }

            throw err;
        }
    }
}

export default OperationService;
