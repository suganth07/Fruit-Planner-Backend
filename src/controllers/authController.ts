import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/database';
import { ApiResponse, MedicalCondition } from '../types';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  conditions: z.array(z.nativeEnum(MedicalCondition)).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const generateToken = (userId: number): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const signOptions: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as SignOptions;
  
  return jwt.sign({ userId }, jwtSecret, signOptions);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, conditions = [] } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User with this email already exists'
      };
      res.status(400).json(response);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        conditions: conditions as string[]
      },
      select: {
        id: true,
        email: true,
        name: true,
        conditions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        token
      },
      message: 'User registered successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      const response: ApiResponse = {
        success: false,
        error: error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        conditions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          conditions: user.conditions,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      const response: ApiResponse = {
        success: false,
        error: error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Since we're using stateless JWT, logout is handled client-side
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };
  res.json(response);
};
