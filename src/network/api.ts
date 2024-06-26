import { API_URL, axios, axiosInstance } from './axiosinstance';
import { OperationType, Record } from './types';

export const UserAPI = {
  loginUser: async (username: string, password: string): Promise<{ token: string }> => {
    const url = `${API_URL}/auth/login`;
    const response = await axios.post(url, {
        username,
        password
    });
    return response.data;
  },
  registerUser: async (username: string, password: string): Promise<{ token: string }> => {
    const url = `${API_URL}/auth/signup`;
    const response = await axios.post(url, {
        username,
        password
    });
    return response.data;
  },
}

interface ApiResponse {
  records: Record[];
  totalRows: number;
}

export const OperationAPI = {
  findAll: async (pageIndex: number, pageSize: number): Promise<ApiResponse> => {
    const url = `/operation/findall?page_index=${pageIndex}&page_size=${pageSize}`;
    const response = await axiosInstance.get(url);
    return response.data as ApiResponse;
  },
  executeOperation: async (operation: OperationType, operand1: number | null, operand2: number | null): Promise<{ result: number, user_balance: number }> => {
    const response = await axiosInstance
    .post('/operation', {
      operation,
      operand1, 
      operand2
    })

    return response.data;
  },
  delete: async (operationId: number): Promise<void> => {
    await axiosInstance.delete(`/operation/${operationId}`)
  },
  fixUserBalance: async (): Promise<number> => {
    const { data } = await axiosInstance.post('/operation/fixbalance')
    return data
  }
};