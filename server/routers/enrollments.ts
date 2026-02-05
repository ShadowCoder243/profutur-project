import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  enrollments,
  formations,
  certificates,
  studentProfiles,
  InsertEnrollment,
  InsertCertificate
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const enrollmentsRouter = router({
  // Enroll student in a formation
  enrollInFormation: protectedProcedure
    .input(z.object({
      formationId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if already enrolled
      const existing = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.studentId, ctx.user.id),
            eq(enrollments.formationId, input.formationId)
          )
        );

      if (existing.length > 0) {
        throw new Error("Already enrolled in this formation");
      }

      // Create enrollment
      const enrollmentData: InsertEnrollment = {
        studentId: ctx.user.id,
        formationId: input.formationId,
        status: "active",
        progress: 0,
        enrolledAt: new Date(),
        completedAt: null,
        certificateIssued: false,
      };

      await db.insert(enrollments).values(enrollmentData);
      
      // Update formation's current students count
      const formation = await db
        .select()
        .from(formations)
        .where(eq(formations.id, input.formationId));

      if (formation.length > 0) {
        await db
          .update(formations)
          .set({ currentStudents: (formation[0].currentStudents || 0) + 1 })
          .where(eq(formations.id, input.formationId));
      }

      return { success: true, message: "Enrolled successfully" };
    }),

  // Update enrollment progress
  updateProgress: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
      progress: z.number().min(0).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, input.enrollmentId));

      if (enrollment.length === 0 || enrollment[0].studentId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Update progress
      let status = enrollment[0].status;
      let completedAt = enrollment[0].completedAt;

      if (input.progress === 100) {
        status = "completed";
        completedAt = new Date();
      }

      await db
        .update(enrollments)
        .set({
          progress: input.progress,
          status,
          completedAt,
        })
        .where(eq(enrollments.id, input.enrollmentId));

      return { success: true, progress: input.progress, status };
    }),

  // Issue certificate when formation is completed
  issueCertificate: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify enrollment is completed
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, input.enrollmentId));

      if (enrollment.length === 0 || enrollment[0].studentId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      if (enrollment[0].progress !== 100) {
        throw new Error("Formation not completed");
      }

      // Generate certificate number
      const certificateNumber = `CERT-${Date.now()}-${ctx.user.id}`;

      // Create certificate
      const certificateData: InsertCertificate = {
        enrollmentId: input.enrollmentId,
        certificateNumber,
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        verificationUrl: `https://profutur.example.com/verify/${certificateNumber}`,
      };

      await db.insert(certificates).values(certificateData);

      // Mark certificate as issued
      await db
        .update(enrollments)
        .set({ certificateIssued: true })
        .where(eq(enrollments.id, input.enrollmentId));

      // Update student profile
      const profile = await db
        .select()
        .from(studentProfiles)
        .where(eq(studentProfiles.userId, ctx.user.id));

      if (profile.length > 0) {
        const formation = await db
          .select()
          .from(formations)
          .where(eq(formations.id, enrollment[0].formationId));

        const newHours = (profile[0].totalHoursLearned || 0) + (formation[0]?.duration || 0);

        await db
          .update(studentProfiles)
          .set({
            completedFormations: (profile[0].completedFormations || 0) + 1,
            totalHoursLearned: newHours,
          })
          .where(eq(studentProfiles.userId, ctx.user.id));
      }

      return {
        success: true,
        certificateNumber,
      };
    }),

  // Get my enrollments
  getMyEnrollments: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const myEnrollments = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.studentId, ctx.user.id));

      // Fetch formation details for each enrollment
      const enriched = await Promise.all(
        myEnrollments.map(async (enrollment) => {
          const formation = await db
            .select()
            .from(formations)
            .where(eq(formations.id, enrollment.formationId));

          return {
            ...enrollment,
            formation: formation[0] || null,
          };
        })
      );

      return enriched;
    }),
});
