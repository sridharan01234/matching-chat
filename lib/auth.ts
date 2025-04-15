import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from '../types/user';

const prisma = new PrismaClient();

export type AuthResult = {
  success: boolean;
  user?: User;
  error?: string;
};

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Input validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    if (!email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify password
    if (!user.password) {
      return {
        success: false,
        error: 'User account is not properly configured'
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid password'
      };
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during authentication'
    };
  }
}

// Example usage:
/*
const user = await authenticateUser('alice@example.com', 'alice123');
if (user) {
  console.log('Authentication successful:', user);
} else {
  console.log('Authentication failed');
}
*/
