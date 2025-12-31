import { Request, Response } from "express"
import { Student } from "../../models/student.model"
import { Enrollment } from "../../models/enrollment.model"
import { Student_Term_Grades } from "../../models/gradebook/student_term_grades.model"
import { Course_Instance } from "../../models/course/course_instance.model"
import { Task } from "../../models/term/task.model"

export const getStudentGrades = async (req: Request, res: Response) => {
    try {
        const { studentId, classId, courseId } = req.query

        const studentWhere: any = {}
        if (studentId) {
            studentWhere.id = studentId
        }

        const enrollmentWhere: any = {}
        if (classId) {
            enrollmentWhere.course_instance_id = classId
        }

        const courseInstanceWhere: any = {}
        if (courseId) {
            courseInstanceWhere.course_catalog_id = courseId
        }

        const students = await Student.findAll({
            where: studentWhere,
            include: [
                {
                    model: Enrollment,
                    as: "enrollments",
                    where: Object.keys(enrollmentWhere).length ? enrollmentWhere : undefined,
                    required: !!(classId || courseId),
                    include: [
                        {
                            model: Student_Term_Grades,
                            as: "student_term_grades",
                            include: [
                                {
                                    model: Task,
                                    as: "task",
                                },
                            ],
                        },
                        {
                            model: Course_Instance,
                            as: "course_instance",
                            where: Object.keys(courseInstanceWhere).length
                                ? courseInstanceWhere
                                : undefined,
                            required: !!courseId,
                        },
                    ],
                },
            ],
        })
        res.status(200).json(students)
    } catch (error: any) {
        console.error("Error fetching student grades:", error)
        res.status(500).json({ error: error.message })
    }
}
