import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import UserService from '@/lib/service/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Validate name, email, and password
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide a username and password' });
  }

  try {
    // Create the user in the database
    const { data, error } = await UserService.createUser(username, password);

    if (error) {
      res.status(400).json({ message: error });
    }

    // Create session for the user
    const token = jwt.sign({ userId: data?.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(201).json({ message: 'Registration successful', token });
  } catch (err: any) {
    return res.status(500).json({ message: `Unexpected Auth Error: ${err.message}`});
  }
}