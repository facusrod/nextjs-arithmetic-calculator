import RecordService from './record';
import RecordModel, { Record } from '../model/record';

// Mocking RecordModel methods
jest.mock('../model/record', () => ({
  getAllByUserId: jest.fn(),
  delete: jest.fn(),
}));

describe('RecordService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call RecordModel.getAllByUserId with correct arguments', async () => {
      const userId = 1;
      const page = 1;
      const pageSize = 10;
      const mockRecords: Record[] = [
        { id: 1, operation_id: 1, user_id: 1, amount: 100, operation_response: 'Success', user_balance: 500, date: '2024-06-25', deleted: false },
        { id: 2, operation_id: 2, user_id: 1, amount: 50, operation_response: 'Success', user_balance: 450, date: '2024-06-24', deleted: false },
      ];
      const totalCount = 2;

      // Mock the implementation of getAllByUserId
      (RecordModel.getAllByUserId as jest.Mock).mockResolvedValueOnce([mockRecords, totalCount]);

      const result = await RecordService.getAll(userId, page, pageSize);

      expect(RecordModel.getAllByUserId).toHaveBeenCalledWith(userId, page, pageSize);
      expect(result).toEqual([mockRecords, totalCount]);
    });
  });

  describe('deleteRecord', () => {
    it('should call RecordModel.delete with correct arguments', async () => {
      const userId = 1;
      const recordId = 1;

      // Mock the implementation of delete
      (RecordModel.delete as jest.Mock).mockResolvedValueOnce(undefined);

      await RecordService.deleteRecord(userId, recordId);

      expect(RecordModel.delete).toHaveBeenCalledWith(userId, recordId);
    });
  });
});