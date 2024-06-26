import axios from 'axios';
import OperationModel from '../model/operation';
import RecordModel from '../model/record';
import UserModel from '../model/user';
import OperationService, { OperationType, IOperationResult } from './operation';

jest.mock('axios');
jest.mock('../model/operation');
jest.mock('../model/record');
jest.mock('../model/user');

describe('OperationService', () => {
    const mockUser = { id: 1, user_balance: 100 };
    const mockOperation = { id: 1, cost: 10, type: OperationType.ADDITION };
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('add', () => {
        it('should add two numbers and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.add(1, 5, 3);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.ADDITION);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 8);

            expect(result).toEqual({
                data: {
                    result: 8,
                    user_balance: 90
                }
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });
            const result = await OperationService.divide(1, 5, 3);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });

    describe('substract', () => {
        it('should substract two numbers and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.substract(1, 5, 3);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.SUBSTRACTION);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 2);

            expect(result).toEqual({
                data: {
                    result: 2,
                    user_balance: 90
                }
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });
            const result = await OperationService.divide(1, 5, 3);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });

    describe('multiply', () => {
        it('should multiply two numbers and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.multiply(1, 5, 3);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.MULTIPLICATION);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 15);

            expect(result).toEqual({
                data: {
                    result: 15,
                    user_balance: 90
                }
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });

            const result = await OperationService.divide(1, 5, 3);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });

    describe('divide', () => {
        it('should divide two numbers and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.divide(1, 6, 3);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.DIVISION);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 2);

            expect(result).toEqual({
                data: {
                    result: 2,
                    user_balance: 90
                }
            });
        });

        it('should return an error for division by zero', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.divide(1, 6, 0);

            expect(result).toEqual({
                error: 'Error division by zero'
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });
            const result = await OperationService.divide(1, 6, 3);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });

    describe('squareRoot', () => {
        it('should calculate the square root and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);

            const result = await OperationService.squareRoot(1, 16);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.SQUARE_ROOT);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 4);

            expect(result).toEqual({
                data: {
                    result: 4,
                    user_balance: 90
                }
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });

            const result = await OperationService.squareRoot(1, 16);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });

    describe('randomString', () => {
        it('should fetch a random string and update user balance', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue(mockUser);
            (axios.get as jest.Mock).mockResolvedValue({ data: 'randomString' });

            const result = await OperationService.randomString(1);

            expect(OperationModel.findByType).toHaveBeenCalledWith(OperationType.RANDOM_STRING);
            expect(UserModel.getById).toHaveBeenCalledWith(1);
            expect(RecordModel.insert).toHaveBeenCalledWith(1, 1, 10, 90, 'randomString');

            expect(result).toEqual({
                data: {
                    result: 'randomString',
                    user_balance: 90
                }
            });
        });

        it('should throw an error if user balance is insufficient', async () => {
            (OperationModel.findByType as jest.Mock).mockResolvedValue(mockOperation);
            (UserModel.getById as jest.Mock).mockResolvedValue({ ...mockUser, user_balance: 5 });
            const result = await OperationService.randomString(1);
            expect(result.error).toBe('Err. Operation cost: 10. Your balance: 5');
        });
    });
});
