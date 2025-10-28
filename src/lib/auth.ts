import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb'
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    forgetPasswordEnabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'VISITOR',
        input: false,
      }
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Implementar envio de email aqui
      console.log(`Enviar email para ${user.email} com link: ${url}`);
    }
  },
  secret: process.env.BETTER_AUTH_SECRET!,
});