import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { filterClientUser } from "../../utils/filterUser";

// Create a new ratelimiter, that allows 10 requests per 10 seconds

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        key: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        [input.key]: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find user`,
        });
      }
      return filterClientUser(user);
    }),
});
