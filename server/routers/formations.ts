import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getFormations, getFormationById, getStudentEnrollments, getFormationEnrollments } from "../db";

export const formationsRouter = router({
  // Get all formations or filter by center
  list: publicProcedure
    .input(z.object({ centerId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return getFormations(input?.centerId);
    }),

  // Get single formation by ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getFormationById(input);
    }),

  // Get enrollments for a specific formation
  getEnrollments: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return getFormationEnrollments(input);
    }),

  // Get student's enrollments (protected)
  myEnrollments: protectedProcedure
    .query(async ({ ctx }) => {
      return getStudentEnrollments(ctx.user.id);
    }),
});
