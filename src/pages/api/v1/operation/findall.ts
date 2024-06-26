import { NextApiRequest, NextApiResponse } from 'next';
import session from '@/middlewares/session';
import RecordService from '@/lib/service/record';

const handler = async (req: NextApiRequest & { userId?: number }, res: NextApiResponse) => {
    const pageIndex = req.query.page_index as number | undefined;
    const pageSize = req.query.page_size as number | undefined;
    const { userId } = req
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const [records, totalRows] = await RecordService.getAll(userId, pageIndex, pageSize);
        return res.status(200).json({
            records,
            totalRows
        });
    } catch (err: any) {
        return res.status(500).json({ message: `Operation Server Error: ${err.message}`});
    }
};

export default session(handler);