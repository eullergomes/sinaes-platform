import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { sendResetPasswordEmail } from './email';

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
		forgetPasswordEnabled: true,
		sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
      console.log(`Enviar email para ${user.email} com link: ${url}`);
    },

		onPasswordReset: async ({ user }, request) => {
			console.log(`[RESET PASSWORD] Senha redefinida para ${user.email}`);
      console.log('request: ', request);
		},
		resetPasswordTokenExpiresIn: 3600,
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
			console.log(`Enviar email para ${user.email} com link: ${url}`);
		}
	},
	baseURL: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET!,
});