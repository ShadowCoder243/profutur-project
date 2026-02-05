import { describe, it, expect, vi, beforeEach } from "vitest";
import { formationsRouter } from "./formations";
import * as db from "../db";

// Mock the database functions
vi.mock("../db", () => ({
  getFormations: vi.fn(),
  getFormationById: vi.fn(),
  getFormationEnrollments: vi.fn(),
  getStudentEnrollments: vi.fn(),
}));

describe("formationsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should return all formations when no centerId is provided", async () => {
      const mockFormations = [
        {
          id: 1,
          centerId: 1,
          title: "React Basics",
          description: "Learn React fundamentals",
          category: "Web Development",
          level: "beginner",
          duration: 40,
          price: "99.99",
          maxStudents: 30,
          currentStudents: 15,
          image: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getFormations).mockResolvedValue(mockFormations);

      const caller = formationsRouter.createCaller({});
      const result = await caller.list();

      expect(result).toEqual(mockFormations);
      expect(db.getFormations).toHaveBeenCalledWith(undefined);
    });

    it("should return formations for a specific center", async () => {
      const centerId = 1;
      const mockFormations = [
        {
          id: 1,
          centerId,
          title: "React Basics",
          description: "Learn React fundamentals",
          category: "Web Development",
          level: "beginner",
          duration: 40,
          price: "99.99",
          maxStudents: 30,
          currentStudents: 15,
          image: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getFormations).mockResolvedValue(mockFormations);

      const caller = formationsRouter.createCaller({});
      const result = await caller.list({ centerId });

      expect(result).toEqual(mockFormations);
      expect(db.getFormations).toHaveBeenCalledWith(centerId);
    });
  });

  describe("getById", () => {
    it("should return a formation by ID", async () => {
      const formationId = 1;
      const mockFormation = {
        id: formationId,
        centerId: 1,
        title: "React Basics",
        description: "Learn React fundamentals",
        category: "Web Development",
        level: "beginner",
        duration: 40,
        price: "99.99",
        maxStudents: 30,
        currentStudents: 15,
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getFormationById).mockResolvedValue(mockFormation);

      const caller = formationsRouter.createCaller({});
      const result = await caller.getById(formationId);

      expect(result).toEqual(mockFormation);
      expect(db.getFormationById).toHaveBeenCalledWith(formationId);
    });

    it("should return undefined if formation not found", async () => {
      vi.mocked(db.getFormationById).mockResolvedValue(undefined);

      const caller = formationsRouter.createCaller({});
      const result = await caller.getById(999);

      expect(result).toBeUndefined();
    });
  });

  describe("getEnrollments", () => {
    it("should return enrollments for a formation", async () => {
      const formationId = 1;
      const mockEnrollments = [
        {
          id: 1,
          studentId: 10,
          formationId,
          status: "active",
          progress: 50,
          enrolledAt: new Date(),
          completedAt: null,
          certificateIssued: false,
        },
      ];

      vi.mocked(db.getFormationEnrollments).mockResolvedValue(mockEnrollments);

      const caller = formationsRouter.createCaller({});
      const result = await caller.getEnrollments(formationId);

      expect(result).toEqual(mockEnrollments);
      expect(db.getFormationEnrollments).toHaveBeenCalledWith(formationId);
    });
  });
});
