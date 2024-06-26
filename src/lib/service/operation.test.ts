import axios from 'axios';
import OperationModel from '../model/operation';
import RecordModel, { TransactionError } from '../model/record';
import OperationService from './operation';
import UserModel from '../model/user';

jest.mock('axios');
jest.mock('../model/operation');
jest.mock('../model/record');
jest.mock('../model/user');

describe('OperationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add two numbers and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 5;
        const operand2 = 3;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.add(userId, operand1, operand2);

        expect(result).toEqual({
            data: {
            result: 8,
            user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('ADDITION');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 8);
    });

    it('should return an error when the operation cost exceeds user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 5;
        const operand2 = 3;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockRejectedValueOnce(new TransactionError('Insufficient balance'));

        const result = await OperationService.add(userId, operand1, operand2);
        expect(result).toEqual({
            error: '',
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('ADDITION');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 8);
    });

    it('should subtract two numbers and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 5;
        const operand2 = 3;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.substract(userId, operand1, operand2);

        expect(result).toEqual({
            data: {
            result: 2,
            user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('SUBSTRACTION');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 2);
    });

    it('should multiply two numbers and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 5;
        const operand2 = 3;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.multiply(userId, operand1, operand2);

        expect(result).toEqual({
            data: {
            result: 15,
            user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('MULTIPLICATION');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 15);
    });

    it('should return an error when dividing by zero', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 5;
        const operand2 = 0;
        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        const result = await OperationService.divide(userId, operand1, operand2);

        expect(result).toEqual({
            error: 'Error division by zero',
        });
    });

    it('should divide two numbers and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 6;
        const operand2 = 3;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.divide(userId, operand1, operand2);

        expect(result).toEqual({
            data: {
            result: 2,
            user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('DIVISION');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 2);
    });

    it('should return an error when calculating the square root of a negative number', async () => {
        const mockOperation = { id: 1, cost: 10 };

        const userId = 1;
        const operand1 = -4;
        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        const result = await OperationService.squareRoot(userId, operand1);

        expect(result).toEqual({
            error: 'Err. Square root of a negative number',
        });
    });

    it('should calculate the square root of a number and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const operand1 = 9;

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.squareRoot(userId, operand1);

        expect(result).toEqual({
            data: {
            result: 3,
            user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('SQUARE_ROOT');
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, 3);
    });

    it('should get a random string and return the result with updated user balance', async () => {
        const mockOperation = { id: 1, cost: 10 };
        const userId = 1;
        const mockString = 'abc12345';

        (OperationModel.findByType as jest.Mock).mockResolvedValueOnce(mockOperation);
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockString });
        (RecordModel.insert as jest.Mock).mockResolvedValueOnce(90);

        const result = await OperationService.randomString(userId);

        expect(result).toEqual({
            data: {
                result: mockString,
                user_balance: 90,
            }
        });
        expect(OperationModel.findByType).toHaveBeenCalledWith('RANDOM_STRING');
        expect(axios.get).toHaveBeenCalledWith(process.env.URL_RANDOM_STR_SERVICE);
        expect(RecordModel.insert).toHaveBeenCalledWith(mockOperation.id, userId, mockOperation.cost, mockString);
    });
});
