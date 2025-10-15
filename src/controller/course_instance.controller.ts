import { Request, Response } from "express"
import { Op } from "sequelize"
import { Course_Instance } from "../models/course/course_instance.model"
import { Course_Catalog } from "../models/course/course_catalog.model"
import { Program_Catalog } from "../models/program/program_catalog.model"
import { CTE_School } from "../models/school/cte_school.model"
import { School_Year } from "../models/term/school_year.model"
import { Term } from "../models/term/term.model"
import { Staff } from "../models/staff.model"
import { Enrollment } from "../models/enrollment.model"
import { Student } from "../models/student.model"
import { WBL_Students } from "../models/wbl/wbl_students.model"
import { StudentFlag } from "../models/flags/student_flags.model"
import { Flag } from "../models/flags/flag.model"

// GET /course-instances
// Query params: schoolId, programCatalogId, courseCatalogId, schoolYearId, termId, from, to
export async function listCourseInstances(req: Request, res: Response) {
    try {
        const { schoolId, programCatalogId, courseCatalogId, schoolYearId } = req.query as any
        const where: any = {}
        if (schoolId) where.cte_school_id = schoolId
        if (programCatalogId) where.district_program_id = programCatalogId
        if (courseCatalogId) where.course_catalog_id = courseCatalogId
        if (schoolYearId) where.school_year_id = schoolYearId

        const results = await Course_Instance.findAll({
            where,
            include: [
                { model: Course_Catalog, as: "course_catalog" },
                { model: Program_Catalog, as: "program_catalog" },
                { model: School_Year, as: "school_year" },
                { model: Staff, as: "instructor" },
            ],
            order: [["id", "ASC"]],
        })

        res.json(results)
    } catch (err) {
        console.error("Error listing course instances", err)
        res.status(500).json({ error: "Failed to list course instances" })
    }
}

// GET /course-instances/:id
export async function getCourseInstance(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Course_Instance.findByPk(id, {
            include: [
                { model: Course_Catalog, as: "course_catalog" },
                { model: Program_Catalog, as: "program_catalog" },
                { model: CTE_School, as: "cte_school" },
            ],
        })

        if (!record) return res.status(404).json({ error: "Not found" })
        res.json(record)
    } catch (err) {
        console.error("Error retrieving course instance", err)
        res.status(500).json({ error: "Failed to retrieve course instance" })
    }
}

// POST /course-instances
export async function createCourseInstance(req: Request, res: Response) {
    try {
        const { cte_school_id, program_catalog_id, course_catalog_id, instructorId, alias } =
            req.body

        const created = await Course_Instance.create({
            cte_school_id,
            district_program_id: program_catalog_id,
            course_catalog_id,
            instructorId,
            alias,
            // start_date: start_date ? new Date(start_date) : undefined, end_date: end_date ? new Date(end_date) : undefined,
        })

        res.status(201).json(created)
    } catch (err) {
        console.error("Error creating course instance", err)
        res.status(500).json({ error: "Failed to create course instance" })
    }
}

// PUT /course-instances/:id
export async function updateCourseInstance(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Course_Instance.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        const {
            cte_school_id,
            program_catalog_id,
            course_catalog_id,
            instructorId,
            start_date,
            end_date,
        } = req.body

        await record.update({
            cte_school_id: cte_school_id ?? record.cte_school_id,
            district_program_id: program_catalog_id ?? record.district_program_id,
            course_catalog_id: course_catalog_id ?? record.course_catalog_id,
            instructorId: instructorId ?? record.instructorId,
            start_date: start_date !== undefined ? new Date(start_date) : record.start_date,
            end_date: end_date !== undefined ? new Date(end_date) : record.end_date,
        })

        res.json(record)
    } catch (err) {
        console.error("Error updating course instance", err)
        res.status(500).json({ error: "Failed to update course instance" })
    }
}

// DELETE /course-instances/:id
export async function deleteCourseInstance(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        const record = await Course_Instance.findByPk(id)
        if (!record) return res.status(404).json({ error: "Not found" })

        await record.destroy()
        res.status(204).send()
    } catch (err) {
        console.error("Error deleting course instance", err)
        res.status(500).json({ error: "Failed to delete course instance" })
    }
}

//stats

export async function getCourseStats(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" })

        type EnrollmentWithStudent = Enrollment & {
            student: Student & {
                student_flags: Array<StudentFlag & { Flag: Flag }>
            }
        }

        type CourseInstanceWithRelations = Course_Instance & {
            enrollments: EnrollmentWithStudent[]
            school_year: School_Year
        }

        const records = (await Course_Instance.findAll({
            where: { course_catalog_id: id },
            include: [
                {
                    model: Enrollment,
                    as: "enrollments",
                    include: [
                        {
                            model: Student,
                            as: "student", // Assuming association name; adjust if different
                            attributes: ["grade", "gender", "age"], // Include flags; add more attributes as needed
                            include: [
                                {
                                    model: StudentFlag,
                                    as: "student_flags", // Assuming association name; adjust if different
                                    association: "flags",
                                    include: [
                                        {
                                            model: Flag,
                                            as: "Flag",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { model: School_Year, as: "school_year" }, // Include year for "each year" context
            ],
            order: [
                ["school_year_id", "ASC"],
                ["id", "ASC"],
            ], // Order by year and instance
        })) as CourseInstanceWithRelations[]

        let _records: any[] = []

        records.forEach((record) => {
            let year = record.school_year_id
            let totalEnrollments = record.enrollments.length
            let genderCounts: Record<string, number> = {}
            let gradeCounts: any = {}
            let ageCounts: any = {}
            let flagCounts: any = {}
            record.enrollments.forEach((enrollment) => {
                let student = enrollment.student

                //gender count
                const genderKey = student.gender ?? "Unknown"
                genderCounts[genderKey] = (genderCounts[genderKey] || 0) + 1

                // grade count
                const gradeKey = (student.grade ?? "Unknown") as any
                gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1

                // age count
                const ageKey = (student.age ?? "Unknown") as any
                ageCounts[ageKey] = (ageCounts[ageKey] || 0) + 1

                // flag count
                if (Array.isArray(student.student_flags)) {
                    for (const sf of student.student_flags) {
                        const f = sf.Flag as any
                        const flagKey = (f?.label ?? f?.name ?? f?.id ?? "Unknown") as any
                        flagCounts[flagKey] = (flagCounts[flagKey] || 0) + 1
                    }
                }
            })
            _records.push({
                year: record.school_year?.label || "Unknown",
                totalEnrollments,
                genderCounts,
                gradeCounts,
                ageCounts,
                flagCounts,
            })
        })

        res.status(200).json(_records)
    } catch (err) {
        console.error("Error get course instance", err)
        res.status(500).json({ error: "Failed to get course instance stats" })
    }
}
