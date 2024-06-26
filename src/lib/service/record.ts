import RecordModel from "../model/record";

class RecordService {
    static async getAll(userId: number, page?: number, pageSize?: number) {
        return RecordModel.getAllByUserId(userId, page, pageSize);
    }

    static async deleteRecord(userId: number, recordId: number): Promise<void> {
        return RecordModel.delete(userId, recordId);
    }
}

export default RecordService;