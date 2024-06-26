import UserService from '@/lib/service/user';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  // Validate email and password
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    //check password
    const { data, error } = await UserService.passIsValid(username, password);
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Create session for the user
    const token = jwt.sign({ userId: data?.id, username }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to login user'});
  }
}