import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Function to create a new user
export async function createUser(name: string, email: string, rawPassword: string) {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Create user with hashed password
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};
