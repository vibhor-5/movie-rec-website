import { Request, Response } from 'express';
import { createUser } from '../services/userService';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser(name, email, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: 'Error creating user', error: errorMessage });
  }
};
