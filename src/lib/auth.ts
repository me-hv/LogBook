import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "author",
        input: false, // Turn off client input for role selection to prevent privilege escalation
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userCount = await prisma.user.count();
          const assignedRole = userCount === 0 ? "admin" : "author";
          return {
            data: {
              ...user,
              role: assignedRole,
            },
          };
        },
      },
    },
  },
});
