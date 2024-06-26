import { NextApiRequest, NextApiResponse } from 'next';
import session from '@/middlewares/session';
import RecordService from '@/lib/service/record';

const handler = async (req: NextApiRequest & { userId: number }, res: NextApiResponse) => {
    const {
        method,
        userId,
        query: { id: recordId }
    } = req;
    
    if (method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    if (!recordId) {
        return res.status(400).json({ message: "recordId is required" });
    }

    try {
        // Delete the record with the provided ID
        await RecordService.deleteRecord(userId, parseInt(recordId as string));
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (err) {
        console.error("An error occurred: ", err);
        res.status(500).json({ message: "Unable to delete Record" });
    }
}

export default session(handler);