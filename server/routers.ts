import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { formationsRouter } from "./routers/formations";
import { profilesRouter } from "./routers/profiles";
import { authRouter } from "./routers/auth";
import { enrollmentsRouter } from "./routers/enrollments";
import { paymentsRouter } from "./routers/payments";
import { webhooksRouter } from "./routers/webhooks";
import { enrollments } from "../drizzle/schema";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  formations: formationsRouter,
  profiles: profilesRouter,
  authProfile: authRouter,
  enrollments: enrollmentsRouter,
  payments: paymentsRouter,
  webhooks: webhooksRouter,
});

export type AppRouter = typeof appRouter;
