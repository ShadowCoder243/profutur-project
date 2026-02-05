import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getCenterProfile, getStudentProfile, getAmbassadorProfile } from "../db";

export const profilesRouter = router({
  // Get current user's profile based on role
  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      switch (ctx.user.role) {
        case 'center':
          return getCenterProfile(userId);
        case 'student':
          return getStudentProfile(userId);
        case 'ambassador':
          return getAmbassadorProfile(userId);
        default:
          return null;
      }
    }),

  // Get center profile by user ID
  getCenter: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getCenterProfile(input);
    }),

  // Get student profile by user ID
  getStudent: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getStudentProfile(input);
    }),

  // Get ambassador profile by user ID
  getAmbassador: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getAmbassadorProfile(input);
    }),
});
