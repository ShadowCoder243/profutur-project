import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  studentProfiles, 
  centerProfiles, 
  ambassadorProfiles,
  InsertStudentProfile,
  InsertCenterProfile,
  InsertAmbassadorProfile
} from "../../drizzle/schema";

export const authRouter = router({
  // Create student profile after registration
  createStudentProfile: protectedProcedure
    .input(z.object({
      specialization: z.string().optional(),
      bio: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const profileData: InsertStudentProfile = {
        userId: ctx.user.id,
        specialization: input.specialization,
        bio: input.bio,
        skills: "[]",
        completedFormations: 0,
        totalHoursLearned: 0,
      };

      await db.insert(studentProfiles).values(profileData);
      return { success: true, userId: ctx.user.id };
    }),

  // Create center profile after registration
  createCenterProfile: protectedProcedure
    .input(z.object({
      centerName: z.string(),
      description: z.string().optional(),
      location: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const profileData: InsertCenterProfile = {
        userId: ctx.user.id,
        centerName: input.centerName,
        description: input.description,
        location: input.location,
        phone: input.phone,
        website: input.website,
        logo: null,
        totalStudents: 0,
        totalFormations: 0,
        rating: "0",
        isVerified: false,
      };

      await db.insert(centerProfiles).values(profileData);
      return { success: true, userId: ctx.user.id };
    }),

  // Create ambassador profile after registration
  createAmbassadorProfile: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const profileData: InsertAmbassadorProfile = {
        userId: ctx.user.id,
        networkSize: 0,
        totalCommissions: "0",
        referrals: 0,
        status: "active",
      };

      await db.insert(ambassadorProfiles).values(profileData);
      return { success: true, userId: ctx.user.id };
    }),
});
