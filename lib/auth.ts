import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    },
  },
  trustedOrigins: ['http://localhost:3000','https://www.glotomotif.my.id'],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          await sendVerificationEmail(email, otp);
        } else if (type === "email-verification") {
          await sendVerificationEmail(email, otp);
        } else {
          await sendVerificationEmail(email, otp);
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
    }),
    nextCookies(),
  ],
  advanced: {
  cookies: {
    state: {
      attributes: {
        sameSite: "none",
        secure: true,
      }
    }
  }
}
});
