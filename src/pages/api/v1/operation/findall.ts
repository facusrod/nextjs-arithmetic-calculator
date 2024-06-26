import { NextApiRequest, NextApiResponse } from 'next';
import session from '@/middlewares/session';
import RecordService from '@/lib/service/record';

const handler = async (req: NextApiRequest & { userId: number }, res: NextApiResponse) => {
    const pageIndex = req.query.page_index as number | undefined;
    const pageSize = req.query.page_size as number | undefined;

    try {
        const [records, totalRows] = await RecordService.getAll(req.userId, pageIndex, pageSize);
        return res.status(200).json({
            records,
            totalRows
        });
    } catch (err) {
        console.error("An error occurred: ", err);
        return res.status(500).json({ message: 'Unable to get records'});
    }
};

export default session(handler);