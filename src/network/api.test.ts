import { API_URL, axiosInstance, axios } from './axiosinstance';
import { UserAPI, OperationAPI } from './api';
import { OperationType, Record } from './types';

jest.mock('./axiosinstance');

describe('UserAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login user and return a token', async () => {
    const mockToken = 'mock-token';
    const response = { data: { token: mockToken } };
    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await UserAPI.loginUser('testuser', 'testpassword');

    expect(result).toEqual({ token: mockToken });
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'testpassword'
    });
  });

  it('should register user and return a token', async () => {
    const mockToken = 'mock-token';
    const response = { data: { token: mockToken } };
    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await UserAPI.registerUser('testuser', 'testpassword');

    expect(result).toEqual({ token: mockToken });
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/auth/signup`, {
      username: 'testuser',
      password: 'testpassword'
    });
  });
});

describe('OperationAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all operations', async () => {
    const mockRecords: Record[] = [
      { id: 1, type: OperationType.ADDITION, amount: 10, user_balance: 100, date: '2023-01-01' }
    ];
    const mockTotalRows = 1;
    const response = { data: { records: mockRecords, totalRows: mockTotalRows } };
    (axiosInstance.get as jest.Mock).mockResolvedValue(response);

    const result = await OperationAPI.findAll(1, 10);

    expect(result).toEqual({ records: mockRecords, totalRows: mockTotalRows });
    expect(axiosInstance.get).toHaveBeenCalledWith('/operation/findall?page_index=1&page_size=10');
  });

  it('should execute operation and return result and user balance', async () => {
    const mockResult = 10;
    const mockUserBalance = 90;
    const response = { data: { result: mockResult, user_balance: mockUserBalance } };
    (axiosInstance.post as jest.Mock).mockResolvedValue(response);

    const result = await OperationAPI.executeOperation(OperationType.ADDITION, 5, 5);

    expect(result).toEqual({ result: mockResult, user_balance: mockUserBalance });
    expect(axiosInstance.post).toHaveBeenCalledWith('/operation/', {
      operation: OperationType.ADDITION,
      operand1: 5,
      operand2: 5
    });
  });

  it('should delete an operation', async () => {
    (axiosInstance.delete as jest.Mock).mockResolvedValue({});
    await OperationAPI.delete(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/operation/1');
  });
});
