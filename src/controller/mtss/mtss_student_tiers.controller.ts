import { Request, Response } from "express";
import { MTSS_Student_Tiers } from "../../models/mtss/mtss_student_tiers.model";
import { Op } from "sequelize";

export async function createStudentTier(req: Request, res: Response) {
  try {
    const { student_id, domain_id } = req.body;

    // Logic: Enforce only ONE active tier per student per domain
    // Find any active tier (end_date is null) for this student and domain
    //can there be more than one active tier per student ? should remove domain_id from the check
    const activeTier = await MTSS_Student_Tiers.findOne({
      where: {
        student_id,
        // domain_id,
        end_date: null,
      },
    });

    // If an active tier exists, close it by setting end_date to now
    if (activeTier) {
      activeTier.end_date = new Date();
      await activeTier.save();
    }

    // Create the new tier record
    const newTier = await MTSS_Student_Tiers.create(req.body);
    res.status(201).json(newTier);
  } catch (err) {
    console.error("Error creating MTSS student tier:", err);
    res.status(500).json({ error: "Failed to create MTSS student tier" });
  }
}

export async function listStudentTiers(req: Request, res: Response) {
  try {
    const { student_id } = req.query;
    const where: any = {};
    if (student_id) {
      where.student_id = student_id;
    }

    const tiers = await MTSS_Student_Tiers.findAll({ where });
    res.json(tiers);
  } catch (err) {
    console.error("Error listing MTSS student tiers:", err);
    res.status(500).json({ error: "Failed to list MTSS student tiers" });
  }
}

export async function getStudentTier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tier = await MTSS_Student_Tiers.findByPk(id);
    if (!tier) {
      return res.status(404).json({ error: "MTSS student tier not found" });
    }
    res.json(tier);
  } catch (err) {
    console.error("Error getting MTSS student tier:", err);
    res.status(500).json({ error: "Failed to get MTSS student tier" });
  }
}

export async function updateStudentTier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [updated] = await MTSS_Student_Tiers.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ error: "MTSS student tier not found" });
    }
    const updatedTier = await MTSS_Student_Tiers.findByPk(id);
    res.json(updatedTier);
  } catch (err) {
    console.error("Error updating MTSS student tier:", err);
    res.status(500).json({ error: "Failed to update MTSS student tier" });
  }
}

export async function deleteStudentTier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // Soft delete: set end_date to now
    const [updated] = await MTSS_Student_Tiers.update(
      { end_date: new Date() },
      { where: { id } },
    );

    if (!updated) {
      return res.status(404).json({ error: "MTSS student tier not found" });
    }
    res.status(200).json({ message: "Student tier soft-deleted (ended)" });
  } catch (err) {
    console.error("Error deleting MTSS student tier:", err);
    res.status(500).json({ error: "Failed to delete MTSS student tier" });
  }
}
