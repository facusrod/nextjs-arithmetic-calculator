import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export interface DecodedToken {
    userId: number;
    iat: number;
    exp: number;
}

type Handler = (req: NextApiRequest & { userId: number }, res: NextApiResponse) => Promise<void> | void;

export default function session(handler: Handler) {
    return async (req: NextApiRequest & { userId: number }, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        
            if (currentTimestamp >= decoded.exp) {
              return res.status(401).json({ message: 'Token expired' });
            }

            req.userId = decoded.userId;
            return handler(req, res);
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    };
}
