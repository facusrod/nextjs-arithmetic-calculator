import UserService from '@/lib/service/user';
import session from '@/middlewares/session';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest & { userId: number }, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { data, error } = await UserService.restartBalanceByUserId(req.userId);
        if (error) {
            return res.status(400).json({ message: error });
        }
        return res.status(200).json(data);
    } catch (err) {
        console.error("An error occurred: ", err);
        return res.status(500).json({ message: 'Unable to fix balance'});
    }
}

export default session(handler);