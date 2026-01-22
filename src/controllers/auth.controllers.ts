import { createAccessToken, createRefreshToken, hashPassword } from '../utils/helper';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';

const signUp = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
/*
  1. Validate input
  2. check if user exists
  3. hash password
  4. store user in DB
  5. return success response
*/
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during sign up:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const login = async (req: Request, res: Response) => {
/*
    1. Validate input
    2. check if user exists
    3. compare password
    4. return success response with token
    5. handle errors
*/
  const { email, password } = req.body;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!isUserExists) {
    return res.status(404).json({ statusCode: 404, success: false, message: 'User not found' });
  }
  const isPasswordValid = await bcrypt.compare(password, isUserExists.password);
  if (!isPasswordValid) {
    return res.status(401).json({ statusCode: 401, success: false, message: 'Invalid password' });
  }
  const accessToken = createAccessToken({ userId: isUserExists.id });
  const refreshToken = createRefreshToken({ userId: isUserExists.id });
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      id: isUserExists.id,
      fullName: isUserExists.fullName,
      email: isUserExists.email,
      userType: isUserExists.userType,
      accessToken,
      refreshToken,
    },
  });
};

export { signUp, login };
